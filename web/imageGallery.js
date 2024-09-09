import { app } from "/scripts/app.js";
import { $el, ComfyDialog } from "/scripts/ui.js";

const styles = `
* {
  font-family: 'Roboto', sans-serif;
}

:root {
  --breadcrumb-top: 25px;
  --comfy-carousel-z-index: 99999999;
}

.comfy-carousel {
  display: none;
  position: fixed;
  inset: 0;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: var(--comfy-carousel-z-index);
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
  width: 90vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-bottom: 5px;
}

.comfy-carousel-box .slides {
  flex-grow: 1;
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

.comfy-carousel-box .button-container,
.comfy-carousel .button-container {
  position: absolute;
  display: flex;
  gap: 10px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 7px;
}

.comfy-carousel-box .button-container {
  top: 20px;
  right: 20px;
  height: fit-content;
}

.comfy-carousel .button-container {
  bottom: 7px;
  right: 20px;
  padding: 5px;
}

.remove svg {
  width: 32px;
  height: 24px;
  margin-top 0px;
}

.comfy-carousel-box .remove,
.comfy-carousel-box .close,
.comfy-carousel-box .gallery,
.comfy-carousel-box .reset-zoom,
.comfy-carousel-box .load,
.comfy-carousel-box .prev,
.comfy-carousel-box .next,
.comfy-carousel .scroll-to-top,
.comfy-carousel .reload-gallery,
.comfy-carousel .select-images {
  background: transparent;
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  font-size: 20px;
  margin-top: 0px;
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
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
}

.comfy-carousel-box .remove:hover,
.comfy-carousel-box .close:hover,
.comfy-carousel-box .gallery:hover,
.comfy-carousel-box .reset-zoom:hover,
.comfy-carousel-box .load:hover,
.comfy-carousel-box .prev:hover,
.comfy-carousel-box .next:hover,
.comfy-carousel .scroll-to-top:hover,
.comfy-carousel .reload-gallery:hover,
.comfy-carousel .select-images:hover {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.comfy-carousel-box .remove:hover {
  background-color: rgba(255, 105, 97, 0.3);
}

.comfy-carousel-box .gallery:hover {
  background-color: rgba(167, 199, 231, 0.3);
}

.comfy-carousel-box .reset-zoom:hover {
  background-color: rgba(250, 200, 152, 0.3);
}

.comfy-carousel-box .load:hover {
  background-color: rgba(193, 225, 193, 0.3);
}

.comfy-carousel-box .dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  overflow-x: auto;
  white-space: nowrap;
  z-index: calc(var(--comfy-carousel-z-index) + 2);
}

.comfy-carousel-box .reset-zoom {
  right: 220px;
}

.comfy-carousel-box .load {
  right: 170px;
}

.comfy-carousel-box .remove {
  right: 120px;
  width: auto;
  transition: width 0.2s;
}

.comfy-carousel-box .gallery {
  right: 70px;
}

.comfy-carousel-box .close {
  right: 20px;
}

.comfy-carousel-box .prev {
  left: 20px;
}

.comfy-carousel-box .next {
  right: 20px;
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
  z-index: calc(var(--comfy-carousel-z-index) + 3);
}

.comfy-carousel .gallery-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--image-size, 150px), 1fr));
  grid-auto-rows: var(--image-size, 150px);
  gap: 10px;
  padding: 20px;
  height: calc(100vh - 65px);
  width: 90vw;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.8);
  transition: opacity 0.5s ease, transform 0.5s ease;
  opacity: 0;
  margin-top: 4.5%;
  align-content: start;
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
  user-select: none;
  -webkit-user-drag: none;
  margin-top: 10px;
}

.comfy-carousel .gallery-container img:hover {
  transform: scale(1.05);
}

.comfy-carousel .gallery-container img.selected {
  box-shadow: 0 0 0 2px #add8e6;
}

.comfy-carousel .gallery-container img.greyed-out {
  filter: grayscale(60%) brightness(60%);
}

.comfy-carousel .close-gallery {
  position: absolute;
  top: 25px;
  right: 25px;
  background: rgba(0, 0, 0, 0.5);
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
  background: rgba(255, 255, 255, 0.1);
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
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 0 15px;
  appearance: none;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  z-index: calc(var(--comfy-carousel-z-index) + 1);
}

.gallery-size-slider:hover {
  opacity: 1;
}

.gallery-size-slider::-webkit-slider-runnable-track,
.gallery-size-slider::-moz-range-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.gallery-size-slider::-webkit-slider-thumb,
.gallery-size-slider::-moz-range-thumb {
  width: 4px;
  height: 20px;
  background: #ffffff;
  cursor: pointer;
  border-radius: 2px;
  margin-top: -8px;
}

.comfy-carousel .breadcrumb-container {
  position: absolute;
  display: flex;
  flex-wrap: nowrap;
  top: var(--breadcrumb-top);
  left: 5.5%;
  background: rgba(0, 0, 0, 1);
  align-items: center;
  padding: 5px 10px;
  border-radius: 8px;
  margin: 0;
}

.comfy-carousel .breadcrumb-navigation {
  display: flex;
  align-items: center;
}

.comfy-carousel .breadcrumb-navigation:hover {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.comfy-carousel .breadcrumb-navigation button {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: bold;
  margin-right: 5px;
}

.comfy-carousel .breadcrumb-navigation button:hover {
  background: rgba(14, 122, 254, 1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.comfy-carousel .image-count {
  margin-left: 10px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  color: #fff;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: bold;
  border-radius: 8px;
}

.comfy-carousel .image-count:hover {
  background: rgba(255, 255, 255, 0.2);
}

.comfy-carousel .breadcrumb-navigation span.separator {
  margin: 0;
}

.breadcrumb-navigation button:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.breadcrumb-navigation button:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.folder-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: var(--image-size, 150px);
  height: var(--image-size, 150px);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
  margin-top: 10px;
}

.folder-button.greyed-out {
  filter: grayscale(60%) brightness(60%);
  transition: filter 0.3s;
}

.folder-button.selected {
  box-shadow: 0 0 0 2px #add8e6;
}

.folder-button svg {
  width: 50%;
  height: 50%;
}

.folder-button.selected:hover {
  box-shadow: 0 0 0 2px #add8e6;
}

.folder-button:hover {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.folder-text {
  margin-top: 8px;
  font-size: 14px;
  text-align: center;
}

.move-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: calc(var(--comfy-carousel-z-index) + 20);
  display: flex;
  justify-content: center;
  align-items: center;
}

.move-popup {
  background-color: white;
  color: black;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: calc(var(--comfy-carousel-z-index) + 21);
  width: 300px;
  max-height: 80%;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(255, 255, 255, 0.1);
}

.move-popup h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

.folder-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 15px;
}

.folder-list div {
  margin-bottom: 10px;
}

.popup-buttons {
  display: flex;
  justify-content: flex-end;
}

.popup-buttons button {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: none;
  padding: 8px 16px;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  font-weight: bold;
  border-radius: 8px;
  margin-left: 10px;
}

.popup-buttons button:hover {
  background: rgba(14, 122, 254, 1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.popup-buttons button:active {
  transform: scale(0.95);
}

.comfy-carousel .move {
  background: transparent;
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  font-size: 20px;
  margin-top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s, backdrop-filter 0.3s;
  border-radius: 8px;
}

.comfy-carousel .move:hover {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.comfy-carousel .move svg {
  width: 24px;
  height: 24px;
}

.move-popup {
  width: calc(100vw / 3);
  max-height: 80%;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.move-popup .breadcrumb-container {
  display: flex;
  flex-wrap: nowrap;
  background: rgba(0, 0, 0, 0.8) !important;
  align-items: center;
  padding: 5px 10px;
  border-radius: 8px;
  margin: 0;
}

.move-popup .breadcrumb-navigation-button {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: bold;
  margin-right: 5px;
}

.move-popup .breadcrumb-navigation-button:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.move-popup .breadcrumb-navigation-button:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  margin-right: 0; /* Remove the margin from the last breadcrumb */
}

.move-popup .breadcrumb-navigation-button:hover {
  background: rgba(14, 122, 254, 1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.move-popup .separator {
  margin: 0;
}

.folder-dropdown {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: bold;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  appearance: none; /* Remove default styling */
}

.folder-dropdown:hover {
  background: rgba(14, 122, 254, 1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.folder-dropdown option {
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const deleteButtonSVG = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.11686 7.7517C5.53016 7.72415 5.88754 8.03685 5.91509 8.45015L6.37503 15.3493C6.46489 16.6971 6.52892 17.6349 6.66948 18.3406C6.80583 19.025 6.99617 19.3873 7.26958 19.6431C7.54299 19.8989 7.91715 20.0647 8.60915 20.1552C9.32255 20.2485 10.2626 20.25 11.6134 20.25H12.3868C13.7376 20.25 14.6776 20.2485 15.391 20.1552C16.083 20.0647 16.4572 19.8989 16.7306 19.6431C17.004 19.3873 17.1943 19.025 17.3307 18.3406C17.4713 17.6349 17.5353 16.6971 17.6251 15.3493L18.0851 8.45015C18.1126 8.03685 18.47 7.72415 18.8833 7.7517C19.2966 7.77925 19.6093 8.13663 19.5818 8.54993L19.1183 15.5017C19.0328 16.7844 18.9638 17.8206 18.8018 18.6336C18.6334 19.4789 18.347 20.185 17.7554 20.7385C17.1638 21.2919 16.4402 21.5308 15.5856 21.6425C14.7635 21.7501 13.7251 21.7501 12.4395 21.75H11.5607C10.2751 21.7501 9.23664 21.7501 8.4146 21.6425C7.55995 21.5308 6.8364 21.2919 6.2448 20.7385C5.65321 20.185 5.36679 19.4789 5.19839 18.6336C5.03642 17.8205 4.96736 16.7844 4.88186 15.5017L4.41841 8.54993C4.39086 8.13663 4.70357 7.77925 5.11686 7.7517Z" fill="#ffffff"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.3553 2.25004L10.3094 2.25002C10.093 2.24988 9.90445 2.24976 9.72643 2.27819C9.02313 2.39049 8.41453 2.82915 8.08559 3.46084C8.00232 3.62074 7.94282 3.79964 7.87452 4.00496L7.86 4.04858L7.76291 4.33984C7.74392 4.39681 7.73863 4.41251 7.73402 4.42524C7.55891 4.90936 7.10488 5.23659 6.59023 5.24964C6.5767 5.24998 6.56013 5.25004 6.50008 5.25004H3.5C3.08579 5.25004 2.75 5.58582 2.75 6.00004C2.75 6.41425 3.08579 6.75004 3.5 6.75004L6.50865 6.75004L6.52539 6.75004H17.4748L17.4915 6.75004L20.5001 6.75004C20.9143 6.75004 21.2501 6.41425 21.2501 6.00004C21.2501 5.58582 20.9143 5.25004 20.5001 5.25004H17.5001C17.44 5.25004 17.4235 5.24998 17.4099 5.24964C16.8953 5.23659 16.4413 4.90933 16.2661 4.42522C16.2616 4.41258 16.2562 4.39653 16.2373 4.33984L16.1402 4.04858L16.1256 4.00494C16.0573 3.79961 15.9978 3.62073 15.9146 3.46084C15.5856 2.82915 14.977 2.39049 14.2737 2.27819C14.0957 2.24976 13.9072 2.24988 13.6908 2.25002L13.6448 2.25004H10.3553ZM9.14458 4.93548C9.10531 5.04404 9.05966 5.14902 9.00815 5.25004H14.992C14.9405 5.14902 14.8949 5.04405 14.8556 4.9355L14.8169 4.82216L14.7171 4.52292C14.626 4.2494 14.605 4.19363 14.5842 4.15364C14.4745 3.94307 14.2716 3.79686 14.0372 3.75942C13.9927 3.75231 13.9331 3.75004 13.6448 3.75004H10.3553C10.067 3.75004 10.0075 3.75231 9.96296 3.75942C9.72853 3.79686 9.52566 3.94307 9.41601 4.15364C9.39519 4.19363 9.37419 4.24942 9.28302 4.52292L9.18322 4.82234C9.1682 4.86742 9.1565 4.90251 9.14458 4.93548Z" fill="#ffffff"/> </svg>`;

