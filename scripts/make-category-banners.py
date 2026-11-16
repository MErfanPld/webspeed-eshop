"""Generate lightweight SVG category banners (original artwork, ~1-2 KB each).

Usage: python scripts/make-category-banners.py  → public/banners/<slug>.svg
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "banners"

# slug: (title, subtitle, gradient from, gradient to, accent, icon path in a 120×120 box)
CATS = {
    "t-shirts": ("تی‌شرت", "ساده، اورسایز و پولوشرت", "#ff7a59", "#e31b23", "#ffd8cc",
                 "M30 20l20-8h20l20 8 18 22-16 12-8-8v62H36V46l-8 8-16-12z"),
    "shirts": ("پیراهن", "رسمی، کژوال و لینن", "#3b82f6", "#1e3a8a", "#cfe0ff",
               "M38 12h44l26 22-14 14-8-6v66H34V42l-8 6-14-14zM60 12l-10 18 10 10 10-10z"),
    "hoodies": ("هودی و سویشرت", "گرم و راحت برای هر روز", "#8b5cf6", "#4c1d95", "#e4d8ff",
                "M40 16c4-8 36-8 40 0l28 24-12 16-10-8v60H34V48l-10 8-12-16zM46 18c0 14 28 14 28 0"),
    "jackets": ("کت و پالتو", "کت جین و پالتوهای فصل", "#0f766e", "#134e4a", "#c9f2ea",
                "M36 12h48l24 20-10 82H76L60 40 44 114H22L12 32zM60 40V114"),
    "pants": ("شلوار", "پارچه‌ای و کارگو", "#d97706", "#92400e", "#ffe7c2",
              "M34 10h52l6 104H70L60 46 50 114H28z"),
    "jeans": ("جین", "بگ، اسلیم و استریت", "#2563eb", "#172554", "#d6e4ff",
              "M34 10h52l6 104H70L60 46 50 114H28zM34 24h52"),
    "accessories": ("اکسسوری", "کیف، کمربند و بیشتر", "#db2777", "#831843", "#ffd6ea",
                    "M24 46h72l-6 62H30zM40 46c0-30 40-30 40 0h-8c0-20-24-20-24 0z"),
}

TPL = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400">\
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{c1}"/>\
<stop offset="1" stop-color="{c2}"/></linearGradient></defs>\
<rect width="800" height="400" fill="url(#g)"/>\
<circle cx="140" cy="330" r="190" fill="#fff" opacity=".08"/><circle cx="60" cy="40" r="90" fill="#fff" opacity=".06"/>\
<g transform="translate(70 80) scale(2)" fill="{accent}" opacity=".95"><path d="{icon}" fill-rule="evenodd"/></g>\
<g font-family="Vazirmatn,Tahoma,'Segoe UI',sans-serif" text-anchor="start" direction="rtl" fill="#fff">\
<text x="730" y="190" font-size="{size}" font-weight="800">{title}</text>\
<text x="730" y="245" font-size="26" opacity=".85">{subtitle}</text>\
<rect x="540" y="280" width="190" height="52" rx="26" fill="#fff"/>\
<text x="635" y="315" font-size="22" font-weight="700" fill="{c2}" text-anchor="middle">مشاهده محصولات</text></g></svg>
"""

OUT.mkdir(parents=True, exist_ok=True)
for slug, (title, subtitle, c1, c2, accent, icon) in CATS.items():
    size = 64 if len(title) <= 8 else 50
    (OUT / f"{slug}.svg").write_text(TPL.format(**locals()), encoding="utf-8")
    print(f"{slug}.svg {(OUT / f'{slug}.svg').stat().st_size} B")
