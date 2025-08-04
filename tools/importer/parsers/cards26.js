/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block spec
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find the carousel track
  const track = element.querySelector('.slick-track');
  if (!track) return;

  // Find all carousel items (cards)
  const cards = track.querySelectorAll('.cmp-recipe-group__carousel-item, .cmp-carousel__item');

  cards.forEach((card) => {
    // Only process if there is a card link
    const link = card.querySelector('a.card');
    if (!link) return;

    // --- First cell: card image ---
    let img = link.querySelector('.cmp-card__image img');
    let imageCell = img || '';

    // --- Second cell: text content ---
    // We'll preserve the category, card title, and footer info (time, difficulty)
    const textFrag = document.createElement('div');

    // Category/tag line (optional)
    const tagP = link.querySelector('.cmp-card__tag-wrapper p');
    if (tagP && tagP.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = tagP.textContent.trim();
      textFrag.appendChild(p);
    }

    // Card title: as heading (h4)
    const h4 = link.querySelector('.cmp-card__title h4');
    if (h4 && h4.textContent.trim()) {
      // Reference the actual h4 node for semantic accuracy
      textFrag.appendChild(h4);
    }

    // Description details: time and difficulty from recipe_footer
    const footer = link.querySelector('.cmp-card__recipe_footer');
    if (footer) {
      const time = footer.querySelector('.cmp-card__time-in-minutes p');
      const diff = footer.querySelector('.cmp-card__difficulty-level p');
      if ((time && time.textContent.trim()) || (diff && diff.textContent.trim())) {
        const descP = document.createElement('p');
        let desc = '';
        if (time && time.textContent.trim()) {
          desc += time.textContent.trim();
        }
        if (diff && diff.textContent.trim()) {
          if (desc) desc += ' | ';
          desc += diff.textContent.trim();
        }
        descP.textContent = desc;
        textFrag.appendChild(descP);
      }
    }

    rows.push([
      imageCell,
      textFrag
    ]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
