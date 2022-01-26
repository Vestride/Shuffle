const gulp = require('gulp');
const dartSass = require('sass');
const gulpSass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const sass = gulpSass(dartSass);

module.exports = function css() {
  return gulp
    .src(['./docs/_scss/shuffle-styles.scss', './docs/_scss/style.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest('./docs/css/'));
};
