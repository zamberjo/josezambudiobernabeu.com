/** Tags the visual editor rewrites into an equivalent, so they are not a loss. */
const ALIASES: Record<string, string> = { b: 'strong', i: 'em', del: 'strike', strike: 's' };

const tagsOf = (html: string): Set<string> => {
	const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
	return new Set(
		[...doc.body.querySelectorAll('*')].map((node) => {
			const tag = node.tagName.toLowerCase();
			return ALIASES[tag] ?? tag;
		})
	);
};

/**
 * Tags present in `source` that the visual editor's output no longer has:
 * what switching to (or opening in) visual mode would throw away. Browser-only.
 */
export const lostTags = (source: string, editorOutput: string): string[] => {
	if (!source.trim()) return [];
	const kept = tagsOf(editorOutput);
	return [...tagsOf(source)].filter((tag) => !kept.has(tag));
};
