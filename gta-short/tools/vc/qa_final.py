#!/usr/bin/env python3
"""qa_final.py FINAL.mp4 SEGDIR... — spot-check the delivery encode against the CRF-12 masters.

Prints SSIM (Y) and PSNR for 1-second windows spread across the video, the integrated loudness / true peak of
the audio track, and the stream summary. Masters are the 900-frame segments in order (list passed as the
remaining args, in play order). Run with `python3 -I`.
"""
import re, subprocess, sys

FINAL = sys.argv[1]
SEGS = sys.argv[2:]
FPS, SEGLEN = 30.0, 30.0  # 900 frames per master segment
POINTS = [4.5, 31.0, 62.0, 95.0, 128.0, 165.0, 200.0, 236.0, 262.0, 291.0, 318.0, 344.0]


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True).stderr


for t in POINTS:
    k = int(t // SEGLEN)
    off = t - k * SEGLEN
    flt = ("[0:v]format=yuv420p10le[a];[1:v]format=yuv420p10le,split[b1][b2];"
           "[a][b1]ssim[s];[s][b2]psnr")
    out = run(["ffmpeg", "-hide_banner", "-nostats", "-ss", f"{t:.3f}", "-t", "1", "-i", FINAL,
               "-ss", f"{off:.3f}", "-t", "1", "-i", SEGS[k], "-filter_complex", flt, "-f", "null", "-"])
    s = re.search(r"SSIM Y:([0-9.]+).*All:([0-9.]+)", out)
    p = re.search(r"PSNR y:([0-9.]+)", out)
    print(f"t={t:6.1f}s seg{k:02d}  SSIM(Y) {s.group(1) if s else '?'}  PSNR(Y) {p.group(1) if p else '?'} dB", flush=True)

out = run(["ffmpeg", "-hide_banner", "-nostats", "-i", FINAL, "-vn", "-af", "ebur128=peak=true", "-f", "null", "-"])
m = re.search(r"Integrated loudness:\s+I:\s+(-?[0-9.]+) LUFS", out)
tp = re.search(r"True peak:\s+Peak:\s+(-?[0-9.]+) dBFS", out)
print("loudness", m.group(1) if m else "?", "LUFS   true peak", tp.group(1) if tp else "?", "dBFS")
print(subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                      "stream=codec_name,profile,width,height,pix_fmt,r_frame_rate,bit_rate,sample_rate,channels:format=duration,size",
                      "-of", "compact", FINAL], capture_output=True, text=True).stdout)
