import { rssFeed } from '@jzb/adapters/rss';
import { localePath, type Lang } from '@jzb/domain';
import { loadView } from './portfolio';

/** A prerendered RSS response for one language: /rss.xml, /en/rss.xml. */
export async function feedResponse(lang: Lang): Promise<Response> {
	const view = await loadView();
	const origin = view.site.footer.siteUrl;
	const self = new URL(localePath(lang, '/rss.xml'), origin).href;
	const body = rssFeed(view, { lang, origin, self });
	return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
