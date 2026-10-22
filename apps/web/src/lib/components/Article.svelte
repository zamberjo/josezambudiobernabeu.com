<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PostView, Ui } from '@jzb/domain';
	import { lang, t } from '../i18n.svelte';
	import { parallax } from '../motion.svelte';
	import ImageSlot from './ImageSlot.svelte';
	import Tag from './Tag.svelte';

	interface Props {
		post: PostView;
		ui: Ui;
		/** Printed at the foot of the article. */
		site: string;
		/** The way back: a button in the reader dialog, a link on the post's own page. */
		back: Snippet;
		/** On the post's own page the cover is the LCP element; in the dialog it is not. */
		priority?: boolean;
	}

	let { post, ui, site, back, priority = false }: Props = $props();

	// Rendered and sanitised at build time, one document per language: the
	// toggle swaps which one is shown, and the side index comes with it.
	const article = $derived(post.article[lang.current]);
	const index = $derived(article.outline);
</script>

<!-- Shared by the reader dialog on the home page and the post's own page at
     /blog/<slug>, so both show exactly the same article. -->
	<article class="px-gutter pt-[clamp(32px,6vw,88px)] pb-band">
		<div class="mb-6 flex flex-wrap gap-2">
			{#each post.tags as tag, i (tag)}
				<Tag variant={i === 0 ? 'solid' : 'outline'}>{tag}</Tag>
			{/each}
		</div>

		<h1
			class="m-0 max-w-[24ch] text-[clamp(34px,6.4vw,96px)] leading-[0.98] font-black tracking-[-0.04em] text-pretty"
		>
			{t(post.title)}
		</h1>

		<div
			class="my-[clamp(24px,3vw,40px)] flex flex-wrap gap-6 border-t-2 border-b-2 border-t-ink border-b-divider py-4 text-xs font-bold tracking-[0.14em] uppercase text-neutral-700"
		>
			<span>Jose Zambudio Bernabeu</span>
			{#if article.minutes}
				<span aria-hidden="true">— · —</span>
				<span>
					{article.minutes}
					{t(ui.minRead)}
				</span>
			{/if}
		</div>

		<div
			use:parallax={0.08}
			class="grayscale-print h-[clamp(220px,40vw,560px)] overflow-hidden border-2 border-ink"
		>
			<div class="parallax-y h-full scale-[1.06]">
				<ImageSlot
					src={post.cover ?? undefined}
					alt={t(post.title)}
					placeholder={t(ui.coverImage)}
					{priority}
				/>
			</div>
		</div>

		<div
			class="mt-[clamp(32px,5vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] items-start gap-[clamp(24px,4vw,64px)]"
		>
			{#if index.length}
				<nav
					aria-label={t(ui.inThisPost)}
					class="sticky top-[clamp(90px,14vh,130px)] flex max-w-[240px] flex-col gap-3 text-xs tracking-[0.14em] uppercase text-neutral-700"
				>
					<span class="font-bold text-accent-700">
						{t(ui.inThisPost)}
					</span>
					{#each index as entry (entry.id)}
						<a href="#{entry.id}" class="text-neutral-700 hover:text-accent">
							{entry.number} — {entry.text}
						</a>
					{/each}
				</nav>
			{/if}

			<div
				class="flex max-w-[68ch] flex-col gap-6 text-[clamp(16px,1.5vw,19px)] leading-[1.65] text-neutral-900"
			>
				<!-- Safe to inject: sanitising is the build-time ArticleRenderer's job
				     (packages/adapters/src/html), and this string never came from a
				     visitor. The typography lives in app.css under .article. -->
				<div class="article">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html article.html}
				</div>

				<div class="mt-4 flex flex-wrap gap-3 border-t-2 border-ink pt-6">
					{#each post.tags as tag (tag)}
						<Tag>{tag}</Tag>
					{/each}
				</div>

				{@render back()}
			</div>
		</div>

		<p class="mt-band mb-0 text-xs tracking-[0.14em] uppercase text-neutral-700">
			{site}
		</p>
	</article>
