import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#F5820D",
          dark: "#FF8F00",
          light: "#FFB000",
        },
      },
    },
  },
  plugins: [],
};

export default config;
