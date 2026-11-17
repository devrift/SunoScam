import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, Moon, Globe, Shield, Trash2, RotateCcw, Check } from 'lucide-react';
import type { UserSettings, AppLanguage, SecuritySensitivity } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onClearHistory: () => void;
  onResetOnboarding: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearHistory,
  onResetOnboarding
}) => {
  const [clearedNotice, setClearedNotice] = React.useState(false);

  const handleClearHistoryClick = () => {
    onClearHistory();
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Settings Modal */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-sm bg-[#131722] border border-white/10 rounded-3xl p-5 z-50 shadow-[0_24px_60px_rgba(0,0,0,0.9)] max-h-[88vh] overflow-y-auto no-scrollbar select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center border border-[#FF6B00]/40">
                  <Sliders className="w-4 h-4 text-[#FFA14A]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Settings</h3>
                  <p className="text-[11px] text-gray-400">Security & Preferences</p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close settings"
                className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* 1. Appearance */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-gray-300">
                  <Moon className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>Appearance</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'dark' })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      settings.theme === 'dark'
                        ? 'bg-[#0B0D13] border-[#FF6B00] shadow-[0_0_12px_rgba(255,107,0,0.2)]'
                        : 'bg-[#0B0D13]/60 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Dark Mode</span>
                      {settings.theme === 'dark' && (
                        <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Charcoal #0B0D13</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'slate' })}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      settings.theme === 'slate'
                        ? 'bg-[#161C2C] border-[#FF6B00] shadow-[0_0_12px_rgba(255,107,0,0.2)]'
                        : 'bg-[#161C2C]/60 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Deep Slate</span>
                      {settings.theme === 'slate' && (
                        <div className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Midnight Slate</span>
                  </button>
                </div>
              </div>

              {/* 2. Language Selector */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-gray-300">
                  <Globe className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>Language</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['Hinglish', 'English', 'Hindi'] as AppLanguage[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => onUpdateSettings({ language: lang })}
                      className={`py-2 px-2 rounded-xl border text-center text-xs font-medium transition-all ${
                        settings.language === lang
                          ? 'bg-[#FF6B00]/15 border-[#FF6B00] text-white shadow-sm font-bold'
                          : 'bg-[#0B0D13] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 px-1">
                  AI analysis explanations and family WhatsApp replies will be generated in {settings.language}.
                </p>
              </div>

              {/* 3. Security Sensitivity */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-gray-300">
                  <Shield className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>Security Sensitivity</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(['Standard', 'Strict'] as SecuritySensitivity[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => onUpdateSettings({ sensitivity: mode })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        settings.sensitivity === mode
                          ? 'bg-[#FF6B00]/15 border-[#FF6B00] text-white shadow-sm'
                          : 'bg-[#0B0D13] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{mode}</span>
                        {settings.sensitivity === mode && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        {mode === 'Strict' ? 'Flags any APK & shortlinks' : 'Balanced heuristic checks'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Data & History */}
              <div className="space-y-2 pt-1 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleClearHistoryClick}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#0B0D13] hover:bg-[#1A2030] border border-white/10 hover:border-red-500/40 text-xs font-medium text-gray-300 hover:text-red-400 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      <span>Clear Scan History</span>
                    </div>
                    {clearedNotice ? (
                      <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Cleared</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-500">localStorage</span>
                    )}
                  </button>
                </div>

                {/* Replay Onboarding */}
                <button
                  type="button"
                  onClick={() => {
                    onResetOnboarding();
                    onClose();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#0B0D13] hover:bg-[#1A2030] border border-white/10 text-xs font-medium text-gray-400 hover:text-white flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <RotateCcw className="w-3.5 h-3.5 text-[#FFA14A]" />
                    <span>Replay Welcome Tour</span>
                  </div>
                  <span className="text-[10px] text-gray-500">Reset View</span>
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
