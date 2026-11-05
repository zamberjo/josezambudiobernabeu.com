<script lang="ts">
	import { alternatePaths, isIndexable, localePath } from '@jzb/domain';
	import { lang, t } from '$lib/i18n.svelte';
	import { motionRoot } from '$lib/motion.svelte';
	import Article from '$lib/components/Article.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import SiteNav from '$lib/components/SiteNav.svelte';

	let { data } = $props();


	const view = $derived(data.view);
	const post = $derived(data.post);
	const site = $derived(view.site);
	const origin = $derived(site.footer.siteUrl);
	const absolute = (path: string) => new URL(path, origin).href;

	const path = $derived(`/blog/${post.slug}`);
	const url = $derived(absolute(localePath(lang.current, path)));
	const home = $derived(localePath(lang.current, '/'));
	const image = $derived(post.cover ? absolute(post.cover) : null);
	const author = $derived({ '@type': 'Person', name: 'Jose Zambudio Bernabeu', url: origin });
</script>

<!-- Prerendered once per language: /blog/<slug> and /en/blog/<slug>. -->
<Seo
	title="{t(post.title)} · Jose Zambudio Bernabeu"
	description={t(post.excerpt)}
	{url}
	{image}
	type="article"
	publishedTime={post.date}
	noindex={!isIndexable(post)}
	alternates={alternatePaths(path)}
	locale={lang.current}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: t(post.title),
		description: t(post.excerpt),
		inLanguage: lang.current,
		url,
		mainEntityOfPage: url,
		...(post.date && { datePublished: post.date }),
		...(image && { image }),
		keywords: post.tags.join(', '),
		wordCount: post.article[lang.current].words,
		timeRequired: `PT${post.article[lang.current].minutes}M`,
		author,
		publisher: author
	}}
/>

{#snippet back()}
	<a
		href="{localePath(lang.current, '/#blog')}"
		class="self-start border-2 border-ink px-[18px] py-3 text-[13px] font-bold tracking-[0.1em] uppercase text-ink transition-colors hover:bg-ink hover:text-bg"
	>
		← {t(site.ui.backToBlog)}
	</a>
{/snippet}

<div use:motionRoot class="overflow-x-clip bg-bg">
	<SiteNav links={view.nav} base={home} />
	<main>
		<Article {post} ui={site.ui} site={site.footer.site} {back} priority />
	</main>
	<SiteFooter
		footer={site.footer}
		social={site.social.links}
		projects={view.projects}
		hasPosts={view.blog !== null}
		base={home}
	/>
</div>
