/**
 * Supabase → content/portfolio.json
 *
 * The versioned backup of the database and the fixture the Playwright suite
 * builds from. Reads the same `api` views as the production build, so it only
 * needs the publishable key: SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.
 */
import { writeFile } from 'node:fs/promises';
import { exportSnapshot, type SnapshotSink } from '@jzb/application';
import { describeValidation, ok } from '@jzb/domain';
import { createContentClient } from '../src/supabase/client.ts';
import { supabasePortfolioReader } from '../src/supabase/reader.ts';

const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
	console.error('Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.');
	process.exit(1);
}

const target = new URL('../../../content/portfolio.json', import.meta.url);

const toFile: SnapshotSink = async (portfolio) => {
	await writeFile(target, JSON.stringify(portfolio, null, '\t') + '\n');
	return ok(undefined);
};

const reader = supabasePortfolioReader(createContentClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY));
const result = await exportSnapshot(reader, toFile)();

if (!result.ok) {
	console.error(
		result.error.kind === 'validation'
			? `The database content is invalid:\n${describeValidation(result.error)}`
			: `Could not read the database: ${result.error.message}`
	);
	process.exit(1);
}
console.log(`Wrote ${target.pathname}`);
