import { defineConfig } from 'vitest/config';

// Unit tests for the framework-free packages. The web keeps Playwright, which
// runs against the production build.
export default defineConfig({
	test: {
		include: ['packages/*/src/**/*.test.ts']
	}
});
