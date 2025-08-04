/* global WebImporter */
export default function parse(element, { document }) {
  // Find the product detail block
  const productDetail = element.querySelector('.cmp-product-detail');
  if (!productDetail) return;

  // Left column: image (product shot)
  let leftImg = null;
  const leftContainer = productDetail.querySelector('.cmp-product-detail__left-container');
  if (leftContainer) {
    leftImg = leftContainer.querySelector('img');
  }

  // Right column: everything else (title, description, pack sizes, price, info...)
  const rightContainer = productDetail.querySelector('.cmp-product-detail__right-container');
  let rightContentFragment = document.createDocumentFragment();
  if (rightContainer) {
    // Get all direct children and keep their order
    Array.from(rightContainer.children).forEach(child => {
      rightContentFragment.appendChild(child);
    });
  }
  // If rightContentFragment is empty, use null for resilience
  if (!rightContentFragment.hasChildNodes()) rightContentFragment = null;

  // Table structure: header row, then content row with 2 columns
  const cells = [
    ['Columns (columns5)'],
    [leftImg, rightContentFragment]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
