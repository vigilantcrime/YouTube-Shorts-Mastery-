#!/bin/bash
# usage: stills.sh <outdir> t1 t2 t3 ...   (renders half-scale stills of VcPart1 at the given seconds, 3 at a time)
SB=/tmp/claude-0/-home-user-YouTube-Shorts-Mastery-/6185ca79-affc-5c77-a075-fed7566a1549/scratchpad
BR=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
OUT=$1; shift; mkdir -p $OUT; n=0
cd /home/user/YouTube-Shorts-Mastery-/gta-short
for t in "$@"; do
  f=$(python3 -c "print(round($t*30))")
  npx remotion still $SB/${BUNDLE:-vcb} ${COMP:-VcPart1} $OUT/t$(printf '%07.2f' $t).png --frame=$f --scale=${SCALE:-0.5} --browser-executable=$BR --log=error >/dev/null 2>&1 &
  n=$((n+1)); if [ $((n%3)) -eq 0 ]; then wait; fi
done
wait
