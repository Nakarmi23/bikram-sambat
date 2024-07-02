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
    globalName: 'BikramSambat',
  },
  {
    ...options,
    outDir: 'dist/min',
    entry: ['src/index.ts'],
    config: 'tsconfig.json',
    format: ['cjs'],
    sourcemap: true,
    minify: 'terser',
    outExtension() {
      return {
        js: `.min.js`,
      };
    },
    dts: false,
    clean: true,
  },
  {
    ...options,
    outDir: 'dist/min',
    entry: ['src/index.ts'],
    config: 'tsconfig.json',
    format: ['esm'],
    sourcemap: true,
    minify: 'terser',
    outExtension({ format }) {
      switch (format) {
        case 'esm':
          return {
            js: `.min.mjs`,
          };
        default:
          return {
            js: `.global.min.js`,
          };
      }
    },
    dts: false,
    clean: true,
    globalName: 'BikramSambat',
  },
]);
