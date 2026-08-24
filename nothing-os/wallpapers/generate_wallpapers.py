#!/usr/bin/env python3
"""Generate the Nothing OS wallpaper set.

Pure black, dot-grid, and concentric-rings designs in the kit's palette:
black #000000, faint greys, one Nothing-red (#D71921) accent per image.
Renders at 2x and downsamples for smooth ring edges.

Usage: python3 generate_wallpapers.py [output_dir]
"""
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw

BLACK = (0, 0, 0)
GREY_FAINT = (22, 22, 22)
GREY_RING = (38, 38, 38)
GREY_RING_BRIGHT = (56, 56, 56)
RED = (215, 25, 33)  # Nothing red #D71921

# name -> (width, height): Surface Pro 12", MacBook Air M4 13", iPhone portrait
TARGETS = {
    "surface-2196x1464": (2196, 1464),
    "mac-2560x1664": (2560, 1664),
    "iphone-1290x2796": (1290, 2796),
}

SS = 2  # supersample factor


def canvas(w, h):
    img = Image.new("RGB", (w * SS, h * SS), BLACK)
    return img, ImageDraw.Draw(img)


def save(img, w, h, path):
    img = img.resize((w, h), Image.LANCZOS)
    img.save(path, optimize=True)
    print(f"  {path} ({w}x{h})")


def gen_black(w, h, path):
    img = Image.new("RGB", (w, h), BLACK)
    img.save(path, optimize=True)
    print(f"  {path} ({w}x{h})")


def gen_dots(w, h, path):
    """Faint dot grid with a single red dot accent, lower third."""
    img, d = canvas(w, h)
    step = round(min(w, h) / 24) * SS
    r = max(2, step // 22)
    ox, oy = step // 2, step // 2
    red_col = round(w * SS * 0.72 / step)
    red_row = round(h * SS * 0.70 / step)
    for j, y in enumerate(range(oy, h * SS, step)):
        for i, x in enumerate(range(ox, w * SS, step)):
            color = RED if (i == red_col and j == red_row) else GREY_FAINT
            rr = r * 2 if color is RED else r
            d.ellipse([x - rr, y - rr, x + rr, y + rr], fill=color)
    save(img, w, h, path)


def ring(d, cx, cy, radius, width, color):
    d.ellipse(
        [cx - radius, cy - radius, cx + radius, cy + radius],
        outline=color,
        width=width,
    )


def gen_rings(w, h, path):
    """Concentric thin rings offset right of center, Phone (2a) camera-plate
    style: a large cluster, a small satellite cluster, one red arc dot."""
    img, d = canvas(w, h)
    W, H = w * SS, h * SS
    portrait = h > w
    if portrait:
        cx, cy = W * 0.50, H * 0.38
        base = W * 0.30
    else:
        cx, cy = W * 0.66, H * 0.46
        base = H * 0.30
    lw = max(2, round(min(W, H) / 500))

    # main cluster: tight inner rings, wider spaced outer rings
    radii = [base * f for f in (0.34, 0.40, 0.46, 0.70, 0.76, 1.00, 1.30, 1.62)]
    tones = [
        GREY_RING_BRIGHT,
        GREY_RING,
        GREY_RING,
        GREY_RING_BRIGHT,
        GREY_RING,
        GREY_RING,
        GREY_FAINT,
        GREY_FAINT,
    ]
    for rad, tone in zip(radii, tones):
        ring(d, cx, cy, rad, lw, tone)

    # satellite cluster, lower left of main
    sx, sy = cx - base * 1.55, cy + base * 1.05
    for rad, tone in [
        (base * 0.16, GREY_RING_BRIGHT),
        (base * 0.22, GREY_RING),
        (base * 0.30, GREY_FAINT),
    ]:
        ring(d, sx, sy, rad, lw, tone)

    # the one red element: a dot riding the third main ring, upper right
    ang = math.radians(-38)
    rad = radii[3]
    px, py = cx + rad * math.cos(ang), cy + rad * math.sin(ang)
    pr = max(6, round(min(W, H) / 160))
    d.ellipse([px - pr, py - pr, px + pr, py + pr], fill=RED)

    save(img, w, h, path)


def main():
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent
    out.mkdir(parents=True, exist_ok=True)
    for name, (w, h) in TARGETS.items():
        print(f"{name}:")
        gen_rings(w, h, out / f"nothing-rings-{name}.png")
        gen_dots(w, h, out / f"nothing-grid-{name}.png")
    gen_black(1290, 2796, out / "nothing-black-iphone-1290x2796.png")


if __name__ == "__main__":
    main()
