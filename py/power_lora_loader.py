"""Power Lora Loader (comfort) — backend.

Reworked from rgthree-comfy (MIT, https://github.com/rgthree/rgthree-comfy).
The frontend sends one `loras` input holding a list of row dicts
``{lora, on, strength, strengthTwo?}``, wrapped by the frontend as
``{"__value__": [...]}``. Rows are applied in order, each through the same
LoraLoader the native Load LoRA node uses.
"""

import logging
import os
import sys as _sys
from typing import Optional

import folder_paths
from nodes import LoraLoader

_sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from py.common import FlexibleOptionalInputType, any_type

NAME = "Power Lora Loader (comfort)"
CATEGORY = "comfort"


def _get_lora_by_filename(name: str) -> Optional[str]:
    """Return the `loras` entry matching `name`, or None.

    The result is a ComfyUI model name (for example `moss/x.safetensors`), never
    an absolute path: LoraLoader.load_lora resolves its argument itself, and a
    second resolution of an absolute path cannot succeed. Matches rgthree-comfy,
    whose get_lora_by_filename returns an entry of get_filename_list("loras").
    """
    if not name:
        return None
    known = folder_paths.get_filename_list("loras") or []
    if name in known:
        return name
    base = os.path.splitext(name)[0]
    for candidate in known:
        if os.path.splitext(candidate)[0] == base:
            return candidate
    logging.warning(
        "%s: lora %r is not in the loras folders, the row is skipped.", NAME, name
    )
    return None


class ComfortPowerLoraLoader:
    """Load multiple LoRAs onto a model/CLIP in one condensed node."""

    NAME = NAME
    CATEGORY = CATEGORY

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {},
            # The frontend sends the rows as a widget input named loras, which
            # is not a declared slot, so the optional mapping must accept any
            # key. Shared with py/any_router.py via py/common.py.
            "optional": FlexibleOptionalInputType(any_type, data={
                "model": ("MODEL",),
                "clip": ("CLIP",),
            }),
            "hidden": {},
        }

    RETURN_TYPES = ("MODEL", "CLIP")
    RETURN_NAMES = ("MODEL", "CLIP")
    FUNCTION = "load_loras"

    DESCRIPTION = (
        "Condensed multi-LoRA loader. The `loras` input is supplied by the "
        "frontend as a list of {lora, on, strength, strengthTwo?} rows."
    )

    def load_loras(self, model=None, clip=None, loras=None, **kwargs):
        # The frontend wraps an array widget value in {"__value__": [...]}, because
        # a bare array in a prompt means a node link. ComfyUI unwraps that only for
        # inputs declared as keys of the optional mapping, and `loras` is not one of
        # them, so unwrap it here.
        if isinstance(loras, dict):
            loras = loras.get("__value__", loras)
        for value in loras or []:
            if not isinstance(value, dict):
                continue
            if not value.get("on"):
                continue
            lora_name = value.get("lora")
            strength_model = value.get("strength", 1.0)
            strength_clip = value.get("strengthTwo")
            if strength_clip is None:
                strength_clip = strength_model
            if model is None:
                continue
            if strength_model == 0 and strength_clip == 0:
                continue
            lora = _get_lora_by_filename(lora_name)
            if lora is None:
                continue
            model, clip = LoraLoader().load_lora(
                model, clip, lora, strength_model, strength_clip
            )
        return (model, clip)
