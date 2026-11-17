# SUNO SCAM (ScamSuno)

> Your Personal AI Scam Guard — Real-Time Scam, Phishing, Gaming Fraud & Fake Notice Detection for Indian Families.

[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)](https://github.com/devrift/SunoScam)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-green.svg)](https://github.com/devrift/SunoScam)
[![Gemini](https://img.shields.io/badge/Powered%20By-Google%20Gemini-4285F4.svg)](https://aistudio.google.com/)

---

## Overview

**Suno Scam** is an uncompromising anti-fraud Progressive Web App (PWA) built specifically to protect Indian families and elder parents from rapidly spreading cyber frauds:
- **Banking Phishing & KYC Traps**: Fake SBI YONO, HDFC, or ICICI account suspension warnings.
- **Urgent Utility Cut-Offs**: Electricity power cut panic scams at 9:30 PM with personal numbers.
- **Gaming Currency Lures**: Fraudulent BGMI UC giveaways, free skins, and fake tournament rewards designed to capture card credentials.
- **Malicious APK & Binary Side-Loading**: Fake government grants (PM Kisan, Jan Dhan) distributing dangerous Android APK packages.
- **Digital Arrest Threats**: Impersonation of police, customs, or CBI demanding immediate UPI settlements.

---

## Key Features

1. **Direct Gemini 2.5 Flash Engine**:
   - Live AI inference with strict structured JSON schema output (`verdict`, `probability`, `intent`, `redFlags`, `familyReply`).
   - Explicit alert banners when API keys or network status require attention.

2. **Universal Cross-Platform File Upload (PC, Android, iOS, Linux)**:
   - **Screenshots & Documents** (`image/*`, `.pdf`, `.txt`): Sent as base64 inline multimodal vision payload so Gemini directly inspects screenshots of WhatsApp chats, fake SMS, or fraudulent bills.
   - **Executables & Packages** (`.apk`, `.exe`, `.deb`, `.sh`, `.ipa`, `.dmg`): Never executed or unpacked client-side. Inspected via static client metadata (filename, size, extension, MIME) for side-loading malware risks.

3. **Zero-Risk Sandboxed Link Evaluation**:
   - Client-side heuristic parser using native `new URL()`.
   - Never scrapes or exposes client IP to dangerous domains.
   - Flags raw IP hosts, deceptive top-level domains (`.xyz`, `.cc`, `.top`), URL shorteners (`bit.ly`), and credential-harvesting keywords.

4. **Consumer Settings & Preferences**:
   - **Appearance**: Toggle between Charcoal Dark Mode (`#0B0D13`) and Deep Slate (`#161C2C`).
   - **Multi-Language Support**: Choose between **Hinglish**, **English**, and **Hindi** for AI explanations and WhatsApp replies.
   - **Security Sensitivity**: Switch between **Standard** and **Strict** (strictly flags any APK, unverified shortlink, or credential prompt).
   - **Data Privacy**: 1-click button to purge local scan logs from `localStorage`.

5. **PWA & APK v1.0.0 Packaging**:
   - Offline-capable Service Worker, Web App Manifest, and standalone viewport configuration ready for PWA and Android TWA / APK wrapping.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion
- **Icons**: Lucide React (Zero emojis strictly enforced)
- **AI Backend**: Google Generative AI (`gemini-2.5-flash` / `gemini-flash-latest`)
- **PWA**: `vite-plugin-pwa` with Workbox Service Worker
- **Build Tool**: Vite 8

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/devrift/SunoScam.git
cd SunoScam
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure API Key
Create a `.env` file in the project root:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## License

MIT License. Designed with care to keep families safe from digital fraud.
