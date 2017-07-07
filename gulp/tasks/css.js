const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

// This is the support list for the website, not shuffle.
const browsersList = [
  '> 1%',
  'last 2 versions',
  'not IE < 11',
  'not BlackBerry <= 10',
];

module.exports = function css() {
  return gulp.src([
    './docs/_scss/shuffle-styles.scss',
    './docs/_scss/style.scss',
  ])
  .pipe(sass())
  .pipe(postcss([autoprefixer({ browsers: browsersList })]))
  .pipe(gulp.dest('./docs/css/'));
};
