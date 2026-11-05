<script lang="ts">
	import { LOCALES, type Lang } from '@jzb/domain';

	interface Props {
		title: string;
		description: string;
		/** Absolute canonical URL of this page. */
		url: string;
		/** Absolute URL of the share image, if any. */
		image?: string | null;
		type?: 'website' | 'article';
		/** YYYY-MM-DD, for articles. */
		publishedTime?: string | null;
		/** Keeps the page out of search results (drafts). */
		noindex?: boolean;
		/** schema.org structured data. */
		jsonLd?: Record<string, unknown>;
		/** The page's language. */
		locale: Lang;
		/** Site paths of this page in every language, for hreflang. */
		alternates: Record<Lang | 'x-default', string>;
	}

	let {
		title,
		description,
		url,
		image = null,
		type = 'website',
		publishedTime = null,
		noindex = false,
		jsonLd,
		locale,
		alternates
	}: Props = $props();

	const OG_LOCALES: Record<Lang, string> = { es: 'es_ES', en: 'en_GB' };
	// Same origin as the canonical URL, which is always absolute.
	const absolute = (path: string) => new URL(path, url).href;

	// JSON-LD is injected as a script element, so no string in it may contain a
	// closing tag: every '<' is escaped, which JSON parsers read back unchanged.
	const structuredData = $derived(
		jsonLd &&
			`<script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</` +
				'script>'
	);
</script>

<!-- One place for what search engines and link previews read: the page title,
     canonical URL, Open Graph and Twitter cards, and structured data. -->
<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	{#if noindex}<meta name="robots" content="noindex" />{/if}

	<!-- Every language of this page, so search engines show each visitor theirs. -->
	{#each Object.entries(alternates) as [hreflang, path] (hreflang)}
		<link rel="alternate" {hreflang} href={absolute(path)} />
	{/each}

	<!-- Feed autodiscovery: readers and browsers find the RSS from any page.
	     Advertised even before the first post, so early subscribers get it. -->
	<link
		rel="alternate"
		type="application/rss+xml"
		hreflang="es"
		title="Jose Zambudio Bernabeu · Blog (ES)"
		href="/rss.xml"
	/>
	<link
		rel="alternate"
		type="application/rss+xml"
		hreflang="en"
		title="Jose Zambudio Bernabeu · Blog (EN)"
		href="/en/rss.xml"
	/>

	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:locale" content={OG_LOCALES[locale]} />
	{#each LOCALES.filter((other) => other !== locale) as other (other)}
		<meta property="og:locale:alternate" content={OG_LOCALES[other]} />
	{/each}
	<meta property="og:site_name" content="Jose Zambudio Bernabeu" />
	{#if image}<meta property="og:image" content={image} />{/if}
	{#if publishedTime}<meta property="article:published_time" content={publishedTime} />{/if}

	<meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if image}<meta name="twitter:image" content={image} />{/if}

	{#if structuredData}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html structuredData}
	{/if}
</svelte:head>
