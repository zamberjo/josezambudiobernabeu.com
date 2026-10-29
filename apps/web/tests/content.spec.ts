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
// Crude but enough for fixtures: an article with any text between its tags.
const readable = posts.filter((post) => post.body.en.replace(/<[^>]*>/g, '').trim() !== '');

test('side projects link out to their repositories', async ({ page }) => {
	await page.goto('/');
	const card = page.locator('#projects').getByRole('link', { name: 'Home hosted' });
	await expect(card).toHaveAttribute('href', 'https://github.com/zamberjo/home-hosted');
});

// The Blog band is the only optional one: with no posts in the snapshot the section, the
// nav entry and the footer column all go away, and the bands renumber around
// the hole. These cover both states so the suite keeps its meaning once the
// first post is written.
test('the blog band appears only when the content has posts', async ({ page }) => {
	await page.goto('/');

	const section = page.locator('#blog');
	const navLink = page.getByRole('navigation').getByRole('link', { name: 'Blog' });

	if (posts.length === 0) {
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
		(id) => id !== 'blog' || posts.length > 0
	);

	for (const [i, id] of ids.entries()) {
		const number = page.locator(`#${id} h2`).locator('xpath=preceding-sibling::span[1]');
		await expect(number).toHaveText(String(i + 1).padStart(2, '0'));
	}
});

test('the reader renders the post body and index from the content', async ({ page }) => {
	test.skip(readable.length === 0, 'no post with a body written yet');

	await page.goto('/');
	await page.getByRole('button', { name: 'EN', exact: true }).click();
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

test('every readable post has its own prerendered page, found by search engines', async ({
	page,
	request
}) => {
	test.skip(readable.length === 0, 'no post with a body written yet');

	for (const post of readable) {
		// What a crawler gets: the prerendered HTML, with no JavaScript run. It is
		// in Spanish, the site's default, whatever the browser prefers.
		const response = await request.get(`/blog/${post.slug}`);
		expect(response.status()).toBe(200);
		const html = await response.text();
		expect(html).toContain(`>${post.title.es}</h1>`);
		expect(html).toContain(
			`<link rel="canonical" href="https://josezambudiobernabeu.com/blog/${post.slug}"`
		);
		expect(html).toContain('<meta property="og:type" content="article"');
		expect(html).toContain('"@type":"BlogPosting"');
		// Drafts can be shared for review but are kept out of search results.
		expect(html.includes('<meta name="robots" content="noindex"')).toBe(post.status === 'draft');
	}

	// And in the browser, the page is a working article with the language toggle.
	const post = readable[0]!;
	await page.goto(`/blog/${post.slug}`);
	await page.getByRole('button', { name: 'ES', exact: true }).click();
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title.es);
	await page.getByRole('button', { name: 'EN', exact: true }).click();
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title.en);
});

test('the sitemap lists the home page and every published post', async ({ request }) => {
	const sitemap = await (await request.get('/sitemap.xml')).text();
	expect(sitemap).toContain('<loc>https://josezambudiobernabeu.com/</loc>');
	for (const post of readable)
		expect(sitemap.includes(`/blog/${post.slug}<`)).toBe(post.status === 'published');
});

test('the blog has an RSS feed per language, advertised on every page', async ({
	page,
	request
}) => {
	await page.goto('/');
	const feeds = page.locator('link[rel=alternate][type="application/rss+xml"]');
	await expect(feeds).toHaveCount(2);
	await expect(feeds.first()).toHaveAttribute('href', '/rss.xml');

	for (const [path, lang] of [
		['/rss.xml', 'es'],
		['/en/rss.xml', 'en']
	] as const) {
		const xml = await (await request.get(path)).text();
		expect(xml).toContain('<rss version="2.0"');
		expect(xml).toContain(`<language>${lang}</language>`);
		for (const post of readable)
			expect(xml.includes(`<link>https://josezambudiobernabeu.com/blog/${post.slug}</link>`)).toBe(
				post.status === 'published'
			);
	}
});
