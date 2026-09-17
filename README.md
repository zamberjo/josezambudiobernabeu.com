# JoseZambudioBernabeu.com

Personal portfolio. SvelteKit + Tailwind, built as a static site and served from Firebase Hosting.

## Development

```bash
pnpm install
pnpm dev
```

## Content

The sections that change often are plain JSON in `src/lib/data/`, so editing the site
means editing a file, not a component. Every visible string is a `{ "es": …, "en": … }` pair.

| File            | Feeds                                                  |
| --------------- | ------------------------------------------------------ |
| `blog.json`     | The blog section and the reader overlay                |
| `skills.json`   | The skills meters                                      |
| `projects.json` | The Side Projects grid and the footer's project column |

### Adding a blog post

Append an entry to `posts` in `blog.json`. The newest `"status": "published"` post becomes the
featured card; the rest fall into the grid below. A post whose `body` is empty shows as a draft card
and does not open the reader.

```json
{
	"slug": "mi-articulo",
	"status": "published",
	"date": "2026-10-01",
	"readingTime": 6,
	"cover": "/assets/img/blog/mi-articulo.png",
	"tags": ["Odoo", "Python"],
	"title": { "es": "…", "en": "…" },
	"excerpt": { "es": "…", "en": "…" },
	"body": [
		{ "type": "lede", "text": { "es": "…", "en": "…" } },
		{ "type": "heading", "text": { "es": "El problema", "en": "The problem" } },
		{ "type": "paragraph", "text": { "es": "…", "en": "…" } },
		{ "type": "list", "items": [{ "es": "…", "en": "…" }] },
		{ "type": "quote", "text": { "es": "…", "en": "…" } },
		{ "type": "code", "code": "$ docker compose up -d", "comment": { "es": "…", "en": "…" } },
		{ "type": "image", "src": "/assets/img/blog/x.png", "caption": { "es": "…", "en": "…" } }
	]
}
```

`heading` blocks are numbered automatically and build the reader's side index.

## Deploy

Pushing to `master` builds and deploys through `.github/workflows/deploy.yaml`. It needs a
`FIREBASE_SERVICE_ACCOUNT_JOSEZAMBUDIOBERNABEU` repository secret holding a service-account JSON with the Firebase
Hosting Admin role:

```bash
firebase init hosting:github   # generates the secret and wires up the repo
```

To deploy by hand:

```bash
pnpm build
npx -y firebase-tools deploy --only hosting
```

### Previous Versions

- [React version](https://github.com/zamberjo/josezambudiobernabeu.com/tree/react)
