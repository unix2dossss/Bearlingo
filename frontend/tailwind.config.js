import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'register-bg': "url('/src/assets/login-page1.jpg')", // adjust path
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["winter"]
  }
}