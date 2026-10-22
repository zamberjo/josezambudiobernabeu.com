import type { MediaStore } from '@jzb/application';
import { err, ok } from '@jzb/domain';
import type { ContentClient } from './client.ts';

/**
 * Supabase Storage as a MediaStore. Variant names are unique per upload, so
 * they are cached as immutable; the bucket is public, so the URL is stable.
 */
export const supabaseMediaStore = (client: ContentClient, bucket = 'media'): MediaStore => ({
	put: async (path, data, contentType) => {
		const storage = client.storage.from(bucket);
		const { error } = await storage.upload(path, data, {
			contentType,
			cacheControl: '31536000',
			upsert: true
		});
		return error
			? err({ kind: 'unavailable', message: error.message })
			: ok(storage.getPublicUrl(path).data.publicUrl);
	}
});
