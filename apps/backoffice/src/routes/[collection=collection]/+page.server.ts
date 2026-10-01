import { error, fail } from '@sveltejs/kit';
import { naturalKey, type CollectionName } from '@jzb/domain';
import { describeStoreError } from '$lib/server/forms';

export const load = async ({ params, locals }) => {
	const collection = params.collection as CollectionName;
	const listed = await locals.services.queries.list(collection);
	if (!listed.ok) error(502, describeStoreError(listed.error));

	return {
		collection,
		entries: listed.value.map((entry) => ({
			id: entry.id,
			label: (naturalKey[collection] as (data: unknown) => string)(entry.data)
		}))
	};
};

export const actions = {
	move: async ({ params, request, locals }) => {
		const form = await request.formData();
		const direction = form.get('direction') === 'up' ? 'up' : 'down';
		const result = await locals.services.moveEntry(
			params.collection as CollectionName,
			String(form.get('id')),
			direction
		);
		if (!result.ok) return fail(409, { message: describeStoreError(result.error) });
	},
	remove: async ({ params, request, locals }) => {
		const form = await request.formData();
		const result = await locals.services.removeEntry(
			params.collection as CollectionName,
			String(form.get('id'))
		);
		if (!result.ok) return fail(409, { message: describeStoreError(result.error) });
	}
};
