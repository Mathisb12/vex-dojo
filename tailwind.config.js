/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        vex: {
          bg: '#0d1117',
          surface: '#161b22',
          border: '#30363d',
          orange: '#f97316',
          'orange-dim': '#7c3b12',
          green: '#22c55e',
          'green-dim': '#14532d',
          red: '#ef4444',
          'red-dim': '#7f1d1d',
          blue: '#3b82f6',
          purple: '#a855f7',
          text: '#e6edf3',
          muted: '#8b949e',
        },
      },
      animation: {
        'bounce-once': 'bounce 0.5s ease 1',
        'pulse-fast': 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'shake': 'shake 0.4s ease',
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
}
