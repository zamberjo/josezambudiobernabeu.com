# Plan de mejoras del portfolio

Objetivo: que la web **y el repositorio que enlaza** transmitan el nivel de un ingeniero
senior con criterio de arquitectura. El repo es parte del portfolio: quien abre
`josezambudiobernabeu.com` acaba abriendo este repositorio.

Cada paso es un commit independiente, con un criterio de aceptación verificable. El orden está
pensado para que lo más visible llegue antes y nada dependa de un paso posterior.

Decisiones ya tomadas:

- **Capa de contenido**: validación en la frontera (schemas que parsean los JSON y rompen el
  build), no puerto/adapter explícito. El dominio queda desacoplado del formato sin ceremonia
  añadida. Se documenta como ADR.
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

_Aceptación_: `pnpm lint && pnpm check && pnpm test` en verde. **Hecho** — 7 tests en verde.

## Fase 1 — Rigor visible en CI (media tarde)

El punto que más resta hoy: hay tests buenos y no los ejecuta nadie.

- [ ] **1.1** Job de Playwright en `lint.yaml` (o workflow `test.yaml`) para pull requests:
      instalar navegadores con `pnpm exec playwright install --with-deps chromium`, build y test.
- [ ] **1.2** Añadir el mismo job a `deploy.yaml` como puerta previa al deploy: si los tests fallan,
      no se publica.
- [ ] **1.3** Subir el reporte HTML de Playwright como artifact en caso de fallo.
- [ ] **1.4** Renovate o Dependabot semanal, agrupando devDependencies.

_Aceptación_: un PR de prueba muestra los checks de lint, types y tests; romper una aserción a
propósito bloquea el merge.

## Fase 2 — Validación en la frontera (una tarde)

Hoy `blog.ts` y `projects.ts` hacen `data.posts as Post[]`: un cast, no un parse. Un error en el
JSON llega a producción en silencio.

- [ ] **2.1** Añadir Valibot (más ligero que Zod para lo que necesitamos).
- [ ] **2.2** `src/lib/data/schema.ts`: schema de `T`, `Block`, `Post`, `Project`, `Skill`. Los tipos
      del dominio pasan a derivarse del schema (`InferOutput`), no a declararse dos veces.
- [ ] **2.3** Los loaders (`blog.ts`, `projects.ts`, `skills.ts`) parsean en vez de castear. Un JSON
      inválido lanza en tiempo de build, con el path del campo en el mensaje.
- [ ] **2.4** Reglas de negocio junto al schema, no dispersas: un `Post` `published` exige `date`,
      `readingTime` y `body` no vacío; un `Project` exige URL de repositorio válida.
- [ ] **2.5** Test unitario (Vitest o un spec de node) que comprueba que un JSON malformado falla.

_Aceptación_: quitar `date` de un post publicado rompe `pnpm build` con un error legible.

## Fase 3 — ADRs (una tarde, alto retorno para perfil de arquitecto)

Documentar decisiones **ya tomadas**, en formato corto (contexto / decisión / consecuencias).

- [ ] **3.1** `docs/adr/0001-sitio-estatico-y-firebase-hosting.md`
- [ ] **3.2** `docs/adr/0002-i18n-sin-routing.md` — y sus consecuencias en SEO, que la fase 5 corrige.
- [ ] **3.3** `docs/adr/0003-motion-css-scroll-driven-vs-js.md` — por qué el scroll va en CSS y el
      puntero en JS, y por qué el reveal nunca sale del `@supports`.
- [ ] **3.4** `docs/adr/0004-contenido-en-json-validado-en-la-frontera.md` — incluyendo por qué **no**
      se ha montado un puerto/adapter hexagonal en un sitio de este tamaño.
- [ ] **3.5** Enlazar el índice de ADRs desde el README.

_Aceptación_: cada ADR cabe en una pantalla y explica una alternativa descartada.

## Fase 4 — Contenido (bloqueado por Jose)

El trabajo técnico prepara la estructura; el texto lo escribe Jose.

