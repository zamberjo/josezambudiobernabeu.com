import { hasText, type Post, type Project } from './entities.ts';
import { LOCALES, type Lang } from './i18n.ts';
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
export const featuredPost = <P extends Pick<Post, 'status' | 'date'>>(
	posts: readonly P[]
): P | undefined =>
	posts
		.filter((post) => post.status === 'published')
		.toSorted((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))[0];

/** A post only opens the reader once it actually has a body written. */
export const isReadable = (post: Post): boolean => LOCALES.some((lang) => hasText(post.body[lang]));

export type OutlineEntry = { id: string; number: string; text: string };

/** An article body made safe to inject, with its headings indexed for the side nav. */
export type RenderedArticle = { html: string; outline: OutlineEntry[] };

/**
 * Turns stored HTML into a `RenderedArticle`. Injected rather than imported:
 * sanitising HTML needs a parser, which belongs in an adapter, and this module
 * stays pure.
 */
export type ArticleRenderer = (html: string) => RenderedArticle;

/**
 * A post as the page renders it: both languages already rendered at build
 * time. The stored `body` is left out on purpose, so unsanitised HTML never
 * reaches the page, not even inside its serialised data.
 */
export type PostView = Omit<Post, 'body'> & {
	article: Record<Lang, RenderedArticle>;
	/** Whether it opens the reader; see `isReadable`. */
	readable: boolean;
};

const renderPost =
	(render: ArticleRenderer) =>
	({ body, ...post }: Post): PostView => ({
		...post,
		article: Object.fromEntries(LOCALES.map((lang) => [lang, render(body[lang])])) as Record<
			Lang,
			RenderedArticle
		>,
		readable: isReadable({ ...post, body })
	});

export type BlogView = { featured: PostView | undefined; others: PostView[] };

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
export const toPortfolioView = (portfolio: Portfolio, render: ArticleRenderer): PortfolioView => {
	const hasPosts = portfolio.posts.length > 0;
	const rendered = BANDS.filter((band) => band !== 'blog' || hasPosts);
	const posts = portfolio.posts.map(renderPost(render));
	const featured = featuredPost(posts);

	return {
		site: portfolio.site,
		nav: portfolio.site.nav.links.filter((link) => link.href !== '#blog' || hasPosts),
		bands: bandNumbers(rendered),
		blog: hasPosts ? { featured, others: posts.filter((post) => post !== featured) } : null,
		experience: portfolio.experience,
		skills: portfolio.skills,
		projects: orderProjects(portfolio.projects)
	};
};
