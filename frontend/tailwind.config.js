// tailwind.config.js (ESM)
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "forest",
      "lemonade",
      "autumn",
      {
        mytheme: {
          brand: "#4f9cf9",

        },
      },
    ],
  },
};
