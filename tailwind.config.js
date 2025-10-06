/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Ensure Tailwind's `font-sans` uses Noto Sans across the project
        sans: ['"Noto Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
