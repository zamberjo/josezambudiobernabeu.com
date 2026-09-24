import * as v from 'valibot';
import {
	COLLECTIONS,
	ExperienceSchema,
	PostSchema,
	ProjectSchema,
	SkillSchema,
	naturalKey,
	type CollectionName,
	type Entities
} from './entities.ts';
import { err, ok, type Result } from './result.ts';
import { SiteSchema } from './site.ts';

/**
 * The whole page's content: the aggregate the web reads in one go. Lists are
 * in display order, which the store keeps as a `position`.
 */
export const PortfolioSchema = v.pipe(
	v.strictObject({
		site: SiteSchema,
		experience: v.array(ExperienceSchema),
		posts: v.array(PostSchema),
		skills: v.array(SkillSchema),
		projects: v.array(ProjectSchema)
	}),
	// Cross-entity rule: natural keys are unique, since they key the markup.
	v.check(
		(portfolio) => allDuplicates(portfolio).length === 0,
		(issue) => `Duplicate keys: ${allDuplicates(issue.input as Lists).join(', ')}`
	)
);

export type Portfolio = v.InferOutput<typeof PortfolioSchema>;

type Lists = { [K in CollectionName]: Entities[K][] };

const allDuplicates = (lists: Lists): string[] =>
	COLLECTIONS.flatMap((collection) =>
		duplicates(collection, lists[collection]).map((key) => `${collection}.${key}`)
	);

function duplicates<K extends CollectionName>(collection: K, items: Entities[K][]): string[] {
	const keys = items.map((item) => naturalKey[collection](item));
	return [...new Set(keys.filter((key, i) => keys.indexOf(key) !== i))];
}

// --- Parsing at the boundary ----------------------------------------------------

export type ValidationIssue = { readonly path: string; readonly message: string };
export type ValidationError = { readonly kind: 'validation'; readonly issues: ValidationIssue[] };

/** Turns any schema into a pure `unknown → Result` parser with readable issue paths. */
export const parseWith =
	<S extends v.GenericSchema>(schema: S) =>
	(input: unknown): Result<v.InferOutput<S>, ValidationError> => {
		const result = v.safeParse(schema, input);
		return result.success
			? ok(result.output)
			: err({
					kind: 'validation',
					issues: result.issues.map((issue) => ({
						path: v.getDotPath(issue) ?? '(root)',
						message: issue.message
					}))
				});
	};

export const parsePortfolio = parseWith(PortfolioSchema);

export const describeValidation = (error: ValidationError): string =>
	error.issues.map((issue) => `  ${issue.path}: ${issue.message}`).join('\n');
