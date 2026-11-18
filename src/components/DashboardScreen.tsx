import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, AlertTriangle, AlertCircle, ScanSearch, QrCode, AlertOctagon } from 'lucide-react';
import { Orb3D } from './Orb3D';
import { BottomDock } from './BottomDock';
import type { Screen } from '../types';

interface DashboardScreenProps {
  userName?: string;
  onNavigate: (screen: Screen) => void;
  onOpenScanSheet: (initialText?: string) => void;
  onOpenSettings: () => void;
  onOpenHealth: () => void;
  onOpenHistory: () => void;
  isScanning: boolean;
  apiError?: string | null;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userName = 'Papa/Mummy',
  onNavigate,
  onOpenScanSheet,
  onOpenSettings,
  onOpenHealth,
  onOpenHistory,
  isScanning,
  apiError
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between text-white overflow-y-auto no-scrollbar select-none pt-3">
      {/* Top Header Row */}
      <div className="w-full px-5 pt-1 pb-1 flex items-center justify-between z-20 flex-shrink-0">
        {/* User Profile Avatar & Greeting */}
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 shadow-md bg-[#181E2E] flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <rect width="40" height="40" fill="#1C2333" />
              <circle cx="20" cy="15" r="7.5" fill="#E0A97E" />
              <path d="M13 14 C13 9 27 9 27 14 C27 12 25 10 20 10 C15 10 13 12 13 14 Z" fill="#3D2B1F" />
              <rect x="15" y="13" width="4" height="3" rx="1" fill="none" stroke="#222" strokeWidth="1" />
              <rect x="21" y="13" width="4" height="3" rx="1" fill="none" stroke="#222" strokeWidth="1" />
              <line x1="19" y1="14.5" x2="21" y2="14.5" stroke="#222" strokeWidth="1" />
              <path d="M9 36 C9 27 15 25 20 25 C25 25 31 27 31 36 Z" fill="#3A4D6B" />
              <polygon points="17,25 20,29 23,25" fill="#FFFFFF" />
            </svg>
          </div>

          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">{userName}</h2>
            <p className="text-[11px] text-gray-400 font-medium">Welcome</p>
          </div>
        </div>

        {/* Top Right Action Icons: Settings & Bell */}
        <div className="flex items-center space-x-2">
          {/* Settings Icon */}
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Settings"
            className="w-9 h-9 rounded-full bg-[#131722] border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <Settings className="w-4 h-4 stroke-[1.8]" />
          </button>

          {/* Notification Bell with indicator dot */}
          <button
            type="button"
            onClick={onOpenHealth}
            aria-label="System Health"
            className="relative w-9 h-9 rounded-full bg-[#131722] border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <Bell className="w-4 h-4 stroke-[1.8]" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF6B00] shadow-[0_0_6px_#FF6B00]" />
          </button>
        </div>
      </div>

      {/* Explicit API Error Banner if error occurs */}
      {apiError && (
        <div className="mx-5 my-1.5 p-3 rounded-2xl bg-red-950/90 border border-red-500/50 text-red-200 text-xs flex items-center justify-between shadow-lg flex-shrink-0 animate-pulse">
          <div className="flex items-center space-x-2 pr-2 min-w-0">
            <AlertOctagon className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="font-semibold truncate">{apiError}</span>
          </div>
          <button
            type="button"
            onClick={onOpenSettings}
            className="px-2.5 py-1 bg-red-800 hover:bg-red-700 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider transition-colors flex-shrink-0"
          >
            Settings
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-around px-5 py-1 z-10 space-y-2">
        
        {/* Center 3D AI Orb Section */}
        <div className="flex flex-col items-center">
          <Orb3D
            isScanning={isScanning}
            onClick={() => onOpenScanSheet()}
          />

          {/* Clean subtitle text below orb without debug jargon */}
          <div className="flex items-center space-x-1.5 mt-0.5">
            <span className="text-sm font-semibold text-white/95 tracking-wide">
              Your Personal
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6B00]/20 border border-[#FF6B00] text-[#FFA14A]">
              AI
            </span>
            <span className="text-sm font-semibold text-white/95 tracking-wide">
              Scam Guard
            </span>
          </div>
        </div>

        {/* Primary Action Card: "Scan Your Message" */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onOpenScanSheet()}
          className="relative w-full p-4 rounded-[26px] bg-gradient-to-r from-[#FF6B00] via-[#FF5500] to-[#FF3800] shadow-[0_8px_30px_rgba(255,107,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)] cursor-pointer flex items-center justify-between transition-all group overflow-hidden border-0 text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

          {/* Left Icon Badge */}
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center flex-shrink-0 shadow-inner">
            <ScanSearch className="w-5 h-5 text-white stroke-[2.2]" />
          </div>

          {/* Center Text */}
          <div className="flex-1 text-center px-2">
            <h3 className="text-base font-bold text-white tracking-wide drop-shadow-sm">
              Scan Your Message
            </h3>
            <p className="text-xs text-white/85 font-medium mt-0.5 font-devanagari">
              Apna sandesh check karein
            </p>
          </div>

          {/* Right Icon Badge */}
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center flex-shrink-0 shadow-inner">
            <QrCode className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
        </motion.button>

        {/* "Needs Attention" Section */}
        <div className="w-full space-y-2">
          <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1">
            Needs Attention
          </h4>

          {/* Item 1: Check Suspicious Links */}
          <button
            type="button"
            onClick={() =>
              onOpenScanSheet(
                'http://secure-sbi-bank-login-verification.xyz/kyc?user=9820012345'
              )
            }
            className="w-full p-3.5 rounded-2xl bg-[#131722] hover:bg-[#181D2B] border border-white/5 hover:border-white/10 cursor-pointer transition-all flex items-center justify-between shadow-[0_4px_16px_rgba(0,0,0,0.4)] text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#181D2B] border border-[#FF6B00]/40 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-[#FF7A00] stroke-[2]" />
              </div>
              <span className="text-sm font-medium text-white/95">
                Check Suspicious Links
              </span>
            </div>

            <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] shadow-[0_0_8px_#FF6B00]" />
          </button>

          {/* Item 2: Verify Unknown Numbers */}
          <button
            type="button"
            onClick={() =>
              onOpenScanSheet(
                'Incoming call from +91-9123456789 claiming to be Mumbai Cyber Police Officer demanding urgent fine payment of 25,000 INR via UPI to avoid immediate digital arrest warrant.'
              )
            }
            className="w-full p-3.5 rounded-2xl bg-[#131722] hover:bg-[#181D2B] border border-white/5 hover:border-white/10 cursor-pointer transition-all flex items-center justify-between shadow-[0_4px_16px_rgba(0,0,0,0.4)] text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#181D2B] border border-white/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-gray-400 stroke-[2]" />
              </div>
              <span className="text-sm font-medium text-white/95">
                Verify Unknown Numbers
              </span>
            </div>

            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </button>
        </div>

      </div>

      {/* Bottom Navigation Dock */}
      <div className="flex-shrink-0">
        <BottomDock
          currentScreen="dashboard"
          onNavigate={onNavigate}
          onOpenScan={() => onOpenScanSheet()}
          onOpenHistory={onOpenHistory}
          onOpenHealth={onOpenHealth}
        />
      </div>
    </div>
  );
};
