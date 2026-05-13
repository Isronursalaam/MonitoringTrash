
# 🗑️ Monitoring Trash AI - Smart Waste Management


**Monitoring Trash** adalah platform pemantauan sampah cerdas berbasis AI yang dirancang untuk mengoptimalkan pengelolaan limbah secara real-time. Dibangun dengan teknologi web terbaru dan dukungan aplikasi mobile (Android).

## ✨ Fitur Utama

- **🤖 AI-Powered Analysis**: Menggunakan Google Gemini & Groq SDK untuk menganalisis data sampah secara cerdas.
- **📱 Mobile Ready**: Tersedia dalam format Android APK menggunakan Capacitor.
- **⚡ Real-time Monitoring**: Integrasi Firebase untuk pembaruan data secara instan.
- **🎨 Modern UI/UX**: Tampilan premium dengan Tailwind CSS dan animasi halus dari Framer Motion.
- **📊 Dashboard Interaktif**: Visualisasi data sampah yang mudah dipahami.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Mobile**: Capacitor (Cross-platform Android/iOS)
- **Backend/DB**: Firebase, Express
- **AI Integration**: Google Generative AI, Groq SDK
- **Icons & Animations**: Lucide React, Framer Motion

## 🚀 Cara Menjalankan

### 1. Kloning Repositori
```bash
git clone https://github.com/username-kamu/monitoring-trash.git
cd monitoring-trash
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment
Buat file `.env` di root folder dan masukkan API Key kamu:
```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_FIREBASE_CONFIG=your_config_here
```

### 4. Jalankan di Local (Web)
```bash
npm run dev
```
Buka `http://localhost:3000` di browser Anda.

## 📱 Build untuk Android (APK)

Jika Anda ingin mengubah proyek ini menjadi aplikasi Android kembali:

1. **Build Web**: `npm run build`
2. **Sinkronisasi**: `npx cap sync`
3. **Buka Android Studio**: `npx cap open android`
4. Di Android Studio, pilih **Build > Build APK(s)**.

## 📝 Kontribusi
Kontribusi selalu terbuka! Silakan lakukan *fork* repositori ini dan buat *pull request* untuk fitur-fitur baru.

---
Dibuat dengan ❤️ untuk lingkungan yang lebih bersih.
```

Semoga bermanfaat untuk profil GitHub kamu! Ada bagian yang ingin ditambah atau dikurangi?
