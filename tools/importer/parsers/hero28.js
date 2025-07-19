/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct carousel slide items
  const slides = element.querySelectorAll('.cmp-carousel__item');
  if (!slides.length) return;

  // Use the first slide as Hero block
  const firstSlide = slides[0];
  if (!firstSlide) return;

  // Find the teaser within first slide
  const teaser = firstSlide.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Extract background image for desktop
  const bgImageUrl = teaser.getAttribute('data-background-image-desktop');
  let bgImgEl = null;
  if (bgImageUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImageUrl;
    bgImgEl.alt = '';
  }

  // For robustly gathering all text/cta content, get the teaser content container
  const teaserContent = teaser.querySelector('.cmp-teaser__content');
  // Put all child nodes (including text, headings, paragraphs, CTA)
  let contentCell = '';
  if (teaserContent) {
    // Instead of clone, reference children directly (per guidelines)
    const content = [];
    Array.from(teaserContent.children).forEach(child => {
      content.push(child);
    });
    contentCell = content;
  }

  // Build the table as per requirements
  const rows = [
    ['Hero (hero28)'],
    [bgImgEl ? bgImgEl : ''],
    [contentCell]
  ];

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
