/* global WebImporter */
export default function parse(element, { document }) {
  // Get main top-content wrapper
  const topContent = element.querySelector('.cmp-footer__top-content');
  if (!topContent) return;

  // Column 1: logo area
  const logoBlock = topContent.querySelector('.cmp-footer__nav-logo');
  // Column 2: subscribe area
  const subscribeBlock = topContent.querySelector('.cmp-footer__nav-subscribe');
  // Column 3: navigation area
  const navBlock = element.querySelector('.cmp-footer__nav');

  // Compose columns: if missing, set to ''
  const columnsRow = [
    logoBlock || '',
    subscribeBlock || '',
    navBlock || ''
  ];

  // The header row must be exactly one cell: Columns (columns11)
  const cells = [
    ['Columns (columns11)'],
    columnsRow
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