- [x] **4.1** Fuera el post de relleno: `blog.json` queda con `posts: []` y la sección entera
      (banda, entrada de nav y columna del footer) desaparece hasta que haya artículo real.
      Las bandas se renumeran solas. **Hecho.**
- [ ] **4.2** Rediseñar el modelo de `Skill`: fuera `level` 0–100 y su barra. Sustituir por
      evidencia — años, contexto y proyecto donde se usó. Implica tocar `skills.json`,
      `skills.ts`, `SkillsGrid.svelte` y el CSS de `.bar-grow` en `app.css`.
- [ ] **4.3** Ampliar el modelo de `experience`: empresa, periodo con fechas, escala (equipo,
      volumen, módulos) y **una decisión técnica o resultado medible** por entrada. Dejar los
      campos y marcar los huecos en el JSON/TS para que Jose los rellene.
- [ ] **4.4** CTA: sección de contacto con email y CV en PDF (`static/assets/cv/`), enlazada desde
      nav y footer.
- [ ] **4.5** Sacar `project.description` del atributo `title` a la propia tarjeta: hoy es contenido
      bueno invisible en móvil y para teclado.

_Aceptación_: ninguna cadena visible contiene texto de plantilla; `rg -i "sustituye|lorem|tu primer"`
sobre `src/lib/data` no devuelve nada.

## Fase 5 — Alcance y descubribilidad (la fase grande)

- [ ] **5.1** OG + Twitter cards con imagen (`static/assets/og.png`), `canonical` y `theme-color`
      centralizados. Eliminar la duplicación de `title`/`description` entre `app.html` y
      `+page.svelte`.
- [ ] **5.2** JSON-LD `Person` en la home.
- [ ] **5.3** `sitemap.xml` y `robots.txt` generados en build, con el sitemap referenciado.
- [ ] **5.4** Rutas `/blog/[slug]` prerenderizadas, con `entries()` desde `blog.ts`. El `<dialog>`
      se mantiene como mejora progresiva sobre navegación real, para que un artículo se pueda
      enlazar, compartir e indexar. JSON-LD `BlogPosting` por artículo.
- [ ] **5.5** i18n indexable: `/en` prerenderizada + `hreflang`, o como mínimo resolver el idioma
      antes de hidratar (script inline en `app.html`) para eliminar el flash de español.
- [ ] **5.6** Revisar el rewrite `**` de `firebase.json`: con rutas reales, un slug inexistente debe
      dar 404, no 200 con la home.

_Aceptación_: compartir la URL en LinkedIn muestra tarjeta con imagen; un artículo tiene URL propia
y aparece en el sitemap; la versión EN es rastreable.

## Fase 6 — Plataforma y accesibilidad

- [ ] **6.1** Cabeceras de seguridad en `firebase.json`: CSP, `X-Content-Type-Options`,
      `Referrer-Policy`, `Permissions-Policy`, HSTS. Objetivo A+ en securityheaders.com.
- [ ] **6.2** `404.html` propio, coherente con el diseño.
- [ ] **6.3** Skip-link al contenido principal y repaso de `:focus-visible` en nav, tarjetas y el
      reader.
- [ ] **6.4** Test de accesibilidad con `@axe-core/playwright` en el spec, corriendo en CI.
- [ ] **6.5** Presupuesto de rendimiento (Lighthouse CI) sobre el preview de cada PR.

_Aceptación_: axe sin violaciones críticas; Lighthouse ≥ 95 en las cuatro categorías.

---

## Fuera de alcance, y por qué

- **Puerto `ContentRepository` + adapters hexagonales**: en un sitio de ~1.200 líneas sería
  ceremonia sin beneficio, y un revisor con criterio lo lee como over-engineering. El corte que sí
  aporta —dominio independiente del formato— lo da la fase 2. Queda documentado en el ADR 0004.
- **CMS / markdown para el blog**: solo merece la pena a partir de una decena de artículos. La
  validación de la fase 2 deja la puerta abierta sin pagar nada hoy.
- **Analítica**: opcional y con coste de privacidad; decidir aparte.
