import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F0F9F5",
          100: "#E7F7EF",
          200: "#C4EDD8",
          300: "#96DCB8",
          400: "#5EC292",
          500: "#168A63",
          600: "#116B4D",
          700: "#0D533B",
          800: "#0A402D",
          900: "#062A1E",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7FAF8",
          subtle: "#F0F4F2",
        },
        text: {
          main: "#182722",
          muted: "#6A7771",
          subtle: "#9BA6A1",
        },
        border: {
          DEFAULT: "#E2EAE5",
          strong: "#CBD8D1",
        },
        rx: {
          amber: "#D97706",
          amberBg: "#FEF3C7",
          red: "#DC2626",
          redBg: "#FEE2E2",
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
