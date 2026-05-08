export interface TableEntry {
  range: [number, number];
  name: string; // text before ### delimiter, or empty string
  description: string; // text after ### delimiter, or full text if no delimiter
}

export interface FoundryTable {
  name: string;
  formula: string;
  description: string;
  results: TableEntry[];
}

export interface BasicTable {
  name: string;
  description?: string;
  results: string[];
}

export type TableData = ConstructorParameters<typeof foundry.documents.BaseRollTable>[0];
