/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Ecoloop Color Palette
        'light-blue': '#A8D5E2',
        'orange-web': '#F9A620',
        'mustard': '#FFD449',
        'forest-green': '#548C2F',
        'pakistan-green': '#104911',
        'soft-beige': '#F2EFE5',
        
        // Theme colors
        primary: '#548C2F',
        secondary: '#F9A620',
        accent: '#A8D5E2',
        success: '#104911',
        warning: '#FFD449',
        background: '#F2EFE5',
        
        // UI colors
        border: '#e5e7eb',
        foreground: '#1f2937',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
