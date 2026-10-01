import { expect, test } from '@playwright/test';

/*
 * Drives the backoffice against the local Supabase stack, signed in as the
 * seeded editor. It writes to the database, so `pnpm db:reset` afterwards
 * restores the seed. Run with `pnpm --filter backoffice test` after
 * `supabase start`.
 */

const portrait = new URL('../../web/static/assets/img/me.jpg', import.meta.url).pathname;

test('an editor can sign in, edit every kind of content and publish', async ({ page }) => {
	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push(e.message));
	await page.goto('/');
	await expect(page).toHaveURL(/login/);
	await page.waitForLoadState('networkidle');
	await page.getByLabel('Email').fill('admin@josezambudiobernabeu.local');
	await page.getByLabel('Contraseña').fill('admin-local');
	await page.getByRole('button', { name: 'Entrar' }).click();
	await expect(page.getByRole('heading', { name: 'Contenido' })).toBeVisible();

	// edit a skill
	await page.getByRole('link', { name: 'Skills' }).first().click();
	await page.getByRole('link', { name: 'Python' }).click();
	await page.waitForLoadState('networkidle');
	await page.getByLabel('Nivel (0–100)').fill('77');
	await page.getByRole('button', { name: 'Guardar' }).click();
	await expect(page.getByRole('status')).toContainText('Guardado');
	await expect(page.getByLabel('Nivel (0–100)')).toHaveValue('77');

	// Server-side validation keeps what was typed and marks the field.
	await page.getByLabel('Nombre').fill('');
	await page.getByRole('button', { name: 'Guardar' }).click();
	await expect(page.locator('.field.invalid .error')).toBeVisible();
	await expect(page.getByLabel('Nivel (0–100)')).toHaveValue('77');

	// reorder
	await page.goto('/skills');
	await page.waitForLoadState('networkidle');
	const first = await page.locator('.entries li a').first().textContent();
	await page.locator('.entries li').first().getByRole('button', { name: /Bajar/ }).click();
	await expect(page.locator('.entries li a').nth(1)).toHaveText(first!);

	// new post with blocks
	await page.goto('/posts/new');
	await page.waitForLoadState('networkidle');
	await page.getByLabel('Slug').fill('hola-mundo');
	await page.getByLabel('Título (es)').fill('Hola');
	await page.getByLabel('Título (en)').fill('Hello');
	await page.getByRole('button', { name: 'Encabezado' }).click();
	await page.getByLabel('Encabezado (es)').fill('Intro');
	await page.getByLabel('Encabezado (en)').fill('Intro');
	await page.getByRole('button', { name: 'Código' }).click();
	await page.getByLabel('Código', { exact: true }).fill('print(1)');
	await page.getByRole('button', { name: 'Guardar' }).click();
	await expect(page).toHaveURL(/\/posts\/[0-9a-f-]{36}\?saved/);
	await page.waitForLoadState('networkidle');
	await expect(page.getByLabel('Código', { exact: true })).toHaveValue('print(1)');

	// Publishing it without a date or reading time is refused by the domain.
	await page.getByLabel('Estado').selectOption('published');
	await page.getByRole('button', { name: 'Guardar' }).click();
	await expect(page.locator('.field.invalid')).toHaveCount(2);

	// site section
	await page.goto('/site/quote');
	await page.waitForLoadState('networkidle');
	await page.getByLabel('Autor').fill('Linus T.');
	await page.getByRole('button', { name: 'Guardar' }).click();
	await expect(page.getByRole('status')).toContainText('Guardado');

	// nav links
	await page.goto('/site/nav');
	await page.waitForLoadState('networkidle');
	await expect(page.getByLabel('Texto 1 (es)')).toHaveValue('Sobre mí');

	// Without GITHUB_TOKEN, publishing reports why instead of pretending.
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	await page.getByRole('button', { name: 'Publicar la web' }).click();
	await expect(page.getByRole('status')).toContainText('GITHUB_TOKEN');

	// delete post
	await page.goto('/posts');
	await page.waitForLoadState('networkidle');
	page.on('dialog', (d) => d.accept());
	await page.getByRole('button', { name: 'Borrar' }).click();
	await expect(page.getByText('Todavía no hay nada aquí.')).toBeVisible();

	// media page loads
	await page.goto('/media');
	await page.waitForLoadState('networkidle');
	await expect(page.getByRole('heading', { name: 'Media' })).toBeVisible();
	await page.setInputFiles('input[type=file]', portrait);
	await page.getByRole('button', { name: 'Subir' }).click();
	await expect(page.locator('.media li')).toHaveCount(1);
	await page.locator('.media li').getByRole('button', { name: 'Borrar' }).click();
	await expect(page.locator('.media li')).toHaveCount(0);

	expect(errors).toEqual([]);
});
