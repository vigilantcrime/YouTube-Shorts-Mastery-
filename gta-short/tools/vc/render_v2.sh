#!/bin/bash
# usage: render_v2.sh COMP BUNDLE OUTDIR FIRST_SEG TOTAL_FRAMES [CRF]    (900-frame segments, resumable, video only, 4K)
SB=/tmp/claude-0/-home-user-YouTube-Shorts-Mastery-/6185ca79-affc-5c77-a075-fed7566a1549/scratchpad
BR=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
COMP=$1; BUNDLE=$2; OUT=$3; i=$4; TOTAL=$5; CRF=${6:-12}; SEG=900
mkdir -p $OUT; cd /home/user/YouTube-Shorts-Mastery-/gta-short
while [ $((i*SEG)) -lt $TOTAL ]; do
  a=$((i*SEG)); b=$((a+SEG-1)); [ $b -ge $TOTAL ] && b=$((TOTAL-1)); n=$((b-a+1))
  f=$OUT/seg_$(printf '%02d' $i).mp4
  if [ -f $f ] && [ "$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 $f 2>/dev/null)" = "$n" ]; then echo "seg $i ok (skip)"; i=$((i+1)); continue; fi
  rm -f $f; echo "seg $i frames $a-$b start $(date +%T)"
  npx remotion render $SB/$BUNDLE $COMP $f --scale=2 --frames=$a-$b --codec=h265 --crf=$CRF --color-space=bt709 --image-format=png --muted --concurrency=4 --browser-executable=$BR --log=error 2>&1 | tr '\r' '\n' | grep -E "Encoded [0-9]+/[0-9]+$|Error|error" | tail -1
  echo "seg $i done $(date +%T) $(ls -la $f 2>/dev/null | awk '{print $5}') bytes"
  i=$((i+1))
done
echo "RENDER-DONE $COMP"
