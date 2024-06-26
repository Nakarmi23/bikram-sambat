import { Options, defineConfig } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/index.ts'],
  clean: true,
  format: ['esm', 'cjs'],
  minify: options.watch ? false : 'terser',
  dts: true,
  treeshake: 'recommended',
  ...options,
}));
