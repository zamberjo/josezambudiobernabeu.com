import * as v from 'valibot';
import { LocalizedSchema } from './i18n.ts';

/*
 * The page copy that is not a list: one value per section, stored as one row
 * per key in `site_sections`. `ui` holds the interface strings the components
 * used to carry inline, so every translation now lives in the content store.
 */

const Text = v.pipe(v.string(), v.nonEmpty());

const LinkSchema = v.strictObject({
	label: Text,
	href: v.pipe(v.string(), v.url())
});

/** Nav targets are the section ids the page renders, so they are fragments. */
const NavLinkSchema = v.strictObject({
	href: v.pipe(v.string(), v.regex(/^#[a-z0-9-]+$/, 'Must be an in-page #fragment')),
	label: LocalizedSchema
});

export const UI_KEYS = [
	'aboutTitle',
	'blogTitle',
	'experienceTitle',
	'skillsTitle',
	'educationTitle',
	'projectsTitle',
	'portraitPlaceholder',
	'latestPost',
	'read',
	'draft',
	'minRead',
	'postImage',
	'latestPostImage',
	'coverImage',
	'backToBlog',
	'inThisPost'
] as const;

export type UiKey = (typeof UI_KEYS)[number];

const UiSchema = v.strictObject(
	Object.fromEntries(UI_KEYS.map((key) => [key, LocalizedSchema])) as Record<
		UiKey,
		typeof LocalizedSchema
	>
);

export const siteSectionSchemas = {
	meta: v.strictObject({ description: LocalizedSchema }),
	social: v.strictObject({ links: v.array(LinkSchema) }),
	nav: v.strictObject({ links: v.array(NavLinkSchema) }),
	hero: v.strictObject({
		/** Cycled through in place by the display heading. */
		names: v.pipe(v.array(Text), v.minLength(1)),
		kicker: LocalizedSchema,
		tagline: LocalizedSchema
	}),
	about: v.strictObject({
		path: Text,
		command: Text,
		paragraphs: v.array(LocalizedSchema),
		degree: LocalizedSchema
	}),
	blog: v.strictObject({ intro: LocalizedSchema }),
	education: v.strictObject({ degree: LocalizedSchema, school: Text }),
	quote: v.strictObject({ text: Text, author: Text }),
	footer: v.strictObject({
		brand: Text,
		blurb: LocalizedSchema,
		blogLink: LocalizedSchema,
		site: Text,
		siteUrl: v.pipe(v.string(), v.url())
	}),
	ui: UiSchema
};

export type SiteSection = keyof typeof siteSectionSchemas;
export const SITE_SECTIONS = Object.keys(siteSectionSchemas) as SiteSection[];

export const SiteSchema = v.strictObject(siteSectionSchemas);

export type Site = v.InferOutput<typeof SiteSchema>;
export type Ui = Site['ui'];
export type NavLink = Site['nav']['links'][number];
