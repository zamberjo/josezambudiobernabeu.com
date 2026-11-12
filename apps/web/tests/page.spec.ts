import { expect, test } from '@playwright/test';
import content from '../../../content/portfolio.json' with { type: 'json' };

/**
 * The page's own structure and behaviour: that every section is there, that the
 * language toggle drives the copy, and that the reader behaves like a dialog.
 * What the sections *say* is covered by content.spec.ts.
 */

test('hero shows the name and the social links', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('JZB');
	await expect(page.getByRole('link', { name: 'GitHub' }).first()).toHaveAttribute(
		'href',
		'https://github.com/zamberjo?tab=contributions&period=monthly'
	);
});

// Blog is left out here because it is optional; content.spec.ts covers both of
// its states.
test('every permanent section is on the page', async ({ page }) => {
	await page.goto('/');
	for (const id of ['sobre-mi', 'experiencia', 'skills', 'estudios', 'projects']) {
		await expect(page.locator(`#${id}`)).toBeVisible();
	}
});

// The page picks its initial language from the browser, so these drive the
// toggle explicitly rather than assuming which one the test browser lands on.
test('the language toggle switches the copy between Spanish and English', async ({ page }) => {
	await page.goto('/');
	const heading = page.locator('#sobre-mi').getByRole('heading', { level: 2 });

	await page.getByRole('button', { name: 'ES', exact: true }).click();
	await expect(heading).toHaveText('Sobre mí');
	await expect(page.locator('html')).toHaveAttribute('lang', 'es');

	await page.getByRole('button', { name: 'EN', exact: true }).click();
	await expect(heading).toHaveText('About me');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('the blog reader opens at the post URL and closes with Escape or Back', async ({ page }) => {
	test.skip(
		!(content.posts as { status: string }[]).some((post) => post.status === 'published'),
		'no published post, so there is no reader to open'
	);

	await page.goto('/');
	await page.getByRole('button', { name: 'EN', exact: true }).click();

	const reader = page.getByRole('dialog');
	await expect(reader).toBeHidden();

	// Opening moves the address bar to the post's own page, without leaving home.
	await page.getByRole('link', { name: 'Read', exact: true }).click();
	await expect(reader).toBeVisible();
	await expect(page).toHaveURL(/\/blog\/[a-z0-9-]+$/);

	await page.keyboard.press('Escape');
	await expect(reader).toBeHidden();
	await expect(page).toHaveURL(/\/$/);

	// The browser's Back button closes it too.
	await page.getByRole('link', { name: 'Read', exact: true }).click();
	await expect(reader).toBeVisible();
	await page.goBack();
	await expect(reader).toBeHidden();
});

test('the home page carries its canonical URL and social card', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
		'href',
		'https://josezambudiobernabeu.com/'
	);
	await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
});

test('robots.txt keeps AI training crawlers out and lets search in', async ({ request }) => {
	const robots = await (await request.get('/robots.txt')).text();
	const groups = robots.split(/\n\s*\n/).filter((group) => /^User-agent:/m.test(group));
	const groupOf = (agent: string) =>
		groups.find((group) => new RegExp(`^User-agent: ${agent}$`, 'm').test(group));

	for (const agent of ['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot'])
		expect(groupOf(agent)).toMatch(/^Disallow: \/$/m);
	// Search crawlers have no group of their own, so they follow `*`.
	for (const agent of ['Googlebot', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot'])
		expect(groupOf(agent)).toBeUndefined();
	expect(groupOf('\\*')).toMatch(/^Allow: \/$/m);
	expect(robots).toContain('Sitemap: https://josezambudiobernabeu.com/sitemap.xml');
});
