import { Config, registerSettings } from './settings';
import { preloadTemplates } from './preloadTemplates';
import { processTableJSON } from './table/process';
import { renderSidebarButtons } from './renderSidebarButtons';
import CONSTANTS from './constants';

Hooks.on('renderSidebarTab', (settings: Settings) => {
  if (!(game as Game)?.user?.isGM) return;
  const config = Config._load();
  if (config.tableImporter) {
    renderSidebarButtons(settings, 'tables', processTableJSON);
  }
});

Hooks.on('renderRollTableDirectory', (settings: Settings) => {
  if (!(game as Game)?.user?.isGM) return;
  const config = Config._load();
  if (config.tableImporter) {
    renderSidebarButtons(settings, 'tables', processTableJSON);
  }
});

// Initialize module
Hooks.once('init', async () => {
  console.log(`${CONSTANTS.module.name} | Initializing ${CONSTANTS.module.title}`);
  // Assign custom classes and constants here

  // Register custom module settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // Register custom sheets (if any)
});

// When ready
Hooks.once('ready', async () => {
  // Do anything once the module is ready
});
