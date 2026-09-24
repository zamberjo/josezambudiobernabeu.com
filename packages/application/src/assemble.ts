import {
	COLLECTIONS,
	parsePortfolio,
	type CollectionName,
	type Portfolio,
	type Result,
	type SiteSection,
	type ValidationError
} from '@jzb/domain';

/** What any store holds: loose section values and positioned list entries. */
export type StoredContent = {
	sections: Partial<Record<SiteSection, unknown>>;
	lists: { [K in CollectionName]: readonly { position: number; data: unknown }[] };
};

/**
 * Builds the aggregate from a store's raw contents and validates it as a
 * whole. Every reader adapter ends here, so the web gets the same guarantees
 * whichever store it was built from.
 */
export const assemblePortfolio = (content: StoredContent): Result<Portfolio, ValidationError> =>
	parsePortfolio({
		site: content.sections,
		...Object.fromEntries(
			COLLECTIONS.map((collection) => [
				collection,
				content.lists[collection]
					.toSorted((a, b) => a.position - b.position)
					.map((entry) => entry.data)
			])
		)
	});

/** The inverse, for seeding a store from a snapshot: positions follow array order. */
export const disassemblePortfolio = (portfolio: Portfolio) => ({
	sections: portfolio.site,
	lists: Object.fromEntries(
		COLLECTIONS.map((collection) => [
			collection,
			portfolio[collection].map((data, position) => ({ position, data }))
		])
	) as { [K in CollectionName]: { position: number; data: Portfolio[K][number] }[] }
});
