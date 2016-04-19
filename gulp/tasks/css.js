'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

module.exports = function css() {
  return gulp.src([
    './_scss/shuffle-styles.scss',
    './_scss/style.scss',
  ])
  .pipe(sass())
  .pipe(postcss([autoprefixer()]))
  .pipe(gulp.dest('./css/'));
};
