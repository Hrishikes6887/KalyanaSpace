/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F7F4',
          100: '#DCECE5',
          200: '#BCD8CC',
          300: '#92BEAD',
          400: '#5F9F88',
          500: '#3D826B',
          600: '#2C6854',
          700: '#1F5141',
          800: '#153C30',
          900: '#0D2720',
          950: '#061713',
        },
        ivory: {
          50: '#FDFCF9',
          100: '#FBF9F4',
          200: '#F7F3EA',
          300: '#EEE7D7',
          400: '#E1D5BD',
          500: '#CEBC99',
        },
        gold: {
          50: '#FBF8EE',
          100: '#F5ECCF',
          200: '#ECD89E',
          300: '#DFC06B',
          400: '#CFA73E',
          500: '#B88E28',
          600: '#96701C',
          700: '#755318',
        },
        terracotta: {
          50: '#FDF6F3',
          100: '#FAE8E1',
          500: '#C85A32',
          600: '#B14722',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 12px -2px rgba(16, 24, 40, 0.06), 0 2px 6px -2px rgba(16, 24, 40, 0.03)',
        'elevated': '0 12px 24px -4px rgba(16, 24, 40, 0.08), 0 6px 12px -4px rgba(16, 24, 40, 0.03)',
      }
    },
  },
  plugins: [],
}
