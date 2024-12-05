/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    fontFamily: {
      sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'Arial', 'sans-serif'],
    },
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/forms"),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#fc8e8e",
          secondary: "#f6d860",
          neutral: "#f1f1f1",
          success: "#92ffb3",
          warning: "#fbbf24",
          error: "#ef4444",
          info: "#9bb6ff",


        },
      },
    ],
    darkTheme: null, // Não define um tema escuro padrão
    base: true, // Aplica as cores base automaticamente ao root
    styled: true, // Inclui decisões de design do DaisyUI
    utils: true, // Adiciona classes utilitárias responsivas e modificadoras
    prefix: "", // Define um prefixo para classes DaisyUI, se necessário
    logs: true, // Exibe logs do DaisyUI no console durante o build
    themeRoot: ":root", // Define o elemento que recebe as variáveis de cores
  },
};
