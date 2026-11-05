import { SITE_SECTIONS, type SiteSection } from '@jzb/domain';
import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is SiteSection =>
	(SITE_SECTIONS as readonly string[]).includes(param)) satisfies ParamMatcher;
