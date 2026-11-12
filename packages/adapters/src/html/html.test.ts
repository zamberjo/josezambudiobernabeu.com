import { describe, expect, it, vi } from 'vitest';
import { sanitizingArticleRenderer as render } from './index.ts';

describe('article renderer', () => {
	it('keeps the formatting an editor produces', () => {
		const source =
			'<p>Hola <strong>mundo</strong> y <a href="https://x.dev">un enlace</a></p><ul><li>uno</li></ul><pre><code class="language-py">print(1)</code></pre>';
		expect(render(source).html).toBe(source);
	});

	it('drops scripts, handlers, styles and javascript: URLs', () => {
		const { html } = render(
			'<p onclick="x()" style="color:red">a</p><script>alert(1)</script><a href="javascript:alert(1)">b</a><iframe src="https://evil"></iframe>'
		);
		expect(html).toBe('<p>a</p><a>b</a>');
	});

	it('numbers the h2s, as anchors and as text, and indexes them', () => {
		const { html, outline } = render(
			'<h1>Intro</h1><p>x</p><h2>El <em>problema</em></h2><h3>detalle</h3>'
		);
		expect(html).toContain('<h2 id="post-01">01 — Intro</h2>');
		expect(html).toContain('<h2 id="post-02">02 — El <em>problema</em></h2>');
		expect(outline).toEqual([
			{ id: 'post-01', number: '01', text: 'Intro' },
			{ id: 'post-02', number: '02', text: 'El problema' }
		]);
	});

	it('counts the words a reader reads, not the markup', () => {
		expect(
			render('<h2>Dos palabras</h2><p>y <strong>tres</strong> más</p><script>x y z</script>').words
		).toBe(5);
	});

	it('gives optimised images their srcset, ignoring any the author typed', () => {
		const { html } = render('<img src="/assets/blog/a-1920w.webp" srcset="evil.png 1x" alt="a">');
		expect(html).toContain(
			'srcset="/assets/blog/a-640w.webp 640w, /assets/blog/a-960w.webp 960w, /assets/blog/a-1280w.webp 1280w, /assets/blog/a-1920w.webp 1920w"'
		);
		expect(html).not.toContain('evil.png');
	});

	it('renders without sanitize-html warning about vulnerable tags', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		render('<h2>Uno</h2><p>Texto <code class="language-ts">x</code></p><img src="/a.png" alt="">');
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it('restarts the numbering for every article', () => {
		render('<h2>a</h2><h2>b</h2>');
		expect(render('<h2>c</h2>').outline[0]?.id).toBe('post-01');
	});

	it('hardens links that open a new tab and lazy-loads images', () => {
		const { html } = render(
			'<a href="https://x.dev" target="_blank">x</a><img src="https://cdn.dev/a.png" alt="a">'
		);
		expect(html).toContain('rel="noopener noreferrer"');
		expect(html).toContain('loading="lazy"');
	});
});
