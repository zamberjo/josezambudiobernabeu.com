<script lang="ts">
	import { collectionLabels } from '$lib/forms';

	let { data, form } = $props();
</script>

<header class="page-header">
	<h1>{collectionLabels[data.collection]}</h1>
	<a class="button primary" href="/{data.collection}/new">+ Nuevo</a>
</header>

{#if form?.message}<p class="alert" role="alert">{form.message}</p>{/if}

{#if data.entries.length === 0}
	<p class="empty">Todavía no hay nada aquí.</p>
{:else}
	<p class="hint">El orden de la lista es el orden en la web.</p>
	<ol class="entries">
		{#each data.entries as entry, i (entry.id)}
			<li>
				<a href="/{data.collection}/{entry.id}">{entry.label}</a>
				<form method="POST" action="?/move" class="inline">
					<input type="hidden" name="id" value={entry.id} />
					<button name="direction" value="up" disabled={i === 0} aria-label="Subir {entry.label}"
						>↑</button
					>
					<button
						name="direction"
						value="down"
						disabled={i === data.entries.length - 1}
						aria-label="Bajar {entry.label}">↓</button
					>
				</form>
				<form
					method="POST"
					action="?/remove"
					class="inline"
					onsubmit={(event) => {
						if (!confirm(`¿Borrar «${entry.label}»?`)) event.preventDefault();
					}}
				>
					<input type="hidden" name="id" value={entry.id} />
					<button class="danger">Borrar</button>
				</form>
			</li>
		{/each}
	</ol>
{/if}
