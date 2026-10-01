import type { CollectionName, Entities } from '@jzb/domain';
import type { Database, Json } from './database.types.ts';

/*
 * The anti-corruption layer: the only place that knows both the database's
 * snake_case columns and the domain's shape. Everything leaving `fromRow` is
 * re-validated by the domain schema, so it may be loose; everything entering
 * `toRow` is already a valid domain value, so it can be exact.
 */

type Tables = Database['public']['Tables'];
export type TableRow<K extends CollectionName> = Tables[K]['Row'];
export type TableInsert<K extends CollectionName> = Tables[K]['Insert'];

/** Columns shared by the `public` table and its `api` view. */
export type ContentColumns<K extends CollectionName> = Omit<
	TableRow<K>,
	'id' | 'created_at' | 'updated_at'
>;

export type Codec<K extends CollectionName> = {
	toRow: (
		entity: Entities[K]
	) => Omit<TableInsert<K>, 'id' | 'position' | 'created_at' | 'updated_at'>;
	fromRow: (row: ContentColumns<K>) => unknown;
};

const json = (value: unknown) => value as Json;

export const codecs: { [K in CollectionName]: Codec<K> } = {
	posts: {
		toRow: (post) => ({
			slug: post.slug,
			status: post.status,
			published_on: post.date,
			reading_time: post.readingTime,
			cover: post.cover,
			tags: post.tags,
			title: json(post.title),
			excerpt: json(post.excerpt),
			body: json(post.body)
		}),
		fromRow: (row) => ({
			slug: row.slug,
			status: row.status,
			date: row.published_on,
			readingTime: row.reading_time,
			cover: row.cover,
			tags: row.tags,
			title: row.title,
			excerpt: row.excerpt,
			body: row.body
		})
	},
	projects: {
		toRow: (project) => ({
			name: project.name,
			featured: project.featured,
			project_url: project.projectUrl,
			production_url: project.productionUrl,
			technologies: project.technologies,
			description: json(project.description)
		}),
		fromRow: (row) => ({
			name: row.name,
			featured: row.featured,
			projectUrl: row.project_url,
			productionUrl: row.production_url,
			technologies: row.technologies,
			description: row.description
		})
	},
	skills: {
		toRow: (skill) => ({
			name: skill.name,
			level: skill.level,
			accent: skill.accent,
			detail: json(skill.detail)
		}),
		fromRow: (row) => ({
			name: row.name,
			level: row.level,
			accent: row.accent,
			detail: row.detail
		})
	},
	experience: {
		toRow: (role) => ({
			role: role.role,
			period: json(role.period),
			summary: json(role.summary)
		}),
		fromRow: (row) => ({
			role: row.role,
			period: row.period,
			summary: row.summary
		})
	}
};
