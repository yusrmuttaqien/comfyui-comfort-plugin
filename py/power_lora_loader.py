"""Power Lora Loader (comfort) — backend.

Reworked from rgthree-comfy (MIT, https://github.com/rgthree/rgthree-comfy).
The frontend sends one `loras` input: a list of row dicts
``{lora, on, strength, strengthTwo?}``. Rows are applied in order.
"""

from typing import Optional

import folder_paths
from nodes import LoraLoader

NAME = "Power Lora Loader (comfort)"
CATEGORY = "comfort"


def _get_lora_by_filename(filename: str) -> Optional[str]:
    """Resolve a lora filename to its full path, or None."""
    if not filename:
        return None
    full = folder_paths.get_full_path("loras", filename)
    return full


class ComfortPowerLoraLoader:
    """Load multiple LoRAs onto a model/CLIP in one condensed node."""

    NAME = NAME
    CATEGORY = CATEGORY

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {},
            "optional": {
                "model": ("MODEL",),
                "clip": ("CLIP",),
            },
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
            lora = _get_lora_by_filename(lora_name)
            if lora is None:
                continue
            if strength_model == 0 and strength_clip == 0:
                continue
            model, clip = LoraLoader().load_lora(
                model, clip, lora, strength_model, strength_clip
            )
        return (model, clip)
