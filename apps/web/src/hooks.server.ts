import type { Handle } from '@sveltejs/kit';
import { langOfPath } from '@jzb/domain';

/**
 * Sets `<html lang>` in the prerendered HTML, so screen readers and crawlers
 * get each page's language before any script runs. app.html has a `%lang%`
 * placeholder for it.
 */
export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', langOfPath(event.url.pathname))
	});
