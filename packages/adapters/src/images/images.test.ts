import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import { sharpImageOptimizer } from './index.ts';

const png = (width: number, height: number) =>
	sharp({ create: { width, height, channels: 3, background: '#ec3013' } })
		.png()
		.toBuffer()
		.then((buffer) => new Uint8Array(buffer));

describe('sharp image optimizer', () => {
	it('encodes every width as WebP, never upscaling', async () => {
		const result = await sharpImageOptimizer(await png(1500, 750));
		expect(result.ok).toBe(true);
		if (!result.ok) return;
		const sizes = await Promise.all(
			result.value.map(async ({ data }) => await sharp(data).metadata())
		);
		expect(sizes.map((s) => [s.width, s.format])).toEqual([
			[640, 'webp'],
			[960, 'webp'],
			[1280, 'webp'],
			[1500, 'webp']
		]);
	});

	it('refuses what is not an image', async () => {
		const result = await sharpImageOptimizer(new TextEncoder().encode('not an image'));
		expect(result.ok).toBe(false);
	});
});
