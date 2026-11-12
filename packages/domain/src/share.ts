import { localePath, type Lang } from './i18n.ts';

/*
 * The share card: the image a link preview shows (Open Graph, Twitter). The
 * site's default is a static file; each post gets its own, drawn at build time
 * from its title. The domain only says what goes on a card and where it lives;
 * drawing it needs fonts and a rasteriser, which belong in an adapter.
 */

/** Open Graph's recommended size, and what every card is drawn at. */
export const SHARE_CARD_SIZE = { width: 1200, height: 630 } as const;

/** The site-wide card, rendered by `pnpm --filter web og:image`. */
export const DEFAULT_SHARE_CARD = '/assets/og.png';

export type ShareCard = {
	/** Small line above the title, e.g. "Blog · 6 min de lectura". */
	kicker: string;
	title: string;
	tags: readonly string[];
	/** Printed at the foot of the card. */
	site: string;
	/** The post's cover, already fetched; any format the adapter can decode. */
	cover?: Uint8Array;
};

/** Draws a card as a PNG of `SHARE_CARD_SIZE`. */
export type ShareCardRenderer = (card: ShareCard) => Promise<Uint8Array<ArrayBuffer>>;

/** Where a post's card is served, next to the post's page, in each language. */
export const shareCardPath = (lang: Lang, slug: string): string =>
	localePath(lang, `/blog/${slug}/og.png`);
