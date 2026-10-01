import type { PublishTrigger } from '@jzb/application';
import { err, ok } from '@jzb/domain';

export type GithubPublishOptions = {
	/** A token allowed to create repository dispatches (fine-grained: Contents read & write). */
	token: string | undefined;
	/** `owner/name`. */
	repository: string;
	/** Must match `on.repository_dispatch.types` in .github/workflows/deploy.yaml. */
	eventType?: string;
	/** Injected so tests never hit the network. */
	fetch?: typeof globalThis.fetch;
};

export const CONTENT_PUBLISHED = 'content-published';

/** Publishing is a `repository_dispatch`: the deploy workflow rebuilds from the database. */
export const githubPublishTrigger =
	({
		token,
		repository,
		eventType = CONTENT_PUBLISHED,
		fetch = globalThis.fetch
	}: GithubPublishOptions): PublishTrigger =>
	async () => {
		if (!token) return err({ kind: 'unavailable', message: 'GITHUB_TOKEN is not set' });
		try {
			const response = await fetch(`https://api.github.com/repos/${repository}/dispatches`, {
				method: 'POST',
				headers: {
					Accept: 'application/vnd.github+json',
					Authorization: `Bearer ${token}`,
					'X-GitHub-Api-Version': '2022-11-28'
				},
				body: JSON.stringify({ event_type: eventType })
			});
			return response.status === 204
				? ok(undefined)
				: err({
						kind: 'unavailable',
						message: `GitHub answered ${response.status}: ${await response.text()}`
					});
		} catch (cause) {
			return err({ kind: 'unavailable', message: `Could not reach GitHub: ${String(cause)}` });
		}
	};
