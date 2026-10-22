<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} · Jose Zambudio Bernabeu</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="grid min-h-screen content-center gap-6 bg-bg px-gutter py-band">
	<p class="m-0 text-sm font-black text-accent">{page.status}</p>
	<h1 class="m-0 text-[clamp(40px,8vw,120px)] leading-[0.95] font-black tracking-[-0.04em]">
		{page.status === 404 ? 'Aquí no hay nada' : 'Algo ha fallado'}
	</h1>
	<p class="m-0 max-w-[48ch] text-lg text-neutral-800">
		{page.status === 404 ? 'Nothing here.' : 'Something went wrong.'}
	</p>
	<a
		href="/"
		class="justify-self-start border-2 border-ink px-[18px] py-3 text-[13px] font-bold tracking-[0.1em] uppercase text-ink hover:bg-ink hover:text-bg"
	>
		← Jose Zambudio Bernabeu
	</a>
</main>
