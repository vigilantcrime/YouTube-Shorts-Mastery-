"""final_cmd.py SB OUT : writes ex/encode_v2.sh (2-pass x264, original audio copied)."""
import sys, json
SB, OUT = sys.argv[1], sys.argv[2]
scenes = sorted(json.load(open(SB + '/ex/scenes.json'))['scenes'], key=lambda s: s['start'])
W = SB + '/danny/fix'
en = '+'.join(f"between(n,{s['start']},{s['start'] + s['dur'] - 1})" for s in scenes)
fixes = [(f'{W}/F1_1443.mp4', 1443, 1480), (f'{W}/F2_2329.mp4', 2329, 2384), (f'{W}/I_4851.mp4', 4851, 4851), (f'{W}/J_8019.mp4', 8019, 8122), (f'{W}/K_8241.mp4', 8241, 8320)]
ins = f"-i {SB}/danny_in/danny.mp4 -i {SB}/ex/track.mp4 " + ' '.join(f'-i {c}' for c, _, _ in fixes)
fc = [f"[{i + 2}:v]setpts=PTS-STARTPTS+{a}/25/TB[f{i}]" for i, (c, a, b) in enumerate(fixes)]
prev = '0:v'
for i, (c, a, b) in enumerate(fixes):
    fc.append(f"[{prev}][f{i}]overlay=enable='between(n,{a},{b})':eof_action=pass[g{i}]"); prev = f'g{i}'
fc.append(f"[{prev}][1:v]overlay=enable='{en}':eof_action=pass,format=yuv420p[v]")
FC = ';'.join(fc)
sh = f'''#!/bin/bash
set -e
cd {SB}/ex
rm -f v2pass*
IN="{ins}"
FC="{FC}"
echo "pass1 $(date +%T)"
ffmpeg -v error -y $IN -filter_complex "$FC" -map "[v]" -an -c:v libx264 -preset slow -b:v 3400k -maxrate 6000k -bufsize 12000k -pass 1 -passlogfile v2pass -r 25 -f null /dev/null
echo "pass2 $(date +%T)"
ffmpeg -v error -y $IN -filter_complex "$FC" -map "[v]" -map 0:a:0 -c:v libx264 -preset slow -b:v 3400k -maxrate 6000k -bufsize 12000k -pass 2 -passlogfile v2pass -r 25 -c:a copy -movflags +faststart {OUT}
echo "DONE $(date +%T) $(stat -c %s {OUT})"
'''
open(SB + '/ex/encode_v2.sh', 'w').write(sh); print('windows', len(scenes))
