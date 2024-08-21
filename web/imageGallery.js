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
}

.comfy-carousel-box .slides {
  flex-grow: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
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

.comfy-carousel-box .remove,
.comfy-carousel-box .close,
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
.comfy-carousel-box .prev:hover,
.comfy-carousel-box .next:hover {
  background: rgba(0,0,0,0.8);
}

.comfy-carousel-box .remove {
  top: 20px;
  right: 70px;
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
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(0,0,0,0.5);
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
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

class ComfyCarousel extends ComfyDialog {
  constructor() {
    super();
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

  selectImage(slide) {
    let active = this.getActive();
    if (active) {
      active.classList.remove('shown');
      active._dot.classList.remove('active');
    }
    slide.classList.add('shown');
    slide._dot.classList.add('active');
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
    e.preventDefault(); // Prevent default for all key events
    e.stopPropagation();

    if (e.key === "Escape") {
      this.close();
    } else if (e.key === "Delete") {
      this.removeImage(e);
    } else if (e.key === "ArrowLeft") {
      this.prevSlide(e);
    } else if (e.key === "ArrowRight") {
      this.nextSlide(e);
    }
  }

  show(images, activeIndex, removeCallback) {
    this.removeCallback = removeCallback;
    let slides = [];
    let dots = [];
    for (let image of images) {
      let slide = image.cloneNode(true);
      slides.push(slide);
      let dot = image.cloneNode(true);
      dot.addEventListener('click', (e) => {
        this.selectImage(slide);
        e.stopPropagation();
      }, true);
      slide._dot = dot;
      dots.push(dot);
      if (slides.length - 1 == activeIndex) this.selectImage(slide);
    }

    const carousel = $el("div.comfy-carousel-box", {}, [
      $el("div.slides", {}, slides),
      $el("div.dots", {}, dots),
      $el("button.remove", { textContent: "🗑", onclick: e => this.removeImage(e) }),
      $el("button.close", { textContent: "✖", onclick: () => this.close() }),
      $el("button.prev", { textContent: "❮", onclick: e => this.prevSlide(e) }),
      $el("button.next", { textContent: "❯", onclick: e => this.nextSlide(e) }),
    ]);

    super.show(carousel);
    document.addEventListener("keydown", this.onKeydown, { capture: true });
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    document.activeElement?.blur();
  }

  close() {
    document.removeEventListener("keydown", this.onKeydown, { capture: true });
    document.body.style.overflow = ''; // Restore scrolling
    super.close();
  }
}

app.registerExtension({
  name: "Comfy.ImageGallery",
  init() {
    app.ui.carousel = new ComfyCarousel();
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
        app.ui.carousel.show(this.imgs, imageIndex, src => {
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
