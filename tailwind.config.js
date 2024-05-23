/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      primary: "#f1f1f1",
      white: "#ffffff",
      secondary: "#E9FCFF",
      gold: "#F7AD1A",
      red: "#BA1A1A",
      redhover: "#E03131",
      green: "#00A19F",
      greenhover: "#00BDBB",
      lightGreen: "#00D1C1",
      grey: "#A9B0BF",
      dark: "#000000",
      lightGrey: "#E5E7EB",
      darkGrey: "#4A4A4A",
      blue: "#1E90FF",
      lightBlue: "#ADD8E6",
      orange: "#FFA500",
      purple: "#800080", 
    },    
  },
  plugins: [],
};
