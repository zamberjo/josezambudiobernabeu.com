/**
 * Renders the default share card, static/assets/og.png (1200×630), from HTML
 * in a headless Chromium: the site's own font (Archivo, from @fontsource) and
 * its Modernist palette, so the card looks like the page it links to.
 *
 *   pnpm --filter web og:image
 *
 * Run it again after changing the copy or the design; the PNG is committed.
 */
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { chromium } from '@playwright/test';

const require = createRequire(import.meta.url);
const OUT = new URL('../static/assets/og.png', import.meta.url);

const font = async (weight: number) => {
	const path = require.resolve(`@fontsource/archivo/files/archivo-latin-${weight}-normal.woff2`);
	const data = (await readFile(path)).toString('base64');
	return `@font-face { font-family: Archivo; font-weight: ${weight}; src: url(data:font/woff2;base64,${data}) format('woff2'); }`;
};

const html = `<!doctype html>
<style>
	${await font(400)}
	${await font(900)}
	* { margin: 0; box-sizing: border-box; }
	body {
		width: 1200px; height: 630px; overflow: hidden;
		background: #f3f2f2; color: #201e1d; font-family: Archivo, sans-serif;
		display: grid; grid-template-rows: 16px 1fr auto;
	}
	.rule { background: #ec3013; }
	main { padding: 64px 72px 0; display: grid; align-content: center; gap: 28px; }
	.kicker { font-size: 26px; font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase; color: #dd2b0f; }
	h1 { font-size: 112px; line-height: 0.92; font-weight: 900; letter-spacing: -0.045em; }
	footer {
		margin: 0 72px; padding: 28px 0 44px; border-top: 4px solid #201e1d;
		display: flex; justify-content: space-between; font-size: 28px; font-weight: 400;
	}
	footer b { font-weight: 900; }
</style>
<div class="rule"></div>
<main>
	<p class="kicker">Odoo senior developer · Alcoi</p>
	<h1>Jose Zambudio<br />Bernabeu</h1>
</main>
<footer><span>Python · PostgreSQL · Linux · Docker</span><b>josezambudiobernabeu.com</b></footer>`;

const browser = await chromium.launch();
try {
	const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
	await page.setContent(html);
	await page.evaluate(() => document.fonts.ready);
	await page.screenshot({ path: OUT.pathname, type: 'png' });
	console.log(`Wrote ${OUT.pathname}`);
} finally {
	await browser.close();
}
