/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main product detail container
  const productDetail = element.querySelector('.cmp-product-detail');
  if (!productDetail) return;

  // Get left (image) and right (info) columns
  const leftCol = productDetail.querySelector('.cmp-product-detail__left-container');
  const rightCol = productDetail.querySelector('.cmp-product-detail__right-container');

  // Defensive: If either column is missing, fill with empty div
  const leftCell = leftCol || document.createElement('div');
  const rightCell = rightCol || document.createElement('div');

  // Split rightCol into: infoTop (all before .accordion/.cmp-accordion), infoBottom (the accordion and everything after)
  let infoTop = document.createElement('div');
  let infoBottom = document.createElement('div');
  if (rightCol) {
    // Find the accordion (nutrition info)
    let accordion = rightCol.querySelector('.cmp-accordion, .accordion');
    let foundAccordion = false;
    Array.from(rightCol.childNodes).forEach((node) => {
      // Node is the actual accordion reference
      if (!foundAccordion && accordion && node === accordion) {
        foundAccordion = true;
        infoBottom.appendChild(node);
      } else if (!foundAccordion) {
        infoTop.appendChild(node);
      } else {
        infoBottom.appendChild(node);
      }
    });
    // If there's no accordion, put all in infoTop
    if (!accordion) {
      infoTop = rightCol;
      infoBottom = document.createElement('div');
    }
  }

  // Build table rows
  const headerRow = ['Columns (columns2)'];
  const firstContentRow = [leftCell, infoTop];
  const secondContentRow = ['', infoBottom];

  // Compose final table rows
  const cells = [headerRow, firstContentRow];
  // Only add the second row if there is actual nutrition info content
  if (infoBottom && infoBottom.childNodes.length > 0 && infoBottom.textContent.trim().length > 0) {
    cells.push(secondContentRow);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
