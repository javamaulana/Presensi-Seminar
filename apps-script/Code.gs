const CONFIG = {
  SHEET_NAME: "Presensi",
  EVENT_NAME: "Seminar Kewirausahaan",
  ORGANIZER_NAME: "Panitia Seminar Kewirausahaan",
  CERTIFICATE_FOLDER_ID: "PASTE_DRIVE_FOLDER_ID_THAT_CONTAINS_CANVA_CERTIFICATES_HERE",
  EMAIL_SUBJECT: "Sertifikat Seminar Kewirausahaan",
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  let locked = false;
  try {
    lock.waitLock(15000);
    locked = true;
    const payload = parsePayload_(e);
    validatePayload_(payload);
    const sheet = getSheet_();
    const existingRow = findExistingEmailRow_(sheet, payload.email);
    const rowNumber = existingRow || sheet.getLastRow() + 1;
    const row = [new Date(), payload.fullName, payload.email, payload.studentId,
      payload.institution, payload.eventName || CONFIG.EVENT_NAME, "", "", "Menunggu sertifikat"];
    sheet.getRange(rowNumber, 1, 1, 9).setValues([row]);
    SpreadsheetApp.flush();

    // Attendance is durable before any Drive or email operation.
    let sending = false;
    try {
      const certificateFile = findCertificateFile_(payload);
      if (!certificateFile) {
        sendPendingCertificateEmail_(payload);
        return json_({ ok: true, status: "pending" });
      }
      const resultRange = sheet.getRange(rowNumber, 7, 1, 3);
      resultRange.setValues([[certificateFile.getName(), certificateFile.getUrl(), "Perlu cek pengiriman"]]);
      SpreadsheetApp.flush();
      sending = true;
      sendCertificateEmail_(payload, certificateFile);
      resultRange.setValues([[certificateFile.getName(), certificateFile.getUrl(), existingRow ? "Dikirim ulang" : "Terkirim"]]);
      SpreadsheetApp.flush();
      return json_({ ok: true, status: "sent" });
    } catch (error) {
      console.error(`Presensi baris ${rowNumber} tersimpan; sertifikat gagal: ${error.message}`);
      return json_({ ok: true, status: sending ? "review" : "pending_error" });
    }
  } catch (error) {
    console.error(error.message);
    return json_({ ok: false, message: "Presensi belum dapat dikonfirmasi tersimpan. Hubungi panitia untuk memeriksa konfigurasi dan log Apps Script." });
  } finally {
    if (locked) lock.releaseLock();
  }
}

// Run from the editor to configure attendance independently of Drive/email.
function setupAttendance() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error("Buka Apps Script dari Google Sheet rekap presensi.");
  PropertiesService.getScriptProperties().setProperty("ATTENDANCE_SPREADSHEET_ID", spreadsheet.getId());
  getSheet_();
  console.log("Rekap presensi: " + spreadsheet.getUrl());
}

function doGet() {
  return json_({ ok: true, version: "attendance-first-v2" });
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Payload kosong.");
  }

  return JSON.parse(e.postData.contents);
}

function validatePayload_(payload) {
  if (!payload.fullName || payload.fullName.trim().length < 3) {
    throw new Error("Nama lengkap tidak valid.");
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    throw new Error("Email tidak valid.");
  }
}

function getSheet_() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty("ATTENDANCE_SPREADSHEET_ID");
  const spreadsheet = spreadsheetId
    ? SpreadsheetApp.openById(spreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error("Jalankan setupAttendance dari editor Apps Script terlebih dahulu.");
  let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Waktu Presensi",
      "Nama Lengkap",
      "Email",
      "NIM / Identitas",
      "Instansi / Kelas",
      "Acara",
      "File Sertifikat",
      "Link Sertifikat",
      "Status",
    ]);
  }

  return sheet;
}

function findExistingEmailRow_(sheet, email) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  const values = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
  const target = String(email).toLowerCase();

  for (let index = 0; index < values.length; index += 1) {
    if (String(values[index][0]).toLowerCase() === target) {
      return index + 2;
    }
  }

  return 0;
}

