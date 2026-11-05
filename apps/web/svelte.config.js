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
		// Content Security Policy, as a <meta> in every prerendered page. SvelteKit
		// hashes its own inline bootstrap script into script-src, so no other
		// inline script can run. firebase.json sends a header policy as well,
		// with what a <meta> cannot carry (frame-ancestors); a page must satisfy
		// both. See "Security headers" in the README.
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'script-src': ['self'],
				// Style attributes (Svelte's style: directives, app.html) cannot be hashed.
				'style-src': ['self', 'unsafe-inline'],
				// Article images and covers may live in Supabase Storage or elsewhere.
				'img-src': ['self', 'data:', 'https:'],
				'font-src': ['self'],
				'connect-src': ['self'],
				'manifest-src': ['self'],
				'object-src': ['none'],
				'base-uri': ['self'],
				'form-action': ['self'],
				'upgrade-insecure-requests': true
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
