import { TableEntry } from './table/types';

/** Cleans a filename or raw string into a title-cased display name. */
export function cleanName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/%20/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

/** Derives a display name from a file path, stripping extension and path components. */
export function nameFromFile(filePath: string): string {
  const withoutExt = filePath.replace(/\.[^.]+$/, '');
  const basename = withoutExt.split('/').pop() ?? withoutExt;
  return cleanName(basename);
}

/**
 * Splits a result text string on the ### delimiter.
 *   "Temple Name ### A description" → { name: "Temple Name", description: "A description" }
 *   "A description"                 → { name: "",             description: "A description" }
 */
export function parseResultText(text: string): { name: string; description: string } {
  const parts = text.split('###');
  if (parts.length >= 2) {
    return {
      name: parts[0].trim(),
      description: parts.slice(1).join('###').trim(),
    };
  }
  return { name: '', description: text.trim() };
}

/** Builds a TableEntry from a plain text string applying ### splitting. */
export function textToEntry(text: string, index: number): TableEntry {
  const { name, description } = parseResultText(text);
  return { name, description, range: [index + 1, index + 1] };
}
