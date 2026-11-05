# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

A pnpm monorepo (`pnpm-workspace.yaml`: `apps/*`, `packages/*`). The project uses **pnpm**; there is
no npm lockfile, so `npm ci` will not work. Root scripts delegate to the packages:

```bash
pnpm dev                    # the site (apps/web), content from content/portfolio.json
pnpm build                  # static build into apps/web/build
pnpm check                  # tsc for packages/*, svelte-check for both apps
pnpm lint                   # prettier --check && eslint, whole repo
pnpm format                 # prettier --write
pnpm test                   # the site's Playwright suite; builds and previews on :3000 first
pnpm test:unit              # Vitest: domain, application, adapters
pnpm --filter web exec playwright test tests/page.spec.ts -g "blog reader"   # one test

pnpm db:start               # supabase start; this project uses ports 544xx
pnpm db:reset               # migrations + supabase/seeds/*.sql
pnpm test:db                # adapter integration tests against the local stack
pnpm build:local            # build the site from the local database
pnpm preview:content        # site dev server reading the backoffice's DB: preview before publishing
pnpm dev:local              # site dev server reading the local stack
pnpm backoffice             # the local editor on :5174 (needs apps/backoffice/.env)
pnpm --filter backoffice test   # backoffice e2e on :5184, local DB only; db:reset afterwards
pnpm content:seed           # content/portfolio.json → supabase/seeds/10_content.sql
pnpm content:export         # database → content/portfolio.json
pnpm db:types               # regenerate packages/adapters/src/supabase/database.types.ts
pnpm images:optimize        # PNG/JPEG in apps/web/static/assets/blog → responsive WebP set
pnpm images:check           # CI: fails on unoptimised PNG/JPEG over 200 KB
pnpm lighthouse             # Lighthouse CI on the production build (budgets: lighthouserc.cjs)
```

Deploy by hand: `CONTENT_SOURCE=supabase SUPABASE_URL=… SUPABASE_PUBLISHABLE_KEY=… pnpm build`, then
`npx -y firebase-tools deploy --only hosting` (`firebase.json` points at `apps/web/build`).

CI: `lint.yaml` runs on pull requests: lint, check and unit tests; the Playwright suite (its HTML
report is uploaded when it fails); and Lighthouse. `deploy.yaml` runs on push to `master`,
`workflow_dispatch` and `repository_dispatch: content-published` (the backoffice's Publish
button). It checks, runs the unit tests and the Playwright suite as a gate, builds, and deploys to
Firebase Hosting. Playwright always builds from the snapshot (`webServer.env` in
`apps/web/playwright.config.ts`), so the specs test the code whatever the content source. It builds
from Supabase when the `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` secrets exist, and from the
snapshot otherwise. It also needs `FIREBASE_SERVICE_ACCOUNT_JOSEZAMBUDIOBERNABEU`. PR previews
(`firebase-hosting-pull-request.yml`) always build from the snapshot. `renovate.yaml` runs
self-hosted Renovate on Thursdays at 17:00 Europe/Madrid with `renovate.json` (needs the
`RENOVATE_TOKEN` secret).

## Architecture

Hexagonal, in a monorepo; see `docs/adr/0005-…`. Dependencies point inward only:
`domain ← application ← adapters ← apps`.

- `packages/domain` holds no infrastructure. Valibot schemas are the single declaration of the
  model, and every type is `InferOutput` of one. The business rules sit on the schemas: a
  published post needs a date, a reading time and a body, and natural keys are unique. It also
  has the `Result` type and the pure read-model selectors (`toPortfolioView`, `isReadable`, band
  numbering). `toPortfolioView` takes an injected `ArticleRenderer`, so it stays pure.
- `packages/application` holds the ports and the use cases. **Ports are function types**, not
  classes: `PortfolioReader`, `ContentQueries`/`ContentCommands` (reads and writes split),
  `PublishTrigger` and `SnapshotSink`. **Use cases are curried**, dependencies first
  (`saveEntry(commands)(collection, input)`), and validate untrusted input with the domain before
  any port sees it. Errors are `Result` values, never thrown.
- `packages/adapters` provides `json`, `supabase`, `github`, `memory` and `html`. `html` is the build-time
  `ArticleRenderer` (sanitize-html allow-list, `<h2>` ids and "01 — " numbering, outline). In
  `supabase/codecs.ts`, the codecs are the anti-corruption layer (snake_case rows ↔ domain), and
  generated DB types never leave this package. `src/contract.ts` is the shared store contract:
  the memory and Supabase stores both run it. Keep them in step.
