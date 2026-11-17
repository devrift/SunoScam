import React from 'react';

interface SpeedometerGaugeProps {
  probability: number;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({ probability }) => {
  // Clamped angle: 0% -> -90 deg, 100% -> +90 deg
  const clampedProb = Math.min(100, Math.max(0, probability));
  const rotation = -90 + (clampedProb / 100) * 180;
  const isDanger = clampedProb >= 50;

  return (
    <div className="flex flex-col items-center justify-center my-1 select-none">
      <div className="relative w-36 h-20 flex items-center justify-center">
        <svg viewBox="0 0 160 90" className="w-full h-full overflow-visible">
          <defs>
            {/* Segment Gradients */}
            <linearGradient id="gaugeArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#30D158" />
              <stop offset="35%" stopColor="#FFD60A" />
              <stop offset="65%" stopColor="#FF7A00" />
              <stop offset="100%" stopColor="#FF3800" />
            </linearGradient>
            
            <filter id="gaugeGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 20 80 A 60 60 0 0 1 140 80"
            fill="none"
            stroke="#1D2435"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Colored Segments / Gradient Arc */}
          <path
            d="M 20 80 A 60 60 0 0 1 140 80"
            fill="none"
            stroke="url(#gaugeArcGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="188.5"
            strokeDashoffset={188.5 - (188.5 * clampedProb) / 100}
            filter="url(#gaugeGlow)"
          />

          {/* Tick markers */}
          <g stroke="#2C354C" strokeWidth="1.5">
            <line x1="20" y1="80" x2="26" y2="80" />
            <line x1="38" y1="42" x2="43" y2="45" />
            <line x1="80" y1="20" x2="80" y2="26" />
            <line x1="122" y1="42" x2="117" y2="45" />
            <line x1="140" y1="80" x2="134" y2="80" />
          </g>

          {/* Needle / Indicator */}
          <g transform={`rotate(${rotation} 80 80)`} className="transition-transform duration-1000 ease-out">
            <line
              x1="80"
              y1="80"
              x2="80"
              y2="28"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="80" cy="80" r="6" fill="#FFA500" stroke="#0B0D13" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Subtext: Danger / Safe */}
      <span
        className={`text-xs font-bold tracking-wider uppercase -mt-2 ${
          isDanger ? 'text-[#FF4D00]' : 'text-[#30D158]'
        }`}
      >
        {isDanger ? 'Danger' : 'Safe'}
      </span>
    </div>
  );
};
