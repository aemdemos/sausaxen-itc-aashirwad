/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const headerRow = ['Cards (cards10)'];

  // Find all cards (including slick-cloned to cover all cards, but dedupe)
  const cardNodes = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  const seenKeys = new Set();
  const cardRows = [];

  for (const cardNode of cardNodes) {
    // Find card content wrapper (for robustness)
    const cardContent = cardNode.querySelector('.cmp-card__content') || cardNode;

    // First cell: Find the img element
    const img = cardContent.querySelector('img');
    if (!img) continue; // Each card must have an image according to block spec

    // Second cell: Get all text (title & description)
    let textCell = [];
    // Title: use heading if present, otherwise strong
    let title = null;
    const titleContainer = cardContent.querySelector('.cmp-card__title');
    if (titleContainer) {
      const heading = titleContainer.querySelector('h1,h2,h3,h4,h5,h6');
      if (heading) {
        title = heading;
      } else if (titleContainer.textContent.trim()) {
        title = document.createElement('strong');
        title.textContent = titleContainer.textContent.trim();
      }
    }
    if (title) textCell.push(title);

    // Description: supports any markup (p, div, span, text)
    const descContainer = cardContent.querySelector('.cmp-card__description');
    if (descContainer) {
      // Gather all children, preserving inline structure
      Array.from(descContainer.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          textCell.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = node.textContent;
          textCell.push(span);
        }
      });
    }
    
    // Fallback: if no title or description, add textContent (should rarely occur)
    if (textCell.length === 0) {
      const fallback = cardContent.textContent.trim();
      if (fallback) {
        textCell.push(document.createTextNode(fallback));
      }
    }

    // Deduplicate: key on image src + all text
    const key = img.src + '|' + textCell.map(e => e.textContent || (typeof e === 'string' ? e : '')).join(' ');
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);

    // Only add rows with image and text
    if (img && textCell.length > 0) {
      cardRows.push([img, textCell]);
    }
  }

  if (cardRows.length) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ...cardRows
    ], document);
    element.replaceWith(table);
  }
}
