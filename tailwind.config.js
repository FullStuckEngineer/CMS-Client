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
      color: {
        primary: "#ffffff",
        secondary: "#E9FCFF",
        gold: "#F7AD1A",
        red: "#BA1A1A",
        green: "#00A19F",
        greenhover: "#00BDBB",
        grey: "#A9B0BF",
        dark: "#000000",
      },
    },
  },
  plugins: [],
};
