/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0B0D13",
        card: "#131722",
        cardElevated: "#181D2B",
        cardBorder: "#22293B",
        cardBorderLight: "rgba(255, 255, 255, 0.08)",
        neonOrange: "#FF6B00",
        neonRed: "#FF3D00",
        danger: "#FF453A",
        safe: "#30D158",
        warning: "#FFD60A",
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'orange-gradient': 'linear-gradient(135deg, #FF6B00 0%, #FF3D00 100%)',
        'orange-pill': 'linear-gradient(90deg, #FF6B00 0%, #FF3800 100%)',
        'subtle-card': 'linear-gradient(180deg, rgba(25, 30, 44, 0.8) 0%, rgba(19, 23, 34, 0.95) 100%)',
      },
      boxShadow: {
        'neon-glow': '0 8px 30px -4px rgba(255, 107, 0, 0.5)',
        'neon-sm': '0 4px 16px 0 rgba(255, 107, 0, 0.35)',
        'inner-light': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
        'orb-depth': 'inset 0 -8px 12px rgba(0, 0, 0, 0.8), inset 0 8px 12px rgba(255, 255, 255, 0.15), 0 12px 24px rgba(0,0,0,0.7)',
      }
    },
  },
  plugins: [],
}
