import type { Block, Post, Project } from './entities.ts';
import type { Localized } from './i18n.ts';
import type { Portfolio } from './portfolio.ts';
import type { NavLink, Site } from './site.ts';

/*
 * Pure selectors from the stored aggregate to what the page renders. They
 * decide ordering, what is featured and which bands exist; the components only
 * lay the result out.
 */

/** Section ids in page order. Blog is the only optional band. */
export const BANDS = ['sobre-mi', 'blog', 'experiencia', 'skills', 'estudios', 'projects'] as const;
export type Band = (typeof BANDS)[number];

export const pad2 = (n: number): string => String(n).padStart(2, '0');

/**
 * Numbers the bands by what actually renders, so dropping one never leaves a
 * gap like 01, 03, 04. A band that does not render has no number.
 */
export const bandNumbers = (rendered: readonly Band[]): Partial<Record<Band, string>> =>
	Object.fromEntries(rendered.map((band, i) => [band, pad2(i + 1)]));

/** Featured projects first, each group keeping its stored order. */
export const orderProjects = (projects: readonly Project[]): Project[] => [
	...projects.filter((project) => project.featured),
	...projects.filter((project) => !project.featured)
];

/** Newest published post; it gets the wide card at the top of the section. */
export const featuredPost = (posts: readonly Post[]): Post | undefined =>
	posts
		.filter((post) => post.status === 'published')
		.toSorted((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))[0];

/** A post only opens the reader once it actually has a body written. */
export const isReadable = (post: Post): boolean => post.body.length > 0;

export type OutlineEntry = { number: string; text: Localized };

/** The headings, numbered, as the reader's side index. */
export const outline = (body: readonly Block[]): OutlineEntry[] =>
	body
		.filter((block): block is Extract<Block, { type: 'heading' }> => block.type === 'heading')
		.map((block, i) => ({ number: pad2(i + 1), text: block.text }));

/** Each block paired with its heading number, so the reader never recounts. */
export const numberBlocks = (body: readonly Block[]): { block: Block; heading?: string }[] => {
	let headings = 0;
	return body.map((block) =>
		block.type === 'heading' ? { block, heading: pad2(++headings) } : { block }
	);
};

export type BlogView = { featured: Post | undefined; others: Post[] };

export type PortfolioView = {
	site: Site;
	/** Only the links to bands that render: no posts, no Blog entry. */
	nav: NavLink[];
	bands: Partial<Record<Band, string>>;
	/** `null` when there are no posts: the whole band, nav entry and footer column go. */
	blog: BlogView | null;
	experience: Portfolio['experience'];
	skills: Portfolio['skills'];
	projects: Project[];
};

/**
 * With no posts the section has nothing to say, so the page drops it: a
 * portfolio is better off without a blog than with an empty one.
 */
export const toPortfolioView = (portfolio: Portfolio): PortfolioView => {
	const hasPosts = portfolio.posts.length > 0;
	const rendered = BANDS.filter((band) => band !== 'blog' || hasPosts);
	const featured = featuredPost(portfolio.posts);

	return {
		site: portfolio.site,
		nav: portfolio.site.nav.links.filter((link) => link.href !== '#blog' || hasPosts),
		bands: bandNumbers(rendered),
		blog: hasPosts
			? { featured, others: portfolio.posts.filter((post) => post !== featured) }
			: null,
		experience: portfolio.experience,
		skills: portfolio.skills,
		projects: orderProjects(portfolio.projects)
	};
};