- `apps/web` is fully prerendered (`adapter-static`, `prerender = true`): the home page, one page
  per readable post at `/blog/[slug]` (from `entries()`, using `postPages`), `/sitemap.xml`, the RSS
  feeds (`/rss.xml`, `/en/rss.xml`, built by `packages/adapters/src/rss`) and a `404.html`
  fallback. Its composition root, `src/lib/server/portfolio.ts`, runs in the server
  loads **at prerender time only**. It picks a reader by `CONTENT_SOURCE` (`json` by default, or
  `supabase`), and invalid content fails the build with field paths. While building, every page
  shares one read, so a build is one consistent snapshot; in dev each request reads again. The
  browser never gets an adapter or a key. Pages hand each section component its slice of the view
  by props, and components import types and pure helpers from `@jzb/domain`, never data modules.
- On the home page, a post card is a real link to `/blog/<slug>`. A plain click opens the reader
  `<dialog>` instead and moves the URL there with SvelteKit shallow routing (`pushState`,
  `page.state.reader`); Esc, the back button and browser Back all close it and restore `/`.
  `Article.svelte` is the one article view, shared by the dialog and the post page. `Seo.svelte`
  writes each page's title, description, canonical, Open Graph/Twitter tags and JSON-LD (`Person`
  on home, `BlogPosting` on posts). Drafts never reach a build: `toPortfolioView` drops them
  unless called with `{ drafts: true }`, which the composition root passes only in dev, so
  `preview:content` shows them (their page with `noindex`). With no published post there is no
  Blog band, nav entry or footer column.
- `apps/backoffice` is SvelteKit + adapter-node, local only. `hooks.server.ts` creates a
  cookie-backed Supabase client per request, so every write carries the editor's session and RLS
  decides. It never uses the secret key. `lib/server/services.ts` is its composition root. Forms
  are data: `lib/forms.ts` holds descriptors per collection and section, and `Field.svelte` has
  one branch per field kind. The whole value posts as one JSON `payload` and the server validates
  it with the domain schema.
- In `supabase/migrations`, the tables in `public` are the write model (RLS: public read, writes
  only for `public.admins`). The `security_invoker` views in `api` are the read model and the
  only contract the web builds from. Translations are `jsonb` checked by `is_localized()`. Post
  bodies are localized HTML too; `html_has_text()` backs the published-post rule. `reorder()`
  rewrites positions atomically.

The band numbers come from the read model: `toPortfolioView` numbers only the bands that render,
so an optional section (today only Blog) never leaves a gap like 01, 03, 04. Hardcoding the digits
into a section would reintroduce that gap.

The design is the **Modernist** system from a Claude Design canvas: `--color-bg` off-white,
`--color-accent` red, Archivo at weights 400–900, square corners, 2px rules between sections.

### Where things live

- `apps/web/src/app.css` is the single source of design truth. Tailwind v4 `@theme` blocks define
  the colour ramps, `--font-*`, and two shared spacing tokens (`--spacing-gutter`,
  `--spacing-band`). They give every section the same fluid gutter and rhythm, so the section
  rules line up at any width. Element defaults (`html`, `body`, `a`) **must** stay inside
  `@layer base`: an unlayered rule beats every layered Tailwind utility, so a bare `a { color }`
  silently overrides `text-ink` everywhere.
- `apps/web/src/lib/i18n.svelte.ts` is the ES/EN toggle. Every string is a `Localized` pair and
  `t()` picks one; the page does not duplicate markup per language. The initial language comes
  from localStorage, then `navigator.language`, so **tests must drive the toggle explicitly**
  rather than assume Spanish.
- `content/portfolio.json` is the whole aggregate: `site` sections (including `ui`, the interface
  strings), `experience`, `posts`, `skills` and `projects`. It seeds the database, the unit tests
  and Playwright read it, and it is the fallback content source.
- Post bodies are HTML per language (`{ es, en }`), edited with Tiptap in
  `apps/backoffice/src/lib/components/RichTextEditor.svelte`, which has an HTML source mode.
  They are sanitised at build time and injected by `BlogReader.svelte` with `{@html}`. The view
  model (`PostView`) carries only the rendered article, never the raw `body`, so unsanitised
  markup never reaches the page data. Article typography is `.article` in `app.css`; a new
  allowed tag means editing the renderer's allow-list and that stylesheet. Adding a site section or
  UI string means editing `site.ts` (domain), the `site_section` enum (migration) if it is a new
  section, the descriptors in `forms.ts`, and the snapshot.
