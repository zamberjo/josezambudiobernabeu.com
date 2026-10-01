import { error, redirect } from '@sveltejs/kit';
import type { CollectionName, ValidationIssue } from '@jzb/domain';
import { blankEntity } from '$lib/forms';
import { describeStoreError, failWith, readPayload } from '$lib/server/forms';

export const load = async ({ params, locals }) => {
	const collection = params.collection as CollectionName;
	if (params.id === 'new') return { collection, id: null, data: blankEntity[collection]() };

	const found = await locals.services.queries.get(collection, params.id);
	if (!found.ok)
		error(found.error.kind === 'not-found' ? 404 : 502, describeStoreError(found.error));
	return { collection, id: found.value.id, data: found.value.data };
};

export const actions = {
	save: async ({ params, request, locals }) => {
		const collection = params.collection as CollectionName;
		const payload = await readPayload(request);
		const id = params.id === 'new' ? undefined : params.id;

		const result = await locals.services.saveEntry(collection, { id, data: payload });
		if (!result.ok) return failWith(result.error, payload);

		// Back to the list on create; stay on the page (fresh data) on update.
		if (!id) redirect(303, `/${collection}/${result.value.id}?saved`);
		return { saved: true, issues: [] as ValidationIssue[] };
	}
};
