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
                serif: ['Playfair Display', 'serif'],
            },
            colors: {
                wurm: {
                    bg: '#050505',
                    panel: '#0a0a0a',
                    border: '#262626',
                    accent: '#d4b483', // Guild Gold
                    accentDim: '#8a7453',
                    success: '#3e6b46',
                    warning: '#b45309',
                    text: '#e5e5e5',
                    muted: '#737373'
                },
                // Keep existing semantic names mapped to new palette for backward compatibility
                bg: {
                    deep: '#050505',
                    subtle: '#0a0a0a',
                },
                text: {
                    primary: '#e5e5e5',
                    secondary: '#737373',
                },
                border: {
                    DEFAULT: '#262626',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
