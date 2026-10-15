<script lang="ts">
	import { t } from '../i18n.svelte';
	import { magnetic } from '../motion.svelte';
	import { type BlogView, type Localized, type PostView, type Ui } from '@jzb/domain';
	import BlogReader from './BlogReader.svelte';
	import ImageSlot from './ImageSlot.svelte';
	import SectionHeading from './SectionHeading.svelte';
	import Tag from './Tag.svelte';

	let reader: BlogReader;

	interface Props {
		/** Two-digit band number; +page.svelte owns the sequence. */
		number: string;
		blog: BlogView;
		intro: Localized;
		/** Printed at the foot of the reader. */
		site: string;
		ui: Ui;
	}

	let { number, blog, intro, site, ui }: Props = $props();

	// Captured locally so the click handler keeps the narrowed, defined value.
	const featured = $derived(blog.featured);
</script>

{#snippet card(post: PostView, position: number)}
	<div class="grayscale-print h-[clamp(150px,20vw,210px)] w-full border-b-2 border-ink">
		<ImageSlot
			src={post.cover ?? undefined}
			alt={t(post.title)}
			placeholder={t(ui.postImage)}
		/>
	</div>
	<div class="flex flex-1 flex-col gap-4 p-[clamp(18px,2.4vw,28px)]">
		<div class="flex flex-wrap gap-2">
			{#each post.tags as tag (tag)}
				<Tag>{tag}</Tag>
			{/each}
		</div>
		<div class="text-[clamp(19px,2vw,26px)] leading-[1.1] font-black tracking-[-0.02em] text-pretty">
			{t(post.title)}
		</div>
		<div class="mt-auto text-xs tracking-[0.14em] uppercase text-neutral-700">
			{String(position).padStart(2, '0')} ·
			{t(post.status === 'draft' ? ui.draft : ui.read)}
		</div>
	</div>
{/snippet}

<section id="blog" class="overflow-clip border-b-2 border-ink px-gutter py-band">
	<SectionHeading {number} title={t(ui.blogTitle)}>
		{#snippet aside()}{t(intro)}{/snippet}
	</SectionHeading>

	{#if featured}
		<article
			use:magnetic={8}
			class="magnet grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-0.5 border-2 border-ink"
		>
			<div
				class="grayscale-print min-h-[clamp(200px,32vw,420px)] bg-bg shadow-[0_0_0_1px_var(--color-ink)]"
			>
				<ImageSlot
					src={featured.cover ?? undefined}
					alt={t(featured.title)}
					placeholder={t(ui.latestPostImage)}
				/>
			</div>
			<div
				class="flex flex-col gap-4 bg-bg p-[clamp(20px,3.5vw,48px)] shadow-[0_0_0_1px_var(--color-ink)]"
			>
				<div class="flex flex-wrap gap-2">
					<Tag variant="solid">{t(ui.latestPost)}</Tag>
					{#each featured.tags as tag (tag)}
						<Tag>{tag}</Tag>
					{/each}
				</div>
				<h3
					class="m-0 text-[clamp(26px,3.6vw,48px)] leading-[1.02] font-black tracking-[-0.03em] text-pretty"
				>
					{t(featured.title)}
				</h3>
				<p class="m-0 text-[17px] leading-[1.6] text-neutral-800 text-pretty">
					{t(featured.excerpt)}
				</p>
				<div class="flex flex-wrap gap-4 text-xs tracking-[0.14em] uppercase text-neutral-700">
					<span>Jose Zambudio</span>
					{#if featured.readingTime}
						<span aria-hidden="true">— · —</span>
						<span>
							{featured.readingTime}
							{t(ui.minRead)}
						</span>
					{/if}
				</div>
				<button
					type="button"
					onclick={() => featured && reader.open(featured)}
					class="mt-auto cursor-pointer appearance-none self-start border-2 border-accent bg-accent px-[18px] py-3 text-left text-[13px] font-bold tracking-[0.1em] text-white uppercase transition-colors hover:border-accent-600 hover:bg-accent-600"
				>
					{t(ui.read)}
				</button>
			</div>
		</article>
	{/if}

	<div class="mt-0.5 grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-0.5">
		{#each blog.others as post, i (post.slug)}
			<div class="reveal-up">
				{#if post.readable}
					<button
						type="button"
						use:magnetic={14}
						onclick={() => reader.open(post)}
						aria-label={t(post.title)}
						class="magnet-skew flex h-full w-full cursor-pointer flex-col bg-bg text-left text-ink shadow-[0_0_0_1px_var(--color-divider)] hover:bg-neutral-200"
					>
						{@render card(post, i + 2)}
					</button>
				{:else}
					<!-- A draft with nothing written yet stays inert rather than opening an
					     empty reader, so the card never lies about being readable. -->
					<div
						use:magnetic={14}
						class="magnet-skew flex h-full w-full flex-col bg-bg text-ink shadow-[0_0_0_1px_var(--color-divider)]"
					>
						{@render card(post, i + 2)}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>

<BlogReader bind:this={reader} {site} {ui} />
