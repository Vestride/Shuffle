'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var config = {
  watch: false,
  isProduction: false,
};

function scripts() {
  var opts = {
    watch: config.watch,
    devtool: 'source-map',
    entry: './src/shuffle.es6.js',
    output: {
      filename: './dist/shuffle.js',
      library: 'Shuffle',
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

  if (config.isProduction) {
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
  }

  return new Promise(function (resolve, reject) {
      webpack(opts, function (err, stats) {
        if (err) {
          reject(new gutil.PluginError('webpack', err));
        }

        gutil.log('[webpack]', stats.toString({

        }));

        resolve();
      });
    });
}

gulp.task(scripts);
