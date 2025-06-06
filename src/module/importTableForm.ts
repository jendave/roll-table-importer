import CONSTANTS from './constants';
import { Handler, HTMLImportData, UserData } from './importForm';

export class importTableForm extends FormApplication {
  _handler: Handler;
  tab: string;

  constructor(handler: Handler, tab: string) {
    super({});
    this._handler = handler;
    this.tab = tab;
  }

  get handler(): Handler {
    return this._handler;
  }

  set handler(handler) {
    this._handler = handler;
  }

  async _updateObject(_: Event, formData?: object): Promise<unknown> {
    if (!formData) return;
    const data = formData as HTMLImportData;
    console.log(`data: ${JSON.stringify(data, null, 2)}`);
    this.handler(data as UserData);
    return;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      jQuery: false,
      width: 400,
      top: window.innerHeight - window.innerHeight + 20,
      left: window.innerWidth - 710,
      template: `modules/${CONSTANTS.module.name}/templates/importTableForm.hbs`,
      title: 'Import Rollable Table',
    });
  }

  static DEFAULT_OPTIONS = {
    jQuery: false,
    position: {
      width: 400,
      top: window.innerHeight - window.innerHeight + 20,
      left: window.innerWidth - 710,
    },
    template: `modules/${CONSTANTS.module.name}/templates/importTableForm.hbs`,
    title: 'Import Rollable Table',
  };

  get title() {
    return 'Import Rollable Table';
  }

  static PARTS = {
    foo: {
      template: `modules/${CONSTANTS.module.name}/templates/importTableForm.hbs`,
    },
  };
}
