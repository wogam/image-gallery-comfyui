import os
import json
import shutil
import folder_paths
from server import PromptServer
from aiohttp import web

import shutil

async def remove_folder(request):
    data = await request.post()
    print("Received folder delete request:", dict(data))

    dir_type = data.get('type', 'output')
    base_dir = folder_paths.get_directory_by_type(dir_type)
    if base_dir is None:
        return web.Response(status=400, text="Invalid directory type")

    current_subfolder = data.get('subfolder', '')
    foldername = data.get('foldername')
    if foldername is None:
        return web.Response(status=400, text="Foldername is missing")

    # Combine the current subfolder path with the folder to be deleted
    folder_path = os.path.normpath(os.path.join(base_dir, current_subfolder, foldername))
    print("Attempting to delete folder:", folder_path)

    if not folder_path.startswith(base_dir):
        return web.Response(status=403, text="Security check failed")

    if not os.path.isdir(folder_path):
        return web.Response(status=404, text=f"Folder not found: {folder_path}")

    try:
        shutil.rmtree(folder_path)
        print("Folder deleted successfully")
        return web.Response(status=204)
    except Exception as e:
        print(f"Error deleting folder: {str(e)}")
        return web.Response(status=500, text=str(e))
    data = await request.post()
    print("Received folder delete request:", dict(data))

    dir_type = data.get('type', 'output')
    base_dir = folder_paths.get_directory_by_type(dir_type)
    if base_dir is None:
        return web.Response(status=400, text="Invalid directory type")

    current_subfolder = data.get('subfolder', '')
    foldername = data.get('foldername')
    if foldername is None:
        return web.Response(status=400, text="Foldername is missing")

    folder_path = os.path.normpath(os.path.join(base_dir, current_subfolder, foldername))
    print("Attempting to delete folder:", folder_path)

    if not folder_path.startswith(base_dir):
        return web.Response(status=403, text="Security check failed")

    if not os.path.isdir(folder_path):
        return web.Response(status=404, text=f"Folder not found: {folder_path}")

    try:
        shutil.rmtree(folder_path)
        print("Folder deleted successfully")
        return web.Response(status=204)
    except Exception as e:
        print(f"Error deleting folder: {str(e)}")
        return web.Response(status=500, text=str(e))

PromptServer.instance.routes.post('/gallery/folder/remove')(remove_folder)

async def remove_image(request):
    data = await request.post()
    print("Received image delete request:", dict(data))

    dir_type = data.get('type', 'output')
    base_dir = folder_paths.get_directory_by_type(dir_type)
    if base_dir is None:
        return web.Response(status=400, text="Invalid directory type")

    current_subfolder = data.get('subfolder', '')
    filename = data.get('filename')
    if filename is None:
        return web.Response(status=400, text="Filename is missing")

    file_path = os.path.normpath(os.path.join(base_dir, current_subfolder, filename))
    print("Attempting to delete file:", file_path)

    if not file_path.startswith(base_dir):
        return web.Response(status=403, text="Security check failed")

    if not os.path.isfile(file_path):
        return web.Response(status=404, text=f"File not found: {file_path}")

    try:
        os.unlink(file_path)
        print("File deleted successfully")
        return web.Response(status=204)
    except Exception as e:
        print(f"Error deleting file: {str(e)}")
        return web.Response(status=500, text=str(e))
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

