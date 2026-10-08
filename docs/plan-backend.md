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

- [x] `pnpm-workspace.yaml`; la web pasa a `apps/web` sin cambios de comportamiento.
- [x] Scripts raíz que delegan (`pnpm dev`, `build`, `test`, `check`, `lint`).

_Aceptación_: `pnpm lint && pnpm check && pnpm test` en verde.

## Fase 2 — Dominio y aplicación

- [x] `packages/domain`: schemas Valibot de `Localized`, `Block`, `Post`, `Project`, `Skill`,
      `Experience`, `Site` y `Portfolio`; reglas (un post publicado exige fecha, tiempo de lectura
      y cuerpo); selectores puros (`toPortfolioView`, `outline`, `bands`).
- [x] `packages/application`: puertos y casos de uso, con `Result`.
- [x] Vitest para ambos, contra un adaptador en memoria.

_Aceptación_: un post publicado sin `date` devuelve un error con la ruta del campo.

## Fase 3 — La web consume el puerto

- [x] `content/portfolio.json` sustituye `src/lib/data/`, incluidos los textos de interfaz.
- [x] `+page.server.ts` compone `loadPortfolioView(jsonReader)`; los componentes reciben props.

_Aceptación_: el HTML prerenderizado muestra lo mismo y los tests de Playwright siguen en verde.

## Fase 4 — Supabase

- [x] `supabase/migrations`: tablas, `is_localized()`, `pg_jsonschema` para los bloques, RLS con
      `admins` y vistas `api.*`.
- [x] `pnpm content:seed` genera `supabase/seeds/10_content.sql` desde la instantánea.
- [x] Adaptador de lectura y escritura con tipos generados; `CONTENT_SOURCE=supabase`.
- [x] Tests de integración (`pnpm test:db`): el contrato de store, RLS y los `CHECK` de la BD.

_Aceptación_: con `supabase start` y `CONTENT_SOURCE=supabase pnpm build`, la web es idéntica.

## Fase 5 — Backoffice

- [x] `apps/backoffice` (SvelteKit y adapter-node, solo en local): login con Supabase Auth, CRUD
      por colección con formularios guiados por descriptores, editor de bloques, reordenar,
      secciones del sitio.
- [x] Botón «Publicar» → `repository_dispatch`.

_Aceptación_: editar una skill, publicar y ver el cambio tras el deploy. En local está cubierto por
`pnpm --filter backoffice test` hasta el `repository_dispatch`; ver el deploy real requiere el
proyecto remoto (ver «Pendiente»).

## Fase 6 — CI y documentación

- [x] `deploy.yaml` escucha `repository_dispatch` y construye con Supabase.
- [x] Tests unitarios en la CI de PRs.
- [x] `pnpm content:export` para volcar la BD a la instantánea.
- [x] README y CLAUDE.md al día.

## Pendiente (requiere cuentas, no código)

- [ ] Crear el proyecto remoto de Supabase, `supabase link` + `supabase db push`, y cargar
      `supabase/seeds/10_content.sql` una vez.
- [ ] Crear el usuario editor en el dashboard y añadirlo a `public.admins`.
- [ ] Secrets del repositorio: `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY`. Hasta que existan,
      `deploy.yaml` sigue construyendo desde la instantánea.
- [ ] Token fine-grained con permiso _Contents: read and write_ en `apps/backoffice/.env`
      (`GITHUB_TOKEN`) para el botón Publicar.
