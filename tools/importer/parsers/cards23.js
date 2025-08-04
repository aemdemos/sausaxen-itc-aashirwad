/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const cells = [['Cards (cards23)']];
  // Find all direct card blocks
  const cardDivs = element.querySelectorAll(':scope > .cmp-categorylist');
  cardDivs.forEach((cardDiv) => {
    const link = cardDiv.querySelector('a.cmp-categorylist__item');
    if (!link) return;
    const img = link.querySelector('.cmp-categorylist__imagewrapper img');
    const nameSpan = link.querySelector('.cmp-categorylist__name');

    // Prepare text cell: strong element for title, optionally wrapped in a link
    let textCell = '';
    if (nameSpan) {
      const strong = document.createElement('strong');
      strong.textContent = nameSpan.textContent.trim();
      if (link.href) {
        const headingLink = document.createElement('a');
        headingLink.href = link.href;
        if (link.title) headingLink.title = link.title;
        headingLink.appendChild(strong);
        textCell = headingLink;
      } else {
        textCell = strong;
      }
    }
    cells.push([
      img || '',
      textCell || '',
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
