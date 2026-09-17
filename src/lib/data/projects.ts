import type { T } from '../i18n.svelte';
import data from './projects.json';

export type Project = {
	name: string;
	/** Featured projects lead the grid; the rest keep file order behind them. */
	featured: boolean;
	projectUrl: string;
	productionUrl: string | null;
	tecnologies: string[];
	description: T;
};

const all = data.projects as Project[];

/** Shared by the Side Projects grid and the footer's project column. */
export const projects: Project[] = [
	...all.filter((project) => project.featured),
	...all.filter((project) => !project.featured)
];
