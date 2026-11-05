import { isIndexable, postPages, type Lang, type PortfolioView, type PostView } from '@jzb/domain';

/*
 * The blog as an RSS 2.0 feed, one per language. A pure function of the read
 * model: the web's /rss.xml routes call it at prerender time, so the feed is
 * a static file like everything else and always matches the site.
 */

/** Enough for any reader's first sync; older posts stay on the site. */
export const FEED_LIMIT = 20;

const escape = (text: string) =>
	text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');

/** HTML inside CDATA; the only sequence that could end it early is split. */
const cdata = (html: string) => `<![CDATA[${html.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;

/** RFC 822, as RSS requires. Dates are days, so noon UTC keeps every timezone on the same day. */
const rfc822 = (date: string) => new Date(`${date}T12:00:00Z`).toUTCString();

/**
 * Feed readers show the article away from the site, so site-relative URLs
 * must become absolute, and srcset/sizes (relative, and ignored by readers)
 * are dropped.
 */
export const absolutize = (html: string, origin: string): string =>
	html
		.replace(/\s(?:srcset|sizes)="[^"]*"/g, '')
		.replace(
			/\s(src|href)="(\/[^"]*)"/g,
			(_, attr, path) => ` ${attr}="${new URL(path, origin).href}"`
		);

export type FeedOptions = {
	lang: Lang;
	/** Absolute site origin, e.g. https://josezambudiobernabeu.com/ */
	origin: string;
	/** Absolute URL of this feed, for the self link readers use to update. */
	self: string;
};

/** Published posts, newest first. Drafts never reach subscribers. */
export const feedPosts = (view: PortfolioView): PostView[] =>
	postPages(view)
		.filter((post) => isIndexable(post) && post.date !== null)
		.toSorted((a, b) => b.date!.localeCompare(a.date!))
		.slice(0, FEED_LIMIT);

export const rssFeed = (view: PortfolioView, { lang, origin, self }: FeedOptions): string => {
	const posts = feedPosts(view);
	const url = (path: string) => new URL(path, origin).href;
	const title = `${view.site.footer.brand} · Blog`;

	const items = posts.map((post) => {
		const link = url(`/blog/${post.slug}`);
		const cover = post.cover
			? `<p><img src="${escape(url(post.cover))}" alt="${escape(post.title[lang])}"></p>`
			: '';
		return [
			'    <item>',
			`      <title>${escape(post.title[lang])}</title>`,
			`      <link>${escape(link)}</link>`,
			`      <guid isPermaLink="true">${escape(link)}</guid>`,
			`      <pubDate>${rfc822(post.date!)}</pubDate>`,
			`      <description>${escape(post.excerpt[lang])}</description>`,
			...post.tags.map((tag) => `      <category>${escape(tag)}</category>`),
			`      <content:encoded>${cdata(cover + absolutize(post.article[lang].html, origin))}</content:encoded>`,
			'    </item>'
		].join('\n');
	});

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
		'  <channel>',
		`    <title>${escape(title)}</title>`,
		`    <link>${escape(url('/'))}</link>`,
		`    <description>${escape(view.site.blog.intro[lang])}</description>`,
		`    <language>${lang}</language>`,
		`    <atom:link href="${escape(self)}" rel="self" type="application/rss+xml"/>`,
		// The newest post's date rather than "now": rebuilding without new
		// content must not look like an update to every reader.
		...(posts[0]?.date ? [`    <lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>`] : []),
		...items,
		'  </channel>',
		'</rss>',
		''
	].join('\n');
};
