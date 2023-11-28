import { app } from "/scripts/app.js";
import { $el, ComfyDialog } from "/scripts/ui.js";

var styles = `
.comfy-carousel {
    display: none; /* Hidden by default */
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0%;
    left: 0%;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.8);
    z-index: 9999;
}

.comfy-carousel-box {
    margin: 0 auto 20px;
    text-align: center;
}

.comfy-carousel-box .slides {
    position: relative;
}

.comfy-carousel-box .slides img {
    display: none;
    max-height: 90vh;
    max-width: 90vw;
    margin: auto;
}

.comfy-carousel-box .slides img.shown {
    display: block;
}

.comfy-carousel-box .remove:before,
.comfy-carousel-box .prev:before,
.comfy-carousel-box .next:before {
    font-size: 100px;
    position: absolute;
    cursor: pointer;
}

.comfy-carousel-box .remove:before {
  content: '🗑';
  color: #f00;
  right: 0;
  top: 0;
}

.comfy-carousel-box .prev:before {
    content: '❮';
    color: #fff;
    left: 0;
    top: 35%;
}

.comfy-carousel-box .next:before {
    content: '❯';
    color: #fff;
    right: 0;
    top: 35%;
}

.comfy-carousel-box .dots img {
    height: 32px;
    margin: 8px 0 0 8px;
    opacity: 0.6;
}

.comfy-carousel-box .dots img:hover {
    opacity: 0.8;
}

.comfy-carousel-box .dots img.active {
    opacity: 1;
}
`

var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

class ComfyCarousel extends ComfyDialog {
  constructor() {
    super();
    this.element.classList.remove("comfy-modal");
    this.element.classList.add("comfy-carousel");
    this.element.addEventListener('click', (e) => {
      this.close();
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
    slide._dot.classList.toggle('active');
  }
  async removeImage(e) {
    e.stopPropagation();

    if (!confirm("Remove this image?"))
      return;

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

    if (newActive)
      this.selectImage(newActive);
    else
      this.close();
  }
  prevSlide(e) {
    e.stopPropagation();

    let active = this.getActive();
    this.selectImage(active.previousElementSibling || active.parentNode.lastElementChild);
  }
  nextSlide(e) {
    e.stopPropagation();

    let active = this.getActive();
    this.selectImage(active.nextElementSibling || active.parentNode.firstElementChild);
  }
  onKeydown(e) {
    if (e.key == "Escape")
      this.close();
    else if (e.key == "Delete")
      this.removeImage(e);
    else if (e.key == "ArrowLeft")
      this.prevSlide(e);
    else if (e.key == "ArrowRight")
      this.nextSlide(e);
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

      if (slides.length - 1 == activeIndex)
        this.selectImage(slide);
    }

    const carousel = $el("div.comfy-carousel-box", {  }, [
      $el("div.slides", {  }, slides),
      $el("div.dots", {  }, dots),
      $el("a.remove", { $: el => el.addEventListener('click', e => this.removeImage(e)), }),
      $el("a.prev", { $: el => el.addEventListener('click', e => this.prevSlide(e)), }),
      $el("a.next", { $: el => el.addEventListener('click', e => this.nextSlide(e)), }),
    ]);
    super.show(carousel);

    document.addEventListener("keydown", this.onKeydown);
    document.activeElement?.blur();
  }
  close() {
    document.removeEventListener("keydown", this.onKeydown);
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
      // This follows the logic of getImageTop() in ComfyUI
      let imageY;
      if (node.imageOffset)
        imageY = node.imageOffset;
      else if (node.widgets?.length) {
        const widget = node.widgets[node.widgets.length - 1];
        imageY = widget.last_y;
        if (widget.computeSize)
          imageY += widget.computeSize()[1] + 4;
        else if (widget.computedHeight)
          imageY += widget.computedHeight;
        else
          imageY += LiteGraph.NODE_WIDGET_HEIGHT + 4;
      } else
        imageY = node.computeSize()[1];

      return pos[1] >= imageY;
    }

    const origOnDblClick = nodeType.prototype.onDblClick;
    nodeType.prototype.onDblClick = function (e, pos, ...args) {
      if (this.imgs && this.imgs.length && isImageClick(this, pos)) {
        let imageIndex = 0;
        if (this.imageIndex !== null)
          imageIndex = this.imageIndex;
        else if (this.overIndex !== null)
          imageIndex = this.overIndex;
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
      }

      if (origOnDblClick)
        origOnDblClick.call(this, e, pos, ...args);
    }
  },
});
