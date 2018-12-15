const gulp = require('gulp');

gulp.task('scripts', require('./gulp/tasks/scripts'));
gulp.task('copy-dist', require('./gulp/tasks/copy-dist'));
gulp.task('set-watching', require('./gulp/tasks/set-watching'));
gulp.task('css', require('./gulp/tasks/css'));
gulp.task('jekyll', require('./gulp/tasks/jekyll'));
gulp.task('test', require('./gulp/tasks/test'));

gulp.task('watch', gulp.series(
  'set-watching',
  gulp.parallel('css', 'scripts'),
  'copy-dist',
  'jekyll',
));

gulp.task('default', gulp.series('scripts', 'css', 'test', 'copy-dist'));
