import { describe, expect, it, vi } from 'vitest';
import { githubPublishTrigger } from './index.ts';

describe('github publish trigger', () => {
	it('posts a repository dispatch', async () => {
		const fetch = vi.fn(async () => new Response(null, { status: 204 }));
		const publish = githubPublishTrigger({ token: 't', repository: 'me/site', fetch });
		expect((await publish()).ok).toBe(true);
		expect(fetch).toHaveBeenCalledWith(
			'https://api.github.com/repos/me/site/dispatches',
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({ event_type: 'content-published' })
			})
		);
	});

	it('reports GitHub refusing as unavailable, with its answer', async () => {
		const fetch = vi.fn(async () => new Response('Bad credentials', { status: 401 }));
		const result = await githubPublishTrigger({ token: 't', repository: 'me/site', fetch })();
		expect(result).toEqual({
			ok: false,
			error: { kind: 'unavailable', message: 'GitHub answered 401: Bad credentials' }
		});
	});

	it('does not call out without a token', async () => {
		const fetch = vi.fn();
		const result = await githubPublishTrigger({ token: undefined, repository: 'me/site', fetch })();
		expect(result.ok).toBe(false);
		expect(fetch).not.toHaveBeenCalled();
	});
});
