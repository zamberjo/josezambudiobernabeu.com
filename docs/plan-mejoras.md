# Plan de mejoras del portfolio

Objetivo: que la web y el repositorio que enlaza transmitan el nivel de un ingeniero senior con
criterio de arquitectura. El repo es parte del portfolio: quien abre `josezambudiobernabeu.com`
acaba abriendo este repositorio.

Cada paso es un commit independiente, con un criterio de aceptación verificable. El orden está
pensado para que lo más visible llegue antes y nada dependa de un paso posterior.

Decisiones ya tomadas:

- **Capa de contenido**: validación en la frontera, con schemas que parsean los JSON y rompen el
  build, y sin puertos ni adaptadores. El dominio queda desacoplado del formato sin capas extra.
  Se documenta como ADR. (Revocada después por el
  [ADR 0005](adr/0005-supabase-leido-en-build-con-puertos-y-adaptadores.md).)
- **Contenido real** (artículos, empresas, métricas): lo escribe Jose. El trabajo técnico deja la
  estructura lista y los huecos marcados; nada se publica con relleno.

---

## Fase 0 — Higiene (media tarde)

Arreglos pequeños que hoy contradicen el resto del repo.

- [x] **0.1** `tecnologies` → `technologies` en `projects.json` y `projects.ts`; ningún
      componente consumía el campo.
- [x] **0.2** `playwright.config.ts` usa `npm run build && npm run preview`; el repo es pnpm-only.
      Pasar a `pnpm`.
- [x] **0.3** `tests/example.spec.ts` dividido en `tests/page.spec.ts` (estructura, idioma,
      reader) y `tests/content.spec.ts` (que los JSON mandan sobre la página).
- [x] **0.4** `LICENSE` (MIT) y `package.json`: `name` real en vez de `portfolio`.

_Aceptación_: `pnpm lint && pnpm check && pnpm test` en verde. **Hecho**: 7 tests en verde.

## Fase 1 — Rigor visible en CI (media tarde)

El punto que más resta hoy: hay tests buenos y no los ejecuta nadie.

- [x] **1.1** Job de Playwright en `lint.yaml` (o workflow `test.yaml`) para pull requests:
      instalar navegadores con `pnpm exec playwright install --with-deps chromium`, build y test.
- [x] **1.2** Añadir el mismo job a `deploy.yaml` como puerta previa al deploy: si los tests fallan,
      no se publica.
- [x] **1.3** Subir el reporte HTML de Playwright como artifact en caso de fallo.
      **Hecho** (1.1–1.3) en #50.
