import {
	assemblePortfolio,
	disassemblePortfolio,
	type ContentCommands,
	type ContentQueries,
	type PortfolioReader,
	type Stored
} from '@jzb/application';
import {
	COLLECTIONS,
	err,
	ok,
	type CollectionName,
	type Portfolio,
	type Site,
	type SiteSection
} from '@jzb/domain';

type State = {
	sections: Partial<Site>;
	lists: { [K in CollectionName]: Stored<K>[] };
};

/**
 * A complete store in a closure: the reference implementation of the ports.
 * It runs the shared store contract with no database behind it.
 * Every write replaces `state` with a new value; nothing is mutated in place.
 */
export const createMemoryStore = (seed?: Portfolio, newId = sequence()) => {
	let state: State = seed ? fromPortfolio(seed, newId) : empty();

	const list = <K extends CollectionName>(collection: K): Stored<K>[] =>
		(state.lists[collection] as Stored<K>[]).toSorted((a, b) => a.position - b.position);

	const setList = <K extends CollectionName>(collection: K, entries: Stored<K>[]) => {
		state = { ...state, lists: { ...state.lists, [collection]: entries } };
	};

	const reader: PortfolioReader = async () =>
		assemblePortfolio({ sections: state.sections, lists: state.lists });

	const queries: ContentQueries = {
		list: async (collection) => ok(list(collection)),
		get: async (collection, id) => {
			const found = list(collection).find((entry) => entry.id === id);
			return found ? ok(found) : err({ kind: 'not-found', id });
		},
		section: async <S extends SiteSection>(section: S) => ok(state.sections[section] ?? null)
	};

	const commands: ContentCommands = {
		save: async (collection, { id, data }) => {
			const entries = list(collection);
			if (id === undefined) {
				const created = { id: newId(), position: entries.length, data };
				setList(collection, [...entries, created]);
				return ok(created);
			}
			const current = entries.find((entry) => entry.id === id);
			if (!current) return err({ kind: 'not-found', id });
			const updated = { ...current, data };
			setList(
				collection,
				entries.map((entry) => (entry.id === id ? updated : entry))
			);
			return ok(updated);
		},
		remove: async (collection, id) => {
			const entries = list(collection);
			if (!entries.some((entry) => entry.id === id)) return err({ kind: 'not-found', id });
			setList(
				collection,
				entries.filter((entry) => entry.id !== id)
			);
			return ok(undefined);
		},
		reorder: async (collection, ids) => {
			setList(
				collection,
				list(collection).map((entry) => ({ ...entry, position: ids.indexOf(entry.id) }))
			);
			return ok(undefined);
		},
		saveSection: async (section, value) => {
			state = { ...state, sections: { ...state.sections, [section]: value } };
			return ok(undefined);
		}
	};

	return { reader, queries, commands };
};

function sequence() {
	let n = 0;
	return () => `mem-${++n}`;
}

function empty(): State {
	return {
		sections: {},
		lists: Object.fromEntries(COLLECTIONS.map((c) => [c, []])) as unknown as State['lists']
	};
}

function fromPortfolio(portfolio: Portfolio, newId: () => string): State {
	const { sections, lists } = disassemblePortfolio(portfolio);
	return {
		sections,
		lists: Object.fromEntries(
			COLLECTIONS.map((c) => [c, lists[c].map((entry) => ({ id: newId(), ...entry }))])
		) as unknown as State['lists']
	};
}
