import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Copy,
  Check,
  FileCode,
  Globe
} from 'lucide-react';
import { WaveChart } from './WaveChart';
import { SpeedometerGauge } from './SpeedometerGauge';
import { BottomDock } from './BottomDock';
import type { ScanResult, Screen } from '../types';

interface ReportScreenProps {
  result: ScanResult;
  onNavigate: (screen: Screen) => void;
  onOpenScanSheet: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenHealth: () => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  result,
  onNavigate,
  onOpenScanSheet,
  onOpenSettings,
  onOpenHistory,
  onOpenHealth
}) => {
  const [copied, setCopied] = useState(false);
  const isScam = result.verdict === 'SCAM DETECTED' || result.verdict === 'SUSPICIOUS';

  const handleCopyReply = async () => {
    try {
      await navigator.clipboard.writeText(result.familyReply);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between text-white overflow-y-auto no-scrollbar select-none pt-3">
      {/* Header Bar */}
      <div className="w-full px-5 pt-1 pb-1 flex items-center justify-between z-20 flex-shrink-0">
        {/* Back / Reset Button */}
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          aria-label="Back to Dashboard"
          className="w-9 h-9 rounded-full bg-[#131722] border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95 shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2]" />
        </button>

        {/* Title */}
        <h2 className="text-base font-bold text-white tracking-wide">
          Analysis Report
        </h2>

        {/* Settings Cog */}
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Settings"
          className="w-9 h-9 rounded-full bg-[#131722] border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95 shadow-sm"
        >
          <Settings className="w-4 h-4 stroke-[1.8]" />
        </button>
      </div>

      {/* Main Report Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 space-y-3 py-1 z-10">
        
        {/* 1. Hero Card: Analysis Outcome */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full p-4 rounded-3xl bg-[#131722] border border-white/10 shadow-[0_8px_28px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.08)] flex flex-col items-center"
        >
          {/* Card Header Row */}
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-300">
              Analysis Outcome
            </span>

            {/* Probability Badge */}
            <div
              className={`px-2.5 py-1 rounded-full border text-xs font-bold flex items-center space-x-1 ${
                isScam
                  ? 'bg-[#FF6B00]/15 border-[#FF6B00]/50 text-[#FFA14A]'
                  : 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
              }`}
            >
              <span>{result.probability}%</span>
              <span className="text-[10px] font-medium text-gray-400">Probability</span>
            </div>
          </div>

          {/* Area Wave Chart */}
          <WaveChart probability={result.probability} isScam={isScam} />

          {/* Verdict Banner */}
          <div className="flex flex-col items-center text-center mt-0.5">
            <h3
              className={`text-lg font-extrabold tracking-wide uppercase ${
                isScam ? 'text-white drop-shadow-[0_0_12px_#FF6B00]' : 'text-emerald-400'
              }`}
            >
              {result.verdict}
            </h3>

            {/* Devanagari Subtitle with Shield Alert Icon */}
            <div className="flex items-center space-x-1.5 mt-0.5 text-xs font-semibold font-devanagari">
              {isScam ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span className="text-[#FF7A00]">स्कैम चेतावनी</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">सुरक्षित संदेश</span>
                </>
              )}
            </div>
          </div>

          {/* Speedometer Gauge */}
          <SpeedometerGauge probability={result.probability} />
        </motion.div>

        {/* Optional Attached File / Link Summary Banner */}
        {(result.fileInfo || result.linkInfo) && (
          <div className="p-3 rounded-2xl bg-[#0B0D13] border border-white/5 space-y-1.5 text-xs">
            {result.fileInfo && (
              <div className="flex items-center space-x-2 text-gray-300">
                <FileCode className="w-3.5 h-3.5 text-[#FFA14A] flex-shrink-0" />
                <span className="font-semibold text-white">Inspected File:</span>
                <span className="truncate">{result.fileInfo.name}</span>
                <span className="text-[10px] text-gray-500">({result.fileInfo.size})</span>
              </div>
            )}
            {result.linkInfo && result.linkInfo.hostname && (
              <div className="flex items-center space-x-2 text-gray-300">
                <Globe className="w-3.5 h-3.5 text-[#FF7A00] flex-shrink-0" />
                <span className="font-semibold text-white">Evaluated Host:</span>
                <span className="font-mono text-[11px] text-[#FFA14A]">{result.linkInfo.hostname}</span>
              </div>
            )}
          </div>
        )}

        {/* 2. Grid: Chaal Kya Hai? & Red Flags */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Left Card: Chaal Kya Hai? */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-3.5 rounded-2xl bg-[#131722] border border-white/5 flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          >
            <div>
              <div className="w-7 h-7 rounded-full bg-[#FF6B00]/15 flex items-center justify-center border border-[#FF6B00]/30 mb-2">
                <Zap className="w-3.5 h-3.5 text-[#FFA14A]" />
              </div>

              <h4 className="text-xs font-bold text-white">Chaal Kya Hai?</h4>
              <p className="text-[10px] text-gray-400 font-medium mb-1.5">Core Intent</p>

              <p className="text-[11px] text-gray-300 leading-relaxed font-normal">
                {result.intent}
              </p>
            </div>
          </motion.div>

          {/* Right Card: Red Flags */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="p-3.5 rounded-2xl bg-[#131722] border border-white/5 flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
          >
            <div>
              <div className="w-7 h-7 rounded-full bg-[#FF3D00]/15 flex items-center justify-center border border-[#FF3D00]/30 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FF5500]" />
              </div>

              <h4 className="text-xs font-bold text-white">Red Flags</h4>
              <p className="text-[10px] text-gray-400 font-medium font-devanagari mb-1.5">
                पकड़े गए पॉइंट्स
              </p>

              <div className="space-y-1.5">
                {result.redFlags.slice(0, 3).map((flag, idx) => (
                  <div key={idx} className="flex items-start space-x-1.5 text-[11px] text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-1 flex-shrink-0" />
                    <span className="leading-tight">{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* 3. Bottom Card: Family Group Reply */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="relative p-4 rounded-3xl bg-[#131722] border border-white/10 shadow-[0_6px_24px_rgba(0,0,0,0.5)] space-y-3"
        >
          {/* Header with Glowing Red Pip Indicator */}
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3D00] shadow-[0_0_8px_#FF3D00]" />
            <h4 className="text-xs font-bold text-white tracking-wide">
              Family Group Reply
            </h4>
          </div>

          {/* Copyable Message Box */}
          <div className="p-3 rounded-2xl bg-[#0B0D13] border border-white/5 text-xs text-gray-200 leading-relaxed font-devanagari select-text">
            {result.familyReply}
          </div>

          {/* Copy Reply Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={handleCopyReply}
            className="w-full py-3 rounded-full font-bold text-xs tracking-wide text-white orange-gradient-btn flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-[0_4px_18px_rgba(255,107,0,0.4)]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white stroke-[2.5]" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-white stroke-[2]" />
                <span>Copy Reply (उत्तर कॉपी करें)</span>
              </>
            )}
          </motion.button>
        </motion.div>

      </div>

      {/* Bottom Navigation Dock */}
      <div className="flex-shrink-0">
        <BottomDock
          currentScreen="report"
          onNavigate={onNavigate}
          onOpenScan={onOpenScanSheet}
          onOpenHistory={onOpenHistory}
          onOpenHealth={onOpenHealth}
        />
      </div>
    </div>
  );
};
