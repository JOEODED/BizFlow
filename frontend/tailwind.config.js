/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14171F",
        paper: "#FBF9F6",
        marigold: "#DDA52A",
        profit: "#2F7A4F",
        alert: "#C1443C",
        slate: "#6B7280",
        line: "#26293380",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "4px",
      },
    },
  },
  plugins: [],
};
