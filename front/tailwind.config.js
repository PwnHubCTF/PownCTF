const colors = require('tailwindcss/colors')
module.exports = {
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        '2600blue': '#071f32',
        '2600red': '#E22C40',
        'noAccess': '#9B9B93',
        'noSolved': '#2b2b35',
        'solved': {
          1: '#00b200',
          2: '#00a000'
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")]
};