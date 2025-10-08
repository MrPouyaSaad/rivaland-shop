const rtl = require('tailwindcss-rtl');

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [rtl],
}
