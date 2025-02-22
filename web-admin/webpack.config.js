// webpack.config.js
const path = require('path');

module.exports = {
  // ... tu configuración existente ...
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [
          /node_modules\/face-api\.js/,  // Excluir específicamente face-api.js
          /node_modules/                 // O excluir todos los node_modules si prefieres
        ]
      },
      // Mantén el resto de tus reglas aquí
    ]
  },
  // Ignorar las advertencias de source map
  stats: {
    warningsFilter: [
      /Failed to parse source map/,
      /source-map-loader/
    ]
  },
  // O alternativamente, puedes usar:
  ignoreWarnings: [
    {
      module: /node_modules\/face-api\.js/,
      message: /Failed to parse source map/
    }
  ]
};