/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main cmp-product-detail block
  const productDetail = element.querySelector('.cmp-product-detail');
  if (!productDetail) return;

  // Find the product image (left column)
  const left = productDetail.querySelector('.cmp-product-detail__left-container');
  // Find the right container with all text and info (right column)
  const right = productDetail.querySelector('.cmp-product-detail__right-container');

  // If either column is missing, gracefully fall back to the non-empty one
  if (!left && !right) return;

  // Table header exactly as required
  const headerRow = ['Columns (columns5)'];

  // Build the content row based on available columns
  const contentRow = [];
  if (left) contentRow.push(left);
  if (right) contentRow.push(right);

  // Only build the block if we have at least one column
  if (contentRow.length === 0) return;

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
