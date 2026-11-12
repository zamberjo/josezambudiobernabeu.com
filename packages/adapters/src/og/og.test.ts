import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { SHARE_CARD_SIZE } from '@jzb/domain';
import { satoriShareCardRenderer } from './index.ts';

const render = satoriShareCardRenderer();
const card = {
	kicker: 'Blog · 6 min de lectura',
	title: 'Odoo 17 en Kubernetes: lo que aprendí migrando',
	tags: ['odoo', 'kubernetes'],
	site: 'JoseZambudioBernabeu.com'
};

const size = async (png: Uint8Array) => {
	const { format, width, height } = await sharp(png).metadata();
	return { format, width, height };
};

describe('share card renderer', () => {
	it('draws a PNG at the Open Graph size', async () => {
		expect(await size(await render(card))).toEqual({ format: 'png', ...SHARE_CARD_SIZE });
	});

	it('takes a cover in any format sharp reads, and a very long title', async () => {
		const cover = await sharp({
			create: { width: 1920, height: 1080, channels: 3, background: '#336699' }
		})
			.webp()
			.toBuffer();
		const png = await render({ ...card, title: 'Un título muy largo '.repeat(10), cover });
		expect(await size(png)).toEqual({ format: 'png', ...SHARE_CARD_SIZE });
	});
});
