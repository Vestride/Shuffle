'use strict';

const gulp = require('gulp');
const config = require('../config');
const cssTask = require('./css');
const testTask = require('./test');

module.exports = function setWatching(done) {
  config.watch = true;
  gulp.watch('_scss/*.scss', cssTask);
  gulp.watch('test/*', testTask);
  done();
};
