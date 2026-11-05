# Decisiones de arquitectura

Cada ADR recoge una decisión, el contexto en que se tomó y lo que implica. Las sustituidas se
conservan: explican por qué el código no es como dicen.

| ADR                                                               | Decisión                                                  | Estado            |
| ----------------------------------------------------------------- | --------------------------------------------------------- | ----------------- |
| [0001](0001-sitio-estatico-en-firebase-hosting.md)                | Sitio estático prerenderizado en Firebase Hosting         | Aceptada          |
| [0002](0002-i18n-sin-routing.md)                                  | Bilingüe sin rutas, idioma elegido en el navegador        | Sustituida (0006) |
| [0003](0003-movimiento-css-scroll-driven-y-js.md)                 | Movimiento: scroll en CSS, puntero y velocidad en JS      | Aceptada          |
| [0004](0004-contenido-en-json-validado-en-la-frontera.md)         | Contenido en JSON validado en la frontera, sin puertos    | Sustituida (0005) |
| [0005](0005-supabase-leido-en-build-con-puertos-y-adaptadores.md) | Supabase leído en build, detrás de puertos y adaptadores  | Aceptada          |
| [0006](0006-idioma-en-la-url.md)                                  | El idioma va en la URL: español en la raíz, inglés en /en | Aceptada          |

Una decisión nueva lleva el siguiente número. Si cambia una anterior, la nueva la sustituye y la
antigua pasa a «Sustituida», sin borrarla.
