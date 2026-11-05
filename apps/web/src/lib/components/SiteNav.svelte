<script lang="ts">
	import { page } from '$app/state';
	import { LOCALES, localePath, unlocalizedPath } from '@jzb/domain';
	import { lang, rememberLang, t } from '../i18n.svelte';
	import { magnetic } from '../motion.svelte';
	import type { NavLink } from '@jzb/domain';

	// Only links to bands that render: the read model already dropped the Blog
	// entry when there are no posts, so the nav never points at a missing band.
	interface Props {
		links: NavLink[];
		/** `/` on pages other than home, so `#section` links lead back to it. */
		base?: string;
	}

	let { links, base = '' }: Props = $props();

	// The toggle links to this same page in the other language. A link rather
	// than a button: each language is its own prerendered URL.
	const here = $derived(unlocalizedPath(page.url.pathname));
</script>

<!-- Purely decorative: the accent rule that fills as the page scrolls. -->
<div
	aria-hidden="true"
	class="scroll-progress fixed inset-x-0 top-0 z-60 h-1 bg-accent"
></div>

<nav
	class="sticky top-0 z-50 flex items-center justify-between gap-6 border-b-2 border-ink bg-bg px-gutter py-4"
>
	<a href="{base}#top" class="text-[22px] font-black tracking-[-0.02em] text-ink">Zambu</a>

	<div class="flex min-w-0 flex-1 items-center justify-end gap-[clamp(10px,1.6vw,24px)]">
		<div
			class="flex min-w-0 flex-nowrap items-center gap-[clamp(12px,1.6vw,24px)] overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
		>
			{#each links as link (link.href)}
				<a
					use:magnetic={8}
					href="{base}{link.href}"
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
			{#each LOCALES as code (code)}
				<a
					href={localePath(code, here)}
					hreflang={code}
					aria-current={lang.current === code ? 'page' : undefined}
					data-sveltekit-noscroll
					onclick={() => rememberLang(code)}
					class="px-2.5 py-[5px] text-xs font-bold tracking-[0.06em] {lang.current === code
						? 'bg-ink text-bg hover:text-bg'
						: 'bg-transparent text-ink hover:text-accent'}"
				>
					{code.toUpperCase()}
				</a>
			{/each}
		</div>
	</div>
</nav>
