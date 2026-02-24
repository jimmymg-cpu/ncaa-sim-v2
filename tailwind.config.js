/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Inter"', 'sans-serif'],
                display: ['"Teko"', 'sans-serif'],
                score: ['"Bebas Neue"', 'sans-serif'],
                mono: ['"Inter"', 'monospace'], // Fallback mono to Inter for cleaner stats
            },
            colors: {
                'game-dark': '#050505',
                'game-panel': '#111111',
                'console-gold': '#fbbf24',
                'console-blue': '#2563eb',
                'console-red': '#dc2626',
                'console-surface': '#1a1a1a',
            },
            backgroundImage: {
                'court-texture': "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
                'carbon-texture': "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
            }
        }
    },
    plugins: [],
}
