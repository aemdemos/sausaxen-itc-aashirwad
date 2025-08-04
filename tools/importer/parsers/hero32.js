/* global WebImporter */
export default function parse(element, { document }) {
  // Get the carousel (which contains the hero banner)
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get the current/active carousel item
  let activeItem = carousel.querySelector('.cmp-carousel__item--active');
  if (!activeItem) {
    // fallback to first .cmp-carousel__item if no active
    activeItem = carousel.querySelector('.cmp-carousel__item');
  }
  if (!activeItem) return;

  // Get the .cmp-banner__content block that contains image and (sometimes) text
  const banner = activeItem.querySelector('.cmp-banner');
  if (!banner) return;
  const bannerContent = banner.querySelector('.cmp-banner__content');
  if (!bannerContent) return;

  // Find the image representing the hero background
  const img = bannerContent.querySelector('img');

  // Prepare content for the third row (headings, paragraphs, etc)
  // Approach: collect *all* non-image nodes from bannerContent, including those nested in .cmp-banner__product-benefits
  let contentNodes = [];
  // Get direct children that are NOT the hero image
  Array.from(bannerContent.childNodes).forEach(node => {
    if (node.nodeType === 1 && node.tagName.toLowerCase() === 'img') {
      return;
    }
    // if it's a product benefits wrapper, extract all of its children
    if (node.nodeType === 1 && node.classList.contains('cmp-banner__product-benefits')) {
      // Could be deeply nested, so flatten one more level
      Array.from(node.childNodes).forEach(child => {
        // Only push non-empty nodes
        if ((child.nodeType === 3 && child.textContent.trim()) || (child.nodeType === 1 && (child.textContent.trim() || child.querySelector('img,svg,a,button')))) {
          contentNodes.push(child);
        }
        // If it contains more nested children, add them as well
        if (child.nodeType === 1 && child.childNodes.length > 0) {
          Array.from(child.childNodes).forEach(grandChild => {
            if ((grandChild.nodeType === 3 && grandChild.textContent.trim()) || (grandChild.nodeType === 1 && (grandChild.textContent.trim() || grandChild.querySelector('img,svg,a,button')))) {
              contentNodes.push(grandChild);
            }
          });
        }
      });
    } else {
      // Only push if it has meaningful content
      if ((node.nodeType === 3 && node.textContent.trim()) || (node.nodeType === 1 && (node.textContent.trim() || node.querySelector('img,svg,a,button')))) {
        contentNodes.push(node);
      }
    }
  });
  // Remove duplicates and empty nodes (if any)
  contentNodes = contentNodes.filter((node, i, arr) => {
    if (!node) return false;
    if (node.nodeType === 3 && !node.textContent.trim()) return false;
    if (node.nodeType === 1 && !node.textContent.trim() && !node.querySelector('img,svg,a,button')) return false;
    // Remove if already in the array
    return arr.indexOf(node) === i;
  });

  let contentCell;
  if (contentNodes.length === 0) {
    // If nothing found, fallback to textContent
    contentCell = bannerContent.textContent.trim() ? bannerContent.textContent.trim() : '';
  } else if (contentNodes.length === 1) {
    contentCell = contentNodes[0];
  } else {
    contentCell = contentNodes;
  }

  // Compose the block table
  const cells = [
    ['Hero (hero32)'],
    [img ? img : ''],
    [contentCell]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
