const path = require('path');
const gulp = require('gulp');
const shell = require('gulp-shell');

module.exports = function jekyll() {
  const cmd = 'jekyll serve --config _config.yml,_config_dev.yml';

  return gulp.src('docs/_config.yml', { read: false })
    .pipe(shell([cmd], { cwd: path.join(process.cwd(), 'docs') }));
};
