export type Lang = 'es' | 'en';

/** A string that exists in both languages. */
export type T = Record<Lang, string>;

const STORAGE_KEY = 'jzb-lang';

/**
 * The page is bilingual with no routing: one `lang` drives every component and
 * the `<html lang>` attribute. The design toggles visibility of duplicated
 * markup with CSS variables; here we pick the string instead, so assistive
 * technology never sees both languages at once.
 */
class LangStore {
	current = $state<Lang>('es');

	/** Restores the visitor's previous choice; called once the DOM exists. */
	restore() {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved === 'es' || saved === 'en') this.current = saved;
		else if (navigator.language.startsWith('en')) this.current = 'en';
	}

	set(next: Lang) {
		this.current = next;
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// Private browsing with storage blocked: the choice just won't persist.
		}
	}
}

export const lang = new LangStore();

/** Picks the active translation of a bilingual string. */
export function t(value: T): string {
	return value[lang.current];
}
