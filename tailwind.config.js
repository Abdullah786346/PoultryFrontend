/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,tsx}",
  ],
  theme: {
    extend: {      colors: {
        crimson: '#DE0F3F',
        darkgrey: '#545454',
        olive: '#5A631C',
        brown: '#714616',
        purewhite: '#FFFFFF',
      },},
  },
  plugins: [],
}

