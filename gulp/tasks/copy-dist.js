const gulp = require('gulp');

// Copy dist directory to docs. GitHub pages don't work with symlinks.
module.exports = function copyDist() {
  return gulp.src('dist/*')
    .pipe(gulp.dest('docs/dist/'));
};
