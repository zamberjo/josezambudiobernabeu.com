<script lang="ts">
	import { collectionLabels } from '$lib/forms';

	let { data, form } = $props();
</script>

<h1>Contenido</h1>

<ul class="cards">
	{#each data.counts as { collection, count } (collection)}
		<li>
			<a href="/{collection}">
				<strong>{count ?? '—'}</strong>
				<span>{collectionLabels[collection]}</span>
			</a>
		</li>
	{/each}
</ul>

<section class="publish">
	<h2>Publicar</h2>
	<p>
		La web es estática: los cambios guardados aquí no se ven hasta que se reconstruye. Publicar
		valida todo el contenido y lanza el workflow de deploy en GitHub.
	</p>

	{#if !data.health.ok}
		<pre class="alert" role="alert">{data.health.message}</pre>
	{/if}

	<p>
		Para ver cómo quedará antes de publicar, arranca <code>pnpm preview:content</code> y abre la
		<a href={data.previewUrl} target="_blank" rel="noopener">vista previa</a>: lee esta misma base de
		datos y muestra cada cambio guardado al recargar.
	</p>

	<form method="POST" action="?/publish">
		<button type="submit" class="primary" disabled={!data.health.ok}>Publicar la web</button>
	</form>

	{#if form?.message}
		<pre class={form.published ? 'success' : 'alert'} role="status">{form.message}</pre>
	{/if}
</section>
