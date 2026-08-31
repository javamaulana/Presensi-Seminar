# Web Presensi & Sertifikat Seminar

Web ini dibuat untuk presensi seminar kewirausahaan dengan hosting gratis di Netlify. Data peserta disimpan ke Google Sheet, lalu sertifikat dari Canva yang sudah diunggah ke Google Drive dikirim otomatis ke email memakai Google Apps Script.

## Yang Gratis

- Hosting web: Netlify
- Database sederhana: Google Sheet
- Pengiriman email: Gmail lewat Google Apps Script
- Sertifikat: dibuat massal di Canva Bulk Create, lalu diunggah ke Google Drive

Untuk sekitar 100 peserta, setup ini masih cocok. Agar tidak masuk spam, hindari mengetes berkali-kali ke banyak email dalam waktu sangat singkat.

## Struktur File

- `index.html`: halaman presensi
- `styles.css`: tampilan web
- `script.js`: koneksi form ke Google Apps Script
- `netlify.toml`: konfigurasi hosting Netlify
- `apps-script/Code.gs`: backend Google Apps Script

## Cara Membuat Sertifikat di Canva

1. Siapkan data peserta dalam CSV/Excel/Canva Sheets.
2. Pastikan ada kolom `Nama` dan `Email`. Lebih bagus lagi jika ada `NIM`.
3. Di Canva, buka desain sertifikat.
4. Pakai fitur Bulk Create untuk menghubungkan kolom `Nama` ke teks nama peserta.
5. Generate semua sertifikat.
6. Download sertifikat sebagai PDF/PNG/JPG.
7. Upload semua file sertifikat ke satu folder Google Drive.

Nama file sertifikat harus mengandung nama peserta, misalnya:

```text
Sertifikat - Aulia Rahma Putri.pdf
Sertifikat - Budi Santoso.pdf
```

Kalau ada kemungkinan nama peserta mirip, masukkan NIM juga di nama file:

```text
Sertifikat - 22123456 - Aulia Rahma Putri.pdf
```

## Cara Setup Backend Google

1. Buat Google Sheet baru untuk rekap presensi.
2. Di Google Sheet, buka `Extensions` > `Apps Script`.
3. Salin isi `apps-script/Code.gs` ke file `Code.gs`.
4. Buat folder Google Drive khusus yang berisi semua sertifikat hasil Canva.
5. Isi bagian ini di `Code.gs`:

```js
CERTIFICATE_FOLDER_ID: "ID_FOLDER_SERTIFIKAT_HASIL_CANVA",
ORGANIZER_NAME: "Nama panitia kamu",
```

ID Drive ada di URL file/folder. Contoh URL folder:

```text
https://drive.google.com/drive/folders/INI_ADALAH_ID_FOLDER
```

6. Klik `Deploy` > `New deployment`.
7. Pilih type `Web app`.
8. `Execute as`: `Me`.
9. `Who has access`: `Anyone`.
10. Klik `Deploy`, izinkan akses, lalu salin Web App URL.
11. Tempel URL itu ke `script.js`:

```js
appsScriptUrl: "URL_WEB_APP_DARI_APPS_SCRIPT",
```

## Cara Hosting Gratis di Netlify

Opsi paling rapi adalah tetap menyimpan file di GitHub, lalu Netlify otomatis mengambil dari GitHub.

1. Buat repository GitHub baru, misalnya `sertifikat-seminar`.
2. Upload semua file di folder ini ke repository.
3. Buka Netlify: `https://app.netlify.com/`.
4. Pilih `Add new site` > `Import an existing project`.
5. Pilih GitHub, lalu pilih repository `sertifikat-seminar`.
6. Pada pengaturan deploy:
   - Build command: kosongkan
   - Publish directory: `.`
7. Klik `Deploy`.
8. Setelah selesai, buka `Site configuration` > `Site details` > `Change site name`.
9. Pilih nama domain gratis, misalnya:

```text
seminar-kewirausahaan-2026.netlify.app
```

Netlify gratis memakai format `namasite.netlify.app`. Kalau nama sudah dipakai orang lain, coba variasi seperti `presensi-seminar-kwu`, `sertifikat-kewirausahaan`, atau tambahkan nama kampus/angkatan.

## Alternatif: Upload Langsung ke Netlify

Kalau belum mau memakai GitHub:

1. Buka Netlify.
2. Pilih `Add new site` > `Deploy manually`.
3. Drag seluruh folder proyek ini ke Netlify.
4. Web langsung online.

Cara ini cepat, tapi setiap ada perubahan kamu perlu upload ulang manual. Untuk acara sungguhan, GitHub + Netlify lebih nyaman.

## Menyesuaikan Tampilan

Ubah detail acara di `index.html`, terutama bagian:

- Tanggal
- Lokasi
- Nama seminar
- Kalimat pembuka

Ubah nama acara yang dikirim ke backend di `script.js`:

```js
eventName: "Seminar Kewirausahaan",
```

## Catatan Penting

Form ini sengaja memakai Google Apps Script supaya semua tetap gratis dan aman untuk hosting statis seperti Netlify. Jangan menaruh password Gmail atau token rahasia apa pun di file web, karena file frontend yang online bisa dilihat publik.
# Presensi-Seminar


