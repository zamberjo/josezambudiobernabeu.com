<script lang="ts">
	import { LOCALES, type Localized } from '@jzb/domain';

	interface Props {
		value: Localized;
		multiline?: boolean;
		/** Accessible name prefix, e.g. "Título" → "Título (es)". */
		label: string;
	}

	let { value = $bindable(), multiline = false, label }: Props = $props();
</script>

<!-- Both languages side by side, so a translation is never forgotten. -->
<div class="localized">
	{#each LOCALES as lang (lang)}
		<label class="lang">
			<span class="lang-code">{lang}</span>
			{#if multiline}
				<textarea rows="3" bind:value={value[lang]} aria-label="{label} ({lang})"></textarea>
			{:else}
				<input type="text" bind:value={value[lang]} aria-label="{label} ({lang})" />
			{/if}
		</label>
	{/each}
</div>
