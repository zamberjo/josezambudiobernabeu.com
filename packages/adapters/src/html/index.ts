import type { ArticleRenderer, OutlineEntry } from '@jzb/domain';
import { getElementsByTagName, textContent } from 'domutils';
import { parseDocument } from 'htmlparser2';
import sanitizeHtml from 'sanitize-html';

/*
 * The article renderer: runs at build time only, so the parser never ships to
 * the browser. It is the last gate before stored HTML becomes page markup,
 * which is why it allow-lists rather than strips: anything not named here
 * (scripts, event handlers, styles, iframes, javascript: URLs) is dropped,
 * even though only admins can write posts.
 */

const pad2 = (n: number) => String(n).padStart(2, '0');

const OPTIONS: sanitizeHtml.IOptions = {
	allowedTags: [
		'p',
		'br',
		'hr',
		'h2',
		'h3',
		'h4',
		'strong',
		'b',
		'em',
		'i',
		'u',
		's',
		'mark',
		'sub',
		'sup',
		'code',
		'a',
		'ul',
		'ol',
		'li',
		'blockquote',
		'pre',
		'img',
		'figure',
		'figcaption',
		'table',
		'thead',
		'tbody',
		'tr',
		'th',
		'td'
	],
	allowedAttributes: {
		a: ['href', 'title', 'target', 'rel'],
		img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
		code: ['class'],
		th: ['colspan', 'rowspan'],
		td: ['colspan', 'rowspan'],
		ol: ['start']
	},
	allowedClasses: { code: [/^language-[\w-]+$/] },
	allowedSchemes: ['http', 'https', 'mailto'],
	allowedSchemesByTag: { img: ['http', 'https'] },
	allowProtocolRelative: false
};

/**
 * Sanitises an article and numbers its `<h2>`s: each gets `id="post-NN"`, the
 * anchor the reader's side index links to, and an "01 — " prefix, added here
 * rather than stored, so the saved text stays clean. An `<h1>`
 * is demoted, since the post title is the page's heading.
 */
export const sanitizingArticleRenderer: ArticleRenderer = (source) => {
	const clean = sanitizeHtml(source, {
		...OPTIONS,
		transformTags: {
			h1: 'h2',
			a: (_tagName, attribs) => ({
				tagName: 'a',
				attribs: attribs.target === '_blank' ? { ...attribs, rel: 'noopener noreferrer' } : attribs
			}),
			img: (_tagName, attribs) => ({ tagName: 'img', attribs: { loading: 'lazy', ...attribs } })
		}
	});

	// The index comes from the clean markup, before any numbering is added.
	const outline: OutlineEntry[] = getElementsByTagName('h2', parseDocument(clean).children).map(
		(heading, i) => ({
			id: `post-${pad2(i + 1)}`,
			number: pad2(i + 1),
			text: textContent(heading).trim()
		})
	);

	// Second pass over markup that is already safe: everything is allowed
	// through, and the only change is on each h2, in order: an anchor id and
	// its "01 — " prefix as real text, so the number is part of the heading's
	// accessible name exactly as the side index shows it.
	let headings = 0;
	let prefix: string | null = null;
	const html = sanitizeHtml(clean, {
		allowedTags: false,
		allowedAttributes: false,
		allowedSchemes: OPTIONS.allowedSchemes,
		transformTags: {
			'*': (tagName, attribs) => {
				if (tagName !== 'h2') {
					prefix = null;
					return { tagName, attribs };
				}
				const number = pad2(++headings);
				prefix = `${number} — `;
				return { tagName, attribs: { ...attribs, id: `post-${number}` } };
			}
		},
		textFilter: (text) => {
			if (prefix === null) return text;
			const withPrefix = prefix + text;
			prefix = null;
			return withPrefix;
		}
	});

	return { html, outline };
};
