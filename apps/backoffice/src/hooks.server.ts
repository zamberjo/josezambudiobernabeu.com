import { redirect, type Handle } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import type { ContentClient, Database } from '@jzb/adapters/supabase';
import { env } from '$lib/server/env';
import { services } from '$lib/server/services';

const PUBLIC_PATHS = ['/login'];

export const handle: Handle = async ({ event, resolve }) => {
	// A cookie-backed client per request, so the editor's session travels with
	// every query and row level security sees who is writing.
	const supabase = createServerClient<Database>(env.supabaseUrl, env.supabaseKey, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookies) =>
				cookies.forEach(({ name, value, options }) =>
					event.cookies.set(name, value, { ...options, path: '/' })
				)
		}
	}) as unknown as ContentClient;

	// getUser() asks the auth server, unlike getSession(), so a forged cookie
	// cannot pass.
	const {
		data: { user }
	} = await supabase.auth.getUser();

	event.locals.supabase = supabase;
	event.locals.user = user;
	event.locals.services = services(supabase);

	if (!user && !PUBLIC_PATHS.includes(event.url.pathname)) redirect(303, '/login');

	return resolve(event, {
		filterSerializedResponseHeaders: (name) =>
			name === 'content-range' || name === 'x-supabase-api-version'
	});
};
