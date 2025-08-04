/* global WebImporter */
export default function parse(element, { document }) {
  // Find all cards/items for columns
  let cardItems = [];
  const slickTrack = element.querySelector('.slick-track');
  if (slickTrack) {
    cardItems = Array.from(slickTrack.querySelectorAll(':scope > .cmp-carousel__item'));
  }
  if (!cardItems.length) {
    cardItems = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  }
  if (!cardItems.length) {
    cardItems = Array.from(element.querySelectorAll('.cmp-card'));
  }

  // Build the columns' content arrays
  const columns = cardItems.map((card) => {
    // Flexible: gather all direct children with content (images, headings, etc)
    const content = card.querySelector('.cmp-card__content') || card;
    const colContent = [];
    // Add all images
    Array.from(content.querySelectorAll('img')).forEach(img => colContent.push(img));
    // Add headings
    Array.from(content.querySelectorAll('h1, h2, h3, h4, h5, h6')).forEach(h => colContent.push(h));
    // Add paragraphs
    Array.from(content.querySelectorAll('p')).forEach(p => colContent.push(p));
    // Add text nodes directly under content
    Array.from(content.childNodes).forEach(node => {
      if (node.nodeType === 3 && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        colContent.push(p);
      }
    });
    // Fallback if nothing else
    if (!colContent.length) colContent.push(content);
    return colContent;
  });

  // To match the spec: header is a single-cell row, second row has N columns
  const cells = [
    ['Columns (columns4)'], // header row, single cell
    columns // content row, one cell per column
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
