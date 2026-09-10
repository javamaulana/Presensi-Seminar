# Mengaktifkan alur peserta umum

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

Form memakai request `no-cors`, sehingga halaman tidak dapat membaca hasil backend. Pastikan penerimaan email dan rekap diuji setelah deployment dengan alamat email milik panitia.
