/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#F5F5DC",
        ink: "#3E2723",
        gold: "#C5A059",
      },
      fontFamily: {
        serif: ['"Crimson Text"', "serif"],
      },
    },
  },
  plugins: [],
};
