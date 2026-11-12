import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { SHARE_CARD_SIZE, type ShareCard, type ShareCardRenderer } from '@jzb/domain';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import sharp from 'sharp';

/*
 * Share cards drawn without a browser: satori lays the card out as SVG and
 * resvg rasterises it to PNG, so the build needs no Chromium. The design
 * follows the site's default card (static/assets/og.png): Archivo, the
 * Modernist palette, a red rule on top and a black one above the footer.
 */

const require = createRequire(import.meta.url);

/** Archivo at one weight, from @fontsource. satori reads TTF, OTF and WOFF, not WOFF2. */
const archivo = async (weight: 400 | 700 | 900) => ({
	name: 'Archivo',
	weight,
	style: 'normal' as const,
	data: await readFile(
		require.resolve(`@fontsource/archivo/files/archivo-latin-${weight}-normal.woff`)
	)
});

const COLORS = { bg: '#f3f2f2', ink: '#201e1d', accent: '#ec3013', accentText: '#dd2b0f' };
const GUTTER = 72;
const RULE = 16;
const COVER_WIDTH = 420;
const COVER_HEIGHT = SHARE_CARD_SIZE.height - RULE;
const MAX_TAGS = 4;

/** Long titles step down so they still fit in four lines. */
const titleSize = (title: string, withCover: boolean): number => {
	const size = title.length <= 30 ? 96 : title.length <= 60 ? 76 : title.length <= 90 ? 60 : 50;
	return withCover ? Math.round(size * 0.8) : size;
};

type Node = { type: string; props: Record<string, unknown> };
const el = (
	type: string,
	style: Record<string, unknown>,
	children?: unknown,
	extra = {}
): Node => ({
	type,
	props: { style, children, ...extra }
});

const coverDataUri = async (cover: Uint8Array): Promise<string> => {
	const png = await sharp(cover)
		.resize(COVER_WIDTH, COVER_HEIGHT, { fit: 'cover' })
		.png()
		.toBuffer();
	return `data:image/png;base64,${png.toString('base64')}`;
};

const layout = (card: ShareCard, cover: string | null): Node => {
	const size = titleSize(card.title, cover !== null);
	const tags = card.tags.slice(0, MAX_TAGS);

	const text = el(
		'div',
		{
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			flex: 1,
			gap: 28,
			padding: `48px ${GUTTER}px 0`
		},
		[
			el(
				'div',
				{
					fontSize: 24,
					fontWeight: 900,
					letterSpacing: 3,
					textTransform: 'uppercase',
					color: COLORS.accentText
				},
				card.kicker
			),
			el(
				'div',
				{
					fontSize: size,
					fontWeight: 900,
					lineHeight: 1,
					letterSpacing: -size * 0.03,
					lineClamp: 4
				},
				card.title
			),
			...(tags.length > 0
				? [
						el(
							'div',
							{ display: 'flex', flexWrap: 'wrap', gap: 10 },
							tags.map((tag) =>
								el(
									'div',
									{
										border: `3px solid ${COLORS.ink}`,
										padding: '6px 14px',
										fontSize: 20,
										fontWeight: 700,
										letterSpacing: 1,
										textTransform: 'uppercase'
									},
									tag
								)
							)
						)
					]
				: [])
		]
	);

	const footer = el(
		'div',
		{
			display: 'flex',
			justifyContent: 'space-between',
			gap: 24,
			margin: `0 ${GUTTER}px`,
			padding: '24px 0 36px',
			borderTop: `4px solid ${COLORS.ink}`,
			fontSize: 26
		},
		[
			el('div', { fontWeight: 400 }, 'Jose Zambudio Bernabeu'),
			...(cover ? [] : [el('div', { fontWeight: 900 }, card.site)])
		]
	);

	// With a cover, the picture takes the whole right column, from the red rule
	// to the bottom edge, and the footer stays under the text.
	const body = el('div', { display: 'flex', flex: 1, minHeight: 0 }, [
		el('div', { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }, [text, footer]),
		...(cover
			? [
					el('img', { width: COVER_WIDTH, height: COVER_HEIGHT, objectFit: 'cover' }, undefined, {
						src: cover,
						width: COVER_WIDTH,
						height: COVER_HEIGHT
					})
				]
			: [])
	]);

	return el(
		'div',
		{
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
			height: '100%',
			background: COLORS.bg,
			color: COLORS.ink,
			fontFamily: 'Archivo'
		},
		[el('div', { height: RULE, background: COLORS.accent }), body]
	);
};

/** Fonts are read once, on the first card, and shared by every card after it. */
export const satoriShareCardRenderer = (): ShareCardRenderer => {
	let fonts: ReturnType<typeof loadFonts> | undefined;
	const loadFonts = () => Promise.all([archivo(400), archivo(700), archivo(900)]);

	return async (card) => {
		fonts ??= loadFonts();
		const cover = card.cover ? await coverDataUri(card.cover) : null;
		const svg = await satori(layout(card, cover) as Parameters<typeof satori>[0], {
			...SHARE_CARD_SIZE,
			fonts: await fonts
		});
		const png = new Resvg(svg, { fitTo: { mode: 'width', value: SHARE_CARD_SIZE.width } })
			.render()
			.asPng();
		// A copy on its own ArrayBuffer, which is what a Response body takes.
		return Uint8Array.from(png);
	};
};
