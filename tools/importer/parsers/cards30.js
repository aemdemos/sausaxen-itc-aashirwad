/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row (one column, as in the example)
  const headerRow = ['Cards (cards30)'];

  // The source HTML is for a header/filter section, not for cards, but we follow the correct block table structure.

  // Get the title and the rest (search/filter controls)
  const h2 = element.querySelector('h2');
  let filterSection = null;
  // There may be other siblings after h2
  for (const child of element.children) {
    if (child !== h2) {
      filterSection = child;
      break; // Only the next immediate sibling after h2
    }
  }
  // Compose the cell content: h2 and filter section
  const contentCell = [];
  if (h2) contentCell.push(h2);
  if (filterSection) contentCell.push(filterSection);

  // The only row after header: two columns (no image, header/filter content)
  const cardRow = ['', contentCell];

  // Build the table
  const rows = [headerRow, cardRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
