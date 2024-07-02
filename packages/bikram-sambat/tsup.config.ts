import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig((options: Options) => [
  {
    ...options,
    entry: ['src/index.ts'],
    config: 'tsconfig.json',
    format: ['cjs'],
    sourcemap: false,
    dts: true,
    clean: true,
  },
  {
    ...options,
    entry: ['src/index.ts'],
    config: 'tsconfig.json',
    format: ['esm'],
    sourcemap: false,
    dts: false,
    clean: true,
  },
]);
