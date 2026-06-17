# CTTRPG-Engine

**Card TableTop RPG Engine** — a static, single-file web app for a visual
tabletop to play solo RPGs on a freeform canvas. System-agnostic by default,
with optional modules for *Legend in the Mist*, *Espadas & Espectros*, and
*Downcrawl*.

No build. No backend. No database. Open `index.html` and play.

**Read this in:** [English](#english) · [Espanol](#espanol)

> Nota / Note: this documentation is intentionally written in ASCII without
> accents to avoid encoding issues across editors and tools. User-facing text
> with proper accents lives in `i18n/es.xml`.

---

## English

### What it is

A freeform board where you place and edit cards: character sheets, theme and
community cards, status cards, image cards, narrative tags, the modular
*Espadas & Espectros* hero sheet, and the experimental *Downcrawl* content. It
includes a dice tray with board-aware modifiers and an optional 3D dice overlay.
State is saved locally in your browser and can be exported/imported as JSON.

### Quick start

1. Open `index.html` in your browser (no install, no build, no server needed).
2. Optionally enable a module from `Modulos` to unlock its pieces and dice
   rolls — see *Usage* below.

### Usage

1. **Top-left menu:** theme, custom background, language, modules, and JSON
   import/export.
2. **Floating `+` button** (or right-click an empty spot, or `Ctrl+A`) to create
   cards, decks, and tags.
3. **Top-right controls:** zoom, board centering, and the dice tray.
4. **Modules:** enable `Legend in the Mist`, `Espadas & Espectros`, or
   `Downcrawl (Experimental)` from `Modulos` to unlock their pieces and rolls.
   All three are optional; the dice tray always shows the agnostic `Dice` mode
   as a fallback.

### Project structure

| Path | What it is |
|---|---|
| `index.html` | The whole application (HTML + CSS + JS) |
| `dice-3d-engine/` | Externalized 3D dice runtime and vendored libraries |
| `i18n/` | Interface label files (`es.xml` is the base language) |
| `saves/` | Sample exported boards (JSON) |

### Status

Active prototype. Functional, with an intentionally simple architecture while the
interaction model and data format keep evolving.

---

## Espanol

### Que es

Un tablero libre donde colocas y editas tarjetas: hojas de personaje, tarjetas de
tema y comunidad, tarjetas de estado, tarjetas de imagen, etiquetas narrativas,
la ficha modular de *Espadas & Espectros* y el contenido experimental de
*Downcrawl*. Incluye una bandeja de dados con modificadores tomados del tablero y
un overlay opcional de dados 3D. El estado se guarda en el navegador y se puede
exportar/importar como JSON.

### Inicio rapido

1. Abre `index.html` en tu navegador (sin instalacion, sin build, sin servidor).
2. Opcionalmente activa un modulo desde `Modulos` para desbloquear sus piezas y
   tiradas — ver *Uso* abajo.

### Uso

1. **Menu superior izquierdo:** tema, fondo personalizado, idioma, modulos e
   importacion/exportacion JSON.
2. **Boton flotante `+`** (o clic derecho en zona vacia, o `Ctrl+A`) para crear
   tarjetas, barajas y etiquetas.
3. **Controles superiores derechos:** zoom, centrado del tablero y bandeja de
   dados.
4. **Modulos:** activa `Legend in the Mist`, `Espadas & Espectros` o
   `Downcrawl (Experimental)` desde `Modulos` para desbloquear sus piezas y
   tiradas. Los tres son opcionales; la bandeja siempre muestra el modo agnostico
   `Dados` como fallback.

### Estructura del proyecto

| Ruta | Que es |
|---|---|
| `index.html` | La aplicacion completa (HTML + CSS + JS) |
| `dice-3d-engine/` | Motor de dados 3D externalizado y librerias vendorizadas |
| `i18n/` | Archivos de etiquetas de interfaz (`es.xml` es el idioma base) |
| `saves/` | Tableros de ejemplo exportados (JSON) |

### Estado

Prototipo activo. Funcional, con una arquitectura intencionadamente simple
mientras evolucionan el modelo de interaccion y el formato de datos.

---

## License / Licencia

**EN.** This project is free and open source under the [MIT License](LICENSE).
You are welcome to use it, fork it, modify it, and redistribute it, including
for your own variants and extensions — the only condition is keeping the
copyright and license notice (attribution). We plan to keep improving the
project to make it easier to mod and extend over time. Third-party libraries
bundled in `dice-3d-engine/vendor/` (three.js, cannon) keep their own MIT
licenses.

**ES.** Este proyecto es libre y de codigo abierto bajo la
[Licencia MIT](LICENSE). Puedes usarlo, forkearlo, modificarlo y redistribuirlo,
incluso para tus propias variantes y ampliaciones; la unica condicion es
mantener el aviso de copyright y de licencia (atribucion). Tenemos previsto
seguir mejorando el proyecto para que sea cada vez mas facil de modear y
ampliar. Las librerias de terceros incluidas en `dice-3d-engine/vendor/`
(three.js, cannon) conservan sus propias licencias MIT.

---

## Game content & intellectual property / Contenido de juego y propiedad intelectual

**EN.** This is an **unofficial, fan-made tool**. The MIT license above covers
**only the software in this repository** (code, layout, styles). It does **not**
grant any rights over the tabletop games it supports. What the app implements
are **game rules and mechanics**, which are not protected by copyright. Any
copyrighted or trademarked element — names, original text, artwork, trade dress
of *Legend in the Mist*, *Espadas & Espectros*, *Downcrawl* or any other named
system — belongs to its respective owners, and **all such rights are reserved by
them**. This project is not affiliated with, endorsed by, or sponsored by those
publishers. If you fork or distribute the app, respect each game's community /
fan-content policy and do not include copyrighted material you are not allowed
to share.

**ES.** Esta es una **herramienta no oficial hecha por aficionados**. La licencia
MIT de arriba cubre **solo el software de este repositorio** (codigo, maquetacion,
estilos). **No** concede ningun derecho sobre los juegos de mesa que soporta. Lo
que la app implementa son **reglas y mecanicas de juego**, que no estan protegidas
por copyright. Cualquier elemento con copyright o marca registrada —nombres,
textos originales, arte, identidad visual de *Legend in the Mist*,
*Espadas & Espectros*, *Downcrawl* o cualquier otro sistema mencionado—
pertenece a sus respectivos duenos, y **todos esos derechos quedan reservados por
ellos**. Este proyecto no esta afiliado, avalado ni patrocinado por dichas
editoriales. Si forkeas o distribuyes la app, respeta la politica de contenido de
fans de cada juego y no incluyas material con copyright que no tengas permiso
para compartir.

---

## Non-profit / Proyecto sin animo de lucro

**EN.** This is a **non-profit project**. The app is and will remain free. If it
ever generates any income, that money will be **reinvested in the project itself
or donated to charitable causes, with full transparency** about what was
received and where it went.

**ES.** Este es un **proyecto sin animo de lucro**. La app es y seguira siendo
gratuita. Si en algun momento generara ingresos, ese dinero se **reinvertira en
el propio proyecto o se donara a causas beneficas, con total transparencia**
sobre lo recibido y su destino.


