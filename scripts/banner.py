#!/usr/bin/env python3
"""
Generates the home banner poster as 8-bit pixel art: a mountain range at dusk,
a big light-blue sun setting behind the far ridge, stars, thin clouds, a few trees.
Four colors only. Deterministic (seeded).

    python3 -I scripts/banner.py public/banner/banner-poster.png

Grid is 320x80 (4:1), scaled by SCALE with hard pixels.
"""
import random
import struct
import sys
import zlib

W, H = 320, 80
SCALE = 4

BLACK = (0x0A, 0x0A, 0x0A)
DARK = (0x12, 0x35, 0x5A)
MID = (0x34, 0x8C, 0xD0)
BRIGHT = (0xA8, 0xEC, 0xFF)

rng = random.Random(64)
px = [[BLACK] * W for _ in range(H)]


def put(x, y, c):
    if 0 <= x < W and 0 <= y < H:
        px[y][x] = c


def rect(x, y, w, h, c):
    for yy in range(y, y + h):
        for xx in range(x, x + w):
            put(xx, yy, c)


def disc(cx, cy, r, c):
    for yy in range(-r, r + 1):
        for xx in range(-r, r + 1):
            if xx * xx + yy * yy <= r * r + r * 0.5:
                put(cx + xx, cy + yy, c)


def ridge(points):
    """Piecewise-linear skyline from (x, y) peaks -> list of y per column."""
    ys = [H] * W
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        for x in range(x0, x1 + 1):
            t = (x - x0) / max(1, x1 - x0)
            ys[x] = round(y0 + (y1 - y0) * t)
    return ys


def fill_below(ys, c, until=H):
    for x, y in enumerate(ys):
        rect(x, y, 1, until - y, c)


def outline(ys, c):
    for x, y in enumerate(ys):
        put(x, y, c)
        # make steep steps continuous
        if x > 0:
            lo, hi = sorted((ys[x - 1], y))
            for yy in range(lo, hi):
                put(x, yy, c)


# ---------- sun (right of centre, half set behind the far ridge) ----------
SUN_X, SUN_Y, SUN_R = 228, 50, 19
disc(SUN_X, SUN_Y, SUN_R, BRIGHT)
# two flat horizon bands cut into the lower half (retro setting-sun look)
rect(SUN_X - SUN_R, SUN_Y + 6, 2 * SUN_R + 1, 1, BLACK)
rect(SUN_X - SUN_R, SUN_Y + 11, 2 * SUN_R + 1, 2, BLACK)

# ---------- stars (upper sky, avoid the sun and the bottom-left) ----------
for _ in range(55):
    x, y = rng.randrange(40, W), rng.randrange(1, 34)
    if abs(x - SUN_X) < 30 and y > 22:
        continue
    put(x, y, BRIGHT if rng.random() < 0.25 else MID)
for x, y in [(118, 7), (262, 12), (176, 18), (300, 24)]:
    put(x, y, BRIGHT)
    for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
        put(x + dx, y + dy, MID)

# ---------- thin clouds ----------
def cloud(x, y, w, c=DARK):
    rect(x, y, w, 1, c)
    rect(x + 3, y - 1, max(1, w - 8), 1, c)
    rect(x - 2, y + 1, w // 2, 1, c)


cloud(84, 16, 28)
cloud(150, 10, 18)
cloud(270, 20, 24)
cloud(196, 26, 16)
# clouds crossing the sun stay visible in mid
rect(SUN_X - 14, SUN_Y - 8, 30, 1, MID)
rect(SUN_X - 6, SUN_Y - 7, 14, 1, MID)
rect(SUN_X + 2, SUN_Y - 1, 22, 1, MID)

# ---------- far ridge: tall peaks right of centre, covers the lower sun ----------
far = ridge([
    (0, 74), (36, 72), (54, 66), (70, 57), (96, 60), (120, 48), (140, 54),
    (158, 40), (176, 50), (196, 44), (212, 56), (226, 58), (244, 52),
    (262, 38), (280, 48), (298, 42), (319, 52),
])
fill_below(far, DARK)
# sunlit snow caps on the two biggest far peaks, facing the sun
for cx, top in [(158, 40), (262, 38)]:
    put(cx, top, MID)
    put(cx + 1, top + 1, MID)
    put(cx + 2, top + 2, MID)
    put(cx + 1, top + 2, MID)

# ---------- near ridge: black silhouette with a dark rim, low on the left ----------
near = ridge([
    (0, 79), (44, 78), (62, 74), (80, 66), (104, 70), (128, 60), (150, 66),
    (172, 58), (190, 64), (214, 56), (236, 62), (256, 54), (276, 60),
    (296, 52), (319, 60),
])
fill_below(near, BLACK)
outline(near, DARK)

# ---------- a few trees on the near ridge (right of the empty corner) ----------
def tree(x, base, h):
    # pointed pine, black silhouette against the lit far ridge
    for i in range(h):
        w = 1 + 2 * (i // 2)
        rect(x - w // 2, base - h + i, w, 1, BLACK)


for tx in range(100, W, 9):
    if rng.random() < 0.65:
        x = tx + rng.randrange(0, 4)
        tree(x, near[x] + 1, rng.randrange(4, 8))

# bottom-left stays empty by design: both ridges run flat and low there.


# ---------- write PNG ----------
def png(path):
    raw = bytearray()
    for row in px:
        for _ in range(SCALE):
            raw.append(0)  # filter: none
            for c in row:
                raw.extend(bytes(c) * SCALE)

    def chunk(tag, data):
        c = struct.pack('>I', len(data)) + tag + data
        return c + struct.pack('>I', zlib.crc32(tag + data) & 0xFFFFFFFF)

    out = b'\x89PNG\r\n\x1a\n'
    out += chunk(b'IHDR', struct.pack('>IIBBBBB', W * SCALE, H * SCALE, 8, 2, 0, 0, 0))
    out += chunk(b'IDAT', zlib.compress(bytes(raw), 9))
    out += chunk(b'IEND', b'')
    with open(path, 'wb') as f:
        f.write(out)


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else 'banner-poster.png'
    png(out)
    print(f'wrote {out} ({W * SCALE}x{H * SCALE})')
