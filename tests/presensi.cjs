const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const elements = {};
const get = id => elements[id] ||= { value: '', style: {}, append() {}, replaceChildren() {}, addEventListener() {}, querySelector: () => get('submit') };
const ui = vm.createContext({ document: { querySelector: get, createElement: () => ({}) } });
vm.runInContext(fs.readFileSync('script.js', 'utf8'), ui);
const run = code => vm.runInContext(code, ui);
run('participantTypeSelect.value = "umum"; handleParticipantTypeChange();');
assert.equal(get('#className').disabled, true);
assert.equal(get('#umumName').required, true);
run('umumNameSelect.value = "2610432004"; handleGeneralParticipantChange(); emailInput.value = "test@example.com";');
assert.equal(run('getFormPayload().studentId'), '2610432004');
assert.equal(run('getFormPayload().fullName'), 'Muhammad Arifin Ilham');
assert.equal(run('validatePayload(getFormPayload())'), '');
assert.equal(get('#nimManual').readOnly, true);
run('umumNameSelect.value = "manual"; handleGeneralParticipantChange();');
assert.equal(get('#nameManual').readOnly, false);
assert.notEqual(run('validatePayload(getFormPayload())'), '');
run('nameManualInput.value = "Peserta Baru"; nimManualInput.value = "12345";');
assert.equal(run('validatePayload(getFormPayload())'), '');
run('participantTypeSelect.value = "mahasiswa"; handleParticipantTypeChange(); classSelect.value = "Kelas A"; populateNames(classSelect.value); nameSelect.value = PARTICIPANTS[0].name; emailInput.value = "test@example.com";');
assert.equal(get('#umumName').disabled, true);
assert.equal(get('#nameManual').disabled, true);
assert.equal(run('validatePayload(getFormPayload())'), '');

let files = [], emails = [], rows = [], existing = false, mailFails = false;
const sheet = { getLastRow: () => existing ? 2 : 1, appendRow: row => rows.push(row), getRange: () => ({ getValues: () => [['test@example.com']], setValues: values => rows.push(...values) }) };
const backend = vm.createContext({
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: () => sheet }) },
  DriveApp: { getFolderById: () => { const remaining = [...files]; return { getFiles: () => ({ hasNext: () => remaining.length > 0, next: () => remaining.shift() }) }; } },
  MailApp: { sendEmail: email => { if (mailFails) throw Error('Mail failed'); emails.push(email); } },
  ContentService: { MimeType: { JSON: 'json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
});
vm.runInContext(fs.readFileSync('apps-script/Code.gs', 'utf8'), backend);
const submit = institution => backend.doPost({ postData: { contents: JSON.stringify({ fullName: 'Mutiara Aviva', studentId: '2410432045', email: 'test@example.com', institution }) } });
assert.equal(submit('Umum').status, 'pending');
assert.equal(emails.length, 1);
assert.equal(emails[0].attachments, undefined);
assert.ok(emails[0].body.includes('24 jam'));
assert.equal(rows[0][8], 'Menunggu sertifikat');
files = [{ getName: () => 'Mutiara Aviva.pdf', getUrl: () => 'https://example.com/certificate', getBlob: () => 'PDF' }];
existing = true;
assert.equal(submit('Umum').status, 'sent');
assert.equal(emails[1].attachments[0], 'PDF');
assert.equal(rows[1][8], 'Dikirim ulang');
files = [];
assert.equal(submit('Kelas A').ok, false);
mailFails = true;
assert.equal(submit('Umum').ok, false);
assert.equal(rows.length, 2);
console.log('PASS: dropdown, manual entry, category switching, certificate email, pending email, repeat attendance, and mail failure. No real emails sent.');
