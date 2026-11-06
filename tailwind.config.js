/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#FBF5F6',
          100: '#F5E8EB',
          200: '#EBDADD',
          600: '#8C3A4E',
          700: '#6D2434',
          800: '#561B28',
          900: '#3F1E2A',
        },
        gold: {
          300: '#E8D9A8',
          400: '#D8C08B',
          500: '#C9AE72',
          600: '#B89A5E',
          700: '#947840',
        },
        cellar: {
          cream: '#F8F5EF',
          light: '#F3ECDD',
          border: '#E4DDD0',
          borderDark: '#CFC6B5',
          muted: '#6B635C',
          charcoal: '#211C1C',
          dark: '#1F1B1A',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-mulish)', 'Mulish', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

