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
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 7px;
}

.comfy-carousel-box .remove,
.comfy-carousel-box .close,
.comfy-carousel-box .gallery,
.comfy-carousel-box .reset-zoom {
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
.comfy-carousel-box .reset-zoom:hover {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.comfy-carousel-box .prev:hover,
.comfy-carousel-box .next:hover {
  background: rgba(0,0,0,0.8);
}

.comfy-carousel-box .remove { top: 20px; right: 120px; }
.comfy-carousel-box .gallery { top: 20px; right: 70px; }
.comfy-carousel-box .close { top: 20px; right: 20px; }
.comfy-carousel-box .prev { left: 20px; top: 50%; transform: translateY(-50%); }
.comfy-carousel-box .next { right: 20px; top: 50%; transform: translateY(-50%); }
.comfy-carousel-box .reset-zoom { top: 20px; right: 170px; }

.comfy-carousel-box .remove:hover { background-color: rgba(255, 0, 0, 0.2); }
.comfy-carousel-box .gallery:hover { background-color: rgba(66, 135, 245, 0.2); }
.comfy-carousel-box .reset-zoom:hover { background-color: rgba(234, 182, 118, 0.2); }

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
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  padding: 20px;
  max-height: 90vh;
  width: 90vw;
  overflow-y: auto;
  background: rgba(0,0,0,0.8);
}

.comfy-carousel .gallery-container img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.comfy-carousel .gallery-container img:hover {
  transform: scale(1.05);
}

.comfy-carousel .close-gallery {
  position: fixed;
  top: 20px;
  right: 20px;
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

.comfy-carousel .close-gallery:hover {
  background: rgba(0,0,0,0.8);
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

class ComfyCarousel extends ComfyDialog {
  constructor(isGalleryCarousel = false) {
    super();
    this.isGalleryCarousel = isGalleryCarousel;
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.lastViewedIndex = 0;
    this.element.classList.remove("comfy-modal");
    this.element.classList.add("comfy-carousel");
    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });
    this.onKeydown = this.onKeydown.bind(this);
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
      activeImage.style.transform = `scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`;
    }
  }

  resetZoom() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.updateZoom();
  }

  scrollToImage(index) {
    const dots = this.element.querySelectorAll('.dots img');
    if (dots[index]) {
      dots[index].scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
    }
  }

  scrollToLastViewedImage(galleryContainer) {
    if (this.lastViewedIndex > 0) {
      const images = galleryContainer.querySelectorAll('img');
      if (images[this.lastViewedIndex]) {
        setTimeout(() => {
          images[this.lastViewedIndex].scrollIntoView({ behavior: 'auto', block: 'center' });
        }, 0);
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

    allDots.forEach(dot => dot.style.display = 'none');

    for (let i = startIndex; i <= endIndex; i++) {
      allDots[i].style.display = 'inline-block';
    }

    slide._dot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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
        $el("button.gallery", {
          innerHTML: `<svg width="64px" height="64px" viewBox="-3.36 -3.36 30.72 30.72" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M22 13.4375C22 17.2087 22 19.0944 20.8284 20.2659C19.6569 21.4375 17.7712 21.4375 14 21.4375H10C6.22876 21.4375 4.34315 21.4375 3.17157 20.2659C2 19.0944 2 17.2087 2 13.4375C2 9.66626 2 7.78065 3.17157 6.60907C4.34315 5.4375 6.22876 5.4375 10 5.4375H14C17.7712 5.4375 19.6569 5.4375 20.8284 6.60907C21.4921 7.27271 21.7798 8.16545 21.9045 9.50024" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/> <path d="M3.98779 6C4.10022 5.06898 4.33494 4.42559 4.82498 3.93726C5.76553 3 7.27932 3 10.3069 3H13.5181C16.5457 3 18.0595 3 19 3.93726C19.4901 4.42559 19.7248 5.06898 19.8372 6" stroke="#ffffff" stroke-width="1.6"/> <circle cx="17.5" cy="9.9375" r="1.5" stroke="#ffffff" stroke-width="1.6"/> <path d="M2 13.9376L3.75159 12.405C4.66286 11.6077 6.03628 11.6534 6.89249 12.5096L11.1822 16.7993C11.8694 17.4866 12.9512 17.5803 13.7464 17.0214L14.0446 16.8119C15.1888 16.0077 16.7369 16.1009 17.7765 17.0365L21 19.9376" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/> </g> </svg>`,
          onclick: async (e) => {
            if (this.isGalleryCarousel) {
              const galleryContainer = await this.loadGalleryImages(e);
              this.scrollToLastViewedImage(galleryContainer);
            } else {
              this.close();
              const galleryContainer = await app.ui.galleryCarousel.loadGalleryImages(e);
              app.ui.galleryCarousel.scrollToLastViewedImage(galleryContainer);
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
      this.translateX = e.clientX - startX;
      this.translateY = e.clientY - startY;
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
      const delta = e.deltaY;
      const scaleChange = delta > 0 ? 0.9 : 1.1;
      this.scale *= scaleChange;
      this.scale = Math.max(0.1, Math.min(10, this.scale));
      this.updateZoom();
    });

    slidesContainer.addEventListener('mousemove', (e) => {
      if (e.buttons === 1) {
        const rect = this.getActive().getBoundingClientRect();
        const containerRect = slidesContainer.getBoundingClientRect();

        const maxX = (rect.width * this.scale - containerRect.width) / 2;
        const maxY = (rect.height * this.scale - containerRect.height) / 2;

        this.translateX += e.movementX;
        this.translateY += e.movementY;

        this.translateX = Math.max(-maxX, Math.min(maxX, this.translateX));
        this.translateY = Math.max(-maxY, Math.min(maxY, this.translateY));

        this.updateZoom();
      }
    });
  }

  async loadGalleryImages(e) {
    e.stopPropagation();
    const response = await fetch("/gallery/images");
    if (!response.ok) {
      alert("Failed to load gallery images");
      return;
    }
    const images = await response.json();
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'gallery-container';

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

    images.forEach((src, index) => {
      const img = new Image();
      img.dataset.src = src;
      img.alt = `Gallery image ${index + 1}`;
      img.addEventListener('click', () => {
        this.lastViewedIndex = index;
        this.showLargeView(images, index);
      });
      galleryContainer.appendChild(img);

      if (index < immediateLoadCount) {
        immediateLoadPromises.push(loadImage(img, src));
      } else {
        observer.observe(img);
      }
    });

    this.element.innerHTML = '';
    this.element.appendChild(galleryContainer);

    const closeButton = document.createElement('button');
    closeButton.className = 'close-gallery';
    closeButton.textContent = '✖';
    closeButton.addEventListener('click', () => this.close());
    this.element.appendChild(closeButton);

    this.show(images, 0, () => { });

    // Wait for the initial set of images to load
    await Promise.all(immediateLoadPromises);

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
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    if (response.status >= 300) {
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
    if (e.key === "Escape") {
      this.close();
    } else if (e.key === "Delete") {
      this.removeImage(e);
    } else if (e.key === "ArrowLeft") {
      this.prevSlide(e);
    } else if (e.key === "ArrowRight") {
      this.nextSlide(e);
    } else if (e.key === "d" || e.key === "D") {
      this.resetZoom();
    }
  }

  show(images, activeIndex, removeCallback) {
    this.removeCallback = removeCallback;
    const slides = images.map(image => {
      const slide = new Image();
      slide.src = image;
      return slide;
    });

    const carousel = this.setupCarousel(slides, activeIndex);
    super.show(carousel);
  }

  close() {
    document.removeEventListener("keydown", this.onKeydown, { capture: true });
    document.body.style.overflow = '';
    super.close();
  }
}

app.registerExtension({
  name: "Comfy.ImageGallery",
  init() {
    app.ui.galleryCarousel = new ComfyCarousel();
    app.ui.nodeCarousel = new ComfyCarousel();

    const createSVGElement = (type, attributes) => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", type);
      Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
      return el;
    };

    const createGalleryIcon = (el) => {
      const svg = createSVGElement("svg", {
        viewBox: "0 0 24 24",
        width: "1em",
        height: "1em",
        style: "font-size: 20px;"
      });

      const paths = [
        "M17.5,21.25H6.5A3.75,3.75,0,0,1,2.75,17.5V6.5A3.75,3.75,0,0,1,6.5,2.75h11A3.75,3.75,0,0,1,21.25,6.5v11A3.75,3.75,0,0,1,17.5,21.25Zm-11-17A2.25,2.25,0,0,0,4.25,6.5v11A2.25,2.25,0,0,0,6.5,19.75h11a2.25,2.25,0,0,0,2.25-2.25V6.5A2.25,2.25,0,0,0,17.5,4.25Z",
        "M3.5,17.06a.76.76,0,0,1-.58-.27.75.75,0,0,1,.1-1l4.7-3.9a3.75,3.75,0,0,1,5.27.48l1.12,1.34a2.25,2.25,0,0,0,3.21.25L20,11.56a.75.75,0,0,1,1,1.13L18.31,15A3.74,3.74,0,0,1,13,14.62l-1.12-1.34A2.25,2.25,0,0,0,8.68,13L4,16.89A.72.72,0,0,1,3.5,17.06Z"
      ];

      paths.forEach(d => {
        svg.appendChild(createSVGElement("path", { d, fill: "currentColor" }));
      });

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
