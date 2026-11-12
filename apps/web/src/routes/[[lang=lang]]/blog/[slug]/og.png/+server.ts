import { error } from '@sveltejs/kit';
import { DEFAULT_LANG, isLang, translate } from '@jzb/domain';
import { findPost, postEntries } from '$lib/server/posts';
import { renderShareCard } from '$lib/server/portfolio';

// The post's share card, prerendered next to its page in each language:
// /blog/<slug>/og.png and /en/blog/<slug>/og.png.
export const prerender = true;
export const entries = postEntries;

export const GET = async ({ params, fetch }) => {
	const lang = isLang(params.lang) ? params.lang : DEFAULT_LANG;
	const { view, post } = await findPost(params.slug);
	if (!post) error(404, 'Post not found');
	const ui = view.site.ui;

	// A cover that cannot be fetched fails the build, like any broken content.
	let cover: Uint8Array | undefined;
	if (post.cover) {
		const response = await fetch(post.cover);
		if (!response.ok) error(500, `Cover of "${post.slug}" is unavailable: ${post.cover}`);
		cover = new Uint8Array(await response.arrayBuffer());
	}

	const png = await renderShareCard({
		kicker: `${translate(ui.blogTitle, lang)} · ${post.article[lang].minutes} ${translate(ui.minRead, lang)}`,
		title: translate(post.title, lang),
		tags: post.tags,
		site: view.site.footer.site,
		cover
	});
	return new Response(png, { headers: { 'content-type': 'image/png' } });
};
