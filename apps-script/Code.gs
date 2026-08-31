const CONFIG = {
  SHEET_NAME: "Presensi",
  EVENT_NAME: "Seminar Kewirausahaan",
  ORGANIZER_NAME: "Panitia Seminar Kewirausahaan",
  CERTIFICATE_FOLDER_ID: "PASTE_DRIVE_FOLDER_ID_THAT_CONTAINS_CANVA_CERTIFICATES_HERE",
  EMAIL_SUBJECT: "Sertifikat Seminar Kewirausahaan",
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    const payload = parsePayload_(e);
    validatePayload_(payload);

    const sheet = getSheet_();
    const existingRow = findExistingEmailRow_(sheet, payload.email);
    const certificateFile = findCertificateFile_(payload);

    if (existingRow) {
      sheet.getRange(existingRow, 1, 1, 9).setValues([[
        new Date(),
        payload.fullName,
        payload.email,
        payload.studentId,
        payload.institution,
        payload.eventName || CONFIG.EVENT_NAME,
        certificateFile.getName(),
        certificateFile.getUrl(),
        "Dikirim ulang",
      ]]);
    } else {
      sheet.appendRow([
        new Date(),
        payload.fullName,
        payload.email,
        payload.studentId,
        payload.institution,
        payload.eventName || CONFIG.EVENT_NAME,
        certificateFile.getName(),
        certificateFile.getUrl(),
        "Terkirim",
      ]);
    }

    sendCertificateEmail_(payload, certificateFile);
    return json_({ ok: true, certificateUrl: certificateFile.getUrl() });
  } catch (error) {
    return json_({ ok: false, message: error.message });
  } finally {
    lock.releaseLock();
  }
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
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
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
    throw new Error(`Sertifikat atas nama ${payload.fullName} belum ditemukan di folder Drive.`);
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

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
