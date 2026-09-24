<script lang="ts">
	import { t } from '../i18n.svelte';
	import { magnetic, parallax } from '../motion.svelte';
	import { about } from '../data/content';
	import ImageSlot from './ImageSlot.svelte';
	import SectionHeading from './SectionHeading.svelte';

	interface Props {
		/** Two-digit band number; +page.svelte owns the sequence. */
		number: string;
	}

	let { number }: Props = $props();
</script>

<section id="sobre-mi" class="border-b-2 border-ink px-gutter py-band">
	<SectionHeading {number} title={t({ es: 'Sobre mí', en: 'About me' })} />

	<div
		class="grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] items-start gap-[clamp(24px,4vw,56px)]"
	>
		<div class="reveal-left">
			<!-- me.jpg is a 400×400 original, so the panel is capped at the height it
			     already clamps to. Past ~1240px the column keeps widening but the
			     panel stays square: no upscaling blur, and a square box over a square
			     source means object-cover crops nothing off the portrait. -->
			<div
				use:magnetic={18}
				use:parallax={0.12}
				class="magnet-parallax grayscale-print relative h-[clamp(320px,42vw,520px)] max-w-[520px] overflow-hidden border-2 border-ink"
			>
				<ImageSlot
					src="/assets/img/me.jpg"
					alt="Jose Zambudio Bernabeu"
					placeholder={t({ es: 'Arrastra aquí tu foto de perfil', en: 'Drop your portrait here' })}
				/>
			</div>
			<p class="mt-3 mb-0 text-xs tracking-[0.16em] uppercase text-neutral-700">
				Jose Zambudio Bernabeu
			</p>
		</div>

		<div class="reveal-right">
			<!-- The presentation reads as a terminal session: path bar, prompt, output. -->
			<div class="border-2 border-ink bg-neutral-900">
				<div
					class="border-b-2 border-neutral-700 px-3.5 py-2.5 font-mono text-xs break-words text-neutral-400"
				>
					{about.path}
				</div>
				<div
					class="flex flex-col gap-4 p-[clamp(16px,2.4vw,28px)] font-mono text-[clamp(13px,1.25vw,15px)] leading-[1.75] text-neutral-200"
				>
					<div class="text-neutral-500">{about.command}</div>
					{#each about.paragraphs as paragraph, i (i)}
						<p class="m-0">{t(paragraph)}</p>
					{/each}
					<p class="m-0 text-accent-400">{t(about.degree)}</p>
				</div>
			</div>
		</div>
	</div>
</section>
