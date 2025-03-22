/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Farm Collective custom colors
        sage: {
          50: "#f4f7f4",
          100: "#e6ede6",
          200: "#d0ddd0",
          300: "#aec5ae",
          400: "#85a685",
          500: "#658a65",
          600: "#4d6e4d",
          700: "#3f583f",
          800: "#364836",
          900: "#2f3d2f",
          950: "#172117",
        },
        earth: {
          50: "#f8f6f1",
          100: "#efe9dc",
          200: "#ded1b9",
          300: "#cbb48e",
          400: "#ba9a6d",
          500: "#ad8759",
          600: "#9c744c",
          700: "#815c40",
          800: "#6b4b39",
          900: "#5a4032",
          950: "#30211a",
        },
        harvest: {
          50: "#fff8ed",
          100: "#ffefd4",
          200: "#ffdca8",
          300: "#ffc470",
          400: "#ffa337",
          500: "#ff8811",
          600: "#ff6b00",
          700: "#cc4e02",
          800: "#a13d0a",
          900: "#82340d",
          950: "#461804",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.8 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 4s ease-in-out infinite",
      },
      backgroundImage: {
        "grain-pattern":
          "url('https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&q=30')",
        "field-sunset":
          "url('https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1920&q=80')",
        "farmers-market":
          "url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&q=80')",
        "produce-close":
          "url('https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=1920&q=80')",
      },
      boxShadow: {
        warm: "0 4px 14px -2px rgba(184, 129, 11, 0.1)",
        "warm-lg": "0 10px 25px -3px rgba(184, 129, 11, 0.15)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
