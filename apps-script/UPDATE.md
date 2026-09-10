# Batas satu kali presensi

Versi `one-browser-v5` menambahkan kolom J **ID Browser** tanpa mengubah sembilan kolom rekap sebelumnya. Setiap pengiriman yang diterima tetap menjadi baris baru; ID browser yang sudah tersimpan ditolak sebelum pencatatan atau pengiriman email. Batas berlaku untuk acara ini, termasuk jika nama/email diganti, dan ID diperiksa di bawah script lock agar dua tab tidak membuat dua baris.

Setelah konfirmasi penyimpanan, tombol terkunci dan statusnya disimpan di browser. Jika respons terputus sesudah server mencatat data, pengiriman berikutnya dengan ID yang sama ditolak tanpa email tambahan. Kegagalan sebelum data tersimpan tidak menghabiskan kesempatan mengisi. Antrean sertifikat tetap berjalan untuk baris yang sudah tersimpan.

## Aktivasi

1. Salin `Code.gs` terbaru ke Apps Script dan pertahankan ID folder sertifikat.
2. Simpan dan perbarui deployment lama ke **New version**. URL `/exec` harus menampilkan `one-browser-v5`.
3. Muat ulang website terbaru. Frontend menggunakan penyimpanan browser; peserta harus mengizinkannya.
4. Untuk koreksi data atau pengiriman ulang, panitia menangani baris rekap dan status antrean; peserta tidak perlu membuka kunci atau mengisi ulang.

Batas ini berlaku per browser/profil, bukan identitas HP fisik. Browser lain, mode privat, atau penghapusan penyimpanan dapat melewatinya. Catatan sebelum pembaruan belum memiliki ID browser sehingga tidak dapat dikunci retroaktif. Verifikasi kehadiran tetap diperlukan untuk mencegah titip presensi secara menyeluruh.

---

# Mengaktifkan alur peserta umum

## Beberapa sertifikat dalam satu email

Backend versi `one-browser-v5` melampirkan semua file yang cocok dengan nama peserta dalam satu email, termasuk `(Panitia)`, `(Peserta)`, dan `(Pengisi Acara)`. Berlaku untuk presensi langsung maupun antrean otomatis. Kolom file dan link di rekap memuat semua lampiran, dipisahkan baris baru.

Gunakan nama `Sertifikat - Nama Lengkap (Peran).pdf`, atau `Sertifikat - NIM - Nama Lengkap (Peran).pdf`. Nama harus cocok lengkap; bukan sekadar potongan nama. Jika nama yang sama memiliki varian `(Umum)`, file itu hanya dikirim untuk kategori Umum; varian lainnya untuk mahasiswa. Untuk orang berbeda yang nama dan kategorinya sama, cantumkan NIM pada setiap file agar dapat dibedakan.

Unggah semua sertifikat orang tersebut sebelum diproses. File tambahan yang baru diunggah setelah status terkirim tidak otomatis memicu email baru. Untuk mengirim ulang semua lampiran, ubah satu baris terkait menjadi **Menunggu sertifikat**, lalu jalankan `sendPendingCertificates` atau tunggu pemicu berikutnya.

Salin kode terbaru, pertahankan ID folder aktif, dan perbarui deployment lama ke versi baru. Pemicu yang sudah ada tidak perlu dipasang ulang. PDF sertifikat dan pemetaan lokal tidak dipush ke GitHub.

Frontend memakai empat peserta yang diberikan panitia, yaitu peserta yang menjawab **Tidak** pada pertanyaan mata kuliah kewirausahaan. Daftar `GENERAL_PARTICIPANTS` di `script.js` belum tersinkron otomatis dengan Google Sheet; tambahkan peserta baru di daftar tersebut, atau gunakan pilihan isi manual.

## Pembaruan backend yang wajib dilakukan

1. Buka proyek Apps Script yang melayani URL `CONFIG.appsScriptUrl` di `script.js`.
2. Simpan ID folder sertifikat dari konfigurasi proyek yang sedang aktif.
3. Ganti kode dengan isi `apps-script/Code.gs`, lalu isi `CERTIFICATE_FOLDER_ID` menggunakan ID folder aktif tadi. File lokal masih berisi placeholder.
4. Simpan, lalu pilih **Deploy > Manage deployments > Edit > New version > Deploy** pada deployment Web app yang sudah digunakan. Pertahankan URL deployment yang sama.

Push GitHub hanya memperbarui website; kode Apps Script tidak ikut terdeploy.

## Perilaku email

- Sertifikat ditemukan: email dikirim dengan lampiran sertifikat.
- Sertifikat peserta umum belum ditemukan: email pemberitahuan 1×24 jam dikirim tanpa lampiran, dan rekap diberi status **Menunggu sertifikat**.
- Kesalahan akses folder atau pengiriman email tetap dianggap kegagalan, bukan sertifikat yang belum tersedia.
- Setelah pemicu diaktifkan, sistem memeriksa **Menunggu sertifikat** setiap 5 menit dan mengirim file yang sudah tersedia. Status berubah menjadi **Terkirim otomatis**.

