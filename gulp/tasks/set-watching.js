const gulp = require('gulp');
const config = require('../config');
const cssTask = require('./css');
const testTask = require('./test');
const scriptsTask = require('./scripts');

module.exports = function setWatching(done) {
  config.watch = true;
  gulp.watch('docs/_scss/**/*.scss', cssTask);
  gulp.watch('test/*', testTask);

  // Since Jekyll doesn't watch sym-linked directories, copy the files manually.
  gulp.watch('src/*', () => scriptsTask().then(
    () => gulp.src('dist/*').pipe(gulp.dest('docs/_site/dist/')) // eslint-disable-line
  ));

  done();
};
