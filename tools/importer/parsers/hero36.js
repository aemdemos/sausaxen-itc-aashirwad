/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero36)'];

  // 2. Get the hero teaser block
  const teaser = element.querySelector('.cmp-teaser');

  // 3. Get background image URL from the teaser
  let bgImgRow = [''];
  if (teaser) {
    let bgImgUrl = teaser.getAttribute('data-background-image-desktop');
    if (!bgImgUrl) {
      const style = teaser.getAttribute('style');
      if (style) {
        const match = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
        if (match) {
          bgImgUrl = match[1];
        }
      }
    }
    if (bgImgUrl) {
      const img = document.createElement('img');
      img.src = bgImgUrl;
      img.alt = '';
      bgImgRow = [img];
    }
  }

  // 4. Block content: All visible content (headings/text/buttons) from .cmp-teaser__content or teaser
  let contentRow = [''];
  if (teaser) {
    // Prefer .cmp-teaser__content if present, else use teaser itself
    const contentEl = teaser.querySelector('.cmp-teaser__content') || teaser;
    // Gather all direct children nodes that are not empty text
    const nodes = Array.from(contentEl.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
    // If there's only one node and it's a wrapper div, we can flatten
    if (nodes.length === 1 && nodes[0].nodeType === Node.ELEMENT_NODE && nodes[0].tagName === 'DIV') {
      const innerNodes = Array.from(nodes[0].childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
      if (innerNodes.length > 0) {
        contentRow = [innerNodes];
      } else {
        contentRow = [nodes];
      }
    } else if (nodes.length > 0) {
      contentRow = [nodes];
    }
  }

  // 5. Build and replace
  const cells = [headerRow, bgImgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
