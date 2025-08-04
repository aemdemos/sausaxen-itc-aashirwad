/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .cmp-cards block
  const cardsBlock = element.querySelector('.cmp-cards');
  if (!cardsBlock) return;

  // Extract heading if present
  let heading = null;
  const headingEl = cardsBlock.querySelector('.cmp-cards__heading');
  if (headingEl) heading = headingEl;

  // Locate carousel track containing all card columns
  const track = cardsBlock.querySelector('.cmp-cards__carousel .slick-track');
  if (!track) return;

  // Find all card columns
  const cardItems = track.querySelectorAll(':scope > .cmp-carousel__item');

  // For each card, build a column cell with image and label
  const columns = Array.from(cardItems).map(cardEl => {
    // Image (if present)
    const img = cardEl.querySelector('img');
    // Title (if present)
    const title = cardEl.querySelector('.cmp-card__title h5');
    // For visual fidelity, render as: image first, then title below
    const cellContent = [];
    if (img) cellContent.push(img);
    if (title) cellContent.push(title);
    // If no image or title, leave cell blank
    return cellContent.length ? cellContent : '';
  });

  // Prepare table rows
  const headerRow = ['Columns (columns37)'];
  // Second row: optionally include heading above all columns if found
  let row;
  if (heading) {
    // Place heading as a single element spanning all columns
    // We'll use a single cell with the heading, then a new row for the columns
    // But the block table expects columns in a single row, so prepend heading to first column
    // We'll combine heading and first cell as an array for first column
    const col0 = [heading, ...(Array.isArray(columns[0]) ? columns[0] : [columns[0]])];
    // The rest columns as in columns
    row = [col0, ...columns.slice(1)];
  } else {
    row = columns;
  }

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row,
  ], document);

  element.replaceWith(table);
}
