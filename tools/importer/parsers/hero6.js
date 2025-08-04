/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block, per example
  const headerRow = ['Hero (hero6)'];

  // Find the teaser (should only be one per block)
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Background image: prefer desktop, fallback to mobile
  const bgImgUrl = teaser.getAttribute('data-background-image-desktop') || teaser.getAttribute('data-background-image-mobile');
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.alt = '';
  }

  // Title, subheading, CTA
  const content = teaser.querySelector('.cmp-teaser__content');
  const contentEls = [];
  if (content) {
    // Title: if present, keep tag (eg. h2)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) contentEls.push(title);
    // Description: if present, reference the element
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) contentEls.push(desc);
    // CTA: if present, reference the button/link container
    const action = content.querySelector('.cmp-teaser__action-container');
    if (action) contentEls.push(action);
  }

  // Compose the table as 3 rows, 1 column each
  const rows = [
    headerRow,
    [bgImgEl ? bgImgEl : ''],
    [contentEls.length ? contentEls : '']
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
