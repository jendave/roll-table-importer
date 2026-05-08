import { UserData } from '../importForm';
import { breakLines } from './lineManipulators';
import {
  BasicTable,
  FoundryTable,
  isCSVTable,
  isFoundryTable,
  isJSONTable,
  isRedditCollection,
  isRedditTable,
  parseBasicJSON,
  parseFoundryJSON,
  parseFromCSV,
  parseFromTxt,
  parseRedditCollection,
  parseWeightedTable,
  TableCollection,
  TableData,
} from './parse';

export type TableParser = (input: string) => FoundryTable;

// ─── Table creation ───────────────────────────────────────────────────────────

async function createTable(data: TableData, folderId?: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await RollTable.create({ ...(data as any), folder: folderId });
}

async function createTableFromJSON(tableJSON: FoundryTable | BasicTable, folderId?: string): Promise<void> {
  const parsed = isFoundryTable(tableJSON) ? parseFoundryJSON(tableJSON) : parseBasicJSON(tableJSON as BasicTable);
  await createTable(parsed, folderId);
}

// ─── Folder helpers ───────────────────────────────────────────────────────────

async function getOrCreateFolder(name: string, parentId?: string): Promise<string> {
  const existing = (game as Game).folders?.find(
    (f) => f.type === 'RollTable' && f.name === name && (f.folder?.id ?? undefined) === parentId,
  );
  if (existing) return existing.id as string;
  const folder = await Folder.create({ name, type: 'RollTable', sorting: 'm', folder: parentId });
  return folder?.id as string;
}

/**
 * Ensures the folder path exists and returns the leaf folder id.
 * e.g. ["Locations", "Temples"] creates Locations → Temples.
 */
async function ensureFolderPath(parts: string[]): Promise<string | undefined> {
  let parentId: string | undefined;
  for (const part of parts) {
    parentId = await getOrCreateFolder(part, parentId);
  }
  return parentId;
}

// ─── JSON sanitization ────────────────────────────────────────────────────────

// Replaces raw control characters inside JSON string literals with their
// escape sequences. Handles backslash-escaped characters and unicode escapes
// so it doesn't corrupt already-valid content.
function sanitizeJSON(raw: string): string {
  let out = '';
  let inString = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (inString) {
      if (ch === '\\') {
        out += ch + raw[++i]; // pass escaped pair through unchanged
      } else if (ch === '"') {
        inString = false;
        out += ch;
      } else {
        const code = ch.charCodeAt(0);
        if (code < 0x20) {
          // Escape raw control character
          out += '\\u' + code.toString(16).padStart(4, '0');
        } else {
          out += ch;
        }
      }
    } else {
      if (ch === '"') inString = true;
      out += ch;
    }
  }
  return out;
}

// ─── Route handlers ───────────────────────────────────────────────────────────

async function jsonRoute(data: string, folderId?: string): Promise<void> {
  const json = JSON.parse(sanitizeJSON(data)) as FoundryTable | BasicTable;
  await createTableFromJSON(json, folderId);
}

async function csvRoute(filename: string, data: string, folderId?: string): Promise<void> {
  const lines = breakLines(data);
  await createTable(parseFromCSV(filename, lines), folderId);
}

async function txtRoute(data: string, folderId?: string): Promise<void> {
  await createTable(parseFromTxt(data), folderId);
}

async function redditCollectionRoute(input: string): Promise<void> {
  const parsed: TableCollection = parseRedditCollection(input);
  const folderId = await getOrCreateFolder(parsed.name);
  for (let i = 0; i < parsed.collection.length; i++) {
    await RollTable.create({ ...parsed.collection[i], folder: folderId, sort: i });
  }
}

// ─── Clipboard / paste input ─────────────────────────────────────────────────

async function processText(input: string): Promise<void> {
  if (isJSONTable(input)) {
    return jsonRoute(input);
  }
  if (isCSVTable(input)) {
    return csvRoute('CSV Imported Table', input);
  }
  if (isRedditCollection(input)) {
    return redditCollectionRoute(input);
  }
  if (isRedditTable(input)) {
    return createTable(parseWeightedTable(input));
  }
  return txtRoute(input);
}

// ─── File / directory input ───────────────────────────────────────────────────

/**
 * Processes a single File object, placing the resulting table into the given folder.
 * The folder path mirrors the file's directory structure within the chosen root.
 */
async function processFile(file: File, folderId?: string): Promise<void> {
  const text = await file.text();
  const ext = file.name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'json':
      return jsonRoute(text, folderId);
    case 'csv':
      return csvRoute(file.name, text, folderId);
    case 'txt':
      return txtRoute(`${file.name}\n${text}`, folderId);
    default:
      console.warn(`roll-table-importer | Skipping unsupported file type: ${file.name}`);
  }
}

/**
 * Processes a FileList from a directory picker (<input webkitdirectory>).
 * Mirrors the directory structure as Foundry RollTable folders.
 */
