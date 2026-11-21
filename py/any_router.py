"""Any Router (comfort) — backend.

A multi-input "any" node that routes the selected input through to a single
any-type output. The frontend supplies any number of ``any_*`` inputs (each of
type ``*``/Any) plus a ``selection`` combo.

Selection modes:
  - ``non_empty``: first ``any_*`` input that is not None wins (decided here).
  - ``active_source``: the frontend strips all but the first input whose source
    node is active (not muted / not bypassed) before the prompt is built, so the
    backend simply returns the one remaining input.

Re-worked from rgthree-comfy's Any Switch (MIT,
https://github.com/rgthree/rgthree-comfy).
"""

import os
import sys as _sys

_sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from py.common import FlexibleOptionalInputType, any_type


def _is_none(value) -> bool:
    """Treat None as empty. (Context dicts are handled by ComfyUI upstream.)"""
    return value is None


NAME = "Any Router (comfort)"
CATEGORY = "comfort"


class ComfortAnyRouter:
    """Route one of several any-type inputs to a single any output."""

    NAME = NAME
    CATEGORY = CATEGORY

    RETURN_TYPES = (any_type,)
    RETURN_NAMES = ("*",)
    FUNCTION = "route"

    DESCRIPTION = (
        "Routes the selected input to a single Any output. "
        "Selection: 'non_empty' picks the first non-empty input; "
        "'active_source' picks the first input whose source node is active "
        "(not muted / not bypassed)."
    )

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "selection": [
                    ["non_empty", "active_source"],
                    {"default": "non_empty"},
                ],
            },
            "optional": FlexibleOptionalInputType(any_type),
        }

    def route(self, selection="non_empty", **kwargs):
        """Return the first non-empty ``any_*`` input.

        For ``active_source`` the frontend has already stripped all but the
        chosen input, so the same "first non-empty" rule yields it.
        """
        for key, value in kwargs.items():
            if key.startswith("any_") and not _is_none(value):
                return (value,)
        return (None,)
