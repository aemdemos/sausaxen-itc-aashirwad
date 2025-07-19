/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row as in the example: exactly one cell, correct label
  const headerRow = ['Columns (columns18)'];

  // 2. Identify the two columns: video with surrounding text, and thumbnail with surrounding text
  // These are the main children
  const columnDivs = Array.from(element.querySelectorAll(':scope > div'));
  // Fallback in case nested structure is different
  let col1 = columnDivs[0] || element;
  let col2 = columnDivs[1] || null;

  // For extra robustness, if .cmp-tv-commercials__video-wrapper is nested, use that as col1
  const possibleCol1 = element.querySelector('.cmp-tv-commercials__video-wrapper');
  if (possibleCol1) col1 = possibleCol1;
  // For col2, prefer .cmp-tv-commercials__thumbnail-section
  const possibleCol2 = element.querySelector('.cmp-tv-commercials__thumbnail-section');
  if (possibleCol2) col2 = possibleCol2;

  // 3. Put the reference (not clones) of these blocks in the right table cells
  // If any column is missing, substitute an empty string so table structure is preserved
  const cells = [
    headerRow,
    [col1 || '', col2 || '']
  ];

  // 4. Build the table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
