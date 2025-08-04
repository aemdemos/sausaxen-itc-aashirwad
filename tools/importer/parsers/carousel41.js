/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as per example
  const headerRow = ['Carousel (carousel41)'];

  // Find all slides
  const slides = element.querySelectorAll('.cmp-carousel__item');

  // Prepare data rows: [image, text] per slide
  const dataRows = Array.from(slides).map(slide => {
    // Get the image (first <img> inside this slide)
    const img = slide.querySelector('img');
    
    // Gather all content that is not part of the image container
    // Find all immediate children of the slide
    const immediateChildren = Array.from(slide.children);
    // Identify image container (contains the img)
    let imageContainer = null;
    for (const child of immediateChildren) {
      if (child.querySelector && child.querySelector('img')) {
        imageContainer = child;
        break;
      }
    }
    // For text: all children except the image container
    const textNodes = immediateChildren.filter(child => child !== imageContainer);
    
    // If there's any text content, aggregate it in a fragment
    let textCell = '';
    if (textNodes.length > 0) {
      // If only one content node, use it directly
      if (textNodes.length === 1) {
        textCell = textNodes[0];
      } else {
        // If multiple, group in a fragment
        const frag = document.createDocumentFragment();
        textNodes.forEach(node => frag.appendChild(node));
        textCell = frag;
      }
    }

    // If there is no text node, textCell will remain ''
    return [img, textCell];
  });

  // Compose table cells: header as single cell row, then 2-column slide rows
  const cells = [headerRow, ...dataRows];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Set header colspan if there are 2 columns
  if (dataRows.length && dataRows[0].length === 2) {
    const th = table.querySelector('th');
    th.setAttribute('colspan', '2');
  }

  // Replace the original element with the constructed table
  element.replaceWith(table);
}
