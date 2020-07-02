const path = require('path');

module.exports = {
  entry: './src/client/index.js',
  mode: 'development',

  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
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
        // loaders: ["style-loader", "css-loader"]
      },
      // {
      //   test: /\.(png|jpe?g|gif|pdf)$/i,
      //   use: [
      //     {
      //       loader: 'file-loader?name=/src/assets/[name].[ext]',
      //     },
      //   ],
      // },
      {
        test: /\.(png|jpg|pdf)$/,
        loader: 'url-loader'
      }
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
};
