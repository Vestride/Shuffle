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
    modules: [
      path.resolve('./src'),
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [],
};
