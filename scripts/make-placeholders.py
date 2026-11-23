"""Generate the colorful, lightweight SVG artwork of the sample store (original art, ~1 KB each).

Usage: python scripts/make-placeholders.py
  public/placeholders/products/<category>-<palette>.svg   product images (category × palette)
  public/placeholders/hero-{1,2,3}.svg, banner-1.svg, brand-{1..4}.svg, avatar.svg, cat-{1..4}.svg
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "public" / "placeholders"

# Garment silhouettes in a 120×120 box
GARMENTS = {
    "t-shirts": "M30 20l20-8h20l20 8 18 22-16 12-8-8v62H36V46l-8 8-16-12z",
    "shirts": "M38 12h44l26 22-14 14-8-6v66H34V42l-8 6-14-14zM60 12l-10 18 10 10 10-10z",
    "hoodies": "M40 16c4-8 36-8 40 0l28 24-12 16-10-8v60H34V48l-10 8-12-16zM46 18c0 14 28 14 28 0",
    "jackets": "M42 10h36l28 20-10 40-10-6v52H34V64l-10 6-10-40zM60 12 50 34h20zM58 40h4v72h-4z",
    "pants": "M34 10h52l6 104H70L60 46 50 114H28z",
    "jeans": "M34 10h52l6 104H70L60 46 50 114H28zM34 24h52",
    "dresses": "M46 8h28l-4 22 26 84H24l26-84z",
    "accessories": "M24 46h72l-6 62H30zM40 46c0-30 40-30 40 0h-8c0-20-24-20-24 0z",
    "default": "M30 20l20-8h20l20 8 18 22-16 12-8-8v62H36V46l-8 8-16-12z",
}

# (background from, background to, garment fill, accent) — first ones match color names in products
PALETTES = [
    ("#1f2937", "#4b5563", "#111827", "#f472b6"),  # 1 black
    ("#fdf6e3", "#f5e6c8", "#e7d3a8", "#c2410c"),  # 2 cream
    ("#ecfccb", "#d9f99d", "#65a30d", "#365314"),  # 3 olive
    ("#e0e7ff", "#c7d2fe", "#4f46e5", "#f59e0b"),  # 4 indigo
    ("#fce7f3", "#fbcfe8", "#db2777", "#7c3aed"),  # 5 pink
    ("#e0f2fe", "#bae6fd", "#0284c7", "#f97316"),  # 6 sky
    ("#f3f4f6", "#e5e7eb", "#9ca3af", "#ef4444"),  # 7 grey
    ("#fef3c7", "#fde68a", "#d97706", "#0ea5e9"),  # 8 amber
]

PRODUCT = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">\
<defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{bg1}"/><stop offset="1" stop-color="{bg2}"/></linearGradient>\
<radialGradient id="s" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>\
<rect width="600" height="800" fill="url(#b)"/>\
<circle cx="480" cy="140" r="120" fill="{accent}" opacity=".18"/><circle cx="90" cy="690" r="150" fill="#fff" opacity=".35"/>\
<ellipse cx="300" cy="650" rx="170" ry="26" fill="url(#s)"/>\
<g transform="translate(78 150) scale(3.7)"><path d="{path}" fill="{fill}" fill-rule="evenodd"/>\
<path d="{path}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="1.5" fill-rule="evenodd"/></g></svg>
"""

HERO = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 600" width="1400" height="600" preserveAspectRatio="xMidYMid slice">\
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{c1}"/><stop offset=".55" stop-color="{c2}"/><stop offset="1" stop-color="{c3}"/></linearGradient></defs>\
<rect width="1400" height="600" fill="url(#g)"/>\
<circle cx="260" cy="120" r="260" fill="#fff" opacity=".10"/><circle cx="1240" cy="560" r="300" fill="#fff" opacity=".08"/>\
<circle cx="380" cy="430" r="90" fill="#fff" opacity=".12"/>\
<g transform="translate(140 110) scale(3.2)" fill="#fff" opacity=".92"><path d="{g1}"/></g>\
<g transform="translate(420 200) scale(2.4) rotate(-8 60 60)" fill="#fff" opacity=".55"><path d="{g2}"/></g></svg>
"""

BANNER = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400" preserveAspectRatio="xMidYMid slice">\
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7c3aed"/><stop offset=".5" stop-color="#db2777"/><stop offset="1" stop-color="#f97316"/></linearGradient></defs>\
<rect width="1200" height="400" fill="url(#g)"/>\
<circle cx="180" cy="60" r="180" fill="#fff" opacity=".1"/><circle cx="120" cy="360" r="90" fill="#fff" opacity=".12"/>\
<g transform="translate(90 70) scale(2.2)" fill="#fff" opacity=".9"><path d="{g}"/></g>\
<text x="420" y="250" font-family="Vazirmatn,Tahoma,sans-serif" font-size="190" font-weight="800" fill="#fff" opacity=".12">%</text></svg>
"""

