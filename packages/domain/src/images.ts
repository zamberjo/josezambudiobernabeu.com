/*
 * Responsive images by naming convention, so any store can hold them (the
 * repo's static/, Supabase Storage) and nothing needs a manifest: an
 * optimised image is a set of WebP files `<stem>-<width>w.webp`, one per
 * width below, and the stored URL is always the widest one.
 */

export const IMAGE_WIDTHS = [640, 960, 1280, 1920] as const;
export const IMAGE_FORMAT = 'webp';

const VARIANT = /-(\d+)w\.webp(?=$|[?#])/;

/** `/a/cover.png` → `/a/cover-1920w.webp`: where the widest variant of a source lives. */
export const variantName = (stem: string, width: number): string =>
	`${stem}-${width}w.${IMAGE_FORMAT}`;

/** Whether a URL follows the convention, i.e. was produced by the optimiser. */
export const isOptimized = (src: string): boolean => VARIANT.test(src);

/**
 * The `srcset` for an optimised image, or `undefined` for any other URL (which
 * still renders, just without responsive candidates).
 */
export const srcsetFor = (src: string): string | undefined =>
	isOptimized(src)
		? IMAGE_WIDTHS.map((width) => `${src.replace(VARIANT, `-${width}w.webp`)} ${width}w`).join(', ')
		: undefined;
