import type { T } from '../i18n.svelte';

/**
 * The page copy that is fixed furniture, in the order the sections appear.
 * The three content-managed sections live in their own JSON files instead:
 * blog.json, skills.json and projects.json.
 */

export const social = [
	{ label: 'GitHub', href: 'https://github.com/zamberjo?tab=contributions&period=monthly' },
	{ label: 'Twitter', href: 'https://twitter.com/Zamberjo' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/zamberjo' }
];

export const nav: { href: string; label: T }[] = [
	{ href: '#sobre-mi', label: { es: 'Sobre mí', en: 'About' } },
	{ href: '#blog', label: { es: 'Blog', en: 'Blog' } },
	{ href: '#experiencia', label: { es: 'Experiencia', en: 'Experience' } },
	{ href: '#skills', label: { es: 'Skills', en: 'Skills' } },
	{ href: '#estudios', label: { es: 'Estudios', en: 'Education' } },
	{ href: '#projects', label: { es: 'Side Projects', en: 'Side Projects' } }
];

export const hero = {
	/** Cycled through in place by the display heading. */
	names: ['JZB', 'ZamBerJo', 'Zambu'],
	kicker: { es: 'Desarrollador · Alcoi', en: 'Developer · Alcoi, Spain' } satisfies T,
	tagline: {
		es: 'Informático en busca de una idea que os revolucione la vida (y me cubra de oro)',
		en: 'A computer guy looking for an idea that will revolutionise your life (and cover me in gold)'
	} satisfies T
};

export const about = {
	path: '/Users/zambu/Documents/helloWorld/',
	command: '$ cat myPresentation.txt',
	paragraphs: [
		{
			es: 'Odoo senior developer con experiencia en multitud de sectores, pequeñas como grandes empresas, abarcando campos como Ventas, Compras, CRM, MRP, Almacén...',
			en: 'Senior Odoo developer with experience across many sectors, in both small and large companies, covering areas such as Sales, Purchasing, CRM, MRP, Inventory...'
		},
		{
			es: 'Experiencia en Python, PostgreSQL, Linux, Docker, Javascript (ES6). Siempre dispuesto a afrontar nuevos retos y a aprender nuevas tecnologías que me hagan crecer profesionalmente.',
			en: 'Experience in Python, PostgreSQL, Linux, Docker, Javascript (ES6). Always ready to take on new challenges and learn new technologies that help me grow professionally.'
		},
		{
			es: 'A lo largo de mi vida laboral me he dedicado tanto a frontend, como backend, habiéndome centrado los últimos años en backend pero sin perder nunca la mirada al resto de frameworks.',
			en: 'Throughout my working life I have worked on both frontend and backend, focusing on backend in recent years but never losing sight of the rest of the frameworks.'
		}
	] satisfies T[],
	degree: {
		es: 'Ingeniero Técnico en Sistemas (plan 2001) en la Universidad de Alicante.',
		en: 'Technical Engineer in Computer Systems (2001 curriculum), University of Alicante.'
	} satisfies T
};

export const blog = {
	intro: {
		es: 'Artículos, ideas y proyectos que voy implementando.',
		en: 'Articles, ideas and projects as I build them.'
	} satisfies T
};

export const experience: { period: T; role: string; summary: T }[] = [
	{
		period: { es: 'Actualidad', en: 'Present' },
		role: 'Odoo senior developer',
		summary: {
			es: 'Experiencia en multitud de sectores, pequeñas como grandes empresas, abarcando campos como Ventas, Compras, CRM, MRP, Almacén...',
			en: 'Experience across many sectors, in small and large companies, covering Sales, Purchasing, CRM, MRP, Inventory...'
		}
	},
	{
		period: { es: 'Últimos años', en: 'Recent years' },
		role: 'Backend',
		summary: {
			es: 'Centrado en backend pero sin perder nunca la mirada al resto de frameworks. Python, PostgreSQL, Linux, Docker.',
			en: 'Focused on backend but never losing sight of the rest of the frameworks. Python, PostgreSQL, Linux, Docker.'
		}
	},
	{
		period: { es: 'Trayectoria', en: 'Career' },
		role: 'Frontend & backend',
		summary: {
			es: 'A lo largo de mi vida laboral me he dedicado tanto a frontend como a backend. Javascript (ES6).',
			en: 'Throughout my working life I have worked on both frontend and backend. Javascript (ES6).'
		}
	}
];

export const education = {
	degree: {
		es: 'Ingeniero Técnico en Sistemas (plan 2001)',
		en: 'Technical Engineer in Computer Systems (2001 curriculum)'
	} satisfies T,
	school: 'Universidad de Alicante'
};

export const quote = {
	text: '“Talk is cheap. Show me the code.”',
	author: 'Linus Torvalds'
};

export const footer = {
	brand: 'Zambu',
	blurb: {
		es: 'Odoo senior developer. Alcoi, Alicante.',
		en: 'Senior Odoo developer. Alcoi, Alicante, Spain.'
	} satisfies T,
	blogLink: { es: 'Últimos artículos', en: 'Latest posts' } satisfies T,
	site: 'JoseZambudioBernabeu.com',
	siteUrl: 'https://josezambudiobernabeu.com/'
};
