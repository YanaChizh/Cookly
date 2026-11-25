import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: { 50: "#fdfbf7", 100: "#f9f5eb", 200: "#f0e6d3" },
        sage: {
          100: "#e3ebe3",
          200: "#c5d6c5",
          500: "#4f7d4f",
          600: "#3d643d",
          700: "#325032",
          800: "#2a412a",
          900: "#243624",
        },
      },
    },
  },
  plugins: [],
};
export default config;
