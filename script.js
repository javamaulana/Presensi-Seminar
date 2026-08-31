const CONFIG = {
  appsScriptUrl: "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",
  eventName: "Seminar Kewirausahaan",
};

const form = document.querySelector("#attendanceForm");
const statusEl = document.querySelector("#formStatus");
const submitButton = form.querySelector("button[type='submit']");

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

function getFormPayload() {
  const formData = new FormData(form);
  return {
    fullName: String(formData.get("fullName") || "").trim(),
    email: String(formData.get("email") || "").trim().toLowerCase(),
    studentId: String(formData.get("studentId") || "").trim(),
    institution: String(formData.get("institution") || "").trim(),
    eventName: CONFIG.eventName,
    submittedAt: new Date().toISOString(),
  };
}

function validatePayload(payload) {
  if (CONFIG.appsScriptUrl.includes("PASTE_GOOGLE_APPS_SCRIPT")) {
    return "URL Google Apps Script belum dipasang di script.js.";
  }

  if (payload.fullName.length < 3) {
    return "Nama lengkap perlu diisi dengan benar.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return "Email belum valid.";
  }

  return "";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = getFormPayload();
  const validationMessage = validatePayload(payload);

  if (validationMessage) {
    setStatus(validationMessage, "is-error");
    return;
  }

  submitButton.disabled = true;
  setStatus("Mengirim presensi dan menyiapkan sertifikat...");

  try {
    await fetch(CONFIG.appsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    form.reset();
    setStatus(
      "Presensi terkirim. Silakan cek email dalam beberapa menit, termasuk folder spam/promosi.",
      "is-success",
    );
  } catch (error) {
    setStatus("Gagal mengirim presensi. Coba lagi atau hubungi panitia.", "is-error");
  } finally {
    submitButton.disabled = false;
  }
});
