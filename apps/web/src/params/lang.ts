import { PREFIXED_LOCALES, type PrefixedLang } from '@jzb/domain';

/**
 * The optional language segment of a URL. Only the non-default languages
 * have one: `/en/...` matches, while Spanish lives at the root, so `/es` is
 * not a page.
 */
export const match = (param: string): param is PrefixedLang =>
	(PREFIXED_LOCALES as readonly string[]).includes(param);
