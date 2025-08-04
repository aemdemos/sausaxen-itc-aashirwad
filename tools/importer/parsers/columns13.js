/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row exactly as required
  const headerRow = ['Columns (columns13)'];

  // Find the main product detail container
  const cmpDetail = element.querySelector('.cmp-product-detail');
  let leftCol = null;
  let rightCol = null;
  if (cmpDetail) {
    const children = cmpDetail.querySelectorAll(':scope > div');
    leftCol = children[0];
    rightCol = children[1];
  }

  // Fallback: Use the immediate children if needed
  if ((!leftCol || !rightCol) && element.children.length >= 2) {
    leftCol = element.children[0];
    rightCol = element.children[1];
  }

  // Defensive: If somehow not found, don't break
  const leftCell = leftCol ? leftCol : document.createElement('div');
  const rightCell = rightCol ? rightCol : document.createElement('div');

  // Compose the table as specified (header row, then one row with two columns)
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
