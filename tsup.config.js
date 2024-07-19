
import { defineConfig } from 'tsup'

export default defineConfig({
  shims: true,
  splitting: true,
  target: 'esnext',
  platform: 'node',
  format: [
    'cjs',
    'esm',
  ],
  dts: true,
  clean: true,
  entry: [
    'src/index.ts',
  ],
})
