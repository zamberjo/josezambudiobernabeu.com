# JoseZambudioBernabeu.com

Personal portfolio. SvelteKit + Tailwind, built as a static site and served from Firebase Hosting.
Content lives in Supabase and is edited from a local backoffice; the site reads it **at build
time**, so visitors get plain prerendered HTML and never talk to the database.

```
apps/backoffice ──ContentCommands──▶ Supabase ◀──PortfolioReader── CI: build apps/web ──▶ Firebase
       └──────── PublishTrigger (repository_dispatch) ──────────────▲
```

## Layout

A pnpm monorepo organised as ports and adapters:

| Package                | Role                                                                  |
| ---------------------- | --------------------------------------------------------------------- |
| `packages/domain`      | Valibot schemas (types are inferred from them), rules, pure selectors |
| `packages/application` | Ports (function types) and curried use cases returning `Result`       |
| `packages/adapters`    | JSON, Supabase, GitHub and in-memory implementations of the ports     |
| `apps/web`             | The public site; its composition root runs only while prerendering    |
| `apps/backoffice`      | Local-only editor (SvelteKit + adapter-node)                          |
| `supabase/`            | Migrations, config and seeds for the content database                 |
| `content/`             | `portfolio.json`: the content snapshot (seed source and test fixture) |

## Development

```bash
pnpm install
pnpm dev                 # the site, from content/portfolio.json
pnpm test:unit           # domain, use cases, adapters (Vitest)
pnpm test                # the site's Playwright suite, against a production build
```

### With the database

```bash
pnpm db:start            # supabase start (Docker); ports 544xx, see supabase/config.toml
pnpm build:local         # build the site from the local database instead of the snapshot
pnpm test:db             # adapter integration tests against the local stack
```

`pnpm db:reset` recreates the local database from the migrations and `supabase/seeds/`.

### Backoffice

```bash
cp apps/backoffice/.env.example apps/backoffice/.env   # fill in from `supabase status`
pnpm backoffice          # http://localhost:5174
```

Locally, sign in as `admin@josezambudiobernabeu.local` / `admin-local` (seeded by
`supabase/seeds/00_local_admin.sql`). Saving writes to Supabase; **Publish** validates the whole
content and triggers the deploy workflow, which needs `GITHUB_TOKEN` in the backoffice's `.env`.
`pnpm --filter backoffice test` drives it end to end on its own port (5184), always against the
local stack and without a GitHub token, so it never touches production or deploys.

### Previewing before publishing

```bash
pnpm preview:content     # the site on :5173, reading the database in apps/backoffice/.env
pnpm dev:local           # the same, but always against the local stack
```

Both run the site in dev mode, where the page's content is loaded on every request: save in the
backoffice, reload the preview, and the change is there. Nothing is built or deployed until you
press **Publish**. For a check of the exact production output, `pnpm build:local && pnpm preview`
prerenders from the local database and serves the result.

## Content

Every visible string, interface labels included, is a `{ "es": …, "en": … }` pair. In the database
it is a `jsonb` column checked by `is_localized()`; in code it is the domain's `Localized` type.

- **Editing** happens in the backoffice. Its forms are field descriptors in
  `apps/backoffice/src/lib/forms.ts`.
- **The snapshot** `content/portfolio.json` is what the tests and PR previews build from.
  `pnpm content:export` refreshes it from the database, and `pnpm content:seed` regenerates
  `supabase/seeds/10_content.sql` from it.
- **Blog posts** have an HTML body per language, written in the backoffice's WYSIWYG editor
  (Tiptap). Its **HTML** button edits the source directly, so any markup can go in, and an
  article the visual editor cannot represent, such as one with a table, opens in HTML mode rather
  than losing it. At build time `packages/adapters/src/html` sanitises the body against an
  allow-list and numbers every `<h2>`, which also builds the reader's side index. The reading time is derived per language from the word count
  (`readingMinutes`, 220 words a minute), so it is never typed and never stale. The opening
  paragraph reads as the lede, and the newest published post becomes the featured card.
- **Every readable post has its own URL**, `/blog/<slug>`, prerendered with its canonical link,
  Open Graph card and `BlogPosting` structured data, and listed in `/sitemap.xml` once published.
  Drafts with a body also get a page, for sharing a preview, but with `noindex`. On the home page
  a card opens the reader over the page at that same URL.
