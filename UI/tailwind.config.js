/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
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
        SideNavBarColor: "#9893DA",
        BackG: "#5f55ee",
        C_White: "#00000",
        Cus_Orage: "#68A691",
        C_Button: "#EB980A",
        C_ButtonHover: "#F7B23B",
        Open: "#5f55ee",
        Completed: "#008844",
        InProgress: "#B660E0",
        Reviewed: "#F8AE00",
        foreground: "hsl(var(--foreground))",
        HeaderSearchButton: {
          DEFAULT: "#474964",
        },
        HeaderSearchButtonHover: {
          DEFAULT: "#5b5d79",
        },
        HeaderBackground: {
          DEFAULT: "#92B4F4",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },

        primary_hover: {
          DEFAULT: "hsl(var(--primary-hover))",
        },
        filter_buttons: {
          DEFAULT: "hsl(var(--filter_buttons))",
          foreground: "hsl(var(--filter_buttons-foreground))",
        },
        filter_buttons_text: "rgb( 101, 111, 125 )",
        filter_buttons_hover: {
          DEFAULT: "hsl(var(--primary-hover))",
          foreground: "hsl(var(--filter_buttons-foreground))",
        },
        filter_buttons_active: "",
        filter_buttons_active_hover: "",
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
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.8, 0, 1, 1)",
      },
      keyframes: {
        refine: {
          "0%": {
            left: "0%",
          },
          "20%": {
            left: "-50%",
          },
          "40%": {
            left: "0%",
          },
          "60%": {
            left: "50%",
          },
          "80%": {
            left: "0%",
          },
          "100%": {
            left: "0%",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin 3s linear infinite",
        "bounce-Right": "refine 2s infinite",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
