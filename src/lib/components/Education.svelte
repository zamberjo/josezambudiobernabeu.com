<script lang="ts">
	import { t } from '../i18n.svelte';
	import { education } from '../data/content';
	import SectionHeading from './SectionHeading.svelte';
</script>

<section id="estudios" class="border-b-2 border-ink px-gutter py-band">
	<SectionHeading number="05" title={t({ es: 'Estudios', en: 'Education' })} />

	<div
		class="reveal-up grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-[clamp(20px,3vw,48px)]"
	>
		<h3 class="m-0 text-[clamp(24px,3.4vw,44px)] leading-[1.05] font-black tracking-[-0.03em]">
			{t(education.degree)}
		</h3>
		<div class="self-end">
			<div class="text-xs font-bold tracking-[0.16em] uppercase text-accent-700">
				{education.school}
			</div>
			<div aria-hidden="true" class="bar-grow mt-3 h-0.5 bg-ink" style="--bar-end: 60%"></div>
		</div>
	</div>
</section>
