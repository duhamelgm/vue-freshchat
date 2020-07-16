  
import vue from 'rollup-plugin-vue'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'

const dist = 'dist/';
const name = 'vue-freshchat';

export default {
  globals: { vue: 'Vue' },
  input: 'src/index.js',
  output: [
    {
      file: `${dist}${name}.cjs.js`,
      format: 'cjs'
    },
    {
      file: `${dist}${name}.esm.js`,
      format: 'esm'
    },
    {
      file: `${dist}${name}.js`,
      format: 'umd',
      name: 'VueFreshchat'
    }
  ],
  plugins: [
    resolve(),
    babel({ babelHelpers: 'bundled' }),
    vue()
  ]
}