"""Convert the locally served production images to visually lossless WebP.

This deliberately excludes public/Downloads: those files are not referenced by
the application and are user/archive material rather than shipped assets.
"""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCES = (
    [ROOT / "public" / name for name in (
        "EasyBasket.png",
        "favicon.png",
        "noor.png",
        "quadtricks-emblem.png",
        "RestaurantMenu.png",
        "ridoz-cover.png",
    )]
    + sorted((ROOT / "public" / "ridoz").glob("*.png"))
)


for source in SOURCES:
    if not source.is_file():
        raise FileNotFoundError(source)
    target = source.with_suffix(".webp")
    with Image.open(source) as image:
        image.save(target, "WEBP", lossless=True, method=6, exact=True)
    print(f"{source.relative_to(ROOT)} -> {target.relative_to(ROOT)}")
