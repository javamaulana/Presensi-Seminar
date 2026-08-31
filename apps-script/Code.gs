const CONFIG = {
  SHEET_NAME: "Presensi",
  EVENT_NAME: "Seminar Kewirausahaan",
  EVENT_DATE: "Sesuaikan tanggal acara",
  ORGANIZER_NAME: "Panitia Seminar Kewirausahaan",
  CERTIFICATE_BACKGROUND_FILE_ID: "PASTE_CANVA_CERTIFICATE_IMAGE_FILE_ID_HERE",
  CERTIFICATE_FOLDER_ID: "PASTE_DRIVE_FOLDER_ID_FOR_CERTIFICATES_HERE",
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
    const certificateNumber = existingRow
      ? sheet.getRange(existingRow, 7).getValue()
      : createCertificateNumber_(sheet);

    const pdfFile = createCertificatePdf_(payload, certificateNumber);

    if (existingRow) {
      sheet.getRange(existingRow, 1, 1, 9).setValues([[
        new Date(),
        payload.fullName,
        payload.email,
        payload.studentId,
        payload.institution,
        payload.eventName || CONFIG.EVENT_NAME,
        certificateNumber,
        pdfFile.getUrl(),
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
        certificateNumber,
        pdfFile.getUrl(),
        "Terkirim",
      ]);
    }

    sendCertificateEmail_(payload, pdfFile, certificateNumber);
    return json_({ ok: true, certificateNumber });
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
      "Nomor Sertifikat",
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

function createCertificateNumber_(sheet) {
  const sequence = Math.max(sheet.getLastRow(), 1);
  return `SKW-${new Date().getFullYear()}-${String(sequence).padStart(4, "0")}`;
}

function createCertificatePdf_(payload, certificateNumber) {
  const backgroundFile = DriveApp.getFileById(CONFIG.CERTIFICATE_BACKGROUND_FILE_ID);
  const backgroundBlob = backgroundFile.getBlob();
  const backgroundBase64 = Utilities.base64Encode(backgroundBlob.getBytes());
  const backgroundMime = backgroundBlob.getContentType();

  const template = HtmlService.createTemplateFromFile("certificate");
  template.fullName = payload.fullName;
  template.eventName = payload.eventName || CONFIG.EVENT_NAME;
  template.eventDate = CONFIG.EVENT_DATE;
  template.certificateNumber = certificateNumber;
  template.backgroundDataUri = `data:${backgroundMime};base64,${backgroundBase64}`;

  const html = template.evaluate().getContent();
  const fileName = `Sertifikat - ${payload.fullName}`.replace(/[\\/:*?"<>|]/g, "");
  const pdfBlob = Utilities
    .newBlob(html, "text/html", `${fileName}.html`)
    .getAs("application/pdf")
    .setName(`${fileName}.pdf`);

  const folder = DriveApp.getFolderById(CONFIG.CERTIFICATE_FOLDER_ID);
  return folder.createFile(pdfBlob);
}

function sendCertificateEmail_(payload, pdfFile, certificateNumber) {
  const body = [
    `Halo ${payload.fullName},`,
    "",
    `Terima kasih sudah mengikuti ${payload.eventName || CONFIG.EVENT_NAME}.`,
    `Sertifikat kamu terlampir dalam email ini.`,
    "",
    `Nomor sertifikat: ${certificateNumber}`,
    "",
    `Salam,`,
    CONFIG.ORGANIZER_NAME,
  ].join("\n");

  MailApp.sendEmail({
    to: payload.email,
    subject: CONFIG.EMAIL_SUBJECT,
    body,
    attachments: [pdfFile.getBlob()],
    name: CONFIG.ORGANIZER_NAME,
  });
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
