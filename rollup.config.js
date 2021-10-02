import commonjs from '@rollup/plugin-commonjs';

export default {
  input: './src/scripts/main.js',
  output: {
    dir: 'dist',
    format: 'iife'
  },
  plugins: [commonjs()]
};