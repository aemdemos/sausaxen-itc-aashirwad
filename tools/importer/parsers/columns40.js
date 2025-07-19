/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel container holding all the columns
  const carousel = element.querySelector('.cmp-carousel__container');
  if (!carousel) return;

  // Find all columns: each .item inside the slick-track is a column
  const items = Array.from(carousel.querySelectorAll('.slick-track > .item'));
  if (!items.length) return;

  // For each item, extract the card content and replace any iframe with a link
  const columns = items.map((item) => {
    // The root card container is .cmp-card, but sometimes it's wrapped in .card
    let cardContent = item.querySelector('.cmp-card');
    if (!cardContent) cardContent = item; // fallback, should never happen
    
    // Clone to avoid modifying source
    const fragment = document.createElement('div');
    // Move all children to the fragment
    Array.from(cardContent.childNodes).forEach((n) => fragment.appendChild(n.cloneNode(true)));

    // Replace all iframes (that are not images) with links
    fragment.querySelectorAll('iframe[src]').forEach((iframe) => {
      const src = iframe.getAttribute('src');
      const a = document.createElement('a');
      a.href = src;
      a.textContent = src;
      iframe.replaceWith(a);
    });
    return fragment;
  });

  // Compose the table rows as per block requirements
  const cells = [];
  cells.push(['Columns (columns40)']); // Exact header
  cells.push(columns); // Each column is a cell

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
