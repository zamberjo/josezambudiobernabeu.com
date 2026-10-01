<script lang="ts" generics="V extends Record<string, unknown>">
	import type { ValidationIssue } from '@jzb/domain';
	import type { Field as FieldDescriptor } from '$lib/forms';
	import Field from './Field.svelte';

	interface Props {
		fields: FieldDescriptor[];
		/** The value to start from; the form edits a deep copy of it. */
		initial: V;
		/** Issues from the last failed submit, keyed by dotted path. */
		issues?: ValidationIssue[];
		/** Maps the working copy to what is posted (e.g. dropping blank optionals). */
		serialize?: (value: V) => unknown;
		action?: string;
		submitLabel?: string;
	}

	let {
		fields,
		initial,
		issues = [],
		serialize = (value) => value,
		action = '?/save',
		submitLabel = 'Guardar'
	}: Props = $props();

	// A working copy, so an abandoned edit never touches the loaded data. Taken
	// once on purpose: pages wrap the form in {#key} to start over.
	// svelte-ignore state_referenced_locally
	let value = $state(structuredClone($state.snapshot(initial) as V));

	// The whole value travels as one JSON field and the server validates it
	// against the domain schema: the form never re-implements the rules.
	const payload = $derived(JSON.stringify(serialize($state.snapshot(value) as V)));

	const errorsFor = (key: string) =>
		issues
			.filter((issue) => issue.path === key || issue.path.startsWith(`${key}.`))
			.map((issue) => (issue.path === key ? issue.message : `${issue.path}: ${issue.message}`));

	const known = $derived(new Set(fields.map((field) => field.key)));
	const general = $derived(issues.filter((issue) => !known.has(issue.path.split('.')[0] ?? '')));
</script>

<form method="POST" {action} class="entity-form">
	{#if general.length}
		<div class="alert" role="alert">
			{#each general as issue (issue.path + issue.message)}
				<p>{issue.path}: {issue.message}</p>
			{/each}
		</div>
	{/if}

	{#each fields as field (field.key)}
		<Field {field} bind:value={(value as Record<string, unknown>)[field.key]} errors={errorsFor(field.key)} />
	{/each}

	<input type="hidden" name="payload" value={payload} />
	<div class="actions">
		<button type="submit" class="primary">{submitLabel}</button>
	</div>
</form>
