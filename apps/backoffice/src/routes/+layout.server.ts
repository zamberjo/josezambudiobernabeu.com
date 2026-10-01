export const load = async ({ locals }) => {
	if (!locals.user) return { user: null, isAdmin: false };
	// Only a UI hint: row level security is what actually refuses a non-admin write.
	const { data: isAdmin } = await locals.supabase.rpc('is_admin');
	return { user: { email: locals.user.email }, isAdmin: isAdmin === true };
};