async function processDirectory(files: FileList): Promise<void> {
  // Group files by their directory path
  const byFolder = new Map<string, { file: File; dirParts: string[] }[]>();

  for (const file of Array.from(files)) {
    // webkitRelativePath is "rootDir/subDir/file.ext"
    const parts = file.webkitRelativePath.split('/');
    parts.pop(); // remove filename, keep directory parts
    const key = parts.join('/');
    if (!byFolder.has(key)) byFolder.set(key, []);
    byFolder.get(key)?.push({ file, dirParts: parts });
  }

  // Cache folder IDs so we don't recreate them for each file
  const folderCache = new Map<string, string | undefined>();
  folderCache.set('', undefined);

  for (const [key, entries] of byFolder) {
    if (!folderCache.has(key)) {
      const folderId = await ensureFolderPath(entries[0].dirParts);
      folderCache.set(key, folderId);
    }
    const folderId = folderCache.get(key);
    for (const { file } of entries) {
      try {
        await processFile(file, folderId);
      } catch (e) {
        console.error(`roll-table-importer | Failed to import ${file.webkitRelativePath}:`, e);
      }
    }
  }
}

// ─── Main entry point ─────────────────────────────────────────────────────────

async function fetchAndRoute(path: string, folderId?: string): Promise<void> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not fetch: ${path}`);
  const text = await response.text();
  const ext = path.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'json':
      return jsonRoute(text, folderId);
    case 'txt':
      return txtRoute(`${path.split('/').pop()}\n${text}`, folderId);
    case 'csv':
      return csvRoute(path, text, folderId);
    default:
      console.warn(`roll-table-importer | Unsupported file type: ${path}`);
  }
}

async function processFoundryDirectory(dirPath: string): Promise<void> {
  // Use Foundry's FilePicker API to list files in the directory recursively
  const browse = async (path: string, folderId?: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (foundry as any).applications.apps.FilePicker.implementation.browse('data', path);
    const currentFolderId = folderId ?? (await getOrCreateFolder(path.split('/').pop() ?? path));
    for (const file of result.files as string[]) {
      const ext = file.split('.').pop()?.toLowerCase();
      if (!['json', 'csv', 'txt'].includes(ext ?? '')) continue;
      try {
        await fetchAndRoute(file, currentFolderId);
      } catch (e) {
        console.error(`roll-table-importer | Failed to import ${file}:`, e);
      }
    }
    for (const subDir of result.dirs as string[]) {
      const subFolderId = await getOrCreateFolder(subDir.split('/').pop() ?? subDir, currentFolderId);
      await browse(subDir, subFolderId);
    }
  };
  await browse(dirPath);
}

export async function processTableJSON({
  clipboardInput,
  foundryFile,
  foundryDirectory,
  directoryFiles,
  selectedFiles,
}: UserData): Promise<void> {
  if (clipboardInput?.trim()) {
    try {
      await processText(clipboardInput);
    } catch (e) {
      console.error(`roll-table-importer | Error parsing pasted text:`, e);
      ui.notifications?.error('Roll Table Importer: Failed to parse input. Check the browser console for details.');
    }
    return;
  }

  if (foundryFile?.trim()) {
    try {
      await fetchAndRoute(foundryFile);
      ui.notifications?.info('Roll Table Importer: File imported.');
    } catch (e) {
      console.error(`roll-table-importer | Error importing Foundry file:`, e);
      ui.notifications?.error('Roll Table Importer: File import failed. Check the browser console for details.');
    }
    return;
  }

  if (foundryDirectory?.trim()) {
    try {
      await processFoundryDirectory(foundryDirectory);
      ui.notifications?.info('Roll Table Importer: Directory imported.');
    } catch (e) {
      console.error(`roll-table-importer | Error importing Foundry directory:`, e);
      ui.notifications?.error('Roll Table Importer: Directory import failed. Check the browser console for details.');
    }
    return;
  }

  if (directoryFiles && directoryFiles.length > 0) {
    try {
      await processDirectory(directoryFiles);
      ui.notifications?.info(`Roll Table Importer: Imported ${directoryFiles.length} file(s).`);
    } catch (e) {
      console.error(`roll-table-importer | Error importing local directory:`, e);
      ui.notifications?.error('Roll Table Importer: Directory import failed. Check the browser console for details.');
    }
    return;
  }

  if (selectedFiles && selectedFiles.length > 0) {
    try {
      for (const file of Array.from(selectedFiles)) {
        await processFile(file);
      }
      ui.notifications?.info(`Roll Table Importer: Imported ${selectedFiles.length} file(s).`);
    } catch (e) {
      console.error(`roll-table-importer | Error importing local files:`, e);
      ui.notifications?.error('Roll Table Importer: File import failed. Check the browser console for details.');
    }
    return;
  }
}
