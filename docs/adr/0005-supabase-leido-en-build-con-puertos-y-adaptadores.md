# ADR 0005 — Supabase como fuente de contenido, leído en build, detrás de puertos

- **Estado**: aceptada
- **Fecha**: 2026-09-24
- **Revoca**: la decisión «validación en la frontera, no puerto/adapter» de `docs/plan-mejoras.md`
  (y el ADR 0004 que la iba a documentar).

## Contexto

Todo el contenido de la web (textos fijos, blog, skills, proyectos y traducciones) vivía en
`src/lib/data/` como TS y JSON. Editarlo exige tocar el repositorio. Queremos alojarlo en una base
de datos y editarlo desde un backoffice local.

La web es estática (un único HTML prerenderizado) y se sirve desde Firebase Hosting. Había tres
opciones:

| Opción                                | SEO/LCP       | Si la BD no responde         |
| ------------------------------------- | ------------- | ---------------------------- |
| A. El navegador llama a Supabase      | Empeora       | La web se rompe              |
| **B. La CI lee Supabase en el build** | Igual que hoy | Solo falla el próximo deploy |
| C. Backoffice que escribe JSON a git  | Igual que hoy | No aplica                    |

CORS no era un factor: PostgREST responde con `Access-Control-Allow-Origin: *`. Lo que pesa en
contra de A es perder el prerender y que el plan gratuito de Supabase pausa los proyectos
inactivos: la web dependería en ejecución de un servicio que se duerme.

## Decisión

1. **Opción B.** `apps/web/src/routes/+page.server.ts` carga el contenido durante el prerender.
   El navegador nunca habla con Supabase ni recibe su clave.
2. **Arquitectura hexagonal en un monorepo pnpm**:
   - `packages/domain`: schemas Valibot (los tipos se derivan de ellos), reglas de negocio y
     selectores puros. Sin dependencias de infraestructura.
   - `packages/application`: casos de uso y **puertos como tipos de función**
     (`PortfolioReader`, `ContentQueries`, `ContentCommands`, `PublishTrigger`). Los errores
     viajan como `Result`, no como excepciones.
   - `packages/adapters`: JSON, Supabase, GitHub y memoria. Los tipos generados de Supabase no
     salen de aquí; los _codecs_ fila↔dominio son la capa anticorrupción.
   - `apps/web` y `apps/backoffice`: raíces de composición.
3. **Traducciones como `jsonb` `{ es, en }`** con un `CHECK (is_localized(...))`, en vez de tablas
   `*_translations`. El tipo encaja 1:1 con `Localized` del dominio y con los bloques del blog.
4. **CQRS ligero**: se escribe en tablas de `public` (RLS: solo `admins`) y se lee desde vistas
   del schema `api`, que es el contrato público y permite refactorizar las tablas sin romper la web.
5. **Publicación explícita**: el backoffice lanza `repository_dispatch` y la CI reconstruye y
   despliega. No se usa un webhook por cada escritura.
6. `content/portfolio.json` es la instantánea del contenido. De ella se genera `supabase/seed.sql`,
   Playwright la usa (así la CI no depende de Supabase) y `pnpm content:export` la regenera desde
   la BD como copia de seguridad versionada.

## Consecuencias

- Hexagonal se justifica ahora porque hay **dos adaptadores reales** detrás del mismo puerto
  (JSON y Supabase) y dos clientes (web y backoffice). Antes no los había, y por eso la decisión
  anterior era la correcta en su momento.
- Un cambio de contenido tarda lo que tarde un deploy (~2 min), y a cambio no hay coste de
  ejecución.
- Añadir un idioma requiere tres cambios: `LOCALES` en el dominio, `is_localized()` en una
  migración y rellenar las filas existentes.
- El build de producción necesita `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY` (la clave publicable o la anon heredada). Si Supabase está pausado,
  el deploy falla y la versión publicada sigue en pie.
