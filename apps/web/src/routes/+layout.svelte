<script lang="ts">
	import '../app.css';
	import { lang } from '$lib/i18n.svelte';
	// The two faces above the fold: body text and the display heading. Without
	// a preload the browser only finds them after downloading and parsing the
	// CSS, which puts two round trips in front of the first paint of text. Vite
	// fingerprints these to the same files app.css points at.
	import archivo400 from '@fontsource/archivo/files/archivo-latin-400-normal.woff2?url';
	import archivo900 from '@fontsource/archivo/files/archivo-latin-900-normal.woff2?url';

	let { children } = $props();

	// Keeps <html lang> in step with the ES/EN toggle, so assistive technology
	// announces the page in the language it is actually showing.
	$effect(() => {
		document.documentElement.lang = lang.current;
	});
</script>

<svelte:head>
	<link rel="preload" as="font" type="font/woff2" href={archivo400} crossorigin="anonymous" />
	<link rel="preload" as="font" type="font/woff2" href={archivo900} crossorigin="anonymous" />
</svelte:head>

{@render children()}
