/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: build the text cell using all content in .cmp-card__info (title+desc)
  function buildTextCell(cardItem) {
    // .cmp-card__info includes title and description (or just title)
    const info = cardItem.querySelector('.cmp-card__info');
    if (info) {
      // Use all children (to catch future variants, e.g. description, ctas)
      const fragment = document.createDocumentFragment();
      Array.from(info.childNodes).forEach(node => {
        fragment.appendChild(node.cloneNode(true));
      });
      return fragment;
    }
    // fallback: just title if info missing
    const title = cardItem.querySelector('.cmp-card__title');
    if (title) return title.cloneNode(true);
    return '';
  }

  // Find the carousel track that contains the cards
  const carouselTrack = element.querySelector('.slick-track');
  if (!carouselTrack) return;

  // Find all card items (each is a card)
  const cardItems = Array.from(carouselTrack.querySelectorAll('.cmp-carousel__item'));

  // Build table rows for each card
  const rows = cardItems.map(cardItem => {
    // Image cell
    const img = cardItem.querySelector('img');
    // Text cell: all info content (title + description)
    const textCell = buildTextCell(cardItem);
    return [img, textCell];
  });

  // Compose the full table: header row, then all card rows
  const cells = [
    ['Cards (cards8)'],
    ...rows,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
