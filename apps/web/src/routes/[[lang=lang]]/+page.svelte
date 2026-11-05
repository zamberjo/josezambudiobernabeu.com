<script lang="ts">
	import { alternatePaths, localePath } from '@jzb/domain';
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
	import Seo from '$lib/components/Seo.svelte';

	let { data } = $props();


	// Everything below is the read model built at prerender time: which bands
	// exist and their numbers (Blog disappears with no posts, and the rest
	// renumber around it), project order, the featured post. This page only
	// hands each section its slice.
	const view = $derived(data.view);
	const site = $derived(view.site);
	const ui = $derived(site.ui);
	const band = (id: keyof typeof view.bands) => view.bands[id] ?? '';
	const origin = $derived(site.footer.siteUrl);
	const absolute = (path: string) => new URL(path, origin).href;
</script>

<Seo
	title="Jose Zambudio Bernabeu"
	description={t(site.meta.description)}
	url={absolute(localePath(lang.current, '/'))}
	alternates={alternatePaths('/')}
	locale={lang.current}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Jose Zambudio Bernabeu',
		url: site.footer.siteUrl,
		jobTitle: 'Odoo senior developer',
		sameAs: site.social.links.map((link) => link.href)
	}}
/>

<!-- The single motion root: it carries the scroll-velocity --skew and --squash
     that individual elements read in their own transforms. -->
<div use:motionRoot class="overflow-x-clip bg-bg">
	<SiteNav links={view.nav} />
	<main>
		<Hero hero={site.hero} social={site.social.links} />
		<CodeLoop />
		<About number={band('sobre-mi')} about={site.about} {ui} />
		{#if view.blog}
			<Blog
				number={band('blog')}
				blog={view.blog}
				intro={site.blog.intro}
				site={site.footer.site}
				{ui}
			/>
		{/if}
		<ExperienceTimeline
			number={band('experiencia')}
			title={ui.experienceTitle}
			experience={view.experience}
		/>
		<SkillsGrid number={band('skills')} title={ui.skillsTitle} skills={view.skills} />
		<Education number={band('estudios')} title={ui.educationTitle} education={site.education} />
		<Quote quote={site.quote} />
		<SideProjects number={band('projects')} title={ui.projectsTitle} projects={view.projects} />
	</main>
	<SiteFooter
		footer={site.footer}
		social={site.social.links}
		projects={view.projects}
		hasPosts={view.blog !== null}
	/>
</div>
