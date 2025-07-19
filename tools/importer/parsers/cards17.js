/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards17)'];

  // Find all visible, unique card elements by their link href
  const allCardItems = Array.from(element.querySelectorAll(':scope > .slick-track > .cmp-recipe-group__carousel-item'));
  const seen = new Set();
  const uniqueCards = allCardItems.filter(card => {
    const link = card.querySelector('a.card');
    if (!link) return false;
    const href = link.getAttribute('href');
    if (!href || seen.has(href)) return false;
    seen.add(href);
    return true;
  });

  // For each card, extract the image and ALL text content in the right cell
  const cardRows = uniqueCards.map(card => {
    // Image for first cell
    const img = card.querySelector('img');
    // Second cell: all text content as a <div>
    const info = card.querySelector('.cmp-card__info');
    const textDiv = document.createElement('div');
    if (info) {
      // Tag (top line)
      const tag = info.querySelector('.cmp-card__tag-wrapper p');
      if (tag && tag.textContent.trim()) {
        const tagP = document.createElement('p');
        tagP.textContent = tag.textContent.trim();
        textDiv.appendChild(tagP);
      }
      // Title (as <strong> in example)
      const title = info.querySelector('.cmp-card__title h4');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textDiv.appendChild(strong);
        textDiv.appendChild(document.createElement('br'));
      }
      // Any other description in <p> after title and tag, but not in footer
      const tagP = info.querySelector('.cmp-card__tag-wrapper p');
      const footer = info.querySelector('.cmp-card__recipe_footer');
      info.querySelectorAll('p').forEach(p => {
        if (p !== tagP && (!footer || !footer.contains(p)) && p !== title) {
          // Not tag, not footer, not the title h4
          if (p.textContent.trim()) {
            const descP = document.createElement('p');
            descP.textContent = p.textContent.trim();
            textDiv.appendChild(descP);
          }
        }
      });
      // Footer: time and difficulty
      if (footer) {
        const time = footer.querySelector('.cmp-card__time-in-minutes p');
        const diff = footer.querySelector('.cmp-card__difficulty-level p');
        let footerText = '';
        if (time && time.textContent.trim()) {
          footerText += time.textContent.trim();
        }
        if (diff && diff.textContent.trim()) {
          if (footerText) footerText += ' | ';
          footerText += diff.textContent.trim();
        }
        if (footerText) {
          const span = document.createElement('span');
          span.textContent = footerText;
          textDiv.appendChild(document.createElement('br'));
          textDiv.appendChild(span);
        }
      }
    }
    return [img, textDiv];
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cardRows
  ], document);

  // Replace the original element in place
  element.replaceWith(table);
}
