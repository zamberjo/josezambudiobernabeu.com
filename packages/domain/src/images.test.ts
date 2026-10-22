import { describe, expect, it } from 'vitest';
import { isOptimized, srcsetFor, variantName } from './images.ts';

describe('responsive images', () => {
	it('names variants by width', () => {
		expect(variantName('/assets/blog/hello', 1920)).toBe('/assets/blog/hello-1920w.webp');
	});

	it('derives the srcset of an optimised image from its widest URL', () => {
		expect(srcsetFor('https://x.supabase.co/media/a-1920w.webp')).toBe(
			'https://x.supabase.co/media/a-640w.webp 640w, https://x.supabase.co/media/a-960w.webp 960w, https://x.supabase.co/media/a-1280w.webp 1280w, https://x.supabase.co/media/a-1920w.webp 1920w'
		);
	});

	it('leaves any other image alone', () => {
		expect(isOptimized('/assets/img/me.jpg')).toBe(false);
		expect(srcsetFor('/assets/img/me.jpg')).toBeUndefined();
	});
});
