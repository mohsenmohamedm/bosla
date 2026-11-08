import type { Config } from 'tailwindcss';

/**
 * ألوان وخطوط وهوية "بوصلة".
 * أي تعديل على الهوية البصرية يتم من هنا بس.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bosla-black': '#0A0A0A',
        'bosla-charcoal': '#141414',
        'bosla-graphite': '#1E1E1E',
        'bosla-gold': '#C9A86A',
        'bosla-gold-deep': '#B8860B',
        'bosla-silver': '#D4D4D8',
        'bosla-white': '#F5F5F3',
      },
      fontFamily: {
        // العناوين — Reem Kufi (عربي هندسي فاخر)
        display: ['var(--font-reem)', 'sans-serif'],
        // النصوص — Cairo
        body: ['var(--font-cairo)', 'sans-serif'],
        // الإنجليزي في اللوجو الثانوي — Inter
        latin: ['var(--font-inter)', 'sans-serif'],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(201, 168, 106, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
