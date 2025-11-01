# Cara Mendapatkan Kunci API Gemini

Kunci API (API Key) adalah kredensial unik yang digunakan untuk mengautentikasi permintaan ke Google Gemini API. Aplikasi "Ubah Foto" memerlukan kunci ini untuk dapat menggunakan fitur-fitur AI generatif yang canggih.

Panduan ini akan memandu Anda melalui langkah-langkah untuk mendapatkan kunci API Gemini Anda sendiri melalui Google AI Studio.

## Prasyarat

*   Anda memerlukan **Akun Google**.

## Langkah-langkah Mendapatkan Kunci API

### Langkah 1: Kunjungi Google AI Studio

Buka browser web Anda dan navigasikan ke halaman kunci API Google AI Studio:

**[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**

### Langkah 2: Masuk dan Setujui Persyaratan

Anda akan diminta untuk masuk dengan Akun Google Anda. Jika ini adalah pertama kalinya Anda menggunakan Google AI Studio, Anda mungkin perlu membaca dan menyetujui Syarat dan Ketentuan layanan.

### Langkah 3: Buat Kunci API

Setelah masuk, Anda akan diarahkan ke halaman "API keys".

*   Klik tombol **"Create API key"**.

![Create API Key Button](https://storage.googleapis.com/aistudio-ux-team-public/docs_images/get_api_key.png)

### Langkah 4: Salin Kunci API Anda

Sebuah kunci API baru akan segera dibuat dan ditampilkan di layar. Kunci ini adalah serangkaian karakter alfanumerik yang panjang.

*   Klik ikon salin (copy) di sebelah kunci API untuk menyimpannya ke clipboard Anda.

**Contoh Kunci API (Jangan gunakan ini):**
`AIzaSyB..._Fa792_Example_Key_Q5k`

### Langkah 5: Simpan Kunci Anda dengan Aman

Simpan kunci API yang baru saja Anda salin di tempat yang aman, seperti di pengelola kata sandi atau file teks pribadi. Anda akan membutuhkannya untuk langkah penerapan selanjutnya.

## ⚠️ Peringatan Keamanan Penting

*   **JANGAN PERNAH** membagikan kunci API Anda secara publik.
*   **JANGAN PERNAH** memasukkan kunci API Anda langsung ke dalam kode sumber yang akan diunggah ke repositori publik seperti GitHub.
*   Perlakukan kunci API Anda seperti kata sandi. Siapa pun yang memiliki akses ke kunci Anda dapat membuat permintaan API atas nama Anda, yang dapat menyebabkan penggunaan yang tidak diinginkan.

## Langkah Selanjutnya

Sekarang Anda memiliki kunci API Gemini, Anda siap untuk menggunakannya saat menerapkan aplikasi. Ikuti panduan penerapan untuk [Vercel](deploy-vercel.md) atau [Google Cloud Run](deploy-google-cloud-run.md) dan gunakan kunci ini saat diminta untuk mengatur variabel lingkungan (environment variable) `API_KEY`.
