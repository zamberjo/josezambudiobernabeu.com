import { fail } from '@sveltejs/kit';

const BUCKET = 'media';

export const load = async ({ locals }) => {
	const storage = locals.supabase.storage.from(BUCKET);
	const { data, error } = await storage.list('', {
		sortBy: { column: 'created_at', order: 'desc' }
	});
	return {
		error: error?.message ?? null,
		files: (data ?? [])
			.filter((file) => file.id) // folders have no id
			.map((file) => ({ name: file.name, url: storage.getPublicUrl(file.name).data.publicUrl }))
	};
};

/** Keeps names URL-safe and unique without asking the editor to think about it. */
const storageName = (original: string) => {
	const dot = original.lastIndexOf('.');
	const stem = (dot > 0 ? original.slice(0, dot) : original)
		.normalize('NFKD')
		.replace(/[^\w-]+/g, '-')
		.toLowerCase();
	const ext = dot > 0 ? original.slice(dot).toLowerCase() : '';
	return `${Date.now()}-${stem}${ext}`;
};

export const actions = {
	upload: async ({ request, locals }) => {
		const file = (await request.formData()).get('file');
		if (!(file instanceof File) || file.size === 0)
			return fail(400, { message: 'Elige un fichero' });
		const { error } = await locals.supabase.storage
			.from(BUCKET)
			.upload(storageName(file.name), file, { contentType: file.type });
		if (error) return fail(409, { message: error.message });
		return { uploaded: true };
	},
	remove: async ({ request, locals }) => {
		const name = String((await request.formData()).get('name'));
		const { error } = await locals.supabase.storage.from(BUCKET).remove([name]);
		if (error) return fail(409, { message: error.message });
	}
};
