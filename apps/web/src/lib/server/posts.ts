import { PREFIXED_LOCALES, postPages } from '@jzb/domain';
import { loadView } from './portfolio';

/**
 * Every readable post once per language, as route params. The post's page
 * and its share card are prerendered from the same list.
 */
export const postEntries = async () =>
	postPages(await loadView()).flatMap(({ slug }) => [
		{ slug },
		...PREFIXED_LOCALES.map((lang) => ({ lang, slug }))
	]);

/** The post a request is for, from the view; `undefined` when it has no page. */
export const findPost = async (slug: string) => {
	const view = await loadView();
	return { view, post: postPages(view).find((candidate) => candidate.slug === slug) };
};
