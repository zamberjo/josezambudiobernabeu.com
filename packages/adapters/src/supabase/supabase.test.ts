import { beforeAll, describe, expect, it } from 'vitest';
import { COLLECTIONS, SITE_SECTIONS } from '@jzb/domain';
import { contentStoreContract, seedPortfolio, type Store } from '../contract.ts';
import { createContentClient, type ContentClient } from './client.ts';
import { supabasePortfolioReader } from './reader.ts';
import { supabaseContentStore } from './store.ts';

/*
 * Integration tests against a running stack: `pnpm test:db` (after
 * `supabase start`). Skipped when the environment does not point at one, so
 * `pnpm test:unit` stays self-contained. They rewrite the local content, so
 * run `supabase db reset` afterwards if you want the seed back exactly.
 */

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
const ADMIN = { email: 'admin@josezambudiobernabeu.local', password: 'admin-local' };

describe.skipIf(!url || !key)('supabase adapters', () => {
	let admin: ContentClient;

	beforeAll(async () => {
		admin = createContentClient(url!, key!);
		const { error } = await admin.auth.signInWithPassword(ADMIN);
		if (error) throw new Error(`Local admin sign-in failed: ${error.message}`);
	});

	/** Empties every table and re-saves the snapshot through the adapter itself. */
	const reseed = async (): Promise<Store> => {
		const store = supabaseContentStore(admin);
		for (const collection of COLLECTIONS) {
			const { error } = await admin
				.from(collection as 'skills')
				.delete()
				.not('id', 'is', null);
			if (error) throw new Error(error.message);
		}
		const portfolio = seedPortfolio();
		for (const section of SITE_SECTIONS)
			await store.commands.saveSection(section, portfolio.site[section] as never);
		for (const collection of COLLECTIONS)
			for (const data of portfolio[collection])
				await store.commands.save(collection, { data: data as never });
		return { reader: supabasePortfolioReader(admin), ...store };
	};

	describe('store contract', () => {
		contentStoreContract(reseed);
	});

	it('the anonymous reader sees the published aggregate through the api views', async () => {
		await reseed();
		const anon = createContentClient(url!, key!);
		expect(await supabasePortfolioReader(anon)()).toEqual({ ok: true, value: seedPortfolio() });
	});

	it('an anonymous client cannot write', async () => {
		const anon = createContentClient(url!, key!);
		const { commands } = supabaseContentStore(anon);
		const result = await commands.saveSection('quote', { text: 'pwned', author: 'anon' });
		expect(result.ok).toBe(false);
	});

	it('the database enforces the published-post rule on its own', async () => {
		const { error } = await admin.from('posts').insert({
			slug: 'incomplete',
			status: 'published',
			title: { es: 'a', en: 'a' },
			excerpt: { es: 'a', en: 'a' }
		});
		expect(error?.code).toBe('23514');
	});

	it('the database rejects a translation missing a language', async () => {
		const { error } = await admin
			.from('skills')
			.insert({ name: 'Half', level: 1, detail: { es: 'solo' } });
		expect(error?.code).toBe('23514');
	});

	it('the database rejects a body that is not HTML per language', async () => {
		const { error } = await admin.from('posts').insert({
			slug: 'bad-body',
			title: { es: 'a', en: 'a' },
			excerpt: { es: 'a', en: 'a' },
			body: [{ type: 'paragraph', text: { es: 'a', en: 'a' } }]
		});
		expect(error?.code).toBe('23514');
	});

	it('the database refuses to publish a post whose body is empty in one language', async () => {
		const { error } = await admin.from('posts').insert({
			slug: 'half-written',
			status: 'published',
			published_on: '2026-09-30',
			title: { es: 'a', en: 'a' },
			excerpt: { es: 'a', en: 'a' },
			body: { es: '<p>Hola</p>', en: '<p></p>' }
		});
		expect(error?.code).toBe('23514');
	});

	it('stores and reads back an HTML post', async () => {
		const store = supabaseContentStore(admin);
		const post = {
			slug: 'html-post',
			status: 'published' as const,
			date: '2026-09-30',
			cover: null,
			tags: ['Svelte'],
			title: { es: 'Hola', en: 'Hello' },
			excerpt: { es: 'e', en: 'e' },
			body: { es: '<h2>Uno</h2><p>Texto</p>', en: '<h2>One</h2><p>Text</p>' }
		};
		const saved = await store.commands.save('posts', { data: post });
		expect(saved.ok && saved.value.data).toEqual(post);
		if (saved.ok) await store.commands.remove('posts', saved.value.id);
	});
});
