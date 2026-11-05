import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types.ts';

export type ContentClient = SupabaseClient<Database>;

/**
 * A client for scripts and the build: no session persistence, no token
 * refresh timers keeping the process alive. The backoffice builds its own,
 * cookie-aware client per request instead.
 */
export const createContentClient = (url: string, key: string): ContentClient =>
	createClient<Database>(url, key, {
		auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
	});
