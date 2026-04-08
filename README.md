#  CTTRPG-Engine

Card TableTop RPG Engine - Static web prototype for a visual tabletop inspired by *Legend in the Mist*, with support for character sheets, theme cards, status cards, image cards, narrative tags, the modular *Espadas & Espectros* hero sheet, and experimental *Downcrawl* content on a freeform canvas.

Card TableTop RPG Engine - Prototipo web estatico de una mesa visual inspirada en *Legend in the Mist*, con soporte para hojas de personaje, tarjetas de tema, tarjetas de estado, tarjetas de imagen, etiquetas narrativas, la ficha modular de *Espadas & Espectros* y contenido experimental de *Downcrawl* sobre un lienzo libre.

## English

### Overview

This project is currently a static HTML-first application focused on quick prototyping and play support without a build step or backend.

The main app lives in `index.html`.

### Current Features

- Freeform board with pan and zoom
- Zoom range from `10%` to `200%`
- Right-click panning inspired by whiteboard tools
- Hidden scrollbars for a cleaner presentation
- Theme selector with dark, light, and print-friendly grayscale modes
- Local persistence with `localStorage`
- JSON export and import
- Floating creation menu for board pieces
- Floating creation menu with `Sistema`, `Legend in the Mist`, optional `Espadas & Espectros`, and optional `Downcrawl` sections
- `Sistema` creation menu with an `Imagen` card that opens the browser file picker, creates the card only after a valid image is selected, keeps the image visible by itself, and uses the original image size as the initial node size
- `Legend in the Mist` creation menu with hero, theme, community, status, and tag cards
- Optional `Espadas & Espectros` module with a large hero area and internal cards for hero data, attributes plus notes/experience, and equipment
- `Espadas & Espectros` hero sheet with three fixed internal cards, independent resize handles, persistent tracks, and checks that stay interactive outside inline editing
- `Espadas & Espectros` inline editing stays contained inside each internal card, using internal scrolling instead of letting controls spill outside the panel
- `Espadas & Espectros` hero sheet with custom `Vida`, `Armadura`, and `Tesoros` marks, progressive `Experiencia` (`30` slots with visible `actual/30` counter), and burnout styling aligned with other sheets when attributes or equipment are exhausted
- Theme and community cards with a back side for editable special improvements
- Front-side special improvements button with live count on theme and community cards
- Incremental progress checks for `Abandon`, `Improve`, and `Milestone` on theme and community cards
- Dice tray with a persistent system selector for `Legend in the Mist`, optional `Espadas & Espectros`, and `Downcrawl`
- Optional `3D Dice` mode with a full-screen overlay, physical `d6` rolls, a persistent on/off toggle in `Modules`, and a dedicated sidebar settings card for die color, visible edge color, pip/number color, and face style
- Persistent last roll plus shared modifier controls for both tray variants
- The regular dice tray always keeps numeric faces for readability; the `Pips / Number` appearance setting only affects the `3D Dice` overlay and is disabled when `3D Dice` is turned off
- `Espadas & Espectros` dice tray with a `Tirada de Movimiento` roll type that uses `2d6` and treats the total directly as movement in meters
- `Espadas & Espectros` dice tray with a `Tirada de atributo` roll type that lets you choose hero, attribute, and `Normal / Ventaja / Desventaja`, then resolves success or failure against the chosen attribute
- `Downcrawl` dice tray with a `Terminar Aventura` roll type that requires selecting an adventure card, only unlocks when all non-final milestones are already resolved, and adds a locked milestone-based power modifier
- `Downcrawl` dice tray with an `Avanzar aventura` roll type that requires an unfinished adventure plus one hero and one hero stat, and updates both the milestone and the chosen stat after the roll
- `Downcrawl` dice tray with a guided `Afrontar un desafio` roll type, variable difficulty, extra dice with discard rules, mandatory hero + stat selection, and a `7-` push flow with `Conservar tu fuerza` and `Momento fatidico`
- Roll modifiers collected from cards and tags on the board
- Dice tray kept at full viewport height, with active modifiers stacked without stretching
- Board navigation remains available while the dice tray is open so power tags can be found and added
- Multiple card types for `Legend in the Mist`
- Experimental `Downcrawl` module with hero cards, extra cards, decks, and a note card with notes on both sides
- `Downcrawl` hero cards now track persistent `DESTINO` and `TACK / Inteligencia` counters, auto-mark the used stat when facing a challenge, let hero aspects grant `+2` while striking them out, and recycle all four used marks into `+1 DESTINO`
- All `Downcrawl` cards that are not decks can be flipped to a back side with editable notes
- `Downcrawl` creation options disappear from the `+` menu when the module is disabled
- Multi-selection, inline editing, contextual delete action, and board centering
- Inline editing remains available on `Legend in the Mist` cards even after the first click re-renders selection state

### Project Structure

- `index.html`: main application
- `dice-3d-engine/`: external `3D` dice runtime, styles, and vendored libraries

### How to Use

