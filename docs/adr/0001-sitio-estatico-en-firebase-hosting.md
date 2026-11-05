# ADR 0001 — Sitio estático prerenderizado, servido desde Firebase Hosting

- **Estado**: aceptada
- **Fecha**: 2026-09-17 (escrita a posteriori, el 2026-11-05)

## Contexto

Es un portfolio personal: una página larga, un blog que empieza vacío y tráfico bajo. El
contenido cambia pocas veces al mes. La versión anterior era una app React con renderizado en
cliente, y la home llegaba en blanco hasta ejecutar el JavaScript.

## Decisión

SvelteKit con `adapter-static` y `prerender = true` en todas las rutas. El build genera HTML,
CSS y JS fijos en `apps/web/build/`, y Firebase Hosting los sirve desde su CDN.

`firebase.json` no tiene rewrites. Cada ruta es un fichero (`cleanUrls` sirve `/blog/x` desde
`blog/x.html`), así que una URL que no existe recibe `404.html` con estado 404 y no la home con
un 200.

## Consecuencias

- No hay servidor que mantener ni que pagar. El plan gratuito de Firebase sobra para este tráfico.
- El primer pintado no espera a ningún JavaScript. Lighthouse da 98–100 en las cuatro categorías.
- Todo cambio de contenido pasa por un build y un deploy, unos dos minutos. Con la frecuencia de
  cambio de este sitio no importa.
- Lo que dependa de la petición (idioma por cabecera, formularios con backend) no cabe. Por eso el
  idioma acabó en la URL: [ADR 0006](0006-idioma-en-la-url.md).
