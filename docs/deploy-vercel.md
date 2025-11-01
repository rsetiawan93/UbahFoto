# Panduan Penerapan ke Vercel melalui GitHub

Dokumen ini menjelaskan cara menerapkan aplikasi "Ubah Foto" ke Vercel. Vercel adalah platform ideal untuk proyek ini karena dapat menyajikan file frontend statis sekaligus menjalankan fungsi backend (API Routes) untuk memproses permintaan ke Gemini API secara aman.

## Prasyarat

1.  **Akun GitHub**: Anda memerlukan akun GitHub.
2.  **Repositori GitHub**: Buat repositori baru di GitHub dan unggah (push) semua file proyek "Ubah Foto" ke dalamnya.
3.  **Akun Vercel**: Daftar atau masuk ke [Vercel](https://vercel.com/), Anda bisa mendaftar menggunakan akun GitHub Anda untuk integrasi yang lebih mudah.

## Arsitektur Aplikasi di Vercel

Aplikasi ini memiliki dua bagian utama:
1.  **Frontend**: File-file seperti `index.html`, `index.tsx`, dan semua komponen React. Ini adalah bagian yang dilihat dan diinteraksikan oleh pengguna di browser. Vercel akan menyajikannya sebagai situs statis.
2.  **Backend (API Route)**: Direktori `api/` berisi fungsi serverless (`generate.ts`). Fungsi ini berjalan di server Vercel, bukan di browser pengguna. Tujuannya adalah untuk menerima permintaan dari frontend dan secara aman menggunakan `API_KEY` Anda untuk berkomunikasi dengan Google Gemini API. Ini melindungi kunci API Anda agar tidak terekspos.

## Langkah-langkah Penerapan

### 1. Unggah Kode ke GitHub

Pastikan semua file dan direktori proyek Anda (`index.html`, `index.tsx`, `api/`, `package.json`, dll.) telah diunggah ke repositori GitHub Anda.

### 2. Impor Proyek ke Vercel

a. **Login ke Dasbor Vercel**: Buka [dasbor Vercel](https://vercel.com/dashboard).

b. **Tambah Proyek Baru**: Klik tombol "Add New..." dan pilih "Project".

c. **Impor dari Git**: Temukan repositori GitHub "Ubah Foto" Anda dan klik tombol "Import" di sebelahnya.
   *   Jika ini pertama kalinya, Anda mungkin perlu menginstal aplikasi Vercel di GitHub dan memberikan izin akses ke repositori Anda.

### 3. Konfigurasi Proyek

Setelah mengimpor, Vercel akan membawa Anda ke halaman konfigurasi.

a. **Framework Preset**: Vercel akan secara otomatis mendeteksi ini sebagai proyek "Other". **Ini adalah pengaturan yang benar**, jadi biarkan saja.

b. **Build and Output Settings**: Anda bisa membiarkan pengaturan ini kosong. Vercel cukup pintar untuk:
    *   Mendeteksi `package.json` dan secara otomatis menjalankan `npm install` untuk menginstal dependensi yang dibutuhkan oleh API Route Anda.
    *   Mendeteksi direktori `api` dan membangunnya menjadi serverless functions.
    *   Menyajikan semua file lainnya sebagai konten statis.
    Jadi, Anda tidak perlu mengisi **Build Command** atau **Output Directory**.

c. **Environment Variables (Paling Penting!)**: Di sinilah Anda akan menempatkan kunci API Gemini Anda dengan aman.
    *   Buka bagian "Environment Variables".
    *   Tambahkan variabel baru dengan:
        *   **Name**: `API_KEY`
        *   **Value**: Masukkan kunci API Gemini Anda di sini.
    *   Klik "Add".

### 4. Terapkan (Deploy)

Setelah semua konfigurasi selesai, klik tombol **"Deploy"**.

Vercel akan memulai proses penerapan. Ini mungkin memakan waktu satu atau dua menit karena perlu menginstal dependensi dan membangun API route. Setelah selesai, Anda akan mendapatkan URL publik (misalnya, `ubah-foto.vercel.app`).

Selamat! Aplikasi "Ubah Foto" Anda sekarang sudah live di Vercel, dengan frontend yang cepat dan backend yang aman. Setiap kali Anda melakukan `push` perubahan baru ke branch utama di GitHub, Vercel akan secara otomatis men-deploy ulang aplikasi Anda.
