import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true, // Esta linha centraliza o conteúdo
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // ... (o restante do seu tema, que já está correto)
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;