# ADR 0006 — El idioma va en la URL: español en la raíz, inglés bajo `/en`

- **Estado**: aceptada
- **Fecha**: 2026-11-05
- **Sustituye**: [ADR 0002](0002-i18n-sin-routing.md)

## Contexto

Con el ADR 0002 el HTML prerenderizado era siempre español. Google no indexaba la versión
inglesa, un enlace no podía apuntar al inglés y quien tenía el navegador en inglés veía un
destello en español. El blog empeoraba el problema: cada artículo en inglés era invisible para
los buscadores.

## Decisión

- Todas las páginas cuelgan de `src/routes/[[lang=lang]]/`. El español, idioma por defecto, va
  sin prefijo (`/`, `/blog/<slug>`) y el inglés bajo `/en` (`/en`, `/en/blog/<slug>`). El
  matcher solo acepta los idiomas con prefijo, así que `/es` da 404 y no hay contenido duplicado.
- Cada página se prerenderiza una vez por idioma. Lleva `<html lang>` (desde `hooks.server.ts`),
  canonical propio y enlaces `hreflang` a su traducción, con el español como `x-default`. El
  sitemap repite esas alternativas con `xhtml:link`, y cada feed RSS enlaza a su idioma.
- `t()` lee el idioma de la ruta (`page.params.lang`), tanto en el prerender como en el
  navegador. No hay estado de idioma que sincronizar.
- Las rutas se construyen con funciones puras del dominio (`localePath`, `langOfPath`,
  `unlocalizedPath`, `alternatePaths`), nunca a mano.
- El selector ES/EN son dos enlaces a la misma página en cada idioma. Una elección explícita se
  guarda en `localStorage` y en la siguiente visita lleva a ese idioma. `navigator.language` no
  se usa: Googlebot se anuncia en inglés y acabaría redirigido fuera de las páginas en español.

## Consecuencias

- Las dos versiones son rastreables y compartibles, y el destello desaparece.
- El build genera el doble de páginas. Con este tamaño de sitio son segundos.
- Firebase sirve `/en` desde `en.html`, junto a la carpeta `en/` de posts y feed. Se comprobó con
  `superstatic`, el servidor que usa Firebase: `/en` da 200, `/en/` redirige a `/en` y `/es` da 404.
- Añadir un idioma, además de lo que pide el ADR 0005, solo requiere ampliar `LOCALES`: las rutas,
  el matcher y las alternativas salen de ahí.
