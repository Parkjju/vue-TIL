#!/usr/bin/env python3
import json
import subprocess
import sys
import os

data = json.loads(sys.stdin.read())
cmd = data.get("tool_input", {}).get("command", "")

if "git push" not in cmd or "gh-pages" in cmd:
    sys.exit(0)

repo_dir = "/Users/parkjju/Desktop/vue-TIL"
script = os.path.join(repo_dir, "docs/.vuepress/index_new_pages.py")
result = subprocess.run(["python3", script], cwd=repo_dir)
sys.exit(result.returncode)
