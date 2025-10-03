// tailwind.config.js (ESM)
import daisyui from "daisyui";
import flowbiteReact from "flowbite-react/plugin/tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ".flowbite-react/class-list.json"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'register-bg': "url('/src/assets/login-page1.jpg')",
      },

    },
  },

  plugins: [daisyui, flowbiteReact, require("tailwind-scrollbar")],
  daisyui: {
    themes: ["winter"]
  },
  assetsInclude: ['**/*.lottie'],
}

