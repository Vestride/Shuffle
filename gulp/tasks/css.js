const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

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
  .pipe(sass().on('error', (err) => {
    console.error(err.formatted);
  }))
  .pipe(postcss([autoprefixer({ browsers: browsersList }), cssnano()]))
  .pipe(gulp.dest('./docs/css/'));
};
