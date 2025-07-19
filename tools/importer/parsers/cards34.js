/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required by the example
  const headerRow = ['Cards (cards34)'];

  // Find all cards
  // Each card is a .cmp-tab-group__tab-item
  const tabItems = element.querySelectorAll('.cmp-tab-group__tab-item');
  const rows = [];
  tabItems.forEach(tabItem => {
    // Left cell: no image/icon in the HTML, leave blank string
    // Right cell: text content (make strong for semantic heading, as in example)
    const textSpan = tabItem.querySelector('.cmp-tab__text');
    let titleEl = null;
    if (textSpan && textSpan.textContent.trim()) {
      // Use <strong> as per the markdown's bolded titles
      titleEl = document.createElement('strong');
      titleEl.textContent = textSpan.textContent.trim();
    } else {
      titleEl = document.createTextNode('');
    }
    rows.push(['', titleEl]);
  });

  // Build the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