## Aktivasi otomatis satu kali

1. Salin `Code.gs` terbaru ke Apps Script lama, pertahankan ID folder sertifikat, simpan, dan perbarui deployment seperti langkah di atas.
2. Di dropdown fungsi editor Apps Script, pilih **setupAutomaticCertificates**, klik **Run / Jalankan**, dan setujui izin Google menggunakan akun panitia.
3. Di menu **Triggers / Pemicu** (ikon jam), pastikan ada fungsi `sendPendingCertificates` dengan pemicu waktu setiap 5 menit. Pasang dari satu akun panitia saja. Setup ulang pada akun yang sama tidak membuat pemicu tambahan.
4. Upload sertifikat dengan nama file mengandung nama lengkap peserta ke folder yang dikonfigurasi. Peserta harus sudah tercatat dengan status **Menunggu sertifikat**. Tidak perlu mengisi presensi lagi.
5. Tunggu siklus berikutnya, cek email dan status **Terkirim otomatis**. Untuk memproses langsung, jalankan **sendPendingCertificates**; fungsi ini benar-benar mengirim email.

File yang belum tersedia tetap menunggu tanpa email pemberitahuan berulang. Jika kuota email habis, antrean menunggu hingga kuota tersedia. Panitia tetap perlu mengunggah sertifikat tepat waktu; jadwal tidak menjamin waktu pengiriman tepat 5 menit atau 24 jam.

Status **Perlu cek pengiriman** berarti pengiriman telah dimulai tetapi belum dikonfirmasi selesai di rekap, misalnya karena kegagalan email atau proses terputus. Cek menu **Executions / Eksekusi** dan konfirmasi penerimaan email. Jika belum terkirim, ubah status kembali ke **Menunggu sertifikat** agar dicoba lagi. Jika sudah diterima, ubah menjadi **Terkirim otomatis**. Status ini tidak dicoba ulang otomatis untuk menghindari email ganda.

Untuk mematikan otomatisasi, hapus pemicu `sendPendingCertificates` di menu Triggers.

## Jika presensi tidak tercatat

Versi terbaru menyimpan presensi sebelum mengakses Drive atau mengirim email. Kegagalan sertifikat tidak membatalkan pencatatan. Form membaca respons backend; pesan sukses hanya muncul jika backend mengonfirmasi penyimpanan.

1. Salin kode terbaru ke proyek yang melayani URL `CONFIG.appsScriptUrl` di `script.js`, pertahankan ID folder sertifikat yang benar.
2. Jalankan **setupAttendance** dari editor. Fungsi ini menyimpan ID spreadsheet tujuan tanpa bergantung pada akses Drive/email, dan mencetak URL rekap di log. Data masuk ke tab **Presensi**.
3. Perbarui deployment lama: **Deploy > Manage deployments > pensil > New version > Deploy**. Pastikan **Execute as: Me** dan akses **Anyone**. Menyimpan kode saja tidak memperbarui Web app.
4. Buka URL `/exec` deployment di browser. Harus muncul JSON yang memuat `"version":"one-browser-v5"`. Jika muncul `doGet tidak ditemukan` atau halaman login, versi/akses deployment belum sesuai.
5. Uji form menggunakan email panitia dan periksa tab **Presensi**. Jika gagal, buka **Executions**, pilih eksekusi **doPost** dari Web app pada waktu pengujian, lalu baca log error. Menjalankan doPost dengan tombol Run tidak menyertakan data form.
6. Jalankan **setupAutomaticCertificates** setelah ID folder benar untuk mengaktifkan pengiriman berkala.

Jika browser tidak menerima respons (misalnya karena akses deployment atau jaringan), form mempertahankan isian dan tidak mengklaim data tersimpan. Cek rekap sebelum mengulang pengiriman.


## Rekap setiap pengiriman

Setiap formulir yang lolos batas ID browser ditambahkan sebagai baris baru. Email bukan kunci unik: beberapa peserta boleh memakai email yang sama tanpa saling menimpa. Pengisian ulang dari ID browser yang sama ditolak; riwayat yang sudah ada tetap utuh. Pengiriman otomatis hanya memperbarui status dan informasi sertifikat pada baris antrean terkait.

Salin Code.gs terbaru ke Apps Script, pertahankan ID folder yang benar, simpan, lalu perbarui deployment lama ke New version. Buka URL /exec untuk memastikan versi `one-browser-v5` sudah aktif. Pemicu otomatis yang sudah dipasang tidak perlu dibuat ulang.

Baris yang tertimpa versi lama tidak dipulihkan oleh pembaruan ini. Gunakan salinan/cadangan rekap atau riwayat versi Google Sheet untuk mencari data sebelumnya; jangan menimpa seluruh rekap terbaru saat memulihkan data. Beberapa pengisian ulang yang masih menunggu bisa menghasilkan beberapa email sertifikat karena masing-masing merupakan catatan tersendiri.
