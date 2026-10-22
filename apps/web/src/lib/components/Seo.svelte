<script lang="ts">
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
		locale?: string;
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
		locale = 'es_ES'
	}: Props = $props();

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

	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:locale" content={locale} />
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
