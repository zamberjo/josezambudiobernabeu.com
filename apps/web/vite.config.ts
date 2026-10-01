import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// The composition root reads CONTENT_SOURCE and the Supabase settings from
	// process.env at prerender time; this lets them live in apps/web/.env too.
	// Variables already set in the shell win.
	for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ''))) {
		process.env[key] ??= value;
	}

	return { plugins: [tailwindcss(), sveltekit()] };
});
