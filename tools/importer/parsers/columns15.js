/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards section that contains the steps
  const cardsBlock = element.querySelector('.cmp-cards');
  if (!cardsBlock) return;

  // Get the heading (e.g., "Steps to Prepare")
  const heading = cardsBlock.querySelector('.cmp-cards__heading');

  // Get each card (method)
  const cardItems = cardsBlock.querySelectorAll('.cmp-carousel__item');
  const columns = [];
  cardItems.forEach((item) => {
    const cardContent = [];
    // Image
    const img = item.querySelector('img');
    if (img) cardContent.push(img);
    // Title (should be an h5)
    const title = item.querySelector('.cmp-card__title h5');
    if (title) cardContent.push(title);
    // Description (should be a p)
    const desc = item.querySelector('.cmp-card__description p');
    if (desc) cardContent.push(desc);
    columns.push(cardContent);
  });

  // Build the block table structure as per Columns block rules:
  // First row: header, exact value 'Columns (columns15)'
  // Second row: one cell for each card column
  const tableRows = [
    ['Columns (columns15)'],
    columns
  ];

  // If there's a heading, prepend it to the first cell spanning all columns (as per the visual layout)
  if (heading) {
    const headingDiv = document.createElement('div');
    headingDiv.appendChild(heading);
    // The heading should be a row above the cards, single cell spanning all columns
    tableRows.splice(1, 0, [headingDiv]);
  }

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
