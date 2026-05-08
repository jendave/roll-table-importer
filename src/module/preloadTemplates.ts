import CONSTANTS from './constants';

export async function preloadTemplates(): Promise<void> {
  const templatePaths: string[] = [`modules/${CONSTANTS.module.name}/templates/importTableForm.hbs`];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (foundry as any).applications.handlebars.loadTemplates(templatePaths);
}
