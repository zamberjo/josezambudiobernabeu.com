import { describe, expect, it, vi } from 'vitest';
import { err, ok, parsePortfolio, type Portfolio } from '@jzb/domain';
import snapshot from '../../../content/portfolio.json' with { type: 'json' };
import { assemblePortfolio, disassemblePortfolio } from './assemble.ts';
import { move } from './ordering.ts';
import type { ContentCommands, ContentQueries, PortfolioReader } from './ports.ts';
import { loadPortfolioView, moveEntry, publishSite, saveEntry, saveSection } from './use-cases.ts';

const portfolio = (() => {
	const result = parsePortfolio(snapshot);
	if (!result.ok) throw new Error('invalid snapshot');
	return result.value;
})();

const reader =
	(value: Portfolio): PortfolioReader =>
	async () =>
		ok(value);

const commands = (): ContentCommands => ({
	save: vi.fn(async (_collection, entry) =>
		ok({ id: entry.id ?? 'new', position: 0, data: entry.data })
	),
	remove: vi.fn(async () => ok(undefined)),
	reorder: vi.fn(async () => ok(undefined)),
	saveSection: vi.fn(async () => ok(undefined))
});

describe('ordering', () => {
	it('swaps with the neighbour and leaves the edges alone', () => {
		const ids = ['a', 'b', 'c'];
		expect(move(ids, 'b', 'up')).toEqual(['b', 'a', 'c']);
		expect(move(ids, 'b', 'down')).toEqual(['a', 'c', 'b']);
		expect(move(ids, 'a', 'up')).toBe(ids);
		expect(move(ids, 'x', 'down')).toBe(ids);
	});
});

describe('assembling', () => {
	it('round-trips a snapshot through the store shape, whatever order rows arrive in', () => {
		const { sections, lists } = disassemblePortfolio(portfolio);
		const shuffled = { ...lists, skills: lists.skills.toReversed() };
		const result = assemblePortfolio({ sections, lists: shuffled });
		expect(result).toEqual(ok(portfolio));
	});

	it('fails when a site section is missing', () => {
		const { sections, lists } = disassemblePortfolio(portfolio);
		const { hero: _hero, ...rest } = sections;
		const result = assemblePortfolio({ sections: rest, lists });
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error.issues[0]?.path).toBe('site.hero');
	});
});

describe('use cases', () => {
	it('loadPortfolioView maps the aggregate to the read model', async () => {
		const view = await loadPortfolioView(reader(portfolio))();
		expect(view.ok && view.value.blog).toBeNull();
	});

	it('saveEntry never reaches the store with invalid data', async () => {
		const store = commands();
		const result = await saveEntry(store)('skills', { data: { name: 'Go', level: 140 } });
		expect(result.ok).toBe(false);
		expect(store.save).not.toHaveBeenCalled();
	});

	it('saveEntry passes valid data through', async () => {
		const store = commands();
		const skill = portfolio.skills[0]!;
		const result = await saveEntry(store)('skills', { id: 'x', data: skill });
		expect(result.ok).toBe(true);
		expect(store.save).toHaveBeenCalledWith('skills', { id: 'x', data: skill });
	});

	it('saveSection validates against that section only', async () => {
		const store = commands();
		expect((await saveSection(store)('quote', { text: '', author: 'x' })).ok).toBe(false);
		expect((await saveSection(store)('quote', { text: 'Hi', author: 'x' })).ok).toBe(true);
	});

	it('moveEntry rewrites positions only when something moves', async () => {
		const store = commands();
		const queries: ContentQueries = {
			list: async () =>
				ok(
					['a', 'b'].map((id, position) => ({ id, position, data: portfolio.skills[0]! }))
				) as never,
			get: async () => err({ kind: 'not-found', id: '' }),
			section: async () => ok(null)
		};
		await moveEntry(queries, store)('skills', 'a', 'up');
		expect(store.reorder).not.toHaveBeenCalled();
		await moveEntry(queries, store)('skills', 'a', 'down');
		expect(store.reorder).toHaveBeenCalledWith('skills', ['b', 'a']);
	});

	it('publishSite does not trigger a deploy of invalid content', async () => {
		const trigger = vi.fn(async () => ok(undefined));
		const broken: PortfolioReader = async () => err({ kind: 'validation', issues: [] });
		expect((await publishSite(broken, trigger)()).ok).toBe(false);
		expect(trigger).not.toHaveBeenCalled();
		expect((await publishSite(reader(portfolio), trigger)()).ok).toBe(true);
		expect(trigger).toHaveBeenCalledOnce();
	});
});
