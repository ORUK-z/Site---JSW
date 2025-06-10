/**
 * tailwind.config.js
 * Arquivo de configuração para o Tailwind CSS.
 * Para uso em um ambiente de desenvolvimento com build step.
 */
module.exports = {
  content: [
    // Analisa todas as classes usadas nos arquivos HTML na raiz.
    './*.html', 
  ],
  theme: {
    extend: {
      // Adiciona a fonte 'Inter' ao tema padrão do Tailwind.
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      // Aqui você pode estender outras propriedades como cores, espaçamentos, etc.
    },
  },
  plugins: [
    // Aqui você pode adicionar plugins do Tailwind, se necessário.
  ],
}