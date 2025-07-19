/* global WebImporter */
export default function parse(element, { document }) {
  // The provided HTML contains only a gradient div (visual only, no card content).
  // According to the specification and the markdown example, no Section Metadata is needed,
  // and only the header row ('Cards (cards27)') should be created if there is no card content.
  // No content is being missed, and the header row matches the example exactly.
  const cells = [
    ['Cards (cards27)']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}