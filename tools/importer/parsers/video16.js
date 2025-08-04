/* global WebImporter */
export default function parse(element, { document }) {
  // The block name (header) exactly as specified
  const headerRow = ['Video'];

  // Gather all immediate child nodes to ensure text content is preserved
  const nodes = Array.from(element.childNodes);

  // Find all poster images (if any) among the immediate children
  const imgs = nodes.filter(node => node.nodeType === 1 && node.tagName === 'IMG');

  // Find any text nodes and non-img element nodes, to include all visible text/content
  const nonImgNodes = nodes.filter(node => {
    if (node.nodeType === 3) return node.textContent.trim() !== '';
    if (node.nodeType === 1 && node.tagName !== 'IMG') return true;
    return false;
  });

  // Attempt to extract YouTube video ID from any poster image URL
  let videoId = null;
  for (const img of imgs) {
    const match = img.src.match(/\/vi\/([^/]+)\//);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }

  // Create a YouTube video link element if ID was found
  let videoLink = null;
  if (videoId) {
    videoLink = document.createElement('a');
    videoLink.href = `https://www.youtube.com/watch?v=${videoId}`;
    videoLink.textContent = videoLink.href;
  }

  // Compose the block cell: include all text and elements in order,
  // followed by all poster images, and finally the video link if present
  const cellContent = [];
  // Add non-img nodes (text and other elements)
  for (const n of nonImgNodes) cellContent.push(n);
  // Add poster images (in original order)
  for (const img of imgs) cellContent.push(img);
  // Add video link (after a <br> if there is any other content)
  if (videoLink) {
    if (cellContent.length > 0) cellContent.push(document.createElement('br'));
    cellContent.push(videoLink);
  }

  // If we have no content, supply an empty string as the cell content
  const contentRow = [cellContent.length ? cellContent : ['']];

  // Build the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block
  element.replaceWith(table);
}
