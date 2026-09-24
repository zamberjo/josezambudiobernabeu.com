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
