<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { localePath, unlocalizedPath } from '@jzb/domain';
	import { lang, rememberedLang } from '$lib/i18n.svelte';
	// The two faces above the fold: body text and the display heading. Without
	// a preload the browser only finds them after downloading and parsing the
	// CSS, which puts two round trips in front of the first paint of text. Vite
	// fingerprints these to the same files app.css points at.
	import archivo400 from '@fontsource/archivo/files/archivo-latin-400-normal.woff2?url';
	import archivo900 from '@fontsource/archivo/files/archivo-latin-900-normal.woff2?url';

	let { children } = $props();

	// The prerendered HTML already has the right <html lang> (hooks.server.ts);
	// this keeps it in step when the toggle navigates client-side.
	$effect(() => {
		document.documentElement.lang = lang.current;
	});

	// A visitor who picked a language with the toggle gets it back on their
	// next visit, wherever they land. Links and crawlers reach a page in its
	// own language; only that explicit choice moves them.
	onMount(() => {
		const saved = rememberedLang();
		if (page.status !== 200 || !saved || saved === lang.current) return;
		const target = localePath(saved, unlocalizedPath(page.url.pathname)) + page.url.hash;
		goto(target, { replaceState: true, noScroll: true });
	});
</script>

<svelte:head>
	<link rel="preload" as="font" type="font/woff2" href={archivo400} crossorigin="anonymous" />
	<link rel="preload" as="font" type="font/woff2" href={archivo900} crossorigin="anonymous" />
</svelte:head>

{@render children()}
