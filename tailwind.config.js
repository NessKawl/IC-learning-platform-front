/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  safelist: [
    "bg-black",
    "bg-white",
    "bg-red-500",
    "bg-blue-500",
  ],

  theme: {
    extend: {},
  },

  plugins: [],
}