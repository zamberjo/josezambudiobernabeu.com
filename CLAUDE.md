# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

The SvelteKit app lives at the repo root. The project uses **pnpm** (`pnpm-lock.yaml`); there is no
npm lockfile, so `npm ci` will not work.

```bash
pnpm dev                    # vite dev server
pnpm build                  # static build into ./build
pnpm preview                # serve the built site
pnpm check                  # svelte-check (types + Svelte diagnostics)
pnpm lint                   # prettier --check && eslint
pnpm format                 # prettier --write
pnpm test                   # Playwright; builds and previews on :3000 first
pnpm exec playwright test tests/page.spec.ts -g "blog reader"      # one test
```

Deploy:

```bash
pnpm build
npx -y firebase-tools deploy --only hosting
```

CI: `.github/workflows/lint.yaml` runs eslint and prettier on pull requests. `deploy.yaml` runs on
push to `master` (and manually via `workflow_dispatch`): it installs with the frozen lockfile, runs
`pnpm check`, builds, and deploys to Firebase Hosting. It needs a `FIREBASE_SERVICE_ACCOUNT_JOSEZAMBUDIOBERNABEU` repo
secret (a service-account JSON with the Firebase Hosting Admin role) — the old `FIREBASE_TOKEN`
flow is deprecated. `firebase-hosting-pull-request.yml` deploys each PR to its own preview channel.
There is still no test job.

## Architecture

A single prerendered page (`adapter-static`, `prerender = true` in `src/routes/+layout.ts`). There
is no routing, no server code, and no client-side data fetching — `+page.svelte` composes one
section component per band of the design, in order, and that is the whole site. It also owns the
band numbers: each section takes a `number` prop and `+page.svelte` derives the sequence from the
bands it actually renders, so an optional section (today only Blog) never leaves a gap like
01, 03, 04. Hardcoding the digits back into a section would reintroduce that gap.

The design is the **Modernist** system from a Claude Design canvas: `--color-bg` off-white,
`--color-accent` red, Archivo at weights 400–900, square corners, 2px rules between sections.

### Where things live

- `src/app.css` — the single source of design truth. Tailwind v4 `@theme` blocks define the colour
  ramps, `--font-*`, and two shared spacing tokens (`--spacing-gutter`, `--spacing-band`) that give
  every section the same fluid gutter and rhythm, so the section rules line up at any width.
  Element defaults (`html`, `body`, `a`) **must** stay inside `@layer base`: an unlayered rule beats
  every layered Tailwind utility, so a bare `a { color }` silently overrides `text-ink` everywhere.
- `src/lib/i18n.svelte.ts` — the ES/EN toggle. Every string is a `{ es, en }` pair and `t()` picks
  one; the page does not duplicate markup per language. Initial language comes from localStorage,
  then `navigator.language`, so **tests must drive the toggle explicitly** rather than assume
  Spanish.
- `src/lib/data/` — content. `content.ts` holds the fixed furniture (nav, hero, about, experience,
  education, quote, footer). The three sections that get edited often are plain JSON, each with a
  typed loader beside it that the components import — never the `.json` directly:
  - `blog.json` → `blog.ts`. A post's body is an array of typed blocks (`lede`, `heading`,
    `paragraph`, `quote`, `list`, `code`, `image`); `BlogReader.svelte` has one branch per kind and
    `outline()` numbers the headings into the sticky side index. The newest `published` post takes
    the wide feature card; everything else falls into the grid, and a post with an empty `body`
    renders as an inert card rather than opening an empty reader. With `posts` empty, `hasPosts`
    is false and the whole band disappears — section, nav entry and footer column — because an
    empty blog reads worse than no blog. Adding a block kind means editing both the union in
    `blog.ts` and the branches in `BlogReader.svelte`.
  - `skills.json` → `skills.ts`. `level` is 0–100 and becomes the `--bar-end` of the meter's
    scroll-driven fill; `accent` picks the red meter over the ink one.
  - `projects.json` → `projects.ts`. Holds the real repository and production URLs. `featured: true`
    floats a project to the front of the grid; `description` currently surfaces only as the card's
    `title` tooltip.

  Every user-visible string in these files is a `{ es, en }` pair matching the `T` type.

- `src/lib/components/` — one component per section plus `SectionHeading`, `Tag`, `ImageSlot`.

### Motion

Motion is split deliberately between CSS and JS:

- **Scroll position** effects (section reveals, the skill meters, the timeline spine, the progress
  bars) are CSS scroll-driven animations in `app.css`, wrapped in
  `@media (prefers-reduced-motion: no-preference)` and
  `@supports ((animation-timeline: view()) and (animation-range: entry))`. They are decorative
  progressive enhancement with no JS fallback: where unsupported (Firefox today) the finished state
  renders. Never move a reveal out of that `@supports` block — it would leave content at
  `opacity: 0`.
- **Pointer position and scroll velocity** effects live in `src/lib/motion.svelte.ts`: one shared
  rAF loop feeding the `motionRoot`, `parallax` and `magnetic` actions. The loop only writes custom
  properties (`--mx`, `--my`, `--py`, `--skew`, `--squash`); the helper classes in `app.css`
  (`.magnet`, `.magnet-skew`, `.parallax-y`, `.magnet-parallax`) decide how an element spends them.
  That split is what lets one node take magnetism, parallax and a CSS reveal without fighting over
  `transform` — so add a new combination as a class there, not as an inline `transform`.

The blog reader is a native `<dialog>` opened with `showModal()`, so Esc, focus trapping and
inerting the page come from the platform; do not reintroduce manual scroll locking.

## Conventions

- Svelte 5 runes throughout (`$state`, `$props`, `$derived`, `$effect`) — no stores, no `export let`.
- `*.svelte.ts` rune modules need the TS parser, which `eslint.config.js` sets explicitly; the
  svelte parser cannot read them.
- Tailwind utilities with arbitrary `clamp()` values carry the fluid type scale. Prefer the theme
  tokens (`px-gutter`, `py-band`, `text-ink`, `bg-accent`) over re-deriving values.
- Playwright specs live in `tests/` and run against a production build, not the dev server.
  `page.spec.ts` covers structure and behaviour (sections, language toggle, the reader dialog);
  `content.spec.ts` asserts the JSON in `src/lib/data/` really drives the page.
- `firebase.json` points at `build/` and rewrites every path to `/index.html`, which is right for
  this single-page site — an unknown URL lands on the page rather than a 404.
