import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        serif:   ["var(--font-cormorant)", "Georgia", "serif"],
        sans:    ["var(--font-jost)", "sans-serif"],
      },
      colors: {
        sand:      "#F5EFE4",
        linen:     "#EDE4D6",
        warm:      "#E3D6C3",
        gold:      "#B5894E",
        "gold-lt": "#CFА870",
        "gold-dk": "#8A6530",
        wine:      "#6B2635",
        "wine-lt": "#8A3347",
        "wine-dk": "#4A1820",
        espresso:  "#2C1A10",
        "text-1":  "#251508",
        "text-2":  "#6B5038",
        "text-3":  "#9A8068",
      },
      animation: {
        bob:   "bob 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        bob:   { "0%,100%": { transform: "translateY(0)" },    "50%": { transform: "translateY(7px)"  } },
        float: { "0%,100%": { transform: "translateY(0)" },    "50%": { transform: "translateY(-10px)" } },
      },
    },
  },
  plugins: [],
};
export default config;
