import { expect, test } from '@playwright/test';

/*
 * Drives the backoffice against the local Supabase stack, signed in as the
 * seeded editor. It writes to the database, so `pnpm db:reset` afterwards
 * restores the seed. Run `pnpm --filter backoffice test` after `supabase start`
 * (its own port, local stack, no GitHub token).
 */

const portrait = new URL('../../web/static/assets/img/me.webp', import.meta.url).pathname;

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

	// A new post, written in the WYSIWYG editor, one language per tab.
	await page.goto('/posts/new');
	await page.waitForLoadState('networkidle');
	await page.getByLabel('Slug').fill('hola-mundo');
	await page.getByLabel('Título (es)').fill('Hola');
	await page.getByLabel('Título (en)').fill('Hello');

	// The cover is uploaded from the form itself and stored as its widest WebP.
	await page.locator('.image-field input[type=file]').setInputFiles(portrait);
	await expect(page.getByLabel('Portada')).toHaveValue(/-1920w\.webp$/);
	await expect(page.locator('.image-preview')).toBeVisible();
	await expect(page.locator('.image-field .warning')).toHaveCount(0);
	// A pasted URL that is not an optimised set is flagged.
	const optimised = await page.getByLabel('Portada').inputValue();
	await page.getByLabel('Portada').fill('/assets/img/me.webp');
	await expect(page.locator('.image-field .warning')).toBeVisible();
	await page.getByLabel('Portada').fill(optimised);

	const editor = page.locator('[role=tabpanel]:visible .ProseMirror');
	const toolbar = page.locator('[role=tabpanel]:visible [role=toolbar]');
	await editor.click();
	await toolbar.getByTitle('Encabezado (entra en el índice)').click();
	await page.keyboard.type('Intro');
	await page.keyboard.press('Enter');
	await page.keyboard.type('Hola ');
	await toolbar.getByTitle('Negrita').click();
	await page.keyboard.type('mundo');
	await expect(editor.locator('h2')).toHaveText('Intro');
	await expect(editor.locator('strong')).toHaveText('mundo');

	await page.getByRole('tab', { name: 'EN' }).click();
	await editor.click();
	await page.keyboard.type('Hello world');

	// Raw HTML: the source view shows what the editor wrote and accepts more.
	await page.getByRole('tab', { name: 'ES' }).click();
	await toolbar.getByRole('button', { name: 'HTML' }).click();
	const source = page.getByLabel('Cuerpo (es) (HTML)');
	await expect(source).toHaveValue('<h2>Intro</h2><p>Hola <strong>mundo</strong></p>');
	await source.fill('<h2>Intro</h2><p>Hola</p><table><tr><td>1</td></tr></table>');
	// The visual editor cannot hold a table: it asks, and declining keeps the HTML.
	page.once('dialog', (dialog) => dialog.dismiss());
	await toolbar.getByRole('button', { name: 'HTML' }).click();
	await expect(source).toBeVisible();

	await page.getByRole('button', { name: 'Guardar' }).click();
	await expect(page).toHaveURL(/\/posts\/[0-9a-f-]{36}\?saved/);
	await page.waitForLoadState('networkidle');
	// Reopened, an article the visual editor cannot represent opens as HTML.
	await expect(page.getByLabel('Cuerpo (es) (HTML)')).toHaveValue(/<table>/);
	await page.getByRole('tab', { name: 'EN' }).click();
	await expect(editor).toHaveText('Hello world');

	// Publishing it without a date is refused by the domain, on that field.
	await page.getByLabel('Estado').selectOption('published');
	await page.getByRole('button', { name: 'Guardar' }).click();
	await expect(page.locator('.field.invalid')).toHaveCount(1);
	await expect(page.locator('.field.invalid')).toContainText('A published post needs a date');

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
	// The post's cover, uploaded above, is already here.
	const before = await page.locator('.media li').count();
	await expect(page.getByRole('heading', { name: 'Media' })).toBeVisible();
	await page.setInputFiles('input[type=file]', portrait);
	await page.getByRole('button', { name: 'Subir' }).click();
	// Optimised on upload: four WebP widths, listed once, by the widest URL.
	await expect(page.getByRole('status')).toContainText(/-1920w\.webp/);
	await expect(page.locator('.media li')).toHaveCount(before + 1);
	// Newest first; deleting removes all four of its variants.
	await page.locator('.media li').first().getByRole('button', { name: 'Borrar' }).click();
	await expect(page.locator('.media li')).toHaveCount(before);

	expect(errors).toEqual([]);
});
