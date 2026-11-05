/** Server-only settings, read once. Missing Supabase settings stop the server at start-up. */
function required(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`The backoffice needs ${name}; see apps/backoffice/.env.example`);
	return value;
}

export const env = {
	supabaseUrl: required('SUPABASE_URL'),
	supabaseKey: required('SUPABASE_PUBLISHABLE_KEY'),
	githubToken: process.env.GITHUB_TOKEN || undefined,
	githubRepository: process.env.GITHUB_REPOSITORY || 'zamberjo/josezambudiobernabeu.com',
	/** Where `pnpm preview:content` serves the site, reading this same database. */
	previewUrl: process.env.PREVIEW_URL || 'http://localhost:5173'
};
