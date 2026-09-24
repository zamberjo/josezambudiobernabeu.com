import type { T } from '../i18n.svelte';
import data from './blog.json';

/**
 * Article bodies are structured blocks rather than markup, so the reader keeps
 * the design's typography and can build its own index from the headings.
 * Add a new block kind here and give it a branch in BlogReader.svelte.
 */
export type Block =
	| { type: 'lede'; text: T }
	| { type: 'heading'; text: T }
	| { type: 'paragraph'; text: T }
	| { type: 'quote'; text: T }
	| { type: 'list'; items: T[] }
	| { type: 'code'; code: string; comment?: T }
	| { type: 'image'; src: string; alt?: T; caption?: T };

export type Post = {
	slug: string;
	/** `draft` posts show in the grid but only open the reader once they have a body. */
	status: 'published' | 'draft';
	date: string | null;
	/** Minutes; rendered as "6 min de lectura" / "6 min read". */
	readingTime: number | null;
	cover: string | null;
	tags: string[];
	title: T;
	excerpt: T;
	body: Block[];
};

const all = data.posts as Post[];

/**
 * With no posts the section has nothing to say, so the page drops it and the
 * nav and footer drop their links to it: a portfolio is better off without a
 * blog than with an empty one.
 */
export const hasPosts: boolean = all.length > 0;

/** Newest published post first; it gets the wide card at the top of the section. */
export const featuredPost: Post | undefined = all
	.filter((post) => post.status === 'published')
	.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))[0];

/** Everything else, in file order, for the three-up grid below the feature. */
export const otherPosts: Post[] = all.filter((post) => post !== featuredPost);

/** The headings, numbered, as the reader's side index. */
export function outline(post: Post) {
	return post.body
		.filter((block): block is Extract<Block, { type: 'heading' }> => block.type === 'heading')
		.map((block, i) => ({ number: String(i + 1).padStart(2, '0'), text: block.text }));
}
