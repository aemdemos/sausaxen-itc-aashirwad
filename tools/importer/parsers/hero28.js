/* global WebImporter */
export default function parse(element, { document }) {
  // Find the currently active carousel slide, using aria-hidden="false" for robustness
  let activeItem = element.querySelector('.cmp-carousel__item[aria-hidden="false"]');
  if (!activeItem) {
    activeItem = element.querySelector('.cmp-carousel__item--active');
  }
  if (!activeItem) return;

  // Find the .cmp-teaser inside the active item
  const teaser = activeItem.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get the background image (desktop, as in the spec)
  const bgImgUrl = teaser.getAttribute('data-background-image-desktop');
  let bgImgEl = '';
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }

  // Compose the main content
  const teaserContent = teaser.querySelector('.cmp-teaser__content');
  let contentCell = [];
  
  if (teaserContent) {
    // Gather all immediate children to preserve all text, semantic tags, and ordering
    contentCell = Array.from(teaserContent.children);
  }

  // Compose table as per block spec and markdown example
  const cells = [
    ['Hero (hero28)'],
    [bgImgEl],
    [contentCell]
  ];

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
