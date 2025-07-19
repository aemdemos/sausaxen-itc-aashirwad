/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards38) block header row
  const headerRow = ['Cards (cards38)'];

  // Find all cards
  const items = element.querySelectorAll('.cmp-categorylist__item');

  const rows = Array.from(items).map(item => {
    // First cell: image (reference existing <img> element, or null if not found)
    const img = item.querySelector('img');

    // Second cell: assemble content
    const textContent = [];

    // Title (as <strong>) from name
    const name = item.querySelector('.cmp-categorylist__name');
    if (name && name.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = name.textContent.trim();
      textContent.push(strong);
    }

    // If there is a button (e.g. Buy Now), add a <br> and include its text
    const btn = item.querySelector('.cmp-button__text');
    if (btn && btn.textContent.trim()) {
      if (textContent.length) textContent.push(document.createElement('br'));
      // Reference the button text directly
      textContent.push(btn);
    }

    // If there is an anchor (product link), add a <br> and include link (with its text)
    // Only add if it's not the CTA image link, i.e. not just an image wrapper
    const productLinks = Array.from(item.querySelectorAll('a[href]'));
    let foundProductLink = false;
    for (const link of productLinks) {
      // Skip image wrappers (contains image)
      if (link.querySelector('img')) continue;
      if (textContent.length) textContent.push(document.createElement('br'));
      textContent.push(link);
      foundProductLink = true;
      break;
    }
    // If no extra product link (other than image link), add the image anchor as CTA (using title)
    if (!foundProductLink) {
      const imgAnchor = item.querySelector('a[href]');
      if (imgAnchor && imgAnchor.title && imgAnchor.href) {
        if (textContent.length) textContent.push(document.createElement('br'));
        // Create a new <a> but reference the existing anchor for content
        const cta = document.createElement('a');
        cta.href = imgAnchor.href;
        cta.textContent = imgAnchor.title;
        textContent.push(cta);
      }
    }

    // Ensure fallback: if cell is empty, provide all text from the item
    if (!textContent.length) {
      textContent.push(item.textContent.trim());
    }

    return [img, textContent];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
