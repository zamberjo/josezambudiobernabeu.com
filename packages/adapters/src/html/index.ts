import { srcsetFor, type ArticleRenderer, type OutlineEntry } from '@jzb/domain';
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
		img: ['src', 'srcset', 'sizes', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
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
			// Optimised uploads get their responsive siblings; the article column is
			// at most ~700px wide, so phones take 640w and desktops 1280w.
			img: (_tagName, { srcset: _ignored, ...attribs }) => {
				const srcset = attribs.src ? srcsetFor(attribs.src) : undefined;
				return {
					tagName: 'img',
					attribs: {
						loading: 'lazy',
						decoding: 'async',
						...attribs,
						...(srcset && { srcset, sizes: '(min-width: 1024px) 700px, 100vw' })
					}
				};
			}
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

	// Second pass, with the same allow-list plus the id it adds: the only change
	// is on each h2, in order, an anchor id and its "01 — " prefix as real text,
	// so the number is part of the heading's accessible name exactly as the side
	// index shows it. Re-applying the list leaves the clean markup as it is.
	let headings = 0;
	let prefix: string | null = null;
	const html = sanitizeHtml(clean, {
		...OPTIONS,
		allowedAttributes: { ...OPTIONS.allowedAttributes, h2: ['id'] },
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

	// Counted on the clean markup with every tag as a space, so adjacent blocks
	// ("…fin</h2><p>Otro…") never fuse into one word.
	const words = clean
		.replace(/<[^>]*>/g, ' ')
		.split(/\s+/)
		.filter(Boolean).length;

	return { html, outline, words };
};
