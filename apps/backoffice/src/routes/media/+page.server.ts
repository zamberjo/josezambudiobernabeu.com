import { fail } from '@sveltejs/kit';
import { IMAGE_WIDTHS, isOptimized, variantName } from '@jzb/domain';
import { BUCKET, stemFor } from '$lib/server/media';

const WIDEST = Math.max(...IMAGE_WIDTHS);

/** `…-1920w.webp` → `…`: the name every variant of an upload shares. */
const stemOf = (name: string) => name.replace(/-\d+w\.webp$/, '');

export const load = async ({ locals }) => {
	const storage = locals.supabase.storage.from(BUCKET);
	const { data, error } = await storage.list('', {
		sortBy: { column: 'created_at', order: 'desc' }
	});
	const names = (data ?? []).filter((file) => file.id).map((file) => file.name); // folders have no id

	// One entry per image: the widest variant of an optimised upload (the URL
	// to paste), or the file itself for anything uploaded before optimising.
	const shown = names.filter((name) => !isOptimized(name) || name.endsWith(`-${WIDEST}w.webp`));

	return {
		error: error?.message ?? null,
		files: shown.map((name) => ({
			name,
			url: storage.getPublicUrl(name).data.publicUrl,
			optimized: isOptimized(name)
		}))
	};
};

export const actions = {
	upload: async ({ request, locals }) => {
		const file = (await request.formData()).get('file');
		if (!(file instanceof File) || file.size === 0)
			return fail(400, { message: 'Elige un fichero' });

		const result = await locals.services.uploadImage(
			stemFor(file.name),
			new Uint8Array(await file.arrayBuffer())
		);
		if (!result.ok)
			return fail(result.error.kind === 'invalid-image' ? 400 : 502, {
				message: result.error.message
			});
		return { uploaded: result.value.src, originalKb: Math.round(file.size / 1024) };
	},
	remove: async ({ request, locals }) => {
		const name = String((await request.formData()).get('name'));
		const names = isOptimized(name)
			? IMAGE_WIDTHS.map((width) => variantName(stemOf(name), width))
			: [name];
		const { error } = await locals.supabase.storage.from(BUCKET).remove(names);
		if (error) return fail(409, { message: error.message });
	}
};
