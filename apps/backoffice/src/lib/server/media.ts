/** The Storage bucket every upload goes to (public; see the content migration). */
export const BUCKET = 'media';

/** A URL-safe, unique stem for an upload, so the editor never has to name files. */
export const stemFor = (original: string): string => {
	const dot = original.lastIndexOf('.');
	const base = (dot > 0 ? original.slice(0, dot) : original)
		.normalize('NFKD')
		.replace(/[^\w-]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase();
	return `${Date.now()}-${base || 'image'}`;
};
