/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme:
    {
    mytheme: {
      "primary": "#eb6f95",
      "base-content": "#f3f4f6",
      "secondary": "#f6d860",
      "accent": "#37cdbe",
      "neutral": "#3d4451",
      "base-100": "#f5f5f5",
      "base-200": "#fda4af",
      "success":"#22c55e",
      "warning": "#fbbf24",
      "error": "#ef4444",
      "info": "#4a90e2",
    },
    extend: {},
  },
  plugins: [require('daisyui'),],
  daisyui: {
    themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: null, // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
}

