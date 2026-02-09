/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            colors: {
                bg: {
                    deep: '#050505',
                    subtle: '#0a0a0a',
                },
                text: {
                    primary: '#e0e0e0',
                    secondary: '#a0a0a0',
                },
                gold: {
                    matte: '#c5a059',
                    dim: '#8a703e',
                },
                border: {
                    DEFAULT: '#333333',
                }
            },
            gridTemplateColumns: {
                'layout': '300px 1fr',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
