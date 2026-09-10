const CONFIG = {
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbwNNR9xNnX9ElpySas9aWtxC8BeYQSHQnkuYS0LpTIn_J7Fb8W_VPMS_cgkX21iSdlbug/exec",
  eventName: "Seminar Kewirausahaan",
};

const PARTICIPANTS = [
  // Kelas A
  { className: "Kelas A", name: "M. Akbar Putra P. Asaki", nim: "2410432023" },
  { className: "Kelas A", name: "Dicky Rivaldi Kurniawan", nim: "2410432031" },
  { className: "Kelas A", name: "Nur Azizah", nim: "2410432011" },
  { className: "Kelas A", name: "Rosa Anggraini", nim: "2410431033" },
  { className: "Kelas A", name: "Siti Hafizhah Nayla Yunardi", nim: "2410431009" },
  { className: "Kelas A", name: "Mutiara Hasanah", nim: "2410431023" },
  { className: "Kelas A", name: "Marcella Septiani", nim: "2410432019" },
  { className: "Kelas A", name: "Khanaya Hummaira Kamlau", nim: "2410432013" },
  { className: "Kelas A", name: "Chelsea Naila Fiorenza", nim: "2410433013" },
  { className: "Kelas A", name: "Geshia Dwintan", nim: "2410432029" },
  { className: "Kelas A", name: "Zahra Adelia Fitri N", nim: "2410433001" },
  { className: "Kelas A", name: "Kheisya Chayara Romeyza", nim: "2410433011" },
  { className: "Kelas A", name: "Lala Abdillah Batubara", nim: "2410431031" },
  { className: "Kelas A", name: "Zazkia Avris Yaumi", nim: "2410431039" },
  { className: "Kelas A", name: "Melda Afrilia", nim: "2410432041" },
  { className: "Kelas A", name: "Aysi Fitria Ramadhani", nim: "2410431013" },
  { className: "Kelas A", name: "Afsi Salma", nim: "2410432033" },
  { className: "Kelas A", name: "Zahra Tanzila Ilham", nim: "2410432021" },
  { className: "Kelas A", name: "Shalsya Adina Marsya", nim: "2410432009" },
  { className: "Kelas A", name: "Raditya Irawan", nim: "2410432003" },
  { className: "Kelas A", name: "Sari Ramadani", nim: "2410431029" },
  { className: "Kelas A", name: "Rifqa Humaira Zumarnis", nim: "2410431001" },
  { className: "Kelas A", name: "Aulya Rizky Ramadani", nim: "2410432039" },
  { className: "Kelas A", name: "Lexania Nazila", nim: "2410431019" },
  { className: "Kelas A", name: "Mufli Diash Putra", nim: "2410432001" },
  // Kelas B
  { className: "Kelas B", name: "Ghefira Rhoudotul Jannah", nim: "2410431002" },
  { className: "Kelas B", name: "Nazla Rhaudatul Asfiyah", nim: "2410431004" },
  { className: "Kelas B", name: "Muhammad Arifin Ilham", nim: "2410431008" },
  { className: "Kelas B", name: "Maisyarah", nim: "2410431012" },
  { className: "Kelas B", name: "Chantyka Dwi Asrina", nim: "2410431022" },
  { className: "Kelas B", name: "Lidea Andini Fitri", nim: "2410431024" },
  { className: "Kelas B", name: "Anggya Fadhilla", nim: "2410431028" },
  { className: "Kelas B", name: "Gibran Ramadhan", nim: "2410431032" },
  { className: "Kelas B", name: "Dinda Rahma Mulyana", nim: "2410431034" },
  { className: "Kelas B", name: "Miftahul Fariz Pratama", nim: "2410432002" },
  { className: "Kelas B", name: "Wahyu Andani", nim: "2410432004" },
  { className: "Kelas B", name: "Nadya Putri", nim: "2410432008" },
  { className: "Kelas B", name: "Alfiyya Az Zahra", nim: "2410432018" },
  { className: "Kelas B", name: "Ade Suryani", nim: "2410432028" },
  { className: "Kelas B", name: "Deri Aulia Fitri", nim: "2410432032" },
  { className: "Kelas B", name: "Risya Ferlina", nim: "2410432034" },
  { className: "Kelas B", name: "Fidellma Islamiati Taufik", nim: "2410432038" },
  { className: "Kelas B", name: "Rahmatul Dea Putri", nim: "2410432042" },
  { className: "Kelas B", name: "Muqadis Khairy Yusran", nim: "2410433002" },
  { className: "Kelas B", name: "Fioni Gusriani Putri", nim: "2410433004" },
  { className: "Kelas B", name: "Dody Alfayed", nim: "2210433032" },
  { className: "Kelas B", name: "Gusmaiti Atifah", nim: "2310433012" },
  { className: "Kelas B", name: "Muhhamad Hasbi Ahzani", nim: "2110432038" },
  // Kelas C
  { className: "Kelas C", name: "Ade Irma Wulandari", nim: "2410432025" },
  { className: "Kelas C", name: "Amanda Putri Pratama", nim: "2410431037" },
  { className: "Kelas C", name: "Asyifa Putri Maharani", nim: "2410431030" },
  { className: "Kelas C", name: "Ayunda Shalsa Nabila", nim: "2410431010" },
  { className: "Kelas C", name: "Aprioca Hayati Alis", nim: "2410432020" },
  { className: "Kelas C", name: "Bima Niskala Lisyanda", nim: "2410433015" },
  { className: "Kelas C", name: "Danda Ahmad Dzaky", nim: "2410432030" },
  { className: "Kelas C", name: "M. Ishlah Rantisi", nim: "2410433005" },
  { className: "Kelas C", name: "M. Sultan Dandi Pratama", nim: "2410432016" },
  { className: "Kelas C", name: "Fauzi Taufiqur Rahman", nim: "2410431036" },
  { className: "Kelas C", name: "Rivaldo Marsel Liam", nim: "2410431026" },
  { className: "Kelas C", name: "Sami Aulia Putri", nim: "2410431020" },
  { className: "Kelas C", name: "Dwiana Syahputri", nim: "2410432027" },
  { className: "Kelas C", name: "Pujhi Ramadhina", nim: "2410433017" },
  { className: "Kelas C", name: "Hezvin Ariqah", nim: "2410431007" },
  { className: "Kelas C", name: "Gezika Awefa Jenyverhoguen", nim: "2410432005" },
  { className: "Kelas C", name: "Desmariza", nim: "2410432035" },
  { className: "Kelas C", name: "Lijien Putri", nim: "2410432026" },
  { className: "Kelas C", name: "Sarah Azzahra", nim: "2410431017" },
  { className: "Kelas C", name: "Lisa Anggraini", nim: "2410432037" },
  { className: "Kelas C", name: "Zuhriansyah Abdillah", nim: "2310432020" },
  { className: "Kelas C", name: "Rani Susilawati", nim: "2310431016" },
  { className: "Kelas C", name: "Hesty Amelia Putri", nim: "2410432007" },
  { className: "Kelas C", name: "Sovia Darma Bakti", nim: "2410432036" },
  { className: "Kelas C", name: "Shalma Thoyibah", nim: "2410432047" },
  { className: "Kelas C", name: "Shusan Berliana Putri", nim: "2410431025" },
  { className: "Kelas C", name: "Rahma Defia", nim: "2410433010" },
  { className: "Kelas C", name: "Nurkamila", nim: "2410432015" },
  { className: "Kelas C", name: "Aisyah Zahradiva", nim: "2410432010" },
  { className: "Kelas C", name: "Nabila Fiolita", nim: "2410432040" },
  { className: "Kelas C", name: "Jeanita Ayu Lestari", nim: "2410433007" },
  { className: "Kelas C", name: "Jeane Alvince Dwi Sari Zai", nim: "2410431040" },
  { className: "Kelas C", name: "Yazid Riyanda Putra", nim: "2410431005" },
  // KBI
  { className: "KBI", name: "Java Maulana", nim: "2410431021" },
  { className: "KBI", name: "Naila Farizka Azzahra", nim: "2410431016" },
  { className: "KBI", name: "Meisya Putri Jenicka", nim: "2410431011" },
  { className: "KBI", name: "Nailul Athiyyah", nim: "2410432046" },
  { className: "KBI", name: "Desy Fadilla", nim: "2410431038" },
];

