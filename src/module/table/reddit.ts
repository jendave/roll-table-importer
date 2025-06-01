import { formulaFromEntries, FoundryTable, TableEntry } from './parse';
import { addWeight, breakLines, hasWeights } from './lineManipulators';
import { hasDieNumber } from './stringInspectors';

export function cleanName(name: string) {
  return name
    .replace(/d[0-9]{1,3}/, '')
    .replace(/[0-9]{1,3}/, '')
    .trim();
}

export function parseWeightedTable(userInput: string): FoundryTable {
  const raw = breakLines(userInput);
  const lines = raw.filter((line: string) => line !== '');
  let rawName = 'Parsed Table';
  if (!hasWeights(lines[0]) || hasDieNumber(lines[0])) {
    rawName = lines.shift() || 'No Name';
  }
  const name = cleanName(rawName);
  let description = '';
  if (lines[0].startsWith('###')) {
    const rawDescription = lines.shift() || '';
    const replacedDescription = rawDescription.replace(/###/, '').trim().replace(/\\n/g, '</p><p>').trim();
    description = replacedDescription || '';
  }
  return applyWeights(name, description, lines);
}

export interface TableCollection {
  collection: FoundryTable[];
  name: string;
}

export function isRedditTable(userInput: string): boolean {
  const parsed = parseWeightedTable(userInput);
  parsed.results.forEach((entry: TableEntry) => {
    if (entry.range[0] === NaN || entry.range[1] === NaN) {
      return false;
    }
  });
  return parsed.results.length > 0 && /^d[0-9]{1,3}/.test(userInput.trim());
}

export function isRedditCollection(userInput: string) {
  const parsed = parseRedditCollection(userInput);
  parsed.collection.forEach((table) => {
    table.results.forEach((entry) => {
      if (entry.range[0] === NaN || entry.range[1] === NaN) {
        return false;
      }
    });
  });
  return parsed.collection.length > 1 && userInput.split(/\nd[0-9]{1,2}/).length > 1;
}

export function applyWeights(name: string, description: string, lines: string[]): FoundryTable {
  let results: TableEntry[] | undefined = undefined;
  let formula = `1d${lines.length}`;
  if (hasWeights(lines[0])) {
    results = lines.map(addWeight);
    formula = formulaFromEntries(results);
  } else {
    results = lines.map((line: string, index: number) => {
      return {
        range: [index + 1, index + 1],
        text: line.trim(),
      };
    });
  }
  return {
    name,
    formula,
    description,
    results,
  };
}

export function parseRedditTable(userInput: string): FoundryTable {
  const raw = userInput.split('\n');
  const lines = raw.filter((line) => line !== '');
  const rawName = lines.shift() || 'No Name';
  const replacedName = rawName.replace(/d[0-9]{1,3}/, '').replace(/[0-9]{1,3}/, '');
  const name = replacedName.trim();
  let description = '';
  if (lines[0].startsWith('###')) {
    const rawDescription = lines.shift() || '';
    const replacedDescription = rawDescription.replace(/###/, '').trim().replace(/\\n/g, '</p><p>').trim();
    description = replacedDescription || '';
  }
  if (lines.length === 0) {
    throw new Error('No lines found in the table');
  }
  return applyWeights(name, description, lines);
}

export function parseRedditCollection(userInput: string): TableCollection {
  const tables = userInput.split(/\nd[0-9]{1,2}/);
  return {
    name: (tables.shift() || 'No Name').trim(),
    collection: tables.map((table) => parseRedditTable(table)),
  };
}
