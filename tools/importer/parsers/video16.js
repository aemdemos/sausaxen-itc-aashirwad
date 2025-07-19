/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all direct contents (text and elements) from the element
  // This will ensure that both images and any surrounding/present text are preserved
  const cellContent = [];
  element.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
      // Wrap text node in a <span> to preserve it
      const span = document.createElement('span');
      span.textContent = child.textContent;
      cellContent.push(span);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      cellContent.push(child);
    }
  });

  // Check if there is a YouTube thumbnail image to create a link
  const img = element.querySelector('img');
  if (img && img.src) {
    const match = img.src.match(/\/vi\/([\w-]+)\//);
    if (match && match[1]) {
      const videoId = match[1];
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const link = document.createElement('a');
      link.href = videoUrl;
      link.textContent = videoUrl;
      cellContent.push(link);
    }
  }

  if (cellContent.length === 0) cellContent.push('');

  const cells = [
    ['Video'], // Header matches example exactly
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
