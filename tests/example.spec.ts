import { expect, test } from '@playwright/test';

test('hero shows the name and the social links', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('JZB');
	await expect(page.getByRole('link', { name: 'GitHub' }).first()).toHaveAttribute(
		'href',
		'https://github.com/zamberjo?tab=contributions&period=monthly'
	);
});

test('every numbered section is on the page', async ({ page }) => {
	await page.goto('/');
	for (const id of ['sobre-mi', 'blog', 'experiencia', 'skills', 'estudios', 'projects']) {
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

test('the blog reader opens and closes with Escape', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'EN', exact: true }).click();

	const reader = page.getByRole('dialog');
	await expect(reader).toBeHidden();

	await page.getByRole('button', { name: 'Read', exact: true }).click();
	await expect(reader).toBeVisible();

	await page.keyboard.press('Escape');
	await expect(reader).toBeHidden();
});

test('side projects link out to their repositories', async ({ page }) => {
	await page.goto('/');
	const card = page.locator('#projects').getByRole('link', { name: 'Home hosted' });
	await expect(card).toHaveAttribute('href', 'https://github.com/zamberjo/home-hosted');
});

// These assert the JSON files actually drive the page, not hardcoded markup.
test('the reader renders the post body and index from blog.json', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'EN', exact: true }).click();
	await page.getByRole('button', { name: 'Read', exact: true }).click();

	const reader = page.getByRole('dialog');
	await expect(reader.getByRole('heading', { name: '01 — The problem' })).toBeVisible();
	await expect(reader.getByRole('heading', { name: '03 — What I learned' })).toBeVisible();
	await expect(reader.getByRole('navigation', { name: 'In this post' })).toBeVisible();
	await expect(reader.locator('pre')).toContainText('docker compose up -d');
});

test('skills come from skills.json, featured projects lead the grid', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('#skills li')).toHaveCount(6);
	await expect(page.locator('#skills li').first()).toContainText('Python');

	// Cotos - IA is not featured, so it drops behind josezambudiobernabeu.com.
	const names = await page.locator('#projects a div:nth-child(2)').allTextContents();
	expect(names.indexOf('josezambudiobernabeu.com')).toBeLessThan(names.indexOf('Cotos - IA'));
});
