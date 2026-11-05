import { rssFeed } from '@jzb/adapters/rss';
import type { Lang } from '@jzb/domain';
import { loadView } from './portfolio';

/** Where each language's feed lives; also what the <head> advertises. */
export const FEEDS: Record<Lang, string> = { es: '/rss.xml', en: '/en/rss.xml' };

/** A prerendered RSS response for one language. */
export async function feedResponse(lang: Lang): Promise<Response> {
	const view = await loadView();
	const origin = view.site.footer.siteUrl;
	const body = rssFeed(view, { lang, origin, self: new URL(FEEDS[lang], origin).href });
	return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
