const CONFIG = {
  appsScriptUrl: "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",
  eventName: "Seminar Kewirausahaan",
};

const PARTICIPANTS = [
  { className: "KBI", name: "Java Maulana", nim: "2410431021" },
  { className: "KBI", name: "Naila Farizka Azzahra", nim: "2410431016" },
  { className: "KBI", name: "Meisya Putri Jenicka", nim: "2410431011" },
  { className: "KBI", name: "Nailul Athiyyah", nim: "2410432046" },
  { className: "KBI", name: "Desy Fadilla", nim: "2410432038" },
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
  { className: "Kelas B", name: "Wahyu andani", nim: "2410432004" },
  { className: "Kelas B", name: "Nadya putri", nim: "2410432008" },
  { className: "Kelas B", name: "Alfiyya Az Zahra", nim: "2410432018" },
  { className: "Kelas B", name: "Ade Suryani", nim: "2410432028" },
  { className: "Kelas B", name: "Deri Aulia Fitri", nim: "2410432032" },
  { className: "Kelas B", name: "Risya ferlina", nim: "2410432034" },
  { className: "Kelas B", name: "Fidellma islamiati Taufik", nim: "2410432038" },
  { className: "Kelas B", name: "Rahmatul Dea putri", nim: "2410432042" },
  { className: "Kelas B", name: "Muqadis khairy yusran", nim: "2410433002" },
  { className: "Kelas B", name: "Fioni Gusriani Putri", nim: "2410433004" },
  { className: "Kelas B", name: "Dody Alfayed", nim: "2210433032" },
  { className: "Kelas B", name: "Gusmaiti atifah", nim: "2310433012" },
  { className: "Kelas B", name: "Muhhamad hasbi ahzani", nim: "2110432038" },
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
  { className: "Kelas C", name: "Dwiana Syaputri", nim: "2410432027" },
  { className: "Kelas C", name: "Pujhi Ramadina", nim: "2410433017" },
  { className: "Kelas C", name: "Hezvin Ariqah", nim: "2410431007" },
  { className: "Kelas C", name: "Gezika Awefa Jenyverhoguen", nim: "2410432005" },
  { className: "Kelas C", name: "Desmariza", nim: "2410432035" },
  { className: "Kelas C", name: "Lijien Putri", nim: "2410432026" },
  { className: "Kelas C", name: "Sarah Azzahra", nim: "2410431017" },
  { className: "Kelas C", name: "Lisa Anggraini", nim: "2410432037" },
  { className: "Kelas C", name: "Zuhriansyah Abdillah", nim: "2310432020" },
  { className: "Kelas C", name: "Rani Susilawati", nim: "2310431016" },
  { className: "Kelas C", name: "Hesty Amelia", nim: "2410432007" },
  { className: "Kelas C", name: "Sovia Darma Bakti", nim: "2410432036" },
  { className: "Kelas C", name: "Shalma Toyibah", nim: "2410432047" },
  { className: "Kelas C", name: "Shusan Berliana", nim: "2410431025" },
  { className: "Kelas C", name: "Rahma Defia", nim: "2410433010" },
  { className: "Kelas C", name: "Nurkamila", nim: "2410432015" },
  { className: "Kelas C", name: "Aisyah Zahradiva", nim: "2410432010" },
  { className: "Kelas C", name: "Nabila Fiolita", nim: "2410432040" },
  { className: "Kelas C", name: "Jeanita Ayu Lestari", nim: "2410433007" },
  { className: "Kelas C", name: "Jeane Alvince Dwi Sari Zai", nim: "2410431040" },
  { className: "Kelas C", name: "Yazid Riyanda Putra", nim: "2410431005" },
  { className: "Kelas A", name: "M. Akbar Putra P. Asaki", nim: "2410432023" },
  { className: "Kelas A", name: "Dicky Rivaldi Kurniawan", nim: "2410432031" },
  { className: "Kelas A", name: "Nur Azizah", nim: "2410432011" },
  { className: "Kelas A", name: "Rosa Anggraini", nim: "2410431033" },
  { className: "Kelas A", name: "Siti Hafizhah Nayla Yunardi", nim: "2410431009" },
  { className: "Kelas A", name: "Mutiara Hasanah", nim: "2410431023" },
  { className: "Kelas A", name: "Marcella Septiani", nim: "2410432019" },
  { className: "Kelas A", name: "Khanaya Hummaira Kamlau", nim: "2410432013" },
  { className: "Kelas A", name: "Chelsea Naila Fiorenza", nim: "2410433013" },
  { className: "Kelas A", name: "Geshia Dwintan", nim: "241043102029" },
  { className: "Kelas A", name: "Zahra Adelia Fitri N", nim: "2410433001" },
  { className: "Kelas A", name: "Kheisya Chayara Romeyza", nim: "2410433009" },
  { className: "Kelas A", name: "Lala Abdillah Batubara", nim: "2410431031" },
  { className: "Kelas A", name: "Zazkia Avris Yaumi", nim: "2410431039" },
  { className: "Kelas A", name: "Melda Afrilia", nim: "2410432041" },
  { className: "Kelas A", name: "Aysi Fitria Ramadani", nim: "2410431013" },
  { className: "Kelas A", name: "Afsi Salma", nim: "2410432033" },
  { className: "Kelas A", name: "Zahra Tanzila Ilham", nim: "2410432021" },
  { className: "Kelas A", name: "Shalsya Adina Marsya", nim: "2410432009" },
  { className: "Kelas A", name: "Raditya Irawan", nim: "2410432003" },
  { className: "Kelas A", name: "Sari Ramadani", nim: "2410431029" },
  { className: "Kelas A", name: "Rifqa Humaira Zumarnis", nim: "2410431001" },
  { className: "Kelas A", name: "Aulya Rizky Ramadani", nim: "2410432039" },
  { className: "Kelas A", name: "Lexania Nazila", nim: "2410431019" },
  { className: "Kelas A", name: "Mufli Diash Putra", nim: "2410432001" },
];

