/**
 * Lighthouse CI against the production build (never the dev server, whose
 * unbundled modules and per-request rendering make every score meaningless).
 *
 *   pnpm lighthouse      build, audit every page, fail under the budgets below
 *
 * Reports land in .lighthouseci/ (one HTML report per page and run).
 */
module.exports = {
	ci: {
		collect: {
			// LHCI serves the build itself and discovers every page in it.
			staticDistDir: 'apps/web/build',
			autodiscoverUrlBlocklist: ['/404.html'],
			// The median of three runs, so one noisy run does not fail the build.
			numberOfRuns: 3,
			settings: {
				// Lighthouse's default: a mid-range phone on a slow 4G connection.
				chromeFlags: '--no-sandbox'
			}
		},
		assert: {
			assertions: {
				'categories:performance': ['error', { minScore: 0.9 }],
				'categories:accessibility': ['error', { minScore: 0.9 }],
				'categories:best-practices': ['error', { minScore: 0.9 }],
				'categories:seo': ['error', { minScore: 0.9 }],
				'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
				'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }]
			}
		},
		upload: { target: 'filesystem', outputDir: '.lighthouseci' }
	}
};
