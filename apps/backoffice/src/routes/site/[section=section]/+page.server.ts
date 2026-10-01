import { error } from '@sveltejs/kit';
import type { SiteSection, ValidationIssue } from '@jzb/domain';
import { describeStoreError, failWith, readPayload } from '$lib/server/forms';

export const load = async ({ params, locals }) => {
	const section = params.section as SiteSection;
	const found = await locals.services.queries.section(section);
	if (!found.ok) error(502, describeStoreError(found.error));
	// A section that was never saved has no row yet; the page starts it empty.
	return { section, value: found.value };
};

export const actions = {
	save: async ({ params, request, locals }) => {
		const payload = await readPayload(request);
		const result = await locals.services.saveSection(params.section as SiteSection, payload);
		if (!result.ok) return failWith(result.error, payload);
		return { saved: true, issues: [] as ValidationIssue[] };
	}
};
