/* global WebImporter */
export default function parse(element, { document }) {
  // Collect card rows
  const dataRows = [];
  const carousel = element.querySelector('.cmp-tab-group__carousel-item');
  if (!carousel) return;
  const tabItems = carousel.querySelectorAll(':scope > .cmp-tab-group__tab-item');
  tabItems.forEach((tabItem) => {
    const tabText = tabItem.querySelector('.cmp-tab__text');
    if (!tabText) return;
    const heading = document.createElement('strong');
    heading.textContent = tabText.textContent.trim();
    dataRows.push(['', heading]);
  });
  // Build table rows array: header is a single th with colspan=2
  // Since WebImporter.DOMUtils.createTable() doesn't support colspan in its API, patch after creation
  const cells = [ ['Cards (cards34)'], ...dataRows ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Set colspan=2 on the header cell (first row, first th)
  const th = table.querySelector('tr:first-child th');
  if (th) th.setAttribute('colspan', '2');
  element.replaceWith(table);
}
