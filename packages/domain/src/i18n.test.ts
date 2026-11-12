import { describe, expect, it } from 'vitest';
import { alternatePaths, isLang, langOfPath, localePath, unlocalizedPath } from './i18n.ts';
import { shareCardPath } from './share.ts';

describe('language in the URL', () => {
	it('keeps Spanish at the root and prefixes English', () => {
		expect(localePath('es', '/')).toBe('/');
		expect(localePath('es', '/blog/x')).toBe('/blog/x');
		expect(localePath('en', '/')).toBe('/en');
		expect(localePath('en', '/blog/x')).toBe('/en/blog/x');
	});

	it('puts a fragment straight after the prefix, with no trailing slash', () => {
		expect(localePath('en', '/#blog')).toBe('/en#blog');
		expect(localePath('es', '/#blog')).toBe('/#blog');
	});

	it('reads the language back from a path', () => {
		expect(langOfPath('/')).toBe('es');
		expect(langOfPath('/blog/x')).toBe('es');
		expect(langOfPath('/en')).toBe('en');
		expect(langOfPath('/en/blog/x')).toBe('en');
		// Only a whole segment counts.
		expect(langOfPath('/english')).toBe('es');
		// The default language never carries a prefix.
		expect(langOfPath('/es/blog/x')).toBe('es');
	});

	it('strips the prefix, so a page can be found in the other language', () => {
		expect(unlocalizedPath('/en')).toBe('/');
		expect(unlocalizedPath('/en/blog/x')).toBe('/blog/x');
		expect(unlocalizedPath('/blog/x')).toBe('/blog/x');
		for (const path of ['/', '/blog/x']) expect(unlocalizedPath(localePath('en', path))).toBe(path);
	});

	it('lists every language of a page, with Spanish as x-default', () => {
		expect(alternatePaths('/blog/x')).toEqual({
			es: '/blog/x',
			en: '/en/blog/x',
			'x-default': '/blog/x'
		});
	});

	it('recognises only the supported languages', () => {
		expect(isLang('en')).toBe(true);
		expect(isLang('fr')).toBe(false);
		expect(isLang(undefined)).toBe(false);
	});

	it("serves a post's share card next to its page, per language", () => {
		expect(shareCardPath('es', 'hola')).toBe('/blog/hola/og.png');
		expect(shareCardPath('en', 'hola')).toBe('/en/blog/hola/og.png');
	});
});
