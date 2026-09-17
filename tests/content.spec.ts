import { expect, test } from '@playwright/test';

/**
 * These assert the JSON files in src/lib/data actually drive the page, rather
 * than the markup carrying a hardcoded copy of the same content.
 */

test('side projects link out to their repositories', async ({ page }) => {
	await page.goto('/');
	const card = page.locator('#projects').getByRole('link', { name: 'Home hosted' });
	await expect(card).toHaveAttribute('href', 'https://github.com/zamberjo/home-hosted');
});

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
