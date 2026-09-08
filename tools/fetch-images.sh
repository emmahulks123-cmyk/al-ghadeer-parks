#!/usr/bin/env bash
# ================================================================
# Download every image the site uses, convert it to WebP, and switch
# the site over to serving them locally.
#
# Run this ONCE on your own machine, from the project folder:
#
#     bash tools/fetch-images.sh
#
# Needs: curl (built in on Mac and Windows 10+), and cwebp for the
# WebP conversion. Without cwebp it still works, it just keeps the
# original PNGs, which are larger.
#     Mac:      brew install webp
#     Ubuntu:   sudo apt install webp
#     Windows:  https://developers.google.com/speed/webp/download
# ================================================================
set -uo pipefail
cd "$(dirname "$0")/.."

DEST="assets/img"
mkdir -p "$DEST"

BASE=$(grep -oE 'BRAMWELL_MEDIA = "[^"]+"' assets/data.js | sed 's/.*"\(.*\)"/\1/')
if [ -z "$BASE" ]; then
  echo "Could not read BRAMWELL_MEDIA from assets/data.js. Stopping."
  exit 1
fi
echo "Source: $BASE"
echo

# every .png filename mentioned in the two data files
FILES=$(grep -ohE '"hf_[0-9_]+_[a-f0-9-]+\.png"' assets/data.js assets/posts.js \
        | tr -d '"' | sort -u)
TOTAL=$(printf '%s\n' "$FILES" | grep -c . || true)
echo "Found $TOTAL images to fetch."
echo

HAVE_WEBP=0
command -v cwebp >/dev/null 2>&1 && HAVE_WEBP=1
[ "$HAVE_WEBP" -eq 0 ] && echo "cwebp not found, keeping PNGs. Install it for much smaller files."

i=0; failed=0
for f in $FILES; do
  i=$((i+1))
  out="$DEST/$f"
  printf "[%2d/%2d] %s ... " "$i" "$TOTAL" "${f:0:44}"

  if [ -f "${out%.png}.webp" ] || [ -f "$out" ]; then
    echo "already have it"
    continue
  fi

  if curl -fsS --max-time 120 -o "$out" "$BASE$f"; then
    if [ "$HAVE_WEBP" -eq 1 ]; then
      # 2000px wide is plenty for a full bleed hero on a retina screen
      cwebp -quiet -q 82 -resize 2000 0 "$out" -o "${out%.png}.webp" && rm -f "$out"
      echo "ok, webp"
    else
      echo "ok, png"
    fi
  else
    echo "FAILED"
    failed=$((failed+1))
    rm -f "$out"
  fi
done

echo
if [ "$failed" -gt 0 ]; then
  echo "$failed image(s) failed. Re-run this script to retry just those."
  echo "The site still works from the CDN in the meantime."
  exit 1
fi

# point the site at the local folder, and switch the extension if we converted
if [ "$HAVE_WEBP" -eq 1 ]; then
  sed -i.bak -E 's/(hf_[0-9_]+_[a-f0-9-]+)\.png/\1.webp/g' assets/data.js assets/posts.js
fi
sed -i.bak "s|BRAMWELL_MEDIA = \"$BASE\"|BRAMWELL_MEDIA = \"assets/img/\"|" assets/data.js
rm -f assets/data.js.bak assets/posts.js.bak

echo "Done. $TOTAL images are in $DEST and the site now loads them locally."
echo "You can delete the preconnect line for cloudfront from the HTML files."
echo "Total size:"
du -sh "$DEST"
