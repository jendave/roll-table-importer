import { ImportTableForm } from './importTableForm';
import { Handler } from './importForm';

export function renderSidebarButtons(settings: Settings, tab: string, handler: Handler): void {
  if (settings.id !== tab) return;
  const html = $(settings.element);
  if (html.find('#inputButton').length !== 0) return;

  const button = `<div style="flex: 0 0 100%; display: flex;">
  <button id="inputButton" style="flex: 1;">
    <i class="fas fa-atlas"></i> Import Tables
  </button>
</div>`;
  html.find('.header-actions').first().append(button);
  html.find('#inputButton').on('click', (e) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (new ImportTableForm(handler) as any).render(true);
  });
}
