import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.ts'],
    testTimeout: 120000,
    hookTimeout: 120000,
    teardownTimeout: 120000,
    reporters: ['default'],
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'lcov'],
      exclude: [
        'node_modules/',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.d.ts',
        'src/test-setup.ts',
      ],
    },
  },
});
