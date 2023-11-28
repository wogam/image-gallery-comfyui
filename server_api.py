import os
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

