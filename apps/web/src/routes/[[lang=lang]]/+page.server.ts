import { PREFIXED_LOCALES } from '@jzb/domain';
import { loadView } from '$lib/server/portfolio';

// One home page per language: `/` in Spanish, `/en` in English.
export const entries = () => [{}, ...PREFIXED_LOCALES.map((lang) => ({ lang }))];

// A server load, so it runs at prerender time only: the data is baked into the
// HTML and the adapters never ship to the browser.
export const load = async () => ({ view: await loadView() });
