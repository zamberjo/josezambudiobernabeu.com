<script lang="ts">
	import { parallax } from '../motion.svelte';
	import { quote } from '../data/content';
</script>

<section class="overflow-clip bg-accent px-gutter py-[clamp(64px,11vw,160px)] text-white">
	<figure use:parallax={0.2} class="parallax-y m-0">
		<blockquote
			class="m-0 max-w-[1100px] text-[clamp(32px,7vw,104px)] leading-[0.96] font-black tracking-[-0.04em]"
		>
			{quote.text}
		</blockquote>
		<figcaption class="mt-6 text-sm font-bold tracking-[0.2em] uppercase">
			{quote.author}
		</figcaption>
	</figure>
</section>
