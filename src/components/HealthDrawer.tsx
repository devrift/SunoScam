import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Activity, Bell, Radio, CheckCircle } from 'lucide-react';

interface HealthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HealthDrawer: React.FC<HealthDrawerProps> = ({ isOpen, onClose }) => {
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
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-[#131722] border-b border-white/10 rounded-b-[28px] p-5 pt-8 z-50 shadow-[0_16px_40px_rgba(0,0,0,0.9)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center border border-[#FF6B00]/40">
                  <Bell className="w-4 h-4 text-[#FFA14A]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">System Health</h3>
                  <p className="text-[11px] text-gray-400">Real-Time Threat Monitor</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Health Highlights */}
            <div className="mt-4 space-y-2.5">
              {/* Live Protection Enabled Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-[#182329] to-[#0E151E] border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Live Protection Enabled</h4>
                    <p className="text-[11px] text-emerald-400 font-medium">Zero background anomalies</p>
                  </div>
                </div>

                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#30D158] animate-pulse" />
              </div>

              {/* Subsystems Status */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-[#0B0D13] border border-white/5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 uppercase font-semibold">
                    <Radio className="w-3 h-3 text-[#FF7A00]" />
                    <span>SMS Interceptor</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-white font-medium">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>0 Threats</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0B0D13] border border-white/5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 uppercase font-semibold">
                    <Activity className="w-3 h-3 text-[#FF7A00]" />
                    <span>Link Guard</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-white font-medium">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>Secured</span>
                  </div>
                </div>
              </div>

              {/* Footer text */}
              <p className="text-[10px] text-center text-gray-500 pt-1">
                Background heuristics refreshed just now. All shields running at peak efficiency.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
