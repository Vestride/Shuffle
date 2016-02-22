'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const browserSync = require('browser-sync').create();
const exec = require('child-process-promise').exec;

// const jasmine = require('gulp-jasmine');

// require('babel-core/register');

var config = {
  watch: false,
  isProduction: false,
};

function compile(done, mode) {
  var opts = Object.assign({}, require('./webpack.config.js'));

  opts.watch = config.watch;
  opts.progress = true;

  if (mode === 'production') {
    // Search for equal or similar files and deduplicate them in the output.
    opts.plugins.push(new webpack.optimize.DedupePlugin());

    // Minimize all JavaScript output of chunks.
    opts.plugins.push(new webpack.optimize.UglifyJsPlugin({
      comments: false,
      screw_ie8: true,
      compress: {
        drop_console: true,
      },
      mangle: true,
    }));

    opts.watch = false;

    opts.output.filename = 'shuffle.min.js';
  }

  var isDone = false;
  webpack(opts, function (err, stats) {
    if (err) {
      throw new Error(err);
    }

    gutil.log(stats.toString({ colors: true }));

    if (!isDone) {
      isDone = true;
      done();
    }
  });
}

function scriptsMin(done) {
  return compile(done, 'production');
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './_site',
    },
    open: false,
  });

  gulp.watch([
    '_includes/**/*.*',
    '_layouts/**/*.*',
    '_posts/**/*.*',
    'css/**/*.*',
    'dist/**/*.*',
    'js/**/*',
  ], jekyllIncremental);
}

function logExec(result) {
  if (result.stderr) {
    console.error(result.stderr);
  }

  console.log(result.stdout);
}

function jekyll(incremental) {
  var cmd = 'jekyll build --config _config.yml,_config_dev.yml';

  if (incremental) {
    cmd += ' --incremental';
  }

  return exec(cmd).then(logExec);
}

function jekyllIncremental() {
  return jekyll(true).then(browserSync.reload);
}

function setWatching() {
  config.watch = true;
}

// function test() {
//   return gulp.src('test/specs.js')
//     .pipe(jasmine());
// }
// gulp.task(test);

gulp.task('scripts', compile);
gulp.task('scripts-min', scriptsMin);
gulp.task('set-watching', setWatching);

gulp.task(serve);
gulp.task(jekyll);

gulp.task('watch', gulp.series(
  'set-watching',
  gulp.parallel('jekyll', 'scripts', 'scripts-min'),
  'serve'
));
