"""Image Comparer (comfort) — backend.

Compares two images with a wipe slider. Connect an image to ``image_left`` and
another to ``image_right``; the node temp-saves both and reports their URLs so
the frontend can wipe between them.

Re-worked from rgthree-comfy's Image Comparer (MIT,
https://github.com/rgthree/rgthree-comfy) and the native ComfyUI ImageCompare.
Unlike both (rgthree is canvas-drawn / LiteGraph-only; the native widget is
Vue-only), the comfort version is a DOM widget that renders in both the legacy
LiteGraph and Nodes 2.0 (Vue) renderers.
"""

from nodes import PreviewImage

NAME = "Image Comparer (comfort)"
CATEGORY = "comfort"


class ComfortImageComparer(PreviewImage):
    """Saves both images (to the temp dir) and reports their URLs."""

    NAME = NAME
    CATEGORY = CATEGORY
    FUNCTION = "compare_images"
    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("image",)
    OUTPUT_NODE = True
    DESCRIPTION = "Compares two images with a wipe slider."

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {},
            "optional": {
                "image_left": ("IMAGE",),
                "image_right": ("IMAGE",),
            },
            "hidden": {
                "prompt": "PROMPT",
                "extra_pnginfo": "EXTRA_PNGINFO",
            },
        }

    def compare_images(
        self,
        image_left=None,
        image_right=None,
        prompt=None,
        extra_pnginfo=None,
    ):
        result = {"ui": {"left_images": [], "right_images": []}}
        if image_left is not None and len(image_left) > 0:
            result["ui"]["left_images"] = self.save_images(
                image_left, "comfort.compare.left", prompt, extra_pnginfo
            )["ui"]["images"]
        if image_right is not None and len(image_right) > 0:
            result["ui"]["right_images"] = self.save_images(
                image_right, "comfort.compare.right", prompt, extra_pnginfo
            )["ui"]["images"]
        # Passthrough so a link from the IMAGE output keeps working.
        result["result"] = (image_left if image_left is not None else image_right,)
        return result
