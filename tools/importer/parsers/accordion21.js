/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion container
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;
  // Find all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');

  // Build rows: header row is a single cell, all other rows are 2 cells (title, content)
  const cells = [];
  // Header row: ONLY 1 cell
  cells.push(['Accordion']);

  // For each item
  items.forEach(item => {
    // Get title text
    let title = '';
    const headerBtn = item.querySelector('.cmp-accordion__header .cmp-accordion__button .cmp-accordion__title');
    if (headerBtn) {
      title = headerBtn.textContent.trim();
    } else {
      const btn = item.querySelector('.cmp-accordion__header .cmp-accordion__button');
      if (btn) title = btn.textContent.trim();
    }
    // Get the panel content
    let contentCell = '';
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer && cmpContainer.textContent.trim() !== '') {
        contentCell = cmpContainer;
      } else {
        const children = Array.from(panel.children).filter(el => !['SCRIPT','STYLE'].includes(el.tagName));
        if (children.length === 1) {
          contentCell = children[0];
        } else if (children.length > 1) {
          contentCell = children;
        } else {
          contentCell = panel;
        }
      }
    }
    // Each subsequent row is an array of exactly two cells
    cells.push([title, contentCell]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
