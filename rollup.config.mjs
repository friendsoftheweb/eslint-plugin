import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import { defineConfig } from 'rollup';

const external = ['node:fs', 'node:path', 'postcss', 'postcss-selector-parser'];

/** @type {import('rollup').OutputOptions} */
const output = {
  exports: 'auto',
  sourcemap: true,
};

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        ...output,
        dir: 'dist/esm',
        format: 'esm',
      },
    ],
    plugins: [
      json(),
      typescript({
        outDir: 'dist/esm',
      }),
    ],
    external,
  },
  {
    input: 'src/index.ts',
    output: [
      {
        ...output,
        dir: 'dist/cjs',
        format: 'cjs',
      },
    ],
    plugins: [
      json(),
      typescript({
        outDir: 'dist/cjs',
      }),
    ],
    external,
  },
]);
