const path = require('path');

module.exports = {
  entry: './src/client/index.js',
  mode: 'development',

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        loader: 'style-loader!css-loader',
      },
    ],

  },
};
