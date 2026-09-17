<script lang="ts">
	import { t } from '../i18n.svelte';
	import { parallax } from '../motion.svelte';
	import { outline, type Post } from '../data/blog';
	import { footer } from '../data/content';
	import ImageSlot from './ImageSlot.svelte';
	import Tag from './Tag.svelte';

	// A native modal dialog, so Esc, focus trapping and inert-ing the page
	// behind come from the platform rather than from scroll-locking by hand.
	let dialog: HTMLDialogElement;
	let scroller: HTMLDivElement;
	let post = $state<Post | null>(null);

	const index = $derived(post ? outline(post) : []);

	export function open(next: Post) {
		post = next;
		dialog.showModal();
		scroller.scrollTop = 0;
	}

	function close() {
		dialog.close();
	}

	/** Headings carry the running number the side index also shows. */
	function headingNumber(upTo: number) {
		return String(
			post!.body.slice(0, upTo + 1).filter((block) => block.type === 'heading').length
		).padStart(2, '0');
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
					← {t({ es: 'Volver al blog', en: 'Back to blog' })}
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
							{t({ es: 'min de lectura', en: 'min read' })}
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
							placeholder={t({
								es: 'Imagen de portada del artículo',
								en: 'Cover image for the article'
							})}
						/>
					</div>
				</div>

				<div
					class="mt-[clamp(32px,5vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] items-start gap-[clamp(24px,4vw,64px)]"
				>
					{#if index.length}
						<nav
							aria-label={t({ es: 'En este artículo', en: 'In this post' })}
							class="sticky top-[clamp(90px,14vh,130px)] flex max-w-[240px] flex-col gap-3 text-xs tracking-[0.14em] uppercase text-neutral-700"
						>
							<span class="font-bold text-accent-700">
								{t({ es: 'En este artículo', en: 'In this post' })}
							</span>
							{#each index as entry (entry.number)}
								<a href="#post-{entry.number}" class="text-neutral-700 hover:text-accent">
									{entry.number} — {t(entry.text)}
								</a>
							{/each}
						</nav>
					{/if}

					<div
						class="flex max-w-[68ch] flex-col gap-6 text-[clamp(16px,1.5vw,19px)] leading-[1.65] text-neutral-900"
					>
						{#each post.body as block, i (i)}
							{#if block.type === 'lede'}
								<p class="m-0 text-[clamp(19px,2vw,25px)] leading-[1.45] font-medium">
									{t(block.text)}
								</p>
							{:else if block.type === 'heading'}
								<h2
									id="post-{headingNumber(i)}"
									class="mt-4 mb-0 scroll-mt-28 text-[clamp(22px,2.6vw,34px)] font-black tracking-[-0.02em]"
								>
									{headingNumber(i)} — {t(block.text)}
								</h2>
							{:else if block.type === 'paragraph'}
								<p class="m-0">{t(block.text)}</p>
							{:else if block.type === 'quote'}
								<blockquote
									class="m-0 border-l-4 border-accent pl-6 text-[clamp(22px,2.8vw,36px)] leading-[1.15] font-black tracking-[-0.02em]"
								>
									{t(block.text)}
								</blockquote>
							{:else if block.type === 'list'}
								<ul class="m-0 flex list-disc flex-col gap-2 pl-6">
									{#each block.items as item, j (j)}
										<li>{t(item)}</li>
									{/each}
								</ul>
							{:else if block.type === 'code'}
								<pre
									class="m-0 overflow-x-auto bg-neutral-900 p-[clamp(16px,2.4vw,28px)] font-mono text-sm leading-[1.7] text-neutral-200">{block.code}{#if block.comment}
<span class="text-accent-400">{t(block.comment)}</span>{/if}</pre>
							{:else if block.type === 'image'}
								<figure class="m-0">
									<div class="grayscale-print border-2 border-ink">
										<ImageSlot
											src={block.src}
											alt={block.alt ? t(block.alt) : ''}
											placeholder={t({ es: 'Imagen del artículo', en: 'Image for the post' })}
										/>
									</div>
									{#if block.caption}
										<figcaption class="mt-2 text-xs tracking-[0.14em] uppercase text-neutral-600">
											{t(block.caption)}
										</figcaption>
									{/if}
								</figure>
							{/if}
						{/each}

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
							← {t({ es: 'Volver al blog', en: 'Back to blog' })}
						</button>
					</div>
				</div>

				<p class="mt-band mb-0 text-xs tracking-[0.14em] uppercase text-neutral-600">
					{footer.site}
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
