# ADR 0002 — Bilingüe sin rutas: el idioma se elige en el navegador

- **Estado**: sustituida por el [ADR 0006](0006-idioma-en-la-url.md)
- **Fecha**: 2026-09-17 (escrita a posteriori, el 2026-11-05)

## Contexto

La web está en español y en inglés. El diseño de partida duplicaba el marcado de cada texto y
ocultaba un idioma con CSS, así que un lector de pantalla oía los dos.

## Decisión

Una sola página. Cada texto es un par `{ es, en }` y `t()` elige uno según un estado global
(`lang.current`). El idioma inicial sale de `localStorage` y, si no hay nada guardado, de
`navigator.language`. El selector ES/EN cambia ese estado y `<html lang>` le sigue.

## Consecuencias

- Una ruta y un HTML. Los componentes no duplican marcado y la tecnología de asistencia solo
  recibe un idioma.
- El HTML prerenderizado siempre es español. Un buscador no ve nunca la versión inglesa, y no hay
  URL que compartir en inglés.
- Un visitante con el navegador en inglés ve un destello en español hasta que hidrata la página.

Las dos últimas son las que llevaron al ADR 0006.
