/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hero: ["hero", "sans-serif"],
        sans: ["Bricolage Grotesque", "sans-serif"],
        display: ["Bricolage Grotesque", "sans-serif"],
        tall: ["Barlow Condensed", "sans-serif"],
        mukta: ["Mukta Malar", "sans-serif"],
        young: ["Young Serif", "serif"],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          900: '#312e81',
        },
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        accent: {
          500: '#14b8a6', // Teal
          600: '#0d9488',
        },
        secondary: {
          DEFAULT: '#00a151',
          hover: '#008c46',
          light: '#e6f6ee',
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#00a151',
          600: '#008c46',
          700: '#007339',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('/images/pattern.svg')",
      }
    },
  },
  plugins: [],
}