async def move_items(request):
    data = await request.post()

    dir_type = data.get('type', 'output')
    base_dir = folder_paths.get_directory_by_type(dir_type)
    if base_dir is None:
        return web.Response(status=400, text="Invalid directory type")

    destination = data.get('destination')
    if destination is None:
        return web.Response(status=400, text="Destination is missing")

    items = json.loads(data.get('items', '[]'))
    if not items:
        return web.Response(status=400, text="No items to move")

    for item in items:
        item_type = item.get('type')
        current_subfolder = item.get('subfolder', '')
        name = item.get('name')

        if item_type not in ['folder', 'image'] or name is None:
            return web.Response(status=400, text="Invalid item data")

        source_path = os.path.normpath(os.path.join(base_dir, current_subfolder, name))
        dest_path = os.path.normpath(os.path.join(base_dir, destination, name))

        if os.path.commonpath([source_path, base_dir]) != os.path.commonpath([base_dir]) or \
           os.path.commonpath([dest_path, base_dir]) != os.path.commonpath([base_dir]):
            return web.Response(status=403, text="Security check failed")

        if item_type == 'folder' and not os.path.isdir(source_path):
            return web.Response(status=404, text=f"Folder not found: {source_path}")
        elif item_type == 'image' and not os.path.isfile(source_path):
            return web.Response(status=404, text=f"File not found: {source_path}")

        try:
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            shutil.move(source_path, dest_path)
        except Exception as e:
            return web.Response(status=500, text=f"Error moving item: {str(e)}")

    return web.Response(status=204)


async def move_items(request):
    data = await request.post()
    print("Received move request:", dict(data))

    dir_type = data.get('type', 'output')
    base_dir = folder_paths.get_directory_by_type(dir_type)
    if base_dir is None:
        return web.Response(status=400, text="Invalid directory type")

    destination = data.get('destination', '')
    if destination is None:
        return web.Response(status=400, text="Destination is missing")

    items = json.loads(data.get('items', '[]'))
    if not items:
        return web.Response(status=400, text="No items to move")

    for item in items:
        item_type = item.get('type')
        current_subfolder = item.get('subfolder', '')
        name = item.get('name')

        if item_type not in ['folder', 'image'] or name is None:
            return web.Response(status=400, text=f"Invalid item data: {item}")

        source_path = os.path.normpath(os.path.join(base_dir, current_subfolder, name))
        dest_path = os.path.normpath(os.path.join(base_dir, destination, name))

        print(f"Moving {item_type} from {source_path} to {dest_path}")

        if os.path.commonpath([source_path, base_dir]) != os.path.commonpath([base_dir]) or \
           os.path.commonpath([dest_path, base_dir]) != os.path.commonpath([base_dir]):
            return web.Response(status=403, text=f"Security check failed for {source_path} or {dest_path}")

        if item_type == 'folder' and not os.path.isdir(source_path):
            return web.Response(status=404, text=f"Folder not found: {source_path}")
        elif item_type == 'image' and not os.path.isfile(source_path):
            return web.Response(status=404, text=f"File not found: {source_path}")

        try:
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            shutil.move(source_path, dest_path)
            print(f"Successfully moved {item_type} to {dest_path}")
        except Exception as e:
            print(f"Error moving {item_type}: {str(e)}")
            return web.Response(status=500, text=f"Error moving {item_type} {name}: {str(e)}")

    return web.Response(status=204)

PromptServer.instance.routes.post('/gallery/items/move')(move_items)

async def create_folder(request):
    data = await request.post()
    print("Received folder create request:", dict(data))

    dir_type = data.get('type', 'output')
    base_dir = folder_paths.get_directory_by_type(dir_type)
    if base_dir is None:
        return web.Response(status=400, text="Invalid directory type")

    current_subfolder = data.get('subfolder', '')
    foldername = data.get('foldername')
    if foldername is None:
        return web.Response(status=400, text="Foldername is missing")

    new_folder_path = os.path.normpath(os.path.join(base_dir, current_subfolder, foldername))
    print("Attempting to create folder:", new_folder_path)

    if not new_folder_path.startswith(base_dir):
        return web.Response(status=403, text="Security check failed")

    try:
        os.makedirs(new_folder_path, exist_ok=True)
        print("Folder created successfully")
        return web.Response(status=204)
    except Exception as e:
        print(f"Error creating folder: {str(e)}")
        return web.Response(status=500, text=str(e))

PromptServer.instance.routes.post('/gallery/folder/create')(create_folder)