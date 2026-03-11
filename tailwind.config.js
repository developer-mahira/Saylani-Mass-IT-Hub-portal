/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        green: {
          primary: "#66b032",
          light: "#e8f5e0",
          dark: "#4a9020",
        },
        blue: {
          primary: "#0057a8",
          light: "#dbeafe",
          dark: "#003d7a",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

