/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards22)'];

  // Find the main image (prefer desktop, then mobile)
  const desktopImg = element.querySelector('img.campaign-image-desktop');
  const mobileImg = element.querySelector('img.campaign-image-mobile');
  const cardImg = desktopImg || mobileImg;

  // Find the video iframe and prepare a link (per instructions)
  const iframe = element.querySelector('iframe');
  let videoTitle = '';
  let videoLink = null;
  if (iframe) {
    videoTitle = iframe.title || '';
    videoLink = document.createElement('a');
    videoLink.href = iframe.src;
    videoLink.textContent = iframe.src;
  }

  // Try to get any visible text content from the HTML, but in this case there is none
  // If there were, we would extract it, but this HTML is all image/video
  // So card text will only be video title (as strong) and video link

  // Compose the text cell
  const textCell = [];
  if (videoTitle) {
    const strong = document.createElement('strong');
    strong.textContent = videoTitle;
    textCell.push(strong);
  }
  if (videoLink) {
    // Add a line break between title and link if both are present
    if (videoTitle) {
      textCell.push(document.createElement('br'));
    }
    textCell.push(videoLink);
  }

  // Only create the content row if there is at least an image or some text/link
  if (cardImg || textCell.length > 0) {
    const cells = [headerRow, [cardImg, textCell]];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
