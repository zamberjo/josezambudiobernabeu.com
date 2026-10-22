import { isIndexable, postPages } from '@jzb/domain';
import { loadView } from '$lib/server/portfolio';

export const prerender = true;

const escape = (text: string) =>
	text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/** The home page and every published post; drafts stay out, like their noindex says. */
export const GET = async () => {
	const view = await loadView();
	const origin = view.site.footer.siteUrl;
	const url = (path: string, lastmod?: string | null) =>
		`  <url><loc>${escape(new URL(path, origin).href)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;

	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		url('/'),
		...postPages(view)
			.filter(isIndexable)
			.map((post) => url(`/blog/${post.slug}`, post.date)),
		'</urlset>',
		''
	].join('\n');

	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