const moveButtonSVG = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M2 12V6.94975C2 6.06722 2 5.62595 2.06935 5.25839C2.37464 3.64031 3.64031 2.37464 5.25839 2.06935C5.62595 2 6.06722 2 6.94975 2C7.33642 2 7.52976 2 7.71557 2.01738C8.51665 2.09229 9.27652 2.40704 9.89594 2.92051C10.0396 3.03961 10.1763 3.17633 10.4497 3.44975L11 4C11.8158 4.81578 12.2237 5.22367 12.7121 5.49543C12.9804 5.64471 13.2651 5.7626 13.5604 5.84678C14.0979 6 14.6747 6 15.8284 6H16.2021C18.8345 6 20.1506 6 21.0062 6.76946C21.0849 6.84024 21.1598 6.91514 21.2305 6.99383C22 7.84935 22 9.16554 22 11.7979V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2.51839 20.1752 2.22937 19.3001 2.10149 18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/> <path d="M2 15C8.44365 15 6.55635 15 13 15M13 15L8.875 12M13 15L8.875 18" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </g> </svg>`;

function parseExifData(exifData) {
  const isLittleEndian = new Uint16Array(exifData.slice(0, 2))[0] === 0x4949;

  function readInt(offset, isLittleEndian, length) {
    let arr = exifData.slice(offset, offset + length);
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
        value = String.fromCharCode(...exifData.slice(valueOffset, valueOffset + numValues - 1));
      }

      result[tag] = value;
    }

    return result;
  }

  return parseIFD(ifdOffset);
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
  let userComment = data[0x9286];
  if (userComment) {
    try {
      return JSON.parse(userComment);
    } catch (e) { }
  }
  return null;
}

async function getWebpMetadata(file) {
  const dataView = await readFile(file);
  if (dataView.getUint32(0) !== 0x52494646 || dataView.getUint32(8) !== 0x57454250) return null;
  let offset = 12;
  while (offset < dataView.byteLength) {
    const chunkType = dataView.getUint32(offset);
    const chunkLength = dataView.getUint32(offset + 4, true);
    if (chunkType == 0x45584946) {
      const data = extractMetadataFromExif(new Uint8Array(dataView.buffer, offset + 8, chunkLength));
      if (data) return data;
    }
    offset += 8 + chunkLength;
  }
  return null;
}

async function getJpegMetadata(file) {
  const dataView = await readFile(file);
  if (dataView.getUint16(0) !== 0xFFD8) return null;
  let offset = 2;
  while (offset < dataView.byteLength) {
    const segmentType = dataView.getUint16(offset);
    if (segmentType == 0xFFD9 || (segmentType & 0xFF00) != 0xFF00) break;
    const segmentLength = dataView.getUint16(offset + 2);
    if (segmentLength < 2) break;
    if (segmentType == 0xFFE1 && segmentLength > 8) {
      const data = extractMetadataFromExif(new Uint8Array(dataView.buffer, offset + 10, segmentLength - 8));
      if (data) return data;
    }
    offset += 2 + segmentLength;
  }
  return null;
}

function getMetadata(file) {
  if (file.type === "image/webp") return getWebpMetadata(file);
  else if (file.type == "image/jpeg") return getJpegMetadata(file);
  else return null;
}

async function handleFile(origHandleFile, file, ...args) {
  const metadata = await getMetadata(file);
  if (metadata && metadata.workflow) app.loadGraphData(metadata.workflow);
  else if (metadata && metadata.prompt) app.loadApiJson(metadata.prompt);
  else return origHandleFile.call(this, file, ...args);
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
    this.currentFolderPath = '';
    this.onKeydown = this.onKeydown.bind(this);
    this.element.classList.replace("comfy-modal", "comfy-carousel");
    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });
    this.isSelectionMode = false;
    this.handleDelete = null;
    this.currentSubfolder = '';
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
    if (!slide) {
      this.element.querySelector('.slides').innerHTML = '<div class="no-images">No images found in this directory.</div>';
      this.element.querySelector('.dots').innerHTML = '';
      return;
    }
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
    this.currentFolderPath = slide.dataset.folderPath || '';
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
            this.loadImage();
            this.close();
          }
        }),
        $el("button.gallery", {
          innerHTML: '',
          onclick: async (e) => {
            if (this.isGalleryCarousel) {
              if (!this.element.querySelector('.gallery-container')) {
                const galleryContainer = await this.loadGalleryImages({ target: { dataset: { subfolder: this.currentFolderPath } } });
                this.scrollToLastViewedImage(galleryContainer);
              }
            } else {
              app.ui.nodeCarousel.close();
              if (!app.ui.galleryCarousel.element.querySelector('.gallery-container')) {
                const galleryContainer = await app.ui.galleryCarousel.loadGalleryImages({ target: { dataset: { subfolder: app.ui.galleryCarousel.currentFolderPath } } });
                app.ui.galleryCarousel.scrollToLastViewedImage(galleryContainer);
              }
            }
          }
        }),
        $el("button.remove", {
          innerHTML: deleteButtonSVG,
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
      const rect = this.getActive().getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const newTranslateX = mouseX - (mouseX - this.translateX * oldScale) * (this.scale / oldScale);
      const newTranslateY = mouseY - (mouseY - this.translateY * oldScale) * (this.scale / oldScale);
      this.translateX = newTranslateX / this.scale;
      this.translateY = newTranslateY / this.scale;
      this.updateZoom();
    });
  }

  async loadGalleryImages(e) {
    console.log("Loading gallery images with subfolder:", e.target.dataset.subfolder);
    if (typeof e.stopPropagation === 'function') e.stopPropagation();

    const subfolder = e.target.dataset.subfolder || '';
    this.currentSubfolder = subfolder;
    const response = await fetch(`/gallery/images?subfolder=${encodeURIComponent(subfolder)}`);
    if (!response.ok) {
      alert("Failed to load gallery images");
      return;
    }
    const { images, folders, current_folder: currentFolder } = await response.json();

    this.currentFolderPath = this.currentSubfolder;

    const breadcrumbContainer = document.createElement('div');
    breadcrumbContainer.className = 'breadcrumb-container';

    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'breadcrumb-navigation';

    const homeButton = document.createElement('button');
    homeButton.textContent = 'Home';
    homeButton.dataset.subfolder = '';
    homeButton.addEventListener('click', () => {
      this.loadGalleryImages({ target: { dataset: { subfolder: '' } } });
    });
    breadcrumb.appendChild(homeButton);

    const pathSegments = currentFolder.split('/');
    pathSegments.forEach((segment, index) => {
      if (segment) {
        const button = document.createElement('button');
        button.textContent = segment;
        button.dataset.subfolder = pathSegments.slice(0, index + 1).join('/');
        button.addEventListener('click', () => {
          this.loadGalleryImages({ target: { dataset: { subfolder: button.dataset.subfolder } } });
        });
        breadcrumb.appendChild(button);
      }
    });

    const imageCount = document.createElement('span');
    imageCount.className = 'image-count';
    imageCount.textContent = `${images.length} images`;

    const updateImageCount = () => {
      if (this.isSelectionMode) {
        const selectedCount = galleryContainer.querySelectorAll('.folder-button.selected, img.selected').length;
        imageCount.textContent = `${selectedCount} selected`;
      } else {
        imageCount.textContent = `${images.length} images`;
      }
    };

    breadcrumbContainer.appendChild(breadcrumb);
    breadcrumbContainer.appendChild(imageCount);

    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'gallery-container';

    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.className = 'scroll-to-top';
    scrollToTopButton.innerHTML = '↑';
    scrollToTopButton.addEventListener('click', () => {
      galleryContainer.scrollTop = 0;
    });

    const updateButtonVisibility = () => {
      const anySelected = galleryContainer.querySelector('.folder-button.selected, img.selected');
      deleteButton.style.display = anySelected ? 'flex' : 'none';
      moveButton.style.display = anySelected ? 'flex' : 'none';
    };

    const selectButton = document.createElement('button');
    selectButton.className = 'select-images';
    selectButton.innerHTML = '&#10003;';
    this.isSelectionMode = false;
    let confirmDelete = false;
    selectButton.addEventListener('click', () => {
      this.isSelectionMode = !this.isSelectionMode;
      if (this.isSelectionMode) {
        selectButton.innerHTML = '&#8212;';
        galleryContainer.querySelectorAll('.folder-button, img').forEach(item => {
          if (!item.classList.contains('selected')) item.classList.add('greyed-out');
        });
        updateButtonVisibility();
      } else {
        selectButton.innerHTML = '&#10003;';
        galleryContainer.querySelectorAll('.folder-button, img').forEach(item => {
          item.classList.remove('greyed-out');
          item.classList.remove('selected');
        });
        updateButtonVisibility();
        confirmDelete = false;
        deleteButton.innerHTML = deleteButtonSVG;
        lastSelectedIndex = -1;
      }
      updateImageCount();
    });

    const moveButton = document.createElement('button');
    moveButton.className = 'move scroll-to-top select-images';
    moveButton.innerHTML = moveButtonSVG;
    moveButton.style.display = 'none';
    let currentPath = this.currentFolderPath || '';
    moveButton.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'move-overlay';

      const popup = document.createElement('div');
      popup.className = 'move-popup';
      popup.innerHTML = `
            <h3>Select destination folder:</h3>
            <div class="breadcrumb-container"></div>
            <div class="folder-list"></div>
            <div class="popup-buttons">
                <button class="ok-button">OK</button>
                <button class="cancel-button">Cancel</button>
            </div>
        `;

      const breadcrumbContainer = popup.querySelector('.breadcrumb-container');
      const folderList = popup.querySelector('.folder-list');
      const okButton = popup.querySelector('.ok-button');
      const cancelButton = popup.querySelector('.cancel-button');

      let currentPath = this.currentFolderPath || '';

      const updateBreadcrumb = (path) => {
        breadcrumbContainer.innerHTML = '';
        const pathSegments = path.split('/').filter(segment => segment !== '');
        pathSegments.unshift('Home');

        pathSegments.forEach((segment, index) => {
          const crumb = document.createElement('button');
          crumb.className = 'breadcrumb-navigation-button';
          crumb.textContent = segment;
          crumb.addEventListener('click', () => {
            if (index === 0) {
              updateFolderList('');
            } else {
              const newPath = pathSegments.slice(1, index + 1).join('/');
              updateFolderList(newPath);
            }
          });
          breadcrumbContainer.appendChild(crumb);
        });

        const addButton = document.createElement('button');
        addButton.className = 'breadcrumb-navigation-button';
        addButton.textContent = '+';
        addButton.addEventListener('click', async () => {
          breadcrumbContainer.removeChild(addButton);
          await showFolderDropdown(path);
        });

        breadcrumbContainer.appendChild(addButton);
      };


      const showFolderDropdown = async (path) => {
        const response = await fetch(`/gallery/images?subfolder=${encodeURIComponent(path)}`);
        if (!response.ok) {
          alert("Failed to load folders");
          return;
        }
        const data = await response.json();
        const folders = data.folders;

        const select = document.createElement('select');
        select.className = 'folder-dropdown';

        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Select a folder';
        defaultOption.value = '';
        select.appendChild(defaultOption);

        const selectedFolders = Array.from(galleryContainer.querySelectorAll('.folder-button.selected'))
          .map(folder => folder.dataset.name);

        folders.forEach(folder => {
          if (!selectedFolders.includes(folder)) {
            const option = document.createElement('option');
            option.value = folder;
            option.textContent = folder;
            select.appendChild(option);
          }
        });

        select.addEventListener('change', (e) => {
          if (e.target.value) {
            updateFolderList(`${path}/${e.target.value}`.replace(/^\//, ''));
          }
        });

        const existingDropdown = breadcrumbContainer.querySelector('.folder-dropdown');
        if (existingDropdown) existingDropdown.remove();

        breadcrumbContainer.appendChild(select);
      };

      const updateFolderList = async (path) => {
        currentPath = path;
        this.currentFolderPath = path;
        updateBreadcrumb(path);
      };

      updateFolderList(currentPath);

      okButton.addEventListener('click', async () => {
        const selectedFolder = currentPath;
        if (selectedFolder !== undefined) {
          const selectedItems = galleryContainer.querySelectorAll('.folder-button.selected, img.selected');
          const itemsToMove = Array.from(selectedItems).map(item => {
            if (item.tagName === 'IMG') {
              const imageParams = new URLSearchParams(item.dataset.src.split("?")[1]);
              return {
                type: 'image',
                subfolder: imageParams.get('subfolder') || '',
                name: imageParams.get('filename')
              };
            } else if (item.classList.contains('folder-button')) {
              const folderPath = item.dataset.subfolder;
              const folderName = item.querySelector('.folder-text').textContent;
              const subfolder = folderPath.replace(`/${folderName}`, '');
              return {
                type: 'folder',
                subfolder: subfolder,
                name: folderName
              };
            }
          });

          try {
            const response = await fetch("/gallery/items/move", {
              method: "POST",
              body: new URLSearchParams({
                type: 'output',
                destination: selectedFolder,
                items: JSON.stringify(itemsToMove)
              }),
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Failed to move items: ${response.statusText}. Server message: ${errorText}`);
            }

            selectedItems.forEach(item => item.remove());
            setTimeout(() => {
              this.loadGalleryImages({ target: { dataset: { subfolder: this.currentFolderPath } } });
            }, 100);

          } catch (error) {
            console.error('Error moving items:', error);
            alert(`Failed to move items. Error: ${error.message}`);
          }
        }
        overlay.remove();
      });

      cancelButton.addEventListener('click', () => {
        overlay.remove();
      });

      overlay.appendChild(popup);
      document.body.appendChild(overlay);
    });

    const reloadButton = document.createElement('button');
    reloadButton.className = 'reload-gallery scroll-to-top select-images';
    reloadButton.innerHTML = '&#x21bb;';
    reloadButton.title = 'Reload gallery';
    reloadButton.addEventListener('click', () => {
      this.loadGalleryImages({ target: { dataset: { subfolder: this.currentSubfolder } } });
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'remove scroll-to-top select-images';
    deleteButton.innerHTML = deleteButtonSVG;
    deleteButton.style.display = 'none';
    this.handleDelete = async () => {
      if (!confirmDelete) {
        deleteButton.innerHTML = 'Confirm &#10003;';
        deleteButton.style.width = 'auto';
        confirmDelete = true;
      } else {
        const selectedItems = galleryContainer.querySelectorAll('.folder-button.selected, img.selected');

        for (const item of selectedItems) {
          try {
            let response;
            let requestData;
            if (item.tagName === 'IMG') {
              const imageParams = new URLSearchParams(item.dataset.src.split("?")[1]);
              requestData = {
                type: 'output',
                subfolder: imageParams.get('subfolder') || '',
                filename: imageParams.get('filename')
              };

              response = await fetch("/gallery/image/remove", {
                method: "POST",
                body: new URLSearchParams(requestData),
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              });
            } else if (item.classList.contains('folder-button')) {
              const folderName = item.querySelector('.folder-text').textContent;
              const subfolder = item.dataset.subfolder.replace(`/${folderName}`, '');
              requestData = {
                type: 'output',
                subfolder: subfolder,
                foldername: folderName
              };

              response = await fetch("/gallery/folder/remove", {
                method: "POST",
                body: new URLSearchParams(requestData),
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              });
            }

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Failed to delete item: ${response.statusText}. Server message: ${errorText}`);
            }

            item.remove();

          } catch (error) {
            console.error('Error deleting item:', error);
            alert(`Failed to delete item: ${error.message}`);
            break;
          }
        }

        // Store the current folder path before reloading
        const currentFolderPath = this.currentSubfolder;
        console.log("Current folder path before reload:", currentFolderPath);

        confirmDelete = false;
        deleteButton.innerHTML = deleteButtonSVG;
        this.isSelectionMode = false;
        selectButton.innerHTML = '&#10003;';
        galleryContainer.querySelectorAll('.folder-button, img').forEach(item => {
          item.classList.remove('greyed-out');
          item.classList.remove('selected');
        });
        updateButtonVisibility();
        lastSelectedIndex = -1;
        updateImageCount();

        // Reload the gallery with the stored folder path
        setTimeout(() => {
          console.log("Reloading gallery with subfolder:", currentFolderPath);
          this.loadGalleryImages({ target: { dataset: { subfolder: currentFolderPath } } });
        }, 100);
      }
    };



    deleteButton.addEventListener('click', this.handleDelete);

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

      const folderIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      folderIcon.setAttribute("width", "40");
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

      folderButton.appendChild(folderIcon);

      const folderText = document.createElement('span');
      folderText.textContent = folder;
      folderText.className = 'folder-text';
      folderButton.appendChild(folderText);

      folderButton.dataset.subfolder = currentFolder ? `${currentFolder}/${folder}` : folder;
      folderButton.dataset.name = folder;
      folderButton.dataset.type = 'folder';

      folderButton.addEventListener('click', (e) => {
        e.stopPropagation();

        if (this.isSelectionMode) {
          folderButton.classList.toggle('selected');
          folderButton.classList.toggle('greyed-out');

          const anySelected = galleryContainer.querySelector('.folder-button.selected, img.selected');
          updateButtonVisibility();
          updateImageCount();
        } else {
          this.loadGalleryImages({ target: folderButton });
        }
      });

      galleryContainer.appendChild(folderButton);
    });

    images.forEach((src, index) => {
      const img = new Image();
      img.dataset.src = src;
      img.alt = `Gallery image ${index + 1}`;
      img.addEventListener('click', (e) => {
        if (this.isSelectionMode) {
          const currentIndex = index;

          if (e.shiftKey && lastSelectedIndex !== -1) {
            const start = Math.min(lastSelectedIndex, currentIndex);
            const end = Math.max(lastSelectedIndex, currentIndex);

            for (let i = start; i <= end; i++) {
              const imgToSelect = galleryContainer.children[folders.length + i];
              imgToSelect.classList.add('selected');
              imgToSelect.classList.remove('greyed-out');
            }
          } else {
            img.classList.toggle('selected');
            img.classList.toggle('greyed-out');
            lastSelectedIndex = currentIndex;
          }

          const anySelected = galleryContainer.querySelector('img.selected');
          updateButtonVisibility();
          updateImageCount();
        } else {
          this.lastViewedIndex = index;
          this.showLargeView(images, index, currentFolder);
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
      if (this.isSelectionMode) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
      }
    });

    galleryContainer.addEventListener('mousemove', (e) => {
      if (isDragging && this.isSelectionMode) {
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

            const anySelected = galleryContainer.querySelector('img.selected');
            updateButtonVisibility();
            updateImageCount();
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
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(moveButton);
    buttonContainer.appendChild(selectButton);
    buttonContainer.appendChild(reloadButton);
    buttonContainer.appendChild(scrollToTopButton);
    this.element.appendChild(breadcrumbContainer);
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

    await Promise.all(immediateLoadPromises);

    updateImageSize();

    return galleryContainer;
  }

  showLargeView(images, activeIndex, currentFolder) {
    this.element.innerHTML = '';
    const slides = images.map(src => {
      const img = new Image();
      img.src = src;
      img.dataset.folderPath = currentFolder;
      return img;
    });
    this.setupCarousel(slides, activeIndex);
    this.scrollToImage(activeIndex);
  }

  async removeImage(e) {
    e.stopPropagation();
    if (!confirm("Remove this image?")) return;
    const active = this.getActive();
    const response = await fetch("/gallery/image/remove", {
      method: "POST",
      body: active.src.split("?")[1],
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    if (!response.ok) {
      alert(`Failed removing image, server responded with: ${response.statusText}`);
      return;
    }
    const newActive = active.nextElementSibling || active.previousElementSibling;
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
    const active = this.getActive();
    const prev = active.previousElementSibling || active.parentNode.lastElementChild;
    this.selectImage(prev);
    this.lastViewedIndex = [...active.parentNode.children].indexOf(prev);
  }

  nextSlide(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const active = this.getActive();
    const next = active.nextElementSibling || active.parentNode.firstElementChild;
    this.selectImage(next);
    this.lastViewedIndex = [...active.parentNode.children].indexOf(next);
  }

  onKeydown(e) {
    e.preventDefault();
    e.stopPropagation();
    switch (e.key) {
      case "Escape":
        this.close();
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
      case "Delete":
        const activeImage = this.getActive();
        if (activeImage && !this.element.querySelector('.gallery-container')) {
          // Simulate a click event on the remove button
          const removeButton = this.element.querySelector('button.remove');
          if (removeButton) {
            const syntheticEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
            removeButton.dispatchEvent(syntheticEvent);
          }
        } else if (this.element.querySelector('.gallery-container') && this.isSelectionMode && this.element.querySelector('.folder-button.selected, img.selected')) {
          this.handleDelete();
        }
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
    }, 500);
  }
}

app.registerExtension({
  name: "Comfy.ImageGallery",

  init() {
    const { ui } = app;
    ui.galleryCarousel = new ComfyCarousel();
    ui.nodeCarousel = new ComfyCarousel();
    ui.galleryCarousel.initializeGallerySize();

    const clearButton = document.querySelector('button[title="Clears current workflow"]');
    if (!clearButton) {
      console.warn("Clear button not found. Gallery icon couldn't be added.");
      return;
    }

    const galleryButton = document.createElement('button');
    galleryButton.className = 'comfyui-button';
    galleryButton.title = 'View Gallery';
    galleryButton.onclick = (e) => {
      ui.galleryCarousel.loadGalleryImages(e);
      console.log("ComfyCarousel initialized");
    };

    galleryButton.appendChild(createGallerySVG());
    clearButton.parentNode.insertBefore(galleryButton, clearButton.nextSibling);
  },

  async setup() {
    const input = document.getElementById("comfy-file-input");
    if (!input) return;

    let types = input.getAttribute("accept")?.split(",").map(t => t.trim()) || [];
    ["image/webp", "image/jpeg"].forEach(type => {
      if (!types.includes(type)) types.push(type);
    });
    input.setAttribute("accept", types.join(","));

    const origHandleFile = app.handleFile;
    app.handleFile = function (...args) {
      handleFile.call(this, origHandleFile, ...args);
    };
  },

  beforeRegisterNodeDef(nodeType, nodeData) {
    const isImageClick = (node, pos) => {
      let imageY = node.imageOffset || calculateImageY(node);
      return pos[1] >= imageY;
    };

    const calculateImageY = (node) => {
      if (node.widgets?.length) {
        const widget = node.widgets[node.widgets.length - 1];
        return widget.last_y + (widget.computeSize ? widget.computeSize()[1] + 4 : widget.computedHeight || LiteGraph.NODE_WIDGET_HEIGHT + 4);
      }
      return node.computeSize()[1];
    };

    const origOnDblClick = nodeType.prototype.onDblClick;
    nodeType.prototype.onDblClick = function (e, pos, ...args) {
      if (this.imgs?.length && isImageClick(this, pos)) {
        const imageIndex = this.imageIndex ?? this.overIndex ?? 0;
        app.ui.nodeCarousel.show(this.imgs.map(img => img.src), imageIndex, (src) => {
          const index = this.imgs.findIndex(image => image.src === src);
          if (index >= 0) {
            this.imgs.splice(index, 1);
            this.imageIndex = this.imgs.length ? this.imageIndex % this.imgs.length : null;
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
