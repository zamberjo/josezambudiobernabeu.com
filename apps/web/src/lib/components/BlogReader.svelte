<script lang="ts">
	import type { PostView, Ui } from '@jzb/domain';
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import { localePath } from '@jzb/domain';
	import { lang, t } from '../i18n.svelte';
	import Article from './Article.svelte';

	// A native modal dialog, so Esc, focus trapping and inert-ing the page
	// behind come from the platform rather than from scroll-locking by hand.
	let dialog: HTMLDialogElement;
	let scroller: HTMLDivElement;
	let post = $state<PostView | null>(null);

	let { site, ui }: { site: string; ui: Ui } = $props();

	/**
	 * Opens over the home page and moves the address bar to the post's own
	 * URL (shallow routing: no navigation, no reload), so what is on screen
	 * can be copied, shared and reloaded as /blog/<slug> (or /en/blog/<slug>).
	 */
	export function open(next: PostView) {
		post = next;
		pushState(localePath(lang.current, `/blog/${next.slug}`), { reader: next.slug });
		dialog.showModal();
		scroller.scrollTop = 0;
	}

	function close() {
		dialog.close();
	}

	// Closing (button or Esc) steps back to the home URL; stepping back (the
	// browser's button) closes. Each side checks the other has not already run.
	function onclose() {
		if (page.state.reader) history.back();
	}

	$effect(() => {
		if (!page.state.reader && dialog.open) dialog.close();
	});
</script>

{#snippet back()}
	<button
		type="button"
		onclick={close}
		class="cursor-pointer appearance-none self-start border-2 border-ink bg-transparent px-[18px] py-3 text-left text-[13px] font-bold tracking-[0.1em] uppercase text-ink transition-colors hover:bg-ink hover:text-bg"
	>
		← {t(ui.backToBlog)}
	</button>
{/snippet}

<dialog bind:this={dialog} {onclose} class="reader" aria-label={post ? t(post.title) : ''}>
	<div bind:this={scroller} class="h-full overflow-y-auto overscroll-contain bg-bg text-ink">
		<div class="sticky top-0 z-3 bg-bg">
			<div aria-hidden="true" class="scroll-progress-nearest h-1 bg-accent"></div>
			<div
				class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b-2 border-ink px-gutter py-3"
			>
				<button
					type="button"
					onclick={close}
					class="cursor-pointer appearance-none border-2 border-ink bg-transparent px-3.5 py-2.5 text-left text-xs font-bold tracking-[0.12em] uppercase text-ink transition-colors hover:bg-ink hover:text-bg"
				>
					← {t(ui.backToBlog)}
				</button>
				<span class="text-[15px] font-black tracking-[-0.01em]">Zambu · Blog</span>
			</div>
		</div>

		{#if post}
			<Article {post} {ui} {site} {back} />
		{/if}
	</div>
</dialog>

<style>
	/* The reader takes the whole viewport rather than sitting in a centred box. */
	.reader {
		width: 100%;
		max-width: none;
		height: 100%;
		max-height: none;
		margin: 0;
		padding: 0;
		border: 0;
		background: transparent;
	}

	.reader::backdrop {
		background: var(--color-bg);
	}
</style>
