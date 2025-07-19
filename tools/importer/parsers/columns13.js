/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row for block name
  const headerRow = ['Columns (columns13)'];

  // 2. Find the product-detail root
  const detail = element.querySelector('.cmp-product-detail');
  // Defensive: fallback to element itself if not found
  const base = detail || element;

  // 3. Find left column (image)
  let leftCol = base.querySelector('.cmp-product-detail__left-container');
  // Defensive: fallback to the first child div
  if (!leftCol) {
    const fallback = base.querySelector(':scope > div');
    leftCol = fallback || document.createElement('div');
  }

  // 4. Find right column (everything else)
  let rightCol = base.querySelector('.cmp-product-detail__right-container');
  // Defensive: fallback to the second child div
  if (!rightCol) {
    const divs = base.querySelectorAll(':scope > div');
    rightCol = divs[1] || document.createElement('div');
  }

  // 5. Assemble the columns row
  const columnsRow = [leftCol, rightCol];

  // 6. Build the table and replace
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
