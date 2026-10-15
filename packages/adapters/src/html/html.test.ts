import { describe, expect, it } from 'vitest';
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
