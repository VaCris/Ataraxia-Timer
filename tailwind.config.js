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
                accent: "#e11d48",
                cream: "#f5f5f7",
            },
            boxShadow: {
                'glow': '0 0 20px -5px rgba(225, 29, 72, 0.3)',
            }
        },
    },
    plugins: [],
}