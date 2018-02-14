const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = function css() {
  return gulp.src([
    './docs/_scss/shuffle-styles.scss',
    './docs/_scss/style.scss',
  ])
    .pipe(sass().on('error', (err) => {
      console.error(err.formatted);
    }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest('./docs/css/'));
};
