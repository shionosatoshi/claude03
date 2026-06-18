import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#f1f8f3",
          100: "#dcefe2",
          500: "#4f9f73",
          700: "#2f6f50"
        },
        aqua: {
          50: "#effafd",
          100: "#d6f1f8",
          500: "#3a9fb7",
          700: "#217285"
        },
        skysoft: "#eef6ff",
        ink: "#1f2933"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(31, 41, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
