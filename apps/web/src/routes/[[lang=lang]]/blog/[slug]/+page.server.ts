import { error } from '@sveltejs/kit';
import { PREFIXED_LOCALES, postPages } from '@jzb/domain';
import { loadView } from '$lib/server/portfolio';

// One prerendered page per readable post and language. The home page links to
// each of them too, so the crawler would find them anyway; listing them here
// makes the set explicit and independent of the markup.
export const entries = async () =>
	postPages(await loadView()).flatMap(({ slug }) => [
		{ slug },
		...PREFIXED_LOCALES.map((lang) => ({ lang, slug }))
	]);

export const load = async ({ params }) => {
	const view = await loadView();
	const post = postPages(view).find((candidate) => candidate.slug === params.slug);
	if (!post) error(404, 'Post not found');
	return { view, post };
};
