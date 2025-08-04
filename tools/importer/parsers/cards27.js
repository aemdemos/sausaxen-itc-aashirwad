/* global WebImporter */
export default function parse(element, { document }) {
  // The provided HTML is only: <div class="bottom-container-gradient"></div>
  // There is no card content or metadata to extract.
  // Per spec, only the header row should be created.
  const cells = [
    ['Cards (cards27)']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
