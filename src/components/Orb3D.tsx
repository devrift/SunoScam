import React from 'react';
import { motion } from 'framer-motion';

interface Orb3DProps {
  isScanning?: boolean;
  onClick?: () => void;
}

export const Orb3D: React.FC<Orb3DProps> = ({ isScanning = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative flex items-center justify-center my-3 cursor-pointer group select-none"
    >
      {/* Outer Glow / Radar Waves when scanning */}
      {isScanning && (
        <>
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            className="absolute w-40 h-40 rounded-full border border-[#FF6B00]/60 pointer-events-none"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{ duration: 1.8, delay: 0.6, repeat: Infinity, ease: 'easeOut' }}
            className="absolute w-40 h-40 rounded-full border border-[#FF3D00]/40 pointer-events-none"
          />
        </>
      )}

      {/* Ambient warm orange rim glow */}
      <div
        className={`absolute w-36 h-36 rounded-full transition-all duration-700 blur-xl pointer-events-none ${
          isScanning
            ? 'bg-[#FF6B00]/40 scale-125'
            : 'bg-[#FF6B00]/15 group-hover:bg-[#FF6B00]/25'
        }`}
      />

      {/* Outermost Beveled Metal Ring */}
      <div className="relative w-36 h-36 rounded-full p-[3px] bg-gradient-to-b from-[#2E3547] via-[#151924] to-[#0A0D14] shadow-[0_16px_36px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)]">
        {/* Secondary Inner Ring with metallic gradient */}
        <div className="w-full h-full rounded-full p-[4px] bg-gradient-to-t from-[#252C3D] via-[#121622] to-[#0B0E15] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_2px_4px_rgba(255,255,255,0.06)]">
          {/* Middle Ring */}
          <div className="w-full h-full rounded-full p-[6px] bg-gradient-to-b from-[#1C2232] to-[#0A0D13] shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)]">
            {/* Core Orb Center */}
            <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-radial from-[#252C3E] via-[#141824] to-[#0B0D13] shadow-[inset_0_6px_12px_rgba(255,255,255,0.12),inset_0_-8px_16px_rgba(0,0,0,0.95)]">
              {/* Radar Sweep Beam (Rotating when scanning) */}
              {isScanning && (
                <div className="absolute inset-0 animate-radar pointer-events-none">
                  <div
                    className="w-1/2 h-1/2 origin-bottom-right"
                    style={{
                      background:
                        'conic-gradient(from 0deg at 100% 100%, rgba(255, 107, 0, 0.6) 0deg, rgba(255, 61, 0, 0.15) 45deg, transparent 90deg)'
                    }}
                  />
                </div>
              )}

              {/* Concentric radar grid rings inside the orb */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-20 h-20 rounded-full border border-white/20" />
                <div className="absolute w-12 h-12 rounded-full border border-white/15" />
              </div>

              {/* Embossed "AI" Text */}
              <div className="relative z-10 flex items-center justify-center select-none">
                <span
                  className={`font-black text-2xl tracking-tight transition-colors duration-300 ${
                    isScanning
                      ? 'text-white drop-shadow-[0_0_12px_#FF6B00]'
                      : 'text-[#8F9BAE] group-hover:text-white drop-shadow-[inset_0_2px_3px_rgba(255,255,255,0.3)]'
                  }`}
                  style={{
                    textShadow:
                      '0 1px 1px rgba(255,255,255,0.2), 0 -1px 2px rgba(0,0,0,0.9)'
                  }}
                >
                  AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
