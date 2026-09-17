<script lang="ts">
	import { lang, t } from '../i18n.svelte';
	import { magnetic } from '../motion.svelte';
	import { nav } from '../data/content';
</script>

<!-- Purely decorative: the accent rule that fills as the page scrolls. -->
<div
	aria-hidden="true"
	class="scroll-progress fixed inset-x-0 top-0 z-60 h-1 bg-accent"
></div>

<nav
	class="sticky top-0 z-50 flex items-center justify-between gap-6 border-b-2 border-ink bg-bg px-gutter py-4"
>
	<a href="#top" class="text-[22px] font-black tracking-[-0.02em] text-ink">Zambu</a>

	<div class="flex min-w-0 flex-1 items-center justify-end gap-[clamp(10px,1.6vw,24px)]">
		<div
			class="flex min-w-0 flex-nowrap items-center gap-[clamp(12px,1.6vw,24px)] overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
		>
			{#each nav as link (link.href)}
				<a
					use:magnetic={8}
					href={link.href}
					class="magnet flex-none text-[13px] font-semibold tracking-[0.08em] uppercase {link.href ===
					'#blog'
						? 'text-accent-700'
						: 'text-ink hover:text-accent'}"
				>
					{t(link.label)}
				</a>
			{/each}
		</div>

		<div class="flex flex-none border-2 border-ink" role="group" aria-label="Idioma / Language">
			{#each ['es', 'en'] as const as code (code)}
				<button
					type="button"
					aria-pressed={lang.current === code}
					onclick={() => lang.set(code)}
					class="cursor-pointer appearance-none border-0 px-2.5 py-[5px] text-xs font-bold tracking-[0.06em] {lang.current ===
					code
						? 'bg-ink text-bg'
						: 'bg-transparent text-ink'}"
				>
					{code.toUpperCase()}
				</button>
			{/each}
		</div>
	</div>
</nav>
