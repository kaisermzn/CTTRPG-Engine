# i18n — Guía para añadir un nuevo idioma

La app usa un sistema propio de claves `@Modulo:Identificador` con 4 puntos de sincronía
que deben mantenerse en paridad. Actualmente hay **649 claves** en `es.xml` / `en.xml`.

---

## Añadir un idioma en 4 pasos

### 1. Genera el scaffold

```bash
node i18n/audit.mjs --new=an
```

Crea `i18n/an.xml` con todas las claves marcadas `[[TODO]]`. Cada `[[TODO]]` es
un texto a traducir desde el español (`es.xml`).

### 2. Traduce los `[[TODO]]`

Abre `i18n/an.xml` y reemplaza cada `[[TODO]]` con la traducción al nuevo idioma.
Mantén los placeholders `{var}` intactos (p. ej. `{count}`, `{name}`, `{hex}`).

### 3. Añade el bloque fallback en `index.html`

El fallback se usa cuando la app se abre por `file://` y `fetch()` no funciona.
Copia el bloque `i18n-fallback-es` de `index.html` y pégalo justo después del bloque
`i18n-fallback-en`, cambiando el id:

```html
<script type="application/xml" id="i18n-fallback-an"><?xml version="1.0" encoding="UTF-8"?>
<labels>
  <!-- pega aquí el contenido de i18n/an.xml -->
</labels></script>
```

### 4. Habilita el idioma en el selector

En `index.html`, busca `I18N_ENABLED_LANGS` (aprox. línea 6090) y añade el código:

```javascript
const I18N_ENABLED_LANGS = ['es', 'en', 'an'];
```

Añade también la opción al `<select id="languageSelect">` en el HTML:

```html
<option value="an">Aragonés</option>
```

---

## Verificar después de cualquier cambio

```bash
node i18n/audit.mjs
```

Sale con código 0 si todo está en sync (paridad es/en/…, fallbacks coinciden con XMLs).
Sale con código 1 si hay claves faltantes o desincronizadas.

---

## Reglas del sistema

| Regla | Detalle |
|---|---|
| Clave nueva → 4 sitios | `es.xml`, `en.xml`, bloque `i18n-fallback-es`, bloque `i18n-fallback-en` |
| Patrón de clave | `@Modulo:Identificador` — nunca espacios ni caracteres especiales |
| Placeholders | `{nombre}` en el texto, pasados como `t('@Clave', { nombre: valor })` |
| Nombres propios | No se traducen: `Legend`, `Downcrawl`, `Espadas & Espectros`, `Sliver of Fate` |
| Claves de lógica | No se traducen: `'hero'`, `'folk-deck'`, `'known'`, `'advantage'`, etc. |
