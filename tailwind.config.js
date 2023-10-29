/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    fontFamily: {
      sans: ['Lucida Sans Unicode', 'Lucida Grande'],
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
      },
    },
  },
  plugins: [],
}
