const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    './src/**/*.jsx',
    './dist/**/*.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      gray: colors.trueGray,
      green: colors.emerald,
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
