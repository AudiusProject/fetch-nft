import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import external from 'rollup-plugin-peer-deps-external'

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
    commonjs({ extensions }),
    external(),
    json(),
    resolve({ extensions, preferBuiltins: true }),
    typescript({ tsconfig: './tsconfig.json' })
  ]
}

export default config
