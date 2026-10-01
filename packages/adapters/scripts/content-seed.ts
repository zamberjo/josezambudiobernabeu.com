/**
 * content/portfolio.json → supabase/seeds/10_content.sql
 *
 * Run `pnpm content:seed`, then `supabase db reset` to load it locally, or
 * pipe the file into `psql` against a fresh remote project.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { describeValidation, parsePortfolio } from '@jzb/domain';
import { seedSql } from '../src/supabase/seed-sql.ts';

const root = new URL('../../../', import.meta.url);
const source = new URL('content/portfolio.json', root);
const target = new URL('supabase/seeds/10_content.sql', root);

const portfolio = parsePortfolio(JSON.parse(await readFile(source, 'utf8')));
if (!portfolio.ok) {
	console.error(`content/portfolio.json is invalid:\n${describeValidation(portfolio.error)}`);
	process.exit(1);
}

await writeFile(target, seedSql(portfolio.value));
console.log(`Wrote ${target.pathname}`);
