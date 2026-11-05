# ADR 0004 — Contenido en JSON validado en la frontera, sin puertos

- **Estado**: sustituida por el [ADR 0005](0005-supabase-leido-en-build-con-puertos-y-adaptadores.md)
- **Fecha**: 2026-09-17 (escrita a posteriori, el 2026-11-05)

## Contexto

Todo el contenido vivía en `src/lib/data/` como JSON y TS, y los loaders hacían
`data.posts as Post[]`. Un error en el JSON llegaba a producción sin aviso. El sitio tenía unas
1.200 líneas y una sola fuente de contenido.

## Decisión

Schemas Valibot que parsean los JSON en el build: un JSON inválido rompe el build con la ruta del
campo. Las reglas de negocio (un post publicado necesita fecha) viven junto al schema.

No se introducen puertos ni adaptadores. Con una sola fuente, un puerto `ContentRepository` sería
una abstracción sin segunda implementación que la justifique.

## Consecuencias

- El dominio queda separado del formato sin capas extra.
- Si aparece una segunda fuente de contenido, esta decisión deja de valer. Pasó cuando el contenido
  se movió a Supabase y hubo que editarlo desde un backoffice: el ADR 0005 introduce los puertos y
  conserva los schemas, que pasan a `packages/domain`.
