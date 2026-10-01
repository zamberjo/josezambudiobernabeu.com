import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// adapter-node so `pnpm build && node build` also works, but the intended
		// use is `pnpm backoffice` (vite dev) on the editor's machine.
		adapter: adapter()
	}
};

export default config;
