<script lang="ts">
	import EntityForm from '$lib/components/EntityForm.svelte';
	import { blankLocalized, sectionFields, sectionLabels, type Field } from '$lib/forms';

	let { data, form } = $props();

	const fields = $derived(sectionFields[data.section] as Field[]);

	/** The empty value of each field kind, for a section that has no row yet. */
	const empty = (field: Field): unknown => {
		switch (field.kind) {
			case 'localized':
				return blankLocalized();
			case 'strings':
			case 'localizedList':
			case 'links':
			case 'blocks':
				return [];
			case 'boolean':
				return false;
			case 'number':
				return 0;
			default:
				return '';
		}
	};

	const initial = $derived(
		((form && 'payload' in form ? form.payload : data.value) ??
			Object.fromEntries(fields.map((field) => [field.key, empty(field)]))) as Record<string, unknown>
	);
</script>

<header class="page-header">
	<h1>{sectionLabels[data.section]}</h1>
</header>

{#if form?.saved}<p class="success" role="status">Guardado. Publica para verlo en la web.</p>{/if}

{#key initial}
	<EntityForm {fields} {initial} issues={form?.issues ?? []} />
{/key}
