import React from 'react';
import { MessageSquare, ShieldCheck, History, UserCheck, ScanLine } from 'lucide-react';
import type { Screen } from '../types';

interface BottomDockProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onOpenScan: () => void;
  onOpenHistory: () => void;
  onOpenHealth?: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  currentScreen,
  onNavigate,
  onOpenScan,
  onOpenHistory,
  onOpenHealth
}) => {
  return (
    <div className="w-full px-5 pb-3 pt-1 select-none z-40">
      {/* Floating Dock Container */}
      <div className="relative w-full max-w-[360px] mx-auto h-[62px] bg-[#131722]/95 backdrop-blur-xl border border-white/10 rounded-full px-5 flex items-center justify-between shadow-[0_12px_32px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)]">
        
        {/* Left Icon 1: Message / SMS */}
        <button
          onClick={onOpenScan}
          aria-label="Scan Message"
          className="p-2 text-gray-400 hover:text-white transition-colors active:scale-95 flex items-center justify-center"
        >
          <MessageSquare className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Left Icon 2: Shield (Active Highlight in Dashboard) */}
        <button
          onClick={() => onNavigate('dashboard')}
          aria-label="Home Dashboard"
          className="relative p-2 text-white transition-transform active:scale-95 flex items-center justify-center"
        >
          {currentScreen === 'dashboard' && (
            <div className="absolute inset-0 bg-[#FF6B00]/20 rounded-full border border-[#FF6B00]/50 filter blur-[0.5px]" />
          )}
          <ShieldCheck
            className={`w-5 h-5 relative z-10 transition-colors ${
              currentScreen === 'dashboard'
                ? 'text-[#FFA14A] stroke-[2.2]'
                : 'text-gray-400 stroke-[1.8]'
            }`}
          />
        </button>

        {/* Center Elevated Button Placeholder Space */}
        <div className="w-12 h-12 flex-shrink-0" />

        {/* Center Elevated Floating Neon Button */}
        <div className="absolute left-1/2 -top-5 -translate-x-1/2">
          {/* Subtle dock notch glow */}
          <div className="absolute -inset-1 rounded-full bg-[#FF6B00]/30 blur-md pointer-events-none" />
          
          <button
            onClick={onOpenScan}
            aria-label="Start Scan"
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF3D00] via-[#FF6B00] to-[#FFA726] border-2 border-[#131722] shadow-[0_6px_20px_rgba(255,107,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center active:scale-95 transition-transform group"
          >
            <ScanLine className="w-6 h-6 text-white stroke-[2.2] group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Right Icon 3: History / Scans */}
        <button
          onClick={onOpenHistory}
          aria-label="Scan History"
          className="p-2 text-gray-400 hover:text-white transition-colors active:scale-95 flex items-center justify-center"
        >
          <History className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Right Icon 4: Protection Status */}
        <button
          onClick={onOpenHealth}
          aria-label="Protection Guard"
          className="p-2 text-gray-400 hover:text-white transition-colors active:scale-95 flex items-center justify-center"
        >
          <UserCheck className="w-5 h-5 stroke-[1.8]" />
        </button>
      </div>

      {/* Home Indicator Bar */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mt-2.5 mb-1" />
    </div>
  );
};
