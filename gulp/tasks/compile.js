'use strict';

const gutil = require('gulp-util');
const webpack = require('webpack');
const config = require('../config');

module.exports = function compile(done) {
  let main = Object.assign({}, require('../../webpack.config.js'));
  let min = Object.assign({}, require('../../webpack.config.min.js'));
  let compiler = webpack([main, min]);

  let isDone = false;
  function callback(err, stats) {
    if (err) {
      throw new Error(err);
    }

    gutil.log(stats.toString({ colors: true }));

    if (!isDone) {
      isDone = true;
      done();
    }
  }

  if (config.watch) {
    compiler.watch({}, callback);
  } else {
    compiler.run(callback);
  }
};
