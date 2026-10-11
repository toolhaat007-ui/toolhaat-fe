import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand core
        dark: '#1a2e35',
        mid: '#22404e',
        'mid-2': '#2d4a52',
        accent: '#2ec4b6',
        'accent-dark': '#1a9e92',
        'accent-light': '#cbf3f0',

        // Backgrounds
        'bg-page': '#f0f5f5',
        'bg-card': '#ffffff',
        'bg-muted': '#f5fafa',

        // Text
        'text-base': '#1a2e35',
        'text-muted': '#4a7a7a',
        'text-subtle': '#6b9e9e',

        // Borders
        'border-light': '#d0e8e8',
        'border-mid': '#22404e',

        // Feedback
        'error': '#e63946',
        'success': '#2ec4b6',
        'warning': '#f59e0b',

        // Footer
        'footer-bg': '#142229',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'sans-serif'],
        heading: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        'th': '8px',
        'th-lg': '12px',
        'th-xl': '16px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
        'header': '0 2px 20px rgba(0,0,0,0.4)',
      },
      keyframes: {
        'dice': {
          '0%': { transform: 'rotateY(0deg) rotateX(0deg)' },
          '25%': { transform: 'rotateY(90deg) rotateX(15deg)' },
          '50%': { transform: 'rotateY(180deg) rotateX(0deg)' },
          '75%': { transform: 'rotateY(270deg) rotateX(-15deg)' },
          '100%': { transform: 'rotateY(360deg) rotateX(0deg)' },
        },
        'dot-bounce': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        'ticker': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'dice': 'dice 3s ease-in-out infinite',
        'dot-bounce': 'dot-bounce 3s ease-in-out infinite',
        'ticker': 'ticker 30s linear infinite',
      },
      maxWidth: {
        'site': '1200px',
      },
    },
  },
  plugins: [],
}

export default config
