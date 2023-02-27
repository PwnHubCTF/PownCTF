const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#071f32',
        'secondary': '#E22C40'
      }
    },
  },
  plugins: [require("tailwind-scrollbar")]
};