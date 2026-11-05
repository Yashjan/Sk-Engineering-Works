#!/bin/bash
# Lighthouse (mobile + desktop) against a static export served like GitHub Pages.
# usage: QA_NODE_MODULES=/path/to/node_modules(with lighthouse) qa/tools/run_lighthouse.sh <out-dir> <label> [port]
# Reports are written to qa/reports/lighthouse/<label>/<page>.<form>.json; summarise with qa/tools/summarize.py.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
OUT_DIR="$1"; LABEL="$2"; PORT="${3:-4300}"
LH="${QA_NODE_MODULES:?set QA_NODE_MODULES}/.bin/lighthouse"
CHROME="${CHROME:-/usr/bin/google-chrome}"
DEST="$REPO/qa/reports/lighthouse/$LABEL"
mkdir -p "$DEST"
node "$HERE/serve.mjs" "$OUT_DIR" "$PORT" >/dev/null & SRV=$!
trap 'kill $SRV' EXIT
sleep 1
for p in "" about engineering salt-refinery-plants machinery machinery/belt-conveyor machinery/screw-conveyor; do
  name=${p//\//_}; name=${name:-home}
  for form in mobile desktop; do
    extra=""; [ "$form" = desktop ] && extra="--preset=desktop"
    "$LH" "http://localhost:$PORT/Sk-Engineering-Works/${p:+$p/}" $extra \
      --only-categories=performance,accessibility,seo,best-practices --output=json --output-path="$DEST/$name.$form.json" \
      --chrome-path="$CHROME" --chrome-flags="--headless=new --no-sandbox" --quiet --max-wait-for-load=60000 || echo "FAILED $name $form"
  done
done
