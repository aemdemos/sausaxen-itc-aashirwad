/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the direct product detail block
  const productDetail = element.querySelector('.cmp-product-detail');
  if (!productDetail) return;

  // Column 1: Product image (use the image element directly)
  const imgContainer = productDetail.querySelector('.cmp-product-detail__left-container');
  let image = null;
  if (imgContainer) {
    image = imgContainer.querySelector('img');
  }

  // Column 2: Product info (title, description, pack sizes, buy now btn)
  const rightContainer = productDetail.querySelector('.cmp-product-detail__right-container');
  let infoFragment = null;
  if (rightContainer) {
    // We will fill infoFragment with the key textual/info nodes in order
    infoFragment = document.createElement('div');
    // Title (h1)
    const title = rightContainer.querySelector('.cmp-product-detail__title');
    if (title) infoFragment.appendChild(title);
    // Description paragraph(s)
    const descContainer = rightContainer.querySelector('.cmp-product-detail__description-container');
    if (descContainer) {
      // Description text and Read More link
      const desc = descContainer.querySelector('.cmp-product-detail__description');
      if (desc) {
        // The description may be a span containing <p> or text
        Array.from(desc.childNodes).forEach((node) => {
          infoFragment.appendChild(node);
        });
      }
      // Read More link
      const readMore = descContainer.querySelector('a.cmp-product-detail__read-more');
      if (readMore) infoFragment.appendChild(readMore);
    }
    // Pack Size heading
    const packTitle = rightContainer.querySelector('.cmp-product-detail__pack-title');
    if (packTitle) infoFragment.appendChild(packTitle);
    // Pack Sizes (tab/button values)
    const tabGroup = rightContainer.querySelector('.cmp-tab-group');
    if (tabGroup) {
      // Get all tab text spans and output as a space-separated string or as inline elements
      const allTabs = tabGroup.querySelectorAll('.cmp-tab__text');
      if (allTabs.length) {
        const tabsContainer = document.createElement('div');
        allTabs.forEach(tab => {
          // Output as spans with text, separating by a space
          const span = document.createElement('span');
          span.textContent = tab.textContent.trim();
          span.style.display = 'inline-block';
          span.style.marginRight = '8px';
          tabsContainer.appendChild(span);
        });
        infoFragment.appendChild(tabsContainer);
      }
    }
    // Buy Now button
    const buyNowBtn = rightContainer.querySelector('.cmp-product-detail__price-container');
    if (buyNowBtn) infoFragment.appendChild(buyNowBtn);
  }

  // Compose columns array, exactly two columns per row as per the visual structure
  const cells = [
    ['Columns (columns3)'],
    [image, infoFragment]
  ];

  // Create and replace with the Columns block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
