// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js', // Chemin d'entrée de votre application
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Dossier de sortie
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Répertoire des fichiers statiques
    },
    port: 3000,
    open: true,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // URL de votre backend
        changeOrigin: true,
      },
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('Webpack Dev Server is not defined');
      }
      // Vous pouvez ajouter ici des middlewares supplémentaires si nécessaire
      return middlewares;
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader', // Pour utiliser Babel avec Webpack
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'], // Chargement des fichiers CSS avec PostCSS
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Permet de résoudre les extensions
  },
};
