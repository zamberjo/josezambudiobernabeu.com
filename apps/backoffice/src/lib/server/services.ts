import { githubPublishTrigger } from '@jzb/adapters/github';
import {
	supabaseContentStore,
	supabasePortfolioReader,
	type ContentClient
} from '@jzb/adapters/supabase';
import { moveEntry, publishSite, removeEntry, saveEntry, saveSection } from '@jzb/application';
import { env } from './env';

/**
 * The backoffice's composition root. Built per request around that request's
 * Supabase client, which carries the editor's session: the adapters never
 * hold credentials of their own, and RLS judges every write.
 */
export const services = (client: ContentClient) => {
	const { queries, commands } = supabaseContentStore(client);
	const reader = supabasePortfolioReader(client);
	const publish = githubPublishTrigger({
		token: env.githubToken,
		repository: env.githubRepository
	});

	return {
		queries,
		saveEntry: saveEntry(commands),
		removeEntry: removeEntry(commands),
		moveEntry: moveEntry(queries, commands),
		saveSection: saveSection(commands),
		/** Validates the whole aggregate first: nothing invalid is ever deployed. */
		publish: publishSite(reader, publish),
		reader
	};
};

export type Services = ReturnType<typeof services>;