- `apps/web/src/lib/components/` has one component per section plus `SectionHeading`, `Tag` and
  `ImageSlot`.
- Images follow a naming convention instead of a manifest: an optimised image is
  `<stem>-{640,960,1280,1920}w.webp`, and the stored URL is the widest (`IMAGE_WIDTHS`,
  `srcsetFor` in `packages/domain/src/images.ts`). `ImageSlot` and the article renderer derive
  `srcset` from it. Only the LCP image may pass `priority`. The `ImageOptimizer` port (sharp) and
  the `MediaStore` port (Supabase Storage or the filesystem) meet in the `uploadImage` use case,
  shared by the backoffice's Media page and `pnpm images:optimize`.
- Blog card images are grey (`.tint`) and ease into colour while their card (`.tint-group`) is
  hovered or focused. Inside a post, the cover and article images are always in colour. The
  About portrait keeps the permanent `.grayscale-print`.
- Small text uses `accent-700`/`neutral-700`, and white text sits on `accent-600`: the base
  `accent` red and `neutral-600` are below AA contrast at body sizes. The base red stays for large
  display type and rules.

### Motion

Motion is split deliberately between CSS and JS:

- **Scroll position** effects (section reveals, the skill meters, the timeline spine, the progress
  bars) are CSS scroll-driven animations in `app.css`, wrapped in
  `@media (prefers-reduced-motion: no-preference)` and
  `@supports ((animation-timeline: view()) and (animation-range: entry))`. They are decorative
  progressive enhancement with no JS fallback: where unsupported (Firefox today) the finished state
  renders. Never move a reveal out of that `@supports` block — it would leave content at
  `opacity: 0`.
- **Pointer position and scroll velocity** effects live in `apps/web/src/lib/motion.svelte.ts`: one shared
  rAF loop feeding the `motionRoot`, `parallax` and `magnetic` actions. The loop only writes custom
  properties (`--mx`, `--my`, `--py`, `--skew`, `--squash`); the helper classes in `app.css`
  (`.magnet`, `.magnet-skew`, `.parallax-y`, `.magnet-parallax`) decide how an element spends them.
  That split is what lets one node take magnetism, parallax and a CSS reveal without fighting over
  `transform` — so add a new combination as a class there, not as an inline `transform`.

The blog reader is a native `<dialog>` opened with `showModal()`, so Esc, focus trapping and
inerting the page come from the platform; do not reintroduce manual scroll locking.

## Conventions

- Versions are pinned: exact versions in every `package.json` (no `^`/`~`), pnpm with its sha512
  in `packageManager`, and workflow actions by commit SHA with the version in a comment. `savePrefix: ""` in
  `pnpm-workspace.yaml` makes `pnpm add` pin too; Renovate proposes the updates.
- Svelte 5 runes throughout (`$state`, `$props`, `$derived`, `$effect`) — no stores, no `export let`.
- `*.svelte.ts` rune modules need the TS parser, which `eslint.config.js` sets explicitly; the
  svelte parser cannot read them.
- Tailwind utilities with arbitrary `clamp()` values carry the fluid type scale. Prefer the theme
  tokens (`px-gutter`, `py-band`, `text-ink`, `bg-accent`) over re-deriving values.
- Playwright specs live in `apps/web/tests/` and run against a production build, not the dev
  server. `page.spec.ts` covers structure and behaviour (sections, language toggle, the reader
  dialog); `content.spec.ts` asserts `content/portfolio.json` really drives the page.
- Workspace packages are TypeScript source (no build step) and import each other's files with
  explicit `.ts` extensions (`allowImportingTsExtensions`, `erasableSyntaxOnly`), so Node can run
  the scripts in `packages/adapters/scripts` directly.
- Keep the domain pure and the use cases curried; prefer `Result` over exceptions, and immutable
  updates over mutation. A throw belongs only in a composition root (`unwrap`).
- `firebase.json` points at `apps/web/build/` and has **no rewrites**. Every route is a built file
  (`cleanUrls` maps `/blog/x` to `blog/x.html`), so an unknown path gets Firebase's `404.html`
  with a real 404 status, not the home page. `svelte.config.js` tolerates `/blog/[slug]` having
  no pages while there are no posts (`handleUnseenRoutes`), and nothing else.
