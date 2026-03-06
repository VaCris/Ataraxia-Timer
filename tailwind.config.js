/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0a0a0a",
                surface: "#141414",
                accent: "rgb(var(--color-accent-rgb) / <alpha-value>)",
                cream: "#f5f5f7",
            },
            boxShadow: {
                'glow': '0 0 20px -5px rgb(var(--color-accent-rgb) / 0.4)',
            }
        },
    },
    plugins: [],
}