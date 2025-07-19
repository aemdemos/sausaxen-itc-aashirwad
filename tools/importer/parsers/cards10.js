/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow];

  // Get only the visually-present, non-cloned cards
  const cardItems = Array.from(element.querySelectorAll('.cmp-carousel__item.slick-slide'))
    .filter(card => !card.classList.contains('slick-cloned'));

  cardItems.forEach(card => {
    // Get the image (first img in card, if present)
    const img = card.querySelector('img');
    // Grab the info area (should include heading and text)
    const info = card.querySelector('.cmp-card__info');
    let textCellContent = [];
    if (info) {
      // Reference all children of info (to preserve semantic structure and formatting)
      for (const child of info.children) {
        textCellContent.push(child);
      }
    }
    // Defensive: if info block is empty, include empty string
    if (!textCellContent.length) textCellContent = [''];
    rows.push([
      img || '',
      textCellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
