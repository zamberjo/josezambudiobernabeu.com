<script lang="ts">
	import { t } from '../i18n.svelte';
	import { magnetic } from '../motion.svelte';
	import { featuredPost, otherPosts, type Post } from '../data/blog';
	import { blog } from '../data/content';
	import BlogReader from './BlogReader.svelte';
	import ImageSlot from './ImageSlot.svelte';
	import SectionHeading from './SectionHeading.svelte';
	import Tag from './Tag.svelte';

	let reader: BlogReader;

	// Captured locally so the click handler keeps the narrowed, defined value.
	const featured = featuredPost;

	/** A post is only openable once it actually has a body written. */
	const readable = (post: Post) => post.body.length > 0;

	interface Props {
		/** Two-digit band number; +page.svelte owns the sequence. */
		number: string;
	}

	let { number }: Props = $props();
</script>

{#snippet card(post: Post, position: number)}
	<div class="grayscale-print h-[clamp(150px,20vw,210px)] w-full border-b-2 border-ink">
		<ImageSlot
			src={post.cover ?? undefined}
			alt={t(post.title)}
			placeholder={t({ es: 'Imagen del artículo', en: 'Image for the post' })}
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
			{post.status === 'draft'
				? t({ es: 'Borrador', en: 'Draft' })
				: t({ es: 'Leer', en: 'Read' })}
		</div>
	</div>
{/snippet}

<section id="blog" class="overflow-clip border-b-2 border-ink px-gutter py-band">
	<SectionHeading {number} title="Blog">
		{#snippet aside()}{t(blog.intro)}{/snippet}
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
					placeholder={t({ es: 'Imagen del último artículo', en: 'Image for the latest post' })}
				/>
			</div>
			<div
				class="flex flex-col gap-4 bg-bg p-[clamp(20px,3.5vw,48px)] shadow-[0_0_0_1px_var(--color-ink)]"
			>
				<div class="flex flex-wrap gap-2">
					<Tag variant="solid">{t({ es: 'Último artículo', en: 'Latest post' })}</Tag>
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
							{t({ es: 'min de lectura', en: 'min read' })}
						</span>
					{/if}
				</div>
				<button
					type="button"
					onclick={() => reader.open(featured)}
					class="mt-auto cursor-pointer appearance-none self-start border-2 border-accent bg-accent px-[18px] py-3 text-left text-[13px] font-bold tracking-[0.1em] text-white uppercase transition-colors hover:border-accent-600 hover:bg-accent-600"
				>
					{t({ es: 'Leer', en: 'Read' })}
				</button>
			</div>
		</article>
	{/if}

	<div class="mt-0.5 grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-0.5">
		{#each otherPosts as post, i (post.slug)}
			<div class="reveal-up">
				{#if readable(post)}
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

<BlogReader bind:this={reader} />
