/* global WebImporter */
export default function parse(element, { document }) {
  // Header for the block as specified in the example
  const headerRow = ['Carousel (carousel41)'];

  // Find all slide elements in the carousel
  let slides = [];
  const container = element.querySelector('.cmp-carousel__container');
  if (container) {
    const slickTrack = container.querySelector('.slick-track');
    if (slickTrack) {
      slides = Array.from(slickTrack.querySelectorAll(':scope > .cmp-carousel__item'));
    }
  }
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  }

  // Helper: extract all non-image content from the slide (overlay text, headings, etc.)
  function extractTextContent(slide) {
    const content = [];
    // Remove image wrapper from consideration
    const imageDiv = slide.querySelector('.image');
    // Collect all children not the image div
    Array.from(slide.children).forEach(child => {
      if (!imageDiv || child !== imageDiv) {
        content.push(child);
      }
    });
    // If imageDiv contains elements that are not the image, add those
    if (imageDiv) {
      Array.from(imageDiv.children).forEach(child => {
        if (!child.matches('[data-cmp-is="image"], img')) {
          content.push(child);
        }
      });
    }
    // If still no content, try to collect text nodes not in image
    if (content.length === 0) {
      const textNodes = Array.from(slide.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      if (textNodes.length) {
        const p = document.createElement('p');
        p.textContent = textNodes.map(n => n.textContent.trim()).join(' ');
        content.push(p);
      }
    }
    // If no content, return an empty string
    return content.length ? content : '';
  }

  // For each slide: first cell is image, second is overlay text content (or empty)
  const rows = slides.map(slide => {
    const img = slide.querySelector('img');
    const textContent = extractTextContent(slide);
    return [img || '', textContent];
  });

  // Compose table rows: header, then one row per slide
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
