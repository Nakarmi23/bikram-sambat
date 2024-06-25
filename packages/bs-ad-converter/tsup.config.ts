import { Options, defineConfig } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/index.ts'],
  clean: true,
  format: ['esm', 'cjs', 'iife'],
  noExternal: ['lodash', 'dayjs'],
  minify: options.watch ? false : 'terser',
  globalName: 'bikramSambat',
  treeshake: 'smallest',
  sourcemap: true,
  ...options,
}));
