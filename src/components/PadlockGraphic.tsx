import React from 'react';

export const PadlockGraphic: React.FC = () => {
  return (
    <div className="relative w-full max-w-[320px] aspect-square mx-auto flex items-center justify-center select-none">
      {/* Background radial orange glow */}
      <div className="absolute inset-0 bg-radial from-[#FF6B00]/25 via-[#FF3D00]/10 to-transparent blur-3xl pointer-events-none transform -translate-y-4"></div>

      <svg
        viewBox="0 0 360 360"
        className="w-full h-full drop-shadow-[0_12px_36px_rgba(255,107,0,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Shackle Gradient */}
          <linearGradient id="shackleGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFE8A3" />
            <stop offset="30%" stop-color="#FF9D2E" />
            <stop offset="70%" stop-color="#FF6300" />
            <stop offset="100%" stop-color="#C23900" />
          </linearGradient>

          {/* Shield Border Gradient */}
          <linearGradient id="shieldRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFE082" />
            <stop offset="25%" stop-color="#FF8A00" />
            <stop offset="70%" stop-color="#FF4D00" />
            <stop offset="100%" stop-color="#801C00" />
          </linearGradient>

          {/* Hologram Base Gradient */}
          <radialGradient id="baseRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FF8A00" stop-opacity="0.8" />
            <stop offset="40%" stop-color="#FF4D00" stop-opacity="0.4" />
            <stop offset="75%" stop-color="#FF3800" stop-opacity="0.1" />
            <stop offset="100%" stop-color="#0B0D13" stop-opacity="0" />
          </radialGradient>

          {/* Circuit Trace Glow */}
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- Background Circuit Traces --- */}
        <g stroke="#FF7A00" strokeWidth="1.2" opacity="0.3" strokeDasharray="3 3">
          <path d="M 60 70 L 100 70 L 120 100" />
          <path d="M 50 140 L 90 140 L 110 160" />
          <path d="M 300 70 L 260 70 L 240 100" />
          <path d="M 310 140 L 270 140 L 250 160" />
          <circle cx="60" cy="70" r="2.5" fill="#FF8A00" />
          <circle cx="50" cy="140" r="2.5" fill="#FF8A00" />
          <circle cx="300" cy="70" r="2.5" fill="#FF8A00" />
          <circle cx="310" cy="140" r="2.5" fill="#FF8A00" />
        </g>

        {/* --- Holographic Pedestal / Floor Rings --- */}
        <g transform="translate(0, 240)">
          {/* Outermost elliptical grid */}
          <ellipse cx="180" cy="50" rx="140" ry="34" fill="none" stroke="#FF6B00" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
          {/* Middle ring */}
          <ellipse cx="180" cy="50" rx="110" ry="26" fill="url(#baseRadial)" stroke="#FF8A00" strokeWidth="2.5" opacity="0.85" filter="url(#glowFilter)" />
          {/* Inner ring with radial spokes */}
          <ellipse cx="180" cy="50" rx="75" ry="17" fill="none" stroke="#FFE082" strokeWidth="2" opacity="0.9" />
          <ellipse cx="180" cy="50" rx="45" ry="10" fill="#FFA500" opacity="0.4" />
          
          {/* Radial tick marks */}
          <g stroke="#FF9500" strokeWidth="1.5" opacity="0.6">
            <line x1="180" y1="24" x2="180" y2="33" />
            <line x1="180" y1="67" x2="180" y2="76" />
            <line x1="70" y1="50" x2="85" y2="50" />
            <line x1="275" y1="50" x2="290" y2="50" />
            <line x1="102" y1="35" x2="114" y2="40" />
            <line x1="258" y1="35" x2="246" y2="40" />
            <line x1="102" y1="65" x2="114" y2="60" />
            <line x1="258" y1="65" x2="246" y2="60" />
          </g>
        </g>

        {/* --- The Shackle (Open Lock) --- */}
        {/* Shackle shadow */}
        <path
          d="M 125 150 L 125 105 C 125 70, 150 48, 180 48 C 210 48, 235 70, 235 105 L 235 125"
          fill="none"
          stroke="#000000"
          strokeWidth="24"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Shackle metallic tube */}
        <path
          d="M 125 150 L 125 105 C 125 72, 150 50, 180 50 C 210 50, 235 72, 235 125"
          fill="none"
          stroke="url(#shackleGold)"
          strokeWidth="18"
          strokeLinecap="round"
          filter="url(#glowFilter)"
        />
        {/* Shackle inner highlight */}
        <path
          d="M 125 145 L 125 105 C 125 76, 150 56, 180 56 C 210 56, 235 76, 235 120"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* --- The Shield Body --- */}
        {/* Outer shield glow backdrop */}
        <path
          d="M 85 140 C 135 130, 225 130, 275 140 C 275 220, 220 270, 180 295 C 140 270, 85 220, 85 140 Z"
          fill="#131722"
          stroke="url(#shieldRim)"
          strokeWidth="7"
          filter="url(#glowFilter)"
        />

        {/* Inner Shield Face */}
        <path
          d="M 94 146 C 138 138, 222 138, 266 146 C 266 215, 215 260, 180 282 C 145 260, 94 215, 94 146 Z"
          fill="#0E121B"
          stroke="#FF7A00"
          strokeWidth="1.5"
          opacity="0.9"
        />

        {/* Matrix Binary Code Pattern */}
        <g fill="#FFA333" opacity="0.65" fontFamily="monospace" fontSize="8.5" fontWeight="600" letterSpacing="2">
          <text x="110" y="165">100101 01 100101</text>
          <text x="105" y="180">01 1101 10 01010</text>
          <text x="112" y="195">101 01011 10101</text>
          <text x="108" y="210">0101 1010 0110</text>
          <text x="116" y="225">11 01 01 10 11</text>
          <text x="126" y="240">010 110 010</text>
          <text x="138" y="255">101 010</text>
          <text x="156" y="270">1 0 1</text>
        </g>

        {/* --- Center Keyhole --- */}
        <g transform="translate(0, 10)">
          {/* Keyhole outer glow */}
          <circle cx="180" cy="195" r="14" fill="#FF5E00" opacity="0.3" filter="url(#glowFilter)" />
          {/* Keyhole upper circle */}
          <circle cx="180" cy="195" r="9" fill="#0B0D13" stroke="#FFA63D" strokeWidth="2.5" />
          {/* Keyhole lower slot */}
          <polygon points="175,198 185,198 188,220 172,220" fill="#0B0D13" stroke="#FFA63D" strokeWidth="2" />
          {/* Inner core glow */}
          <circle cx="180" cy="195" r="4.5" fill="#FFA63D" />
        </g>
      </svg>
    </div>
  );
};
