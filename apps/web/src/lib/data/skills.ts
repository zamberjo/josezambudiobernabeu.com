import type { T } from '../i18n.svelte';
import data from './skills.json';

export type Skill = {
	name: string;
	/** 0–100. Drives how far the meter fills as the section scrolls past. */
	level: number;
	/** Accent-coloured meter instead of ink; use it for the headline skills. */
	accent: boolean;
	detail: T;
};

export const skills: Skill[] = data.skills;
