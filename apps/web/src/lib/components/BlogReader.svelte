<script lang="ts">
	import { lang, t } from '../i18n.svelte';
	import { parallax } from '../motion.svelte';
	import type { PostView, Ui } from '@jzb/domain';
	import ImageSlot from './ImageSlot.svelte';
	import Tag from './Tag.svelte';

	// A native modal dialog, so Esc, focus trapping and inert-ing the page
	// behind come from the platform rather than from scroll-locking by hand.
	let dialog: HTMLDialogElement;
	let scroller: HTMLDivElement;
	let post = $state<PostView | null>(null);

	let { site, ui }: { site: string; ui: Ui } = $props();

	// Rendered and sanitised at build time, one document per language: the
	// toggle swaps which one is shown, and the side index comes with it.
	const article = $derived(post ? post.article[lang.current] : null);
	const index = $derived(article?.outline ?? []);

	export function open(next: PostView) {
		post = next;
		dialog.showModal();
		scroller.scrollTop = 0;
	}

	function close() {
		dialog.close();
	}
</script>

<dialog bind:this={dialog} class="reader" aria-label={post ? t(post.title) : ''}>
	<div bind:this={scroller} class="h-full overflow-y-auto overscroll-contain bg-bg text-ink">
		<div class="sticky top-0 z-3 bg-bg">
			<div aria-hidden="true" class="scroll-progress-nearest h-1 bg-accent"></div>
			<div
				class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b-2 border-ink px-gutter py-3"
			>
				<button
					type="button"
					onclick={close}
					class="cursor-pointer appearance-none border-2 border-ink bg-transparent px-3.5 py-2.5 text-left text-xs font-bold tracking-[0.12em] uppercase text-ink transition-colors hover:bg-ink hover:text-bg"
				>
					← {t(ui.backToBlog)}
				</button>
				<span class="text-[15px] font-black tracking-[-0.01em]">Zambu · Blog</span>
			</div>
		</div>

		{#if post}
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
					{#if post.readingTime}
						<span aria-hidden="true">— · —</span>
						<span>
							{post.readingTime}
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
							{@html article?.html ?? ''}
						</div>

						<div class="mt-4 flex flex-wrap gap-3 border-t-2 border-ink pt-6">
							{#each post.tags as tag (tag)}
								<Tag>{tag}</Tag>
							{/each}
						</div>

						<button
							type="button"
							onclick={close}
							class="cursor-pointer appearance-none self-start border-2 border-ink bg-transparent px-[18px] py-3 text-left text-[13px] font-bold tracking-[0.1em] uppercase text-ink transition-colors hover:bg-ink hover:text-bg"
						>
							← {t(ui.backToBlog)}
						</button>
					</div>
				</div>

				<p class="mt-band mb-0 text-xs tracking-[0.14em] uppercase text-neutral-600">
					{site}
				</p>
			</article>
		{/if}
	</div>
</dialog>

<style>
	/* The reader takes the whole viewport rather than sitting in a centred box. */
	.reader {
		width: 100%;
		max-width: none;
		height: 100%;
		max-height: none;
		margin: 0;
		padding: 0;
		border: 0;
		background: transparent;
	}

	.reader::backdrop {
		background: var(--color-bg);
	}
</style>
