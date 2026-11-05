import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Every route is prerendered. The fallback is only the 404 page: Firebase
		// serves it, with a 404 status, for any path that is not a built file.
		adapter: adapter({ fallback: '404.html' }),
		prerender: {
			// Nothing links to the sitemap or the feeds, so the crawler is told.
			entries: ['*', '/sitemap.xml', '/rss.xml', '/en/rss.xml'],
			// With no readable posts, the post route has no pages to build, which
			// is fine; any other prerenderable route left unbuilt is still an error.
			handleUnseenRoutes: ({ routes, message }) => {
				if (routes.some((route) => route !== '/[[lang=lang]]/blog/[slug]'))
					throw new Error(message);
			}
		},
		alias: {
			// The content snapshot lives at the repo root, shared with the seed
			// script, the unit tests and the backoffice.
			$content: '../../content'
		}
	}
};

export default config;
