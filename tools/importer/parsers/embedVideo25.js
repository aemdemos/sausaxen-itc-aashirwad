/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row per spec
  const headerRow = ['Embed (embedVideo25)'];

  // Find the main iframe (YouTube or Vimeo)
  const iframe = element.querySelector('iframe');
  let videoUrl = '';
  // Prefer data-youtube-video-url if present
  if (element.getAttribute('data-youtube-video-url')) {
    videoUrl = element.getAttribute('data-youtube-video-url');
  // Otherwise, convert known YouTube embed src to watch URL
  } else if (iframe && iframe.src) {
    const ytMatch = iframe.src.match(/youtube.com\/embed\/([\w-]+)/);
    if (ytMatch) {
      videoUrl = `https://www.youtube.com/watch?v=${ytMatch[1]}`;
    } else {
      videoUrl = iframe.src;
    }
  }

  // Gather all text nodes and non-iframe elements inside the main element for the cell
  // (There may be captions, descriptions, etc. in future variants, and we must preserve them.)
  let cellNodes = [];
  // 1. All direct children (to preserve structure)
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      // For element nodes, skip if it's an iframe or inside a YouTube wrapper (handled by link)
      if (!node.querySelector('iframe')) {
        cellNodes.push(node);
      }
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      cellNodes.push(node);
    }
  });

  // 2. Always include a link to the video after any content
  if (videoUrl) {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.textContent = videoUrl;
    if (cellNodes.length > 0) cellNodes.push(document.createElement('br'));
    cellNodes.push(a);
  }

  // If the cellNodes only contains whitespace or nothing, still ensure link is present
  if (cellNodes.length === 0 && videoUrl) {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.textContent = videoUrl;
    cellNodes = [a];
  }

  // Compose table as per block instructions
  const cells = [headerRow, [cellNodes]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
