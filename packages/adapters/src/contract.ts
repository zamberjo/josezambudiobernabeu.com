import { expect, it } from 'vitest';
import type { ContentCommands, ContentQueries, PortfolioReader } from '@jzb/application';
import { parsePortfolio, type Portfolio } from '@jzb/domain';
import snapshot from '../../../content/portfolio.json' with { type: 'json' };

export type Store = { reader: PortfolioReader; queries: ContentQueries; commands: ContentCommands };

export const seedPortfolio = (): Portfolio => {
	const result = parsePortfolio(snapshot);
	if (!result.ok) throw new Error('invalid snapshot');
	return result.value;
};

/**
 * The behaviour every store adapter must share (Liskov, made executable). Each
 * adapter's test calls this with a factory that returns a store seeded with
 * content/portfolio.json.
 */
export function contentStoreContract(make: () => Promise<Store>) {
	it('reads back the seeded snapshot as the same aggregate', async () => {
		const { reader } = await make();
		expect(await reader()).toEqual({ ok: true, value: seedPortfolio() });
	});

	it('appends a new entry last and reads it back', async () => {
		const { reader, commands } = await make();
		const skill = {
			name: 'Rust',
			level: 10,
			accent: false,
			detail: { es: 'Aprendiendo', en: 'Learning' }
		};
		const saved = await commands.save('skills', { data: skill });
		expect(saved.ok).toBe(true);
		const portfolio = await reader();
		expect(portfolio.ok && portfolio.value.skills.at(-1)).toEqual(skill);
	});

	it('updates in place, keeping the position', async () => {
		const { reader, queries, commands } = await make();
		const listed = await queries.list('skills');
		if (!listed.ok) throw new Error('list failed');
		const first = listed.value[0]!;
		await commands.save('skills', { id: first.id, data: { ...first.data, level: 99 } });
		const portfolio = await reader();
		expect(portfolio.ok && portfolio.value.skills[0]?.level).toBe(99);
	});

	it('reorders and removes', async () => {
		const { queries, commands } = await make();
		const listed = await queries.list('projects');
		if (!listed.ok) throw new Error('list failed');
		const ids = listed.value.map((entry) => entry.id);
		await commands.reorder('projects', ids.toReversed());
		const reordered = await queries.list('projects');
		expect(reordered.ok && reordered.value.map((entry) => entry.id)).toEqual(ids.toReversed());

		expect((await commands.remove('projects', ids[0]!)).ok).toBe(true);
		const after = await queries.list('projects');
		expect(after.ok && after.value.length).toBe(ids.length - 1);
	});

	it('reports a missing id as not-found', async () => {
		const { queries } = await make();
		const result = await queries.get('posts', '00000000-0000-0000-0000-000000000000');
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error.kind).toBe('not-found');
	});

	it('replaces a site section', async () => {
		const { reader, commands, queries } = await make();
		await commands.saveSection('quote', { text: 'Ship it.', author: 'Someone' });
		expect(await queries.section('quote')).toEqual({
			ok: true,
			value: { text: 'Ship it.', author: 'Someone' }
		});
		const portfolio = await reader();
		expect(portfolio.ok && portfolio.value.site.quote.author).toBe('Someone');
	});
}
