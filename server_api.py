import os
import json
import shutil
import folder_paths
from server import PromptServer
from aiohttp import web

async def remove_folder(request):
    data = await request.post()

    dir_type = data.get('type', 'output')
    dir_path = folder_paths.get_directory_by_type(dir_type)
    if dir_path is None:
        return web.Response(status=400)

    if 'subfolder' in data:
        dir_path = os.path.join(dir_path, data['subfolder'])

    foldername = data.get('foldername')
    if foldername is None:
        return web.Response(status=400)
    folder_path = os.path.normpath(os.path.join(dir_path, foldername))
    if os.path.commonpath([folder_path, dir_path]) != os.path.commonpath([dir_path]):
        return web.Response(status=403)

    if not os.path.isdir(folder_path):
        return web.Response(status=404)

    os.rmdir(folder_path)  # Note: This will only work if the directory is empty
    return web.Response(status=204)

PromptServer.instance.routes.post('/gallery/folder/remove')(remove_folder)

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

def get_images_from_directory(directory):
    images = []
    folders = []

    for entry in os.scandir(directory):
        if entry.is_dir():
            folders.append(entry.name)
        elif entry.is_file() and entry.name.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            file_path = os.path.join(directory, entry.name)
            creation_time = os.path.getctime(file_path)
            images.append((f"/view?filename={entry.name}&type=output&subfolder={os.path.relpath(directory, folder_paths.get_output_directory())}", creation_time))

    return images, folders

async def get_gallery_images(request):
    output_dir = folder_paths.get_output_directory()
    subfolder = request.query.get('subfolder', '')
    current_dir = os.path.join(output_dir, subfolder)

    images, folders = get_images_from_directory(current_dir)

    sorted_images = sorted(images, key=lambda x: x[1], reverse=True)
    sorted_image_paths = [img[0] for img in sorted_images]

    response_data = {
        'images': sorted_image_paths,
        'folders': folders,
        'current_folder': subfolder
    }

    return web.Response(text=json.dumps(response_data), content_type='application/json')

PromptServer.instance.routes.get('/gallery/images')(get_gallery_images)

async def move_folder(request):
    data = await request.post()

    dir_type = data.get('type', 'output')
    dir_path = folder_paths.get_directory_by_type(dir_type)
    if dir_path is None:
        return web.Response(status=400)

    if 'subfolder' in data:
        dir_path = os.path.join(dir_path, data['subfolder'])

    foldername = data.get('foldername')
    destination = data.get('destination')
    if foldername is None or destination is None:
        return web.Response(status=400)

    source_path = os.path.normpath(os.path.join(dir_path, foldername))
    dest_path = os.path.normpath(os.path.join(dir_path, destination, foldername))

    if os.path.commonpath([source_path, dir_path]) != os.path.commonpath([dir_path]) or \
       os.path.commonpath([dest_path, dir_path]) != os.path.commonpath([dir_path]):
        return web.Response(status=403)

    if not os.path.isdir(source_path):
        return web.Response(status=404)

    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    shutil.move(source_path, dest_path)
    return web.Response(status=204)

PromptServer.instance.routes.post('/gallery/folder/move')(move_folder)

async def move_image(request):
    data = await request.post()

    dir_type = data.get('type', 'output')
    dir_path = folder_paths.get_directory_by_type(dir_type)
    if dir_path is None:
        return web.Response(status=400)

    if 'subfolder' in data:
        dir_path = os.path.join(dir_path, data['subfolder'])

    filename = data.get('filename')
    destination = data.get('destination')
    if filename is None or destination is None:
        return web.Response(status=400)

    source_path = os.path.normpath(os.path.join(dir_path, filename))
    dest_path = os.path.normpath(os.path.join(dir_path, destination, filename))

    if os.path.commonpath([source_path, dir_path]) != os.path.commonpath([dir_path]) or \
       os.path.commonpath([dest_path, dir_path]) != os.path.commonpath([dir_path]):
        return web.Response(status=403)

    if not os.path.isfile(source_path):
        return web.Response(status=404)

    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    shutil.move(source_path, dest_path)
    return web.Response(status=204)

PromptServer.instance.routes.post('/gallery/image/move')(move_image)
