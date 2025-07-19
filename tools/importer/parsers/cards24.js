/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the header row as specified
  const cells = [
    ['Cards (cards24)']
  ];
  // Find all .cmp-text blocks that might represent card content
  const cardBlocks = Array.from(element.querySelectorAll('.cmp-text'));
  cardBlocks.forEach(tb => {
    // Collect all non-empty children (paragraphs, headings, etc.)
    const content = Array.from(tb.children).filter(child => child.textContent.trim());
    if (content.length > 0) {
      cells.push([content]);
    }
  });
  // Only the header row will be present if there is no content in the source HTML
  // The function still produces card rows if card content exists
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}