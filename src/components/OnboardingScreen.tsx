import React from 'react';
import { motion } from 'framer-motion';
import { PadlockGraphic } from './PadlockGraphic';

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="relative w-full h-full min-h-[640px] max-h-[880px] flex flex-col justify-between text-white overflow-hidden pt-6">
      {/* App Brand Header */}
      <div className="w-full flex items-center justify-center pt-2 select-none z-10">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold tracking-tight text-white font-sans">
            ScamSuno
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FF6B00]/20 border border-[#FF6B00] text-[#FFA14A]">
            AI
          </span>
        </div>
      </div>

      {/* Center 3D Padlock Hologram Graphic */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex-1 flex flex-col items-center justify-center -my-2 relative z-10"
      >
        <PadlockGraphic />

        {/* Text Group */}
        <div className="flex flex-col items-center space-y-2.5 mt-2 select-none">
          <h1 className="text-lg font-medium text-white/90 tracking-wide">
            Your Personal AI
          </h1>

          {/* ScamSuno Glass Pill Container */}
          <div className="px-6 py-1.5 rounded-full bg-[#131722]/80 border border-white/15 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <span className="text-base font-bold text-white tracking-wide">
              ScamSuno
            </span>
          </div>

          {/* Devanagari Subtitle */}
          <p className="text-base font-semibold text-gray-200 tracking-wider font-devanagari">
            स्कैम सुनो
          </p>
        </div>
      </motion.div>

      {/* Bottom Action Area */}
      <div className="w-full px-6 pb-6 pt-2 select-none z-20">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGetStarted}
          className="w-full py-4 rounded-full font-bold text-base text-white tracking-wide orange-gradient-btn flex items-center justify-center cursor-pointer transition-all shadow-[0_8px_28px_rgba(255,107,0,0.45)]"
        >
          <span>Get Started</span>
        </motion.button>
      </div>
    </div>
  );
};
