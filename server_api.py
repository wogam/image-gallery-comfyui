import os
import json
import folder_paths
from server import PromptServer
from aiohttp import web

async def remove_image(request):
    data = await request.post()

    dir_type = data.get('type', 'output')
    dir_path = folder_paths.get_directory_by_type(dir_type)
    if dir_path is None:
        return web.Response(status=400)

    if 'subfolder' in data:
        dir_path = os.path.join(dir_path, data['subfolder'])

    filename = data.get('filename')
    if filename is None:
        return web.Response(status=400)
    file_path = os.path.normpath(os.path.join(dir_path, filename))
    if os.path.commonpath([file_path, dir_path]) != os.path.commonpath([dir_path]):
        return web.Response(status=403)

    if not os.path.isfile(file_path):
        return web.Response(status=404)

    os.unlink(file_path)
    return web.Response(status=204)

PromptServer.instance.routes.post('/gallery/image/remove')(remove_image)

async def get_gallery_images(request):
    output_dir = folder_paths.get_output_directory()
    images = []

    for filename in os.listdir(output_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            file_path = os.path.join(output_dir, filename)
            creation_time = os.path.getctime(file_path)
            images.append((f"/view?filename={filename}&type=output", creation_time))

    # Sort images based on creation time (oldest to newest)
    sorted_images = sorted(images, key=lambda x: x[1], reverse=True)
    # Extract only the image paths from the sorted list
    sorted_image_paths = [img[0] for img in sorted_images]

    return web.Response(text=json.dumps(sorted_image_paths), content_type='application/json')

PromptServer.instance.routes.get('/gallery/images')(get_gallery_images)
