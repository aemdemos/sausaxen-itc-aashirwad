/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: one column only
  const rows = [['Accordion']];

  // Find the accordion root element
  let accordionRoot = element.querySelector('.cmp-accordion');
  if (!accordionRoot && element.classList.contains('cmp-accordion')) {
    accordionRoot = element;
  }
  if (!accordionRoot) {
    accordionRoot = element;
  }

  // Accumulate rows: each content row must have two columns (title, content)
  const items = accordionRoot.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title extraction
    let title = '';
    const button = item.querySelector('button.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        title = button.textContent.trim();
      }
    } else {
      const header = item.querySelector('.cmp-accordion__header');
      if (header) {
        title = header.textContent.trim();
      }
    }
    // Content extraction
    let contentCell = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Try .container.responsivegrid > .cmp-container
      let possibleContent = null;
      const grid = panel.querySelector('.container.responsivegrid');
      if (grid && grid.children.length === 1) {
        possibleContent = grid.firstElementChild;
      }
      if (!possibleContent) {
        possibleContent = panel.querySelector('.cmp-container');
      }
      if (!possibleContent) {
        possibleContent = panel;
      }
      contentCell = possibleContent;
    }
    // Push row with two cells: [title, content]
    rows.push([title, contentCell]);
  });

  // All non-header rows must have exactly two columns, header exactly one
  // The table array is already correct as written above
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
