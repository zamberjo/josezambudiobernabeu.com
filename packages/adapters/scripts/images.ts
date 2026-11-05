/**
 * Optimises the raster images committed under apps/web/static/assets.
 *
 *   pnpm images:optimize [files…]   PNG/JPEG → <stem>-{640,960,1280,1920}w.webp, original removed
 *   pnpm images:check               fails if any PNG/JPEG over the budget is left (CI)
 *
 * With no files, it takes every PNG/JPEG under static/assets/blog, where post
 * covers and article images go. Images uploaded through the backoffice's
 * Media page are optimised on upload and never need this.
 */
import { readdir, readFile, rm, stat } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { uploadImage } from '@jzb/application';
import { fsMediaStore, sharpImageOptimizer } from '../src/images/index.ts';

const STATIC = resolve(import.meta.dirname, '../../../apps/web/static');
const DEFAULT_DIR = join(STATIC, 'assets/blog');
const RASTER = new Set(['.png', '.jpg', '.jpeg']);
/** Above this, a PNG/JPEG left in the repo is a problem worth failing CI for. */
const BUDGET = 200 * 1024;

async function rasters(dir: string): Promise<string[]> {
	const entries = await readdir(dir, { withFileTypes: true, recursive: true }).catch(() => []);
	return entries
		.filter((entry) => entry.isFile() && RASTER.has(extname(entry.name).toLowerCase()))
		.map((entry) => join(entry.parentPath, entry.name));
}

const [command, ...files] = process.argv.slice(2);
const targets = files.length ? files.map((file) => resolve(file)) : await rasters(DEFAULT_DIR);

if (command === 'check') {
	const heavy = [];
	for (const file of targets) if ((await stat(file)).size > BUDGET) heavy.push(file);
	if (heavy.length) {
		console.error(
			`Unoptimised images over ${BUDGET / 1024} KB:\n${heavy.map((f) => `  ${relative(STATIC, f)}`).join('\n')}\nRun: pnpm images:optimize`
		);
		process.exit(1);
	}
	console.log('Images OK');
	process.exit(0);
}

const upload = uploadImage(sharpImageOptimizer, fsMediaStore(STATIC));
for (const file of targets) {
	const stem = relative(STATIC, file).slice(0, -extname(file).length);
	const before = (await stat(file)).size;
	const result = await upload(stem, new Uint8Array(await readFile(file)));
	if (!result.ok) {
		console.error(`${relative(STATIC, file)}: ${result.error.message}`);
		process.exitCode = 1;
		continue;
	}
	await rm(file);
	const widest = (await stat(join(STATIC, result.value.src))).size;
	console.log(
		`${relative(STATIC, file)} (${Math.round(before / 1024)} KB) → ${result.value.src} (${Math.round(widest / 1024)} KB)`
	);
}
