import { describe, expect, it } from 'vitest';
import snapshot from '../../../content/portfolio.json' with { type: 'json' };
import { parsePortfolio, type Portfolio } from './portfolio.ts';
import { entitySchemas, type Post } from './entities.ts';
import { parseWith } from './portfolio.ts';
import {
	bandNumbers,
	featuredPost,
	isReadable,
	toPortfolioView,
	type ArticleRenderer
} from './view.ts';
import { hasText } from './entities.ts';

const L = (text: string) => ({ es: text, en: text });

const post = (overrides: Partial<Post> = {}): Post => ({
	slug: 'a-post',
	status: 'published',
	date: '2026-01-01',
	readingTime: 5,
	cover: null,
	tags: [],
	title: L('Title'),
	excerpt: L('Excerpt'),
	body: L('<p>Body</p>'),
	...overrides
});

const parsePost = parseWith(entitySchemas.posts);

/** Stands in for the HTML adapter: marks what it was given so the test can see it ran. */
const render: ArticleRenderer = (html) => ({ html: `[${html}]`, outline: [] });

const valid = (): Portfolio => {
	const result = parsePortfolio(snapshot);
	if (!result.ok) throw new Error('the committed snapshot must be valid');
	return result.value;
};

describe('the content snapshot', () => {
	it('parses', () => {
		expect(parsePortfolio(snapshot).ok).toBe(true);
	});

	it('rejects a translation missing a language, naming the field', () => {
		const broken = structuredClone(snapshot) as { skills: { detail: object }[] };
		broken.skills[0]!.detail = { es: 'solo español' };
		const result = parsePortfolio(broken);
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error.issues[0]?.path).toBe('skills.0.detail.en');
	});

	it('rejects duplicate natural keys', () => {
		const portfolio = valid();
		const result = parsePortfolio({
			...portfolio,
			skills: [...portfolio.skills, portfolio.skills[0]]
		});
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error.issues[0]?.message).toContain('skills.Python');
	});
});

describe('post rules', () => {
	it('a published post needs a date, a reading time and a body', () => {
		const result = parsePost(post({ date: null, readingTime: null, body: L('<p></p>') }));
		expect(result.ok).toBe(false);
		if (!result.ok)
			expect(result.error.issues.map((issue) => issue.path).sort()).toEqual([
				'body',
				'date',
				'readingTime'
			]);
	});

	it('a draft needs none of them', () => {
		expect(
			parsePost(post({ status: 'draft', date: null, readingTime: null, body: L('') })).ok
		).toBe(true);
	});

	it('needs the body in every language to publish', () => {
		const result = parsePost(post({ body: { es: '<p>Hola</p>', en: '<p><br></p>' } }));
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error.issues[0]?.path).toBe('body');
	});

	it('rejects a body that is not one HTML string per language', () => {
		expect(parsePost(post({ body: [{ type: 'paragraph' }] as never })).ok).toBe(false);
	});
});

describe('read model', () => {
	it('features the newest published post', () => {
		const posts = [
			post({ slug: 'old', date: '2025-01-01' }),
			post({ slug: 'new', date: '2026-05-01' }),
			post({ slug: 'draft', status: 'draft', date: '2027-01-01' })
		];
		expect(featuredPost(posts)?.slug).toBe('new');
	});

	it('tells an empty editor from an article', () => {
		expect(hasText('<p></p><p>&nbsp;</p><br>')).toBe(false);
		expect(hasText('<p>Hola</p>')).toBe(true);
		expect(hasText('<figure><img src="/a.png"></figure>')).toBe(true);
		expect(isReadable(post({ body: L('<p></p>') }))).toBe(false);
	});

	it('renders every language of every post through the injected renderer', () => {
		const view = toPortfolioView({ ...valid(), posts: [post()] }, render);
		expect(view.blog?.featured?.article.en).toEqual({ html: '[<p>Body</p>]', outline: [] });
	});

	it('drops the blog band, its nav link and renumbers when there are no posts', () => {
		const view = toPortfolioView({ ...valid(), posts: [] }, render);
		expect(view.blog).toBeNull();
		expect(view.nav.some((link) => link.href === '#blog')).toBe(false);
		expect(view.bands).toEqual(
			bandNumbers(['sobre-mi', 'experiencia', 'skills', 'estudios', 'projects'])
		);
		expect(view.bands.experiencia).toBe('02');
	});

	it('keeps the blog band when there are posts', () => {
		const view = toPortfolioView({ ...valid(), posts: [post()] }, render);
		expect(view.blog?.featured?.slug).toBe('a-post');
		expect(view.bands.blog).toBe('02');
	});

	it('floats featured projects to the front, keeping order', () => {
		const names = toPortfolioView(valid(), render).projects.map((project) => project.featured);
		expect(names).toEqual(names.toSorted((a, b) => Number(b) - Number(a)));
	});
});
