import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, ArrowRight } from 'lucide-react';
import { PadlockGraphic } from './PadlockGraphic';

interface OnboardingScreenProps {
  onComplete: (chosenName: string) => void;
  defaultName?: string;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, defaultName = 'Papa/Mummy' }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userName, setUserName] = useState(defaultName);

  const presets = ['Papa', 'Mummy', 'Papa/Mummy', 'Bhai', 'Didi', 'Self'];

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as 2 | 3);
    } else {
      onComplete(userName.trim() || 'Papa/Mummy');
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between text-white overflow-y-auto no-scrollbar py-4 px-4 sm:px-6 select-none">
      {/* Top Header & Step Indicator */}
      <div className="w-full flex items-center justify-between pt-1 z-10 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-extrabold tracking-tight text-white font-sans">
            ScamSuno
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6B00]/20 border border-[#FF6B00] text-[#FFA14A]">
            AI GUARD
          </span>
        </div>

        {/* Step dots */}
        <div className="flex items-center space-x-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s ? 'w-5 bg-[#FF6B00]' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Multi-Step Slides */}
      <div className="flex-1 flex flex-col items-center justify-center py-2 relative z-10 my-auto w-full">
        <AnimatePresence mode="wait">
          {/* STEP 1: Welcome Hologram & Brand Intro */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center w-full"
            >
              <div className="w-full max-w-[240px] sm:max-w-[270px]">
                <PadlockGraphic />
              </div>

              <div className="flex flex-col items-center space-y-2 mt-2">
                <h1 className="text-base sm:text-lg font-medium text-white/90 tracking-wide">
                  Your Personal AI
                </h1>

                <div className="px-6 py-1.5 rounded-full bg-[#131722]/80 border border-white/15 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                  <span className="text-base font-bold text-white tracking-wide">
                    ScamSuno
                  </span>
                </div>

                <p className="text-sm font-semibold text-gray-200 tracking-wider font-devanagari">
                  स्कैम सुनो &bull; सुरक्षित रहो
                </p>

                <p className="text-xs text-gray-400 max-w-[280px] leading-relaxed pt-1">
                  Protects your family against fake banking KYC, 9:30 PM power cuts, deceptive lottery grants, and malicious APK files.
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Personalize Name */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center w-full px-2"
            >
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FF6B00]/20 to-[#FF3800]/10 border border-[#FF6B00]/40 flex items-center justify-center mb-4 shadow-[0_0_24px_rgba(255,107,0,0.25)]">
                <User className="w-8 h-8 text-[#FFA14A]" />
              </div>

              <h2 className="text-lg font-bold text-white tracking-tight">
                Who is this phone for?
              </h2>
              <p className="text-xs text-gray-400 mt-1 max-w-[270px]">
                We personalize scam alerts and WhatsApp family group replies with this name.
              </p>

              {/* Name Input Box */}
              <div className="w-full max-w-[310px] mt-5">
                <label className="block text-[11px] font-semibold text-gray-300 text-left mb-1.5 px-1">
                  Recipient / User Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Papa, Mummy, Ramesh..."
                    maxLength={24}
                    className="w-full py-3 px-4 bg-[#131722] border-2 border-white/15 focus:border-[#FF6B00] rounded-2xl text-sm font-bold text-white placeholder-gray-500 focus:outline-none transition-all shadow-inner"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">
                    {userName.length}/24
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                  {presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setUserName(p)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        userName === p
                          ? 'bg-[#FF6B00] text-white font-bold shadow-[0_0_10px_rgba(255,107,0,0.4)]'
                          : 'bg-[#181E2E] border border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Quick 3-Step Interactive Starting Guide */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center w-full px-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center mb-3">
                <Sparkles className="w-7 h-7 text-[#FFA14A]" />
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white text-center">
                How ScamSuno Protects You
              </h2>
              <p className="text-[11px] text-gray-400 text-center mb-4">
                3 simple habits to protect your savings
              </p>

              {/* 3 Step Guide Cards */}
              <div className="w-full space-y-2.5 max-w-[320px]">
                {/* Rule 1 */}
                <div className="p-3 rounded-2xl bg-[#131722] border border-white/10 flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-xl bg-[#FF6B00]/20 border border-[#FF6B00]/40 flex items-center justify-center flex-shrink-0 text-[#FFA14A] text-xs font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Paste or Upload</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                      Received a strange SMS, WhatsApp forward, or APK? Copy it into ScamSuno.
                    </p>
                  </div>
                </div>

                {/* Rule 2 */}
                <div className="p-3 rounded-2xl bg-[#131722] border border-white/10 flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-xl bg-[#FF3800]/20 border border-[#FF3800]/40 flex items-center justify-center flex-shrink-0 text-[#FF6B00] text-xs font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Live AI Forensic Radar</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                      Gemini 3.1 analyzes psychological urgency, bank spoofing, and malicious links.
                    </p>
                  </div>
                </div>

                {/* Rule 3 */}
                <div className="p-3 rounded-2xl bg-[#131722] border border-white/10 flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 text-emerald-400 text-xs font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">One-Click Family Reply</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                      Copy a polite warning ready to send to family groups so no one clicks.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Area */}
      <div className="w-full pb-3 pt-2 select-none z-20 flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base text-white tracking-wide orange-gradient-btn flex items-center justify-center cursor-pointer transition-all shadow-[0_8px_28px_rgba(255,107,0,0.45)] space-x-2"
        >
          <span>{step === 1 ? 'Start Setup' : step === 2 ? 'Continue to Guide' : 'Enter Scam Guard'}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
