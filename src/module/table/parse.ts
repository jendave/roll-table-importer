import { cleanName } from '../formatters';
import { TableParser } from './process';
import { addWeight, breakLines, hasWeights, rangeStringMap } from './lineManipulators';
import { hasDieNumber } from './stringInspectors';

export type TableData = ConstructorParameters<typeof foundry.documents.BaseRollTable>[0];

export interface TableEntry {
  range: [number, number];
  text: string;
}

export interface FoundryTable {
  name: string;
  formula: string;
  description: string;
  results: TableEntry[];
}

export interface BasicTable {
  name: string;
  description: string;
  results: string[];
}

export function isFoundryTable(table: FoundryTable | BasicTable) {
  return (table as FoundryTable).formula !== undefined;
}

export function isBasicTable(table: FoundryTable | BasicTable) {
  return (table as FoundryTable).formula === undefined;
}

const entryStringMap = (current: string, index: number): TableEntry => {
  return {
    text: current,
    range: [index + 1, index + 1],
  };
};

export function parseBasicJSON({ name, description, results }: BasicTable) {
  const resultsParsed = results.map(entryStringMap);
  if (description === undefined) {
    description = '';
  } else if (description === null) {
    description = '';
  }
  const replacedDescription = description.replace(/\n/g, '</p><p>').trim();
  return {
    name: name,
    description: replacedDescription || '',
    formula: formulaFromEntries(resultsParsed),
    results: resultsParsed,
  };
}

export function parseFoundryJSON({ name, formula, description, results }: FoundryTable) {
  if (description === undefined) {
    description = '';
  } else if (description === null) {
    description = '';
  }
  const replacedDescription = description.replace(/\n/g, '</p><p>').trim();
  return {
    name: name,
    formula,
    description: replacedDescription || '',
    results: [...results],
  };
}

export function formulaFromEntries(entries: TableEntry[]): string {
  return `1d${entries[entries.length - 1].range[1]}`;
}

function nameFromFile(file: string) {
  // get the filename without the extension
  const withPath = file.split('.')[0];
  // remove the file path
  const name = withPath.split('/').pop() || withPath;
  // replace all underscores with spaces
  // and capitalize the first letter of each word
  return cleanName(name);
}

export function isCSVTable(data: string) {
  const delims = ['|', ','];
  const check = data.split('\n')[0];
  return delims.reduce((acc, cur) => check.includes(cur) || acc, false);
}

export function isJSONTable(data: string) {
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
}

export function numWithWeights(entries: string[]) {
  return entries.reduce((numWeights, cur) => {
    if (hasWeights(cur)) {
      numWeights += 1;
    }
    return numWeights;
  }, 0);
}

const trimDieLine = (line: string): string => {
  return `1d${line.trim().split(' ')[0].replace('1d', '').replace('d', '')}`;
};

export const parseFromTxt: TableParser = (input: string) => {
  const table = input.replace('/t', '\n');
  const lines = breakLines(table);
  let name = lines.shift() || 'Parsed Table';
  const numWeighted: number = numWithWeights(lines);
  let formula;
  if (hasDieNumber(name)) {
    const split = name.split(/(d[0-9]{1,4})/);
    const dieLine = split[1];
    name = split[0];
    formula = trimDieLine(dieLine);
  } else if (hasDieNumber(lines[0])) {
    const dieLine = lines.shift();
    if (!dieLine) {
      throw new Error('No die line found');
    }
    formula = trimDieLine(dieLine);
  }
  let description = '';
  if (lines[0].startsWith('###')) {
    description = lines.shift()?.replace('#', '').trim() || '';
  }
  let results;
  if (numWeighted > 0) {
    // remove any lines until we find the first line with weights
    let firstWeightIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (hasWeights(lines[i])) {
        firstWeightIndex = i;
        break;
      }
    }

    results = lines.slice(firstWeightIndex).reduce(entryTxtReduce, []);
  } else {
    results = lines.map(entryStringMap);
  }
  results = results.map((entry) => {
    entry.text = entry.text.trim();
    return entry;
  });
  return {
    name: nameFromFile(name),
    formula: formula ?? formulaFromEntries(results),
    description: description,
    results,
  };
};

const entryTxtReduce = (acc: TableEntry[], curr: string): TableEntry[] => {
  if (hasWeights(curr)) {
    const [stringRange, ...text] = curr.split(' ');
    const [start, end] = rangeStringMap(stringRange);
    acc.push({
      text: text.join(' '),
      range: [start, end],
    });
  } else {
    acc[acc.length - 1].text += ` ${curr}`;
  }
  return acc;
};

const entryCSVMap = (current: string): TableEntry => {
  const [stringRange, text] = current.split('|');
  const [start, end] = rangeStringMap(stringRange);
  return {
    text,
    range: [start, end],
  };
};

export function parseFromCSV(table: BasicTable) {
  const { name, description, results } = table;
  const resultsParsed = results.map(entryCSVMap);
  return {
    name: nameFromFile(name),
    description: description || '',
    formula: formulaFromEntries(resultsParsed),
    results: resultsParsed,
  };
}

export function parseMultiLineWeighted(inputTable: string) {
  const lines = breakLines(inputTable);
  let name = 'Parsed Table';
  if (!hasWeights(lines[0])) {
    name = lines.shift() || 'Parsed Table';
  }
  const withWeights = numWithWeights(lines);
  if (withWeights !== lines.length / 2) {
    throw new Error('Not a multi line weighted table');
  }

  const entries = lines.reduce((acc: TableEntry[], curr: string) => {
    if (hasWeights(curr)) {
      acc.push(addWeight(curr));
    } else {
      acc[acc.length - 1].text = curr;
    }
    return acc;
  }, []);
  const formula = formulaFromEntries(entries);
  const description = '';
  return {
    name,
    formula,
    description,
    results: entries,
  };
}
