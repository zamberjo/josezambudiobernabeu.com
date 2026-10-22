<script lang="ts">
	let { data, form } = $props();
</script>

<header class="page-header">
	<h1>Media</h1>
</header>

<p class="hint">
	Imágenes para portadas y artículos, en el bucket público <code>media</code>. Al subirlas se
	convierten a WebP en cuatro anchos (640, 960, 1280 y 1920 px) y la web elige el adecuado para cada
	pantalla. Copia la URL en el campo de portada o en el botón de imagen del editor.
</p>

<form method="POST" action="?/upload" enctype="multipart/form-data" class="upload">
	<input type="file" name="file" accept="image/*" required />
	<button type="submit" class="primary">Subir</button>
</form>

{#if form?.message}<p class="alert" role="alert">{form.message}</p>{/if}
{#if form && 'uploaded' in form}
	<p class="success" role="status">
		Subida y optimizada ({form.originalKb} KB de origen). URL: <code>{form.uploaded}</code>
	</p>
{/if}
{#if data.error}<p class="alert" role="alert">{data.error}</p>{/if}

<ul class="media">
	{#each data.files as file (file.name)}
		<li>
			<img src={file.url} alt="" loading="lazy" />
			<input type="text" readonly value={file.url} aria-label="URL de {file.name}" />
			{#if !file.optimized}
				<p class="hint">Sin optimizar: vuelve a subirla para generar las variantes WebP.</p>
			{/if}
			<form method="POST" action="?/remove">
				<input type="hidden" name="name" value={file.name} />
				<button class="danger">Borrar</button>
			</form>
		</li>
	{/each}
</ul>
