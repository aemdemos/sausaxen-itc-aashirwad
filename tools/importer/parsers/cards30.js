/* global WebImporter */
export default function parse(element, { document }) {
  // Block name as per spec
  const headerRow = ['Cards (cards30)'];

  // Per example, this block represents a header/search/filter/sort area. All visible text content should be included in a single cell under the header.
  // The requirement is to reference existing elements where possible and to ensure all text is present and semantically grouped.

  // Gather all direct children (sections) to preserve block semantics
  const cellContent = [];

  // Heading: Find the first heading in the element
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) cellContent.push(heading);

  // Search input: Find the input with a placeholder and wrap in a span for display
  const searchInput = element.querySelector('input[placeholder]');
  if (searchInput) {
    const span = document.createElement('span');
    span.textContent = searchInput.placeholder;
    cellContent.push(span);
  }

  // All filter and sort names (to preserve order in UI)
  // Find all spans that have a filter/sort label class in DOM order
  const filtersAndSorts = element.querySelectorAll('.cmp-blog-discussion-listing__filters-name');
  filtersAndSorts.forEach(span => {
    cellContent.push(span);
  });

  // As a fallback, if no content has been extracted, use all visible text as a single div
  if (cellContent.length === 0) {
    const fallbackDiv = document.createElement('div');
    fallbackDiv.textContent = element.innerText.trim();
    cellContent.push(fallbackDiv);
  }

  // Compose rows for the block table
  const rows = [headerRow, [cellContent]];

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
