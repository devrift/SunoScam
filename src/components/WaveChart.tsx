import React from 'react';

interface WaveChartProps {
  probability: number;
  isScam: boolean;
}

export const WaveChart: React.FC<WaveChartProps> = ({ isScam }) => {
  const strokeColor = isScam ? '#FF6B00' : '#30D158';
  const gradId = isScam ? 'scamWaveGrad' : 'safeWaveGrad';

  // Smooth wave path
  const pathD = isScam
    ? 'M 0 35 Q 40 5, 80 25 T 160 30 T 240 10 T 320 28 L 320 60 L 0 60 Z'
    : 'M 0 45 Q 60 40, 120 48 T 240 42 T 320 46 L 320 60 L 0 60 Z';

  const strokePath = isScam
    ? 'M 0 35 Q 40 5, 80 25 T 160 30 T 240 10 T 320 28'
    : 'M 0 45 Q 60 40, 120 48 T 240 42 T 320 46';

  return (
    <div className="w-full h-16 relative overflow-hidden select-none pointer-events-none my-1">
      <svg
        viewBox="0 0 320 60"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.45" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gradient fill below curve */}
        <path d={pathD} fill={`url(#${gradId})`} />

        {/* Wave curve stroke */}
        <path
          d={strokePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Highlight apex point */}
        {isScam && (
          <circle
            cx="240"
            cy="10"
            r="3.5"
            fill="#FFFFFF"
            stroke="#FF3D00"
            strokeWidth="2"
          />
        )}
      </svg>
    </div>
  );
};
