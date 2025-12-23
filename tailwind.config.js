/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: '#14B8A6', // Teal-500
                secondary: '#6366F1', // Indigo-500
            },
            animation: {
                'bg-orbit': 'bg-orbit 40s linear infinite alternate',
                'pulse-icon': 'pulse-icon 2.3s infinite ease-in-out',
                'subtle-shake': 'subtle-shake 4s infinite 1s',
                'border-spin': 'border-spin 18s linear infinite',
                'float-soft': 'float-soft 5s ease-in-out infinite',
                'fade-in-up': 'fade-in-up 0.7s ease-out both',
                'modal-pop': 'modal-pop 0.35s ease-out',
                'scroll-dot': 'scroll-dot 1.6s ease-in-out infinite',
            },
            keyframes: {
                'bg-orbit': {
                    '0%': { transform: 'translate3d(0, 0, 0) scale(1)', filter: 'blur(0)' },
                    '50%': { transform: 'translate3d(10px, -20px, 0) scale(1.03)', filter: 'blur(1px)' },
                    '100%': { transform: 'translate3d(-10px, 10px, 0) scale(1.02)', filter: 'blur(0.5px)' },
                },
                'pulse-icon': {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '50%': { transform: 'scale(1.06)', opacity: '0.92' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'subtle-shake': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '20%, 60%': { transform: 'translateX(-2px)' },
                    '40%, 80%': { transform: 'translateX(2px)' },
                },
                'border-spin': {
                    '0%': { transform: 'rotate(0)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                'float-soft': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(18px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'modal-pop': {
                    '0%': { transform: 'scale(0.9) translateY(10px)', opacity: '0' },
                    '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
                },
                'scroll-dot': {
                    '0%': { opacity: '0', transform: 'translate(-50%, 0)' },
                    '50%': { opacity: '1', transform: 'translate(-50%, 8px)' },
                    '100%': { opacity: '0', transform: 'translate(-50%, 14px)' },
                }
            }
        },
    },
    plugins: [],
}

