/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: only one column, exactly as in the spec
  const headerRow = ['Columns (columns12)'];

  // 2. Find all carousel items (each is a column)
  const items = Array.from(element.querySelectorAll('.cmp-popular-products__carousel-item'));

  // Defensive: if no items found, do nothing
  if (!items.length) return;

  // 3. Prepare a cell for each column in the second row (content row)
  const contentRow = items.map((item) => {
    const frag = document.createElement('div');
    // Image (possibly wrapped in link)
    const imageWrapper = item.querySelector('.cmp-popular-products__image');
    if (imageWrapper) {
      const link = imageWrapper.querySelector('a');
      const img = imageWrapper.querySelector('img');
      if (link && img && link.contains(img)) {
        frag.appendChild(link);
      } else if (img) {
        frag.appendChild(img);
      }
    }
    // Title
    const titleEl = item.querySelector('.cmp-popular-products__product-name');
    if (titleEl) {
      frag.appendChild(titleEl);
    }
    // Details
    const detailsEl = item.querySelector('.cmp-popular-products__product-details');
    if (detailsEl) {
      frag.appendChild(detailsEl);
    }
    // Action button
    const actionEl = item.querySelector('.cmp-popular-products__action');
    if (actionEl) {
      frag.appendChild(actionEl);
    }
    return frag;
  });

  // 4. Build the table: first row is a single header column, second row has N columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);
  element.replaceWith(table);
}
