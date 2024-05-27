import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['src/**/__tests__/**/*.test.{js,ts}'],
    reporters: 'verbose',
    environment: 'jsdom',
    coverage: {
      provider: 'v8'
    },
    globals: true,
    deps: {
      moduleDirectories: ['node_modules', path.resolve('./node_modules')],
    },
    mockReset: true
  }
});
