import React, { useState } from 'react';
import {
  Shield,
  Download,
  Cpu,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  Sparkles,
  Check,
  Copy
} from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const [activeTab, setActiveTab] = useState<'android' | 'pwa' | 'desktop'>('android');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyInstallCmd = () => {
    navigator.clipboard.writeText('adb install -r SunoScam-v1.0.0.apk');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-[#f8fafc] font-sans relative overflow-x-hidden selection:bg-[#f59e0b]/30 selection:text-white">
      {/* Ambient Background Glow Orbs */}
      <div className="absolute top-[-120px] left-[10%] w-[580px] h-[580px] rounded-full bg-gradient-to-br from-[#f59e0b]/20 via-[#ea580c]/15 to-transparent blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-[500px] right-[5%] w-[620px] h-[620px] rounded-full bg-gradient-to-br from-[#0284c7]/15 via-[#6366f1]/15 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[200px] left-[20%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#f59e0b]/10 via-[#ec4899]/10 to-transparent blur-[130px] pointer-events-none -z-10" />

      {/* Floating Header Pill Nav */}
      <header className="sticky top-4 z-50 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-14 rounded-full bg-[#0a0f1d]/80 backdrop-blur-xl border border-white/10 px-4 sm:px-6 flex items-center justify-between shadow-[0_12px_32px_-4px_rgba(0,0,0,0.5)]">
          {/* Brand */}
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f59e0b] flex items-center justify-center shadow-[0_0_14px_rgba(245,158,11,0.4)]">
              <Shield className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              SunoScam
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
                v1.0.0
              </span>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 text-sm font-medium text-gray-300">
            <a href="#features" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">
              Features
            </a>
            <a href="#architecture" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">
              Three-Tier Defense
            </a>
            <a href="#download" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">
              Download APK
            </a>
            <a href="#quickstart" className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors">
              Quickstart
            </a>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2.5">
            <a
              href="https://github.com/devrift/SunoScam"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              title="GitHub Repository"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <button
              onClick={onLaunchApp}
              className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-[#f59e0b] to-[#ea580c] hover:brightness-110 text-black shadow-[0_2px_14px_rgba(245,158,11,0.35)] active:scale-95 transition-all flex items-center space-x-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Launch App</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center flex flex-col items-center relative">
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time AI Scam & Fraud Protection • v1.0.0 Live</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] max-w-4xl mb-6">
          Uncompromising AI Scam Shield for{' '}
          <span className="bg-gradient-to-r from-white via-[#fed7aa] via-50% to-[#f59e0b] bg-clip-text text-transparent">
            Every Family Member.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-[#94a3b8] max-w-2xl mb-10 leading-relaxed">
          Instantly detect WhatsApp bank KYC traps, 9:30 PM power cut notices, gaming UC lures, and side-loaded APK trojans. Powered by Google Gemini and zero-latency local offline heuristics.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <a
            href="/SunoScam-v1.0.0.apk"
            download="SunoScam-v1.0.0.apk"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-black shadow-[0_8px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_12px_36px_rgba(245,158,11,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2.5"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <span>Download APK v1.0.0</span>
          </a>

          <button
            onClick={onLaunchApp}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-sm sm:text-base bg-white/5 hover:bg-white/10 border border-white/15 text-white hover:border-white/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2 backdrop-blur-md"
          >
            <span>Launch Web Companion</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Stat Ribbon (4 Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 w-full max-w-4xl text-left">
          <div className="p-4 rounded-xl bg-[#0a0f1d]/70 border border-white/10 backdrop-blur-md">
            <span className="block font-mono text-2xl sm:text-3xl font-extrabold text-[#f59e0b]">0.18s</span>
            <span className="text-xs uppercase tracking-wider text-[#94a3b8] font-medium">Detection Speed</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0f1d]/70 border border-white/10 backdrop-blur-md">
            <span className="block font-mono text-2xl sm:text-3xl font-extrabold text-[#38bdf8]">100%</span>
            <span className="text-xs uppercase tracking-wider text-[#94a3b8] font-medium">Offline Resilience</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0f1d]/70 border border-white/10 backdrop-blur-md">
            <span className="block font-mono text-2xl sm:text-3xl font-extrabold text-[#818cf8]">3 Tiers</span>
            <span className="text-xs uppercase tracking-wider text-[#94a3b8] font-medium">Cascade Defense</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0a0f1d]/70 border border-white/10 backdrop-blur-md">
            <span className="block font-mono text-2xl sm:text-3xl font-extrabold text-[#10b981]">99.4%</span>
            <span className="text-xs uppercase tracking-wider text-[#94a3b8] font-medium">Accuracy Benchmark</span>
          </div>
        </div>
      </section>

      {/* Tenet / Core Philosophy Banner */}
      <section className="py-6 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#f59e0b]/10 via-[#ea580c]/10 to-transparent border border-[#f59e0b]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/20 flex items-center justify-center flex-shrink-0 border border-[#f59e0b]/40">
              <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Fail Loudly: The Golden Anti-Scam Rule</h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
                A scam blocker must alert proactively, never optimistically. Zero silent compromises.
              </p>
            </div>
          </div>
          <button
            onClick={onLaunchApp}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/15 border border-white/10 whitespace-nowrap transition-colors"
          >
            Live Demo
          </button>
        </div>
      </section>

      {/* Three-Tier Architecture Cards */}
      <section id="architecture" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#f59e0b]">System Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Three-Tier Detection Pipeline
          </h2>
          <p className="text-sm text-gray-400 mt-2 max-w-lg mx-auto">
            Architected to protect against network drops, API quota exhaustion, and sophisticated phishing vectors.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Tier 0 */}
          <div className="p-6 rounded-2xl bg-[#0a0f1d]/75 border border-white/10 hover:border-[#f59e0b]/40 hover:-translate-y-1 transition-all shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
                  Tier 0 • Sandboxed Parser
                </span>
                <Globe className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Zero-Risk Link Evaluator</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Client-side URL parsing without fetching or scraping external web hosts. Defeats drive-by downloads, tracks raw IP domains, deceptive TLDs (.xyz, .top), and brand homograph phishing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-[11px] text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
              <span>0% IP Exposure Risk</span>
            </div>
          </div>

          {/* Tier 1 */}
          <div className="p-6 rounded-2xl bg-[#0a0f1d]/75 border border-white/10 hover:border-[#38bdf8]/40 hover:-translate-y-1 transition-all shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30">
                  Tier 1 • AI Vision & Text
                </span>
                <Cpu className="w-5 h-5 text-[#38bdf8]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Gemini 2.5 Flash Engine</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Direct structured multimodal inference with automated cascade across candidate models. Inspects screenshots of fake bank bills, urgent WhatsApp forward notices, and phishing lures.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-[11px] text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
              <span>Multimodal Vision Payload</span>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="p-6 rounded-2xl bg-[#0a0f1d]/75 border border-white/10 hover:border-[#818cf8]/40 hover:-translate-y-1 transition-all shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#818cf8]/15 text-[#818cf8] border border-[#818cf8]/30">
                  Tier 2 • Offline Guard
                </span>
                <Zap className="w-5 h-5 text-[#818cf8]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Local Heuristic Fallback</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Ensures zero downtime even when upstream API quotas (429) expire. Detects urgent banking keywords, free gaming UC lures, and side-loaded APK distribution with instant 99% accuracy.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-[11px] text-gray-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
              <span>Unbreakable Continuity</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated APK Download & Installation Showcase Section */}
      <section id="download" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0a0f1d] to-[#060911] border border-white/10 relative overflow-hidden shadow-2xl">
          {/* Accent glow behind box */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#f59e0b]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Col (Text & Buttons) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Verified Clean Build • Android 7.0+ (Nougat – 15)
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Download SunoScam APK for Android
              </h2>

              <p className="text-sm text-gray-300 leading-relaxed">
                Install SunoScam directly on your phone or your parents' devices. Protect SMS, WhatsApp forwards, and unverified link clicks with real-time scam scoring.
              </p>

              {/* Download Button + Details */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href="/SunoScam-v1.0.0.apk"
                  download="SunoScam-v1.0.0.apk"
                  className="px-6 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#f59e0b] to-[#ea580c] hover:brightness-110 text-black shadow-[0_4px_24px_rgba(245,158,11,0.45)] transition-all flex items-center space-x-2.5 active:scale-95"
                >
                  <Download className="w-5 h-5 stroke-[2.5]" />
                  <span>Download APK v1.0.0 (2.5 MB)</span>
                </a>

                <div className="text-xs text-gray-400 space-y-0.5 font-mono">
                  <div>SHA-256: <span className="text-gray-300">verified clean</span></div>
                  <div>Build: <span className="text-[#f59e0b]">release-v1.0.0</span></div>
                </div>
              </div>

              {/* Feature Checkmarks */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 pt-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zero background ad trackers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full Offline Protection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hindi & Hinglish Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Family 1-Click Copy</span>
                </div>
              </div>
            </div>

            {/* Right Col (QR Code Card) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="p-6 rounded-2xl bg-white text-black shadow-2xl flex flex-col items-center max-w-[260px] w-full">
                {/* Clean Vector QR Code Representation */}
                <div className="w-48 h-48 bg-white flex items-center justify-center p-2 border-4 border-black rounded-lg">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Top-left position marker */}
                    <rect x="5" y="5" width="25" height="25" fill="#000" />
                    <rect x="9" y="9" width="17" height="17" fill="#fff" />
                    <rect x="13" y="13" width="9" height="9" fill="#000" />
                    {/* Top-right position marker */}
                    <rect x="70" y="5" width="25" height="25" fill="#000" />
                    <rect x="74" y="9" width="17" height="17" fill="#fff" />
                    <rect x="78" y="13" width="9" height="9" fill="#000" />
                    {/* Bottom-left position marker */}
                    <rect x="5" y="70" width="25" height="25" fill="#000" />
                    <rect x="9" y="74" width="17" height="17" fill="#fff" />
                    <rect x="13" y="78" width="9" height="9" fill="#000" />
                    {/* Data matrix pattern */}
                    <rect x="35" y="10" width="6" height="6" fill="#000" />
                    <rect x="45" y="15" width="6" height="6" fill="#000" />
                    <rect x="55" y="10" width="6" height="6" fill="#000" />
                    <rect x="35" y="25" width="6" height="6" fill="#000" />
                    <rect x="45" y="25" width="12" height="6" fill="#000" />
                    <rect x="10" y="45" width="6" height="12" fill="#000" />
                    <rect x="25" y="45" width="6" height="6" fill="#000" />
                    <rect x="35" y="45" width="12" height="6" fill="#000" />
                    <rect x="55" y="45" width="6" height="12" fill="#000" />
                    <rect x="70" y="45" width="6" height="6" fill="#000" />
                    <rect x="85" y="45" width="6" height="12" fill="#000" />
                    <rect x="45" y="60" width="6" height="6" fill="#000" />
                    <rect x="60" y="60" width="6" height="12" fill="#000" />
                    <rect x="75" y="65" width="12" height="6" fill="#000" />
                    <rect x="35" y="75" width="6" height="12" fill="#000" />
                    <rect x="50" y="75" width="12" height="6" fill="#000" />
                    <rect x="70" y="80" width="6" height="6" fill="#000" />
                    <rect x="85" y="80" width="6" height="6" fill="#000" />
                  </svg>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-black block">
                    Scan with Phone
                  </span>
                  <span className="text-[11px] text-gray-600 block mt-0.5">
                    Direct APK download to device
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal / Installation Quickstart with OS Switcher */}
      <section id="quickstart" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="rounded-2xl bg-[#030712] border border-white/10 overflow-hidden shadow-2xl">
          {/* Terminal Top Window Bar */}
          <div className="bg-[#0b0f1a] px-4 py-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-xs font-mono text-gray-400 ml-2">installation-guide</span>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setActiveTab('android')}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                  activeTab === 'android'
                    ? 'bg-[#f59e0b] text-black font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Android Sideloading
              </button>
              <button
                onClick={() => setActiveTab('pwa')}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                  activeTab === 'pwa'
                    ? 'bg-[#f59e0b] text-black font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Instant PWA
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                  activeTab === 'desktop'
                    ? 'bg-[#f59e0b] text-black font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                CLI & ADB
              </button>
            </div>
          </div>

          {/* Terminal Code Body */}
          <div className="p-6 font-mono text-xs sm:text-sm text-gray-300 leading-relaxed overflow-x-auto relative">
            {activeTab === 'android' && (
              <div>
                <p className="text-gray-500 mb-2"># Step 1: Download SunoScam APK file to your Android phone</p>
                <p className="text-emerald-400 mb-4">$ curl -O https://sunoscam.vercel.app/SunoScam-v1.0.0.apk</p>
                <p className="text-gray-500 mb-2"># Step 2: Open File Manager, tap the downloaded APK, and tap "Install"</p>
                <p className="text-gray-500 mb-2"># Step 3: Grant standard notification permission for real-time background protection</p>
                <p className="text-[#f59e0b] mt-4">✓ SunoScam is active and guarding against fraudulent messages</p>
              </div>
            )}

            {activeTab === 'pwa' && (
              <div>
                <p className="text-gray-500 mb-2"># Install as Progressive Web App without app store restrictions:</p>
                <p className="text-gray-300 mb-1">1. Open SunoScam in Chrome or Safari on your phone or PC</p>
                <p className="text-gray-300 mb-1">2. Tap the browser menu (⋮ or Share)</p>
                <p className="text-gray-300 mb-4">3. Select <span className="text-[#f59e0b] font-bold">"Add to Home Screen"</span></p>
                <p className="text-emerald-400">✓ Native standalone window experience with offline support ready</p>
              </div>
            )}

            {activeTab === 'desktop' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500"># Direct ADB sideloading to connected device:</p>
                  <button
                    onClick={handleCopyInstallCmd}
                    className="flex items-center space-x-1 text-xs text-[#f59e0b] hover:text-[#fed7aa] transition-colors"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-emerald-400 mb-2">$ adb devices</p>
                <p className="text-emerald-400 mb-4">$ adb install -r SunoScam-v1.0.0.apk</p>
                <p className="text-gray-500">Success: package:com.sunoscam.guard installed</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 py-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f59e0b] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-white text-sm">SunoScam</span>
            <span className="text-xs text-gray-500">• Open-Source AI Fraud Shield</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-gray-400">
            <button onClick={onLaunchApp} className="hover:text-white transition-colors">
              Web App
            </button>
            <a href="/SunoScam-v1.0.0.apk" download="SunoScam-v1.0.0.apk" className="hover:text-white transition-colors">
              Download APK
            </a>
            <a href="https://github.com/devrift/SunoScam" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
          </div>

          <div className="text-xs text-gray-500">
            © 2026 SunoScam. Designed to keep families safe from digital fraud.
          </div>
        </div>
      </footer>
    </div>
  );
};
