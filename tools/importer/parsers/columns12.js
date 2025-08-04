/* global WebImporter */
export default function parse(element, { document }) {
  // Find all carousel items - each is a column
  const items = element.querySelectorAll('.cmp-popular-products__carousel-item');
  if (!items.length) return;

  // For each item, build the content for the column
  const cols = Array.from(items).map((item) => {
    const content = [];

    // Product image (inside a link)
    const imageDiv = item.querySelector('.cmp-popular-products__image');
    if (imageDiv) {
      const imageLink = imageDiv.querySelector('a');
      if (imageLink) {
        content.push(imageLink);
      }
    }

    // Product name
    const nameDiv = item.querySelector('.cmp-popular-products__product-name');
    if (nameDiv) {
      content.push(nameDiv);
    }

    // Product details
    const detailsDiv = item.querySelector('.cmp-popular-products__product-details');
    if (detailsDiv) {
      content.push(detailsDiv);
    }

    // Action button: convert to link if possible
    const actionDiv = item.querySelector('.cmp-popular-products__action');
    if (actionDiv) {
      const btn = actionDiv.querySelector('button, a');
      let actionEl = null;
      // Find buy link from the image if possible
      if (btn && imageDiv && imageDiv.querySelector('a')) {
        const prodLink = imageDiv.querySelector('a').href;
        const a = document.createElement('a');
        a.href = prodLink;
        a.textContent = btn.textContent.trim();
        actionEl = a;
      } else if (btn) {
        actionEl = btn;
      }
      if (actionEl) content.push(actionEl);
    }

    return content;
  });

  // Header row should have one cell, but as many columns as content row (empty cells after first)
  const headerRow = ['Columns (columns12)'];
  while (headerRow.length < cols.length) {
    headerRow.push('');
  }

  const tableRows = [headerRow, cols];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
