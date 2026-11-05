import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	// Server code reads its settings from process.env; this lets them live in
	// apps/backoffice/.env. Variables already set in the shell win.
	for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ''))) {
		process.env[key] ??= value;
	}

	return { plugins: [sveltekit()] };
});
