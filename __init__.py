"""
ComfyUI Comfort Plugin
======================
Dual-renderer (Nodes 2.0 Vue + legacy LiteGraph) rework of select
rgthree-comfy features.

M1: Power Lora Loader (comfort)
"""

import os

from .py.power_lora_loader import ComfortPowerLoraLoader

NODE_CLASS_MAPPINGS = {
    ComfortPowerLoraLoader.NAME: ComfortPowerLoraLoader,
}

WEB_DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web")
EXTENSION_WEB_DIRS = [WEB_DIRECTORY]

__all__ = ["NODE_CLASS_MAPPINGS", "WEB_DIRECTORY", "EXTENSION_WEB_DIRS"]
