/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (exact match to example)
  const headerRow = ['Hero (hero6)'];

  // Locate the .cmp-teaser element inside the block
  const teaser = element.querySelector('.cmp-teaser');

  // ----- 2nd row: Background Image (optional) -----
  let bgImgElem = null;
  if (teaser) {
    // Try to extract background image URL (desktop preferred)
    let bgImgUrl = teaser.getAttribute('data-background-image-desktop');
    if (!bgImgUrl && teaser.style && teaser.style.backgroundImage) {
      // Fallback: background-image style
      const match = teaser.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        bgImgUrl = match[1];
      }
    }
    if (bgImgUrl) {
      bgImgElem = document.createElement('img');
      bgImgElem.src = bgImgUrl;
      bgImgElem.alt = '';
    }
  }

  // ----- 3rd row: Content (Title, Description, CTA) -----
  // We'll reference the existing elements for robust parsing
  let contentParts = [];
  if (teaser) {
    const content = teaser.querySelector('.cmp-teaser__content');
    if (content) {
      // Title (h2)
      const title = content.querySelector('.cmp-teaser__title');
      if (title) contentParts.push(title);
      // Description (p)
      const desc = content.querySelector('.cmp-teaser__description');
      if (desc) contentParts.push(desc);
      // CTA button (cmp-teaser__action-container)
      const action = content.querySelector('.cmp-teaser__action-container');
      if (action) contentParts.push(action);
    }
  }

  // Compose the rows according to the specification: always 1 column, always 3 rows
  const cells = [
    headerRow,
    [bgImgElem ? bgImgElem : ''],
    [contentParts.length ? contentParts : '']
  ];

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}