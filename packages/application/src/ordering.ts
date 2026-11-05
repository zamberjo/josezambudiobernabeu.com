export type Direction = 'up' | 'down';

/**
 * Swaps `id` with its neighbour. Returns the same array (by reference) when
 * nothing moves, so callers can skip the write.
 */
export const move = (
	ids: readonly string[],
	id: string,
	direction: Direction
): readonly string[] => {
	const from = ids.indexOf(id);
	const to = direction === 'up' ? from - 1 : from + 1;
	if (from === -1 || to < 0 || to >= ids.length) return ids;
	const next = [...ids];
	[next[from], next[to]] = [next[to]!, next[from]!];
	return next;
};
