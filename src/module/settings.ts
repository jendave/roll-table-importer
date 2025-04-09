import CONSTANTS from './constants';

export interface ClientSettingsReader {
  get<T>(scope: string, key: string): T;
}

export class Config {
  folderDepth = 3;
  journalImporter = true;
  tableImporter = true;
  actorImporter = true;
  itemImporter = true;

  static keys = {
    folderDepth: 'folderDepth',
    tableImporter: 'tableImporter',
  };

  public load(s: ClientSettingsReader): Config {
    this.folderDepth = this.getSetting(s, Config.keys.folderDepth);
    this.tableImporter = this.getSetting(s, Config.keys.tableImporter);

    return this;
  }

  /**
   * Helper method to quickly construct Settings from game.settings
   */
  static _load(): Config {
    return new Config().load((game as Game).settings as ClientSettingsReader);
  }

  private getSetting<T>(settings: ClientSettingsReader, key: string) {
    return settings.get<T>(CONSTANTS.module.name, key);
  }
}

export function registerSettings(): void {
  (game as Game)?.settings?.register(CONSTANTS.module.name, 'folderDepth', {
    name: 'Folder Depth',
    hint: `Folders will only be created up to this depth. If this is set above ${CONST.FOLDER_MAX_DEPTH}, make sure you have a module like MoarFolders to increase the default depth.`,
    scope: 'world',
    config: true,
    type: Number,
    default: CONST.FOLDER_MAX_DEPTH,
  });
  (game as Game)?.settings?.register(CONSTANTS.module.name, 'tableImporter', {
    name: 'Table Importer',
    hint: 'Display the table importer button. This imports tables pasted from reddit.com/r/BehindTheTables and other formats. (requires reload)',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });
}
