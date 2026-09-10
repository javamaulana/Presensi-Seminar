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

let files = [], emails = [], rows = [], mailFails = false, driveFails = false, sheetFails = false;
const sheet = {
  getLastRow: () => rows.length + 1,
  getRange: (r, c) => ({
    getValues: () => rows.map(row => [row[2]]),
    setValues: values => {
      if (sheetFails) throw Error('Sheet unavailable');
      rows[r - 2] ||= [];
      values[0].forEach((v, i) => rows[r - 2][c - 1 + i] = v);
    },
  }),
};
const backend = vm.createContext({
  console: { error() {} },
  PropertiesService: { getScriptProperties: () => ({ getProperty: () => null }) },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  SpreadsheetApp: { flush() {}, getActiveSpreadsheet: () => ({ getSheetByName: () => sheet }) },
  DriveApp: { getFolderById: () => { if (driveFails) throw Error('Drive unavailable'); const remaining = [...files]; return { getFiles: () => ({ hasNext: () => remaining.length > 0, next: () => remaining.shift() }) }; } },
  MailApp: { sendEmail: email => { assert.ok(rows.length > 0, 'Attendance must exist before email'); if (mailFails) throw Error('Mail failed'); emails.push(email); } },
  ContentService: { MimeType: { JSON: 'json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
});
vm.runInContext(fs.readFileSync('apps-script/Code.gs', 'utf8'), backend);
const submit = institution => backend.doPost({ postData: { contents: JSON.stringify({ fullName: 'Mutiara Aviva', studentId: '2410432045', email: 'test@example.com', institution }) } });
assert.equal(submit('Umum').status, 'pending');
assert.equal(rows[0][8], 'Menunggu sertifikat');
assert.equal(emails.length, 1);
files = [{ getName: () => 'Mutiara Aviva.pdf', getUrl: () => 'https://example.com/certificate', getBlob: () => 'PDF' }];
assert.equal(submit('Umum').status, 'sent');
assert.equal(emails[1].attachments[0], 'PDF');
assert.equal(rows[1][8], 'Terkirim');
assert.equal(rows[0][8], 'Menunggu sertifikat');
assert.equal(rows.length, 2);
files = [];
assert.equal(submit('Kelas A').status, 'pending');
mailFails = true;
assert.equal(submit('Umum').status, 'pending_error');
assert.equal(rows[0][8], 'Menunggu sertifikat');
driveFails = true;
assert.equal(submit('Kelas A').status, 'pending_error');
assert.equal(rows[4][4], 'Kelas A');
driveFails = false;
files = [{ getName: () => 'Mutiara Aviva.pdf', getUrl: () => 'url', getBlob: () => 'PDF' }];
assert.equal(submit('Umum').status, 'review');
assert.equal(rows[5][8], 'Perlu cek pengiriman');
const previousRows = JSON.stringify(rows);
for (const [fullName, studentId] of [['Peserta Kedua', '222'], ['Peserta Ketiga', '333']]) {
  const result = backend.doPost({ postData: { contents: JSON.stringify({ fullName, studentId, email: 'test@example.com', institution: 'Umum' }) } });
  assert.equal(result.ok, true);
}
assert.equal(rows.length, 8);
assert.equal(JSON.stringify(rows.slice(0, 6)), previousRows);
assert.equal(rows[6][1], 'Peserta Kedua');
assert.equal(rows[7][1], 'Peserta Ketiga');
assert.equal(rows[6][2], rows[7][2]);
mailFails = false;
const certificate = name => ({ getName: () => name, getUrl: () => 'url/' + name, getBlob: () => name });
files = ['Sertifikat - Mutiara Aviva (Panitia).pdf', 'Sertifikat - Mutiara Aviva (Peserta).pdf', 'Sertifikat - Mutiara Aviva (Pengisi Acara).pdf', 'Sertifikat - Mutiara Aviva Putri.pdf'].map(certificate);
const beforeEmails = emails.length;
assert.equal(submit('Umum').status, 'sent');
assert.equal(emails.length, beforeEmails + 1);
assert.equal(emails.at(-1).attachments.length, 3);
assert.equal(rows.at(-1)[6].split('\n').length, 3);
assert.equal(rows.at(-1)[7].split('\n').length, 3);
files = ['Sertifikat - Muhammad Arifin Ilham (Peserta).pdf', 'Sertifikat - Muhammad Arifin Ilham (Umum).pdf'].map(certificate);
assert.equal(backend.findCertificateFiles_({ fullName: 'Muhammad Arifin Ilham', institution: 'Umum' })[0].getName(), files[1].getName());
assert.equal(backend.findCertificateFiles_({ fullName: 'Muhammad Arifin Ilham', institution: 'Kelas B' }).length, 1);
files = ['Sertifikat - 123 - Java Maulana (Panitia).pdf', 'Sertifikat - 456 - Java Maulana (Peserta).pdf', 'Sertifikat - Java Maulana (Pengisi Acara).pdf'].map(certificate);
assert.equal(backend.findCertificateFiles_({ fullName: 'Java Maulana', studentId: '123' }).length, 2);
sheetFails = true;
assert.equal(submit('Umum').ok, false);
assert.equal(backend.doPost({}).ok, false);
assert.equal(backend.doGet().version, 'multi-certificates-v4');
console.log('PASS: form validation; attendance saved before email; missing files, Drive failure, mail failure, Sheet failure, and invalid requests. No real emails sent.');
