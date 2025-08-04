/* global WebImporter */
export default function parse(element, { document }) {
  // Get the carousel track which contains the slides
  const track = element.querySelector('.cmp-carousel__container .slick-list .slick-track');
  if (!track) return;
  const slides = Array.from(track.querySelectorAll(':scope > .cmp-carousel__item'));
  if (!slides.length) return;

  // Build rows
  const rows = [];
  rows.push(['Carousel (carousel1)']); // Header row matches exactly

  slides.forEach((slide) => {
    // First cell: the slide image (direct reference)
    const img = slide.querySelector('img');
    // Second cell: text content (may have one or more elements)
    const content = slide.querySelector('.cmp-banner__content') || slide;
    const cellContent = [];
    // Heading (h2)
    const h2 = content.querySelector('h2');
    if (h2) cellContent.push(h2);
    // Sub-title (h3)
    const h3 = content.querySelector('h3');
    if (h3) {
      // Use a <p> for the sub-title, to match block semantics
      const p = document.createElement('p');
      p.innerHTML = h3.innerHTML;
      cellContent.push(p);
    }
    // CTA link (if any)
    const cta = content.querySelector('a.cmp-button');
    if (cta) cellContent.push(cta);
    rows.push([
      img || '',
      cellContent.length ? cellContent : ''
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
