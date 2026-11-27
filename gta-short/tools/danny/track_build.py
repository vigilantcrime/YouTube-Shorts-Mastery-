"""track_build.py SB : full-length explainer track (21935 frames): explainer frames at their original positions, black elsewhere."""
import sys, json, subprocess, numpy as np
SB = sys.argv[1]; N = 21935; FR = 1920 * 1080 * 3
scenes = sorted(json.load(open(SB + '/ex/scenes.json'))['scenes'], key=lambda s: s['start'])
dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', SB + '/ex/exall.mp4', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '1920x1080', '-r', '25', '-i', '-',
                        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '10', '-pix_fmt', 'yuv420p', SB + '/ex/track.mp4'], stdin=subprocess.PIPE)
black = bytes(FR); n = 0; used = 0
for sc in scenes:
    while n < sc['start']: enc.stdin.write(black); n += 1
    for k in range(sc['dur']):
        b = dec.stdout.read(FR)
        if len(b) < FR: raise SystemExit(f'explainer render too short at scene {sc["sid"]}')
        enc.stdin.write(b); n += 1; used += 1
while n < N: enc.stdin.write(black); n += 1
enc.stdin.close(); enc.wait(); dec.stdout.close(); dec.wait()
print('track frames', n, 'explainer frames used', used)
