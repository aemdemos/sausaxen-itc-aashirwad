/* global WebImporter */
export default function parse(element, { document }) {
  // Table header for Cards block
  const headerRow = ['Cards (cards26)'];

  // Find carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // All cards are in .cmp-carousel__item
  const cardEls = carousel.querySelectorAll('.cmp-recipe-group__carousel-item');
  if (!cardEls.length) return;

  // Build table rows for each card
  const rows = Array.from(cardEls).map(cardEl => {
    // Get link (for entire card)
    const cardLink = cardEl.querySelector('a.card');

    // Get image (should always exist)
    const img = cardEl.querySelector('.cmp-card__image img');
    let imgEl = null;
    if (img) {
      imgEl = img;
    }

    // Get text content: tag, title, meta (time, difficulty)
    const info = cardEl.querySelector('.cmp-card__info');
    // Compose everything in a fragment
    const frag = document.createDocumentFragment();

    // Tag (category)
    if (info) {
      const tag = info.querySelector('.cmp-card__tag-wrapper p');
      if (tag && tag.textContent.trim()) {
        const tagP = document.createElement('p');
        tagP.textContent = tag.textContent.trim();
        frag.appendChild(tagP);
      }
      // Title (as heading)
      const title = info.querySelector('.cmp-card__title h4');
      if (title && title.textContent.trim()) {
        // Reference the actual heading element
        frag.appendChild(title);
      }
      // Footer (time & difficulty)
      const footer = info.querySelector('.cmp-card__recipe_footer');
      if (footer) {
        const metaBits = [];
        // Time
        const time = footer.querySelector('.cmp-card__time-in-minutes p');
        if (time && time.textContent.trim()) {
          metaBits.push(time);
        }
        // Difficulty
        const diff = footer.querySelector('.cmp-card__difficulty-level p');
        if (diff && diff.textContent.trim()) {
          metaBits.push(diff);
        }
        if (metaBits.length) {
          // Put each meta in a <span> separated by space
          const metaDiv = document.createElement('div');
          metaBits.forEach((el, i) => {
            const span = document.createElement('span');
            span.textContent = el.textContent.trim();
            if (i > 0) metaDiv.appendChild(document.createTextNode(' '));
            metaDiv.appendChild(span);
          });
          frag.appendChild(metaDiv);
        }
      }
    }

    // If card has a link, wrap the text in a link (preserve child structure)
    let textContentFinal = frag;
    if (cardLink && cardLink.href) {
      const linkElem = document.createElement('a');
      linkElem.href = cardLink.href;
      // Move all children from frag into the link
      while (frag.firstChild) {
        linkElem.appendChild(frag.firstChild);
      }
      textContentFinal = linkElem;
    }

    return [imgEl, textContentFinal];
  });

  // Compose final cells array
  const cells = [headerRow, ...rows];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
