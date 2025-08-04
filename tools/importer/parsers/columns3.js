/* global WebImporter */
export default function parse(element, { document }) {
  // Find the product detail root
  const productDetail = element.querySelector('.cmp-product-detail');
  if (!productDetail) return;

  // Get left (image) and right (content) columns
  const leftCol = productDetail.querySelector('.cmp-product-detail__left-container');
  const rightCol = productDetail.querySelector('.cmp-product-detail__right-container');

  // Defensive: ensure both columns exist
  if (!leftCol || !rightCol) return;

  // Compose table rows per Columns block spec
  // Header exactly as specified
  const headerRow = ['Columns (columns3)'];
  const columnsRow = [leftCol, rightCol];

  // Create and insert block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);
  element.replaceWith(table);
}
