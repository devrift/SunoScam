import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History as HistoryIcon, Trash2, ArrowUpRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { ScanResult } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectScan,
  onClearHistory
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 transition-opacity"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#131722] border-t border-white/10 rounded-t-[28px] p-5 pb-8 z-50 shadow-[0_-16px_40px_rgba(0,0,0,0.9)] max-h-[80vh] flex flex-col"
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center border border-[#FF6B00]/40">
                  <HistoryIcon className="w-4 h-4 text-[#FFA14A]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Scan History</h3>
                  <p className="text-[11px] text-gray-400">Pichhle analyze kiye gaye sandesh</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {history.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-[#FF4D00] transition-colors"
                    title="Clear history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="mt-3 overflow-y-auto no-scrollbar flex-1 space-y-2.5">
              {history.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <HistoryIcon className="w-10 h-10 text-gray-600 mx-auto" />
                  <p className="text-sm text-gray-400 font-medium">No previous scans found</p>
                  <p className="text-xs text-gray-500">
                    Analyze any suspicious message to store records here.
                  </p>
                </div>
              ) : (
                history.map((item) => {
                  const isScam = item.verdict === 'SCAM DETECTED' || item.verdict === 'SUSPICIOUS';
                  const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onSelectScan(item);
                        onClose();
                      }}
                      className="p-3.5 rounded-2xl bg-[#0B0D13] hover:bg-[#181D2B] border border-white/5 hover:border-white/15 cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between group"
                    >
                      <div className="flex items-start space-x-3 flex-1 min-w-0 pr-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isScam ? 'bg-[#FF6B00]/20 text-[#FF7A00]' : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {isScam ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-[11px] font-bold uppercase tracking-wider ${
                                isScam ? 'text-[#FF7A00]' : 'text-emerald-400'
                              }`}
                            >
                              {item.verdict}
                            </span>
                            <span className="text-[10px] text-gray-500">{dateStr}</span>
                          </div>

                          <p className="text-xs text-gray-300 truncate mt-0.5 font-medium">
                            {item.originalMessage}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                            isScam
                              ? 'bg-[#FF3D00]/10 border-[#FF6B00]/30 text-[#FFA14A]'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          }`}
                        >
                          {item.probability}%
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
