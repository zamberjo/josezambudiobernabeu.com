<script lang="ts">
	import { lang, t } from '$lib/i18n.svelte';
	import { motionRoot } from '$lib/motion.svelte';
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
		<About />
		<Blog />
		<ExperienceTimeline />
		<SkillsGrid />
		<Education />
		<Quote />
		<SideProjects />
	</main>
	<SiteFooter />
</div>
