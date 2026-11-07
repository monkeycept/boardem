"""Regenerate the PWA icons in public/ (mirrors public/favicon.svg).

Usage: python3 scripts/make_icons.py   (needs Pillow)
"""
from pathlib import Path

from PIL import Image, ImageDraw

PUBLIC = Path(__file__).resolve().parent.parent / "public"
VIOLET = (139, 92, 246)
CYAN = (34, 211, 238)


def gradient(size: int) -> Image.Image:
    img = Image.new("RGB", (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * (size - 1))
            px[x, y] = tuple(round(a + (b - a) * t) for a, b in zip(VIOLET, CYAN))
    return img


def icon(size: int, rounded: bool, plane_scale: float = 1.0) -> Image.Image:
    ss = size * 4  # supersample for smooth edges
    bg = gradient(ss)
    mask = Image.new("L", (ss, ss), 0)
    d = ImageDraw.Draw(mask)
    if rounded:
        d.rounded_rectangle([0, 0, ss - 1, ss - 1], radius=int(ss * 0.24), fill=255)
    else:
        d.rectangle([0, 0, ss, ss], fill=255)
    out = Image.new("RGBA", (ss, ss), (0, 0, 0, 0))
    out.paste(bg, (0, 0), mask)

    draw = ImageDraw.Draw(out)

    def pt(x: float, y: float):
        cx = 50 + (x - 50) * plane_scale
        cy = 50 + (y - 50) * plane_scale
        return (cx / 100 * ss, cy / 100 * ss)

    draw.polygon([pt(18, 49), pt(84, 20), pt(47, 58)], fill=(255, 255, 255, 255))
    draw.polygon([pt(47, 58), pt(84, 20), pt(60, 81)], fill=(224, 242, 254, 255))
    draw.polygon([pt(47, 58), pt(44, 75), pt(53, 64)], fill=(186, 230, 253, 255))
    return out.resize((size, size), Image.LANCZOS)


if __name__ == "__main__":
    icon(192, rounded=True).save(PUBLIC / "pwa-192x192.png")
    icon(512, rounded=True).save(PUBLIC / "pwa-512x512.png")
    # Maskable icons get cropped to a circle/squircle by the OS, so fill edge-to-edge and shrink the glyph.
    icon(512, rounded=False, plane_scale=0.7).save(PUBLIC / "pwa-maskable-512x512.png")
    icon(180, rounded=False).convert("RGB").save(PUBLIC / "apple-touch-icon.png")
    print("icons written to", PUBLIC)
