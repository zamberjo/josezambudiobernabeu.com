import { page } from '$app/state';
import { DEFAULT_LANG, isLang, translate, type Lang, type Localized } from '@jzb/domain';

export type { Lang };

/** A string that exists in both languages. */
export type T = Localized;

const STORAGE_KEY = 'jzb-lang';

/**
 * The language is part of the URL (`/` Spanish, `/en` English), so every
 * page is prerendered once per language and a crawler sees each one. This
 * reads it from the current route, on the server while prerendering and in
 * the browser alike: there is no client-side state to get out of step, and
 * no flash of Spanish before an English visitor's choice is restored.
 */
export const lang = {
	get current(): Lang {
		const param = page.params.lang;
		return isLang(param) ? param : DEFAULT_LANG;
	}
};

/** Remembers an explicit choice from the language toggle. */
export function rememberLang(choice: Lang) {
	try {
		localStorage.setItem(STORAGE_KEY, choice);
	} catch {
		// Private browsing with storage blocked: the choice does not persist.
	}
}

/**
 * The language the visitor chose with the toggle on an earlier visit, if any.
 * Only an explicit choice counts, never `navigator.language`: crawlers
 * announce English and would otherwise be sent away from the Spanish pages.
 */
export function rememberedLang(): Lang | null {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		return isLang(saved) ? saved : null;
	} catch {
		return null;
	}
}

/** Picks the active translation of a bilingual string. */
export function t(value: T): string {
	return translate(value, lang.current);
}
