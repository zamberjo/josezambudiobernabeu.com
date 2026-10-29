<script lang="ts">
	import { isOptimized } from '@jzb/domain';

	interface Props {
		/** The widest variant's URL (…-1920w.webp), or null for none. */
		value: string | null;
		id: string;
	}

	let { value = $bindable(), id }: Props = $props();

	let uploading = $state(false);
	let failure = $state('');

	/** Uploads through the same optimiser as the Media page and keeps the URL it returns. */
	async function upload(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		uploading = true;
		failure = '';
		try {
			const body = new FormData();
			body.append('file', file);
			const response = await fetch('/media/upload', { method: 'POST', body });
			if (!response.ok) throw new Error((await response.json()).message ?? response.statusText);
			value = (await response.json()).src;
		} catch (cause) {
			failure = `No se pudo subir: ${cause instanceof Error ? cause.message : String(cause)}`;
		} finally {
			uploading = false;
			input.value = '';
		}
	}
</script>

<!-- Upload here (or on the Media page and paste): either way the URL stored is
     the widest WebP variant, and the site picks the right width per screen. -->
<div class="image-field">
	{#if value}
		<img src={value} alt="" class="image-preview" />
	{/if}
	<div class="row">
		<input
			{id}
			type="text"
			placeholder="Sin imagen"
			bind:value={() => value ?? '', (next: string) => (value = next.trim() ? next.trim() : null)}
		/>
		<label class="button">
			{uploading ? 'Subiendo…' : 'Subir imagen'}
			<input type="file" accept="image/*" hidden disabled={uploading} onchange={upload} />
		</label>
		{#if value}
			<button type="button" class="danger" onclick={() => (value = null)}>Quitar</button>
		{/if}
	</div>
	{#if value && !isOptimized(value)}
		<p class="hint warning">
			Esta imagen no está optimizada: se servirá tal cual, a su tamaño original. Súbela aquí para
			generar las versiones WebP de 640 a 1920 px.
		</p>
	{/if}
	{#if failure}<p class="error">{failure}</p>{/if}
</div>
