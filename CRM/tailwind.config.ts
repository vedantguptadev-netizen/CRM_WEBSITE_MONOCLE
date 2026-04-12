import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
        },
      },
    },
  },
  plugins: [],
};
export default config;
