import { feedResponse } from '$lib/server/feed';

export const prerender = true;

/** The blog in Spanish, the site's default language. */
export const GET = () => feedResponse('es');
