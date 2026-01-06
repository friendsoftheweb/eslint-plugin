import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

const external = ['node:fs', 'node:path', 'postcss', 'postcss-selector-parser'];

/** @type {import('rollup').OutputOptions} */
const output = {
  preserveModules: true,
  exports: 'auto',
  sourcemap: true,
};

export default defineConfig([
  {
    input: 'src/index.mjs',
    output: [
      {
        ...output,
        dir: 'dist/esm',
        format: 'esm',
      },
    ],
    plugins: [
      typescript({
        outDir: 'dist/esm',
      }),
    ],
    external,
  },
  {
    input: 'src/index.mjs',
    output: [
      {
        ...output,
        dir: 'dist/cjs',
        format: 'cjs',
      },
    ],
    plugins: [
      typescript({
        outDir: 'dist/cjs',
      }),
    ],
    external,
  },
]);
