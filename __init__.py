"""
ComfyUI Comfort Plugin
======================
Dual-renderer (Nodes 2.0 Vue + legacy LiteGraph) rework of select
rgthree-comfy features.

M1: Power Lora Loader (comfort)
"""

import os

import aiohttp

from server import PromptServer
from aiohttp import web

from .py.power_lora_loader import ComfortPowerLoraLoader
from .py.any_router import ComfortAnyRouter
from .py.image_comparer import ComfortImageComparer

NODE_CLASS_MAPPINGS = {
    ComfortPowerLoraLoader.NAME: ComfortPowerLoraLoader,
    ComfortAnyRouter.NAME: ComfortAnyRouter,
    ComfortImageComparer.NAME: ComfortImageComparer,
}

WEB_DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web")
EXTENSION_WEB_DIRS = [WEB_DIRECTORY]

__all__ = ["NODE_CLASS_MAPPINGS", "WEB_DIRECTORY", "EXTENSION_WEB_DIRS"]

# ---------------------------------------------------------------------------
# NInfer proxy
# ---------------------------------------------------------------------------
# The ComfyUI frontend (browser) and NInfer are cross-origin, so the browser
# can't call NInfer directly without CORS. These two routes relay GET/POST from
# the frontend to whatever NInfer URL the user configured, and pass back the
# real status code + body (so e.g. `409 model_busy` reaches the frontend as a
# 409). The frontend supplies the full target URL; this is a local tool, so a
# generic forwarder is fine.

_NINFER_ROUTES = PromptServer.instance.routes
_NINFER_TIMEOUT = aiohttp.ClientTimeout(total=180)


@_NINFER_ROUTES.get("/comfort/ninfer/forward")
async def comfort_ninfer_forward_get(request):
    url = request.query.get("url")
    if not url:
        return web.json_response({"error": "missing url"}, status=400)
    async with aiohttp.ClientSession(timeout=_NINFER_TIMEOUT) as session:
        async with session.get(url) as resp:
            text = await resp.text()
            return web.Response(
                body=text,
                status=resp.status,
                content_type=resp.headers.get("Content-Type", "application/json"),
            )


@_NINFER_ROUTES.post("/comfort/ninfer/forward")
async def comfort_ninfer_forward_post(request):
    try:
        data = await request.json()
    except Exception:
        return web.json_response({"error": "bad json"}, status=400)
    url = data.get("url")
    if not url:
        return web.json_response({"error": "missing url"}, status=400)
    async with aiohttp.ClientSession(timeout=_NINFER_TIMEOUT) as session:
        async with session.post(url, json=data.get("body") or {}) as resp:
            text = await resp.text()
            return web.Response(
                body=text,
                status=resp.status,
                content_type=resp.headers.get("Content-Type", "application/json"),
            )
