# Panduan Penerapan ke Vercel melalui GitHub

Dokumen ini menjelaskan cara menerapkan aplikasi "Ubah Foto" ke Vercel dengan mudah menggunakan repositori GitHub. Vercel adalah platform yang sangat baik untuk hosting aplikasi frontend statis dan terintegrasi secara mulus dengan GitHub.

## Prasyarat

1.  **Akun GitHub**: Anda memerlukan akun GitHub.
2.  **Repositori GitHub**: Buat repositori baru di GitHub dan unggah (push) semua file proyek "Ubah Foto" ke dalamnya.
3.  **Akun Vercel**: Daftar atau masuk ke [Vercel](https://vercel.com/), Anda bisa mendaftar menggunakan akun GitHub Anda untuk integrasi yang lebih mudah.

## Langkah-langkah Penerapan

### 1. Unggah Kode ke GitHub

Pastikan semua file dan direktori proyek Anda (`index.html`, `index.tsx`, `components/`, `types.ts`, dll.) telah diunggah ke repositori GitHub Anda. Struktur file di repositori harus sama dengan struktur di lokal Anda.

### 2. Impor Proyek ke Vercel

a. **Login ke Dasbor Vercel**: Buka [dasbor Vercel](https://vercel.com/dashboard).

b. **Tambah Proyek Baru**: Klik tombol "Add New..." dan pilih "Project".

c. **Impor dari Git**: Anda akan melihat halaman "Import Git Repository". Temukan repositori GitHub "Ubah Foto" Anda dan klik tombol "Import" di sebelahnya.
   *   Jika ini pertama kalinya, Anda mungkin perlu menginstal aplikasi Vercel di GitHub dan memberikan izin akses ke repositori Anda.

### 3. Konfigurasi Proyek

Setelah mengimpor, Vercel akan membawa Anda ke halaman konfigurasi.

a. **Framework Preset**: Vercel mungkin akan mendeteksi proyek ini sebagai "Other" karena tidak ada `package.json` atau konfigurasi build yang spesifik. Pengaturan ini sudah benar.

b. **Build and Output Settings**: Karena aplikasi kita tidak memerlukan langkah build (file disajikan secara statis), Anda dapat membiarkan pengaturan build kosong.
    *   **Build Command**: Biarkan kosong.
    *   **Output Directory**: Biarkan kosong.
    *   **Install Command**: Biarkan kosong.

c. **Environment Variables (Paling Penting!)**: Aplikasi ini memerlukan kunci API Gemini untuk berfungsi.
    *   Buka bagian "Environment Variables".
    *   Tambahkan variabel baru dengan:
        *   **Name**: `API_KEY`
        *   **Value**: Masukkan kunci API Gemini Anda di sini.
    *   Klik "Add".

### 4. Terapkan (Deploy)

Setelah semua konfigurasi selesai, klik tombol **"Deploy"**.

Vercel akan mulai proses penerapan, yang seharusnya sangat cepat. Setelah selesai, Anda akan melihat pratinjau aplikasi Anda dan mendapatkan URL publik (misalnya, `ubah-foto.vercel.app`).

Selamat! Aplikasi "Ubah Foto" Anda sekarang sudah live di Vercel. Setiap kali Anda melakukan `push` perubahan baru ke branch utama (main/master) di GitHub, Vercel akan secara otomatis men-deploy ulang aplikasi Anda dengan pembaruan tersebut.
