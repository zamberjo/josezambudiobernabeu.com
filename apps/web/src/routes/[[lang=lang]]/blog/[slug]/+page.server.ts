import { error } from '@sveltejs/kit';
import { findPost, postEntries } from '$lib/server/posts';

// One prerendered page per readable post and language. The home page links to
// each of them too, so the crawler would find them anyway; listing them here
// makes the set explicit and independent of the markup.
export const entries = postEntries;

export const load = async ({ params }) => {
	const { view, post } = await findPost(params.slug);
	if (!post) error(404, 'Post not found');
	return { view, post };
};
