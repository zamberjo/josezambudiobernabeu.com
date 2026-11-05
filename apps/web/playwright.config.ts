import { defineConfig } from '@playwright/test';

const ci = !!process.env.CI;

export default defineConfig({
	testDir: './tests',
	// CI must not pass by accident: a forgotten test.only fails the run.
	forbidOnly: ci,
	// In CI, a line per test in the job log and annotations on the PR, plus
	// the HTML report the workflow uploads when something fails.
	reporter: ci ? [['github'], ['list'], ['html', { open: 'never' }]] : 'list',
	use: {
		// The trace of a failed test is in the HTML report: DOM, network and console.
		trace: ci ? 'retain-on-failure' : 'off'
	},
	webServer: {
		// The repo is pnpm-only (there is no npm lockfile), so the specs build and
		// serve through pnpm too. They run against the production build, never the
		// dev server, because the site is prerendered.
		command: 'pnpm run build && pnpm run preview --port 3000',
		port: 3000,
		reuseExistingServer: !ci,
		// Always the committed snapshot: the specs assert what content/portfolio.json
		// says, whatever source the surrounding build uses.
		env: { CONTENT_SOURCE: 'json' }
	}
});
