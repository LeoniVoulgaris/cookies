/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../cookies/templates/**/*.html',  // Django templates
    './static/js/**/*.js'               // JS files if using classes there
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
