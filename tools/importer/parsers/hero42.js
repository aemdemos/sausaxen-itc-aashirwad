/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, exactly as in the example
  const headerRow = ['Hero (hero42)'];
  
  // --- Background Image Row ---
  let bgImgElem = '';
  const quizDiv = element.querySelector('.cmp-blog-quiz');
  if (quizDiv) {
    const style = quizDiv.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
    if (match) {
      bgImgElem = document.createElement('img');
      bgImgElem.src = match[1];
      bgImgElem.alt = '';
    }
  }
  const bgImgRow = [bgImgElem || ''];

  // --- Content Row ---
  let contentRowContent = [];
  // Use direct children of .cmp-blog-quiz__content, as this gives: h1 (title), main-content, actions (cta), etc.
  const contentDiv = element.querySelector('.cmp-blog-quiz__content');
  if (contentDiv) {
    // Collect all direct child nodes (preserves structure and all text)
    const nodes = [];
    contentDiv.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        nodes.push(node);
      }
    });
    contentRowContent = nodes.length ? nodes : [''];
  } else {
    contentRowContent = [''];
  }
  const contentRow = [contentRowContent];

  // --- Output table ---
  const cells = [headerRow, bgImgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
