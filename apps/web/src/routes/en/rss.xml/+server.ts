import { feedResponse } from '$lib/server/feed';

export const prerender = true;

/** The blog in English. */
export const GET = () => feedResponse('en');
