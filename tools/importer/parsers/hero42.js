/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Hero (hero42)'];

  // Extract background image from style attribute
  let bgImgEl = '';
  const cmpBlogQuiz = element.querySelector('.cmp-blog-quiz');
  if (cmpBlogQuiz && cmpBlogQuiz.style && cmpBlogQuiz.style.backgroundImage) {
    const urlMatch = cmpBlogQuiz.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
    if (urlMatch && urlMatch[1]) {
      const img = document.createElement('img');
      img.src = urlMatch[1];
      img.alt = '';
      bgImgEl = img;
    }
  }

  // Extract content: reference whole content block for all text and structure
  let contentCell;
  const contentDiv = element.querySelector('.cmp-blog-quiz__content');
  if (contentDiv) {
    contentCell = contentDiv;
  } else {
    // fallback: use the whole element if sub-block is missing
    contentCell = element;
  }

  const rows = [
    headerRow,
    [bgImgEl ? bgImgEl : ''],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
