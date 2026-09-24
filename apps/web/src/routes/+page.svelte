<script lang="ts">
	import { lang, t } from '$lib/i18n.svelte';
	import { motionRoot } from '$lib/motion.svelte';
	import { hasPosts } from '$lib/data/blog';
	import About from '$lib/components/About.svelte';
	import Blog from '$lib/components/Blog.svelte';
	import CodeLoop from '$lib/components/CodeLoop.svelte';
	import Education from '$lib/components/Education.svelte';
	import ExperienceTimeline from '$lib/components/ExperienceTimeline.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Quote from '$lib/components/Quote.svelte';
	import SideProjects from '$lib/components/SideProjects.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import SiteNav from '$lib/components/SiteNav.svelte';
	import SkillsGrid from '$lib/components/SkillsGrid.svelte';

	$effect(() => lang.restore());

	// The bands are numbered by what actually renders, so dropping a section
	// never leaves a hole in the sequence. Blog is the only optional one: with
	// no posts written it disappears, and SiteNav and SiteFooter drop their
	// links to it.
	const bands = ['sobre-mi', hasPosts && 'blog', 'experiencia', 'skills', 'estudios', 'projects']
		.filter((id): id is string => id !== false);
	const band = (id: string) => String(bands.indexOf(id) + 1).padStart(2, '0');

	const description = {
		es: 'Jose Zambudio Bernabeu — Odoo senior developer en Alcoi. Python, PostgreSQL, Linux y Docker.',
		en: 'Jose Zambudio Bernabeu — senior Odoo developer in Alcoi, Spain. Python, PostgreSQL, Linux and Docker.'
	};
</script>

<svelte:head>
	<title>Jose Zambudio Bernabeu</title>
	<meta name="description" content={t(description)} />
	<meta name="theme-color" content="#ec3013" />
</svelte:head>

<!-- The single motion root: it carries the scroll-velocity --skew and --squash
     that individual elements read in their own transforms. -->
<div use:motionRoot class="overflow-x-clip bg-bg">
	<SiteNav />
	<main>
		<Hero />
		<CodeLoop />
		<About number={band('sobre-mi')} />
		{#if hasPosts}
			<Blog number={band('blog')} />
		{/if}
		<ExperienceTimeline number={band('experiencia')} />
		<SkillsGrid number={band('skills')} />
		<Education number={band('estudios')} />
		<Quote />
		<SideProjects number={band('projects')} />
	</main>
	<SiteFooter />
</div>
