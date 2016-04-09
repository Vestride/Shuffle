'use strict';

const gulp = require('gulp');

gulp.task('scripts', require('./gulp/tasks/compile'));
gulp.task('set-watching', require('./gulp/tasks/set-watching'));
gulp.task('css', require('./gulp/tasks/css'));
gulp.task('jekyll', require('./gulp/tasks/jekyll'));
gulp.task('test', require('./gulp/tasks/test'));

gulp.task('watch', gulp.series(
  'set-watching',
  gulp.parallel('css', 'scripts'),
  'jekyll'
));

gulp.task('default', gulp.series('scripts', 'test'));
