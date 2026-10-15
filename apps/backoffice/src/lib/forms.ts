import {
	POST_STATUSES,
	UI_KEYS,
	type CollectionName,
	type Entities,
	type Localized,
	type Site,
	type SiteSection
} from '@jzb/domain';

/*
 * Forms are data, not markup: one descriptor list per collection and per site
 * section, rendered by a single <Fields> component. Adding a field is a line
 * here, and a new field kind is a new union member plus one branch in
 * Field.svelte (open for extension, closed for modification).
 */

export type Field<K extends string = string> =
	| { kind: 'text'; key: K; label: string; nullable?: boolean; hint?: string }
	| { kind: 'code'; key: K; label: string }
	| { kind: 'number'; key: K; label: string; min?: number; max?: number; nullable?: boolean }
	| { kind: 'boolean'; key: K; label: string }
	| { kind: 'select'; key: K; label: string; options: readonly string[] }
	| { kind: 'date'; key: K; label: string }
	| { kind: 'localized'; key: K; label: string; multiline?: boolean }
	| { kind: 'strings'; key: K; label: string; hint?: string }
	| { kind: 'localizedList'; key: K; label: string }
	| { kind: 'links'; key: K; label: string; localized: boolean }
	| { kind: 'richText'; key: K; label: string };

export type FieldKind = Field['kind'];

type FieldsFor<T> = Field<Extract<keyof T, string>>[];

export const collectionLabels: Record<CollectionName, string> = {
	posts: 'Blog',
	projects: 'Proyectos',
	skills: 'Skills',
	experience: 'Experiencia'
};

export const sectionLabels: Record<SiteSection, string> = {
	meta: 'Meta (SEO)',
	social: 'Redes sociales',
	nav: 'Navegación',
	hero: 'Hero',
	about: 'Sobre mí',
	blog: 'Blog (intro)',
	education: 'Estudios',
	quote: 'Cita',
	footer: 'Footer',
	ui: 'Textos de interfaz'
};

export const collectionFields: { [K in CollectionName]: FieldsFor<Entities[K]> } = {
	posts: [
		{ kind: 'text', key: 'slug', label: 'Slug', hint: 'minúsculas-con-guiones' },
		{ kind: 'select', key: 'status', label: 'Estado', options: POST_STATUSES },
		{ kind: 'date', key: 'date', label: 'Fecha' },
		{
			kind: 'text',
			key: 'cover',
			label: 'Portada',
			nullable: true,
			hint: '/assets/… o una URL de Media'
		},
		{ kind: 'strings', key: 'tags', label: 'Etiquetas', hint: 'Una por línea' },
		{ kind: 'localized', key: 'title', label: 'Título' },
		{ kind: 'localized', key: 'excerpt', label: 'Extracto', multiline: true },
		{ kind: 'richText', key: 'body', label: 'Cuerpo' }
	],
	projects: [
		{ kind: 'text', key: 'name', label: 'Nombre' },
		{ kind: 'boolean', key: 'featured', label: 'Destacado' },
		{ kind: 'text', key: 'projectUrl', label: 'Repositorio' },
		{ kind: 'text', key: 'productionUrl', label: 'Producción', nullable: true },
		{ kind: 'strings', key: 'technologies', label: 'Tecnologías', hint: 'Una por línea' },
		{ kind: 'localized', key: 'description', label: 'Descripción', multiline: true }
	],
	skills: [
		{ kind: 'text', key: 'name', label: 'Nombre' },
		{ kind: 'number', key: 'level', label: 'Nivel (0–100)', min: 0, max: 100 },
		{ kind: 'boolean', key: 'accent', label: 'Barra en rojo' },
		{ kind: 'localized', key: 'detail', label: 'Detalle' }
	],
	experience: [
		{ kind: 'text', key: 'role', label: 'Puesto' },
		{ kind: 'localized', key: 'period', label: 'Periodo' },
		{ kind: 'localized', key: 'summary', label: 'Resumen', multiline: true }
	]
};

const uiLabels: Record<(typeof UI_KEYS)[number], string> = {
	aboutTitle: 'Título: Sobre mí',
	blogTitle: 'Título: Blog',
	experienceTitle: 'Título: Experiencia',
	skillsTitle: 'Título: Skills',
	educationTitle: 'Título: Estudios',
	projectsTitle: 'Título: Side Projects',
	portraitPlaceholder: 'Hueco de la foto de perfil',
	latestPost: 'Etiqueta «último artículo»',
	read: 'Botón «leer»',
	draft: 'Etiqueta «borrador»',
	minRead: '«min de lectura»',
	postImage: 'Hueco de imagen de artículo',
	latestPostImage: 'Hueco de imagen del destacado',
	coverImage: 'Hueco de portada en el lector',
	backToBlog: 'Botón «volver al blog»',
	inThisPost: 'Índice «en este artículo»'
};

export const sectionFields: { [S in SiteSection]: FieldsFor<Site[S]> } = {
	meta: [{ kind: 'localized', key: 'description', label: 'Meta description', multiline: true }],
	social: [{ kind: 'links', key: 'links', label: 'Enlaces', localized: false }],
	nav: [{ kind: 'links', key: 'links', label: 'Enlaces (#sección)', localized: true }],
	hero: [
		{ kind: 'strings', key: 'names', label: 'Nombres que rotan', hint: 'Uno por línea' },
		{ kind: 'localized', key: 'kicker', label: 'Antetítulo' },
		{ kind: 'localized', key: 'tagline', label: 'Lema', multiline: true }
	],
	about: [
		{ kind: 'text', key: 'path', label: 'Ruta del terminal' },
		{ kind: 'text', key: 'command', label: 'Comando' },
		{ kind: 'localizedList', key: 'paragraphs', label: 'Párrafos' },
		{ kind: 'localized', key: 'degree', label: 'Titulación' }
	],
	blog: [{ kind: 'localized', key: 'intro', label: 'Entradilla', multiline: true }],
	education: [
		{ kind: 'localized', key: 'degree', label: 'Titulación' },
		{ kind: 'text', key: 'school', label: 'Centro' }
	],
	quote: [
		{ kind: 'text', key: 'text', label: 'Cita' },
		{ kind: 'text', key: 'author', label: 'Autor' }
	],
	footer: [
		{ kind: 'text', key: 'brand', label: 'Marca' },
		{ kind: 'localized', key: 'blurb', label: 'Descripción' },
		{ kind: 'localized', key: 'blogLink', label: 'Enlace al blog' },
		{ kind: 'text', key: 'site', label: 'Nombre del sitio' },
		{ kind: 'text', key: 'siteUrl', label: 'URL del sitio' }
	],
	ui: UI_KEYS.map((key) => ({ kind: 'localized', key, label: uiLabels[key] }))
};

// --- Blank values ------------------------------------------------------------------

export const blankLocalized = (): Localized => ({ es: '', en: '' });

export const blankEntity: { [K in CollectionName]: () => Entities[K] } = {
	posts: () => ({
		slug: '',
		status: 'draft',
		date: null,
		cover: null,
		tags: [],
		title: blankLocalized(),
		excerpt: blankLocalized(),
		body: blankLocalized()
	}),
	projects: () => ({
		name: '',
		featured: false,
		projectUrl: '',
		productionUrl: null,
		technologies: [],
		description: blankLocalized()
	}),
	skills: () => ({ name: '', level: 50, accent: false, detail: blankLocalized() }),
	experience: () => ({ role: '', period: blankLocalized(), summary: blankLocalized() })
};

export function exhaustive(value: never): never {
	throw new Error(`Unhandled case: ${String(value)}`);
}
