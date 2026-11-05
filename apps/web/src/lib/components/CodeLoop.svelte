<script lang="ts">
	import { parallax } from '../motion.svelte';
</script>

<!-- The dark band between the hero and the first section: the loop the whole
     site is about, set as code and drifting slightly against the scroll. -->
<section
	aria-label="while me.awake(): me.code()"
	class="overflow-clip bg-neutral-900 px-gutter py-[clamp(56px,10vw,140px)] text-neutral-100"
>
	<div
		use:parallax={0.22}
		aria-hidden="true"
		class="parallax-y overflow-x-auto font-mono text-[clamp(15px,3.4vw,46px)] leading-[1.5]"
	>
		<div class="text-neutral-400">me = <span class="text-accent-400">Person()</span></div>
		<div class="text-neutral-400">while(<span class="text-accent-400">me.awake()</span>):</div>
		<div class="pl-[2.4em] text-neutral-100">
			me.code()<span
				class="caret ml-[0.2em] inline-block h-[1em] w-[0.55em] -translate-y-[0.12em] bg-accent align-baseline"
			></span>
		</div>
	</div>
</section>
