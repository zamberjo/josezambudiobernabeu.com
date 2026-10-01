<script lang="ts">
	import type { Block } from '@jzb/domain';
	import { BLOCK_TYPES, blankBlock, blankLocalized, blockLabels } from '$lib/forms';
	import ListControls from './ListControls.svelte';
	import LocalizedInput from './LocalizedInput.svelte';
	import { moved, without } from './list';

	let { blocks = $bindable() }: { blocks: Block[] } = $props();
</script>

<!-- One card per block, in reading order. The kind is fixed once added: to
     change it, add the new kind and remove the old block. -->
<div class="blocks">
	{#each blocks as block, i (i)}
		<fieldset class="block">
			<legend>{blockLabels[block.type]}</legend>

			{#if block.type === 'lede' || block.type === 'heading' || block.type === 'paragraph' || block.type === 'quote'}
				<LocalizedInput
					bind:value={block.text}
					label={blockLabels[block.type]}
					multiline={block.type !== 'heading'}
				/>
			{:else if block.type === 'list'}
				{#each block.items as _, j (j)}
					<div class="row">
						<LocalizedInput bind:value={block.items[j]!} label="Elemento {j + 1}" />
						<ListControls
							index={j}
							length={block.items.length}
							onmove={(from, to) => (block.items = moved(block.items, from, to))}
							onremove={(index) => (block.items = without(block.items, index))}
						/>
					</div>
				{/each}
				<button type="button" onclick={() => (block.items = [...block.items, blankLocalized()])}>
					+ Elemento
				</button>
			{:else if block.type === 'code'}
				<textarea class="mono" rows="6" bind:value={block.code} aria-label="Código"></textarea>
				<p class="hint">Comentario (opcional)</p>
				<LocalizedInput bind:value={block.comment!} label="Comentario" />
			{:else if block.type === 'image'}
				<input type="text" bind:value={block.src} aria-label="URL de la imagen" placeholder="/assets/… o URL de Media" />
				<p class="hint">Texto alternativo y pie (opcionales)</p>
				<LocalizedInput bind:value={block.alt!} label="Alt" />
				<LocalizedInput bind:value={block.caption!} label="Pie" />
			{/if}

			<ListControls
				index={i}
				length={blocks.length}
				onmove={(from, to) => (blocks = moved(blocks, from, to))}
				onremove={(index) => (blocks = without(blocks, index))}
			/>
		</fieldset>
	{/each}

	<div class="add-block">
		<span class="hint">Añadir:</span>
		{#each BLOCK_TYPES as type (type)}
			<button type="button" onclick={() => (blocks = [...blocks, blankBlock(type)])}>
				{blockLabels[type]}
			</button>
		{/each}
	</div>
</div>
