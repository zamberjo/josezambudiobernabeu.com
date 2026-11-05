import { building, dev } from '$app/environment';
import { loadPortfolioView, type PortfolioReader, type ReadError } from '@jzb/application';
import { jsonPortfolioReader } from '@jzb/adapters/json';
import { sanitizingArticleRenderer } from '@jzb/adapters/html';
import { createContentClient, supabasePortfolioReader } from '@jzb/adapters/supabase';
import { describeValidation, unwrap } from '@jzb/domain';

/*
 * The web's composition root. It runs only while prerendering, so whichever
 * adapter it picks, the browser receives finished HTML and never talks to a
 * content store or sees its credentials.
 */

type Source = 'json' | 'supabase';

/** Strategy table: one reader factory per content source. */
const readers: Record<Source, () => PortfolioReader> = {
	json: () => jsonPortfolioReader(async () => (await import('$content/portfolio.json')).default),
	// The publishable key only reads the `api` views; row level security keeps
	// everything else out of reach even if it leaked.
	supabase: () =>
		supabasePortfolioReader(
			createContentClient(required('SUPABASE_URL'), required('SUPABASE_PUBLISHABLE_KEY'))
		)
};

const source = (process.env.CONTENT_SOURCE ?? 'json') as Source;

function required(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`CONTENT_SOURCE=${source} needs ${name}`);
	return value;
}

const describe = (error: ReadError): string =>
	error.kind === 'validation'
		? `Content from "${source}" is invalid:\n${describeValidation(error)}`
		: `Content from "${source}" is unavailable: ${error.message}`;

async function readView() {
	const reader = readers[source];
	if (!reader) throw new Error(`Unknown CONTENT_SOURCE "${source}"`);
	// Drafts only in dev, where `preview:content` reads them before publishing.
	// A build, and so the deployed site, has published posts only.
	const view = loadPortfolioView(reader(), sanitizingArticleRenderer, { drafts: dev });
	return unwrap(await view(), describe);
}

let built: ReturnType<typeof readView> | undefined;

/**
 * Fails the build with field paths instead of publishing broken content.
 * While building, every page (home, each /blog/<slug>, the sitemap) shares one
 * read, so a build is one consistent snapshot and one round trip. In dev each
 * request reads again, which is what makes `preview:content` live.
 */
export function loadView() {
	if (!building) return readView();
	built ??= readView();
	return built;
}
