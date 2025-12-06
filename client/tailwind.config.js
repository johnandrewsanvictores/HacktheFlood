// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Extracted from Reference
        brand: {
          primary: "#1E6EF6",
          "primary-dark": "#0D5EE8",
          "primary-light": "#2B7FF9",
          accent: "#3B8FFF",
          "accent-light": "#5BA3FF",
        },
        // Semantic Colors
        primary: {
          DEFAULT: "#1E6EF6",
          50: "#EBF3FF",
          100: "#D6E7FF",
          200: "#ADCFFF",
          300: "#85B7FF",
          400: "#5C9FFF",
          500: "#1E6EF6",
          600: "#0D5EE8",
          700: "#0B4EC4",
          800: "#093EA0",
          900: "#072E7C",
        },
        secondary: {
          DEFAULT: "#2B7FF9",
          light: "#5BA3FF",
          dark: "#0D5EE8",
        },
      },
      fontSize: {
        h1: "3.815rem",
        h2: "3.052rem",
        h3: "2.441rem",
        h4: "1.953rem",
        h5: "1.563rem",
        h6: "1.25rem",
        p: "1rem",
        small: "0.8rem",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "system-ui", "sans-serif"],
        display: ["Inter", "Poppins", "system-ui", "sans-serif"],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
      borderRadius: {
        sm: "0.5rem",
        DEFAULT: "0.75rem",
        md: "0.875rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #2B7FF9 0%, #1E6EF6 50%, #0D5EE8 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, #5BA3FF 0%, #2B7FF9 50%, #1E6EF6 100%)",
        "hero-gradient": "linear-gradient(135deg, #2B7FF9 0%, #1E6EF6 100%)",
      },
      boxShadow: {
        brand: "0 4px 14px 0 rgba(30, 110, 246, 0.2)",
        "brand-lg": "0 10px 40px 0 rgba(30, 110, 246, 0.3)",
        soft: "0 2px 8px 0 rgba(0, 0, 0, 0.1)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },
    },
  },
};
