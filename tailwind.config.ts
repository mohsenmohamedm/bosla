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
        // الأسماء قديمة (من الثيم الداكن) — القيم دلوقتي فاتحة ومبهجة
        'bosla-black': '#FBF8F2',
        'bosla-charcoal': '#FFFFFF',
        'bosla-graphite': '#EAF3F1',
        'bosla-accent': '#FF6F5E',
        'bosla-sun': '#F8B83A',
        // اللون الأساسي للأزرار والروابط: أزرق قوي
        'bosla-gold': '#0B6E6B',
        'bosla-gold-deep': '#074F4D',
        'bosla-silver': '#4F6B69',
        'bosla-white': '#12302E',
      },
      fontFamily: {
        calligraphy: ['var(--font-calligraphy)', 'serif'],
        // العناوين — Reem Kufi (عربي هندسي فاخر)
        display: ['var(--font-cairo)', 'sans-serif'],
        // النصوص — Cairo
        body: ['var(--font-cairo)', 'sans-serif'],
        // الإنجليزي في اللوجو الثانوي — Inter
        latin: ['var(--font-inter)', 'sans-serif'],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        glow: '0 16px 36px -14px rgba(11, 110, 107, 0.45)',
      },
    },
  },
  plugins: [],
};

export default config;
