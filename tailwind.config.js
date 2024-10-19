/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        secondary: '#10B981',
        accent: '#F59E0B',
        background: '#F3F4F6',
        text: '#111827',
      },
      animation: {
        droplet: 'dropletEffect 6s infinite ease-in-out',
        mucus: 'mucusShape 8s infinite ease-in-out', // Ajout de l'animation mucus
        fadeIn: 'fadeIn 0.5s ease forwards',
      },
      keyframes: {
        dropletEffect: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '25%': { transform: 'scale(1.2) translateY(-10%)', opacity: '0.8' },
          '50%': { transform: 'scale(0.8) translateY(10%)', opacity: '0.6' },
          '75%': { transform: 'scale(1.1) translateY(-5%)', opacity: '0.9' },
        },
        mucusShape: {
          '0%': {
            borderRadius: '60% 40% 30% 70% / 30% 60% 40% 60%',
            transform: 'scale(1)',
          },
          '50%': {
            borderRadius: '40% 60% 70% 30% / 60% 30% 60% 40%',
            transform: 'scale(1.1)',
          },
          '100%': {
            borderRadius: '60% 40% 30% 70% / 30% 60% 40% 60%',
            transform: 'scale(1)',
          },
        },
        
        
      },
    },
  },
  plugins: [],
};