const form = document.querySelector("#attendanceForm");
const classSelect = document.querySelector("#className");
const nameSelect = document.querySelector("#fullName");
const studentIdInput = document.querySelector("#studentId");
const statusEl = document.querySelector("#formStatus");
const submitButton = form.querySelector("button[type='submit']");

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

function getFormPayload() {
  const formData = new FormData(form);
  const participant = getSelectedParticipant();

  return {
    fullName: participant?.name || String(formData.get("fullName") || "").trim(),
    email: String(formData.get("email") || "").trim().toLowerCase(),
    studentId: participant?.nim || String(formData.get("studentId") || "").trim(),
    institution: String(formData.get("institution") || "").trim(),
    eventName: CONFIG.eventName,
    submittedAt: new Date().toISOString(),
  };
}

function validatePayload(payload) {
  if (CONFIG.appsScriptUrl.includes("PASTE_GOOGLE_APPS_SCRIPT")) {
    return "URL Google Apps Script belum dipasang.";
  }

  if (!classSelect.value) {
    return "Pilih kelas terlebih dahulu.";
  }

  if (!getSelectedParticipant()) {
    return "Pilih nama peserta.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return "Email belum valid.";
  }

  return "";
}

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

  const payload = getFormPayload();
  const validationMessage = validatePayload(payload);

  if (validationMessage) {
    setStatus(validationMessage, "is-error");
    return;
  }

  submitButton.disabled = true;
  setStatus("Mengirim presensi...");

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
    populateNames("");
    setStatus("Presensi terkirim. Sertifikat akan dikirim ke email.", "is-success");
  } catch (error) {
    setStatus("Gagal mengirim presensi. Coba lagi atau hubungi panitia.", "is-error");
  } finally {
    submitButton.disabled = false;
  }
});

populateClasses();
populateNames("");
