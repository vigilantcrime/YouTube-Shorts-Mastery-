#!/bin/bash
# final_encode.sh LIST AUDIO OUT [KBPS=8800] [PRESET=fast]
#
# Joins the 4K CRF-12 master segments and re-encodes them to a delivery file that fits the 400 MiB chat limit:
#   * LIST  : ffmpeg concat list (file '/abs/path/seg_00.mp4' ... in order)
#   * AUDIO : final mix (wav, already -14 LUFS / -1.5 dBTP)
#   * OUT   : delivery mp4 (3840x2160, HEVC Main10, BT.709, AAC 320k, hvc1 tag, faststart)
# 2-pass ABR, so the size is predictable. The size guard exits 3 if OUT is over MAXMIB (default 395);
# re-run with SKIP_P1=1 and a lower KBPS to redo pass 2 only.
#
# env: WORK (scratch dir), SKIP_P1=1, MAXMIB, AUDIO_RATE
set -e
LIST=$1; AUDIO=$2; OUT=$3; KBPS=${4:-8800}; PRESET=${5:-fast}
WORK=${WORK:-/tmp/vc_encode}; MAXMIB=${MAXMIB:-395}; AR=${AUDIO_RATE:-48000}
mkdir -p "$WORK"
COMMON="keyint=150:min-keyint=24:bframes=6:rc-lookahead=40:aq-mode=3:aq-strength=1.0:psy-rd=2.0:deblock=-1,-1:vbv-maxrate=26000:vbv-bufsize=40000:colorprim=bt709:transfer=bt709:colormatrix=bt709:range=limited:repeat-headers=1:log-level=error"
STATS="$WORK/x265_2pass.log"

if [ -z "$SKIP_P1" ]; then
  echo "pass 1 start $(date +%T)"
  ffmpeg -v error -nostats -progress "$WORK/p1.prog" -f concat -safe 0 -i "$LIST" -an \
    -c:v libx265 -preset "$PRESET" -pix_fmt yuv420p10le -b:v ${KBPS}k \
    -x265-params "pass=1:stats=$STATS:$COMMON" -f null /dev/null
  echo "pass 1 done $(date +%T)"
fi

echo "pass 2 start $(date +%T)"
ffmpeg -v error -nostats -progress "$WORK/p2.prog" -y -f concat -safe 0 -i "$LIST" -an \
  -c:v libx265 -preset "$PRESET" -pix_fmt yuv420p10le -b:v ${KBPS}k \
  -x265-params "pass=2:stats=$STATS:$COMMON" \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -tag:v hvc1 "$WORK/video.mp4"
echo "pass 2 done $(date +%T)"

VDUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$WORK/video.mp4")
ffmpeg -v error -y -i "$WORK/video.mp4" -i "$AUDIO" -map 0:v:0 -map 1:a:0 \
  -c:v copy -c:a aac -b:a 320k -ar "$AR" -tag:v hvc1 -movflags +faststart -t "$VDUR" "$OUT"

BYTES=$(stat -c %s "$OUT")
echo "OUT $OUT  $BYTES bytes  $(python3 -c "print(round($BYTES/1048576,1))") MiB  duration $VDUR"
ffprobe -v error -show_entries stream=codec_name,profile,width,height,pix_fmt,bit_rate,sample_rate -of compact "$OUT"
if [ "$BYTES" -gt $((MAXMIB*1048576)) ]; then echo "TOO BIG (limit ${MAXMIB} MiB): re-run with SKIP_P1=1 and a lower KBPS"; exit 3; fi
echo "ENCODE-DONE $(date +%T)"
