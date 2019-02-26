const path = require('path');

module.exports = () => {
  return {
    entry: './src/index.js',
    mode: 'development',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js'
    },
    module: {
      rules: [
        {
          test: [/\.jsx?$/],
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['@babel/env']
          }
        },
        {
          test: /\.mp3$/,
          // include: /sounds/,
          loader: 'file-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '*'],
    },
    devtool: 'inline-source-map'
  };
} 