BRAND = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 96" width="240" height="96">\
<rect width="240" height="96" rx="20" fill="{bg}"/>\
<circle cx="56" cy="48" r="20" fill="{fg}"/><circle cx="56" cy="48" r="8" fill="{bg}"/>\
<text x="90" y="57" font-family="'Segoe UI',Tahoma,sans-serif" font-size="26" font-weight="800" fill="{fg}">{name}</text></svg>
"""

AVATAR = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">\
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#db2777"/></linearGradient></defs>\
<circle cx="48" cy="48" r="48" fill="url(#g)"/><circle cx="48" cy="38" r="16" fill="#fff" opacity=".9"/>\
<path d="M18 82c6-16 18-24 30-24s24 8 30 24" fill="#fff" opacity=".9"/></svg>
"""


def write(path: Path, text: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def main():
    for cat, path in GARMENTS.items():
        for i, (bg1, bg2, fill, accent) in enumerate(PALETTES, 1):
            write(ROOT / "products" / f"{cat}-{i}.svg", PRODUCT.format(bg1=bg1, bg2=bg2, fill=fill, accent=accent, path=path))
    heroes = [
        ("#7c3aed", "#db2777", "#f97316", "t-shirts", "hoodies"),
        ("#0ea5e9", "#6366f1", "#a855f7", "jackets", "shirts"),
        ("#f43f5e", "#f97316", "#facc15", "dresses", "accessories"),
    ]
    for i, (c1, c2, c3, a, b) in enumerate(heroes, 1):
        write(ROOT / f"hero-{i}.svg", HERO.format(c1=c1, c2=c2, c3=c3, g1=GARMENTS[a], g2=GARMENTS[b]))
    write(ROOT / "banner-1.svg", BANNER.format(g=GARMENTS["accessories"]))
    for i, (bg, fg, name) in enumerate(
        [("#ede9fe", "#6d28d9", "Aether"), ("#fce7f3", "#be185d", "Nova"), ("#e0f2fe", "#0369a1", "Orbit"), ("#fef3c7", "#b45309", "Lumen")], 1
    ):
        write(ROOT / f"brand-{i}.svg", BRAND.format(bg=bg, fg=fg, name=name))
    write(ROOT / "avatar.svg", AVATAR)
    for i, cat in enumerate(["t-shirts", "shirts", "hoodies", "jackets"], 1):
        bg1, bg2, fill, accent = PALETTES[[3, 4, 5, 2][i - 1]]
        write(ROOT / f"cat-{i}.svg", PRODUCT.format(bg1=bg1, bg2=bg2, fill=fill, accent=accent, path=GARMENTS[cat]))
    # legacy names keep working (old pages/products that still reference them)
    for i, cat in enumerate(["t-shirts", "jeans", "shirts", "hoodies", "jackets", "accessories"], 1):
        bg1, bg2, fill, accent = PALETTES[[3, 5, 1, 4, 7, 2][i - 1]]
        write(ROOT / f"product-{i}.svg", PRODUCT.format(bg1=bg1, bg2=bg2, fill=fill, accent=accent, path=GARMENTS[cat]))
    total = sum(f.stat().st_size for f in ROOT.rglob("*.svg"))
    print(f"{len(list(ROOT.rglob('*.svg')))} files, {total // 1024} KB")


if __name__ == "__main__":
    main()
