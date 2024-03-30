import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import external from 'rollup-plugin-peer-deps-external'

import pkg from './package.json'
import tsconfig from './tsconfig.json'

const extensions = ['.js', '.ts']

const config = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
        inlineDynamicImports: true
      },
      {
        file: pkg.module,
        format: 'es',
        exports: 'named',
        sourcemap: true,
        inlineDynamicImports: true
      }
    ],
    plugins: [
      commonjs({ extensions }),
      external(),
      json(),
      resolve({ extensions, preferBuiltins: true }),
      typescript({ tsconfig: './tsconfig.json' })
    ]
  },
  {
    input: './dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [
      dts({
        compilerOptions: {
          baseUrl: tsconfig.compilerOptions.baseUrl
        }
      })
    ]
  }
]

export default config
