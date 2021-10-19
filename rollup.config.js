import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

import pkg from './package.json'

const extensions = ['.js', '.ts']

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true
    }
  ],
  plugins: [
    babel({
      extensions,
      babelHelpers: 'bundled',
      include: ['src/**/*']
    }),
    commonjs({ extensions }),
    resolve({ extensions })
  ]
}

export default config
