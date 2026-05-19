

<div align="center">

# 🗑️ EcoTrack - Monitoring Trash AI
### *Smart Waste Management Platform Powered by Artificial Intelligence*

[![GitHub License](https://img.shields.io/github/license/Isronursalaam/MonitoringTrash?color=blue&style=flat-square)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/Isronursalaam/MonitoringTrash?style=flat-square)](https://github.com/Isronursalaam/MonitoringTrash/stargazers)
[![Platform Android](https://img.shields.io/badge/Platform-Android-green?style=flat-square&logo=android)](https://www.android.com/)

<p align="center">
  <a href="#-fitur-utama">Fitur Utama</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-cara-menjalankan">Cara Menjalankan</a> •
  <a href="#-build-untuk-android-apk">Build Android</a>
</p>

---

## 📱 Download Application

Dapatkan aplikasi mobile **EcoTrack** versi terbaru untuk perangkat Android Anda melalui tautan resmi di bawah ini:

| Platform | Download Link | Version |
| :---: | :---: | :---: |
| **Android (.apk)** | <a href="https://github.com/Isronursalaam/MonitoringTrash/releases/download/v1.0.0/EcoTrack.apk"><img src="https://img.shields.io/badge/GET%20IT%20ON-GitHub-black?style=for-the-badge&logo=github&logoColor=white" height="40"></a> | `v1.0.0 (Latest)` |

</div>

---

## 📝 Tentang Proyek

**EcoTrack (Monitoring Trash AI)** adalah platform pemantauan sampah cerdas berbasis AI yang dirancang untuk mengoptimalkan pengelolaan limbah secara *real-time*. Dibangun menggunakan teknologi web modern, platform ini juga mendukung aplikasi *mobile native* untuk memberikan kemudahan akses di mana saja dan kapan saja.

## ✨ Fitur Utama

* **🤖 Analisis Berbasis AI**: Integrasi cerdas dengan Google Gemini & Groq SDK untuk menganalisis klasifikasi dan data sampah.
* **⚡ Pemantauan Real-time**: Didukung oleh Firebase untuk sinkronisasi data instan tanpa perlu memuat ulang halaman.
* **📱 Mobile Ready**: Dikemas menggunakan Capacitor sehingga menghasilkan aplikasi Android APK yang ringan dan responsif.
* **🎨 UI/UX Modern**: Desain premium menggunakan Tailwind CSS dengan transisi dan animasi halus dari Framer Motion.
* **📊 Dashboard Interaktif**: Visualisasi data statistik volume sampah yang intuitif dan mudah dipahami.

## 🛠️ Tech Stack

Komponen teknologi utama yang digunakan dalam membangun EcoTrack:

| Komponen | Teknologi Yang Digunakan |
| :--- | :--- |
| **Frontend Core** | React 19, Vite, Tailwind CSS |
| **Mobile Wrapper** | Capacitor (Cross-platform Android/iOS) |
| **Database & Auth** | Firebase (Firestore / Realtime Database), Express |
| **Intelligence Engine**| Google Generative AI (Gemini), Groq SDK |
| **Interactivity** | Lucide React (Icons), Framer Motion (Animations) |

---

## 🚀 Cara Menjalankan (Development)

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

### 1. Kloning Repositori
```bash
git clone [https://github.com/Isronursalaam/MonitoringTrash.git](https://github.com/Isronursalaam/MonitoringTrash.git)
cd MonitoringTrash

```

### 2. Instalasi Dependensi

```bash
npm install

```

### 3. Konfigurasi Environment

Buat file bernama `.env` pada direktori utama (root) proyek Anda, kemudian lengkapi kredensial berikut:

```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_FIREBASE_CONFIG=your_config_here

```

### 4. Jalankan Server Lokal

```bash
npm run dev

```

Setelah berhasil berjalan, buka browser Anda dan akses halaman `http://localhost:5173` (atau port yang tertera pada terminal).

---

## 📱 Build untuk Android (APK)

Jika Anda melakukan modifikasi pada kode sumber dan ingin melakukan *re-build* menjadi aplikasi Android kembali:

1. **Kompilasi Web**:
```bash
npm run build

```


2. **Sinkronisasi Capacitor**:
```bash
npx cap sync

```


3. **Buka Projek di Android Studio**:
```bash
npx cap open android

```


4. Di dalam **Android Studio**, tunggu proses Gradle selesai, lalu pilih menu **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

---

## 🤝 Kontribusi

Kontribusi selalu terbuka untuk pengembangan yang lebih baik! Jika Anda ingin meningkatkan fitur atau memperbaiki *bug*:

1. Lakukan **Fork** pada repositori ini.
2. Buat branch fitur baru (`git checkout -b fitur/FiturKeren`).
3. Lakukan **Commit** perubahan Anda (`git commit -m 'Menambahkan fitur keren'`).
4. **Push** ke branch tersebut (`git push origin fitur/FiturKeren`).
5. Buat **Pull Request** baru.

Dibuat dengan ❤️ untuk lingkungan yang lebih bersih dan berkelanjutan.
