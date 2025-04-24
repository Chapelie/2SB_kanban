module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // Autres extensions...
      animation: {
        'modalFadeIn': 'modalFadeIn 0.2s ease-out forwards',
        'slideDown': 'slideDown 0.2s ease-out forwards',
      },
      keyframes: {
        modalFadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};