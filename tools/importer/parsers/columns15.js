/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cards block with the heading "Steps to Prepare"
  const cardsBlock = element.querySelector('.cmp-cards--aashirvaad-productStory');
  if (!cardsBlock) return;

  // Get the heading element
  const heading = cardsBlock.querySelector('.cmp-cards__heading');
  // Get all individual cards for columns
  const carouselItems = Array.from(cardsBlock.querySelectorAll('.cmp-carousel__item'));
  if (!carouselItems.length) return;

  // For each carousel item, extract the card element
  const cardElements = carouselItems.map(item => {
    const card = item.querySelector('.cmp-card');
    return card || document.createTextNode('');
  });

  // Compose header row (single column)
  const headerRow = ['Columns (columns15)'];
  // Compose first row: heading repeated to fill all columns
  const headingRow = cardElements.map(() => heading);
  // Compose second row: each card in its own column
  const cardsRow = cardElements;

  // Compose the table data
  const cells = [
    headerRow,
    headingRow,
    cardsRow
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block table
  element.replaceWith(table);
}
