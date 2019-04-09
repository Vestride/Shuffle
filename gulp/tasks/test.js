const gulp = require('gulp');
const shell = require('gulp-shell');

module.exports = function test() {
  return gulp.src('package.json', {
    read: false,
  })
    .pipe(shell(['npx jest']));
};
