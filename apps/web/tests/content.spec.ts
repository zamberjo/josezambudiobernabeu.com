import { expect, test } from '@playwright/test';
import content from '../../../content/portfolio.json' with { type: 'json' };

/**
 * These assert the content snapshot (content/portfolio.json) actually drives the page, rather
 * than the markup carrying a hardcoded copy of the same content.
 */

const posts = content.posts as {
	slug: string;
	status: string;
	date: string | null;
	title: { es: string; en: string };
	body: { es: string; en: string };
}[];
// The built site shows published posts only; drafts are for the dev preview.
const published = posts.filter((post) => post.status === 'published');
const drafts = posts.filter((post) => post.status !== 'published');
// Crude but enough for fixtures: an article with any text between its tags.
const readable = published.filter((post) => post.body.en.replace(/<[^>]*>/g, '').trim() !== '');

test('side projects link out to their repositories', async ({ page }) => {
	await page.goto('/');
	const card = page.locator('#projects').getByRole('link', { name: 'Home hosted' });
	await expect(card).toHaveAttribute('href', 'https://github.com/zamberjo/home-hosted');
});

// The Blog band is the only optional one: with no published post the section, the
// nav entry and the footer column all go away, and the bands renumber around
// the hole. These cover both states so the suite keeps its meaning once the
// first post is written.
test('the blog band appears only when a post is published', async ({ page }) => {
	await page.goto('/');

	const section = page.locator('#blog');
	const navLink = page.getByRole('navigation').getByRole('link', { name: 'Blog' });

	if (published.length === 0) {
		await expect(section).toHaveCount(0);
		await expect(navLink).toHaveCount(0);
	} else {
		await expect(section).toBeVisible();
		await expect(navLink.first()).toBeVisible();
	}
});

test('the bands are numbered without gaps', async ({ page }) => {
	await page.goto('/');

	const ids = ['sobre-mi', 'blog', 'experiencia', 'skills', 'estudios', 'projects'].filter(
		(id) => id !== 'blog' || published.length > 0
	);

	for (const [i, id] of ids.entries()) {
		const number = page.locator(`#${id} h2`).locator('xpath=preceding-sibling::span[1]');
		await expect(number).toHaveText(String(i + 1).padStart(2, '0'));
	}
});

test('the reader renders the post body and index from the content', async ({ page }) => {
	test.skip(readable.length === 0, 'no post with a body written yet');

	await page.goto('/en');
	await page.getByRole('link', { name: 'Read', exact: true }).click();

	const reader = page.getByRole('dialog');
	await expect(reader).toBeVisible();
	await expect(reader.getByRole('navigation', { name: 'In this post' })).toBeVisible();
	// Headings are numbered by the reader itself, so the first one always leads with 01.
	await expect(reader.getByRole('heading', { name: /^01 — / })).toBeVisible();
});

test('skills come from the content, featured projects lead the grid', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('#skills li')).toHaveCount(6);
	await expect(page.locator('#skills li').first()).toContainText('Python');

	// Cotos - IA is not featured, so it drops behind josezambudiobernabeu.com.
	const names = await page.locator('#projects a div:nth-child(2)').allTextContents();
	expect(names.indexOf('josezambudiobernabeu.com')).toBeLessThan(names.indexOf('Cotos - IA'));
});

test('every published post has its own prerendered page, found by search engines', async ({
	page,
	request
}) => {
	test.skip(readable.length === 0, 'no post with a body written yet');

	for (const post of readable) {
		// What a crawler gets: the prerendered HTML, with no JavaScript run, once
		// per language.
		for (const [path, lang] of [
			[`/blog/${post.slug}`, 'es'],
			[`/en/blog/${post.slug}`, 'en']
		] as const) {
			const response = await request.get(path);
			expect(response.status()).toBe(200);
			const html = await response.text();
			expect(html).toContain(`<html lang="${lang}">`);
			expect(html).toContain(`>${post.title[lang]}</h1>`);
			expect(html).toContain(
				`<link rel="canonical" href="https://josezambudiobernabeu.com${path}"`
			);
			expect(html).toContain(
				`hreflang="en" href="https://josezambudiobernabeu.com/en/blog/${post.slug}"`
			);
			expect(html).toContain('<meta property="og:type" content="article"');
			expect(html).toContain('"@type":"BlogPosting"');
			expect(html).not.toContain('<meta name="robots" content="noindex"');
		}
	}

	// And in the browser, the toggle moves between the two pages of the post.
	const post = readable[0]!;
	await page.goto(`/en/blog/${post.slug}`);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title.en);
	await page.getByRole('link', { name: 'ES', exact: true }).click();
	await expect(page).toHaveURL(new RegExp(`:\\d+/blog/${post.slug}$`));
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title.es);
});

test('the sitemap lists the home page and every published post, in both languages', async ({
	request
}) => {
	const sitemap = await (await request.get('/sitemap.xml')).text();
	expect(sitemap).toContain('<loc>https://josezambudiobernabeu.com/</loc>');
	expect(sitemap).toContain('<loc>https://josezambudiobernabeu.com/en</loc>');
	expect(sitemap).toContain(
		'<xhtml:link rel="alternate" hreflang="en" href="https://josezambudiobernabeu.com/en"/>'
	);
	for (const post of readable) {
		expect(sitemap).toContain(`<loc>https://josezambudiobernabeu.com/blog/${post.slug}<`);
		expect(sitemap).toContain(`<loc>https://josezambudiobernabeu.com/en/blog/${post.slug}<`);
	}
	for (const post of drafts) expect(sitemap).not.toContain(`/blog/${post.slug}<`);
});

test('drafts are not on the built site at all', async ({ page, request }) => {
	test.skip(drafts.length === 0, 'no drafts in the snapshot');

	await page.goto('/');
	for (const post of drafts) {
		await expect(page.getByText(post.title.es, { exact: true })).toHaveCount(0);
		for (const path of [`/blog/${post.slug}`, `/en/blog/${post.slug}`])
			expect((await request.get(path)).status()).toBe(404);
	}
	if (published.length === 0) {
		await expect(page.locator('#blog')).toHaveCount(0);
		await expect(page.getByRole('navigation').getByRole('link', { name: 'Blog' })).toHaveCount(0);
	}
});

test('the blog has an RSS feed per language, advertised on every page', async ({
	page,
	request
}) => {
	await page.goto('/');
	const feeds = page.locator('link[rel=alternate][type="application/rss+xml"]');
	await expect(feeds).toHaveCount(2);
	await expect(feeds.first()).toHaveAttribute('href', 'https://josezambudiobernabeu.com/rss.xml');

	for (const [path, prefix, lang] of [
		['/rss.xml', '', 'es'],
		['/en/rss.xml', '/en', 'en']
	] as const) {
		const xml = await (await request.get(path)).text();
		expect(xml).toContain('<rss version="2.0"');
		expect(xml).toContain(`<language>${lang}</language>`);
		// Each feed links to the posts' pages in its own language.
		for (const post of readable)
			expect(xml).toContain(
				`<link>https://josezambudiobernabeu.com${prefix}/blog/${post.slug}</link>`
			);
		for (const post of drafts) expect(xml).not.toContain(`/blog/${post.slug}<`);
	}
});
