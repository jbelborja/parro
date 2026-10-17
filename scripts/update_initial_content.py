#!/usr/bin/env python3
"""
Fetches the noticias and toma-y-lee JSON feeds (either from a local Hugo build directory
like ./public or from the live GitHub Pages site) and regenerates
mobile-app/src/data/initialContent.json (plain JSON) and
mobile-app/src/data/initialContent.js (ES module).

Run after every successful Hugo build/deploy to keep the bundled fallback fresh.
"""
import argparse
import json
import sys
import urllib.request
import urllib.error
from pathlib import Path

BASE_URL = "https://jbelborja.github.io/parro"
SECTIONS = ["noticias", "toma-y-lee"]
OUT_DIR = Path("mobile-app/src/data")
MAX_ITEMS = 50  # cap per section to keep bundle size reasonable


def get_section_from_local(local_dir: Path, section: str) -> list:
    candidates = [
        local_dir / section / "index.json",
        local_dir / "public" / section / "index.json",
    ]
    file_path = None
    for c in candidates:
        if c.exists():
            file_path = c
            break
    if not file_path:
        print(f"Local file not found in candidates for {section} under {local_dir}")
        return []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        items = [i for i in (data.get("items") or []) if i and i.get("title")]
        print(f"Loaded {len(items)} items from {file_path}")
        return items[:MAX_ITEMS]
    except Exception as e:
        print(f"Error reading local file {file_path}: {e}")
        return []


def fetch_section_from_remote(section: str) -> list:
    url = f"{BASE_URL}/{section}/index.json"
    print(f"Fetching {url} ...")
    try:
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            if resp.status != 200:
                print(f"  WARNING: HTTP {resp.status} for {url}")
                return []
            data = json.loads(resp.read().decode("utf-8"))
            items = [i for i in (data.get("items") or []) if i and i.get("title")]
            print(f"  OK — {len(items)} items from remote")
            return items[:MAX_ITEMS]
    except urllib.error.HTTPError as e:
        print(f"  ERROR HTTP {e.code}: {url}")
        return []
    except Exception as e:
        print(f"  ERROR: {e}")
        return []


def main():
    parser = argparse.ArgumentParser(description="Update initial content bundle from local build or remote JSON.")
    parser.add_argument("--local-dir", type=str, default=None, help="Path to local Hugo build output (e.g. ./public)")
    args = parser.parse_args()

    result = {}
    any_success = False
    local_path = Path(args.local_dir) if args.local_dir else None

    for section in SECTIONS:
        items = []
        if local_path:
            items = get_section_from_local(local_path, section)

        if not items:
            items = fetch_section_from_remote(section)

        result[section] = items
        if items:
            any_success = True

    if not any_success:
        print("ERROR: Could not fetch or read any section. Aborting to avoid overwriting with empty data.")
        sys.exit(1)

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Write plain JSON
    json_path = OUT_DIR / "initialContent.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"Written: {json_path}")

    # Write ES module
    js_path = OUT_DIR / "initialContent.js"
    with open(js_path, "w", encoding="utf-8") as f:
        json_str = json.dumps(result, ensure_ascii=False, indent=2)
        f.write(f"export const initialContent = {json_str};\nexport default initialContent;\n")
    print(f"Written: {js_path}")


if __name__ == "__main__":
    main()
