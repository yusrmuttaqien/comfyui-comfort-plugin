"""
ComfyUI Comfort Plugin
======================
Dual-renderer (Nodes 2.0 Vue + legacy LiteGraph) rework of select
rgthree-comfy features.

Nodes:
  - Power Lora Loader (comfort)
  - Fast Muter / Fast Bypasser (comfort)
  - Node Collector (comfort)
  - Mute / Bypass Repeater (comfort)
  - Mode Relay (comfort)
  - Random Unmuter (comfort)
  - Fast Groups Muter / Bypasser (comfort)
  - Any Router (comfort)
  - Image Comparer (comfort)
"""

import os

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
