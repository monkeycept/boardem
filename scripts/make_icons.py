"""Regenerate the PWA icons in public/ (mirrors public/favicon.svg).

Colours are Sanzo Wada's combination 155: Deep Indigo, Benzol Green, Jasper Red.
Usage: python3 scripts/make_icons.py   (needs Pillow)
"""
from pathlib import Path

from PIL import Image, ImageDraw

PUBLIC = Path(__file__).resolve().parent.parent / "public"
DEEP_INDIGO = (5, 18, 48, 255)
JASPER_RED = (235, 83, 36, 255)
BENZOL_GREEN = (0, 151, 141, 255)
BENZOL_DARK = (4, 108, 101, 255)
CREAM = (245, 236, 194, 255)  # Sulpher Yellow


def icon(size: int, rounded: bool, scale: float = 1.0) -> Image.Image:
    ss = size * 4  # supersample for smooth edges
    out = Image.new("RGBA", (ss, ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(out)
    if rounded:
        d.rounded_rectangle([0, 0, ss - 1, ss - 1], radius=int(ss * 0.24), fill=DEEP_INDIGO)
    else:
        d.rectangle([0, 0, ss, ss], fill=DEEP_INDIGO)

    def pt(x: float, y: float):
        return ((50 + (x - 50) * scale) / 100 * ss, (50 + (y - 50) * scale) / 100 * ss)

    cx, cy = pt(68, 34)
    r = 20 / 100 * ss * scale
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=JASPER_RED)
    d.polygon([pt(18, 49), pt(84, 20), pt(47, 58)], fill=CREAM)
    d.polygon([pt(47, 58), pt(84, 20), pt(60, 81)], fill=BENZOL_GREEN)
    d.polygon([pt(47, 58), pt(44, 75), pt(53, 64)], fill=BENZOL_DARK)
    return out.resize((size, size), Image.LANCZOS)


if __name__ == "__main__":
    icon(192, rounded=True).save(PUBLIC / "pwa-192x192.png")
    icon(512, rounded=True).save(PUBLIC / "pwa-512x512.png")
    # Maskable icons get cropped by the OS, so fill edge-to-edge and shrink the artwork.
    icon(512, rounded=False, scale=0.72).save(PUBLIC / "pwa-maskable-512x512.png")
    icon(180, rounded=False).convert("RGB").save(PUBLIC / "apple-touch-icon.png")
    print("icons written to", PUBLIC)
