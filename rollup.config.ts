import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

const external = ['node:fs', 'node:path', 'postcss', 'postcss-selector-parser'];

export default defineConfig([
  {
    input: 'src/index.mjs',
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
        preserveModules: true,
        exports: 'auto',
        sourcemap: true,
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
        dir: 'dist/cjs',
        format: 'cjs',
        preserveModules: true,
        exports: 'auto',
        sourcemap: true,
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
