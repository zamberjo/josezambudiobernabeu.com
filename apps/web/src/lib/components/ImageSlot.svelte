<script lang="ts">
	import { srcsetFor } from '@jzb/domain';

	interface Props {
		/** Omit to render the empty state the design ships with. */
		src?: string;
		alt?: string;
		/** Shown in the empty state, so the slot says what belongs there. */
		placeholder: string;
		/**
		 * The rendered width, for picking a srcset candidate. Defaults to the full
		 * viewport, which is right for covers and never too small.
		 */
		sizes?: string;
		/**
		 * The image is (or may be) the page's Largest Contentful Paint: fetch it
		 * straight away and ahead of other images instead of lazily.
		 */
		priority?: boolean;
	}

	let { src, alt = '', placeholder, sizes = '100vw', priority = false }: Props = $props();

	// Optimised uploads (…-1920w.webp) come with smaller siblings; anything
	// else renders as a single image.
	const srcset = $derived(src ? srcsetFor(src) : undefined);
</script>

{#if src}
	<img
		{src}
		{srcset}
		sizes={srcset ? sizes : undefined}
		{alt}
		class="h-full w-full object-cover"
		loading={priority ? 'eager' : 'lazy'}
		fetchpriority={priority ? 'high' : undefined}
		decoding={priority ? 'sync' : 'async'}
	/>
{:else}
	<div
		class="flex h-full w-full items-center justify-center bg-neutral-200 p-4 text-center text-[11px] font-bold tracking-[0.14em] text-neutral-700 uppercase"
	>
		{placeholder}
	</div>
{/if}
