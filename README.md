#  CTTRPG-Engine

Card TableTop RPG Engine - Static web prototype for a visual tabletop inspired by *Legend in the Mist*, with support for character sheets, theme cards, status cards, narrative tags, and experimental *Downcrawl* content on a freeform canvas.

Card TableTop RPG Engine - Prototipo web estatico de una mesa visual inspirada en *Legend in the Mist*, con soporte para hojas de personaje, tarjetas de tema, tarjetas de estado, etiquetas narrativas y contenido experimental de *Downcrawl* sobre un lienzo libre.

## English

### Overview

This project is currently a single-file HTML application focused on quick prototyping and play support without a build step or backend.

The main app lives in `tracking-cards-dark-app.html`.

### Current Features

- Freeform board with pan and zoom
- Zoom range from `10%` to `200%`
- Right-click panning inspired by whiteboard tools
- Hidden scrollbars for a cleaner presentation
- Theme selector with dark, light, and print-friendly grayscale modes
- Local persistence with `localStorage`
- JSON export and import
- Floating creation menu for board pieces
- `Legend in the Mist` creation menu with hero, theme, community, status, and tag cards
- Theme and community cards with a back side for editable special improvements
- Front-side special improvements button with live count on theme and community cards
- Incremental progress checks for `Abandon`, `Improve`, and `Milestone` on theme and community cards
- `2d6` dice tray with a persistent system selector for `Legend in the Mist` and `Downcrawl`
- Persistent last roll plus shared modifier controls for both tray variants
- `Downcrawl` dice tray with a `Terminar Aventura` roll type that requires selecting an adventure card, only unlocks when all non-final milestones are already resolved, and adds a locked milestone-based power modifier
- `Downcrawl` dice tray with an `Avanzar aventura` roll type that requires an unfinished adventure plus one hero and one hero stat, and updates both the milestone and the chosen stat after the roll
- `Downcrawl` dice tray with a guided `Afrontar un desafio` roll type, variable difficulty, extra dice with discard rules, mandatory hero + stat selection, and a `7-` push flow with `Conservar tu fuerza`, `Momento fatidico`, and `Punto de ruptura`
- Roll modifiers collected from cards and tags on the board
- Dice tray kept at full viewport height, with active modifiers stacked without stretching
- Board navigation remains available while the dice tray is open so power tags can be found and added
- Multiple card types for `Legend in the Mist`
- Experimental `Downcrawl` module with hero cards, extra cards, decks, and a note card with notes on both sides
- `Downcrawl` hero cards now track persistent `DESTINO` and `TACK / Inteligencia` counters, auto-mark the used stat when facing a challenge, and recycle all four used marks into `+1 DESTINO`
- All `Downcrawl` cards that are not decks can be flipped to a back side with editable notes
- `Downcrawl` creation options disappear from the `+` menu when the module is disabled
- Multi-selection, inline editing, contextual delete action, and board centering
- Inline editing remains available on `Legend in the Mist` cards even after the first click re-renders selection state

### Project Structure

- `tracking-cards-dark-app.html`: main application
- `APP.md`: current product and feature notes
- `PLAN.md`: project direction
- `TODO.TXT`: working backlog
- `HISTORIAL.MD`: recent change log
- `AGENTS.md`: agent collaboration context

### How to Use

1. Clone or download this repository.
2. Open `tracking-cards-dark-app.html` in your browser.
3. Use the top-left menu for theme, modules, and JSON import/export.
4. Use the floating `+` button to create cards, decks, and tags.
   In `Legend in the Mist`, this includes hero, theme, community, status, and tag cards.
5. Theme and community cards show a `Special Improvements (N)` button on the front. Use it to flip to the back side, where you can add, edit, and remove special improvements with title and description.
6. Theme and community `Abandon`, `Improve`, and `Milestone` checks work as left-to-right incremental progress tracks.
7. Use the top-right controls for zoom, board centering, and the `2d6` dice tray.
   In `Downcrawl`, select an adventure card before using `Terminar Aventura`; it only becomes available when every milestone before the final one is already resolved. For `Avanzar aventura`, choose one hero and then one hero stat. For `Afrontar un desafio`, choose difficulty, hero, and stat; the tray rolls the right number of `d6`, shows discarded dice, marks the used stat, and if you stay below `8` it offers the push choices from the move until you succeed or accept the failure.
8. If `Downcrawl (Experimental)` is disabled from `Modulos`, its creation options disappear from the floating `+` menu and the dice tray falls back to `Legend in the Mist`.

### Technical Notes

- No backend
- No build process
- No external database
- State is stored locally in the browser
- Best suited for local prototyping and manual testing

### Status

This repository is an active prototype. The app is functional, but the architecture is intentionally simple while the interaction model and data format continue to evolve.

## Espanol

### Resumen

Este proyecto es actualmente una aplicacion HTML de un solo archivo, centrada en prototipado rapido y soporte de juego sin proceso de build ni backend.

La app principal esta en `tracking-cards-dark-app.html`.

### Funcionalidades actuales

