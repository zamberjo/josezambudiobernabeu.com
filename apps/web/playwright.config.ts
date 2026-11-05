import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	webServer: {
		// The repo is pnpm-only (there is no npm lockfile), so the specs build and
		// serve through pnpm too. They run against the production build, never the
		// dev server, because the site is prerendered.
		command: 'pnpm run build && pnpm run preview --port 3000',
		port: 3000,
		reuseExistingServer: !process.env.CI
	}
});
