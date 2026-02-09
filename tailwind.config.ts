import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "var(--color-brand-gold)",
          blue: "var(--color-brand-blue)",
          rose: "var(--color-brand-rose)",
          beige: "var(--color-brand-beige)",
          lilac: "var(--color-brand-lilac)",
          sage: "var(--color-brand-sage)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-playfair)"],
      },
    },
  },
  plugins: [],
};

export default config;
