#!/usr/bin/env python3

import subprocess
import pprint
import os
from pathlib import Path

top = Path().parent.parent.resolve()
lua_vscripts_dir = top / "game/scripts/vscripts"
lua_paths = lua_vscripts_dir.rglob("*.lua")

def is_derived_from_ts(path: os.PathLike):
    with open(path, "r") as f:
        first_line = f.readline()
        return first_line.startswith('local ____lualib')

derived_lua_files = [path for path in lua_paths if is_derived_from_ts(path)]
for f in derived_lua_files:
    subprocess.run(f"git rm --cached {f.relative_to(top)}".split())
