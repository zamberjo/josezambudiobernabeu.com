import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	webServer: {
		command: 'npm run build && npm run preview -- --port 3000',
		port: 3000,
		reuseExistingServer: !process.env.CI
	}
});
