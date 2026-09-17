import { expect, test } from '@playwright/test';

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
