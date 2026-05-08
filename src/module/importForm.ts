export interface UserData {
  clipboardInput?: string;
  foundryFile?: string; // single file path on Foundry server
  foundryDirectory?: string; // directory path on Foundry server
  selectedFiles?: FileList; // local file(s) from browser
  directoryFiles?: FileList; // local directory from browser
}

export type Handler = (data: UserData) => Promise<void>;
