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
- Panitia perlu menindaklanjuti baris **Menunggu sertifikat** dan mengirim sertifikat dalam 1×24 jam. Belum ada penjadwal pengiriman ulang otomatis.

Form memakai request `no-cors`, sehingga halaman tidak dapat membaca hasil backend. Pastikan penerimaan email dan rekap diuji setelah deployment dengan alamat email milik panitia.
