import type { StoreError } from '@jzb/application';

type PostgrestLikeError = { code?: string; message: string; details?: string | null };

/** Translates PostgREST/Postgres failures into the port's error vocabulary. */
export const toStoreError = (error: PostgrestLikeError, id = ''): StoreError => {
	switch (error.code) {
		case 'PGRST116': // .single() matched no rows
			return { kind: 'not-found', id };
		case '23505': // unique_violation
		case '23514': // check_violation: the database's copy of a domain rule
		case '23502': // not_null_violation
		case '42501': // insufficient_privilege: RLS said no
			return { kind: 'conflict', message: error.details ?? error.message };
		default:
			return { kind: 'unavailable', message: error.message };
	}
};
