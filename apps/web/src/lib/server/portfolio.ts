import { loadPortfolioView, type PortfolioReader, type ReadError } from '@jzb/application';
import { jsonPortfolioReader } from '@jzb/adapters/json';
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
	supabase: () => {
		throw new Error('CONTENT_SOURCE=supabase is not wired yet');
	}
};

const source = (process.env.CONTENT_SOURCE ?? 'json') as Source;

const describe = (error: ReadError): string =>
	error.kind === 'validation'
		? `Content from "${source}" is invalid:\n${describeValidation(error)}`
		: `Content from "${source}" is unavailable: ${error.message}`;

/** Fails the build, loudly and with field paths, rather than publish broken content. */
export async function loadView() {
	const reader = readers[source];
	if (!reader) throw new Error(`Unknown CONTENT_SOURCE "${source}"`);
	return unwrap(await loadPortfolioView(reader())(), describe);
}
