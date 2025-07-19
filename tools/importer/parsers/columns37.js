/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards root
  const cardsRoot = element.querySelector('.cmp-cards');
  if (!cardsRoot) return;

  // Find the heading, if present
  const heading = cardsRoot.querySelector('.cmp-cards__heading');

  // Find all card items (each is a column)
  const cardItems = Array.from(cardsRoot.querySelectorAll('.cmp-carousel__item'));
  if (cardItems.length === 0) return;

  // For each card, extract relevant elements (image and h5)
  const columns = cardItems.map(card => {
    const img = card.querySelector('img');
    const title = card.querySelector('.cmp-card__title');
    const cellDiv = document.createElement('div');
    if (img) cellDiv.appendChild(img);
    if (title) cellDiv.appendChild(title);
    return cellDiv;
  });

  // If there's a heading, prepend it to the cell in the first column
  if (heading && columns.length > 0) {
    columns[0].prepend(heading);
  }

  // The header row must have a single cell (one column),
  // followed by a row with as many columns as needed
  const headerRow = ['Columns (columns37)'];
  const rows = [headerRow, columns];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
