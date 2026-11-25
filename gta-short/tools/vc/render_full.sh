#!/bin/bash
# resumable segmented 4K render of VcFull from frame 7200 (frames 0-7199 are reused from the Part 1 segments). usage: render_full.sh [crf]
SB=/tmp/claude-0/-home-user-YouTube-Shorts-Mastery-/6185ca79-affc-5c77-a075-fed7566a1549/scratchpad
BR=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
CRF=${1:-12}; TOTAL=$(python3 -c "import math;print(math.ceil(353.91*30))"); SEG=900
cd /home/user/YouTube-Shorts-Mastery-/gta-short
i=8
while [ $((i*SEG)) -lt $TOTAL ]; do
  a=$((i*SEG)); b=$((a+SEG-1)); [ $b -ge $TOTAL ] && b=$((TOTAL-1)); n=$((b-a+1))
  out=$SB/seg/seg_$(printf '%02d' $i).mp4
  if [ -f $out ] && [ "$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 $out 2>/dev/null)" = "$n" ]; then echo "seg $i ok (skip)"; i=$((i+1)); continue; fi
  rm -f $out; echo "seg $i frames $a-$b start $(date +%T)"
  npx remotion render $SB/${BUNDLE:-vcbf} VcFull $out --scale=2 --frames=$a-$b --codec=h265 --crf=$CRF --color-space=bt709 --image-format=png --muted --concurrency=4 --browser-executable=$BR --log=error 2>&1 | tr '\r' '\n' | grep -E "Encoded [0-9]+/[0-9]+$|Error|error" | tail -1
  echo "seg $i done $(date +%T) $(ls -la $out 2>/dev/null | awk '{print $5}') bytes"
  i=$((i+1))
done
echo FULLDONE
