'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const shell = require('gulp-shell');
const sass = require('gulp-sass');

let config = {
  watch: false,
};

function compile(done) {
  let main = Object.assign({}, require('./webpack.config.js'));
  let min = Object.assign({}, require('./webpack.config.min.js'));
  let compiler = webpack([main, min]);

  let isDone = false;
  function callback(err, stats) {
    if (err) {
      throw new Error(err);
    }

    gutil.log(stats.toString({ colors: true }));

    if (!isDone) {
      isDone = true;
      done();
    }
  }

  if (config.watch) {
    compiler.watch({}, callback);
  } else {
    compiler.run(callback);
  }
}

function jekyll() {
  let cmd = 'jekyll serve --watch --config _config.yml,_config_dev.yml';

  return gulp.src('_config.yml', { read: false })
    .pipe(shell([cmd]));
}

function setWatching(done) {
  config.watch = true;
  gulp.watch('_scss/*.scss', css);
  done();
}

function css() {
  return gulp.src([
    './_scss/gallery.scss',
    './_scss/shuffle-styles.scss',
    './_scss/style.scss',
  ])
  .pipe(sass())
  .pipe(gulp.dest('./css/'));
}

// function test() {
//   return gulp.src('test/specs.js')
//     .pipe(jasmine());
// }
// gulp.task(test);

gulp.task('scripts', compile);
gulp.task('set-watching', setWatching);

gulp.task(css);
gulp.task(jekyll);

gulp.task('watch', gulp.series(
  'set-watching',
  gulp.parallel('css', 'scripts'),
  'jekyll'
));

gulp.task('default', gulp.series('scripts'));
