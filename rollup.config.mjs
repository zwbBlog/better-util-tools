import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import eslint from '@rollup/plugin-eslint';
import { uglify } from 'rollup-plugin-uglify';
// import copy from 'rollup-plugin-copy';
// rollup.config.js
export default {
  // 核心选项
  input: './src/index',
  plugins: [
    eslint({
      fix: true,
      throwOnError: true,
      throwOnWarning: false,
      include: ['src/**'],
    }),
    typescript(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
    uglify({
      compress: {
        'drop_console': true, // 过滤 console
        'drop_debugger': true // 过滤 debugger
      }
    }),
    terser(),
    // copy({
    //   targets: [
    //     {
    //       src: 'src/test/',
    //       dest: 'dist/'
    //     }
    //   ]
    // })
  ],
  // 必须 (如果要输出多个，可以是一个数组)
  // 核心选项
  output: [
    {
      file: './dist/better-util-tools.min.js',
      name: 'BetterUtilTools',
      format: 'umd',
    }
  ]
};
