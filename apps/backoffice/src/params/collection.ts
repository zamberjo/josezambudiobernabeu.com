import { COLLECTIONS, type CollectionName } from '@jzb/domain';
import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is CollectionName =>
	(COLLECTIONS as readonly string[]).includes(param)) satisfies ParamMatcher;
