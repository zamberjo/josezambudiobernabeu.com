<script lang="ts">
	import { t } from '../i18n.svelte';
	import { magnetic, parallax } from '../motion.svelte';
	import { hero, social } from '../data/content';

	// The three names occupy the same grid cell and cross-fade in place, so the
	// heading never reflows as they rotate.
	let active = $state(0);

	$effect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const id = setInterval(() => {
			active = (active + 1) % hero.names.length;
		}, 2800);
		return () => clearInterval(id);
	});
</script>

<header
	id="top"
	class="relative grid min-h-[min(88vh,760px)] content-center gap-8 overflow-clip px-gutter pt-[clamp(48px,9vw,120px)] pb-[clamp(40px,6vw,80px)]"
>
	<div
		use:parallax={0.5}
		aria-hidden="true"
		class="parallax-y pointer-events-none absolute inset-0 flex items-center"
	>
		<span
			class="-ml-[4vw] text-[clamp(120px,26vw,420px)] leading-[0.8] font-black tracking-[-0.05em] whitespace-nowrap text-neutral-200"
		>
			ZAMBUDIO
		</span>
	</div>
	<div
		use:parallax={0.14}
		aria-hidden="true"
		class="parallax-y pointer-events-none absolute inset-0 bg-[length:25%_100%] bg-[linear-gradient(to_right,var(--color-neutral-300)_0_2px,transparent_2px_100%)]"
	></div>

	<div class="relative flex max-w-[1200px] flex-col gap-6">
		<p
			class="m-0 flex items-center gap-3 text-xs font-bold tracking-[0.22em] uppercase text-accent-700"
		>
			<span aria-hidden="true" class="inline-block h-0.5 w-11 bg-accent"></span>
			{t(hero.kicker)}
		</p>

		<h1
			class="m-0 grid text-[clamp(60px,14vw,210px)] leading-[0.9] font-black tracking-[-0.045em] text-accent"
			style="transform: scaleY(var(--squash, 1)); transform-origin: 0 100%;"
		>
			{#each hero.names as name, i (name)}
				<span
					aria-hidden={i !== active}
					class="col-start-1 row-start-1 transition-[opacity,transform] duration-[450ms] {i === active
						? 'opacity-100'
						: 'translate-y-[18px] opacity-0'}"
				>
					{name}
				</span>
			{/each}
		</h1>

		<p
			class="m-0 max-w-[760px] border-l-4 border-accent pl-4 text-[clamp(17px,2.1vw,24px)] leading-[1.4] font-medium text-pretty"
		>
			{t(hero.tagline)}
		</p>

		<div class="mt-2 flex flex-wrap gap-3">
			{#each social as link (link.label)}
				<a
					use:magnetic={14}
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					class="magnet inline-flex items-center gap-2.5 border-2 border-ink px-[18px] py-3 text-[13px] font-bold tracking-[0.1em] uppercase text-ink hover:bg-ink hover:text-bg"
				>
					{link.label}
				</a>
			{/each}
		</div>
	</div>
</header>
