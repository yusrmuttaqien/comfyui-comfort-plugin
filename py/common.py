"""Shared backend helpers for the comfort plugin.

ComfyUI loads this plugin's `__init__.py` with a module name that contains
path separators (see `nodes.load_custom_node`), so relative imports between
the plugin's own modules do not resolve. Every module here therefore puts the
plugin root on `sys.path` and imports by absolute name.
"""

from typing import Union


class AnyType(str):
    """A string that compares equal to every type. Credit to pythongosssss."""

    def __ne__(self, __value: object) -> bool:
        return False


class FlexibleOptionalInputType(dict):
    """Accepts any number of optional inputs of any type.

    ComfyUI's execution asks this mapping for each connected input key. We
    always claim the key and report the flexible type, so any input of any
    type is accepted, including widget values a frontend node sends under
    names it never declares as slots.
    """

    def __init__(self, type, data: Union[dict, None] = None):
        self.type = type
        self.data = data
        if data is not None:
            for k, v in data.items():
                self[k] = v

    def __getitem__(self, key):
        if self.data is not None and key in self.data:
            return self.data[key]
        return (self.type,)

    def __contains__(self, key):
        return True


any_type = AnyType("*")
