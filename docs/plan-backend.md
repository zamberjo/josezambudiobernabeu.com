# Plan: contenido en Supabase + backoffice local

Decisión y alternativas: [ADR 0005](adr/0005-supabase-leido-en-build-con-puertos-y-adaptadores.md).
Cada fase es un commit (o unos pocos) con un criterio de aceptación verificable.

```
apps/backoffice ──ContentCommands/Queries──▶ Supabase (public: tablas + RLS)
       │                                          │
       └──PublishTrigger──▶ GitHub repository_dispatch
                                   │              ▼  (api: vistas de lectura)
                                   └─▶ CI: build apps/web ──PortfolioReader──▶ Firebase Hosting
```

## Fase 1 — Monorepo

- [ ] `pnpm-workspace.yaml`; la web pasa a `apps/web` sin cambios de comportamiento.
- [ ] Scripts raíz que delegan (`pnpm dev`, `build`, `test`, `check`, `lint`).

_Aceptación_: `pnpm lint && pnpm check && pnpm test` en verde.

## Fase 2 — Dominio y aplicación

- [ ] `packages/domain`: schemas Valibot de `Localized`, `Block`, `Post`, `Project`, `Skill`,
      `Experience`, `Site` y `Portfolio`; reglas (un post publicado exige fecha, tiempo de lectura
      y cuerpo); selectores puros (`toPortfolioView`, `outline`, `bands`).
- [ ] `packages/application`: puertos y casos de uso, con `Result`.
- [ ] Vitest para ambos, contra un adaptador en memoria.

_Aceptación_: un post publicado sin `date` devuelve un error con la ruta del campo.

## Fase 3 — La web consume el puerto

- [ ] `content/portfolio.json` sustituye `src/lib/data/`, incluidos los textos de interfaz.
- [ ] `+page.server.ts` compone `loadPortfolioView(jsonReader)`; los componentes reciben props.

_Aceptación_: el HTML prerenderizado muestra lo mismo y los tests de Playwright siguen en verde.

## Fase 4 — Supabase

- [ ] `supabase/migrations`: tablas, `is_localized()`, `pg_jsonschema` para los bloques, RLS con
      `admins` y vistas `api.*`.
- [ ] `pnpm content:seed` genera `supabase/seed.sql` desde la instantánea.
- [ ] Adaptador de lectura y escritura con tipos generados; `CONTENT_SOURCE=supabase`.

_Aceptación_: con `supabase start` y `CONTENT_SOURCE=supabase pnpm build`, la web es idéntica.

## Fase 5 — Backoffice

- [ ] `apps/backoffice` (SvelteKit y adapter-node, solo en local): login con Supabase Auth, CRUD
      por colección con formularios guiados por descriptores, editor de bloques, reordenar,
      secciones del sitio.
- [ ] Botón «Publicar» → `repository_dispatch`.

_Aceptación_: editar una skill, publicar y ver el cambio tras el deploy.

## Fase 6 — CI y documentación

- [ ] `deploy.yaml` escucha `repository_dispatch` y construye con Supabase.
- [ ] Tests unitarios en la CI de PRs.
- [ ] `pnpm content:export` para volcar la BD a la instantánea.
- [ ] README y CLAUDE.md al día.
