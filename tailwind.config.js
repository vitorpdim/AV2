/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        aero: {
          dark: "#1f2024",
          mid: "#2f3036",
          border: "#454751",
          muted: "#8f9098",
          subtle: "#c5c6cc",
          line: "#e8e9f1",
          surface: "#f8f9fe",
          bg: "#f2f2f2",
        },
      },
    },
  },
  plugins: [],
};
