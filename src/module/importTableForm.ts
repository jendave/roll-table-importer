import CONSTANTS from './constants';
import { Handler, UserData } from './importForm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { ApplicationV2, HandlebarsApplicationMixin } = (foundry as any).applications.api;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ImportTableForm extends HandlebarsApplicationMixin(ApplicationV2) {
  _handler: Handler;

  constructor(handler: Handler) {
    super({});
    this._handler = handler;
  }

  static DEFAULT_OPTIONS = {
    id: 'roll-table-importer',
    classes: ['roll-table-importer'],
    tag: 'div',
    window: { title: 'Import Rollable Tables', resizable: true },
    position: { width: 460, height: 520, top: 20, left: window.innerWidth - 710 },
  };

  static PARTS = {
    form: { template: `modules/${CONSTANTS.module.name}/templates/importTableForm.hbs` },
  };

  async _prepareContext(): Promise<object> {
    return {};
  }

  _onRender(_context: object, _options: object): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const root = (this as any).element as HTMLElement;

    const foundryFileInput = root.querySelector<HTMLInputElement>('#foundryFile')!;
    const foundryDirInput = root.querySelector<HTMLInputElement>('#foundryDirectory')!;
    const foundryStatus = root.querySelector('#foundryStatus')!;
    const localFileInput = root.querySelector<HTMLInputElement>('#localFileInput')!;
    const localDirInput = root.querySelector<HTMLInputElement>('#localDirInput')!;
    const localStatus = root.querySelector('#localStatus')!;

    const clearFoundry = () => {
      foundryFileInput.value = '';
      foundryDirInput.value = '';
      foundryStatus.textContent = 'Nothing selected.';
    };
    const clearLocal = () => {
      localFileInput.value = '';
      localDirInput.value = '';
      localStatus.textContent = 'Nothing selected.';
    };

    // ── Foundry File picker ───────────────────────────────────────────────────
    root.querySelector('#foundryFileBtn')?.addEventListener('click', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (foundry as any).applications.apps.FilePicker.implementation({
        type: 'any',
        callback: (path: string) => {
          clearLocal();
          foundryFileInput.value = path;
          foundryDirInput.value = '';
          foundryStatus.textContent = path.split('/').pop() ?? path;
        },
      }).render(true);
    });

    // ── Foundry Directory picker ──────────────────────────────────────────────
    root.querySelector('#foundryDirBtn')?.addEventListener('click', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (foundry as any).applications.apps.FilePicker.implementation({
        type: 'folder',
        callback: (path: string) => {
          clearLocal();
          foundryDirInput.value = path;
          foundryFileInput.value = '';
          foundryStatus.textContent = `Directory: ${path}`;
        },
      }).render(true);
    });

    // ── Local file(s) ─────────────────────────────────────────────────────────
    root.querySelector('#localFileBtn')?.addEventListener('click', () => localFileInput.click());
    localFileInput.addEventListener('change', () => {
      const count = localFileInput.files?.length ?? 0;
      if (count > 0) {
        clearFoundry();
        localDirInput.value = '';
        localStatus.textContent = `${count} file(s) selected.`;
      } else {
        localStatus.textContent = 'Nothing selected.';
      }
    });

    // ── Local directory ───────────────────────────────────────────────────────
    root.querySelector('#localDirBtn')?.addEventListener('click', () => localDirInput.click());
    localDirInput.addEventListener('change', () => {
      const count = localDirInput.files?.length ?? 0;
      if (count > 0) {
        clearFoundry();
        localFileInput.value = '';
        localStatus.textContent = `Directory: ${count} file(s) found.`;
      } else {
        localStatus.textContent = 'Nothing selected.';
      }
    });

    // ── Import ────────────────────────────────────────────────────────────────
    root.querySelector('#importButton')?.addEventListener('click', async () => {
      const data: UserData = {
        clipboardInput: (root.querySelector('textarea#clipboardInput') as HTMLTextAreaElement)?.value ?? '',
        foundryFile: (root.querySelector('#foundryFile') as HTMLInputElement)?.value || undefined,
        foundryDirectory: (root.querySelector('#foundryDirectory') as HTMLInputElement)?.value || undefined,
        selectedFiles: localFileInput.files?.length ? localFileInput.files : undefined,
        directoryFiles: localDirInput.files?.length ? localDirInput.files : undefined,
      };
      await this._handler(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (this as any).close();
    });
  }
}
