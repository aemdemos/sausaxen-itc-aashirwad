/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList && el.classList.contains(className));
  }

  // Get the 3 main sections (columns):
  // 1. Logo/fssai area
  const topContent = getChildByClass(element, 'cmp-footer__top-content');
  let logoCol = null;
  let fssaiCol = null;
  if (topContent) {
    // logoCol is the div.logo (main logo)
    logoCol = topContent.querySelector('.cmp-footer__nav-logo');
    // fssai logo is inside logoCol as .cmp-footer__fssai_logo
    // We'll reference the full logoCol for column content 1
  }

  // 2. Subscribe area
  const subscribeCol = element.querySelector('.cmp-footer__nav-subscribe');

  // 3. Footer nav (has two nav lists)
  const navArea = element.querySelector('.cmp-footer__nav');
  let navLeft = null, navRight = null;
  if (navArea) {
    navLeft = navArea.querySelector('.cmp-footer__nav-items.cmp-navigation__group--left');
    navRight = navArea.querySelector('.cmp-footer__nav-items.cmp-navigation__group--right');
  }

  // Table header row matches example: 'Columns (columns11)' (single cell)
  const headerRow = ['Columns (columns11)'];
  // Content row: 3 columns
  const contentRow = [logoCol, subscribeCol, [navLeft, navRight].filter(Boolean)];

  // Build the table (header is single cell, content row is 3 columns)
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