function findCertificateFile_(payload) {
  const folder = DriveApp.getFolderById(CONFIG.CERTIFICATE_FOLDER_ID);
  const files = folder.getFiles();
  const normalizedName = normalizeText_(payload.fullName);
  const normalizedStudentId = normalizeText_(payload.studentId || "");
  const matches = [];

  while (files.hasNext()) {
    const file = files.next();
    const fileName = normalizeText_(removeExtension_(file.getName()));

    if (fileName.includes(normalizedName)) {
      matches.push(file);
    }
  }

  if (matches.length === 0) {
    return null;
  }

  if (matches.length === 1 || !normalizedStudentId || normalizedStudentId === "-") {
    return matches[0];
  }

  const studentIdMatch = matches.find((file) => {
    return normalizeText_(file.getName()).includes(normalizedStudentId);
  });

  return studentIdMatch || matches[0];
}

function normalizeText_(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function removeExtension_(fileName) {
  return String(fileName).replace(/\.[^/.]+$/, "");
}

function sendCertificateEmail_(payload, certificateFile) {
  const body = [
    `Halo ${payload.fullName},`,
    "",
    `Terima kasih sudah mengikuti ${payload.eventName || CONFIG.EVENT_NAME}.`,
    `Sertifikat kamu terlampir dalam email ini.`,
    "",
    `Salam,`,
    CONFIG.ORGANIZER_NAME,
  ].join("\n");

  MailApp.sendEmail({
    to: payload.email,
    subject: CONFIG.EMAIL_SUBJECT,
    body,
    attachments: [certificateFile.getBlob()],
    name: CONFIG.ORGANIZER_NAME,
  });
}

function sendPendingCertificateEmail_(payload) {
  MailApp.sendEmail({
    to: payload.email,
    subject: "Informasi Sertifikat Seminar Kewirausahaan",
    body: [
      `Halo ${payload.fullName},`,
      "",
      `Terima kasih sudah mengikuti ${payload.eventName || CONFIG.EVENT_NAME}.`,
      "Presensi Anda telah diterima. Sertifikat Anda sedang disiapkan dan akan dikirim ke email ini dalam waktu 1×24 jam.",
      "",
      "Salam,",
      CONFIG.ORGANIZER_NAME,
    ].join("\n"),
    name: CONFIG.ORGANIZER_NAME,
  });
}

function setupAutomaticCertificates() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error("Buka Apps Script dari Google Sheet rekap presensi.");
  DriveApp.getFolderById(CONFIG.CERTIFICATE_FOLDER_ID).getName();
  MailApp.getRemainingDailyQuota();
  PropertiesService.getScriptProperties().setProperty("ATTENDANCE_SPREADSHEET_ID", spreadsheet.getId());
  const handler = "sendPendingCertificates";
  const existing = ScriptApp.getProjectTriggers().filter(trigger => trigger.getHandlerFunction() === handler);
  if (existing.length === 0) ScriptApp.newTrigger(handler).timeBased().everyMinutes(5).create();
}

function sendPendingCertificates() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  const startedAt = Date.now();
  try {
    const sheet = getSheet_();
    if (sheet.getLastRow() < 2) return;
    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).getValues();
    let quota = MailApp.getRemainingDailyQuota();
    for (let index = 0; index < rows.length; index += 1) {
      if (quota < 1 || Date.now() - startedAt > 240000) break;
      const row = rows[index];
      if (row[8] !== "Menunggu sertifikat") continue;
      const payload = {
        fullName: String(row[1]).trim(), email: String(row[2]).trim(),
        studentId: String(row[3]).trim(), institution: String(row[4]).trim(),
        eventName: String(row[5]).trim(),
      };
      try {
        validatePayload_(payload);
        const file = findCertificateFile_(payload);
        if (!file) continue;
        const resultRange = sheet.getRange(index + 2, 7, 1, 3);
        // Interrupted sends require review to avoid duplicate emails.
        resultRange.setValues([[file.getName(), file.getUrl(), "Perlu cek pengiriman"]]);
        SpreadsheetApp.flush();
        sendCertificateEmail_(payload, file);
        quota -= 1;
        resultRange.setValues([[file.getName(), file.getUrl(), "Terkirim otomatis"]]);
        SpreadsheetApp.flush();
      } catch (error) {
        console.error(`Baris ${index + 2}: ${error.message}`);
      }
    }
  } finally {
    lock.releaseLock();
  }
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
