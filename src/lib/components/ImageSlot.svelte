<script lang="ts">
	interface Props {
		/** Omit to render the empty state the design ships with. */
		src?: string;
		alt?: string;
		/** Shown in the empty state, so the slot says what belongs there. */
		placeholder: string;
	}

	let { src, alt = '', placeholder }: Props = $props();
</script>

{#if src}
	<img {src} {alt} class="h-full w-full object-cover" loading="lazy" decoding="async" />
{:else}
	<div
		class="flex h-full w-full items-center justify-center bg-neutral-200 p-4 text-center text-[11px] font-bold tracking-[0.14em] text-neutral-600 uppercase"
	>
		{placeholder}
	</div>
{/if}
