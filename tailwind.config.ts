import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { soil: '#1c2a1c', leaf: '#1e4b21', fern: '#4f7a30', lime: '#cfe5a6', cream: '#f8f8f2', sun: '#e8b319' },
    keyframes: {
      fadeUp: { '0%': { opacity: '0', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'none' } },
      float: { '0%,100%': { transform: 'translateY(0) rotate(-4deg)' }, '50%': { transform: 'translateY(-14px) rotate(4deg)' } },
    },
    animation: { 'fade-up': 'fadeUp .7s ease both', float: 'float 5s ease-in-out infinite' },
  } },
} satisfies Config;