1. Clone or download this repository.
2. Open `index.html` in your browser.
3. Use the top-left menu for theme, modules, and JSON import/export.
4. Use the floating `+` button to create cards, decks, and tags.
   The first section is `Sistema`, which includes `Imagen`; selecting it opens the browser picker and creates an image card only when a valid image file is chosen.
   In `Legend in the Mist`, this includes hero, theme, community, status, and tag cards.
   If `Espadas & Espectros` is enabled from `Modulos`, the same menu adds its hero sheet.
5. Theme and community cards show a `Special Improvements (N)` button on the front. Use it to flip to the back side, where you can add, edit, and remove special improvements with title and description.
6. Theme and community `Abandon`, `Improve`, and `Milestone` checks work as left-to-right incremental progress tracks.
7. Use the top-right controls for zoom, board centering, and the dice tray.
   If `Espadas & Espectros` is enabled, the tray also offers its system selector entry, a `Tirada de Movimiento` that rolls `2d6` for movement in meters, and a `Tirada de atributo` with `Normal`, `Ventaja`, and `Desventaja`.
   In `Downcrawl`, select an adventure card before using `Terminar Aventura`; it only becomes available when every milestone before the final one is already resolved. For `Avanzar aventura`, choose one hero and then one hero stat. For `Afrontar un desafio`, choose difficulty, hero, and stat; the tray rolls the right number of `d6`, shows discarded dice, marks the used stat, lets struck hero aspects add `+2`, and if you stay below `8` it offers the remaining push choices from the move until you succeed or accept the failure.
   If `3D Dice` is enabled, the left menu shows a dedicated settings card for the `3D` overlay only: die color, edge color, pip/number color, and whether the `3D` faces use pips or numerals.
8. If `Downcrawl (Experimental)` is disabled from `Modulos`, its creation options disappear from the floating `+` menu and the dice tray falls back to `Legend in the Mist`.
   If `Espadas & Espectros` is disabled from `Modulos`, its hero sheet also disappears from the floating `+` menu and existing sheets from that module are removed from the board.

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

Este proyecto es actualmente una aplicacion estatica centrada en HTML, orientada a prototipado rapido y soporte de juego sin proceso de build ni backend.

La app principal esta en `index.html`.

### Funcionalidades actuales

- Tablero libre con pan y zoom
- Zoom entre `10%` y `200%`
- Desplazamiento con boton derecho inspirado en herramientas tipo pizarra
- Barras de scroll ocultas para una presentacion mas limpia
- Selector de tema con modos oscuro, claro y escala de grises para impresion
- Persistencia local mediante `localStorage`
- Exportacion e importacion en JSON
- Menu flotante para crear piezas del tablero
- Menu flotante de creacion con secciones `Sistema`, `Legend in the Mist`, `Espadas & Espectros` opcional y `Downcrawl` opcional
- Menu `Sistema` con tarjeta `Imagen` que abre el selector del navegador, solo crea la tarjeta al elegir una imagen valida, muestra solo la imagen y usa el tamano original del archivo como tamano inicial
- Menu `Legend in the Mist` con tarjeta de heroe, tarjeta de tema, tarjeta de comunidad, tarjeta de estado y etiquetas
- Modulo opcional `Espadas & Espectros` con una ficha de heroe amplia, compuesta por tres tarjetas internas: ficha principal, atributos con notas/experiencia y equipo
- La ficha de `Espadas & Espectros` usa resize independiente por tarjeta, tracks persistentes y checks interactivos tambien fuera de la edicion inline
- La edicion inline de `Espadas & Espectros` queda contenida dentro de cada tarjeta interna, con scroll interno en vez de desbordar controles fuera del panel
- La ficha de `Espadas & Espectros` incluye marcas propias para `Vida`, `Armadura` y `Tesoros`, una `Experiencia` progresiva de `30` casillas con contador `actual/30` y estados quemados en rojo para atributos y equipo agotado
- Tarjetas de tema y comunidad con reverso para mejoras especiales editables
- Boton frontal de mejoras especiales con contador en tarjetas de tema y comunidad
- Checks incrementales de `Abandono`, `Mejora` e `Hito` en tarjetas de tema y comunidad
- Bandeja de dados con selector persistente de sistema entre `Legend in the Mist`, `Espadas & Espectros` opcional y `Downcrawl`
- Modo opcional de `Dados 3D` con overlay a pantalla completa, tiradas fisicas de `d6`, toggle persistente dentro de `Modulos` y tarjeta dedicada en el menu izquierdo para color del dado, color visible del contorno, color de puntos o numeros y estilo de la cara
- Ultima tirada persistente y controles compartidos de modificadores para ambas variantes del lanzador
- La bandeja normal de dados mantiene siempre caras numericas por legibilidad; el ajuste `Puntos / Numero` solo afecta al overlay de `Dados 3D` y se desactiva cuando el `3D` esta apagado
- Bandeja de `Espadas & Espectros` con `Tirada de Movimiento`, que usa `2d6` y trata la suma como metros de movimiento
- Bandeja de `Espadas & Espectros` con `Tirada de atributo`, que permite elegir heroe, atributo y modo `Normal / Ventaja / Desventaja`, y resuelve exito o fracaso comparando el dado conservado con el valor del atributo
- Bandeja `Downcrawl` con tipo de tirada `Terminar Aventura`, que exige seleccionar una carta de aventura, solo se habilita cuando todos los hitos no finales ya estan resueltos y anade un modificador bloqueado de PODER segun el balance de hitos
- Bandeja `Downcrawl` con tipo de tirada `Avanzar aventura`, que exige una aventura sin terminar, un heroe y una estadistica de ese heroe, y actualiza tanto el hito como la estadistica tras resolver la tirada
- Bandeja `Downcrawl` con tipo de tirada guiada `Afrontar un desafio`, dificultad variable, dados extra con descarte, seleccion obligatoria de heroe y estadistica, y flujo de empuje para `7-` sin boton de `Punto de ruptura`
- Modificadores de tirada tomados de tarjetas y etiquetas del tablero
- Bandeja de dados a altura completa del viewport, con modificadores activos apilados sin estirarse
- El tablero sigue siendo navegable mientras la bandeja de dados esta abierta para buscar y anadir etiquetas de poder
- Varios tipos de tarjeta para `Legend in the Mist`
- Modulo experimental de `Downcrawl` con heroes, cartas, una tarjeta de nota con notas en ambos lados y barajas extra
- La ficha de heroe `Downcrawl` incluye ahora contadores persistentes de `DESTINO` y `TACK / Inteligencia`, marca de uso automatica al tirar, aspectos que aportan `+2` al tacharse y reciclado de los 4 checks derechos para ganar `+1 DESTINO`
- Todas las cartas `Downcrawl` que no son baraja pueden girarse a un dorso con notas editables
- Las opciones de creacion de `Downcrawl` desaparecen del menu `+` cuando el modulo esta desactivado
- Seleccion multiple, edicion inline, borrado contextual y centrado del tablero
- La edicion inline sigue disponible en tarjetas `Legend in the Mist` aunque el primer clic rerenderice la seleccion

