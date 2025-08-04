/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards8)'];
  const rows = [];

  // Find all cards inside the carousel
  const cards = element.querySelectorAll('.cmp-carousel__item');
  cards.forEach(cardItem => {
    const card = cardItem.querySelector('.cmp-card');
    if (!card) return;
    const content = card.querySelector('.cmp-card__content');
    if (!content) return;

    // Get image element
    let imgEl = content.querySelector('.cmp-card__media .cmp-card__image img');
    let imageCell = imgEl ? imgEl : '';

    // Get text content (heading and description)
    const info = content.querySelector('.cmp-card__info');
    let textCell = document.createElement('div');
    let addedHeading = false;

    if (info) {
      // Heading
      const titleEl = info.querySelector('.cmp-card__title');
      if (titleEl) {
        let heading = titleEl.querySelector('h5,h4,h3,h2,h1');
        if (heading) {
          textCell.appendChild(heading);
          addedHeading = true;
        } else if (titleEl.textContent.trim()) {
          const strong = document.createElement('strong');
          strong.textContent = titleEl.textContent.trim();
          textCell.appendChild(strong);
          addedHeading = true;
        }
      }
      // Description
      const descEl = info.querySelector('.cmp-card__description');
      if (descEl) {
        Array.from(descEl.childNodes).forEach(node => {
          textCell.appendChild(node);
        });
      }
      // Fallback: Any <p> or text node directly under info that isn't part of the heading
      if (!descEl) {
        Array.from(info.childNodes).forEach(node => {
          // Skip the titleEl if present
          if (titleEl && (node === titleEl)) return;
          // Add any <p> or text node with non-empty value
          if (node.nodeType === 1 && node.tagName.toLowerCase() === 'p') {
            textCell.appendChild(node);
          } else if (node.nodeType === 3 && node.textContent.trim()) {
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            textCell.appendChild(p);
          }
        });
      }
    } else {
      // Fallback if .cmp-card__info missing
      const titleEl = content.querySelector('.cmp-card__title');
      if (titleEl) {
        let heading = titleEl.querySelector('h5,h4,h3,h2,h1');
        if (heading) {
          textCell.appendChild(heading);
          addedHeading = true;
        } else if (titleEl.textContent.trim()) {
          const strong = document.createElement('strong');
          strong.textContent = titleEl.textContent.trim();
          textCell.appendChild(strong);
          addedHeading = true;
        }
      }
      const descEl = content.querySelector('.cmp-card__description');
      if (descEl) {
        Array.from(descEl.childNodes).forEach(node => {
          textCell.appendChild(node);
        });
      }
      // Fallback: Any <p> or text node directly under content that isn't part of the heading
      if (!descEl) {
        Array.from(content.childNodes).forEach(node => {
          if (titleEl && (node === titleEl)) return;
          if (node.nodeType === 1 && node.tagName.toLowerCase() === 'p') {
            textCell.appendChild(node);
          } else if (node.nodeType === 3 && node.textContent.trim()) {
            const p = document.createElement('p');
            p.textContent = node.textContent.trim();
            textCell.appendChild(p);
          }
        });
      }
    }
    rows.push([
      imageCell,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