- Tablero libre con pan y zoom
- Zoom entre `10%` y `200%`
- Desplazamiento con boton derecho inspirado en herramientas tipo pizarra
- Barras de scroll ocultas para una presentacion mas limpia
- Selector de tema con modos oscuro, claro y escala de grises para impresion
- Persistencia local mediante `localStorage`
- Exportacion e importacion en JSON
- Menu flotante para crear piezas del tablero
- Menu `Legend in the Mist` con tarjeta de heroe, tarjeta de tema, tarjeta de comunidad, tarjeta de estado y etiquetas
- Tarjetas de tema y comunidad con reverso para mejoras especiales editables
- Boton frontal de mejoras especiales con contador en tarjetas de tema y comunidad
- Checks incrementales de `Abandono`, `Mejora` e `Hito` en tarjetas de tema y comunidad
- Bandeja de dados `2d6` con selector persistente de sistema entre `Legend in the Mist` y `Downcrawl`
- Ultima tirada persistente y controles compartidos de modificadores para ambas variantes del lanzador
- Bandeja `Downcrawl` con tipo de tirada `Terminar Aventura`, que exige seleccionar una carta de aventura, solo se habilita cuando todos los hitos no finales ya estan resueltos y anade un modificador bloqueado de PODER segun el balance de hitos
- Bandeja `Downcrawl` con tipo de tirada `Avanzar aventura`, que exige una aventura sin terminar, un heroe y una estadistica de ese heroe, y actualiza tanto el hito como la estadistica tras resolver la tirada
- Bandeja `Downcrawl` con tipo de tirada guiada `Afrontar un desafio`, dificultad variable, dados extra con descarte, seleccion obligatoria de heroe y estadistica, y flujo de empuje para `7-`
- Modificadores de tirada tomados de tarjetas y etiquetas del tablero
- Bandeja de dados a altura completa del viewport, con modificadores activos apilados sin estirarse
- El tablero sigue siendo navegable mientras la bandeja de dados esta abierta para buscar y anadir etiquetas de poder
- Varios tipos de tarjeta para `Legend in the Mist`
- Modulo experimental de `Downcrawl` con heroes, cartas, una tarjeta de nota con notas en ambos lados y barajas extra
- La ficha de heroe `Downcrawl` incluye ahora contadores persistentes de `DESTINO` y `TACK / Inteligencia`, marca de uso automatica al tirar y reciclado de los 4 checks derechos para ganar `+1 DESTINO`
- Todas las cartas `Downcrawl` que no son baraja pueden girarse a un dorso con notas editables
- Las opciones de creacion de `Downcrawl` desaparecen del menu `+` cuando el modulo esta desactivado
- Seleccion multiple, edicion inline, borrado contextual y centrado del tablero
- La edicion inline sigue disponible en tarjetas `Legend in the Mist` aunque el primer clic rerenderice la seleccion

### Estructura del proyecto

- `tracking-cards-dark-app.html`: aplicacion principal
- `APP.md`: notas de producto y funcionalidades actuales
- `PLAN.md`: direccion del proyecto
- `TODO.TXT`: backlog de trabajo
- `HISTORIAL.MD`: registro de cambios recientes
- `AGENTS.md`: contexto de colaboracion para agentes

### Como usarlo

1. Clona o descarga este repositorio.
2. Abre `tracking-cards-dark-app.html` en tu navegador.
3. Usa el menu superior izquierdo para tema, modulos e importacion/exportacion JSON.
4. Usa el boton flotante `+` para crear tarjetas, barajas y etiquetas.
   En `Legend in the Mist`, incluye tarjeta de heroe, tema, comunidad, estado y etiquetas.
5. Las tarjetas de tema y comunidad muestran en el anverso un boton `Mejoras especiales (N)`. Usalo para girar al reverso y anadir, editar o eliminar mejoras especiales con titulo y descripcion.
6. Los checks de `Abandono`, `Mejora` e `Hito` en tema y comunidad funcionan como progreso incremental de izquierda a derecha.
7. Usa los controles superiores derechos para zoom, centrado del tablero y bandeja de dados `2d6`.
   En `Downcrawl`, selecciona antes una carta de aventura para usar `Terminar Aventura`; solo se habilita cuando todos los hitos anteriores al final ya estan resueltos. Para `Avanzar aventura`, elige antes un heroe y despues una estadistica de ese heroe. Para `Afrontar un desafio`, escoge dificultad, heroe y estadistica; la bandeja tira los `d6` necesarios, marca los descartes, marca el uso de la estadistica y, si sigues por debajo de `8`, ofrece las opciones para seguir empujando o aceptar el fallo.
8. Si desactivas `Downcrawl (Experimental)` desde `Modulos`, sus opciones de creacion dejan de mostrarse en el boton flotante `+` y la bandeja vuelve automaticamente a `Legend in the Mist`.

### Notas tecnicas

- Sin backend
- Sin proceso de build
- Sin base de datos externa
- El estado se guarda en local en el navegador
- Pensado sobre todo para prototipado local y pruebas manuales

### Estado

Este repositorio es un prototipo activo. La app ya es funcional, pero la arquitectura sigue siendo intencionadamente simple mientras evolucionan el modelo de interaccion y el formato de datos.

## References / Referencias

- `Character Sheet (Color) - Legend In The Mist RPG.pdf`
- `Tracking Cards (Color) - Legend In The Mist RPG.pdf`
