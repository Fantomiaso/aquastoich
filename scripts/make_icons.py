"""Generate the AquaStoich desktop icons from simple vector-like shapes."""

from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
assets = root / "assets"
assets.mkdir(exist_ok=True)
size = 1024
image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(image)
draw.rounded_rectangle((20, 20, 1004, 1004), radius=205, fill="#176f52")
draw.line([(250, 775), (512, 205), (774, 775)], fill="white", width=112, joint="curve")
for x, y in [(250, 775), (512, 205), (774, 775)]:
    draw.ellipse((x - 56, y - 56, x + 56, y + 56), fill="white")
draw.line((348, 600, 676, 600), fill="#83d9bc", width=105)
for x in (348, 676):
    draw.ellipse((x - 52, 548, x + 52, 652), fill="#83d9bc")

icon = image.resize((512, 512), Image.Resampling.LANCZOS)
icon.save(assets / "icon.png")
icon.save(assets / "icon.ico", sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
icon.save(assets / "icon.icns")
