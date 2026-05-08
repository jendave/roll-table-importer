import { cleanName, nameFromFile, parseResultText, textToEntry } from '../formatters';
import { addWeight, breakLines, hasWeights, rangeStringMap } from './lineManipulators';
import { hasDieNumber } from './stringInspectors';
import { BasicTable, FoundryTable, TableData, TableEntry } from './types';

export type { TableData, TableEntry, FoundryTable, BasicTable };

// ─── Type guards ─────────────────────────────────────────────────────────────

export function isFoundryTable(table: FoundryTable | BasicTable): table is FoundryTable {
  // A Foundry-style table has object results (with range), not plain strings.
  // formula may be absent and should be inferred.
  const results = (table as FoundryTable).results;
  return Array.isArray(results) && results.length > 0 && typeof results[0] === 'object';
}

export function isCSVTable(data: string): boolean {
  const firstLine = data.split('\n')[0];
  return firstLine.includes('|') || firstLine.includes(',');
}

export function isJSONTable(data: string): boolean {
  try {
    JSON.parse(data);
    return true;
  } catch {
    return false;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formulaFromEntries(entries: TableEntry[]): string {
  return `1d${entries[entries.length - 1].range[1]}`;
}

function wrapDescription(description: string): string {
  if (!description) return '';
  return `<p>${description.replace(/\n/g, '</p><p>').trim()}</p>`;
}

/**
 * Normalises a legacy "text" field (pre-v13) or a current "name"/"description"
 * pair into a TableEntry. Applies ### splitting when reading legacy text.
 */
function normaliseLegacyEntry(entry: {
  range: [number, number];
  text?: string;
  name?: string;
  description?: string;
}): TableEntry {
  if (entry.name !== undefined || entry.description !== undefined) {
    return {
      range: entry.range,
      name: entry.name ?? '',
      description: entry.description ?? '',
    };
  }
  const { name, description } = parseResultText(entry.text ?? '');
  return { range: entry.range, name, description };
}

// ─── JSON parsers ─────────────────────────────────────────────────────────────

export function parseFoundryJSON(table: FoundryTable): TableData {
  const results = table.results.map(normaliseLegacyEntry);
  const formula = table.formula ?? formulaFromEntries(results);
  return {
    name: table.name,
    formula,
    description: wrapDescription(table.description ?? ''),
    results,
  };
}

export function parseBasicJSON(table: BasicTable): TableData {
  const results = table.results.map(textToEntry);
  return {
    name: table.name,
    description: wrapDescription(table.description ?? ''),
    formula: formulaFromEntries(results),
    results,
  };
}

// ─── CSV parser ───────────────────────────────────────────────────────────────

export function parseFromCSV(filename: string, lines: string[]): TableData {
  const results: TableEntry[] = lines.map((line) => {
    const separatorIndex = line.indexOf('|');
    const rangeStr = line.slice(0, separatorIndex);
    const text = line.slice(separatorIndex + 1);
    const { name, description } = parseResultText(text);
    return { name, description, range: rangeStringMap(rangeStr) };
  });
  return {
    name: nameFromFile(filename),
    description: '',
    formula: formulaFromEntries(results),
    results,
  };
}

// ─── TXT parser ───────────────────────────────────────────────────────────────

const trimDieLine = (line: string): string => `1d${line.trim().split(' ')[0].replace('1d', '').replace('d', '')}`;

const entryTxtReduce = (acc: TableEntry[], curr: string): TableEntry[] => {
  if (hasWeights(curr)) {
    const [rangeStr, ...rest] = curr.split(' ');
    const { name, description } = parseResultText(rest.join(' '));
    acc.push({ name, description, range: rangeStringMap(rangeStr) });
  } else if (acc.length > 0) {
    acc[acc.length - 1].description += ` ${curr.trim()}`;
  }
  return acc;
};

export function parseFromTxt(input: string): FoundryTable {
  const lines = breakLines(input.replace('/t', '\n'));
  let rawName = lines.shift() ?? 'Parsed Table';
  let formula: string | undefined;

  if (hasDieNumber(rawName)) {
    const split = rawName.split(/(d[0-9]{1,4})/);
    formula = trimDieLine(split[1]);
    rawName = split[0];
  } else if (lines.length > 0 && hasDieNumber(lines[0])) {
    formula = trimDieLine(lines.shift() ?? '');
  }

  let tableDescription = '';
  if (lines.length > 0 && lines[0].startsWith('###')) {
    tableDescription = (lines.shift() ?? '').replace(/###/, '').trim().replace(/\\n/g, '</p><p>');
  }

  const numWeighted = lines.filter(hasWeights).length;
  let results: TableEntry[];

  if (numWeighted > 0) {
    const firstWeightIndex = lines.findIndex(hasWeights);
    results = lines.slice(firstWeightIndex).reduce(entryTxtReduce, []);
  } else {
    results = lines.map(textToEntry);
  }

  return {
    name: cleanName(rawName),
    formula: formula ?? formulaFromEntries(results),
    description: tableDescription,
    results,
  };
}

// ─── Reddit / weighted collection parsing ─────────────────────────────────────

function applyWeights(name: string, description: string, lines: string[]): FoundryTable {
  const results: TableEntry[] = hasWeights(lines[0]) ? lines.map(addWeight) : lines.map(textToEntry);
  return { name, description, formula: formulaFromEntries(results), results };
}

function parseRedditName(raw: string): string {
  return raw
    .replace(/d[0-9]{1,3}/, '')
    .replace(/[0-9]{1,3}/, '')
    .trim();
}

function extractTableDescription(lines: string[]): string {
  if (lines.length > 0 && lines[0].startsWith('###')) {
    const raw = (lines.shift() ?? '').replace(/###/, '').trim();
    return `<p>${raw.replace(/\\n/g, '</p><p>')}</p>`;
  }
  return '';
}

export function parseWeightedTable(userInput: string): FoundryTable {
  const lines = breakLines(userInput).filter((l) => l !== '');
  let rawName = 'Parsed Table';
  if (!hasWeights(lines[0]) || hasDieNumber(lines[0])) {
    rawName = lines.shift() ?? 'Parsed Table';
  }
  const description = extractTableDescription(lines);
  return applyWeights(parseRedditName(rawName), description, lines);
}

export interface TableCollection {
  name: string;
  collection: FoundryTable[];
}

function parseRedditTable(input: string): FoundryTable {
  const lines = breakLines(input).filter((l) => l !== '');
  const rawName = lines.shift() ?? 'No Name';
  const description = extractTableDescription(lines);
  if (lines.length === 0) throw new Error('No result lines found');
  return applyWeights(parseRedditName(rawName), description, lines);
}

export function parseRedditCollection(userInput: string): TableCollection {
  const parts = userInput.split(/\nd[0-9]{1,2}/);
  const name = (parts.shift() ?? 'No Name').trim();
  return { name, collection: parts.map(parseRedditTable) };
}

export function isRedditTable(userInput: string): boolean {
  return /^d[0-9]{1,3}/.test(userInput.trim());
}

export function isRedditCollection(userInput: string): boolean {
  return userInput.split(/\nd[0-9]{1,2}/).length > 2;
}
