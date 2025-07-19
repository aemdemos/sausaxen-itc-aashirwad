/* global WebImporter */
export default function parse(element, { document }) {
  // Get carousel slide elements
  // Path: .cmp-carousel__container > .slick-list > .slick-track > .cmp-carousel__item
  const container = element.querySelector('.cmp-carousel__container');
  const slickList = container && container.querySelector('.slick-list');
  const slickTrack = slickList && slickList.querySelector('.slick-track');
  if (!slickTrack) return;
  const slides = Array.from(slickTrack.children).filter(
    (el) => el.classList.contains('cmp-carousel__item')
  );

  const rows = [['Carousel (carousel1)']];

  slides.forEach((slide) => {
    // Get the image element (first img in .cmp-banner__content)
    let imageEl = null;
    const img = slide.querySelector('.cmp-banner__image');
    if (img) {
      imageEl = img;
    } else {
      // Try to get background-image from .cmp-banner
      const banner = slide.querySelector('.cmp-banner');
      if (banner && banner.style.backgroundImage) {
        const urlMatch = banner.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
        if (urlMatch && urlMatch[1]) {
          const imgEl = document.createElement('img');
          imgEl.src = urlMatch[1];
          imageEl = imgEl;
        }
      }
    }

    // Get text content: all content except the image inside .cmp-banner__content
    const content = slide.querySelector('.cmp-banner__content');
    let textContent = null;
    if (content) {
      // Create array of nodes (excluding image)
      const nodes = Array.from(content.childNodes).filter((node) => {
        return !(node.nodeType === 1 && node.tagName.toLowerCase() === 'img');
      });
      // If nodes are not empty, use as cell content
      if (nodes.length > 0) {
        textContent = nodes;
      }
    }
    rows.push([imageEl, textContent]);
  });

  // Create table via WebImporter helper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
