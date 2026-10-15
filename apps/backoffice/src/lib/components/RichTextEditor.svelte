<script lang="ts">
	import type { Editor } from '@tiptap/core';
	import { lostTags } from './html';

	interface Props {
		/** The article HTML; the editor reads it once and writes back on every change. */
		value: string;
		label: string;
	}

	let { value = $bindable(), label }: Props = $props();

	let element: HTMLDivElement;
	let editor = $state<Editor | null>(null);
	/** Bumped on every transaction so the toolbar's active states re-derive. */
	let revision = $state(0);
	let mode = $state<'visual' | 'html'>('visual');
	let warning = $state('');

	// Tiptap touches the DOM, so it is loaded and created in the browser only.
	$effect(() => {
		let instance: Editor | undefined;
		let cancelled = false;

		(async () => {
			const [{ Editor }, { default: StarterKit }, { default: Image }] = await Promise.all([
				import('@tiptap/core'),
				import('@tiptap/starter-kit'),
				import('@tiptap/extension-image')
			]);
			if (cancelled) return;

			instance = new Editor({
				element,
				extensions: [
					StarterKit.configure({
						// h1 is the post title; the article starts at h2.
						heading: { levels: [2, 3, 4] },
						// No forced empty paragraph at the end: it would be stored as <p></p>.
						trailingNode: false,
						// Store plain links; the web's renderer decides rel/target.
						link: { openOnClick: false, HTMLAttributes: { target: null, rel: null } }
					}),
					Image
				],
				content: value,
				onUpdate: ({ editor }) => {
					value = editor.isEmpty ? '' : editor.getHTML();
				},
				onTransaction: () => revision++
			});
			editor = instance;

			// HTML the visual editor cannot represent (a table, a <figure>) would be
			// silently dropped by it, so such an article opens in HTML mode instead.
			const lost = lostTags(value, instance.getHTML());
			if (value && lost.length) {
				mode = 'html';
				warning = `Este artículo usa HTML que el editor visual no admite (${lost.join(', ')}): se edita como HTML.`;
			}
		})();

		return () => {
			cancelled = true;
			instance?.destroy();
		};
	});

	const is = (name: string, attrs?: Record<string, unknown>) => {
		void revision; // read so the toolbar re-renders on every transaction
		return editor?.isActive(name, attrs) ?? false;
	};

	const run = (command: (chain: ReturnType<Editor['chain']>) => ReturnType<Editor['chain']>) =>
		editor && command(editor.chain().focus()).run();

	function setLink() {
		const current = editor?.getAttributes('link').href as string | undefined;
		const href = prompt('URL del enlace (vacío para quitarlo)', current ?? 'https://');
		if (href === null) return;
		run((c) =>
			href.trim() ? c.extendMarkRange('link').setLink({ href: href.trim() }) : c.unsetLink()
		);
	}

	function addImage() {
		const src = prompt('URL de la imagen (súbela en Media y copia su URL)', 'https://');
		if (!src?.trim()) return;
		const alt = prompt('Texto alternativo', '') ?? '';
		run((c) => c.setImage({ src: src.trim(), alt }));
	}

	/**
	 * In HTML mode the textarea is the truth, so the editor's own content can be
	 * overwritten freely: load the source, see what survived, and only adopt it
	 * if nothing was lost or the editor agrees to lose it.
	 */
	function toVisual() {
		if (!editor) return;
		editor.commands.setContent(value, { emitUpdate: false });
		const lost = lostTags(value, editor.getHTML());
		if (
			lost.length &&
			!confirm(
				`El editor visual no admite: ${lost.join(', ')}. Si cambias, se perderá. ¿Cambiar igualmente?`
			)
		)
			return;
		value = editor.isEmpty ? '' : editor.getHTML();
		warning = '';
		mode = 'visual';
	}
</script>

<div class="rich">
	<!-- mousedown is cancelled so a toolbar click never takes focus (or the
	     selection) away from the text being formatted. -->
	<div
		class="rich-toolbar"
		role="toolbar"
		tabindex="-1"
		aria-label="Formato: {label}"
		onmousedown={(event) => {
			if (mode === 'visual' && (event.target as HTMLElement).closest('button'))
				event.preventDefault();
		}}
	>
		{#if mode === 'visual'}
			<button type="button" class:on={is('bold')} onclick={() => run((c) => c.toggleBold())} title="Negrita"><b>B</b></button>
			<button type="button" class:on={is('italic')} onclick={() => run((c) => c.toggleItalic())} title="Cursiva"><i>I</i></button>
			<button type="button" class:on={is('underline')} onclick={() => run((c) => c.toggleUnderline())} title="Subrayado"><u>U</u></button>
			<button type="button" class:on={is('strike')} onclick={() => run((c) => c.toggleStrike())} title="Tachado"><s>S</s></button>
			<button type="button" class:on={is('code')} onclick={() => run((c) => c.toggleCode())} title="Código en línea">&lt;/&gt;</button>
			<span class="sep"></span>
			<button type="button" class:on={is('paragraph')} onclick={() => run((c) => c.setParagraph())} title="Párrafo">¶</button>
			<button type="button" class:on={is('heading', { level: 2 })} onclick={() => run((c) => c.toggleHeading({ level: 2 }))} title="Encabezado (entra en el índice)">H2</button>
			<button type="button" class:on={is('heading', { level: 3 })} onclick={() => run((c) => c.toggleHeading({ level: 3 }))} title="Subencabezado">H3</button>
			<button type="button" class:on={is('bulletList')} onclick={() => run((c) => c.toggleBulletList())} title="Lista">•</button>
			<button type="button" class:on={is('orderedList')} onclick={() => run((c) => c.toggleOrderedList())} title="Lista numerada">1.</button>
			<button type="button" class:on={is('blockquote')} onclick={() => run((c) => c.toggleBlockquote())} title="Cita">❝</button>
			<button type="button" class:on={is('codeBlock')} onclick={() => run((c) => c.toggleCodeBlock())} title="Bloque de código">{'{ }'}</button>
			<span class="sep"></span>
			<button type="button" class:on={is('link')} onclick={setLink} title="Enlace">🔗</button>
			<button type="button" onclick={addImage} title="Imagen">🖼</button>
			<button type="button" onclick={() => run((c) => c.setHorizontalRule())} title="Separador">―</button>
			<span class="sep"></span>
			<button type="button" onclick={() => run((c) => c.undo())} title="Deshacer">↶</button>
			<button type="button" onclick={() => run((c) => c.redo())} title="Rehacer">↷</button>
		{/if}
		<span class="grow"></span>
		<button
			type="button"
			class:on={mode === 'html'}
			onclick={() => (mode === 'html' ? toVisual() : (mode = 'html'))}
			title="Editar el HTML directamente"
		>
			HTML
		</button>
	</div>

	{#if warning}<p class="hint">{warning}</p>{/if}

	<div bind:this={element} class="rich-surface" hidden={mode !== 'visual'} aria-label={label}></div>

	{#if mode === 'html'}
		<textarea class="mono rich-source" rows="18" bind:value aria-label="{label} (HTML)"></textarea>
		<p class="hint">
			Se admite cualquier HTML; al construir la web se eliminan scripts, estilos y atributos no
			permitidos.
		</p>
	{/if}
</div>
