import { Options, defineConfig } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/index.ts'],
  clean: true,
  format: ['cjs'],
  minify: options.watch ? false : 'terser',
  ...options,
}));
