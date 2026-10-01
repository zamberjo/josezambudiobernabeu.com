import { assemblePortfolio, type PortfolioReader } from '@jzb/application';
import { byCollection, COLLECTIONS, err, type CollectionName } from '@jzb/domain';
import { codecs, type ContentColumns } from './codecs.ts';
import type { ContentClient } from './client.ts';

/**
 * Reads the published aggregate from the `api` views, which are the only
 * contract the web depends on: the tables behind them can change freely.
 * One request per view, in parallel; the domain validates the result whole.
 */
export const supabasePortfolioReader =
	(client: ContentClient): PortfolioReader =>
	async () => {
		const api = client.schema('api');
		const [sections, ...lists] = await Promise.all([
			api.from('site_sections').select('key, value'),
			...COLLECTIONS.map((collection) => api.from(collection).select('*'))
		]);

		const failed = [sections, ...lists].find((response) => response.error);
		if (failed?.error) return err({ kind: 'unavailable', message: failed.error.message });

		return assemblePortfolio({
			sections: Object.fromEntries((sections.data ?? []).map((row) => [row.key, row.value])),
			lists: byCollection((collection) =>
				(
					(lists[COLLECTIONS.indexOf(collection)]?.data ?? []) as ContentColumns<CollectionName>[]
				).map((row) => ({
					position: row.position,
					data: (codecs[collection].fromRow as (row: unknown) => unknown)(row)
				}))
			)
		});
	};
