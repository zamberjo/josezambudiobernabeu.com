import { loadView } from '$lib/server/portfolio';

// A server load, so it runs at prerender time only: the data is baked into the
// HTML and the adapters never ship to the browser.
export const load = async () => ({ view: await loadView() });
