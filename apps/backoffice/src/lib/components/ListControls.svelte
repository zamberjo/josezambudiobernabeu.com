<script lang="ts">
	interface Props {
		index: number;
		length: number;
		onmove: (from: number, to: number) => void;
		onremove: (index: number) => void;
	}

	let { index, length, onmove, onremove }: Props = $props();
</script>

<div class="row-controls">
	<button type="button" disabled={index === 0} onclick={() => onmove(index, index - 1)}>↑</button>
	<button type="button" disabled={index === length - 1} onclick={() => onmove(index, index + 1)}
		>↓</button
	>
	<button type="button" class="danger" onclick={() => onremove(index)}>Quitar</button>
</div>
