import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node16',
  shims: true,
  clean: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
