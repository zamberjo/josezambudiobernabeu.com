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

// Each language is its own URL: Spanish at the root, English under /en.
test('the language toggle links to the page in the other language', async ({ page }) => {
	await page.goto('/');
	const heading = page.locator('#sobre-mi').getByRole('heading', { level: 2 });
	await expect(heading).toHaveText('Sobre mí');
	await expect(page.locator('html')).toHaveAttribute('lang', 'es');
	await expect(page.getByRole('link', { name: 'ES', exact: true })).toHaveAttribute(
		'aria-current',
		'page'
	);

	await page.getByRole('link', { name: 'EN', exact: true }).click();
	await expect(page).toHaveURL(/\/en$/);
	await expect(heading).toHaveText('About me');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');

	await page.getByRole('link', { name: 'ES', exact: true }).click();
	await expect(page).toHaveURL(/:\d+\/$/);
	await expect(heading).toHaveText('Sobre mí');
});

test('each language is prerendered, so a crawler reads it without running scripts', async ({
	request
}) => {
	const es = await (await request.get('/')).text();
	expect(es).toContain('<html lang="es">');
	expect(es).toContain('Sobre mí');

	const en = await (await request.get('/en')).text();
	expect(en).toContain('<html lang="en">');
	expect(en).toContain('About me');
	expect(en).toContain('<link rel="canonical" href="https://josezambudiobernabeu.com/en"');

	// Both point at each other, and Spanish is the default for everyone else.
	for (const html of [es, en]) {
		expect(html).toContain('hreflang="es" href="https://josezambudiobernabeu.com/"');
		expect(html).toContain('hreflang="en" href="https://josezambudiobernabeu.com/en"');
		expect(html).toContain('hreflang="x-default" href="https://josezambudiobernabeu.com/"');
	}
});

test('the language chosen with the toggle is kept on the next visit', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: 'EN', exact: true }).click();
	await expect(page).toHaveURL(/\/en$/);

	await page.goto('/');
	await expect(page).toHaveURL(/\/en$/);
	await expect(page.locator('#sobre-mi h2')).toHaveText('About me');
});

test('the blog reader opens at the post URL and closes with Escape or Back', async ({ page }) => {
	test.skip(
		!(content.posts as { status: string }[]).some((post) => post.status === 'published'),
		'no published post, so there is no reader to open'
	);

	await page.goto('/en');

	const reader = page.getByRole('dialog');
	await expect(reader).toBeHidden();

	// Opening moves the address bar to the post's own page, without leaving home.
	await page.getByRole('link', { name: 'Read', exact: true }).click();
	await expect(reader).toBeVisible();
	await expect(page).toHaveURL(/\/en\/blog\/[a-z0-9-]+$/);

	await page.keyboard.press('Escape');
	await expect(reader).toBeHidden();
	await expect(page).toHaveURL(/\/en$/);

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
	// A link shared on LinkedIn or Slack shows the default card, as a large image.
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		'content',
		'https://josezambudiobernabeu.com/assets/og.png'
	);
	await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
		'content',
		'summary_large_image'
	);
	const card = await page.request.get('/assets/og.png');
	expect(card.headers()['content-type']).toBe('image/png');
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

test('the content security policy blocks nothing the site needs', async ({ page }) => {
	// Collected from the first script on, so a blocked bootstrap is caught too.
	await page.addInitScript(() => {
		const seen: string[] = [];
		Object.assign(window, { cspViolations: seen });
		document.addEventListener('securitypolicyviolation', (event) =>
			seen.push(`${event.effectiveDirective} ${event.blockedURI}`)
		);
	});
	const violations = () =>
		page.evaluate(() => (window as unknown as { cspViolations: string[] }).cspViolations);

	await page.goto('/');
	await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveCount(1);
	await page.waitForLoadState('networkidle');
	expect(await violations()).toEqual([]);

	// A client-side navigation fetches page data and fonts under the same policy.
	await page.getByRole('link', { name: 'EN', exact: true }).click();
	await expect(page).toHaveURL(/\/en$/);
	await page.waitForLoadState('networkidle');
	expect(await violations()).toEqual([]);
});
