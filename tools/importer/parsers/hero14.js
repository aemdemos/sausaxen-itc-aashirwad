/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from style attribute
  function extractBgUrl(style) {
    if (!style) return null;
    // Match url("...") or url('...') or url(...)
    const urlMatch = style.match(/url\(&quot;(.*?)&quot;\)/) || style.match(/url\(['"]?(.*?)['"]?\)/);
    return urlMatch ? urlMatch[1] : null;
  }

  // 1. Get the background image URL
  const bgUrl = extractBgUrl(element.getAttribute('style'));
  let bgImgEl = null;
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    // Set alt attribute from heading if available
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    bgImgEl.alt = heading ? heading.textContent.trim() : '';
  }

  // 2. Get the title and subheading (if present)
  // Reference the actual elements in the DOM, do not clone.
  const headingEl = element.querySelector('h1, h2, h3, h4, h5, h6');
  const subheadingEl = element.querySelector('p');
  // Compose the content cell as an array, only including present items
  const contentArr = [];
  if (headingEl) contentArr.push(headingEl);
  if (subheadingEl) contentArr.push(subheadingEl);

  // Compose the table
  const rows = [
    ['Hero (hero14)'],
    [bgImgEl || ''],
    [contentArr]
  ];

  // Create the table block and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
