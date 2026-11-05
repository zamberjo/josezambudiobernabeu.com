import { describe, expect, it } from 'vitest';
import { toPortfolioView, type Post } from '@jzb/domain';
import { seedPortfolio } from '../contract.ts';
import { sanitizingArticleRenderer } from '../html/index.ts';
import { absolutize, rssFeed } from './index.ts';

const L = (es: string, en = es) => ({ es, en });
const post = (overrides: Partial<Post>): Post => ({
	slug: 'a',
	status: 'published',
	date: '2026-09-01',
	cover: null,
	tags: [],
	title: L('Título', 'Title'),
	excerpt: L('Resumen', 'Summary'),
	body: L('<p>Hola</p>', '<p>Hello</p>'),
	...overrides
});

const feed = (posts: Post[], lang: 'es' | 'en' = 'es') =>
	rssFeed(toPortfolioView({ ...seedPortfolio(), posts }, sanitizingArticleRenderer), {
		lang,
		origin: 'https://example.dev/',
		self: 'https://example.dev/rss.xml'
	});

describe('rss feed', () => {
	it('lists published posts only, newest first, in the requested language', () => {
		const xml = feed(
			[
				post({ slug: 'old', date: '2025-01-01' }),
				post({ slug: 'new', date: '2026-06-01', title: L('Nuevo', 'New') }),
				post({ slug: 'draft', status: 'draft', date: null })
			],
			'en'
		);
		expect(xml.match(/<item>/g)).toHaveLength(2);
		expect(xml.indexOf('/blog/new')).toBeLessThan(xml.indexOf('/blog/old'));
		expect(xml).not.toContain('/blog/draft');
		expect(xml).toContain('<title>New</title>');
		expect(xml).toContain('<language>en</language>');
		expect(xml).toContain('<pubDate>Mon, 01 Jun 2026 12:00:00 GMT</pubDate>');
		expect(xml).toContain('<lastBuildDate>Mon, 01 Jun 2026 12:00:00 GMT</lastBuildDate>');
	});

	it('links each language to its own pages', () => {
		const posts = [post({ slug: 'a' })];
		expect(feed(posts, 'es')).toContain('<link>https://example.dev/blog/a</link>');
		expect(feed(posts, 'en')).toContain('<link>https://example.dev/en/blog/a</link>');
		expect(feed(posts, 'en')).toContain('<link>https://example.dev/en</link>');
	});

	it('carries the full article with absolute URLs and escapes the metadata', () => {
		const xml = feed([
			post({
				title: L('Tom & Jerry <3'),
				cover: '/assets/blog/c-1920w.webp',
				body: L(
					'<p>Ver <a href="/blog/b">otro</a></p><img src="/assets/blog/x-1920w.webp" alt="x">'
				)
			})
		]);
		expect(xml).toContain('<title>Tom &amp; Jerry &lt;3</title>');
		expect(xml).toContain('<img src="https://example.dev/assets/blog/c-1920w.webp"');
		expect(xml).toContain('<a href="https://example.dev/blog/b">otro</a>');
		expect(xml).not.toContain('srcset');
	});

	it('is a valid, empty channel while there are no posts', () => {
		const xml = feed([]);
		expect(xml).toContain('<channel>');
		expect(xml).not.toContain('<item>');
		expect(xml).not.toContain('lastBuildDate');
	});

	it('never lets article HTML end its CDATA section', () => {
		expect(absolutize('<p>a</p>', 'https://x.dev/')).toBe('<p>a</p>');
		const xml = feed([post({ body: L('<p>]]&gt; and ]]></p>') })]);
		expect(xml.match(/<content:encoded>[\s\S]*<\/content:encoded>/)?.[0]).not.toMatch(
			/\]\]>(?!<!\[CDATA\[)[\s\S]*\]\]><\/content/
		);
	});
});
