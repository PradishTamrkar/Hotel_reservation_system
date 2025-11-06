/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e25117',
        secondary: '#e26666'
      },
      fontFamily: {
        sans: ['Roboto','Helvetica','Arial','sans-serif'],
      },
    },
  },
  plugins: [],
}
