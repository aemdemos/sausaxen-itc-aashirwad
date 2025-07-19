/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as specified in the example
  const headerRow = ['Carousel (carousel29)'];
  const rows = [];

  // Find the carousel container
  const carousel = element.querySelector('[data-cmp-is="carousel"]');
  if (!carousel) return;
  // Find the carousel track
  const track = carousel.querySelector('.slick-track');
  if (!track) return;
  // Get all slides
  const slides = track.querySelectorAll(':scope > .cmp-carousel__item');

  slides.forEach((slide) => {
    // IMAGE CELL: Find the cmp-image (wrapper)
    let imgCell = null;
    const cmpImage = slide.querySelector('.cmp-image');
    if (cmpImage) {
      // Prefer the first desktop image (or fallback to any image in cmp-image)
      let img = cmpImage.querySelector('img.cmp-image__image') || cmpImage.querySelector('img');
      if (img) imgCell = img;
    }
    if (!imgCell) return; // skip slide with no image

    // TEXT CELL: Try to extract any visible text content in the slide outside the cmp-image
    // In this structure, most likely there is no text, but we check for completeness
    // Collect all direct children of the slide (except cmp-image wrappers)
    const contentElems = Array.from(slide.children).filter(child => !child.classList.contains('image'));
    let textCell = '';
    if (contentElems.length === 1) {
      textCell = contentElems[0]; // use the element directly (not cloning)
    } else if (contentElems.length > 1) {
      // If multiple, group into a fragment
      const frag = document.createDocumentFragment();
      contentElems.forEach(node => frag.appendChild(node));
      textCell = frag;
    }
    // If no extra elements, try meaningful alt text
    if (!textCell || (typeof textCell === 'string' && !textCell.trim())) {
      const alt = imgCell.getAttribute('alt') || '';
      if (alt && alt.trim() && !/^banner(\s*\d*)?$/i.test(alt.trim())) {
        textCell = alt.trim();
      } else {
        textCell = '';
      }
    }
    rows.push([imgCell, textCell]);
  });

  if (rows.length === 0) return;
  const tableArray = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(block);
}
