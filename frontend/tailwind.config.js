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
      fontFamily: {
        'luckiest-guy': ['"Luckiest Guy"'],
      },
      backgroundImage: {
        'register-bg': "url('/src/assets/login-page1.jpg')", // adjust path
      }
    },
  },
  plugins: [daisyui, flowbiteReact],
  daisyui: {
    themes: ["winter"]
  }
}