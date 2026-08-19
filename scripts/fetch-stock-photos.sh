#!/usr/bin/env bash
# Unduh foto stok Unsplash HANYA untuk gambar latar halaman.
#
# Foto produk TIDAK lagi diurus skrip ini. Sejak katalog resmi Vitasari dipakai,
# foto produk dipotong dari screenshot katalog lewat:
#   node scripts/potong-foto-katalog.cjs
set -u

DEST="$(cd "$(dirname "$0")/.." && pwd)/public/images"
mkdir -p "$DEST"

UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

grab() {
  local out="$1" id="$2" params="$3"
  if curl -sfL -A "$UA" "https://images.unsplash.com/${id}?${params}" -o "$out" && [ -s "$out" ]; then
    printf '  OK   %-16s %6s KB\n' "$(basename "$out")" "$(( $(wc -c < "$out") / 1024 ))"
  else
    printf '  GAGAL %s\n' "$(basename "$out")"
    rm -f "$out"
  fi
}

echo "== Foto latar halaman =="
grab "$DEST/hero-bg.jpg" "photo-1568254183919-78a4f43a2877" "w=1920&h=1080&fit=crop&crop=entropy&q=78&fm=jpg"
grab "$DEST/hero.jpg"    "photo-1509440159596-0249088772ff" "w=1000&h=1000&fit=crop&crop=entropy&q=82&fm=jpg"
grab "$DEST/about.jpg"   "photo-1587241321921-91a834d6d191" "w=800&h=1000&fit=crop&crop=entropy&q=82&fm=jpg"
