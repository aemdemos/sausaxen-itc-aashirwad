/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first .slickcarousel within the element
  const carousel = element.querySelector('.slickcarousel');
  if (!carousel) return;

  // Find the first .cmp-carousel__item (active slide)
  const carouselItem = carousel.querySelector('.cmp-carousel__item');
  if (!carouselItem) return;

  // Find the banner inside the carousel item
  const banner = carouselItem.querySelector('.cmp-banner');
  if (!banner) return;

  // Find the content div inside the banner
  const bannerContent = banner.querySelector('.cmp-banner__content');
  if (!bannerContent) return;

  // Find the banner image (optional)
  const bannerImage = bannerContent.querySelector('img');

  // For the content row: gather ALL content except the image, including text from all levels
  // We'll gather all elements inside bannerContent except the first image
  const contentElements = [];
  Array.from(bannerContent.childNodes).forEach((node) => {
    if (node === bannerImage) return;
    if (node.nodeType === Node.ELEMENT_NODE) {
      // If it is an element and not the image, include it
      contentElements.push(node);
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      // For any meaningful text nodes, wrap in a <p>
      const p = document.createElement('p');
      p.textContent = node.textContent.trim();
      contentElements.push(p);
    }
  });

  // If contentElements are empty, try to find meaningful content deeper
  let fallbackContent = null;
  if (contentElements.length === 0) {
    // Sometimes the content is nested deeper, e.g. inside cmp-banner__product-benefits
    const benefit = bannerContent.querySelector('.cmp-banner__product-benefits');
    if (benefit) {
      // Use all children of product-benefits except for the main-content which may be empty
      const benefitChildren = Array.from(benefit.childNodes).filter(n => {
        if (n.nodeType === Node.ELEMENT_NODE) {
          // skip empty content
          return n.textContent.trim().length > 0;
        }
        return n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0;
      });
      if (benefitChildren.length) {
        fallbackContent = benefitChildren;
      }
    }
  }
  const finalContent = (contentElements.length > 0) ? contentElements : (fallbackContent || ['']);

  // Compose table rows
  const headerRow = ['Hero (hero32)'];
  const imageRow = [bannerImage ? bannerImage : ''];
  const contentRow = [finalContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
