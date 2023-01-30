const colors = require('tailwindcss/colors')
module.exports = {
  darkMode: 'media',
  theme: {
    extend: {},
    colors: {
      //couleur tailwind : 
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      blue: colors.blue,
      orange: colors.orange,
      red: colors.red,
      green: colors.green,
      cyan: colors.cyan,
      slate: colors.slate,
      sky: colors.sky,
      opacity: colors.opacity,

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
  variants: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")]
};