<script lang="ts">
	let { data, form } = $props();
</script>

<header class="page-header">
	<h1>Media</h1>
</header>

<p class="hint">
	Imágenes para portadas y artículos, en el bucket público <code>media</code>. Copia la URL en el
	campo de portada o en un bloque de imagen.
</p>

<form method="POST" action="?/upload" enctype="multipart/form-data" class="upload">
	<input type="file" name="file" accept="image/*" required />
	<button type="submit" class="primary">Subir</button>
</form>

{#if form?.message}<p class="alert" role="alert">{form.message}</p>{/if}
{#if data.error}<p class="alert" role="alert">{data.error}</p>{/if}

<ul class="media">
	{#each data.files as file (file.name)}
		<li>
			<img src={file.url} alt="" loading="lazy" />
			<input type="text" readonly value={file.url} aria-label="URL de {file.name}" />
			<form method="POST" action="?/remove">
				<input type="hidden" name="name" value={file.name} />
				<button class="danger">Borrar</button>
			</form>
		</li>
	{/each}
</ul>
