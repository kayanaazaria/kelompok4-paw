// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Memindai semua file di folder app/ (untuk page, layout, components)
    './app/**/*.{js,ts,jsx,tsx,mdx}', 
    // Memindai semua file di folder components/shared, etc. (jika Anda memisahkannya)
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Memindai file di folder services/ (jika Anda memiliki komponen/class di sana)
    './services/**/*.{js,ts,jsx,tsx,mdx}', 
  ],
  theme: {
    extend: {
      fontFamily: {
        // Definisikan 'sans' (font default) untuk menggunakan Poppins
        sans: ['var(--font-poppins)', 'ui-sans-serif', 'system-ui', 'sans-serif'], 
        // Anda juga bisa definisikan nama font baru (misal: 'heading')
        // heading: ['var(--font-poppins)'],
      },
    },
  },
  plugins: [],
}