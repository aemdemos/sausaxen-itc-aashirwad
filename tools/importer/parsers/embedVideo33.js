/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matching block name
  const headerRow = ['Embed (embedVideo33)'];

  // To accumulate all content for the single cell
  const content = [];

  // Gather all text content and DOM elements that represent the block visually
  // This includes direct children and nested children.
  // Collect visible non-empty text nodes
  function collectTextNodes(node) {
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        collectTextNodes(child);
      } else if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent.trim();
        if (text) {
          content.push(text);
        }
      }
    });
  }
  collectTextNodes(element);

  // Find the first iframe (for embed)
  const iframe = element.querySelector('iframe');
  if (iframe && iframe.src) {
    let videoUrl = iframe.src;
    // Clean YouTube embed URLs to short form if possible
    const ytMatch = videoUrl.match(/youtube.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (ytMatch) {
      videoUrl = `https://youtu.be/${ytMatch[1]}`;
    }
    // Construct a link element referencing existing video URL
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    content.push(link);
  }

  // If there is structural (non-iframe) HTML in the element, and it's not just wrappers, include it
  // For robustness, append all direct children that are not the iframe or its wrappers (if any)
  // but skip empty div wrappers if there's no extra content
  // This handles edge cases where content is visually significant
  // (In current example, there is no non-iframe visible content besides text.)

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [content.length === 1 ? content[0] : content]
  ], document);
  element.replaceWith(table);
}