### Estructura del proyecto

- `index.html`: aplicacion principal
- `dice-3d-engine/`: runtime externo de dados `3D`, estilos y librerias vendorizadas

### Como usarlo

1. Clona o descarga este repositorio.
2. Abre `index.html` en tu navegador.
3. Usa el menu superior izquierdo para tema, modulos e importacion/exportacion JSON.
4. Usa el boton flotante `+` para crear tarjetas, barajas y etiquetas.
   La primera seccion es `Sistema`, que incluye `Imagen`; al elegirla se abre el selector del navegador y la tarjeta solo se crea si eliges un archivo de imagen valido.
   En `Legend in the Mist`, incluye tarjeta de heroe, tema, comunidad, estado y etiquetas.
   Si activas `Espadas & Espectros` desde `Modulos`, el menu tambien anade su ficha de heroe.
5. Las tarjetas de tema y comunidad muestran en el anverso un boton `Mejoras especiales (N)`. Usalo para girar al reverso y anadir, editar o eliminar mejoras especiales con titulo y descripcion.
6. Los checks de `Abandono`, `Mejora` e `Hito` en tema y comunidad funcionan como progreso incremental de izquierda a derecha.
7. Usa los controles superiores derechos para zoom, centrado del tablero y bandeja de dados.
   Si activas `Espadas & Espectros`, la bandeja tambien muestra su sistema, una `Tirada de Movimiento` que tira `2d6` para obtener metros de movimiento, y una `Tirada de atributo` con `Normal`, `Ventaja` y `Desventaja`.
   En `Downcrawl`, selecciona antes una carta de aventura para usar `Terminar Aventura`; solo se habilita cuando todos los hitos anteriores al final ya estan resueltos. Para `Avanzar aventura`, elige antes un heroe y despues una estadistica de ese heroe. Para `Afrontar un desafio`, escoge dificultad, heroe y estadistica; la bandeja tira los `d6` necesarios, marca los descartes, marca el uso de la estadistica, permite sumar `+2` con aspectos del heroe al tacharlos y, si sigues por debajo de `8`, ofrece las opciones restantes para seguir empujando o aceptar el fallo.
   Si activas `Dados 3D`, el menu izquierdo muestra una tarjeta de ajustes visuales solo para el overlay `3D`: color del dado, color del contorno, color de puntos o numeros y si las caras `3D` usan puntos o cifras.
8. Si desactivas `Downcrawl (Experimental)` desde `Modulos`, sus opciones de creacion dejan de mostrarse en el boton flotante `+` y la bandeja vuelve automaticamente a `Legend in the Mist`.
   Si desactivas `Espadas & Espectros` desde `Modulos`, su ficha de heroe deja de mostrarse en el boton `+` y las fichas existentes de ese modulo se purgan del tablero.

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
