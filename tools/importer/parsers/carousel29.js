/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Find all slide items
  const items = carousel.querySelectorAll('.cmp-carousel__item');

  // Build the rows
  const rows = [];
  rows.push(['Carousel (carousel29)']);

  items.forEach(item => {
    // Get the main image (prefer cmp-image__image)
    let img = null;
    const imgCandidates = item.querySelectorAll('img');
    if (imgCandidates.length > 0) {
      img = Array.from(imgCandidates).find(imgEl => imgEl.classList.contains('cmp-image__image')) || imgCandidates[0];
    }

    // Gather non-image content from the slide
    // - Any direct child of .cmp-carousel__item that is not .image or .cmp-container--center-align
    // - Any text node direct child (wrapped in <p>)
    // - Any overlay/caption, etc, inside image block but not the image itself
    const textNodes = [];
    Array.from(item.childNodes).forEach(node => {
      if (node.nodeType === 1) {
        if (!node.matches('.image, .cmp-container--center-align')) {
          textNodes.push(node);
        }
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        textNodes.push(p);
      }
    });
    // Also check for overlays/captions inside image blocks
    const imgWrapper = item.querySelector('.image, .cmp-container--center-align');
    if (imgWrapper) {
      Array.from(imgWrapper.children).forEach(child => {
        // Exclude the image itself
        if (!child.hasAttribute('data-cmp-is')) {
          textNodes.push(child);
        }
      });
    }

    const textCell = textNodes.length ? textNodes : '';
    rows.push([img || '', textCell]);
  });

  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
