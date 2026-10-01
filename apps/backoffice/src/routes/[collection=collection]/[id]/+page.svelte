<script lang="ts">
	import type { Entities } from '@jzb/domain';
	import { page } from '$app/state';
	import EntityForm from '$lib/components/EntityForm.svelte';
	import { collectionFields, collectionLabels, formCodec } from '$lib/forms';

	let { data, form } = $props();

	// After a failed submit, reopen what the editor typed, not the stored value.
	const initial = $derived(
		formCodec.toForm(
			data.collection,
			(form && 'payload' in form ? form.payload : data.data) as Entities[typeof data.collection]
		)
	);
	const saved = $derived(form?.saved || page.url.searchParams.has('saved'));
</script>

<header class="page-header">
	<h1>
		<a href="/{data.collection}">{collectionLabels[data.collection]}</a> ·
		{data.id ? 'Editar' : 'Nuevo'}
	</h1>
</header>

{#if saved}<p class="success" role="status">Guardado. Publica para verlo en la web.</p>{/if}

{#key initial}
	<EntityForm
		fields={collectionFields[data.collection]}
		initial={initial as Record<string, unknown>}
		issues={form?.issues ?? []}
		serialize={(value) => formCodec.fromForm(data.collection, value as never)}
	/>
{/key}
