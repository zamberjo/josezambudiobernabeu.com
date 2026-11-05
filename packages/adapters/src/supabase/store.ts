import type { ContentCommands, ContentQueries, Stored, StoreError } from '@jzb/application';
import {
	all,
	entitySchemas,
	err,
	ok,
	parseWith,
	siteSectionSchemas,
	type CollectionName,
	type Entities,
	type Result,
	type Site,
	type SiteSection
} from '@jzb/domain';
import { codecs, type TableRow } from './codecs.ts';
import type { ContentClient } from './client.ts';
import type { Json } from './database.types.ts';
import { toStoreError } from './errors.ts';

/*
 * The backoffice's store: reads and writes the `public` tables with the
 * editor's session, so row level security has the final say on every write.
 */

type AnyRow = TableRow<CollectionName>;

/**
 * `from(collection)` over a union of table names defeats supabase-js's
 * inference, so the per-collection typing lives in the codecs instead and the
 * query builder is used untyped here, in one place.
 */
const table = (client: ContentClient, collection: CollectionName) =>
	client.from(collection as 'skills') as unknown as ReturnType<ContentClient['from']>;

const toStored = <K extends CollectionName>(
	collection: K,
	row: AnyRow
): Result<Stored<K>, StoreError> => {
	const parsed = parseWith(entitySchemas[collection])(
		(codecs[collection].fromRow as (row: AnyRow) => unknown)(row)
	);
	return parsed.ok
		? ok({ id: row.id, position: row.position, data: parsed.value as Entities[K] })
		: parsed;
};

export const supabaseContentStore = (client: ContentClient) => {
	const queries: ContentQueries = {
		list: async (collection) => {
			const { data, error } = await table(client, collection).select('*').order('position');
			if (error) return err(toStoreError(error));
			return all((data as AnyRow[]).map((row) => toStored(collection, row)));
		},

		get: async (collection, id) => {
			const { data, error } = await table(client, collection).select('*').eq('id', id).single();
			if (error) return err(toStoreError(error, id));
			return toStored(collection, data as AnyRow);
		},

		section: async <S extends SiteSection>(section: S) => {
			const { data, error } = await client
				.from('site_sections')
				.select('value')
				.eq('key', section)
				.maybeSingle();
			if (error) return err(toStoreError(error));
			if (!data) return ok(null);
			const parsed = parseWith(siteSectionSchemas[section])(data.value);
			return parsed.ok ? ok(parsed.value as Site[S]) : parsed;
		}
	};

	const commands: ContentCommands = {
		save: async (collection, { id, data }) => {
			const row = (codecs[collection].toRow as (entity: unknown) => Record<string, unknown>)(data);
			const query =
				id === undefined
					? table(client, collection)
							.insert({ ...row, position: await nextPosition(client, collection) } as never)
							.select('*')
							.single()
					: table(client, collection)
							.update(row as never)
							.eq('id', id)
							.select('*')
							.single();
			const { data: saved, error } = await query;
			if (error) return err(toStoreError(error, id));
			return toStored(collection, saved as AnyRow);
		},

		remove: async (collection, id) => {
			const { error, count } = await table(client, collection)
				.delete({ count: 'exact' })
				.eq('id', id);
			if (error) return err(toStoreError(error, id));
			return count === 0 ? err({ kind: 'not-found', id }) : ok(undefined);
		},

		reorder: async (collection, ids) => {
			const { error } = await client.rpc('reorder', { collection, ids: [...ids] });
			return error ? err(toStoreError(error)) : ok(undefined);
		},

		saveSection: async (section, value) => {
			const { error } = await client
				.from('site_sections')
				.upsert({ key: section, value: value as Json });
			return error ? err(toStoreError(error)) : ok(undefined);
		}
	};

	return { queries, commands };
};

/** New entries go last. */
async function nextPosition(client: ContentClient, collection: CollectionName): Promise<number> {
	const { data } = await table(client, collection)
		.select('position')
		.order('position', { ascending: false })
		.limit(1);
	const last = (data as { position: number }[] | null)?.[0]?.position;
	return last === undefined ? 0 : last + 1;
}
