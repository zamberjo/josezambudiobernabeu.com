import { describe, expect, it } from 'vitest';
import { seedPortfolio } from '../contract.ts';
import { jsonPortfolioReader } from './index.ts';

describe('json reader', () => {
	it('parses a valid snapshot', async () => {
		const read = jsonPortfolioReader(async () => seedPortfolio());
		expect((await read()).ok).toBe(true);
	});

	it('returns validation issues instead of throwing', async () => {
		const read = jsonPortfolioReader(async () => ({ site: {} }));
		const result = await read();
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error.kind).toBe('validation');
	});
});
