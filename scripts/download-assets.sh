#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/public/fonts" "$ROOT/public/placeholders"

BASE="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts"
for w in Regular Medium SemiBold Bold ExtraBold; do
  out="$ROOT/public/fonts/Vazirmatn-${w}.woff2"
  if [[ ! -s "$out" ]]; then
    echo "Downloading Vazirmatn-${w}.woff2 ..."
    curl -fsSL "$BASE/Vazirmatn-${w}.woff2" -o "$out"
  fi
done

echo "Fonts ready in public/fonts"
echo "Place your banner at: public/placeholders/samsung-banner.webp"
ls -la "$ROOT/public/fonts"
