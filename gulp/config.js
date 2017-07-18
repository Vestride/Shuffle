const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');

const commonjsOptions = {
  include: 'node_modules/**',
};

const babelOptions = {
  exclude: 'node_modules/**',
};

const uglifyOptions = {
  sourceMap: true,
  compress: {
    warnings: true,
    drop_console: true,
  },
  mangle: true,
};

const entry = './src/shuffle.js';
const moduleName = 'Shuffle';
const format = 'umd';
const sourceMap = true;

module.exports.configs = [
  {
    entry,
    cache: undefined,
    plugins: [
      resolve(),
      commonjs(commonjsOptions),
      babel(babelOptions),
    ],
    dest: './dist/shuffle.js',
    sourceMap,
    moduleName,
    format,
  },

  {
    entry,
    cache: undefined,
    plugins: [
      resolve(),
      commonjs(commonjsOptions),
      babel(babelOptions),
      uglify(uglifyOptions),
    ],
    dest: './dist/shuffle.min.js',
    sourceMap,
    moduleName,
    format,
  },
];

module.exports.watch = false;
