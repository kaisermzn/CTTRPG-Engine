#!/usr/bin/env node
/**
 * i18n/audit.mjs — Auditoría de paridad de claves, sincronía de fallbacks y detección
 * de cadenas en español sin traducir en index.html.
 *
 * Uso:
 *   node i18n/audit.mjs              → auditoría completa (sale con código ≠ 0 si hay errores)
 *   node i18n/audit.mjs --new=an     → genera i18n/an.xml con [[TODO]] para traducir
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const INDEX_HTML = join(ROOT, 'index.html');

// ─── Helpers ────────────────────────────────────────────────────────────────

function readXml(lang) {
  return readFileSync(join(__dir, `${lang}.xml`), 'utf8');
}

function parseKeys(xml) {
  const keys = new Map();
  for (const m of xml.matchAll(/<label key="(@[^"]+)">([^<]*(?:<[^/][^<]*)*?)<\/label>/gs)) {
    keys.set(m[1], m[2]);
  }
  return keys;
}

function extractFallbackBlock(html, lang) {
  const re = new RegExp(
    `<script[^>]+id="i18n-fallback-${lang}"[^>]*>[\\s\\S]*?(<labels[\\s\\S]*?<\\/labels>)[\\s\\S]*?<\\/script>`,
    'i'
  );
  const m = html.match(re);
  return m ? m[1] : null;
}

function getLangs() {
  return readdirSync(__dir)
    .filter(f => f.endsWith('.xml'))
    .map(f => f.replace('.xml', ''));
}

// ─── Paridad de claves ───────────────────────────────────────────────────────

function auditParity(langs, keyMaps) {
  const errors = [];
  const base = 'es';
  const baseKeys = keyMaps.get(base);

  for (const lang of langs) {
    if (lang === base) continue;
    const langKeys = keyMaps.get(lang);
    for (const key of baseKeys.keys()) {
      if (!langKeys.has(key)) errors.push(`[PARITY] ${lang}.xml falta clave: ${key}`);
    }
    for (const key of langKeys.keys()) {
      if (!baseKeys.has(key)) errors.push(`[PARITY] ${lang}.xml tiene clave extra (no está en es.xml): ${key}`);
    }
  }
  return errors;
}

// ─── Sincronía de fallbacks ──────────────────────────────────────────────────

function auditFallbacks(langs, keyMaps, html) {
  const errors = [];
  for (const lang of langs) {
    const block = extractFallbackBlock(html, lang);
    if (!block) {
      errors.push(`[FALLBACK] No se encontró el bloque i18n-fallback-${lang} en index.html`);
      continue;
    }
    const fallbackKeys = parseKeys(block);
    const xmlKeys = keyMaps.get(lang);
    for (const key of xmlKeys.keys()) {
      if (!fallbackKeys.has(key)) errors.push(`[FALLBACK] ${lang}: clave en ${lang}.xml pero no en fallback inline: ${key}`);
    }
    for (const key of fallbackKeys.keys()) {
      if (!xmlKeys.has(key)) errors.push(`[FALLBACK] ${lang}: clave en fallback inline pero no en ${lang}.xml: ${key}`);
    }
  }
  return errors;
}

// ─── Detección de cadenas hardcoded en español ───────────────────────────────

// Identificadores internos (claves de lógica, nombres propios): no se traducen
const WHITELIST = new Set([
  'espadas', 'downcrawl', 'folk', 'volume', 'journey', 'adventure', 'threat',
  'hero', 'tracking', 'theme', 'note', 'image', 'positive-tag', 'negative-tag',
  'Legend', 'Downcrawl', 'Folk', 'Volume', 'Sliver', 'Espadas', 'Espectros',
  'Map Deck', 'Folk Deck', 'Volume Deck', 'Discard Deck', 'Story Deck',
  'normal', 'advantage', 'disadvantage', 'easy', 'tricky', 'difficult', 'foolish',
  'standard', 'movement', 'attribute', 'quick-object',
  'origen', 'aventura', 'grandeza',
  'known', 'sheltered', 'hidden',
  'burden', 'neutral', 'edge',
  'Escape', 'Enter',
]);

function auditHardcoded(html) {
  const errors = [];
  // Only check the JS region (after the last </script> of i18n fallback blocks)
  const jsStart = html.indexOf('getDiceRollProfile');
  if (jsStart < 0) return errors;
  const jsRegion = html.slice(jsStart);

  // Detect Spanish strings: quoted literals with accented chars or common Spanish words
  const spanishPattern = /['"`]([A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ ]{2,}(?:\s+[a-záéíóúüñA-ZÁÉÍÓÚÜÑ]+)*)['"`]/g;
  for (const m of jsRegion.matchAll(spanishPattern)) {
    const text = m[1];
    if (WHITELIST.has(text)) continue;
    if (text.startsWith('@')) continue; // i18n key
    errors.push(`[HARDCODED?] Posible cadena sin traducir: "${text}"`);
  }
  return errors;
}

// ─── Scaffold de nuevo idioma ─────────────────────────────────────────────────

function scaffoldLang(lang, baseKeys) {
  const lines = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<!-- ${lang}.xml — generado por audit.mjs. Reemplaza [[TODO]] con las traducciones. -->`,
    `<labels>`,
  ];
  for (const [key, value] of baseKeys) {
    const placeholder = value.includes('\n')
      ? value.split('\n').map(() => '[[TODO]]').join('\n')
      : '[[TODO]]';
    lines.push(`  <label key="${key}">${placeholder}</label>`);
  }
  lines.push(`</labels>`);
  const out = join(__dir, `${lang}.xml`);
  writeFileSync(out, lines.join('\n'), 'utf8');
  console.log(`✓ Generado ${out} con ${baseKeys.size} claves. Traduce los [[TODO]].`);
  console.log(`  Añade también el bloque <script type="application/xml" id="i18n-fallback-${lang}"> en index.html`);
  console.log(`  y agrega '${lang}' a I18N_ENABLED_LANGS en index.html.`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const newLangArg = process.argv.find(a => a.startsWith('--new='));
if (newLangArg) {
  const lang = newLangArg.split('=')[1];
  const baseKeys = parseKeys(readXml('es'));
  scaffoldLang(lang, baseKeys);
  process.exit(0);
}

const html = readFileSync(INDEX_HTML, 'utf8');
const langs = getLangs();
const keyMaps = new Map(langs.map(l => [l, parseKeys(readXml(l))]));

const parityErrors = auditParity(langs, keyMaps);
const fallbackErrors = auditFallbacks(langs, keyMaps, html);
const hardcodedWarnings = auditHardcoded(html);

const allErrors = [...parityErrors, ...fallbackErrors];

if (parityErrors.length) {
  console.error('\n=== PARIDAD DE CLAVES ===');
  parityErrors.forEach(e => console.error(e));
}
if (fallbackErrors.length) {
  console.error('\n=== SINCRONÍA DE FALLBACKS ===');
  fallbackErrors.forEach(e => console.error(e));
}
if (hardcodedWarnings.length) {
  console.warn('\n=== POSIBLES CADENAS HARDCODED (revisar manualmente) ===');
  hardcodedWarnings.forEach(w => console.warn(w));
}

if (allErrors.length === 0 && hardcodedWarnings.length === 0) {
  console.log(`✓ Auditoría OK: ${langs.length} idiomas, ${keyMaps.get('es').size} claves, fallbacks en sync.`);
} else if (allErrors.length === 0) {
  console.log(`✓ Sin errores críticos. ${hardcodedWarnings.length} advertencias de cadenas hardcoded (ver arriba).`);
}

process.exit(allErrors.length > 0 ? 1 : 0);
