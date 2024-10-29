// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/index.js',  // Le fichier d'entrée de votre application
    output: {
        filename: 'bundle.js',  // Nom du fichier de sortie
        path: path.resolve(__dirname, 'dist')  // Dossier de sortie
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Fichiers JavaScript
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('tailwindcss'),
                                    require('autoprefixer')
                                ]
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // Spécifiez le chemin vers votre fichier HTML
            filename: 'index.html' // Nom du fichier généré dans le dossier de sortie
        })
    ],
    mode: 'production'  // Mode (peut aussi être 'production' pour un build optimisé)
};
