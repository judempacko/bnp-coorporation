/**
 * Nettoyage des textes WordPress (champs REST `*.rendered` + ACF) avant
 * affichage React.
 *
 * WordPress encode les caractères spéciaux en entités HTML dans ses réponses
 * (`&#8211;` = –, `&#8217;` = ', `&amp;` = &…). React affiche les chaînes
 * telles quelles (échappement, pas de décodage) : sans ce décodage, les
 * entités apparaissent littéralement à l'écran, dans les <title> et les metas.
 * Les contenus HTML (excerpt/content) rendus via dangerouslySetInnerHTML ne
 * sont PAS concernés : le navigateur les décode nativement.
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  laquo: '«',
  raquo: '»',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  lsquo: '\u2018',
  rsquo: '\u2019',
  ldquo: '\u201C',
  rdquo: '\u201D',
};

export function decodeHtmlEntities(input: string): string {
  if (!input || input.indexOf('&') === -1) return input;
  return input
    .replace(/&#(\d+);/g, (m, code: string) => {
      const n = parseInt(code, 10);
      return Number.isNaN(n) ? m : String.fromCodePoint(n);
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (m, hex: string) => {
      const n = parseInt(hex, 16);
      return Number.isNaN(n) ? m : String.fromCodePoint(n);
    })
    .replace(/&([a-zA-Z]+);/g, (m, name: string) => NAMED_ENTITIES[name] ?? m);
}

export function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, ' ');
}

/** Texte brut affichable : tags supprimés, entités décodées, espaces normalisés. */
export function cleanWpText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return decodeHtmlEntities(stripTags(input)).replace(/\s+/g, ' ').trim();
}

/**
 * Les titres WP des membres d'équipe sont souvent saisis "Nom – Poste".
 * Sépare le nom (avant le premier tiret espacé) du rôle éventuel, pour ne
 * pas afficher "Nathalie Balla – Président…" dans le champ nom.
 * Ne coupe que sur un tiret entouré d'espaces : les noms à trait d'union
 * ("Jean-Claude") sont préservés.
 */
export function splitNameRole(title: unknown): { name: string; role: string } {
  const clean = cleanWpText(title);
  const parts = clean.split(/\s+[–—-]\s+/);
  if (parts.length < 2) return { name: clean, role: '' };
  return { name: parts[0].trim(), role: parts.slice(1).join(' — ').trim() };
}

/**
 * Découpe un texte riche simple (ACF textarea/WYSIWYG) en paragraphes
 * affichables. Les sauts de ligne (<br>, </p>) sont conservés comme
 * séparateurs ; chaque paragraphe est nettoyé via decode + strip.
 */
export function cleanWpParagraphs(input: unknown): string[] {
  if (typeof input !== 'string') return [];
  const withBreaks = input
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\s*\/\s*p\s*>/gi, '\n')
    .replace(/<\s*\/\s*li\s*>/gi, '\n');
  return decodeHtmlEntities(stripTags(withBreaks))
    .split('\n')
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/** Extrait une année (AAAA) d'un champ libre ("2023", "12/03/2023", 2023…). */
export function extractYear(input: unknown): string | null {
  if (typeof input !== 'string' && typeof input !== 'number') return null;
  const m = String(input).match(/(19|20)\d{2}/);
  return m ? m[0] : null;
}
