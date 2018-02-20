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
const sourcemap = true;

module.exports.configs = [
  {
    input: entry,
    output: {
      name: moduleName,
      file: './dist/shuffle.js',
      sourcemap,
      format,
    },
    cache: undefined,
    plugins: [
      resolve(),
      commonjs(commonjsOptions),
      babel(babelOptions),
    ],
  },

  {
    input: entry,
    output: {
      name: moduleName,
      file: './dist/shuffle.esm.js',
      sourcemap,
      format: 'es',
    },
    cache: undefined,
    plugins: [
      resolve(),
      commonjs(commonjsOptions),
      babel(babelOptions),
    ],
  },

  {
    input: entry,
    output: {
      name: moduleName,
      file: './dist/shuffle.min.js',
      sourcemap,
      format,
    },
    cache: undefined,
    plugins: [
      resolve(),
      commonjs(commonjsOptions),
      babel(babelOptions),
      uglify(uglifyOptions),
    ],
  },
];

module.exports.watch = false;
