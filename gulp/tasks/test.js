const gulp = require('gulp');
const mochaPhantomJS = require('gulp-mocha-phantomjs');
const config = require('../config');

module.exports = function test() {
  return gulp.src('test/runner.html', {
    read: false,
  })
  .pipe(mochaPhantomJS({
    phantomjs: {
      useColors: true,
    },
  }))

  // https://github.com/gulpjs/gulp/issues/259#issuecomment-61976830
  .on('error', function onerror(err) {
    if (config.watch) {
      console.error(err.message);
      this.emit('end');
    }
  });
};
