/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const cells = [['Hero (hero20)']];

  // 2nd row: Background image (optional)
  // Try to find the first <img> inside the element
  let imageEl = element.querySelector('img');
  cells.push([imageEl || '']);

  // 3rd row: Text content (headline, subheadline, cta, etc)
  // Collect all non-image, non-empty elements within the banner
  // Find the main content area within the banner structure
  let contentElements = [];
  // Find the area likely to hold content
  let mainContent = element.querySelector('.cmp-banner__main-content');
  if (mainContent && mainContent.childNodes.length > 0) {
    // Only include non-empty, non-whitespace nodes
    contentElements = Array.from(mainContent.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return false;
    });
  } else {
    // Fallback: use all text and elements in .cmp-banner__content except the image
    const bannerContent = element.querySelector('.cmp-banner__content');
    if (bannerContent) {
      contentElements = Array.from(bannerContent.childNodes).filter(node => {
        if (node === imageEl) return false;
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Exclude the image and empty
          if (node.tagName === 'IMG') return false;
          return node.textContent.trim().length > 0;
        }
        return false;
      });
    }
  }

  // If nothing found, fallback to all visible text on the element except image alt text
  if (contentElements.length === 0) {
    let allText = '';
    // Remove image alt text
    if (imageEl) {
      imageEl.setAttribute('alt', '');
    }
    allText = element.textContent.trim();
    if (allText.length > 0) {
      const div = document.createElement('div');
      div.textContent = allText;
      contentElements = [div];
    }
  }

  cells.push([contentElements.length === 1 ? contentElements[0] : contentElements]);

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