// Peserta pendaftaran yang menjawab "Tidak" pada pertanyaan mata kuliah kewirausahaan.
const GENERAL_PARTICIPANTS = [
  { name: "Mutiara Aviva", nim: "2410432045" },
  { name: "Muhammad Arifin Ilham", nim: "2610432004" },
  { name: "Siti Maha Rani Binti H.Yusmardi", nim: "2420432003" },
  { name: "Hilda Salimna Ramadhani", nim: "2510432042" },
];

// DOM Elements
const form = document.querySelector("#attendanceForm");
const participantTypeSelect = document.querySelector("#participantType");
const mahasiswaSection = document.querySelector("#mahasiswaSection");
const umumSection = document.querySelector("#umumSection");
const umumNameSelect = document.querySelector("#umumName");
const classSelect = document.querySelector("#className");
const nameSelect = document.querySelector("#fullName");
const studentIdInput = document.querySelector("#studentId");
const nameManualInput = document.querySelector("#nameManual");
const nimManualInput = document.querySelector("#nimManual");
const emailInput = document.querySelector("#email");
const certInfoBox = document.querySelector("#certInfoBox");
const certInfoText = document.querySelector("#certInfoText");
const statusEl = document.querySelector("#formStatus");
const submitButton = form.querySelector("button[type='submit']");
const DEVICE_KEY = "semkwu26.browser-id";
const SUBMITTED_KEY = "semkwu26.submitted";
let submissionLocked = false;

