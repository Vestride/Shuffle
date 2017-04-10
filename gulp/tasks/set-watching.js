const gulp = require('gulp');
const config = require('../config');
const cssTask = require('./css');
const testTask = require('./test');
const scriptsTask = require('./scripts');

module.exports = function setWatching(done) {
  config.watch = true;
  gulp.watch('_scss/*.scss', cssTask);
  gulp.watch('test/*', testTask);
  gulp.watch('src/*', scriptsTask);
  done();
};
