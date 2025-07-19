/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure the header exactly matches the example
  const headerRow = ['Embed (embedVideo25)'];

  // We'll collect all visible text content and iframe as a link
  const cellContent = [];

  // Collect all text (including from nested divs) except from the iframe
  // and preserve the order
  function gatherTextAndLinks(node, arr) {
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        const txt = child.textContent.trim();
        if (txt) {
          arr.push(document.createTextNode(txt + '\n'));
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.tagName === 'IFRAME') {
          // Only add a link for iframe src
          const src = child.getAttribute('src');
          if (src) {
            let videoUrl = src;
            const ytMatch = src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
            if (ytMatch) {
              videoUrl = `https://www.youtube.com/watch?v=${ytMatch[1]}`;
            }
            const link = document.createElement('a');
            link.href = videoUrl;
            link.textContent = videoUrl;
            arr.push(link);
          }
        } else {
          // Gather recursively for all other elements
          gatherTextAndLinks(child, arr);
        }
      }
    }
  }

  gatherTextAndLinks(element, cellContent);

  // Fallback: if nothing, use the data-youtube-video-url attribute if present
  if (!cellContent.length) {
    const videoUrl = element.getAttribute('data-youtube-video-url');
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.textContent = videoUrl;
      cellContent.push(link);
    }
  }

  // The example shows one table only, 1 column, 2 rows
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [cellContent]
  ], document);

  element.replaceWith(table);
}
