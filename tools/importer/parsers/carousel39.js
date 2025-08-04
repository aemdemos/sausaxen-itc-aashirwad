/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main carousel container
  const carouselRoot = element.querySelector('.cmp-carousel');
  if (!carouselRoot) return;
  
  // Find the actual carousel slide container
  const slidesContainer = carouselRoot.querySelector('.cmp-carousel__container');
  if (!slidesContainer) return;

  // Find all slides
  const items = slidesContainer.querySelectorAll('.cmp-recipe-group__carousel-item, .cmp-carousel__item');

  // Init table with header row matching the example
  const cells = [['Carousel (carousel39)']];

  items.forEach((item) => {
    // Get the image (first img in card)
    const img = item.querySelector('img');
    // Only include if present
    const imageCell = img || '';

    // Build text cell: gather all text nodes in the card info area
    // 1. Try .cmp-card__info (contains all text content)
    let info = item.querySelector('.cmp-card__info');
    let textParts = [];
    if (info) {
      // Find the title (as h2)
      const titleH4 = info.querySelector('.cmp-card__title h4');
      if (titleH4 && titleH4.textContent.trim()) {
        const h2 = document.createElement('h2');
        h2.textContent = titleH4.textContent.trim();
        textParts.push(h2);
      }
      // Find the tag (if any)
      const tag = info.querySelector('.cmp-card__tag-wrapper p');
      if (tag && tag.textContent.trim()) {
        const tagP = document.createElement('p');
        tagP.textContent = tag.textContent.trim();
        textParts.push(tagP);
      }
      // Find the time (if any)
      const time = info.querySelector('.cmp-card__time-in-minutes p');
      if (time && time.textContent.trim()) {
        const timeP = document.createElement('p');
        timeP.textContent = time.textContent.trim();
        textParts.push(timeP);
      }
      // Find the difficulty (if any)
      const diff = info.querySelector('.cmp-card__difficulty-level p');
      if (diff && diff.textContent.trim()) {
        const diffP = document.createElement('p');
        diffP.textContent = diff.textContent.trim();
        textParts.push(diffP);
      }
    }
    // Add View Recipe CTA if link present
    const outerLink = item.querySelector('a');
    if (outerLink && outerLink.href) {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = outerLink.href;
      link.textContent = 'View Recipe';
      p.appendChild(link);
      textParts.push(p);
    }
    // If there's no info, try to extract all text content from card
    if ((!info || !info.textContent.trim()) && item.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = item.textContent.trim();
      textParts.push(p);
    }
    // Compose row: always two columns (image, text)
    cells.push([
      imageCell,
      textParts.length > 0 ? textParts : ''
    ]);
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
