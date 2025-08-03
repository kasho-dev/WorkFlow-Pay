/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00AAFF',
        secondary: '#035BC0',
        dark: '#0A0D10',
        card: '#1C1C1C',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
} 