# Panduan Penerapan ke Google Cloud Run

**Catatan Penting:** Struktur aplikasi ini telah dioptimalkan untuk platform serverless seperti Vercel yang dapat menjalankan fungsi backend (API routes) secara otomatis dari direktori `/api`. Panduan di bawah ini adalah untuk versi aplikasi yang lebih lama yang hanya menyajikan file statis dengan Nginx.

Untuk menerapkan versi aplikasi saat ini ke Google Cloud Run, Anda perlu mengganti pendekatan Nginx. Sebagai gantinya, Anda harus membuat server Node.js (misalnya, menggunakan framework seperti Express.js) yang dapat melakukan dua hal:
1. Menyajikan file-file frontend statis (seperti `index.html`, dll.).
2. Menangani endpoint backend `/api/generate` untuk berkomunikasi dengan Gemini API.

Ini memerlukan `Dockerfile` yang berbeda yang menginstal dependensi Node.js dari `package.json`, meng-compile TypeScript ke JavaScript (jika diperlukan), dan menjalankan server Node.js Anda. Proses ini lebih kompleks dibandingkan panduan asli di bawah ini.

---

## (Panduan Lama) Menerapkan Versi Statis dengan Nginx

Dokumen ini menjelaskan langkah-langkah untuk menerapkan aplikasi "Ubah Foto" **versi statis-saja** ke Google Cloud Run. Cloud Run sangat ideal untuk menjalankan aplikasi dalam kontainer, jadi kita akan mengemas aplikasi statis kita ke dalam gambar Docker menggunakan server web Nginx.

## Prasyarat

Sebelum memulai, pastikan Anda telah memenuhi persyaratan berikut:
1.  **Google Cloud SDK (gcloud)**: Terinstal dan terkonfigurasi di mesin lokal Anda. [Instal gcloud CLI](https://cloud.google.com/sdk/docs/install).
2.  **Docker**: Terinstal di mesin lokal Anda. [Instal Docker](https://docs.docker.com/get-docker/).
3.  **Proyek Google Cloud**: Proyek Google Cloud dengan penagihan (billing) yang sudah diaktifkan.
4.  **API yang Diaktifkan**: Pastikan API **Cloud Run** dan **Artifact Registry** telah diaktifkan untuk proyek Anda. Anda dapat mengaktifkannya melalui konsol Google Cloud atau menggunakan gcloud:
    ```bash
    gcloud services enable run.googleapis.com artifactregistry.googleapis.com
    ```

## Langkah-langkah Penerapan

### 1. Buat `Dockerfile`

Buat file baru bernama `Dockerfile` (tanpa ekstensi) di direktori root proyek Anda dengan konten berikut:

```Dockerfile
# Gunakan image Nginx resmi sebagai basis
FROM nginx:alpine

# Salin semua file proyek ke direktori default Nginx untuk menyajikan konten statis
# Hapus direktori 'api' karena tidak akan digunakan dalam setup Nginx ini
RUN rm -rf /usr/share/nginx/html/*
COPY . /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/api /usr/share/nginx/html/node_modules /usr/share/nginx/html/package.json /usr/share/nginx/html/package-lock.json /usr/share/nginx/html/tsconfig.json

# Ekspos port 80, port default untuk Nginx
EXPOSE 80

# Perintah untuk menjalankan Nginx saat kontainer dimulai
CMD ["nginx", "-g", "daemon off;"]
```
Dockerfile ini akan membuat sebuah kontainer yang menjalankan server web Nginx dan menyajikan file-file aplikasi Anda.

### 2. (Opsional) Buat file `.dockerignore`
Untuk memastikan file yang tidak perlu tidak disertakan dalam image Docker, buat file `.dockerignore` di root proyek:
```
.git
.gitignore
docs/
node_modules/
api/
```

### 3. Bangun dan Unggah Gambar Docker ke Artifact Registry

Kita akan membangun gambar Docker dan mengunggahnya ke Google Artifact Registry, tempat Cloud Run akan mengambilnya.

a. **Konfigurasi gcloud**: Pastikan gcloud dikonfigurasi dengan proyek dan region yang benar.
   ```bash
   gcloud config set project [PROJECT_ID]
   gcloud config set run/region [REGION]
   # Contoh region: asia-southeast1
   ```
   Ganti `[PROJECT_ID]` dan `[REGION]` dengan ID proyek dan region Google Cloud Anda.

b. **Buat Repositori Artifact Registry**:
   ```bash
   gcloud artifacts repositories create ubah-foto-repo \
     --repository-format=docker \
     --location=[REGION] \
     --description="Repositori Docker untuk aplikasi Ubah Foto"
   ```

c. **Konfigurasi Otentikasi Docker**:
   ```bash
   gcloud auth configure-docker [REGION]-docker.pkg.dev
   ```

d. **Bangun (Build) Gambar Docker**:
   ```bash
   export IMAGE_URI="[REGION]-docker.pkg.dev/[PROJECT_ID]/ubah-foto-repo/ubah-foto:latest"
   docker build -t $IMAGE_URI .
   ```

e. **Unggah (Push) Gambar Docker**:
   ```bash
   docker push $IMAGE_URI
   ```

### 4. Terapkan ke Google Cloud Run

Sekarang gambar Anda sudah ada di Artifact Registry, Anda dapat menerapkannya ke Cloud Run.

```bash
gcloud run deploy ubah-foto-service \
  --image=$IMAGE_URI \
  --platform=managed \
  --region=[REGION] \
  --allow-unauthenticated
```
*   `ubah-foto-service`: Nama layanan Cloud Run Anda.
*   `--image`: Menunjuk ke gambar yang baru saja Anda unggah.
*   `--platform=managed`: Menggunakan infrastruktur serverless yang dikelola sepenuhnya oleh Google.
*   `--allow-unauthenticated`: Membuat aplikasi Anda dapat diakses secara publik.

Setelah perintah ini selesai, gcloud akan memberikan URL layanan Anda. Buka URL tersebut di browser untuk melihat aplikasi "Ubah Foto" Anda berjalan!

## Catatan Penting: API Key Gemini

Karena versi ini tidak memiliki backend, kunci API akan terekspos di sisi klien. Anda **TIDAK BISA** menggunakan environment variable Cloud Run secara langsung di JavaScript frontend. Untuk penggunaan produksi yang aman, sangat disarankan menggunakan arsitektur dengan backend seperti yang telah dioptimalkan untuk Vercel.
