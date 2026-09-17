<script lang="ts">
	import { t } from '../i18n.svelte';
	import { footer, social } from '../data/content';
	import { projects } from '../data/projects';
</script>

<footer class="bg-neutral-900 px-gutter pt-[clamp(48px,7vw,96px)] pb-8 text-neutral-200">
	<div class="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-[clamp(24px,4vw,64px)]">
		<div>
			<div class="text-[clamp(28px,4vw,48px)] font-black tracking-[-0.03em] text-white">
				{footer.brand}
			</div>
			<p class="mt-3 mb-0 max-w-[34ch] text-sm leading-[1.6] text-neutral-400">
				{t(footer.blurb)}
			</p>
		</div>

		<nav aria-label="Social">
			<h2 class="mb-4 text-xs font-bold tracking-[0.18em] uppercase text-accent-400">Social</h2>
			<ul class="flex list-none flex-col gap-2 p-0 text-[15px]">
				{#each social as link (link.label)}
					<li>
						<a
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							class="text-neutral-200 hover:text-accent-400">{link.label}</a
						>
					</li>
				{/each}
			</ul>
		</nav>

		<nav aria-label="Projects">
			<h2 class="mb-4 text-xs font-bold tracking-[0.18em] uppercase text-accent-400">Projects</h2>
			<ul class="flex list-none flex-col gap-2 p-0 text-[15px]">
				{#each projects as project (project.name)}
					<li>
						<a
							href={project.projectUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="text-neutral-200 hover:text-accent-400">{project.name}</a
						>
					</li>
				{/each}
			</ul>
		</nav>

		<nav aria-label="Blog">
			<h2 class="mb-4 text-xs font-bold tracking-[0.18em] uppercase text-accent-400">Blog</h2>
			<ul class="flex list-none flex-col gap-2 p-0 text-[15px]">
				<li><a href="#blog" class="text-neutral-200 hover:text-accent-400">{t(footer.blogLink)}</a></li>
			</ul>
		</nav>
	</div>

	<div
		class="mt-[clamp(32px,5vw,64px)] flex flex-wrap justify-between gap-4 border-t-2 border-neutral-700 pt-6 text-[13px] text-neutral-400"
	>
		<span>© {new Date().getFullYear()} Jose Zambudio Bernabeu</span>
		<a href={footer.siteUrl} class="text-neutral-400 hover:text-accent-400">{footer.site}</a>
	</div>
</footer>
