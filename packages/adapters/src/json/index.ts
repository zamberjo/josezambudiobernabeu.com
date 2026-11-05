import type { PortfolioReader } from '@jzb/application';
import { parsePortfolio } from '@jzb/domain';

/**
 * Reads a snapshot shaped like content/portfolio.json. `load` is injected so
 * the adapter never decides how the file is found: the web imports it through
 * Vite, a script reads it from disk, a test passes an object.
 */
export const jsonPortfolioReader =
	(load: () => Promise<unknown>): PortfolioReader =>
	async () =>
		parsePortfolio(await load());
