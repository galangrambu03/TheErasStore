/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                folklore: ['folklore', 'sans-serif'],
            },
            colors: {
                'lily-green': '#7CCB5A',
                'forest-green': '#4F8F3A',
                'mint-green': '#B8E986',
                'warm-yellow': '#F7D154',
                'cream': '#FFF4DC',
                'soft-brown': '#8A5A3B',
                'soft-pink': '#F6B5C8',
                'charcoal': '#3B3B3B',
            },
        },
    },
    plugins: [],
}