/* global WebImporter */
export default function parse(element, { document }) {
  // Header
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  // Images (desktop/mobile)
  const imgs = [];
  const desktopImg = element.querySelector('img.campaign-image-desktop');
  const mobileImg = element.querySelector('img.campaign-image-mobile');
  if (desktopImg) imgs.push(desktopImg);
  if (mobileImg) imgs.push(mobileImg);

  // Compose text cell: video title, link, and ALL visible descriptive text within .cmp-video
  const textParts = [];
  const cmpVideo = element.querySelector('.cmp-video');
  if (cmpVideo) {
    // Video title (from iframe)
    const iframe = cmpVideo.querySelector('iframe');
    if (iframe && iframe.title) {
      const strong = document.createElement('strong');
      strong.textContent = iframe.title;
      textParts.push(strong);
      textParts.push(document.createElement('br'));
    }
    // Video link as required by rules (for iframe src)
    if (iframe && iframe.src) {
      const videoLink = document.createElement('a');
      videoLink.href = iframe.src;
      videoLink.textContent = iframe.src;
      videoLink.target = '_blank';
      videoLink.rel = 'noopener noreferrer';
      textParts.push(videoLink);
      textParts.push(document.createElement('br'));
    }
    // Extract all additional visible text in .cmp-video except what's in <iframe>
    // We'll walk all descendants, skip iframe/script/style, and ignore empty text
    function extractAdditionalText(node) {
      let result = '';
      for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          const txt = child.textContent.trim();
          if (txt) result += txt + ' ';
        } else if (
          child.nodeType === Node.ELEMENT_NODE &&
          !['SCRIPT','STYLE','IFRAME'].includes(child.nodeName)
        ) {
          result += extractAdditionalText(child);
        }
      }
      return result;
    }
    // Get all visible text except from iframes
    const extraText = extractAdditionalText(cmpVideo).trim();
    // Only add text that isn't just the iframe title
    if (extraText && (!iframe || extraText !== iframe.title)) {
      const para = document.createElement('p');
      para.textContent = extraText;
      textParts.push(para);
    }
  }

  // Add card row if any content
  if (imgs.length > 0 || textParts.length > 0) {
    rows.push([
      imgs.length > 1 ? imgs : (imgs[0] || ''),
      textParts.length > 1 ? textParts : (textParts[0] || '')
    ]);
  }

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
