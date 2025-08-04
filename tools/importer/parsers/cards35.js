/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main product detail container
  const productDetail = element.querySelector('.product-detail');
  if (!productDetail) return;

  // Find image
  const img = productDetail.querySelector('.cmp-product-detail__left-container img');

  // Find title
  const title = productDetail.querySelector('.cmp-product-detail__title');

  // Find description and CTA (Read More)
  const descContainer = productDetail.querySelector('.cmp-product-detail__description-container');

  // Compose text cell
  const textCell = [];
  if (title) textCell.push(title);
  if (descContainer) {
    // Only keep the .cmp-product-detail__description and the Read More link, if available
    const desc = descContainer.querySelector('.cmp-product-detail__description');
    if (desc) textCell.push(...desc.childNodes);
    const readMore = descContainer.querySelector('a.cmp-product-detail__read-more');
    if (readMore && readMore.textContent.trim()) textCell.push(readMore);
  }

  // Table header row
  const headerRow = ['Cards (cards35)'];
  // Table card row
  const cardRow = [img, textCell];

  // Compose and replace
  const table = WebImporter.DOMUtils.createTable([headerRow, cardRow], document);
  element.replaceWith(table);
}