- **An empty blog** hides the whole Blog section, along with its nav entry and footer column, and
  the other sections renumber themselves.

The article typography lives in `apps/web/src/app.css` under `.article`. To allow a new tag in
articles, add it to the renderer's allow-list and give it a style there.

## Images

Every image the site shows should be an optimised set: WebP at 640, 960, 1280 and 1920 px wide,
named `<stem>-<width>w.webp`. The stored URL is always the widest, and the site derives the
`srcset` from it (`srcsetFor` in `packages/domain`), so the browser downloads the size the screen
needs.

- **Through the backoffice** (Media): uploads are optimised automatically with `sharp` before
  they reach Supabase Storage. Copy the URL it shows.
- **Committed to the repo** (`apps/web/static/assets/blog/`): drop the PNG/JPEG in and run
  `pnpm images:optimize`, which writes the variants and removes the original. CI runs
  `pnpm images:check` and fails if an unoptimised PNG/JPEG over 200 KB is left behind.

The cover on a post's own page is its Largest Contentful Paint, so it loads eagerly with
`fetchpriority="high"`; every other image is lazy.

## Performance and SEO checks

```bash
pnpm lighthouse          # production build, every page, 3 runs each; reports in .lighthouseci/
```

Lighthouse CI audits the **production build**. A Lighthouse run against `pnpm dev` or
`pnpm preview:content` is not representative: the dev server ships unbundled modules and renders on
every request, which is where "Duplicated JavaScript", a deep network dependency tree and slow
document latency come from. Budgets live in `lighthouserc.cjs` (every category ≥ 90, CLS ≤ 0.1),
and the `lighthouse` job enforces them on each pull request. A draft post's page reports "Page is
blocked from indexing" on purpose (`noindex`); it goes away once the post is published.

## Deploy

Pushing to `master`, running the workflow by hand, or pressing **Publish** in the backoffice
(`repository_dispatch: content-published`) runs `.github/workflows/deploy.yaml`. The workflow needs
these repository secrets:

| Secret                                          | Purpose                                        |
| ----------------------------------------------- | ---------------------------------------------- |
| `FIREBASE_SERVICE_ACCOUNT_JOSEZAMBUDIOBERNABEU` | Service-account JSON, Firebase Hosting Admin   |
| `SUPABASE_URL`                                  | The project URL                                |
| `SUPABASE_PUBLISHABLE_KEY`                      | Publishable/anon key; it can only read `api.*` |

Until `SUPABASE_URL` exists, the build falls back to the committed snapshot.

### First-time Supabase setup

1. **Schema and policies.** `supabase db push` applies `supabase/migrations`:

   ```bash
   supabase link --project-ref <ref>
   supabase db push
   ```

2. **Expose the `api` schema.** In the dashboard, go to _Project Settings → Data API → Exposed
   schemas_ and add `api`, keeping `public` and `graphql_public`. Locally `supabase/config.toml`
   does this, but it is a project setting, not part of the database, so `db push` does not carry
   it. Without it every read fails with `Invalid schema: api`.

3. **Content, once.** The migrations create empty tables. Load the snapshot either by pasting
   `supabase/seeds/10_content.sql` into the _SQL Editor_, or with the connection string from
   _Connect_:

   ```bash
   psql "$REMOTE_DB_URL" -f supabase/seeds/10_content.sql
   ```

   Run it only once: a second run fails on the unique keys. Until it has run, reads fail with
   `site.meta: Invalid key: Expected "meta" but received undefined` (and the same for every
   section), and the backoffice refuses to publish.

4. **An editor.** Sign-ups are disabled, so create your user by hand under _Authentication → Users
   → Add user_, with _Auto Confirm User_ checked. Then grant it write access in the SQL Editor:

   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
   ```

5. **Point the backoffice at it.** In `apps/backoffice/.env`, set `SUPABASE_URL` and
   `SUPABASE_PUBLISHABLE_KEY` from _Project Settings → API Keys_.

To deploy by hand:

```bash
CONTENT_SOURCE=supabase SUPABASE_URL=… SUPABASE_PUBLISHABLE_KEY=… pnpm build
npx -y firebase-tools deploy --only hosting
```

### Previous Versions

- [React version](https://github.com/zamberjo/josezambudiobernabeu.com/tree/react)