function lockSubmission() {
  submissionLocked = true;
  submitButton.disabled = true;
  submitButton.textContent = "Presensi sudah diisi";
  try { localStorage.setItem(SUBMITTED_KEY, "1"); } catch { /* Server still checks the browser ID. */ }
}

async function sendAttendance(payload) {
  // Retrying uses the same ID: the backend rejects an already saved submission.
  const body = JSON.stringify(payload);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await fetch(CONFIG.appsScriptUrl, {
        method: "POST",
        mode: "cors",
        credentials: "omit",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body,
      });
    } catch (error) {
      if (!(error instanceof TypeError)) throw error;
      if (attempt === 0) {
        setStatus("Koneksi terputus. Mencoba menghubungkan kembali...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      throw new Error("Browser tidak menerima respons Google setelah dua percobaan. Periksa rekap melalui panitia terlebih dahulu. Jika belum tercatat, buka situs ini langsung di Chrome/Safari (bukan browser dalam WhatsApp/Instagram) dan coba jaringan lain. Jangan hapus data browser agar batas satu kali tetap berlaku.");
    }
  }
}

function getDeviceId() {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!/^[a-f0-9]{32}$/.test(id || "")) {
      id = Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, "0")).join("");
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    throw new Error("Izinkan penyimpanan browser agar batas satu kali presensi dapat diterapkan, lalu coba lagi.");
  }
}

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

