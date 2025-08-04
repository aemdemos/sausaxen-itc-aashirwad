/* global WebImporter */
export default function parse(element, { document }) {
  // Assemble the Cards (cards24) block, even if content is empty

  // Create the header row exactly as specified
  const cells = [['Cards (cards24)']];

  // Find all direct or nested .cmp-text or .text blocks that are not empty
  // These are where the actual text content resides in this kind of AEM structure
  const textBlocks = Array.from(element.querySelectorAll('.cmp-text, .text'));

  // Filter out blocks that have only whitespace or non-breaking spaces
  const contentBlocks = textBlocks.filter(block => {
    const txt = block.textContent.replace(/\u00a0|\s|&nbsp;/g, '');
    return txt.length > 0;
  });

  // For each non-empty content block, add a row with the existing element
  for (const block of contentBlocks) {
    cells.push([block]);
  }

  // If absolutely no content blocks, but there's some other visible text, include it in a <p>
  if (cells.length === 1) {
    const fallbackText = element.textContent && element.textContent.replace(/\u00a0|&nbsp;/g, '').trim();
    if (fallbackText) {
      const p = document.createElement('p');
      p.textContent = fallbackText;
      cells.push([p]);
    }
  }
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
