/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row
  const headerRow = ['Cards (cards38)'];
  const rows = [headerRow];

  // Each product card
  // There may be multiple .cmp-categorylist in a row, each with one .cmp-categorylist__item
  const cardLists = element.querySelectorAll('.cmp-categorylist');
  cardLists.forEach((cardList) => {
    const item = cardList.querySelector('.cmp-categorylist__item');
    if (!item) return;
    // IMAGE (first cell)
    const img = item.querySelector('img');
    // TEXT (second cell):
    // Title: .cmp-categorylist__name
    // CTA: button text, but link should be the product link (the <a> wrapping the image)
    const titleEl = item.querySelector('.cmp-categorylist__name');
    let ctaButtonText = '';
    const ctaBtn = item.querySelector('.cmp-button__text');
    if (ctaBtn) ctaButtonText = ctaBtn.textContent.trim();
    // The a tag is always the sibling of the image
    const aEl = item.querySelector('a');
    let ctaHref = '';
    if (aEl) ctaHref = aEl.getAttribute('href') || '';

    // Build text cell
    const textDiv = document.createElement('div');
    if (titleEl) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      textDiv.appendChild(strong);
    }
    if (ctaButtonText && ctaHref) {
      textDiv.appendChild(document.createElement('br'));
      const link = document.createElement('a');
      link.href = ctaHref;
      link.textContent = ctaButtonText;
      textDiv.appendChild(link);
    }
    rows.push([img, textDiv]);
  });
  // Replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
