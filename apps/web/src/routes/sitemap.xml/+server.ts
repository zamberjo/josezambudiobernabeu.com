import { alternatePaths, isIndexable, postPages, type Lang } from '@jzb/domain';
import { loadView } from '$lib/server/portfolio';

export const prerender = true;

const escape = (text: string) =>
	text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/**
 * The home page and every published post, in every language; drafts stay
 * out, like their noindex says. Each URL lists its translations as hreflang
 * alternates, the sitemap form of the links in each page's <head>.
 */
export const GET = async () => {
	const view = await loadView();
	const origin = view.site.footer.siteUrl;
	const absolute = (path: string) => escape(new URL(path, origin).href);

	const urls = (path: string, lastmod?: string | null) => {
		const alternates = Object.entries(alternatePaths(path));
		const links = alternates
			.map(
				([hreflang, href]) =>
					`<xhtml:link rel="alternate" hreflang="${hreflang}" href="${absolute(href)}"/>`
			)
			.join('');
		return alternates
			.filter((entry): entry is [Lang, string] => entry[0] !== 'x-default')
			.map(
				([, href]) =>
					`  <url><loc>${absolute(href)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${links}</url>`
			);
	};

	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
		...urls('/'),
		...postPages(view)
			.filter(isIndexable)
			.flatMap((post) => urls(`/blog/${post.slug}`, post.date)),
		'</urlset>',
		''
	].join('\n');

	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
