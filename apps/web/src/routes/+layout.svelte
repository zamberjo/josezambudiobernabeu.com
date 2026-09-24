<script lang="ts">
	import '../app.css';
	import { lang } from '$lib/i18n.svelte';

	let { children } = $props();

	// Keeps <html lang> in step with the ES/EN toggle, so assistive technology
	// announces the page in the language it is actually showing.
	$effect(() => {
		document.documentElement.lang = lang.current;
	});
</script>

{@render children()}
