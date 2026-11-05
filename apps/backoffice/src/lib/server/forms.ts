import { fail } from '@sveltejs/kit';
import type { StoreError } from '@jzb/application';
import type { ValidationIssue } from '@jzb/domain';

/** Reads the form's single JSON field. A malformed body is a client bug, so it throws. */
export async function readPayload(request: Request): Promise<unknown> {
	const raw = (await request.formData()).get('payload');
	if (typeof raw !== 'string') throw new Error('The form posted no payload');
	return JSON.parse(raw);
}

/** Maps a store error onto what a form can show: field issues when there are any. */
export function failWith(error: StoreError, payload?: unknown) {
	const issues: ValidationIssue[] =
		error.kind === 'validation'
			? error.issues
			: [{ path: '(root)', message: describeStoreError(error) }];
	return fail(error.kind === 'validation' ? 400 : error.kind === 'not-found' ? 404 : 409, {
		issues,
		payload
	});
}

export function describeStoreError(error: StoreError): string {
	switch (error.kind) {
		case 'validation':
			return error.issues.map((issue) => `${issue.path}: ${issue.message}`).join('; ');
		case 'not-found':
			return `No existe (${error.id})`;
		case 'conflict':
			return `La base de datos lo rechazó: ${error.message}`;
		case 'unavailable':
			return `No se pudo contactar con Supabase: ${error.message}`;
	}
}
