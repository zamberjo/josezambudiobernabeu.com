<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any --
	   `value` is whatever the descriptor's key holds; each branch below knows
	   its kind's shape, and the domain schema re-validates it on submit. */
	import { exhaustive, blankLocalized, type Field } from '$lib/forms';
	import { LOCALES, type Lang } from '@jzb/domain';
	import RichTextEditor from './RichTextEditor.svelte';
	import ListControls from './ListControls.svelte';
	import LocalizedInput from './LocalizedInput.svelte';
	import { moved, without } from './list';

	interface Props {
		field: Field;
		value: any;
		/** Validation messages for this field's path, from the last submit. */
		errors?: string[];
	}

	let { field, value = $bindable(), errors = [] }: Props = $props();
	const id = $derived(`field-${field.key}`);

	/** Rich text shows one language at a time: a long article side by side is unreadable. */
	let tab = $state<Lang>('es');

	const lines = {
		get: () => (value as string[]).join('\n'),
		set: (text: string) =>
			(value = text
				.split('\n')
				.map((line) => line.trim())
				.filter(Boolean))
	};
</script>

<div class="field" class:invalid={errors.length > 0}>
	<label class="field-label" for={id}>{field.label}</label>

	{#if field.kind === 'text'}
		{#if field.nullable}
			<input
				{id}
				type="text"
				bind:value={() => value ?? '', (next: string) => (value = next.trim() ? next : null)}
			/>
		{:else}
			<input {id} type="text" bind:value />
		{/if}
	{:else if field.kind === 'code'}
		<textarea {id} class="mono" rows="6" bind:value></textarea>
	{:else if field.kind === 'number'}
		<input
			{id}
			type="number"
			min={field.min}
			max={field.max}
			bind:value={
				() => value ?? '',
				(next: number | null | undefined) =>
					(value = next === null || next === undefined ? (field.nullable ? null : 0) : next)
			}
		/>
	{:else if field.kind === 'boolean'}
		<input {id} type="checkbox" bind:checked={value} />
	{:else if field.kind === 'select'}
		<select {id} bind:value>
			{#each field.options as option (option)}
				<option value={option}>{option}</option>
			{/each}
		</select>
	{:else if field.kind === 'date'}
		<input
			{id}
			type="date"
			bind:value={() => value ?? '', (next: string) => (value = next || null)}
		/>
	{:else if field.kind === 'localized'}
		<LocalizedInput bind:value label={field.label} multiline={field.multiline} />
	{:else if field.kind === 'strings'}
		<textarea {id} rows="4" bind:value={lines.get, lines.set}></textarea>
	{:else if field.kind === 'localizedList'}
		<div class="rows">
			{#each value as _, i (i)}
				<div class="row">
					<LocalizedInput bind:value={value[i]} label="{field.label} {i + 1}" multiline />
					<ListControls
						index={i}
						length={value.length}
						onmove={(from, to) => (value = moved(value, from, to))}
						onremove={(index) => (value = without(value, index))}
					/>
				</div>
			{/each}
			<button type="button" onclick={() => (value = [...value, blankLocalized()])}>
				+ Añadir
			</button>
		</div>
	{:else if field.kind === 'links'}
		<div class="rows">
			{#each value as link, i (i)}
				<div class="row">
					{#if field.localized}
						<LocalizedInput bind:value={link.label} label="Texto {i + 1}" />
					{:else}
						<input type="text" bind:value={link.label} aria-label="Texto {i + 1}" />
					{/if}
					<input type="text" bind:value={link.href} aria-label="Destino {i + 1}" />
					<ListControls
						index={i}
						length={value.length}
						onmove={(from, to) => (value = moved(value, from, to))}
						onremove={(index) => (value = without(value, index))}
					/>
				</div>
			{/each}
			<button
				type="button"
				onclick={() =>
					(value = [...value, { label: field.localized ? blankLocalized() : '', href: '' }])}
			>
				+ Añadir enlace
			</button>
		</div>
	{:else if field.kind === 'richText'}
		<div class="tabs" role="tablist" aria-label="Idioma de {field.label}">
			{#each LOCALES as lang (lang)}
				<button
					type="button"
					role="tab"
					aria-selected={tab === lang}
					class:on={tab === lang}
					onclick={() => (tab = lang)}>{lang.toUpperCase()}</button
				>
			{/each}
		</div>
		<!-- Both editors stay mounted, so switching tabs never loses undo history. -->
		{#each LOCALES as lang (lang)}
			<div hidden={tab !== lang} role="tabpanel">
				<RichTextEditor bind:value={value[lang]} label="{field.label} ({lang})" />
			</div>
		{/each}
	{:else}
		{exhaustive(field)}
	{/if}

	{#if field.kind === 'text' || field.kind === 'strings'}
		{#if field.hint}<p class="hint">{field.hint}</p>{/if}
	{/if}
	{#each errors as message (message)}
		<p class="error">{message}</p>
	{/each}
</div>
