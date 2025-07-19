/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match the block name exactly, single column
  const headerRow = ['Hero (hero20)'];

  // Row 2: Background image (if present)
  let bgImg = '';
  const img = element.querySelector('img');
  if (img) {
    bgImg = img;
  }

  // Row 3: All text content as a single cell (headings, subheadings, paragraphs, etc)
  let contentCell = '';
  // Try to find .cmp-banner__main-content or fallback to any textual content in .cmp-banner__content (excluding the image)
  let textNodes = [];
  const mainContent = element.querySelector('.cmp-banner__main-content');
  if (mainContent && mainContent.childNodes.length > 0) {
    // Grab all element and non-empty text nodes inside mainContent
    textNodes = Array.from(mainContent.childNodes).filter(node => {
      if (node.nodeType === Node.ELEMENT_NODE) return true;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
      return false;
    });
  } else {
    // Fallback: look for any textual content except <img> in .cmp-banner__content
    const contentRoot = element.querySelector('.cmp-banner__content');
    if (contentRoot) {
      textNodes = Array.from(contentRoot.childNodes).filter(node => {
        // skip <img>
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'img') return false;
        if (node.nodeType === Node.ELEMENT_NODE) return true;
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) return true;
        return false;
      });
    }
  }
  if (textNodes.length > 0) {
    contentCell = textNodes;
  }
  // Final fallback if everything is empty: any trimmed text from .cmp-banner__content
  if (!contentCell || (Array.isArray(contentCell) && contentCell.length === 0)) {
    const fallback = element.querySelector('.cmp-banner__content');
    if (fallback && fallback.textContent.trim()) {
      contentCell = fallback.textContent.trim();
    }
  }

  // Compose the cells for the block: header, bgImg, text content
  const cells = [
    headerRow,
    [bgImg],
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