- [x] **1.4** Renovate los jueves a las 17:00, agrupando devDependencies, con todas las
      versiones fijadas (PR #46).

_Aceptación_: un PR de prueba muestra los checks de lint, types y tests; romper una aserción a
propósito bloquea el merge.

## Fase 2 — Validación en la frontera (una tarde)

> **Absorbida por [plan-backend.md](plan-backend.md)**: los schemas Valibot viven en
> `packages/domain` y se validan en cada adaptador. La decisión de no usar puertos quedó revocada
> por el [ADR 0005](adr/0005-supabase-leido-en-build-con-puertos-y-adaptadores.md).

Hoy `blog.ts` y `projects.ts` hacen `data.posts as Post[]`: un cast, no un parse. Un error en el
JSON llega a producción en silencio.

- [x] **2.1** Añadir Valibot (más ligero que Zod para lo que necesitamos).
- [x] **2.2** `src/lib/data/schema.ts`: schema de `T`, `Block`, `Post`, `Project`, `Skill`. Los
      tipos del dominio se derivan del schema (`InferOutput`) en vez de declararse dos veces.
- [x] **2.3** Los loaders (`blog.ts`, `projects.ts`, `skills.ts`) parsean en vez de castear. Un JSON
      inválido lanza en tiempo de build, con el path del campo en el mensaje.
- [x] **2.4** Reglas de negocio junto al schema, no dispersas: un `Post` `published` exige `date`,
      `readingTime` y `body` no vacío; un `Project` exige URL de repositorio válida.
- [x] **2.5** Test unitario (Vitest o un spec de node) que comprueba que un JSON malformado falla.

_Aceptación_: quitar `date` de un post publicado rompe `pnpm build` con un error legible.

## Fase 3 — ADRs (una tarde, alto retorno para perfil de arquitecto)

Documentar decisiones ya tomadas, en formato corto (contexto, decisión, consecuencias).

- [x] **3.1** `docs/adr/0001-sitio-estatico-y-firebase-hosting.md`
- [x] **3.2** `docs/adr/0002-i18n-sin-routing.md`, con sus consecuencias en SEO, que la fase 5
      corrige.
- [x] **3.3** `docs/adr/0003-motion-css-scroll-driven-vs-js.md`: por qué el scroll va en CSS y el
      puntero en JS, y por qué el reveal nunca sale del `@supports`.
- [x] **3.4** `docs/adr/0004-contenido-en-json-validado-en-la-frontera.md`, incluido por qué no se
      ha montado un puerto/adapter hexagonal en un sitio de este tamaño.
- [x] **3.5** Enlazar el índice de ADRs desde el README.

**Hecho** en `docs/adrs`, con nombres algo distintos (ver [el índice](adr/README.md)). Se añade
el ADR 0006, que sustituye al 0002 tras la tarea 5.5.

_Aceptación_: cada ADR cabe en una pantalla y explica una alternativa descartada.

## Fase 4 — Contenido (bloqueado por Jose)

El trabajo técnico prepara la estructura; el texto lo escribe Jose.

- [x] **4.1** Fuera el post de relleno: `blog.json` queda con `posts: []` y la sección entera
      (banda, entrada de nav y columna del footer) desaparece hasta que haya artículo real.
      Las bandas se renumeran solas. **Hecho.**
- [ ] **4.2** Rediseñar el modelo de `Skill`: fuera `level` 0–100 y su barra. Sustituir por
      evidencia: años, contexto y proyecto donde se usó. Implica tocar `skills.json`,
      `skills.ts`, `SkillsGrid.svelte` y el CSS de `.bar-grow` en `app.css`.
- [ ] **4.3** Ampliar el modelo de `experience`: empresa, periodo con fechas, escala (equipo,
      volumen, módulos) y **una decisión técnica o resultado medible** por entrada. Dejar los
      campos y marcar los huecos en el JSON/TS para que Jose los rellene.
- [ ] **4.4** CTA: sección de contacto con email y CV en PDF (`static/assets/cv/`), enlazada
      desde nav y footer.
- [ ] **4.5** Sacar `project.description` del atributo `title` a la propia tarjeta: hoy ese texto
      no se ve en móvil ni con teclado.

_Aceptación_: ninguna cadena visible contiene texto de plantilla; `rg -i "sustituye|lorem|tu primer"`
sobre `src/lib/data` no devuelve nada.

## Fase 5 — Alcance y descubribilidad (la fase grande)

- [x] **5.1** OG + Twitter cards con imagen (`static/assets/og.png`), `canonical` y `theme-color`
      centralizados. Eliminar la duplicación de `title`/`description` entre `app.html` y
      `+page.svelte`. **Hecho**: `Seo.svelte` centraliza canonical y tarjetas desde la rama del
      backend; la imagen por defecto (`og.png`) llegó en #52.
- [x] **5.2** JSON-LD `Person` en la home.
- [x] **5.3** `sitemap.xml` y `robots.txt` generados en build, con el sitemap referenciado.
- [x] **5.4** Rutas `/blog/[slug]` prerenderizadas, con `entries()` desde `blog.ts`. El `<dialog>`
      se mantiene como mejora progresiva sobre navegación real, para que un artículo se pueda
      enlazar, compartir e indexar. JSON-LD `BlogPosting` por artículo.
- [x] **5.5** i18n indexable: `/en` prerenderizada + `hreflang`, o como mínimo resolver el idioma
      antes de hidratar (script inline en `app.html`) para eliminar el flash de español.
      **Hecho** en #51, con la opción completa: ver el
      [ADR 0006](adr/0006-idioma-en-la-url.md).
- [x] **5.6** Revisar el rewrite `**` de `firebase.json`: con rutas reales, un slug inexistente debe
      dar 404, no 200 con la home.
- [x] **5.7** Imagen OG propia de cada post. Hoy un post comparte su portada, o la tarjeta
      genérica `og.png` si no tiene; ninguna de las dos lleva el título. Generar en build una
      imagen de 1200×630 por post e idioma, con el diseño de `og.png` más el título, la fecha y
      las etiquetas, y la portada si la tiene. Sirve como `og:image` en `/blog/<slug>/og.png` y
      `/en/blog/<slug>/og.png`, prerenderizada desde un `+server.ts`. Para no depender de
      Chromium en el build, renderizarla con satori y resvg, usando la Archivo de fontsource
      que ya tiene el sitio. **Hecho** en `feat/og-per-post` (adaptador `og`). En lugar de la
      fecha, que el sitio no muestra en ningún otro sitio, la tarjeta lleva el tiempo de
      lectura, como las tarjetas del blog.

_Aceptación_: compartir la URL en LinkedIn muestra tarjeta con imagen; un artículo tiene URL propia
y aparece en el sitemap; la versión EN es rastreable.

## Fase 6 — Plataforma y accesibilidad

- [x] **6.1** Cabeceras de seguridad en `firebase.json`: CSP, `X-Content-Type-Options`,
      `Referrer-Policy`, `Permissions-Policy`, HSTS. Objetivo A+ en securityheaders.com.
      **Hecho** en #52; la CSP lleva hashes por página (`kit.csp`).
- [x] **6.2** `404.html` propio, coherente con el diseño. **Hecho** en la rama del backend.
- [ ] **6.3** Skip-link al contenido principal y repaso de `:focus-visible` en nav, tarjetas y el
      reader.
- [ ] **6.4** Test de accesibilidad con `@axe-core/playwright` en el spec, corriendo en CI.
- [x] **6.5** Presupuesto de rendimiento (Lighthouse CI) sobre el preview de cada PR. **Hecho**
      en la rama del backend, sobre el build de producción en vez del preview.

_Aceptación_: axe sin violaciones críticas; Lighthouse ≥ 95 en las cuatro categorías.

---

## Fuera de alcance, y por qué

- **CMS externo para el blog**: el backoffice local con Tiptap cubre la edición, y el contenido
  ya vive en Supabase ([ADR 0005](adr/0005-supabase-leido-en-build-con-puertos-y-adaptadores.md)).
- **Analítica**: opcional y con coste de privacidad; decidir aparte. Si se añade, hay que abrirle
  la CSP en `svelte.config.js` y en `firebase.json`.

La primera versión de esta sección descartaba los puertos y adaptadores por ceremonia. Dejó de
valer cuando hubo dos fuentes de contenido. El
[ADR 0004](adr/0004-contenido-en-json-validado-en-la-frontera.md) cuenta la decisión original y
el 0005 por qué cambió.

---

## Stack de PRs y orden de merge

Ya fusionados en `master`: el plan del backend (#45, con 6.2 y 6.5), Renovate con versiones
fijadas (#46), borradores fuera del sitio publicado (#47), `robots.txt` sin crawlers de
entrenamiento (#48), el aviso de sanitize-html en el renderer (#49), Playwright en CI (#50, 1.1–1.3),
una URL por idioma (#51, 5.5), cabeceras de seguridad con imagen OG (#52, 6.1 y 5.1) y los ADRs
(#53, fase 3).

Queda #54 (`docs/estilo-humano`, base `master`): el repaso de comentarios y documentación con la
guía de estilo. Con él se cierra el stack.

Con «Create a merge commit», al borrar la rama fusionada GitHub cambia solo la base del PR
siguiente a `master` y no hay que tocar nada. «Squash and merge» (#45) y «Rebase and merge»
(#50, #51) reescriben los commits en `master`, así que la rama siguiente sigue arrastrando los
originales y hay que rebasarla antes de fusionarla:
`git rebase --onto master <rama-anterior> <rama-siguiente>`.
