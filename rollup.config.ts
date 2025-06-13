import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

export default defineConfig({
  input: ['src/index.js'],
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
      preserveModules: true,
      exports: 'auto',
      sourcemap: true,
    },
    {
      dir: 'dist/esm',
      format: 'esm',
      preserveModules: true,
      exports: 'auto',
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
  external: ['node:fs', 'node:path', 'postcss', 'postcss-selector-parser'],
});
