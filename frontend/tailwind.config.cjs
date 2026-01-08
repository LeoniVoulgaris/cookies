/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Allows toggling dark mode manually if needed
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    '../cookies/templates/**/*.html',
    './static/js/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
        title: ["Lato", "ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
        body: ["Open Sans", "ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"]
      },
      colors: {
        // Keep your existing neutrals
        neutral: {
          "50": "#f7f7f7",
          "100": "#eeeeee",
          "200": "#e0e0e0",
          "300": "#cacaca",
          "400": "#b1b1b1",
          "500": "#999999",
          "600": "#7f7f7f",
          "700": "#676767",
          "800": "#545454",
          "900": "#464646",
          "950": "#282828"
        },
        // MAP CSS VARIABLES HERE
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          // Note: Shades (50-900) are removed because your CSS var uses a single color.
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Keep your existing radius
        none: "0px",
        full: "9999px"
      }
    }
  },
  plugins: [],
}