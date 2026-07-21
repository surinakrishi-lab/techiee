"""
Convert all PNG, JPG, JPEG images to WEBP
Same filename, same location — only extension changes to .webp
Original files are deleted after successful conversion.
"""

import os
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow not found. Installing...")
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow"])
    from PIL import Image

FOLDER = Path(__file__).parent / "images"
EXTENSIONS = {".png", ".jpg", ".jpeg"}

converted = 0
failed = 0

for file in sorted(FOLDER.rglob("*")):
    if file.suffix.lower() in EXTENSIONS:
        webp_path = file.with_suffix(".webp")
        try:
            with Image.open(file) as img:
                img.save(webp_path, "WEBP", quality=90)
            file.unlink()  # delete original
            print(f"✓  {file.name}  →  {webp_path.name}")
            converted += 1
        except Exception as e:
            print(f"✗  {file.name}  ERROR: {e}")
            failed += 1

print(f"\nDone! {converted} converted, {failed} failed.")
