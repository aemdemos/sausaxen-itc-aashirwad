/* global WebImporter */
export default function parse(element, { document }) {
  // Find carousel container and slides
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;
  const container = carousel.querySelector('.cmp-carousel__container');
  if (!container) return;
  const slickTrack = container.querySelector('.slick-track');
  if (!slickTrack) return;
  const slideItems = Array.from(slickTrack.querySelectorAll('.cmp-recipe-group__carousel-item'));

  const headerRow = ['Carousel (carousel39)'];
  const rows = [headerRow];

  slideItems.forEach(item => {
    // First cell: image (mandatory)
    const img = item.querySelector('img');
    const imageCell = img || '';

    // Second cell: aggregate all relevant text content
    const textContent = [];
    const a = item.querySelector('a');
    if (a) {
      // Title (as a heading)
      const titleEl = a.querySelector('.cmp-card__title h4');
      if (titleEl && titleEl.textContent.trim()) {
        const heading = document.createElement('h3');
        heading.textContent = titleEl.textContent.trim();
        textContent.push(heading);
      }
      // Tag (e.g., Breakfast and Savoury)
      const tagEl = a.querySelector('.cmp-card__tag-wrapper p');
      if (tagEl && tagEl.textContent.trim()) {
        const tagP = document.createElement('p');
        tagP.textContent = tagEl.textContent.trim();
        textContent.push(tagP);
      }
      // Any additional description in .cmp-card__info
      const info = a.querySelector('.cmp-card__info');
      if (info) {
        Array.from(info.querySelectorAll('p'))
          .filter(p => {
            // Exclude tag (already handled)
            if (tagEl && p === tagEl) return false;
            // Exclude time/difficulty
            return !p.closest('.cmp-card__time-in-minutes') && !p.closest('.cmp-card__difficulty-level');
          })
          .forEach(p => {
            if (p.textContent.trim()) {
              textContent.push(p);
            }
          });
      }
      // Time
      const timeP = a.querySelector('.cmp-card__time-in-minutes p');
      if (timeP && timeP.textContent.trim()) {
        textContent.push(timeP);
      }
      // Difficulty
      const diffP = a.querySelector('.cmp-card__difficulty-level p');
      if (diffP && diffP.textContent.trim()) {
        textContent.push(diffP);
      }
      // CTA (link to detail page)
      if (a.href && a.href.trim()) {
        const ctaPara = document.createElement('p');
        const ctaLink = document.createElement('a');
        ctaLink.href = a.href;
        ctaLink.textContent = 'View Recipe';
        ctaPara.appendChild(ctaLink);
        textContent.push(ctaPara);
      }
    }
    rows.push([imageCell, textContent.length > 0 ? textContent : '']);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
