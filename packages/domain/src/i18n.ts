import * as v from 'valibot';

/**
 * The languages every visible string must exist in. Adding one here also
 * means replacing `is_localized()` in a Supabase migration and filling the
 * existing rows: see ADR 0005.
 */
export const LOCALES = ['es', 'en'] as const;

export type Lang = (typeof LOCALES)[number];

/** A string that exists in every language. Strict, so a typo'd key fails. */
export const LocalizedSchema = v.strictObject({ es: v.string(), en: v.string() });

export type Localized = v.InferOutput<typeof LocalizedSchema>;

/** Picks one translation; the web wraps this with the visitor's language. */
export const translate = (value: Localized, lang: Lang): string => value[lang];

// --- Language in the URL ---------------------------------------------------------
//
// Every page exists once per language, so each one has a URL a crawler can
// index: Spanish, the default, at the root, and every other language under
// its own prefix (`/en`, `/en/blog/<slug>`).

export const DEFAULT_LANG = 'es' satisfies Lang;

/** The languages whose pages live under a prefix: all but the default. */
export type PrefixedLang = Exclude<Lang, typeof DEFAULT_LANG>;

export const PREFIXED_LOCALES = LOCALES.filter(
	(lang): lang is PrefixedLang => lang !== DEFAULT_LANG
);

export const isLang = (value: unknown): value is Lang =>
	typeof value === 'string' && (LOCALES as readonly string[]).includes(value);

/** The language a site path is in: its prefix, or the default. */
export const langOfPath = (pathname: string): Lang => {
	const prefix = pathname.split('/')[1];
	return isLang(prefix) ? prefix : DEFAULT_LANG;
};

/** A path with its language prefix removed: `/en/blog/x` → `/blog/x`, `/en` → `/`. */
export const unlocalizedPath = (pathname: string): string => {
	const lang = langOfPath(pathname);
	if (lang === DEFAULT_LANG) return pathname;
	return pathname.slice(lang.length + 1) || '/';
};

/**
 * A site path in a language. `path` is the default language's, and may carry
 * a fragment: `localePath('en', '/#blog')` is `/en#blog`, with no slash before
 * the fragment, as the site has no trailing slashes.
 */
export const localePath = (lang: Lang, path = '/'): string => {
	if (lang === DEFAULT_LANG) return path;
	const rest =
		path === '/' || path.startsWith('/#') || path.startsWith('/?') ? path.slice(1) : path;
	return `/${lang}${rest}`;
};

/**
 * The same page in every language, plus `x-default` for visitors whose
 * language is neither: what `hreflang` links and the sitemap list.
 */
export const alternatePaths = (path: string): Record<Lang | 'x-default', string> => ({
	...(Object.fromEntries(LOCALES.map((lang) => [lang, localePath(lang, path)])) as Record<
		Lang,
		string
	>),
	'x-default': localePath(DEFAULT_LANG, path)
});
