const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/shuffle.es6.js',
  output: {
    filename: 'shuffle.js',
    path: './dist',
    library: 'shuffle',
    libraryTarget: 'umd',
  },
  resolve: {
    root: [path.resolve('./src')],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },
  plugins: [],
};
