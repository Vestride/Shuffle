/* eslint-disable import/no-extraneous-dependencies */
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const moduleName = 'Shuffle';

export default {
  input: './src/shuffle.js',
  output: [
    {
      name: moduleName,
      file: './dist/shuffle.js',
      sourcemap: true,
      format: 'umd',
    },
    {
      name: moduleName,
      file: './dist/shuffle.esm.js',
      sourcemap: true,
      format: 'es',
    },
    {
      name: moduleName,
      file: './dist/shuffle.min.js',
      sourcemap: true,
      format: 'umd',
      plugins: [
        terser({
          compress: {
            warnings: true,
            drop_console: true,
          },
        }),
      ],
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      exclude: '**/node_modules/**',
      babelHelpers: 'bundled',
    }),
  ],
};
