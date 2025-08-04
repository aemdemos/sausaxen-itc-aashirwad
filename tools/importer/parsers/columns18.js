/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, exactly as in the example
  const headerRow = ['Columns (columns18)'];

  // Get the immediate children that represent columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  let col1Content = [];
  let col2Content = [];

  // Utility: collect all meaningful nodes (including text) from a container
  function collectContent(node) {
    const result = [];
    node.childNodes.forEach(n => {
      if (n.nodeType === Node.ELEMENT_NODE) {
        result.push(n);
      } else if (n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0) {
        // Wrap text nodes in span to keep text content
        const span = document.createElement('span');
        span.textContent = n.textContent;
        result.push(span);
      }
    });
    return result;
  }

  // First column: main video content (left)
  if (columns[0]) {
    col1Content = collectContent(columns[0]);
  }
  // Second column: thumbnail section (right)
  if (columns[1]) {
    col2Content = collectContent(columns[1]);
  }

  // Guarantee both columns are present
  if (col1Content.length === 0) col1Content = [''];
  if (col2Content.length === 0) col2Content = [''];

  // Structure matches: header, row with two columns
  const cells = [
    headerRow,
    [col1Content, col2Content]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
