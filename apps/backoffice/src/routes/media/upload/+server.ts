import { error, json } from '@sveltejs/kit';
import { stemFor } from '$lib/server/media';

/**
 * The image field's upload: same optimisation as the Media page, answered as
 * JSON so the form can fill in the URL without leaving the post being edited.
 * Signed-in editors only, like every non-login route (hooks.server.ts).
 */
export const POST = async ({ request, locals }) => {
	const file = (await request.formData()).get('file');
	if (!(file instanceof File) || file.size === 0) error(400, 'No file');

	const result = await locals.services.uploadImage(
		stemFor(file.name),
		new Uint8Array(await file.arrayBuffer())
	);
	if (!result.ok) error(result.error.kind === 'invalid-image' ? 400 : 502, result.error.message);
	return json(result.value);
};
