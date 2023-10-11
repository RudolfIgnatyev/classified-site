const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  // подключаем плагины к PostCSS
  plugins: [
    // подключаем autoprefixer
    autoprefixer,
    cssnano({ preset: 'default' })
  ]
};
