<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** `solid` is the accent-filled lead tag; `outline` the boxed ones beside it. */
		variant?: 'solid' | 'outline';
		children: Snippet;
	}

	let { variant = 'outline', children }: Props = $props();
</script>

<span
	class="inline-block px-2.5 text-[11px] font-bold tracking-[0.14em] uppercase {variant === 'solid'
		? 'bg-accent py-1 text-white'
		: 'border-2 border-ink py-0.5 text-ink'}"
>
	{@render children()}
</span>
