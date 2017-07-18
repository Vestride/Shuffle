const gulp = require('gulp');
const config = require('../config');
const cssTask = require('./css');
const testTask = require('./test');

module.exports = function setWatching(done) {
  config.watch = true;
  gulp.watch('docs/_scss/**/*.scss', cssTask);
  gulp.watch('test/*', testTask);

  // Copy dist directory to docs. GitHub pages don't work with symlinks.
  gulp.watch('src/*', gulp.series('scripts', 'copy-dist'));

  done();
};
