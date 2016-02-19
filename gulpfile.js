'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var browserSync = require('browser-sync').create();
var exec = require('child-process-promise').exec;

var config = {
  watch: true,
  isProduction: false,
};

function compile(mode) {
  var opts = {
    watch: config.watch,
    devtool: 'source-map',
    entry: './src/shuffle.es6.js',
    output: {
      filename: 'shuffle.js',
      path: './dist',
      library: 'shuffle',
      libraryTarget: 'umd',
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query: {
            presets: ['es2015'],
          },
        },
      ],
    },
    plugins: [],
  };

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

  return new Promise(function (resolve, reject) {
      webpack(opts, function (err, stats) {
        if (err) {
          reject(new gutil.PluginError('webpack', err));
        }

        gutil.log('[webpack]', stats.toString());

        resolve();
      });
    });
}

function scriptsMin() {
  return compile('production');
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

gulp.task(serve);
gulp.task('scripts', compile);
gulp.task('scripts-min', scriptsMin);

gulp.task(jekyll);

gulp.task('watch', gulp.series(
  gulp.parallel('jekyll', 'scripts', 'scripts-min'),
  'serve'
));
