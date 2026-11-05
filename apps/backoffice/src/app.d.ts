import type { ContentClient } from '@jzb/adapters/supabase';
import type { User } from '@supabase/supabase-js';
import type { Services } from '$lib/server/services';

declare global {
	namespace App {
		interface Locals {
			supabase: ContentClient;
			user: User | null;
			services: Services;
		}
		interface PageData {
			user?: { email: string | undefined } | null;
		}
	}
}

export {};
