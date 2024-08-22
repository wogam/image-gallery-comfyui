import { app } from "/scripts/app.js";
import { $el, ComfyDialog } from "/scripts/ui.js";

const styles = `
.comfy-carousel {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.8);
  z-index: 9999;
}

.comfy-carousel {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.comfy-carousel.show {
  display: flex;
  opacity: 1;
  transform: scale(1);
}

.comfy-carousel.hide {
  opacity: 0;
}

.comfy-carousel-box {
  margin: 0 auto;
  text-align: center;
  position: relative;
  width: 90vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 5px;
}

.comfy-carousel-box .slides {
  flex-grow: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}

.comfy-carousel-box .slides img {
  display: none;
  max-height: 80vh;
  max-width: 100%;
  object-fit: contain;
}

.comfy-carousel-box .slides img.shown {
  display: block;
}

.comfy-carousel-box .button-container {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 7px;
  height: fit-content; /* Update this property */
}

.comfy-carousel-box .remove,
.comfy-carousel-box .close,
.comfy-carousel-box .gallery,
.comfy-carousel-box .reset-zoom,
.comfy-carousel-box .load {
  background: transparent;
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s, backdrop-filter 0.3s;
  border-radius: 8px;
}

.comfy-carousel-box .prev,
.comfy-carousel-box .next {
  position: absolute;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s;
}

.comfy-carousel-box .remove:hover,
.comfy-carousel-box .close:hover,
.comfy-carousel-box .gallery:hover,
.comfy-carousel-box .reset-zoom:hover,
.comfy-carousel-box .load:hover {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.comfy-carousel-box .prev:hover,
.comfy-carousel-box .next:hover {
  background: rgba(0,0,0,0.8);
}

.comfy-carousel-box .remove:hover { background-color: rgba(255, 105, 97, 0.3); }
.comfy-carousel-box .gallery:hover { background-color: rgba(167, 199, 231, 0.3); }
.comfy-carousel-box .reset-zoom:hover { background-color: rgba(250, 200, 152, 0.3); }
.comfy-carousel-box .load:hover { background-color: rgba(193, 225, 193, 0.3); }

.comfy-carousel-box .dots {
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(0,0,0,0.5);
  overflow-x: auto;
  white-space: nowrap;
}

.comfy-carousel-box .reset-zoom { top: 20px; right: 220px; }
.comfy-carousel-box .load { top: 20px; right: 170px; }
.comfy-carousel-box .remove { top: 20px; right: 120px; }
.comfy-carousel-box .gallery { top: 20px; right: 70px; }
.comfy-carousel-box .close { top: 20px; right: 20px; }
.comfy-carousel-box .prev { left: 20px; top: 50%; transform: translateY(-50%); }
.comfy-carousel-box .next { right: 20px; top: 50%; transform: translateY(-50%); }

.comfy-carousel-box .dots::-webkit-scrollbar {
  height: 8px;
}

.comfy-carousel-box .dots::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.comfy-carousel-box .dots::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.comfy-carousel-box .dots img {
  height: 48px;
  width: 48px;
  object-fit: cover;
  opacity: 0.6;
  transition: opacity 0.3s;
  cursor: pointer;
}

.comfy-carousel-box .dots img:hover {
  opacity: 0.8;
}

.comfy-carousel-box .dots img.active {
  opacity: 1;
  border: 2px solid #fff;
}

.comfy-carousel .gallery-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--image-size, 150px), 1fr));
  gap: 10px;
  padding: 20px;
  max-height: 90vh;
  width: 90vw;
  overflow-y: auto;
  background: rgba(0,0,0,0.8);
}

.gallery-container {
  transition: opacity 0.5s ease, transform 0.5s ease;
  opacity: 0;
}

.gallery-container.show {
  opacity: 1;
}


.comfy-carousel .gallery-container img {
  width: var(--image-size, 150px);
  height: var(--image-size, 150px);
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.comfy-carousel .gallery-container img:hover {
  transform: scale(1.05);
}

.comfy-carousel .close-gallery {
  position: absolute;
  top: 25px;
  right: 25px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s;
}

.comfy-carousel .close-gallery:hover {
  background: rgba(255, 255, 255, 0.1); /* Match hover effect */
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.gallery-size-slider {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 40px;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 0 15px;
  appearance: none;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  z-index: 10000;
}

.gallery-size-slider:hover {
  opacity: 1;
}

.gallery-size-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.gallery-size-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 4px;
  height: 20px;
  background: #ffffff;
  cursor: pointer;
  border-radius: 2px;
  margin-top: -8px; /* to center the thumb on the track */
}

.gallery-size-slider::-moz-range-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.gallery-size-slider::-moz-range-thumb {
  width: 4px;
  height: 20px;
  background: #ffffff;
  cursor: pointer;
  border-radius: 2px;
  border: none;
}

.comfy-carousel .gallery-container img.selected {
  box-shadow: 0 0 0 2px #add8e6;
}

.comfy-carousel .button-container {
  position: fixed;
  bottom: 7px;
  right: 20px;
  display: flex;
  gap: 10px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 5px;
}

.comfy-carousel .scroll-to-top,
.comfy-carousel .select-images {
  background: transparent;
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s, backdrop-filter 0.3s;
  border-radius: 8px;
}

.comfy-carousel .scroll-to-top:hover,
.comfy-carousel .select-images:hover {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.comfy-carousel .gallery-container img.greyed-out {
  filter: grayscale(60%) brightness(60%);
}

.comfy-carousel .gallery-container img {
  user-select: none;
  -webkit-user-drag: none;
}

.comfy-carousel .breadcrumb-navigation {
  position: absolute;
  top: 25px;
  left: 100px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s;
}

.comfy-carousel .breadcrumb-navigation:hover {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.comfy-carousel .breadcrumb-navigation span {
  margin: 0 5px;
}

.comfy-carousel .breadcrumb-navigation span.separator {
  margin: 0;
}

.comfy-carousel .breadcrumb-navigation button {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 5px 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s;
  margin-right: 5px;
  font-family: 'Roboto', sans-serif;
}

.comfy-carousel .breadcrumb-navigation button:hover {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.folder-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: var(--image-size, 150px);
  height: var(--image-size, 150px);
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
  font-family: 'Roboto', sans-serif;
}

.folder-button svg {
  width: 50%; /* Set width to 50% of the button */
  height: 50%; /* Set height to 50% of the button */
}

.folder-button:hover {
  background: rgba(255, 255, 255, 0.1); /* Match hover effect */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.folder-text {
  margin-top: 8px;
  font-size: 14px;
  text-align: center;
  font-family: 'Roboto', sans-serif;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

function parseExifData(exifData) {
  const isLittleEndian = new Uint16Array(exifData.slice(0, 2))[0] === 0x4949;

  function readInt(offset, isLittleEndian, length) {
    let arr = exifData.slice(offset, offset + length)
    if (length === 2) {
      return new DataView(arr.buffer, arr.byteOffset, arr.byteLength).getUint16(0, isLittleEndian);
    } else if (length === 4) {
      return new DataView(arr.buffer, arr.byteOffset, arr.byteLength).getUint32(0, isLittleEndian);
    }
  }

  const ifdOffset = readInt(4, isLittleEndian, 4);

  function parseIFD(offset) {
    const numEntries = readInt(offset, isLittleEndian, 2);
    const result = {};

    for (let i = 0; i < numEntries; i++) {
      const entryOffset = offset + 2 + i * 12;
      const tag = readInt(entryOffset, isLittleEndian, 2);
      const type = readInt(entryOffset + 2, isLittleEndian, 2);
      const numValues = readInt(entryOffset + 4, isLittleEndian, 4);
      const valueOffset = readInt(entryOffset + 8, isLittleEndian, 4);

      let value;
      if (type === 2) {
        // ASCII string
        value = String.fromCharCode(...exifData.slice(valueOffset, valueOffset + numValues - 1));
      }

      result[tag] = value;
    }

    return result;
  }

  const ifdData = parseIFD(ifdOffset);
  return ifdData;
}

function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = event => {
      resolve(new DataView(event.target.result));
    };
    reader.readAsArrayBuffer(file);
  });
}

function extractMetadataFromExif(array) {
  const data = parseExifData(array);

  // Look for the UserComment EXIF tag
  let userComment = data[0x9286];
  if (userComment) {
    try {
      return JSON.parse(userComment);
    } catch (e) {
      // Ignore non-JSON contents
    }
  }

  return null;
}

async function getWebpMetadata(file) {
  const dataView = await readFile(file);

  // Check WEBP signature
  if (dataView.getUint32(0) !== 0x52494646 || dataView.getUint32(8) !== 0x57454250)
    return null;

  // Go through the chunks
  let offset = 12;
  while (offset < dataView.byteLength) {
    const chunkType = dataView.getUint32(offset);
    const chunkLength = dataView.getUint32(offset + 4, true);
    if (chunkType == 0x45584946)  // EXIF
    {
      const data = extractMetadataFromExif(new Uint8Array(dataView.buffer, offset + 8, chunkLength));
      if (data)
        return data;
    }
    offset += 8 + chunkLength;
  }

  return null;
}

async function getJpegMetadata(file) {
  const dataView = await readFile(file);

  // Check that the JPEG SOI segment is present
  if (dataView.getUint16(0) !== 0xFFD8)
    return null;

  // Go through other segments
  let offset = 2;
  while (offset < dataView.byteLength) {
    const segmentType = dataView.getUint16(offset);
    if (segmentType == 0xFFD9 || (segmentType & 0xFF00) != 0xFF00) {
      // EOI segment or invalid segment type
      break;
    }

    const segmentLength = dataView.getUint16(offset + 2);
    if (segmentLength < 2) {
      // Invalid segment length
      break;
    }

    if (segmentType == 0xFFE1 && segmentLength > 8) {
      // APP1 segment contains EXIF data
      // Skip next six bytes ("Exif\0\0"), not part of EXIF data
      const data = extractMetadataFromExif(new Uint8Array(dataView.buffer, offset + 10, segmentLength - 8));
      if (data)
        return data;
    }
    offset += 2 + segmentLength;
  }

  return null;
}

function getMetadata(file) {
  if (file.type === "image/webp")
    return getWebpMetadata(file);
  else if (file.type == "image/jpeg")
    return getJpegMetadata(file);
  else
    return null;
}

async function handleFile(origHandleFile, file, ...args) {
  const metadata = await getMetadata(file);
  if (metadata && metadata.workflow)
    app.loadGraphData(metadata.workflow);
  else if (metadata && metadata.prompt)
    app.loadApiJson(metadata.prompt);
  else
    return origHandleFile.call(this, file, ...args);
}

function createGallerySVG(width = "1em", height = "1em", fontSize = "20px") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.style.fontSize = fontSize;

  const paths = [
    "M17.5,21.25H6.5A3.75,3.75,0,0,1,2.75,17.5V6.5A3.75,3.75,0,0,1,6.5,2.75h11A3.75,3.75,0,0,1,21.25,6.5v11A3.75,3.75,0,0,1,17.5,21.25Zm-11-17A2.25,2.25,0,0,0,4.25,6.5v11A2.25,2.25,0,0,0,6.5,19.75h11a2.25,2.25,0,0,0,2.25-2.25V6.5A2.25,2.25,0,0,0,17.5,4.25Z",
    "M3.5,17.06a.76.76,0,0,1-.58-.27.75.75,0,0,1,.1-1l4.7-3.9a3.75,3.75,0,0,1,5.27.48l1.12,1.34a2.25,2.25,0,0,0,3.21.25L20,11.56a.75.75,0,0,1,1,1.13L18.31,15A3.74,3.74,0,0,1,13,14.62l-1.12-1.34A2.25,2.25,0,0,0,8.68,13L4,16.89A.72.72,0,0,1,3.5,17.06Z"
  ];

  paths.forEach(d => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "currentColor");
    svg.appendChild(path);
  });

  return svg;
}

class ComfyCarousel extends ComfyDialog {
  constructor(isGalleryCarousel = false) {
    super();
    this.isGalleryCarousel = isGalleryCarousel;
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.lastViewedIndex = 0;
    this.onKeydown = this.onKeydown.bind(this);
    this.element.classList.replace("comfy-modal", "comfy-carousel");
    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });
  }

  createButtons() {
    return [];
  }

  getActive() {
    return this.element.querySelector('.slides > .shown');
  }

  updateZoom() {
    const activeImage = this.getActive();
    if (activeImage) {
      const rect = activeImage.getBoundingClientRect();
      const containerRect = activeImage.parentElement.getBoundingClientRect();

      const maxX = Math.max(0, (rect.width * this.scale - containerRect.width) / 2);
      const maxY = Math.max(0, (rect.height * this.scale - containerRect.height) / 2);

      this.translateX = Math.max(-maxX, Math.min(maxX, this.translateX));
      this.translateY = Math.max(-maxY, Math.min(maxY, this.translateY));

      activeImage.style.transform = `scale(${this.scale}) translate(${this.translateX / this.scale}px, ${this.translateY / this.scale}px)`;
    }
  }

  resetZoom() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.updateZoom();
  }

  scrollToImage(index) {
    this.element.querySelectorAll('.dots img')[index]?.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
  }

  scrollToLastViewedImage(galleryContainer) {
    if (this.lastViewedIndex > 0) {
      const images = galleryContainer.querySelectorAll('img');
      if (images[this.lastViewedIndex]) {
        setTimeout(() => images[this.lastViewedIndex].scrollIntoView({ behavior: 'auto', block: 'center' }), 0);
      }
    }
  }

  selectImage(slide) {
    let active = this.getActive();
    if (active) {
      active.classList.remove('shown');
      active._dot.classList.remove('active');
    }
    slide.classList.add('shown');
    slide._dot.classList.add('active');

    const allDots = Array.from(this.element.querySelectorAll('.dots img'));
    const activeIndex = allDots.indexOf(slide._dot);

    const startIndex = Math.max(0, activeIndex - 10);
    const endIndex = Math.min(allDots.length - 1, activeIndex + 10);

    allDots.forEach((dot, i) => dot.style.display = i >= startIndex && i <= endIndex ? 'inline-block' : 'none');

    slide._dot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  async loadImage() {
    const activeImage = this.getActive();
    if (activeImage) {
      try {
        const response = await fetch(activeImage.src);
        const blob = await response.blob();
        const fileType = blob.type.split('/')[1] === 'jpeg' ? 'jpg' : blob.type.split('/')[1];
        const file = new File([blob], `image.${fileType}`, { type: blob.type });

        const metadata = await getMetadata(file);
        if (metadata?.workflow) {
          app.loadGraphData(metadata.workflow);
        } else if (metadata?.prompt) {
          app.loadApiJson(metadata.prompt);
        }

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        document.dispatchEvent(new DragEvent("drop", { dataTransfer }));
      } catch (error) {
        console.error("Error loading image:", error);
      }
    }
  }

  setupCarousel(slides, activeIndex) {
    const carousel = $el("div.comfy-carousel-box", {}, [
      $el("div.slides", {}, slides),
      $el("div.dots", {}, slides.map((slide, index) => {
        const dot = slide.cloneNode(true);
        dot.addEventListener('click', () => {
          this.selectImage(slide);
          this.lastViewedIndex = index;
        });
        slide._dot = dot;
        return dot;
      })),
      $el("div.button-container", {}, [
        $el("button.reset-zoom", {
          innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-3.2 -3.2 38.40 38.40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18,28A12,12,0,1,0,6,16v6.2L2.4,18.6,1,20l6,6,6-6-1.4-1.4L8,22.2V16H8A10,10,0,1,1,18,26Z"/></svg>`,
          onclick: () => this.resetZoom()
        }),
        $el("button.load", {
          innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
          onclick: () => {
            this.loadImage()
            this.close()
          }
        }),
        $el("button.gallery", {
          innerHTML: '',
          onclick: async (e) => {
            if (this.isGalleryCarousel) {
              if (!this.element.querySelector('.gallery-container')) {
                const galleryContainer = await this.loadGalleryImages(e);
                this.scrollToLastViewedImage(galleryContainer);
              }
            } else {
              app.ui.nodeCarousel.close();
              if (!app.ui.galleryCarousel.element.querySelector('.gallery-container')) {
                const galleryContainer = await app.ui.galleryCarousel.loadGalleryImages(e);
                app.ui.galleryCarousel.scrollToLastViewedImage(galleryContainer);
              }
            }
          }
        }),
        $el("button.remove", {
          innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-0.24 -0.24 24.48 24.48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12L14 16M14 12L10 16M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6"/></svg>`,
          onclick: e => this.removeImage(e)
        }),
        $el("button.close", { textContent: "✖", onclick: () => this.close() }),
      ]),
      $el("button.prev", { textContent: "❮", onclick: e => this.prevSlide(e) }),
      $el("button.next", { textContent: "❯", onclick: e => this.nextSlide(e) }),
    ]);

    const galleryButton = carousel.querySelector('button.gallery');
    galleryButton.appendChild(createGallerySVG("26px", "26px", "20px"));

    this.element.appendChild(carousel);
    this.selectImage(slides[activeIndex]);

    const slidesContainer = carousel.querySelector('.slides');
    this.setupSlidesInteraction(slidesContainer);

    document.addEventListener("keydown", this.onKeydown, { capture: true });
    document.body.style.overflow = 'hidden';
    document.activeElement?.blur();

    const dotsContainer = carousel.querySelector('.dots');
    dotsContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      dotsContainer.scrollLeft += e.deltaY;
    });

    return carousel;
  }

  setupSlidesInteraction(slidesContainer) {
    slidesContainer.addEventListener('dragstart', (e) => e.preventDefault());
    slidesContainer.style.cursor = 'grab';

    let isDragging = false;
    let startX, startY;

    slidesContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX - this.translateX;
      startY = e.clientY - this.translateY;
      slidesContainer.style.cursor = 'grabbing';
    });

    slidesContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const activeImage = this.getActive();
      const rect = activeImage.getBoundingClientRect();
      const containerRect = slidesContainer.getBoundingClientRect();

      const maxX = Math.max(0, (rect.width * this.scale - containerRect.width) / 2);
      const maxY = Math.max(0, (rect.height * this.scale - containerRect.height) / 2);

      this.translateX = Math.max(-maxX, Math.min(maxX, e.clientX - startX));
      this.translateY = Math.max(-maxY, Math.min(maxY, e.clientY - startY));

      this.updateZoom();
    });

    slidesContainer.addEventListener('mouseup', () => {
      isDragging = false;
      slidesContainer.style.cursor = 'grab';
    });

    slidesContainer.addEventListener('mouseleave', () => {
      isDragging = false;
      slidesContainer.style.cursor = 'grab';
    });

    slidesContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
      const oldScale = this.scale;
      this.scale = Math.max(0.1, Math.min(10, this.scale * scaleChange));

      // Get the mouse position relative to the image
      const rect = this.getActive().getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate the new translation
      const newTranslateX = mouseX - (mouseX - this.translateX * oldScale) * (this.scale / oldScale);
      const newTranslateY = mouseY - (mouseY - this.translateY * oldScale) * (this.scale / oldScale);

      this.translateX = newTranslateX / this.scale;
      this.translateY = newTranslateY / this.scale;

      this.updateZoom();
    });

  }

  async loadGalleryImages(e) {
    if (typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }

    const subfolder = e.target.dataset.subfolder || '';
    const response = await fetch(`/gallery/images?subfolder=${encodeURIComponent(subfolder)}`);
    if (!response.ok) {
      alert("Failed to load gallery images");
      return;
    }
    const data = await response.json();
    const images = data.images;
    const folders = data.folders;
    const currentFolder = data.current_folder;

    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'breadcrumb-navigation';

    // Add 'Home' as the first breadcrumb
    const homeButton = document.createElement('button');
    homeButton.textContent = 'Home';
    homeButton.dataset.subfolder = ''; // Root directory
    homeButton.addEventListener('click', (e) => {
      this.loadGalleryImages({ target: { dataset: { subfolder: '' } } });
    });
    breadcrumb.appendChild(homeButton);

    const pathSegments = currentFolder.split('/');
    pathSegments.forEach((segment, index) => {
      if (segment) {
        const button = document.createElement('button');
        button.textContent = segment;
        button.dataset.subfolder = pathSegments.slice(0, index + 1).join('/');
        button.addEventListener('click', (e) => {
          this.loadGalleryImages({ target: { dataset: { subfolder: button.dataset.subfolder } } });
        });
        breadcrumb.appendChild(button);
      }
    });

    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'gallery-container';

    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.className = 'scroll-to-top';
    scrollToTopButton.innerHTML = '↑';
    scrollToTopButton.addEventListener('click', () => {
      galleryContainer.scrollTop = 0;
    });

    const selectButton = document.createElement('button');
    selectButton.className = 'select-images';
    selectButton.innerHTML = '&#10003;'; // Initial icon is a tick
    let isSelectionMode = false;
    selectButton.addEventListener('click', () => {
      isSelectionMode = !isSelectionMode;
      if (isSelectionMode) {
        selectButton.innerHTML = '&#8212;'; // Change icon to a dash when select mode is active
        galleryContainer.querySelectorAll('img').forEach(img => {
          if (!img.classList.contains('selected')) {
            img.classList.add('greyed-out');
          }
        });
      } else {
        selectButton.innerHTML = '&#10003;'; // Change icon back to a tick when select mode is inactive
        galleryContainer.querySelectorAll('img').forEach(img => {
          img.classList.remove('greyed-out');
          img.classList.remove('selected'); // Unselect all images
        });
        deleteButton.style.display = 'none'; // Hide delete button
        lastSelectedIndex = -1; // Reset the last selected index
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'remove scroll-to-top select-images'; // Add the same classes
    deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-0.24 -0.24 24.48 24.48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12L14 16M14 12L10 16M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6"/></svg>`;
    deleteButton.style.display = 'none'; // Initially hidden
    deleteButton.addEventListener('click', async () => {
      const selectedImages = galleryContainer.querySelectorAll('img.selected');

      for (const img of selectedImages) {
        try {
          const imageId = img.dataset.src.split("?")[1];

          const response = await fetch("/gallery/image/remove", {
            method: "POST",
            body: imageId,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to delete image: ${response.statusText}`);
          }

          img.remove();

        } catch (error) {
          console.error('Error deleting image:', error);
          alert('Failed to delete some images. Please try again.');
          break;
        }
      }

      deleteButton.style.display = 'none';
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const storedSize = localStorage.getItem('galleryImageSize') || '150';

    const sizeSlider = document.createElement('input');
    sizeSlider.type = 'range';
    sizeSlider.min = '50';
    sizeSlider.max = '300';
    sizeSlider.value = storedSize;
    sizeSlider.className = 'gallery-size-slider';

    const updateImageSize = () => {
      const size = sizeSlider.value + 'px';
      galleryContainer.style.setProperty('--image-size', size);
      // Store the new size
      localStorage.setItem('galleryImageSize', sizeSlider.value);
    };

    sizeSlider.addEventListener('input', updateImageSize);

    const loadImage = (img, src) => {
      return new Promise((resolve) => {
        img.onload = resolve;
        img.src = src;
      });
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage(entry.target, entry.target.dataset.src);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "600px 600px"
    });

    const immediateLoadCount = 20;
    const immediateLoadPromises = [];
    let lastSelectedIndex = -1;
    let isDragging = false;
    let startX, startY;

    folders.forEach(folder => {
      const folderButton = document.createElement('button');
      folderButton.className = 'folder-button';

      // Create an SVG folder icon
      const folderIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      folderIcon.setAttribute("width", "40"); // Adjust size as needed
      folderIcon.setAttribute("height", "40");
      folderIcon.setAttribute("viewBox", "0 0 90 90");
      folderIcon.setAttribute("fill", "none");
      folderIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      folderIcon.innerHTML = `
      <g transform="translate(1.4065934065934016 1.4065934065934016) scale(1 1)">
        <path d="M 86.351 17.027 H 35.525 c -1.909 0 -3.706 -0.903 -4.846 -2.435 l -2.457 -3.302 c -0.812 -1.092 -2.093 -1.735 -3.454 -1.735 H 3.649 C 1.634 9.556 0 11.19 0 13.205 V 29.11 c 0 -2.015 1.634 -1.649 3.649 -1.649 h 82.703 c 2.015 0 3.649 -0.366 3.649 1.649 v -8.435 C 90 18.661 88.366 17.027 86.351 17.027 z" fill="rgb(48,168,249)"/>
        <path d="M 86.351 80.444 H 3.649 C 1.634 80.444 0 78.81 0 76.795 V 29.11 c 0 -2.015 1.634 -3.649 3.649 -3.649 h 82.703 c 2.015 0 3.649 1.634 3.649 3.649 v 47.685 C 90 78.81 88.366 80.444 86.351 80.444 z" fill="rgb(42,152,234)"/>
      </g>
      `;

      folderButton.appendChild(folderIcon); // Add the SVG to the button

      const folderText = document.createElement('span');
      folderText.textContent = folder;
      folderText.className = 'folder-text';
      folderButton.appendChild(folderText);

      // Ensure the event listener is on the entire button
      folderButton.dataset.subfolder = currentFolder ? `${currentFolder}/${folder}` : folder;
      folderButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        this.loadGalleryImages({ target: folderButton });
      });

      galleryContainer.appendChild(folderButton);
    });


    images.forEach((src, index) => {
      const img = new Image();
      img.dataset.src = src;
      img.alt = `Gallery image ${index + 1}`;
      img.addEventListener('click', (e) => {
        if (isSelectionMode) {
          const currentIndex = index;

          if (e.shiftKey && lastSelectedIndex !== -1) {
            // Shift-click functionality
            const start = Math.min(lastSelectedIndex, currentIndex);
            const end = Math.max(lastSelectedIndex, currentIndex);

            for (let i = start; i <= end; i++) {
              const imgToSelect = galleryContainer.children[i];
              imgToSelect.classList.add('selected');
              imgToSelect.classList.remove('greyed-out');
            }
          } else {
            // Normal click functionality
            img.classList.toggle('selected');
            img.classList.toggle('greyed-out');
            lastSelectedIndex = currentIndex;
          }

          // Show delete button if at least one image is selected
          const anySelected = galleryContainer.querySelector('img.selected');
          deleteButton.style.display = anySelected ? 'block' : 'none';
        } else {
          this.lastViewedIndex = index;
          this.showLargeView(images, index);
        }
      });
      galleryContainer.appendChild(img);

      if (index < immediateLoadCount) {
        immediateLoadPromises.push(loadImage(img, src));
      } else {
        observer.observe(img);
      }
    });

    galleryContainer.addEventListener('mousedown', (e) => {
      if (isSelectionMode) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
      }
    });

    galleryContainer.addEventListener('mousemove', (e) => {
      if (isDragging && isSelectionMode) {
        const currentX = e.clientX;
        const currentY = e.clientY;
        const dx = currentX - startX;
        const dy = currentY - startY;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          const hoveredElement = document.elementFromPoint(currentX, currentY);
          if (hoveredElement && hoveredElement.tagName === 'IMG') {
            hoveredElement.classList.add('selected');
            hoveredElement.classList.remove('greyed-out');
            lastSelectedIndex = Array.from(galleryContainer.children).indexOf(hoveredElement);

            // Check if any images are selected and show/hide the delete button
            const anySelected = galleryContainer.querySelector('img.selected');
            deleteButton.style.display = anySelected ? 'block' : 'none';
          }
        }
      }
    });


    galleryContainer.addEventListener('mouseup', () => {
      isDragging = false;
    });

    galleryContainer.addEventListener('mouseleave', () => {
      isDragging = false;
    });

    galleryContainer.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });

    this.element.innerHTML = '';
    buttonContainer.appendChild(deleteButton); // Add delete button
    buttonContainer.appendChild(selectButton);
    buttonContainer.appendChild(scrollToTopButton);
    this.element.appendChild(breadcrumb);
    this.element.appendChild(galleryContainer);
    this.element.appendChild(sizeSlider);
    this.element.appendChild(buttonContainer);

    setTimeout(() => {
      galleryContainer.classList.add('show');
    }, 0);

    const closeButton = document.createElement('button');
    closeButton.className = 'close-gallery';
    closeButton.textContent = '✖';
    closeButton.addEventListener('click', () => this.close());
    this.element.appendChild(closeButton);

    this.show(images, 0, () => { });

    // Wait for the initial set of images to load
    await Promise.all(immediateLoadPromises);

    updateImageSize(); // Initial size update

    return galleryContainer;
  }

  showLargeView(images, activeIndex) {
    this.element.innerHTML = '';
    const slides = images.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
    this.setupCarousel(slides, activeIndex);
    this.scrollToImage(activeIndex);
  }

  async removeImage(e) {
    e.stopPropagation();
    if (!confirm("Remove this image?")) return;
    let active = this.getActive();
    let response = await fetch("/gallery/image/remove", {
      method: "POST",
      body: active.src.split("?")[1],
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    if (!response.ok) {
      alert(`Failed removing image, server responded with: ${response.statusText}`);
      return;
    }
    let newActive = active.nextElementSibling || active.previousElementSibling;
    active._dot.remove();
    active.remove();
    this.removeCallback(active.src);
    if (newActive) this.selectImage(newActive);
    else this.close();
  }

  prevSlide(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    let active = this.getActive();
    let prev = active.previousElementSibling || active.parentNode.lastElementChild;
    this.selectImage(prev);
    this.lastViewedIndex = Array.from(active.parentNode.children).indexOf(prev);
  }

  nextSlide(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    let active = this.getActive();
    let next = active.nextElementSibling || active.parentNode.firstElementChild;
    this.selectImage(next);
    this.lastViewedIndex = Array.from(active.parentNode.children).indexOf(next);
  }

  onKeydown(e) {
    e.preventDefault();
    e.stopPropagation();
    switch (e.key) {
      case "Escape":
        this.close();
        break;
      case "Delete":
        this.removeImage(e);
        break;
      case "ArrowLeft":
        this.prevSlide(e);
        break;
      case "ArrowRight":
        this.nextSlide(e);
        break;
      case "d":
      case "D":
        this.resetZoom();
        break;
      case "o":
        this.loadImage();
        this.close();
        break;
    }
  }

  initializeGallerySize() {
    const storedSize = localStorage.getItem('galleryImageSize') || '150';
    document.documentElement.style.setProperty('--image-size', `${storedSize}px`);
  }

  show(images, activeIndex, removeCallback) {
    this.removeCallback = removeCallback;
    const slides = images.map(image => {
      const slide = new Image();
      slide.src = image;
      return slide;
    });
    const carousel = this.setupCarousel(slides, activeIndex);
    this.element.classList.add('show');
    this.element.classList.remove('hide');
    super.show(carousel);
  }

  close() {
    this.element.classList.add('hide');
    this.element.classList.remove('show');
    setTimeout(() => {
      document.removeEventListener("keydown", this.onKeydown, { capture: true });
      document.body.style.overflow = '';
      const slider = this.element.querySelector('.gallery-size-slider');
      if (slider) slider.remove();
      const galleryContainer = this.element.querySelector('.gallery-container');
      if (galleryContainer) {
        galleryContainer.remove();
      }
      super.close();
    }, 500); // Match this duration with the CSS transition duration
  }
}

app.registerExtension({
  name: "Comfy.ImageGallery",
  init() {
    app.ui.galleryCarousel = new ComfyCarousel();
    app.ui.nodeCarousel = new ComfyCarousel();
    app.ui.galleryCarousel.initializeGallerySize();

    const createGalleryIcon = (el) => {
      const svg = createGallerySVG();
      el.appendChild(svg);
    };

    const clearButton = document.querySelector('button[title="Clears current workflow"]');

    if (clearButton) {
      const galleryButton = Object.assign(document.createElement('button'), {
        className: 'comfyui-button',
        title: 'View Gallery',
        onclick: (e) => {
          app.ui.galleryCarousel.loadGalleryImages(e);
          console.log("ComfyCarousel initialized");
        }
      });

      createGalleryIcon(galleryButton);
      clearButton.parentNode.insertBefore(galleryButton, clearButton.nextSibling);
    } else {
      console.warn("Clear button not found. Gallery icon couldn't be added.");
    }
  },

  async setup() {
    let origHandleFile = app.handleFile;
    app.handleFile = function (...args) {
      handleFile.call(this, origHandleFile, ...args)
    };

    const input = document.getElementById("comfy-file-input");
    let types = input?.getAttribute("accept");
    if (types) {
      types = types.split(",").map(t => t.trim());
      if (!types.includes("image/webp"))
        types.push("image/webp");
      if (!types.includes("image/jpeg"))
        types.push("image/jpeg");
      input.setAttribute("accept", types.join(","));
    }
  },

  beforeRegisterNodeDef(nodeType, nodeData) {
    function isImageClick(node, pos) {
      let imageY;
      if (node.imageOffset) imageY = node.imageOffset;
      else if (node.widgets?.length) {
        const widget = node.widgets[node.widgets.length - 1];
        imageY = widget.last_y;
        if (widget.computeSize) imageY += widget.computeSize()[1] + 4;
        else if (widget.computedHeight) imageY += widget.computedHeight;
        else imageY += LiteGraph.NODE_WIDGET_HEIGHT + 4;
      } else imageY = node.computeSize()[1];
      return pos[1] >= imageY;
    }

    const origOnDblClick = nodeType.prototype.onDblClick;
    nodeType.prototype.onDblClick = function (e, pos, ...args) {
      if (this.imgs && this.imgs.length && isImageClick(this, pos)) {
        let imageIndex = 0;
        if (this.imageIndex !== null) imageIndex = this.imageIndex;
        else if (this.overIndex !== null) imageIndex = this.overIndex;
        app.ui.nodeCarousel.show(this.imgs.map(img => img.src), imageIndex, src => {
          let index = this.imgs.findIndex(image => image.src == src);
          if (index >= 0) {
            this.imgs.splice(index, 1);
            if (this.imageIndex !== null)
              this.imageIndex = this.imgs.length ? this.imageIndex % this.imgs.length : null;
            if (this.overIndex !== null)
              this.overIndex = this.imgs.length ? this.overIndex % this.imgs.length : null;
            app.graph.setDirtyCanvas(true);
          }
        });
      } else if (origOnDblClick) {
        origOnDblClick.call(this, e, pos, ...args);
      }
    };
  }
});
