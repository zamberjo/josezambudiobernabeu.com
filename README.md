# JoseZambudioBernabeu.com

Personal portfolio. SvelteKit + Tailwind, built as a static site and served from Firebase Hosting.
Content lives in Supabase and is edited from a local backoffice; the site reads it **at build
time**, so visitors get plain prerendered HTML and never talk to the database
([ADR 0005](docs/adr/0005-supabase-leido-en-build-con-puertos-y-adaptadores.md)).

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
`pnpm --filter backoffice test` drives it end to end.

## Content

Every visible string, interface labels included, is a `{ "es": …, "en": … }` pair. In the database
it is a `jsonb` column checked by `is_localized()`; in code it is the domain's `Localized` type.

- **Editing** happens in the backoffice. Its forms are field descriptors in
  `apps/backoffice/src/lib/forms.ts`.
- **The snapshot** `content/portfolio.json` is what the tests and PR previews build from.
  `pnpm content:export` refreshes it from the database, and `pnpm content:seed` regenerates
  `supabase/seeds/10_content.sql` from it.
- **Blog posts** are arrays of typed blocks: `lede`, `heading`, `paragraph`, `quote`, `list`, `code`
  and `image`. Headings are numbered automatically and build the reader's side index. The newest
  published post becomes the featured card.
- **An empty blog** hides the whole Blog section, along with its nav entry and footer column, and
  the other sections renumber themselves.

Adding a block kind touches three places: `BlockSchema` in `packages/domain`,
`post_body_schema()` in a new migration, and a branch in `BlogReader.svelte` and `BlockEditor.svelte`.

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

```bash
supabase link --project-ref <ref>
supabase db push                                      # apply supabase/migrations
psql "$REMOTE_DB_URL" -f supabase/seeds/10_content.sql # load the current content once
```

Then create your user in the dashboard (Authentication → Users) and make it an editor:
`insert into public.admins (user_id) values ('<uuid>');`.

To deploy by hand:

```bash
CONTENT_SOURCE=supabase SUPABASE_URL=… SUPABASE_PUBLISHABLE_KEY=… pnpm build
npx -y firebase-tools deploy --only hosting
```

### Previous Versions

- [React version](https://github.com/zamberjo/josezambudiobernabeu.com/tree/react)
