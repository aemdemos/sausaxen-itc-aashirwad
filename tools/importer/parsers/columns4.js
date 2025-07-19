/* global WebImporter */
export default function parse(element, { document }) {
  // Get the cards block heading, if present
  let heading = '';
  const headingEl = element.querySelector('.cmp-cards__heading, h2');
  if (headingEl) {
    heading = headingEl.textContent.trim();
  }
  
  // Get all columns from the carousel items
  let cardItems = element.querySelectorAll('.cmp-carousel__item');
  if (!cardItems.length) {
    // Fallback in case the markup is different
    cardItems = element.querySelectorAll('.cmp-card');
  }

  // Prepare all columns content, reference full content for resilience
  const columns = Array.from(cardItems).map(cardItem => {
    // Use the .cmp-card__content if available (includes image and text)
    let content = cardItem.querySelector('.cmp-card__content');
    if (!content) {
      // Fallback to direct children if structure varies
      content = cardItem;
    }
    // Always return the element itself so that all text and images are included
    return content;
  });

  // If there is a heading, add it to the first column at the top
  if (heading && columns.length > 0) {
    const headingDiv = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = heading;
    headingDiv.appendChild(h2);
    headingDiv.appendChild(columns[0]);
    columns[0] = headingDiv;
  }

  // Build the table, header matches the example "Columns (columns4)"
  const cells = [
    ['Columns (columns4)'],
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
