#!/usr/bin/env bash
# Unduh foto stok Unsplash sebagai placeholder sementara untuk Vitasari Bakery.
set -u

DEST="$(cd "$(dirname "$0")/.." && pwd)/public/images"
PROD="$DEST/products"
mkdir -p "$PROD"

UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

ok=0
fail=0

# grab <path> <photo-id> <params>
grab() {
  local out="$1" id="$2" params="$3"
  local url="https://images.unsplash.com/${id}?${params}"
  if curl -sfL -A "$UA" "$url" -o "$out" && [ -s "$out" ]; then
    # pastikan benar-benar JPEG (magic bytes FFD8FF)
    if [ "$(head -c 3 "$out" | od -An -tx1 | tr -d ' \n')" = "ffd8ff" ]; then
      printf '  OK   %-34s %6s KB\n' "$(basename "$out")" "$(( $(wc -c < "$out") / 1024 ))"
      ok=$((ok+1))
      return 0
    fi
  fi
  printf '  GAGAL %-34s\n' "$(basename "$out")"
  rm -f "$out"
  fail=$((fail+1))
}

P="w=800&h=600&fit=crop&crop=entropy&q=80&fm=jpg"

echo "== Roti Manis =="
grab "$PROD/roti-coklat-keju.jpg"      "photo-1592811773343-9abf0b1a6920" "$P"
grab "$PROD/roti-pisang-coklat.jpg"    "photo-1628809730146-ade1257166c8" "$P"
grab "$PROD/roti-srikaya.jpg"          "photo-1613244469130-2b0490a87266" "$P"
grab "$PROD/roti-abon-sapi.jpg"        "photo-1700124164657-327fe4ce79c3" "$P"
grab "$PROD/roti-pizzatos.jpg"         "photo-1632552544552-3ca612a328ac" "$P"
grab "$PROD/roti-sosis-mayo.jpg"       "photo-1676813904943-c67e000fb0d8" "$P"
grab "$PROD/roti-jagung-manis.jpg"     "photo-1651604033534-e66b281f1981" "$P"
grab "$PROD/roti-butter-gula.jpg"      "photo-1599940778173-e276d4acb2bb" "$P"

echo "== Roti Tawar & Sisir =="
grab "$PROD/roti-tawar-spesial.jpg"    "photo-1549931319-a545dcf3bc73" "$P"
grab "$PROD/roti-tawar-gandum.jpg"     "photo-1585478259715-876a6a81fc08" "$P"
grab "$PROD/roti-sisir-mentega.jpg"    "photo-1559811814-e2c57b5e69df" "$P"
grab "$PROD/roti-kasur.jpg"            "photo-1663904460424-91895028aa9e" "$P"

echo "== Cake & Bolu =="
grab "$PROD/bolu-jadul.jpg"            "photo-1541783245831-57d6fb0926d3" "$P"
grab "$PROD/marmer-cake.jpg"           "photo-1586985289906-406988974504" "$P"
grab "$PROD/bolu-pepe.jpg"             "photo-1602351447937-745cb720612f" "$P"
grab "$PROD/roll-cake-pandan.jpg"      "photo-1517427294546-5aa121f68e8a" "$P"
grab "$PROD/cake-coklat.jpg"           "photo-1626263468007-a9e0cf83f1ac" "$P"
grab "$PROD/brownies-panggang.jpg"     "photo-1606313564200-e75d5e30476c" "$P"
grab "$PROD/black-forest.jpg"          "photo-1606890737304-57a1ca8a5b62" "$P"

echo "== Jajanan Pasar =="
grab "$PROD/pudding-lumut-pandan.jpg"  "photo-1581715072535-e769cdaea631" "$P"
grab "$PROD/kue-sus-vla.jpg"           "photo-1622715395488-71045e2a4990" "$P"
grab "$PROD/risoles-mayo.jpg"          "photo-1714799263348-41c7245cd714" "$P"
grab "$PROD/lemper-ayam.jpg"           "photo-1775377262404-2acd555ff0e2" "$P"
grab "$PROD/pastel-sayur.jpg"          "photo-1767469576715-a4eb8bcfa204" "$P"
grab "$PROD/bika-ambon.jpg"            "photo-1649019840375-0dcc3fcdf20b" "$P"

echo "== Pastry & Pie =="
grab "$PROD/pisang-bolen-lilit.jpg"    "photo-1652172600474-32937eefee09" "$P"
grab "$PROD/egg-cheese-roll.jpg"       "photo-1613929231151-d7571591259e" "$P"
grab "$PROD/croissant-butter.jpg"      "photo-1555507036-ab1f4038808a" "$P"
grab "$PROD/pie-susu.jpg"              "photo-1633785587635-a5c1df91fa90" "$P"
grab "$PROD/baby-face-cake.jpg"        "photo-1589899475988-9e0a4a040b2a" "$P"

echo "== Foto halaman =="
grab "$DEST/hero.jpg"  "photo-1509440159596-0249088772ff" "w=1000&h=1000&fit=crop&crop=entropy&q=82&fm=jpg"
grab "$DEST/about.jpg" "photo-1587241321921-91a834d6d191" "w=800&h=1000&fit=crop&crop=entropy&q=82&fm=jpg"

echo
echo "SELESAI: $ok berhasil, $fail gagal"
