/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Cards (cards23)'];

  // Gather all immediate card divs
  const cardDivs = Array.from(element.querySelectorAll(':scope > div.cmp-categorylist'));

  const cardRows = cardDivs.map(cardDiv => {
    const anchor = cardDiv.querySelector('a.cmp-categorylist__item');
    if (!anchor) return ['',''];
    // First cell: the image (reference the actual <img> element)
    const imgWrapper = anchor.querySelector('.cmp-categorylist__imagewrapper');
    let img = imgWrapper ? imgWrapper.querySelector('img') : null;
    // Second cell: the title (reference the text, as a strong, wrapped in a link)
    const nameEl = anchor.querySelector('.cmp-categorylist__name');
    let titleCell = '';
    if (nameEl) {
      // Title as <strong>
      const strong = document.createElement('strong');
      strong.textContent = nameEl.textContent.trim();
      // Make the whole <strong> a link
      if (anchor.href) {
        const link = document.createElement('a');
        link.href = anchor.href;
        link.title = anchor.title || '';
        link.appendChild(strong);
        titleCell = link;
      } else {
        titleCell = strong;
      }
    }
    return [img, titleCell];
  });

  const cells = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
