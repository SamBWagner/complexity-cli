import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node16',
  shims: true,
  inlineOnly: false,
  fixedExtension: false,
  clean: true,
});
