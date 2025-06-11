/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-gradient-to-r',
    'bg-gradient-to-br',
    'bg-gradient-to-tr',
    'from-yellow-300',
    'from-blue-300',
    'from-green-200',
    'from-pink-200',
    'from-purple-200',
    'from-orange-200',
    'via-pink-300',
    'via-purple-300',
    'via-blue-200',
    'via-yellow-200',
    'via-red-200',
    'to-pink-300',
    'to-pink-400',
    'to-orange-200',
    'to-green-200',
    'to-blue-200',
    'to-purple-200',
    'bg-white',
    'border',
    'border-gray-300'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      animation: {
        'gradient-move': 'gradientBG 15s ease infinite',
      },
      keyframes: {
        gradientBG: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundSize: {
        '400': '400% 400%',
      },
    },
  },
  plugins: [],
}; 