/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with the exact block name
  const headerRow = ['Embed (embedVideo33)'];

  // Gather all direct children (could be text, embed wrappers, etc)
  const cellContent = [];
  // Get all text nodes and element nodes, preserving order
  element.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) cellContent.push(text);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      cellContent.push(node);
    }
  });

  // Find iframe anywhere inside (for the embed link)
  const iframe = element.querySelector('iframe');
  let videoUrl = '';
  if (iframe && iframe.src) {
    videoUrl = iframe.src;
  }
  // Convert embed link to canonical short form if applicable
  let displayUrl = videoUrl;
  if (/youtube\.com\/embed\//.test(videoUrl)) {
    const match = videoUrl.match(/youtube.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      displayUrl = `https://youtu.be/${match[1]}`;
    }
  } else if (/vimeo.com\/video\//.test(videoUrl)) {
    const match = videoUrl.match(/vimeo.com\/video\/([0-9]+)/);
    if (match && match[1]) {
      displayUrl = `https://vimeo.com/${match[1]}`;
    }
  }

  // Always add the link last (unless already present as a text node)
  if (displayUrl) {
    // Only add if not already present as a link or in text nodes
    let alreadyPresent = false;
    cellContent.forEach(item => {
      if (typeof item === 'string' && item.includes(displayUrl)) alreadyPresent = true;
      if (item.tagName === 'A' && item.href === displayUrl) alreadyPresent = true;
    });
    if (!alreadyPresent) {
      const link = document.createElement('a');
      link.href = displayUrl;
      link.textContent = displayUrl;
      cellContent.push(link);
    }
  }

  // Structure: 1 header row, 1 content row (with all content in a single cell)
  const cells = [headerRow, [cellContent]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
