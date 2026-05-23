export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'accessibility': '18px',
      },
      colors: {
        'high-contrast': {
          bg: '#000000',
          text: '#FFFFFF',
          accent: '#FFFF00',
        }
      }
    },
  },
  plugins: [],
}