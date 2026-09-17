<script lang="ts">
	import { t } from '../i18n.svelte';
	import { magnetic } from '../motion.svelte';
	import { skills } from '../data/skills';
	import SectionHeading from './SectionHeading.svelte';

	interface Props {
		/** Two-digit band number; +page.svelte owns the sequence. */
		number: string;
	}

	let { number }: Props = $props();
</script>

<section id="skills" class="overflow-clip border-b-2 border-ink px-gutter py-band">
	<SectionHeading {number} title="Skills" />

	<ul
		class="grid list-none grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] border-t-2 border-divider p-0"
	>
		{#each skills as skill (skill.name)}
			<li
				use:magnetic={12}
				class="magnet-skew border-b-2 border-divider py-[clamp(20px,3vw,32px)] pr-4"
			>
				<!-- Longer names step down a size so each one stays on one line in its
				     column instead of breaking mid-word. -->
				<div
					class="font-black tracking-[-0.02em] [overflow-wrap:anywhere] {skill.name.length > 8
						? 'text-[clamp(20px,2.2vw,30px)]'
						: 'text-[clamp(24px,3vw,38px)]'}"
				>
					{skill.name}
				</div>
				<div
					aria-hidden="true"
					class="bar-grow mt-3 h-1.5 {skill.accent ? 'bg-accent' : 'bg-ink'}"
					style="--bar-end: {skill.level}%"
				></div>
				<div class="mt-2 text-xs tracking-[0.14em] uppercase text-neutral-700">
					{t(skill.detail)}
				</div>
			</li>
		{/each}
	</ul>
</section>
