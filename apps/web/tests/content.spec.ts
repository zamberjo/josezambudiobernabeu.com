import { expect, test } from '@playwright/test';
import content from '../../../content/portfolio.json' with { type: 'json' };

/**
 * These assert the content snapshot (content/portfolio.json) actually drives the page, rather
 * than the markup carrying a hardcoded copy of the same content.
 */

const posts = content.posts as {
	status: string;
	date: string | null;
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
	await page.getByRole('button', { name: 'Read', exact: true }).click();

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
