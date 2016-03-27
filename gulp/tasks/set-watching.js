'use strict';

const gulp = require('gulp');
const config = require('../config');
const cssTask = require('./css');

module.exports = function setWatching(done) {
  config.watch = true;
  gulp.watch('_scss/*.scss', cssTask);
  done();
};
