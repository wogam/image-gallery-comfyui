# Image Gallery and Carousel

A web-based application for displaying, managing, and interacting with images. This app provides a seamless experience for browsing image collections and viewing them in a full-screen carousel.

## Features

### Image Carousel
- **Full-Screen View**: Enhanced viewing experience with full-screen image display.
- **Zoom and Pan**: Smooth zooming and panning for detailed exploration.
- **Keyboard Navigation**: Use arrow keys to navigate.

### Image Gallery
- **Thumbnail View**: Browse images in a grid layout with lazy loading for performance.
- **Folder Navigation**: Easily navigate through folders and subfolders.
- **Fodler Management**: Create new folders, folders from selectiona and delete folders. 

### Metadata Extraction
- **EXIF Data Parsing**: Extracts metadata from JPEG and WebP images.
- **Workflow Integration**: Load workflows from metadata into the app.

### Image Management
- **Selection and Batch Operations**: Select multiple images or folders for moving or deleting.

### User Interface Enhancements
- **Dynamic Breadcrumbs**: Track and navigate folder paths effortlessly.
- **Resizable Thumbnails**: Adjust thumbnail size with a slider for a customized view.
- **Interactive Buttons**: Intuitive controls for zooming, loading, and gallery toggling.

Double click on image to open gallery view or use the gallery icon to browse previous generations in the new ComfyUI frontend.




Image View             |  Gallery View
:-------------------------:|:-------------------------:
![image](https://github.com/user-attachments/assets/ef65ee7a-c7a3-4486-8057-d947eddeea7a)   |  ![image](https://github.com/user-attachments/assets/11f51ee9-b930-4026-95dc-f136436bfe21)


## Installation

To install, clone this repository into `ComfyUI/custom_nodes` folder with `git clone https://github.com/palant/image-gallery-comfyui` and restart ComfyUI.

## Keyboard shortcuts

| Key         | Function                             |
|-------------|--------------------------------------|
| Left arrow  | Display previous image               |
| Right arrow | Display next image                   |
| D           | Reset view                           |
| G           | Back to gallery                      |
| O           | Open workflow from current image      |
| Del         | Remove the currently displayed image |
| Esc         | Close gallery view                   |
