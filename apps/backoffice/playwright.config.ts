import { defineConfig } from '@playwright/test';

// Its own port, so the suite never lands on an editor's running backoffice
// (which may point at the production database).
const port = Number(process.env.BACKOFFICE_TEST_PORT ?? 5184);

export default defineConfig({
	testDir: './tests',
	use: { baseURL: `http://localhost:${port}` },
	webServer: {
		// Local stack only, and no GitHub token: Publish must not deploy for real.
		command: `GITHUB_TOKEN= sh ../../scripts/with-local-supabase.sh pnpm exec vite dev --port ${port} --strictPort`,
		port,
		reuseExistingServer: false
	}
});
