'use strict';

require('babel-register');
var babelJest = require('babel-jest');
var webpackAlias = require('jest-webpack-alias');

module.exports = {
  process: function (src, filename) {
    if (filename.indexOf('node_modules') === -1 && filename.match(/\.jsx?$/)) {
      src = babelJest.process(src, filename);
      src = webpackAlias.process(src, filename);
    }

    return src;
  },
};
