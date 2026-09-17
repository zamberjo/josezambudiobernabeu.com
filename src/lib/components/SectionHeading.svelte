<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Two-digit section number, printed in accent to the left of the title. */
		number: string;
		title: string;
		/** Optional standfirst pushed to the far end of the rule. */
		aside?: Snippet;
	}

	let { number, title, aside }: Props = $props();
</script>

<div
	class="mb-[clamp(28px,4vw,56px)] flex flex-wrap items-baseline gap-x-4 gap-y-3 border-b-2 border-ink pb-3"
>
	<span class="text-sm font-black text-accent">{number}</span>
	<h2 class="m-0 text-[clamp(30px,5vw,64px)] leading-none font-black tracking-[-0.03em]">
		{title}
	</h2>
	{#if aside}
		<p class="m-0 ml-auto min-w-[200px] max-w-[320px] flex-1 text-sm leading-normal text-neutral-700">
			{@render aside()}
		</p>
	{/if}
</div>
