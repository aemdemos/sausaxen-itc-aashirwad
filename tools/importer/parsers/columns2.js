/* global WebImporter */
export default function parse(element, { document }) {
  // Find the core product detail DOM container
  const productDetail = element.querySelector('.cmp-product-detail');
  if (!productDetail) return;

  // Left column: product image
  const left = productDetail.querySelector('.cmp-product-detail__left-container');

  // Right column: all product info content
  const right = productDetail.querySelector('.cmp-product-detail__right-container');

  let rightCellContents = [];
  if (right) {
    // Title (h1)
    const title = right.querySelector('.cmp-product-detail__title');
    if (title) rightCellContents.push(title);
    // Description (span/p)
    const descContainer = right.querySelector('.cmp-product-detail__description-container');
    if (descContainer) rightCellContents.push(descContainer);
    // Pack sizes title
    const packTitle = right.querySelector('.cmp-product-detail__pack-title');
    if (packTitle) rightCellContents.push(packTitle);
    // Pack sizes (tab group)
    const tabGroup = right.querySelector('.cmp-tab-group');
    if (tabGroup) rightCellContents.push(tabGroup);
    // Price/button container (may be empty)
    const priceContainer = right.querySelector('.cmp-product-detail__price-container');
    if (priceContainer && priceContainer.textContent.trim()) rightCellContents.push(priceContainer);
    // Accordion (nutritional info etc)
    const accordion = right.querySelector('.cmp-accordion');
    if (accordion) rightCellContents.push(accordion);
  }

  // If no left or right, fallback gracefully
  const leftCell = left || '';
  const rightCell = rightCellContents.length ? rightCellContents : '';

  const headerRow = ['Columns (columns2)'];
  const contentRow = [leftCell, rightCell];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
