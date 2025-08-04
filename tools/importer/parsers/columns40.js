/* global WebImporter */
export default function parse(element, { document }) {
  // Find all columns: each .cmp-our-foot-print__carousel-item is a column
  const items = Array.from(element.querySelectorAll('.cmp-our-foot-print__carousel-item'));
  if (!items.length) return;

  const headerRow = ['Columns (columns40)'];

  // For each column, preserve all content including text, headings, video links, etc.
  const columnsRow = items.map((carouselItem) => {
    // Try to get the direct child .item div which contains the card
    let content = carouselItem.querySelector('.item');
    if (!content) content = carouselItem;

    // EDGE CASE: If the card has a YouTube iframe, convert it to a link (not an embedded iframe)
    // and preserve all other content in order.
    const iframes = content.querySelectorAll('iframe');
    if (iframes.length > 0) {
      // For each iframe, replace with a link element
      iframes.forEach((iframe) => {
        if (iframe.src) {
          const a = document.createElement('a');
          a.href = iframe.src;
          a.textContent = 'Watch Video';
          a.target = '_blank';
          iframe.replaceWith(a);
        }
      });
    }
    // Return the reference to the content block (with links if any iframes were found)
    return content;
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);
  element.replaceWith(table);
}
