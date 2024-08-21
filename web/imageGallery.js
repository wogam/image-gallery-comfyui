import { app } from "/scripts/app.js";
import { $el, ComfyDialog } from "/scripts/ui.js";

const styles = `
.comfy-carousel {
  display: none;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
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
  justify-content: flex-end; /* Align content to the bottom */
  padding-bottom: 5px; /* Add some padding at the bottom */
}

.comfy-carousel-box .slides {
  flex-grow: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px; /* Add space between main image and dots */
}

.comfy-carousel-box .slides img {
  display: none;
  max-height: 80vh; /* Reduce max height to leave more space for dots */
  max-width: 100%;
  object-fit: contain;
}

.comfy-carousel-box .slides img.shown {
  display: block;
}

.comfy-carousel-box .remove,
.comfy-carousel-box .close,
.comfy-carousel-box .gallery,
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
.comfy-carousel-box .prev:hover,
.comfy-carousel-box .next:hover {
  background: rgba(0,0,0,0.8);
}

.comfy-carousel-box .remove {
  top: 20px;
  right: 120px;
  transition: background-color 0.3s;
}

.comfy-carousel-box .remove:hover {
  background-color: rgba(255, 0, 0, 0.8); /* Red background with 80% opacity */
}

.comfy-carousel-box .remove svg {
  fill: currentColor; /* This ensures the icon color doesn't change */
}

.comfy-carousel-box .gallery svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.comfy-carousel-box .gallery {
  top: 20px;
  right: 70px;
  transition: background-color 0.3s;
}

.comfy-carousel-box .gallery:hover {
  background-color: rgba(66, 135, 245, 0.8); /* Blue background with 80% opacity */
}

.comfy-carousel-box .close {
  top: 20px;
  right: 20px;
}

.comfy-carousel-box .prev {
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.comfy-carousel-box .next {
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.comfy-carousel-box .dots {
  position: relative; /* Change from absolute to relative */
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
    width: 90vw; /* Added to make the container wider */
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

.comfy-carousel-box .reset-zoom {
  position: absolute;
  top: 20px;
  right: 170px;
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
  transition: background-color 0.3s;
}

.comfy-carousel-box .reset-zoom:hover {
  background-color: rgba(234, 182, 118, 0.8); /* Orange background with 80% opacity */
}

.comfy-carousel-box .reset-zoom svg {
  fill: currentColor; /* This ensures the icon color doesn't change */
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

  selectImage(slide) {
    let active = this.getActive();
    if (active) {
      active.classList.remove('shown');
      active._dot.classList.remove('active');
    }
    slide.classList.add('shown');
    slide._dot.classList.add('active');

    // Get all dots
    const allDots = Array.from(this.element.querySelectorAll('.dots img'));
    const activeIndex = allDots.indexOf(slide._dot);

    // Calculate the range of dots to display
    const startIndex = Math.max(0, activeIndex - 10);
    const endIndex = Math.min(allDots.length - 1, activeIndex + 10);

    // Hide all dots first
    allDots.forEach(dot => dot.style.display = 'none');

    // Show only the dots within the calculated range
    for (let i = startIndex; i <= endIndex; i++) {
      allDots[i].style.display = 'inline-block';
    }

    // Scroll the active dot into view
    slide._dot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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
      img.src = src;
    };

    // Increase the root margin to load images just outside the viewport
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage(entry.target, entry.target.dataset.src);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "600px 600px" // Adjust this value to control how far outside the viewport to start loading
    });

    // Number of images to load immediately
    const immediateLoadCount = 20; // Adjust this number as needed

    images.forEach((src, index) => {
      const img = new Image();
      img.dataset.src = src;
      img.alt = `Gallery image ${index + 1}`;
      img.addEventListener('click', () => this.showLargeView(images, index));
      galleryContainer.appendChild(img);

      if (index < immediateLoadCount) {
        // Load the first batch of images immediately
        loadImage(img, src);
      } else {
        // Use Intersection Observer for the rest
        observer.observe(img);
      }
    });

    this.element.innerHTML = '';
    this.element.appendChild(galleryContainer);

    // Add close button to gallery view
    const closeButton = document.createElement('button');
    closeButton.className = 'close-gallery';
    closeButton.textContent = '✖';
    closeButton.addEventListener('click', () => this.close());
    this.element.appendChild(closeButton);

    // Show the ComfyCarousel
    this.show(images, 0, () => { });
  }


  showLargeView(images, activeIndex) {
      this.element.innerHTML = ''; // Clear the gallery view
      const slides = images.map(src => {
          const img = new Image();
          img.src = src;
          return img;
      });
      
      const carousel = $el("div.comfy-carousel-box", {}, [
          $el("div.slides", {}, slides),
          $el("div.dots", {}, slides.map(slide => {
              const dot = slide.cloneNode(true);
              dot.addEventListener('click', () => this.selectImage(slide));
              slide._dot = dot;
              return dot;
          })),
          $el("button.reset-zoom", {
            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-3.2 -3.2 38.40 38.40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18,28A12,12,0,1,0,6,16v6.2L2.4,18.6,1,20l6,6,6-6-1.4-1.4L8,22.2V16H8A10,10,0,1,1,18,26Z"/></svg>`,
            onclick: () => this.resetZoom()
          }),
          $el("button.gallery", {
            innerHTML: `<svg fill="#000000" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-51.22 -51.22 614.64 614.64" xml:space="preserve"> <g id="SVGRepo_bgCarrier" stroke-width="0"/> <g stroke-linecap="round" stroke-linejoin="round"/> <g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M495.1,38.4H85.5c-9.4,0-17.1,7.6-17.1,17.1v17.1H51.3c-9.4,0-17.1,7.6-17.1,17.1v17.1H17.1c-9.4,0-17.1,7.6-17.1,17.1 v332.8c0,9.4,7.6,17.1,17.1,17.1h409.6c9.4,0,17.1-7.6,17.1-17.1v-17.1h17.1c9.4,0,17.1-7.6,17.1-17.1v-17.1h17.1 c9.4,0,17.1-7.6,17.1-17.1V55.5C512.2,46,504.6,38.4,495.1,38.4z M426.8,314.4l-44.7-51.2c-3.4-3.9-9.4-3.9-12.9,0l-54,61.8 L168,194.2c-3.2-2.9-8.1-2.9-11.3,0L17.3,318.1V132.3c0-4.7,3.8-8.5,8.5-8.5h392.5c4.7,0,8.5,3.8,8.5,8.5V314.4z M452.5,422.4 H444V123.7c0-9.4-7.6-17.1-17.1-17.1H51.4v-8.5c0-4.7,3.8-8.5,8.5-8.5h392.5c4.7,0,8.5,3.8,8.5,8.5l0.1,315.8 C461,418.6,457.2,422.4,452.5,422.4z M486.6,388.2h-8.5V89.6c0-9.4-7.6-17.1-17.1-17.1H85.5V64c0-4.7,3.8-8.5,8.5-8.5h392.5 c4.7,0,8.5,3.8,8.5,8.5v315.7h0.1C495.1,384.4,491.3,388.2,486.6,388.2z"/> <path d="M307.4,174.9c-18.8,0-34.1,15.3-34.1,34.1c0,18.8,15.3,34.1,34.1,34.1c18.8,0,34.1-15.3,34.1-34.1 C341.5,190.2,326.2,174.9,307.4,174.9z"/> </g> </g> </g> </g> </svg>`,
            onclick: e => {
              if (this.isGalleryCarousel) {
                this.loadGalleryImages(e);
              } else {
                this.close();
                app.ui.galleryCarousel.loadGalleryImages(e);
              }
            }
          }),
          $el("button.remove", {
            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-0.24 -0.24 24.48 24.48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12L14 16M14 12L10 16M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6"/></svg>`,
            onclick: e => this.removeImage(e)
          }),
          $el("button.close", { textContent: "✖", onclick: () => this.close() }),
          $el("button.prev", { textContent: "❮", onclick: e => this.prevSlide(e) }),
          $el("button.next", { textContent: "❯", onclick: e => this.nextSlide(e) }),
      ]);
  
      this.element.appendChild(carousel);
      this.selectImage(slides[activeIndex]);
      slides[activeIndex]._dot.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });

      const slidesContainer = carousel.querySelector('.slides');

      // Prevent default drag behavior
      slidesContainer.addEventListener('dragstart', (e) => {
        e.preventDefault();
      });

      // Add cursor style
      slidesContainer.style.cursor = 'grab';

      let isDragging = false;
      let startX, startY;
      const dragSensitivity = 0.5; // Adjust this value to change drag sensitivity  

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
        if (e.buttons === 1) { // Left mouse button is pressed
          const rect = activeImage.getBoundingClientRect();
          const containerRect = slidesContainer.getBoundingClientRect();

          const maxX = (rect.width * this.scale - containerRect.width) / 2;
          const maxY = (rect.height * this.scale - containerRect.height) / 2;

          this.translateX += e.movementX;
          this.translateY += e.movementY;

          // Limit translation
          this.translateX = Math.max(-maxX, Math.min(maxX, this.translateX));
          this.translateY = Math.max(-maxY, Math.min(maxY, this.translateY));

          this.updateZoom();
        }
      });

  
      document.addEventListener("keydown", this.onKeydown, { capture: true });
      document.body.style.overflow = 'hidden';
      document.activeElement?.blur();
  
      // Enable mouse wheel scrolling for the dots
      const dotsContainer = carousel.querySelector('.dots');
      dotsContainer.addEventListener('wheel', (e) => {
          e.preventDefault();
          dotsContainer.scrollLeft += e.deltaY;
      });
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
    this.selectImage(active.previousElementSibling || active.parentNode.lastElementChild);
  }

  nextSlide(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    let active = this.getActive();
    this.selectImage(active.nextElementSibling || active.parentNode.firstElementChild);
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
    } else if (e.key === "r" || e.key === "R") {
      this.resetZoom();
    }
  }

  show(images, activeIndex, removeCallback) {
    this.removeCallback = removeCallback;
    let slides = [];
    let dotsArray = []; // Change this line
    const dots = $el("div.dots", {});

    for (let image of images) {
      let slide = new Image();
      slide.src = image;
      slides.push(slide);

      let dot = new Image();
      dot.src = image;
      dot.addEventListener('click', (e) => {
        this.selectImage(slide);
        e.stopPropagation();
      }, true);
      slide._dot = dot;
      dotsArray.push(dot); // Change this line

      if (slides.length - 1 == activeIndex) this.selectImage(slide);
    }


    for (let i = 0; i < images.length; i++) {
      let slide = new Image();
      slide.src = images[i];
      slides.push(slide);

      let dot = new Image();
      dot.src = images[i];
      dot.addEventListener('click', (e) => {
        this.selectImage(slide);
        e.stopPropagation();
      }, true);
      slide._dot = dot;

      // Initially hide all dots
      dot.style.display = 'none';

      dots.appendChild(dot);
    }

    const carousel = $el("div.comfy-carousel-box", {}, [
      $el("div.slides", {}, slides),
      $el("div.dots", {}, dotsArray),
      $el("button.reset-zoom", {
        innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-3.2 -3.2 38.40 38.40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18,28A12,12,0,1,0,6,16v6.2L2.4,18.6,1,20l6,6,6-6-1.4-1.4L8,22.2V16H8A10,10,0,1,1,18,26Z"/></svg>`,
        onclick: () => this.resetZoom()
      }),
      $el("button.gallery", {
        innerHTML: `<svg fill="#000000" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-51.22 -51.22 614.64 614.64" xml:space="preserve"> <g id="SVGRepo_bgCarrier" stroke-width="0"/> <g stroke-linecap="round" stroke-linejoin="round"/> <g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M495.1,38.4H85.5c-9.4,0-17.1,7.6-17.1,17.1v17.1H51.3c-9.4,0-17.1,7.6-17.1,17.1v17.1H17.1c-9.4,0-17.1,7.6-17.1,17.1 v332.8c0,9.4,7.6,17.1,17.1,17.1h409.6c9.4,0,17.1-7.6,17.1-17.1v-17.1h17.1c9.4,0,17.1-7.6,17.1-17.1v-17.1h17.1 c9.4,0,17.1-7.6,17.1-17.1V55.5C512.2,46,504.6,38.4,495.1,38.4z M426.8,314.4l-44.7-51.2c-3.4-3.9-9.4-3.9-12.9,0l-54,61.8 L168,194.2c-3.2-2.9-8.1-2.9-11.3,0L17.3,318.1V132.3c0-4.7,3.8-8.5,8.5-8.5h392.5c4.7,0,8.5,3.8,8.5,8.5V314.4z M452.5,422.4 H444V123.7c0-9.4-7.6-17.1-17.1-17.1H51.4v-8.5c0-4.7,3.8-8.5,8.5-8.5h392.5c4.7,0,8.5,3.8,8.5,8.5l0.1,315.8 C461,418.6,457.2,422.4,452.5,422.4z M486.6,388.2h-8.5V89.6c0-9.4-7.6-17.1-17.1-17.1H85.5V64c0-4.7,3.8-8.5,8.5-8.5h392.5 c4.7,0,8.5,3.8,8.5,8.5v315.7h0.1C495.1,384.4,491.3,388.2,486.6,388.2z"/> <path d="M307.4,174.9c-18.8,0-34.1,15.3-34.1,34.1c0,18.8,15.3,34.1,34.1,34.1c18.8,0,34.1-15.3,34.1-34.1 C341.5,190.2,326.2,174.9,307.4,174.9z"/> </g> </g> </g> </g> </svg>`,
        onclick: e => {
          if (this.isGalleryCarousel) {
            this.loadGalleryImages(e);
          } else {
            this.close();
            app.ui.galleryCarousel.loadGalleryImages(e);
          }
        }
      }),
      $el("button.remove", {
        innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-0.24 -0.24 24.48 24.48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 12L14 16M14 12L10 16M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6"/></svg>`,
        onclick: e => this.removeImage(e)
      }),
      $el("button.close", { textContent: "✖", onclick: () => this.close() }),
      $el("button.prev", { textContent: "❮", onclick: e => this.prevSlide(e) }),
      $el("button.next", { textContent: "❯", onclick: e => this.nextSlide(e) }),
    ]);

    this.element.appendChild(carousel);
    this.selectImage(slides[activeIndex]);

    // Add zoom functionality
    const slidesContainer = carousel.querySelector('.slides');

    // Prevent default drag behavior
    slidesContainer.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });

    // Add cursor style
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
      if (e.buttons === 1) { // Left mouse button is pressed
        this.translateX += e.movementX;
        this.translateY += e.movementY;
        this.updateZoom();
      }
    });
    super.show(carousel);
    document.addEventListener("keydown", this.onKeydown, { capture: true });
    document.body.style.overflow = 'hidden';
    document.activeElement?.blur();

    // Enable mouse wheel scrolling for the dots
    const dotsContainer = carousel.querySelector('.dots');
    dotsContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      dotsContainer.scrollLeft += e.deltaY;
    });
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

    const createGalleryIcon = (el) => {
      const ns = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("viewBox", "0 0 1024 1024");
      svg.setAttribute("width", "1em");
      svg.setAttribute("height", "1em");
      svg.style.fontSize = 19;
      const customPath = document.createElementNS(ns, "path");
      const drawPath = "M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zM338 304c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64z m513.9 437.1c-1.4 1.2-3.3 1.9-5.2 1.9H177.2c-4.4 0-8-3.6-8-8 0-1.9 0.7-3.7 1.9-5.2l170.3-202c2.8-3.4 7.9-3.8 11.3-1 0.3 0.3 0.7 0.6 1 1l99.4 118 158.1-187.5c2.8-3.4 7.9-3.8 11.3-1 0.3 0.3 0.7 0.6 1 1l229.6 271.6c2.6 3.3 2.2 8.4-1.2 11.2z";
      customPath.setAttribute("d", drawPath);
      customPath.setAttribute("fill", "currentColor");
      svg.appendChild(customPath);
      el.appendChild(svg);
    };

    // Find the clear button
    const clearButton = document.querySelector('button[title="Clears current workflow"]');

    if (clearButton) {
      // Create the gallery icon button
      const galleryButton = document.createElement('button');
      galleryButton.className = 'comfyui-button';
      galleryButton.title = 'View Gallery';
      createGalleryIcon(galleryButton);
      galleryButton.addEventListener('click', (e) => {
        app.ui.galleryCarousel.loadGalleryImages(e);
        console.log("ComfyCarousel initialized");
      });

      // Insert the gallery button after the clear button
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
