# ADR 0003 — Movimiento: el scroll en CSS, el puntero y la velocidad en JS

- **Estado**: aceptada
- **Fecha**: 2026-09-17 (escrita a posteriori, el 2026-11-05)

## Contexto

El diseño tiene dos clases de movimiento. Una depende de la posición del scroll: secciones que
aparecen, las barras de skills, la línea de la experiencia, la barra de progreso. La otra depende
del puntero o de la velocidad del scroll: elementos que se acercan al cursor, parallax e
inclinación al hacer scroll rápido.

## Decisión

- Lo que depende de la posición del scroll son animaciones CSS scroll-driven en `app.css`,
  dentro de `@media (prefers-reduced-motion: no-preference)` y de
  `@supports ((animation-timeline: view()) and (animation-range: entry))`. Sin soporte (Firefox
  hoy) se ve el estado final, sin animación y sin JS de respaldo.
- Lo que depende del puntero o de la velocidad está en `apps/web/src/lib/motion.svelte.ts`: un
  único bucle `requestAnimationFrame` que solo escribe propiedades CSS (`--mx`, `--my`, `--py`,
  `--skew`, `--squash`). Las clases de `app.css` deciden cómo las usa cada elemento.

## Consecuencias

- El scroll no ejecuta JavaScript por fotograma para revelar contenido, y no hay
  `IntersectionObserver` que mantener.
- Un mismo nodo puede llevar magnetismo, parallax y una animación de entrada sin que se pisen el
  `transform`, porque cada efecto escribe su propia variable.
- Una animación de entrada nunca debe salir del bloque `@supports`: donde no hay soporte dejaría
  el contenido en `opacity: 0`.
- Una combinación nueva de efectos se añade como clase en `app.css`, no como `transform` en línea.
