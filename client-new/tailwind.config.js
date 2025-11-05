/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#e25117',
          light: '#f5a052',
          dark: '#742a00',
        },
        secondary: {
          main: '#e26666',
        },
      },
      fontFamily: {
        sans: ['Roboto','Helvetica','Arial','sans-serif'],
      },
    },
  },
  plugins: [],
}
