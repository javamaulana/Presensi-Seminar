const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
let quota = 10, sent = 0, fail = false, locked = false, triggers = [], savedId;
const row = name => [new Date(), name, 'test@example.com', '123', 'Umum', 'Seminar', '', '', 'Menunggu sertifikat'];
const rows = [row('Peserta Ada'), row('Peserta Belum')];
const sheet = { getLastRow: () => rows.length + 1, getRange: (r, c) => ({
  getValues: () => rows.map(row => [...row]),
  setValues: values => r === 1 ? undefined : values[0].forEach((v, i) => rows[r - 2][c - 1 + i] = v),
}) };
const spreadsheet = { getId: () => 'sheet-id', getSheetByName: () => sheet };
const files = ['Panitia', 'Peserta', 'Pengisi Acara'].map(role => ({ getName: () => `Sertifikat - Peserta Ada (${role}).pdf`, getUrl: () => 'url/' + role, getBlob: () => role }));
const context = vm.createContext({
  console: { error() {} },
  PropertiesService: { getScriptProperties: () => ({ getProperty: () => savedId, setProperty: (_, id) => savedId = id }) },
  SpreadsheetApp: { getActiveSpreadsheet: () => spreadsheet, openById: id => { assert.equal(id, 'sheet-id'); return spreadsheet; }, flush() {} },
  LockService: { getScriptLock: () => ({ tryLock: () => !locked, releaseLock() {} }) },
  MailApp: { getRemainingDailyQuota: () => quota, sendEmail: email => { assert.equal(email.attachments.length, 3); if (fail) throw Error('mail failure'); sent++; } },
  DriveApp: { getFolderById: () => ({ getName: () => 'Certificates', getFiles: () => { const remaining = [...files]; return { hasNext: () => remaining.length > 0, next: () => remaining.shift() }; } }) },
  ScriptApp: { getProjectTriggers: () => triggers, newTrigger: handler => ({ timeBased: () => ({ everyMinutes: n => { assert.equal(n, 5); return { create: () => triggers.push({ getHandlerFunction: () => handler }) }; } }) }) },
});
vm.runInContext(fs.readFileSync('apps-script/Code.gs', 'utf8'), context);
context.setupAutomaticCertificates();
context.setupAutomaticCertificates();
assert.equal(triggers.length, 1);
context.sendPendingCertificates();
assert.equal(sent, 1);
assert.equal(rows[0][8], 'Terkirim otomatis');
assert.equal(rows[1][8], 'Menunggu sertifikat');
context.sendPendingCertificates();
assert.equal(sent, 1);
rows.push(row('Peserta Ada'));
quota = 0;
context.sendPendingCertificates();
assert.equal(rows[2][8], 'Menunggu sertifikat');
quota = 10; locked = true;
context.sendPendingCertificates();
assert.equal(sent, 1);
locked = false; fail = true;
context.sendPendingCertificates();
assert.equal(rows[2][8], 'Perlu cek pengiriman');
fail = false;
context.sendPendingCertificates();
assert.equal(sent, 1);
rows[2][8] = 'Menunggu sertifikat';
context.sendPendingCertificates();
assert.equal(sent, 2);
console.log('PASS: trigger setup, pending queue, missing files, no repeated sends, quota, lock, failed-send review and manual retry. No real emails sent.');
