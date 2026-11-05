<script lang="ts">
	import '../app.css';
	import { COLLECTIONS, SITE_SECTIONS } from '@jzb/domain';
	import { page } from '$app/state';
	import { collectionLabels, sectionLabels } from '$lib/forms';

	let { data, children } = $props();

	const current = (href: string) => page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
</script>

<svelte:head>
	<title>Backoffice · Zambu</title>
</svelte:head>

{#if data.user}
	<div class="shell">
		<aside class="sidebar">
			<a href="/" class="brand">Zambu <span>backoffice</span></a>

			<nav aria-label="Contenido">
				<h2>Colecciones</h2>
				{#each COLLECTIONS as collection (collection)}
					<a href="/{collection}" aria-current={current(`/${collection}`) ? 'page' : undefined}>
						{collectionLabels[collection]}
					</a>
				{/each}

				<h2>Secciones</h2>
				{#each SITE_SECTIONS as section (section)}
					<a
						href="/site/{section}"
						aria-current={current(`/site/${section}`) ? 'page' : undefined}
					>
						{sectionLabels[section]}
					</a>
				{/each}

				<h2>Ficheros</h2>
				<a href="/media" aria-current={current('/media') ? 'page' : undefined}>Media</a>
			</nav>

			<div class="session">
				<span>{data.user.email}</span>
				{#if !data.isAdmin}
					<p class="error">
						Este usuario no está en <code>public.admins</code>: puede leer, pero no guardar.
					</p>
				{/if}
				<form method="POST" action="/logout"><button type="submit">Salir</button></form>
			</div>
		</aside>

		<main class="content">
			{@render children()}
		</main>
	</div>
{:else}
	{@render children()}
{/if}
