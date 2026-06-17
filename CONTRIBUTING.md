# Contributing / Como contribuir

Thanks for your interest in CTTRPG-Engine! / Gracias por tu interes en
CTTRPG-Engine.

> This file is written in ASCII without accents on purpose, to avoid encoding
> issues across editors and tools.

---

## English

### Project shape

- The whole app is a single static `index.html` (HTML + CSS + JS). No build, no
  backend, no dependencies to install.
- The only external part is the 3D dice engine in `dice-3d-engine/`.
- Interface text lives in `i18n/` (`es.xml` is the base language; other files
  fall back to it).

### How to run it

Open `index.html` in your browser. That is all. To test changes, edit the file
and reload the page.

### Pull requests

1. Fork the repo and create a branch.
2. Keep changes small and focused; the app is a single file, so a small edit can
   touch UI, styles, and logic at once.
3. Every new visual element (card, sheet, tag, deck) must be styled for the
   three themes: dark, light, and print. If it only looks right in dark mode, it
   is not finished.
4. If you add a new field to a board piece, make sure it survives export/import
   (it must be handled when sanitizing/loading old boards).
5. Validate manually in the browser before opening the PR: create the affected
   piece, edit it, delete it, check zoom/pan/centering, reload for persistence,
   and run an export/import cycle.

### Intellectual property — important

This is an unofficial fan tool. Contributions must implement **game rules and
mechanics only**. Do **not** add copyrighted material you are not allowed to
share: no rulebook text copied verbatim, no official artwork, no logos, and no
proper nouns/place names taken from a game's setting (use generic, invented
examples instead). When in doubt, leave it out. See the IP section in
[`README.md`](README.md).

### License of contributions

By contributing you agree that your contribution is licensed under the project's
[MIT License](LICENSE).

---

## Espanol

### Forma del proyecto

- Toda la app es un unico `index.html` estatico (HTML + CSS + JS). Sin build, sin
  backend, sin dependencias que instalar.
- La unica parte externa es el motor de dados 3D en `dice-3d-engine/`.
- El texto de interfaz vive en `i18n/` (`es.xml` es el idioma base; los demas
  archivos usan ese como fallback).

### Como ejecutarlo

Abre `index.html` en tu navegador. Eso es todo. Para probar cambios, edita el
archivo y recarga la pagina.

### Pull requests

1. Haz un fork del repo y crea una rama.
2. Manten los cambios pequenos y acotados; al ser un solo archivo, una edicion
   pequena puede tocar a la vez UI, estilos y logica.
3. Todo elemento visual nuevo (carta, ficha, etiqueta, baraja) debe estar
   estilizado para los tres temas: oscuro, claro e impresion. Si solo se ve bien
   en oscuro, no esta terminado.
4. Si anades un campo nuevo a una pieza del tablero, asegurate de que sobrevive a
   exportar/importar (debe contemplarse al sanear/cargar tableros antiguos).
5. Valida a mano en el navegador antes de abrir el PR: crea la pieza afectada,
   editala, borrala, comprueba zoom/pan/centrado, recarga para la persistencia y
   haz un ciclo de exportar/importar.

### Propiedad intelectual — importante

Esta es una herramienta de fan no oficial. Las contribuciones deben implementar
**solo reglas y mecanicas de juego**. **No** anadas material con copyright que no
tengas permiso para compartir: nada de texto de manual copiado literalmente, ni
arte oficial, ni logos, ni nombres propios/toponimos del escenario de un juego
(usa ejemplos genericos e inventados en su lugar). En caso de duda, dejalo
fuera. Ver la seccion de propiedad intelectual en [`README.md`](README.md).

### Licencia de las contribuciones

Al contribuir aceptas que tu contribucion queda licenciada bajo la
[Licencia MIT](LICENSE) del proyecto.
