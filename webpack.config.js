const path = require('path');

module.exports = {
  name: 'build',
  devtool: 'source-map',
  entry: './src/index.js',
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
