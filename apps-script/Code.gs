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
    if (!/^[a-f0-9]{32}$/.test(String(payload.deviceId || ""))) {
      return json_({ ok: false, message: "Identitas browser tidak tersedia. Muat ulang website terbaru dan izinkan penyimpanan browser." });
    }
    const sheet = getSheet_();
    if (sheet.getLastRow() >= 2) {
      const devices = sheet.getRange(2, 10, sheet.getLastRow() - 1, 1).getValues();
      if (devices.some(row => String(row[0]) === payload.deviceId)) {
        return json_({ ok: false, code: "DEVICE_ALREADY_SUBMITTED", message: "Perangkat/browser ini sudah mengirim presensi. Pengisian hanya diperbolehkan satu kali. Hubungi panitia jika perlu koreksi." });
      }
    }
    // Each submission is a new attendance record, even for a shared email.
    const rowNumber = sheet.getLastRow() + 1;
    const row = [new Date(), payload.fullName, payload.email, payload.studentId,
      payload.institution, payload.eventName || CONFIG.EVENT_NAME, "", "", "Menunggu sertifikat", payload.deviceId];
    sheet.getRange(rowNumber, 1, 1, 10).setValues([row]);
    SpreadsheetApp.flush();

    // Attendance is durable before any Drive or email operation.
    let sending = false;
    try {
      const certificateFiles = findCertificateFiles_(payload);
      if (!certificateFiles.length) {
        sendPendingCertificateEmail_(payload);
        return json_({ ok: true, status: "pending" });
      }
      const resultRange = sheet.getRange(rowNumber, 7, 1, 3);
      resultRange.setValues([[certificateFiles.map(file => file.getName()).join("\n"), certificateFiles.map(file => file.getUrl()).join("\n"), "Perlu cek pengiriman"]]);
      SpreadsheetApp.flush();
      sending = true;
      sendCertificateEmail_(payload, certificateFiles);
      resultRange.setValues([[certificateFiles.map(file => file.getName()).join("\n"), certificateFiles.map(file => file.getUrl()).join("\n"), "Terkirim"]]);
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
  return json_({ ok: true, version: "one-browser-v5" });
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
      "ID Browser",
    ]);
  }

  sheet.getRange(1, 10, 1, 1).setValues([["ID Browser"]]);
  return sheet;
}

function findCertificateFiles_(payload) {
  const files = DriveApp.getFolderById(CONFIG.CERTIFICATE_FOLDER_ID).getFiles();
  const targetName = normalizeText_(payload.fullName);
  const targetId = String(payload.studentId || "").trim();
  const matches = [];
  while (files.hasNext()) {
    const file = files.next();
    let name = removeExtension_(file.getName()).trim();
    const roleMatch = name.match(/\s*\((Panitia|Peserta|Pengisi Acara|Umum)\)\s*$/i);
    const role = roleMatch ? roleMatch[1].toLowerCase() : "";
    if (roleMatch) name = name.slice(0, roleMatch.index).trim();
    name = name.replace(/^sertifikat\s*-\s*/i, "");
    const idMatch = name.match(/^(\d+)\s*-\s*/);
    if (idMatch) {
      if (idMatch[1] !== targetId) continue;
      name = name.slice(idMatch[0].length);
    }
    if (normalizeText_(name) === targetName) matches.push({ file, role });
  }
  // Explicit Umum variants distinguish same-name participants across categories.
  const hasGeneralVariant = matches.some(match => match.role === "umum");
  return matches.filter(match => !hasGeneralVariant ||
    (payload.institution === "Umum" ? match.role === "umum" : match.role !== "umum"))
    .map(match => match.file)
    .sort((a, b) => a.getName().localeCompare(b.getName()));
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

function sendCertificateEmail_(payload, certificateFiles) {
  const body = [
    `Halo ${payload.fullName},`,
    "",
    `Terima kasih sudah mengikuti ${payload.eventName || CONFIG.EVENT_NAME}.`,
    `${certificateFiles.length} sertifikat Anda terlampir dalam email ini.`,
    "",
    `Salam,`,
    CONFIG.ORGANIZER_NAME,
  ].join("\n");

  MailApp.sendEmail({
    to: payload.email,
    subject: CONFIG.EMAIL_SUBJECT,
    body,
    attachments: certificateFiles.map(file => file.getBlob()),
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
        const certificateFiles = findCertificateFiles_(payload);
        if (!certificateFiles.length) continue;
        const resultRange = sheet.getRange(index + 2, 7, 1, 3);
        // Interrupted sends require review to avoid duplicate emails.
        resultRange.setValues([[certificateFiles.map(file => file.getName()).join("\n"), certificateFiles.map(file => file.getUrl()).join("\n"), "Perlu cek pengiriman"]]);
        SpreadsheetApp.flush();
        sendCertificateEmail_(payload, certificateFiles);
        quota -= 1;
        resultRange.setValues([[certificateFiles.map(file => file.getName()).join("\n"), certificateFiles.map(file => file.getUrl()).join("\n"), "Terkirim otomatis"]]);
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
