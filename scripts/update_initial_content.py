#!/usr/bin/env python3
"""
Fetches the live noticias and toma-y-lee JSON feeds from GitHub Pages
and regenerates mobile-app/src/data/initialContent.json (plain JSON)
and mobile-app/src/data/initialContent.js (ES module).

Run after every successful Hugo deploy to keep the bundled fallback fresh.
"""
import json
import sys
import urllib.request
import urllib.error
from pathlib import Path

BASE_URL = "https://jbelborja.github.io/parro"
SECTIONS = ["noticias", "toma-y-lee"]
OUT_DIR = Path("mobile-app/src/data")
MAX_ITEMS = 50  # cap per section to keep bundle size reasonable


def fetch_section(section: str) -> list:
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
            print(f"  OK — {len(items)} items")
            return items[:MAX_ITEMS]
    except urllib.error.HTTPError as e:
        print(f"  ERROR HTTP {e.code}: {url}")
        return []
    except Exception as e:
        print(f"  ERROR: {e}")
        return []


def main():
    result = {}
    any_success = False

    for section in SECTIONS:
        items = fetch_section(section)
        result[section] = items
        if items:
            any_success = True

    if not any_success:
        print("ERROR: Could not fetch any section. Aborting to avoid overwriting with empty data.")
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
