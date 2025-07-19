/* global WebImporter */
export default function parse(element, { document }) {
  // Extract background image URL from style attribute
  let bgUrl = null;
  const style = element.getAttribute('style') || '';
  const urlMatch = style.match(/url\((?:'|")?(.*?)(?:'|")?\)/i);
  if (urlMatch && urlMatch[1]) {
    // Remove any trailing parameters (e.g., after a comma)
    bgUrl = urlMatch[1].split(',')[0].trim();
  }
  // Create an <img> element for the background image if available
  let imgEl = '';
  if (bgUrl) {
    imgEl = document.createElement('img');
    imgEl.src = bgUrl;
    imgEl.alt = '';
  }
  // Gather all existing content elements (heading, posted date)
  // Reference the original elements directly (do not clone), for DOMUtils block compatibility
  const contentElems = [];
  for (let child of element.children) {
    if (child.tagName === 'H1' || child.tagName === 'H2' || child.tagName === 'H3') {
      contentElems.push(child); // Heading(s)
    } else if (child.tagName === 'P') {
      contentElems.push(child); // Posted date or subtitle
    } // Ignore others (not present in provided examples)
  }
  // Table structure: Header, Image, Content
  const rows = [
    ['Hero (hero14)'],
    [imgEl],
    [contentElems]
  ];
  // Build table and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
