/** Immutable list edits shared by every repeatable field. */
export const moved = <T>(items: readonly T[], from: number, to: number): T[] => {
	const next = [...items];
	const [item] = next.splice(from, 1);
	if (item !== undefined) next.splice(to, 0, item);
	return next;
};

export const without = <T>(items: readonly T[], index: number): T[] =>
	items.filter((_, i) => i !== index);
