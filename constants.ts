import { type MenuItem, type TutorialStep } from './types';
import { UserIcon, EnhanceIcon, MagicWandIcon, RemoveIcon, CropIcon, GenerateIcon } from './components/icons';

export const HEADSHOT_STYLES = [
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    prompt: 'professional corporate headshot, with the person wearing a business suit, against a blurred office background with blue tones',
    imageUrl: 'https://storage.googleapis.com/aistudio-ux-team-public/ubus/headshot_corporate_blue.png',
  },
  {
    id: 'studio-gray',
    name: 'Studio Gray',
    prompt: 'professional studio headshot with dramatic lighting, against a solid dark gray background',
    imageUrl: 'https://storage.googleapis.com/aistudio-ux-team-public/ubus/headshot_studio_gray.png',
  },
  {
    id: 'outdoor-natural',
    name: 'Outdoor',
    prompt: 'professional outdoor headshot with natural lighting, against a blurred park or nature background',
    imageUrl: 'https://storage.googleapis.com/aistudio-ux-team-public/ubus/headshot_outdoor_natural.png',
  },
  {
    id: 'casual-cafe',
    name: 'Casual Cafe',
    prompt: 'casual and friendly headshot, with the person in smart-casual attire, inside a modern cafe with warm lighting',
    imageUrl: 'https://storage.googleapis.com/aistudio-ux-team-public/ubus/headshot_casual_cafe.png',
  },
  {
    id: 'black-and-white',
    name: 'B&W Classic',
    prompt: 'classic black and white portrait headshot, with strong contrast and a timeless feel',
    imageUrl: 'https://storage.googleapis.com/aistudio-ux-team-public/ubus/headshot_black_and_white.png',
  },
  {
    id: 'vibrant-color',
    name: 'Vibrant Color',
    prompt: 'vibrant and colorful headshot, with the person against a brightly colored wall (e.g., yellow or teal), creative and energetic feel',
    imageUrl: 'https://storage.googleapis.com/aistudio-ux-team-public/ubus/headshot_vibrant_color.png',
  }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    key: 'generate-image',
    label: 'Buat Gambar',
    description: 'Buat gambar baru dari teks',
    icon: GenerateIcon,
  },
  {
    key: 'headshot',
    label: 'Headshot',
    description: 'Buat foto headshot profesional',
    icon: UserIcon,
  },
  {
    key: 'remove-object',
    label: 'Hapus Objek',
    description: 'Hilangkan objek yang tidak diinginkan',
    icon: RemoveIcon,
  },
  {
    key: 'crop',
    label: 'Pangkas Gambar',
    description: 'Potong dan sesuaikan ukuran gambar',
    icon: CropIcon,
  },
  {
    key: 'enhance-quality',
    label: 'Tingkatkan Kualitas',
    description: 'Perbaiki resolusi dan detail foto',
    icon: EnhanceIcon,
  },
  {
    key: 'change-style',
    label: 'Ganti Gaya',
    description: 'Ubah gaya foto menjadi artistik',
    icon: MagicWandIcon,
  },
];

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    targetId: 'app-container',
    title: 'Selamat Datang di Ubah Foto!',
    content: 'Ikuti tur singkat ini untuk mempelajari cara menggunakan kekuatan AI untuk mengedit foto Anda. Klik "Berikutnya" untuk memulai.',
    position: 'center',
  },
  {
    targetId: 'tutorial-sidebar',
    title: '1. Pilih Alat Edit',
    content: 'Mulailah dengan memilih salah satu alat edit yang tersedia di sini. Setiap alat memiliki fungsi unik.',
    position: 'right',
  },
  {
    targetId: 'tutorial-upload',
    title: '2. Unggah Gambar Anda',
    content: 'Selanjutnya, unggah foto yang ingin Anda edit. Cukup klik di sini atau tarik dan lepas file.',
    position: 'bottom',
  },
  {
    targetId: 'tutorial-settings',
    title: '3. Sesuaikan Pengaturan',
    content: 'Setiap alat memiliki pengaturannya sendiri. Sesuaikan opsi di sini untuk mendapatkan hasil yang Anda inginkan.',
    position: 'top',
  },
  {
    targetId: 'tutorial-generate-button',
    title: '4. Hasilkan Gambar',
    content: 'Setelah semuanya siap, klik tombol ini untuk membiarkan AI melakukan keajaibannya.',
    position: 'top',
  },
  {
    targetId: 'tutorial-preview',
    title: '5. Lihat dan Unduh',
    content: 'Hasil Anda akan muncul di sini. Anda dapat melihat pratinjau dan mengunduhnya ke perangkat Anda.',
    position: 'left',
  },
  {
    targetId: 'tutorial-help-button',
    title: 'Selesai!',
    content: 'Anda sekarang siap untuk berkreasi! Jika Anda membutuhkan tur ini lagi, cukup klik tombol bantuan ini.',
    position: 'top',
  }
];