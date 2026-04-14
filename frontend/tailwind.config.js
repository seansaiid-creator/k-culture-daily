/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0F172A",
        glass: "rgba(255, 255, 255, 0.05)"
      }
    }
  },
  plugins: []
};
