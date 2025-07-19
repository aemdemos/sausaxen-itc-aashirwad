/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for cards35, matching the example
  const headerRow = ['Cards (cards35)'];

  // Find the card root in given structure
  const productDetail = element.querySelector('.cmp-product-detail');
  if (!productDetail) return;

  // Image cell
  let img = productDetail.querySelector('.cmp-product-detail__left-container img');

  // Text cell: assemble title, description, CTA if present
  const right = productDetail.querySelector('.cmp-product-detail__right-container');
  const textCell = document.createElement('div');

  // Title
  const title = right && right.querySelector('.cmp-product-detail__title');
  if (title) textCell.appendChild(title);

  // Description
  const descWrap = right && right.querySelector('.cmp-product-detail__description');
  if (descWrap) textCell.appendChild(descWrap);

  // CTA (Read More link), only if it has visible text
  const cta = right && right.querySelector('.cmp-product-detail__read-more');
  if (cta && cta.textContent && cta.textContent.trim()) textCell.appendChild(cta);

  // Only add the card row if both img and text content exist
  const rows = [headerRow];
  if (img || textCell.childNodes.length) {
    rows.push([img, textCell]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}