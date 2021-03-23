const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');

const commonjsOptions = {
  include: 'node_modules/**',
};

const babelOptions = {
  exclude: 'node_modules/**',
};

const minifyOptions = {
  compress: {
    warnings: true,
    drop_console: true,
  },
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
    plugins: [nodeResolve(), commonjs(commonjsOptions), babel(babelOptions)],
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
    plugins: [nodeResolve(), commonjs(commonjsOptions), babel(babelOptions)],
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
    plugins: [nodeResolve(), commonjs(commonjsOptions), babel(babelOptions), terser(minifyOptions)],
  },
];

module.exports.watch = false;
