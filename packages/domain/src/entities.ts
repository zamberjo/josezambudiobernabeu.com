import * as v from 'valibot';
import { LocalizedSchema } from './i18n.ts';

/*
 * The schemas are the single declaration of the model: every type below is
 * inferred from one, so the shape and its validation cannot drift apart.
 * Business rules sit next to the shape they constrain.
 */

const Slug = v.pipe(
	v.string(),
	v.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Must be lowercase words joined by hyphens')
);
const IsoDate = v.pipe(v.string(), v.isoDate('Must be a YYYY-MM-DD date'));
const Url = v.pipe(v.string(), v.url('Must be an absolute URL'));
/** Covers and images may be site-relative (`/assets/…`) or absolute (Supabase Storage). */
const ImageSrc = v.pipe(
	v.string(),
	v.check((src) => src.startsWith('/') || URL.canParse(src), 'Must be a /path or an absolute URL')
);

// --- Blog -------------------------------------------------------------------

/**
 * Article bodies are HTML, one document per language, written in the
 * backoffice's WYSIWYG editor (or pasted as source). The domain only stores
 * it: sanitising it and indexing its headings is the `ArticleRenderer`
 * port's job at build time, so no untrusted markup reaches the page.
 */
export const ArticleSchema = LocalizedSchema;

export type Article = v.InferOutput<typeof ArticleSchema>;

/**
 * Whether an HTML fragment has anything to read. A structural test, not a
 * parser: it only has to tell an empty editor (`<p></p>`) from an article.
 */
export const hasText = (html: string): boolean =>
	html
		.replace(/<(img|iframe|video|pre)\b/gi, 'x<')
		.replace(/<[^>]*>|&nbsp;/g, '')
		.trim() !== '';

export const POST_STATUSES = ['published', 'draft'] as const;

export const PostSchema = v.pipe(
	v.strictObject({
		slug: Slug,
		/** `draft` posts show in the grid but only open the reader once they have a body. */
		status: v.picklist(POST_STATUSES),
		date: v.nullable(IsoDate),
		cover: v.nullable(ImageSrc),
		tags: v.array(v.pipe(v.string(), v.nonEmpty())),
		title: LocalizedSchema,
		excerpt: LocalizedSchema,
		body: ArticleSchema
	}),
	v.forward(
		v.partialCheck(
			[['status'], ['date']],
			(post) => post.status !== 'published' || post.date !== null,
			'A published post needs a date'
		),
		['date']
	),
	v.forward(
		v.partialCheck(
			[['status'], ['body']],
			(post) => post.status !== 'published' || (hasText(post.body.es) && hasText(post.body.en)),
			'A published post needs a body in every language'
		),
		['body']
	)
);

export type Post = v.InferOutput<typeof PostSchema>;

// --- Projects, skills, experience --------------------------------------------

export const ProjectSchema = v.strictObject({
	name: v.pipe(v.string(), v.nonEmpty()),
	/** Featured projects lead the grid; the rest keep their order behind them. */
	featured: v.boolean(),
	projectUrl: Url,
	productionUrl: v.nullable(Url),
	technologies: v.array(v.string()),
	description: LocalizedSchema
});

export type Project = v.InferOutput<typeof ProjectSchema>;

export const SkillSchema = v.strictObject({
	name: v.pipe(v.string(), v.nonEmpty()),
	/** 0–100. Drives how far the meter fills as the section scrolls past. */
	level: v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(100)),
	/** Accent-coloured meter instead of ink; use it for the headline skills. */
	accent: v.boolean(),
	detail: LocalizedSchema
});

export type Skill = v.InferOutput<typeof SkillSchema>;

export const ExperienceSchema = v.strictObject({
	role: v.pipe(v.string(), v.nonEmpty()),
	period: LocalizedSchema,
	summary: LocalizedSchema
});

export type Experience = v.InferOutput<typeof ExperienceSchema>;

// --- Collections --------------------------------------------------------------

/** The ordered, editable lists. Each one is a table in the database. */
export const COLLECTIONS = ['posts', 'projects', 'skills', 'experience'] as const;
export type CollectionName = (typeof COLLECTIONS)[number];

export type Entities = {
	posts: Post;
	projects: Project;
	skills: Skill;
	experience: Experience;
};

export const entitySchemas: { [K in CollectionName]: v.GenericSchema<unknown, Entities[K]> } = {
	posts: PostSchema,
	projects: ProjectSchema,
	skills: SkillSchema,
	experience: ExperienceSchema
};

/** What must be unique inside each collection; it also keys `#each` blocks. */
export const naturalKey: { [K in CollectionName]: (entity: Entities[K]) => string } = {
	posts: (post) => post.slug,
	projects: (project) => project.name,
	skills: (skill) => skill.name,
	experience: (role) => role.role
};

/** Builds a record with one value per collection. */
export const byCollection = <T>(f: (collection: CollectionName) => T): Record<CollectionName, T> =>
	Object.fromEntries(COLLECTIONS.map((collection) => [collection, f(collection)])) as Record<
		CollectionName,
		T
	>;
