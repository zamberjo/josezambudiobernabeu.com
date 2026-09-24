import {
	entitySchemas,
	map,
	ok,
	parseWith,
	siteSectionSchemas,
	toPortfolioView,
	type CollectionName,
	type Entities,
	type PortfolioView,
	type Result,
	type Site,
	type SiteSection
} from '@jzb/domain';
import { move, type Direction } from './ordering.ts';
import type {
	ContentCommands,
	ContentQueries,
	PortfolioReader,
	PublishError,
	PublishTrigger,
	ReadError,
	SnapshotSink,
	Stored,
	StoreError,
	Unavailable
} from './ports.ts';

/*
 * Each use case is a curried function: dependencies first, input second. The
 * composition root applies the first call once; callers only see the second.
 */

// --- Web ------------------------------------------------------------------------

export const loadPortfolioView =
	(read: PortfolioReader) => async (): Promise<Result<PortfolioView, ReadError>> =>
		map(await read(), toPortfolioView);

// --- Backoffice: commands ---------------------------------------------------------

/** Validates untrusted form input against the domain before it reaches the store. */
export const saveEntry =
	(commands: ContentCommands) =>
	async <K extends CollectionName>(
		collection: K,
		input: { id?: string; data: unknown }
	): Promise<Result<Stored<K>, StoreError>> => {
		const parsed = parseWith(entitySchemas[collection])(input.data);
		if (!parsed.ok) return parsed;
		return commands.save(collection, { id: input.id, data: parsed.value as Entities[K] });
	};

export const removeEntry = (commands: ContentCommands) => commands.remove;

export const moveEntry =
	(queries: ContentQueries, commands: ContentCommands) =>
	async (
		collection: CollectionName,
		id: string,
		direction: Direction
	): Promise<Result<void, StoreError>> => {
		const listed = await queries.list(collection);
		if (!listed.ok) return listed;
		const ids = listed.value.map((entry) => entry.id);
		const next = move(ids, id, direction);
		return next === ids ? ok(undefined) : commands.reorder(collection, next);
	};

export const saveSection =
	(commands: ContentCommands) =>
	async <S extends SiteSection>(section: S, input: unknown): Promise<Result<void, StoreError>> => {
		const parsed = parseWith(siteSectionSchemas[section])(input);
		if (!parsed.ok) return parsed;
		return commands.saveSection(section, parsed.value as Site[S]);
	};

// --- Backoffice: publishing ---------------------------------------------------------

/**
 * Re-reads the whole aggregate before triggering the deploy, so cross-entity
 * rules (unique keys, every section present) fail here with a readable list,
 * not twenty minutes later in a CI log.
 */
export const publishSite =
	(read: PortfolioReader, trigger: PublishTrigger) =>
	async (): Promise<Result<void, PublishError>> => {
		const portfolio = await read();
		return portfolio.ok ? trigger() : portfolio;
	};

/** Dumps the store into a snapshot: a versioned backup and the tests' fixture. */
export const exportSnapshot =
	(read: PortfolioReader, sink: SnapshotSink) =>
	async (): Promise<Result<void, ReadError | Unavailable>> => {
		const portfolio = await read();
		return portfolio.ok ? sink(portfolio.value) : portfolio;
	};
