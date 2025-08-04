/* global WebImporter */
export default function parse(element, { document }) {
  // Find all the cards (immediate children with .cmp-recipe-group__carousel-item)
  let cards = Array.from(element.querySelectorAll(':scope > .slick-track > .cmp-recipe-group__carousel-item'));
  // Fallback: try to get direct children (for resilience)
  if (!cards.length) {
    cards = Array.from(element.querySelectorAll('.cmp-recipe-group__carousel-item'));
  }
  
  const rows = [['Cards (cards17)']];

  cards.forEach(card => {
    // The clickable card link
    const cardLink = card.querySelector('a.card');
    if (!cardLink) return;

    // 1. IMAGE (always required, in left cell)
    const img = cardLink.querySelector('.cmp-card__image img');
    
    // 2. TEXTUAL CONTENT (all in right cell)
    // We'll build an array for the right cell
    const infoCell = [];

    // Get category/tag (optional, often present)
    const tagP = cardLink.querySelector('.cmp-card__tag-wrapper p');
    if (tagP && tagP.textContent.trim()) {
      const tagDiv = document.createElement('div');
      tagDiv.textContent = tagP.textContent.trim();
      infoCell.push(tagDiv);
    }

    // Get the card title (h4)
    const titleH4 = cardLink.querySelector('.cmp-card__title h4');
    if (titleH4 && titleH4.textContent.trim()) {
      const cardTitle = document.createElement('h4');
      cardTitle.textContent = titleH4.textContent.trim();
      infoCell.push(cardTitle);
    }

    // Get the recipe footer for time and difficulty
    const footer = cardLink.querySelector('.cmp-card__recipe_footer');
    if (footer) {
      // Get time
      const timeP = footer.querySelector('.cmp-card__time-in-minutes p');
      if (timeP && timeP.textContent.trim()) {
        const timeDiv = document.createElement('div');
        timeDiv.textContent = timeP.textContent.trim();
        infoCell.push(timeDiv);
      }
      // Get difficulty
      const diffP = footer.querySelector('.cmp-card__difficulty-level p');
      if (diffP && diffP.textContent.trim()) {
        const diffDiv = document.createElement('div');
        diffDiv.textContent = diffP.textContent.trim();
        infoCell.push(diffDiv);
      }
    }

    // If for some reason infoCell is empty, fallback to the card
    rows.push([
      img || '',
      infoCell.length > 0 ? infoCell : card
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
