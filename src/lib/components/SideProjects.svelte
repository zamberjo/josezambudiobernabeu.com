<script lang="ts">
	import { t } from '../i18n.svelte';
	import { magnetic } from '../motion.svelte';
	import { projects } from '../data/projects';
	import SectionHeading from './SectionHeading.svelte';
</script>

<section id="projects" class="overflow-clip border-b-2 border-ink px-gutter py-band">
	<SectionHeading number="06" title="Side Projects" />

	<div class="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-0.5">
		{#each projects as project, i (project.name)}
			<div class="reveal-up">
				<a
					use:magnetic={16}
					href={project.projectUrl}
					target="_blank"
					rel="noopener noreferrer"
					title={t(project.description)}
					class="magnet-skew group block h-full bg-bg p-[clamp(24px,3vw,40px)] text-ink shadow-[0_0_0_1px_var(--color-divider)] hover:bg-accent hover:text-white"
				>
					<div
						class="text-xs font-bold tracking-[0.18em] text-accent-700 group-hover:text-white"
					>
						{String(i + 1).padStart(2, '0')}
					</div>
					<!-- Long slugs (the domain, the bot) get a step down and are allowed to
					     break anywhere, so no card title overflows its box. -->
					<div
						class="mt-[clamp(40px,8vw,90px)] leading-[1.05] font-black tracking-[-0.02em] {project
							.name.length > 16
							? 'text-[clamp(20px,2.1vw,28px)] [overflow-wrap:anywhere]'
							: 'text-[clamp(22px,2.4vw,32px)]'}"
					>
						{project.name}
					</div>
				</a>
			</div>
		{/each}
	</div>
</section>
