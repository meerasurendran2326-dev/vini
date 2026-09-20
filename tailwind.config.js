/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "var(--void, #050505)",
        graphite: "var(--graphite, #0A0A0A)",
        carbon: "var(--carbon, #111111)",
        "forest-deep": "var(--forest-deep, #0B1A12)",
        "emerald-shadow": "var(--emerald-shadow, #12261B)",
        moss: "var(--moss, #2E4A37)",
        "signature-green": "var(--signature-green, #6C8F72)",
        "brand-green": "var(--signature-green, #6C8F72)",
        "green-glow": "var(--green-glow, #8FB89A)",
        silver: "var(--silver, #BFC3C7)",
        "bright-silver": "var(--bright-silver, #D4D7DA)",
        "ice-white": "var(--ice-white, #F2F2F2)",
        steel: "var(--steel, #34383C)",
        chrome: "var(--chrome, #6D7277)",
      },
      fontFamily: {
        display: ['var(--font-cinzel)', 'serif'],
        editorial: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      letterSpacing: {
        'super-wide': '0.25em',
        'monumental': '0.35em',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'gothic-fog-1': 'gothicFog1 52s ease-in-out infinite alternate',
        'gothic-fog-2': 'gothicFog2 60s ease-in-out infinite alternate',
        'gothic-fog-3': 'gothicFog3 48s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gothicFog1: {
          '0%': { transform: 'translate(0px, 0px) scale(1)', opacity: '0.22' },
          '50%': { transform: 'translate(60px, 40px) scale(1.08)', opacity: '0.32' },
          '100%': { transform: 'translate(-40px, 70px) scale(0.96)', opacity: '0.20' },
        },
        gothicFog2: {
          '0%': { transform: 'translate(0px, 0px) scale(1)', opacity: '0.18' },
          '50%': { transform: 'translate(-70px, -30px) scale(1.12)', opacity: '0.26' },
          '100%': { transform: 'translate(50px, 50px) scale(0.92)', opacity: '0.16' },
        },
        gothicFog3: {
          '0%': { transform: 'translate(0px, 0px) scale(1)', opacity: '0.24' },
          '50%': { transform: 'translate(50px, -50px) scale(1.06)', opacity: '0.30' },
          '100%': { transform: 'translate(-60px, 30px) scale(0.98)', opacity: '0.22' },
        },
      },
    },
  },
  plugins: [],
};
