<script lang="ts">
	import { t } from '../i18n.svelte';
	import { magnetic } from '../motion.svelte';
	import { experience } from '../data/content';
	import SectionHeading from './SectionHeading.svelte';
</script>

<section id="experiencia" class="overflow-clip border-b-2 border-ink px-gutter py-band">
	<SectionHeading number="03" title={t({ es: 'Experiencia', en: 'Experience' })} />

	<div class="relative grid">
		<!-- The spine draws itself downward as the list scrolls into view. -->
		<div
			aria-hidden="true"
			class="rule-grow absolute top-0 bottom-0 left-[7px] w-0.5 bg-accent"
		></div>

		{#each experience as role, i (role.role)}
			<div
				class="reveal-up grid grid-cols-[clamp(24px,6vw,40px)_1fr] gap-[clamp(12px,3vw,40px)] py-[clamp(20px,3vw,36px)] {i <
				experience.length - 1
					? 'border-b-2 border-divider'
					: ''}"
			>
				<div class="mt-2.5 h-4 w-4 {i === 0 ? 'bg-accent' : 'bg-ink'}"></div>
				<div
					use:magnetic={10}
					class="magnet grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-4"
				>
					<div>
						<div class="text-xs font-bold tracking-[0.16em] uppercase text-neutral-700">
							{t(role.period)}
						</div>
						<h3
							class="mt-1.5 mb-0 text-[clamp(22px,2.6vw,34px)] leading-[1.05] font-black tracking-[-0.02em]"
						>
							{role.role}
						</h3>
					</div>
					<p class="m-0 text-base leading-[1.6] text-neutral-800 text-pretty">
						{t(role.summary)}
					</p>
				</div>
			</div>
		{/each}
	</div>
</section>