function createOption(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function populateClasses() {
  const classes = [...new Set(PARTICIPANTS.map((participant) => participant.className))];
  classes.forEach((className) => {
    classSelect.append(createOption(className, className));
  });
}

function populateNames(className) {
  nameSelect.replaceChildren(createOption("", className ? "Pilih nama" : "Pilih kelas dulu"));
  studentIdInput.value = "";
  nameSelect.disabled = !className;

  PARTICIPANTS
    .filter((participant) => participant.className === className)
    .forEach((participant) => {
      nameSelect.append(createOption(participant.name, participant.name));
    });
}

function getSelectedParticipant() {
  return PARTICIPANTS.find((participant) => {
    return participant.className === classSelect.value && participant.name === nameSelect.value;
  });
}

function handleGeneralParticipantChange() {
  const isGeneral = participantTypeSelect.value === "umum";
  const isManual = isGeneral && umumNameSelect.value === "manual";
  const participant = GENERAL_PARTICIPANTS.find(p => p.nim === umumNameSelect.value);
  umumNameSelect.disabled = !isGeneral;
  umumNameSelect.required = isGeneral;
  nameManualInput.disabled = !isGeneral || (!isManual && !participant);
  nimManualInput.disabled = nameManualInput.disabled;
  nameManualInput.readOnly = !isManual;
  nimManualInput.readOnly = !isManual;
  nameManualInput.required = isManual;
  nimManualInput.required = isManual;
  nameManualInput.value = participant?.name || "";
  nimManualInput.value = participant?.nim || "";
  setStatus("");
}

function handleParticipantTypeChange() {
  const selectedType = participantTypeSelect.value;
  
  // Hide/show sections
  mahasiswaSection.style.display = selectedType === "mahasiswa" ? "block" : "none";
  umumSection.style.display = selectedType === "umum" ? "block" : "none";

  // Hidden category fields must not participate in browser validation.
  classSelect.disabled = selectedType !== "mahasiswa";
  nameSelect.disabled = selectedType !== "mahasiswa" || !classSelect.value;
  studentIdInput.disabled = selectedType !== "mahasiswa";
  nameManualInput.disabled = selectedType !== "umum";
  nimManualInput.disabled = selectedType !== "umum";
  nameManualInput.required = selectedType === "umum";
  nimManualInput.required = selectedType === "umum";
  
  // Show info box only for umum participants
  if (selectedType === "umum") {
    certInfoBox.style.display = "block";
    certInfoText.textContent = "Jika sertifikat tersedia, kami akan langsung mengirimkannya ke email Anda. Jika belum tersedia, kami akan mengirim email pemberitahuan bahwa sertifikat akan dikirim dalam waktu 1×24 jam.";
  } else {
    certInfoBox.style.display = "none";
  }
  
  // Reset form fields
  if (selectedType !== "mahasiswa") {
    classSelect.value = "";
    nameSelect.value = "";
    studentIdInput.value = "";
    nameSelect.disabled = true;
  }
  
  if (selectedType !== "umum") {
    nameManualInput.value = "";
    nimManualInput.value = "";
  }
  
  emailInput.value = "";
  umumNameSelect.value = "";
  handleGeneralParticipantChange();
  setStatus("");
}

function getFormPayload() {
  const selectedType = participantTypeSelect.value;
  
  let fullName, nim;
  
  if (selectedType === "mahasiswa") {
    const participant = getSelectedParticipant();
    fullName = participant?.name || "";
    nim = participant?.nim || "";
  } else if (selectedType === "umum") {
    fullName = String(nameManualInput.value).trim();
    nim = String(nimManualInput.value).trim();
  }
  
  return {
    fullName,
    email: String(emailInput.value || "").trim().toLowerCase(),
    studentId: nim,
    institution: selectedType === "mahasiswa" ? String(classSelect.value || "").trim() : "Umum",
    eventName: CONFIG.eventName,
    submittedAt: new Date().toISOString(),
  };
}

function validatePayload(payload) {
  const selectedType = participantTypeSelect.value;
  
  if (CONFIG.appsScriptUrl.includes("PASTE_GOOGLE_APPS_SCRIPT")) {
    return "URL Google Apps Script belum dipasang.";
  }

  if (!selectedType) {
    return "Pilih kategori peserta terlebih dahulu.";
  }

  if (selectedType === "mahasiswa") {
    if (!classSelect.value) {
      return "Pilih kelas terlebih dahulu.";
    }
    if (!getSelectedParticipant()) {
      return "Pilih nama peserta.";
    }
  } else if (selectedType === "umum") {
    if (!umumNameSelect.value) {
      return "Pilih nama peserta atau pilihan isi manual.";
    }
    if (!nameManualInput.value.trim()) {
      return "Masukkan nama Anda.";
    }
    if (!nimManualInput.value.trim()) {
      return "Masukkan NIM atau no. identitas.";
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return "Email belum valid.";
  }

  return "";
}

// Event Listeners
umumNameSelect.addEventListener("change", handleGeneralParticipantChange);
participantTypeSelect.addEventListener("change", () => {
  handleParticipantTypeChange();
});

classSelect.addEventListener("change", () => {
  populateNames(classSelect.value);
  setStatus("");
});

nameSelect.addEventListener("change", () => {
  const participant = getSelectedParticipant();
  studentIdInput.value = participant?.nim || "";
  setStatus("");
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (submissionLocked || submitButton.disabled) return;

  const payload = getFormPayload();
  const validationMessage = validatePayload(payload);

  if (validationMessage) {
    setStatus(validationMessage, "is-error");
    return;
  }

  submitButton.disabled = true;
  setStatus("Mengirim presensi...");

  try {
    if (localStorage.getItem(SUBMITTED_KEY) === "1") {
      lockSubmission();
      setStatus("Perangkat/browser ini sudah mengirim presensi. Hubungi panitia untuk koreksi.", "is-error");
      return;
    }
    payload.deviceId = getDeviceId();
    const response = await sendAttendance(payload);

    if (!response.ok) {
      const guidance = response.status === 401 || response.status === 403
        ? "Akses Web app ditolak. Panitia perlu mengatur akses deployment menjadi Anyone."
        : response.status === 404
          ? "URL deployment tidak ditemukan. Panitia perlu memperbarui URL Web app."
          : response.status === 429
            ? "Server sedang membatasi permintaan. Periksa rekap sebelum mencoba lagi nanti."
            : "Server Google gagal merespons. Periksa rekap sebelum mencoba lagi dan sampaikan kode ini kepada panitia.";
      throw new Error(`HTTP ${response.status}. ${guidance}`);
    }
    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error("Respons bukan data presensi. Panitia perlu memeriksa URL dan akses deployment Web app.");
    }
    if (!result || typeof result !== "object") {
      throw new Error("Respons backend tidak valid. Hubungi panitia.");
    }
    if (!result.ok) {
      if (result.code === "DEVICE_ALREADY_SUBMITTED") lockSubmission();
      throw new Error(result.message || "Presensi gagal disimpan.");
    }
    const messages = {
      sent: "Presensi tersimpan. Sertifikat telah dikirim ke email Anda.",
      pending: "Presensi tersimpan. Email pemberitahuan telah dikirim; sertifikat menyusul dalam 1x24 jam.",
      pending_error: "Presensi tersimpan, tetapi sertifikat atau email belum dapat diproses. Hubungi panitia.",
      review: "Presensi tersimpan. Pengiriman sertifikat perlu diperiksa panitia. Tidak perlu mengisi ulang.",
    };
    const successMessage = messages[result.status];
    if (!successMessage) throw new Error("Backend belum sesuai. Panitia perlu memperbarui deployment Apps Script.");
    lockSubmission();

    form.reset();
    participantTypeSelect.value = "";
    handleParticipantTypeChange();
    setStatus(successMessage, "is-success");
  } catch (error) {
    setStatus("Belum ada konfirmasi penyimpanan. " + (error instanceof TypeError ? "Koneksi atau akses Apps Script bermasalah. Hubungi panitia untuk memeriksa rekap sebelum mencoba lagi." : error.message), "is-error");
  } finally {
    submitButton.disabled = submissionLocked;
  }
});

populateClasses();
GENERAL_PARTICIPANTS.forEach(participant => {
  umumNameSelect.append(createOption(participant.nim, participant.name));
});
umumNameSelect.append(createOption("manual", "Nama tidak ada di daftar — isi manual"));
populateNames("");
handleParticipantTypeChange();
try {
  if (localStorage.getItem(SUBMITTED_KEY) === "1") {
    lockSubmission();
    setStatus("Perangkat/browser ini sudah mengirim presensi. Pengisian hanya diperbolehkan satu kali. Hubungi panitia untuk koreksi.");
  }
} catch { /* Explain storage requirements when the participant submits. */ }
