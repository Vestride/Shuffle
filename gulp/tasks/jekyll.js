'use strict';

const gulp = require('gulp');
const shell = require('gulp-shell');

module.exports = function jekyll() {
  let cmd = 'jekyll serve --watch --config _config.yml,_config_dev.yml';

  return gulp.src('_config.yml', { read: false })
    .pipe(shell([cmd]));
};
