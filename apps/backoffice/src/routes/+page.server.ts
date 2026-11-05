import { fail } from '@sveltejs/kit';
import { COLLECTIONS, describeValidation } from '@jzb/domain';
import { env } from '$lib/server/env';

export const load = async ({ locals }) => {
	const { queries, reader } = locals.services;
	const [lists, portfolio] = await Promise.all([
		Promise.all(
			COLLECTIONS.map(async (collection) => [collection, await queries.list(collection)] as const)
		),
		reader()
	]);

	return {
		previewUrl: env.previewUrl,
		counts: lists.map(([collection, result]) => ({
			collection,
			count: result.ok ? result.value.length : null
		})),
		// What the next build would see: if this is not ok, publishing is refused.
		health: portfolio.ok
			? { ok: true as const }
			: {
					ok: false as const,
					message:
						portfolio.error.kind === 'validation'
							? describeValidation(portfolio.error)
							: portfolio.error.message
				}
	};
};

export const actions = {
	publish: async ({ locals }) => {
		const result = await locals.services.publish();
		if (!result.ok)
			return fail(result.error.kind === 'validation' ? 400 : 502, {
				published: false,
				message:
					result.error.kind === 'validation'
						? `El contenido no es válido:\n${describeValidation(result.error)}`
						: result.error.message
			});
		return {
			published: true,
			message: 'Deploy lanzado. La web se actualizará en un par de minutos.'
		};
	}
};
