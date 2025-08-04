/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get the first .cmp-teaser in the descendants
  const teaser = element.querySelector('.cmp-teaser');

  // Extract background image (prefer desktop, fallback to mobile)
  let bgImgUrl = null;
  if (teaser) {
    bgImgUrl =
      teaser.getAttribute('data-background-image-desktop') ||
      teaser.getAttribute('data-background-image-mobile') || '';
  }
  let bgImgEl = null;
  if (bgImgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgImgUrl;
    bgImgEl.setAttribute('loading', 'lazy');
  }

  // Extract headline and subheadline if present (in this sample, they're part of the image)
  // There is no visible headline/subheadline in HTML, so we skip

  // Extract CTA: Find the CTA link and use its button text as CTA text
  let ctaAnchor = null;
  if (teaser) {
    const teaserLink = teaser.querySelector('a.cmp-teaser__link');
    if (teaserLink) {
      // Find button text inside the teaser link
      const btnText = teaserLink.querySelector('.cmp-button__text');
      if (btnText && btnText.textContent.trim()) {
        ctaAnchor = document.createElement('a');
        ctaAnchor.href = teaserLink.href;
        ctaAnchor.textContent = btnText.textContent.trim();
        // Copy over any target/rel for accessibility
        if (teaserLink.target) ctaAnchor.target = teaserLink.target;
        if (teaserLink.rel) ctaAnchor.rel = teaserLink.rel;
      }
    }
  }

  // Assemble the rows for the block table
  const rows = [];
  // Header row: must match exactly as in the example
  rows.push(['Hero (hero36)']);
  // Background image row
  rows.push([bgImgEl ? bgImgEl : '']);
  // Content row: only CTA (since other content is in image)
  rows.push([ctaAnchor ? [ctaAnchor] : '']);

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
