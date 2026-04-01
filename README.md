# Legend in the Mist App

Static web prototype for a visual tabletop inspired by *Legend in the Mist*, with support for character sheets, theme cards, status cards, narrative tags, and experimental *Downcrawl* content on a freeform canvas.

Prototipo web estatico de una mesa visual inspirada en *Legend in the Mist*, con soporte para hojas de personaje, tarjetas de tema, tarjetas de estado, etiquetas narrativas y contenido experimental de *Downcrawl* sobre un lienzo libre.

## English

### Overview

This project is currently a single-file HTML application focused on quick prototyping and play support without a build step or backend.

The main app lives in `tracking-cards-dark-app.html`.

### Current Features

- Freeform board with pan and zoom
- Zoom range from `10%` to `200%`
- Right-click panning inspired by whiteboard tools
- Hidden scrollbars for a cleaner presentation
- Light and dark theme toggle
- Local persistence with `localStorage`
- JSON export and import
- Floating creation menu for board pieces
- `2d6` dice tray with result bands and persistent last roll
- Roll modifiers collected from cards and tags on the board
- Multiple card types for `Legend in the Mist`
- Experimental `Downcrawl` module with extra cards and decks
- Multi-selection, inline editing, contextual delete action, and board centering

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
5. Use the top-right controls for zoom, board centering, and the `2d6` dice tray.

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
- Cambio entre tema claro y oscuro
- Persistencia local mediante `localStorage`
- Exportacion e importacion en JSON
- Menu flotante para crear piezas del tablero
- Bandeja de dados `2d6` con rangos de resultado y ultima tirada persistente
- Modificadores de tirada tomados de tarjetas y etiquetas del tablero
- Varios tipos de tarjeta para `Legend in the Mist`
- Modulo experimental de `Downcrawl` con cartas y barajas extra
- Seleccion multiple, edicion inline, borrado contextual y centrado del tablero

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
5. Usa los controles superiores derechos para zoom, centrado del tablero y bandeja de dados `2d6`.

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
