import json, subprocess, sys, os
from PIL import Image, ImageDraw, ImageFont
SB = '/tmp/claude-0/-home-user-YouTube-Shorts-Mastery-/6185ca79-affc-5c77-a075-fed7566a1549/scratchpad'
vid = sys.argv[1]; per = int(sys.argv[2]) if len(sys.argv) > 2 else 6; mode = sys.argv[3] if len(sys.argv) > 3 else 'end'
d = json.load(open(SB + '/cues1.json')); sc = d['scenes']
os.makedirs(SB + '/qa', exist_ok=True)
items = []
for i, (t0, t1) in enumerate(sc):
    tt = max(t0 + 0.9, t1 - 0.5) if mode == 'end' else min(t1 - 0.35, t0 + 1.7)
    items.append((i, tt))
if len(sys.argv) > 4:                       # explicit "i,i,i" selection
    sel = set(int(x) for x in sys.argv[4].split(',')); items = [it for it in items if it[0] in sel]
frames = []
for i, tt in items:
    p = f'{SB}/qa/s{i:02d}_{mode}.png'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', f'{tt:.3f}', '-i', vid, '-frames:v', '1', p], check=True)
    im = Image.open(p).convert('RGB'); dr = ImageDraw.Draw(im); dr.rectangle([0, im.height - 22, 170, im.height], fill=(0, 0, 0)); dr.text((6, im.height - 18), f'S{i:02d}  t={tt:6.2f}s', fill=(255, 255, 0)); frames.append(im)
cols = 2
for k in range(0, len(frames), per):
    grp = frames[k:k + per]; w, h = grp[0].size; rows = (len(grp) + cols - 1) // cols
    sheet = Image.new('RGB', (w * cols, h * rows))
    for j, im in enumerate(grp): sheet.paste(im, ((j % cols) * w, (j // cols) * h))
    out = f'{SB}/qa/sheet_{mode}_{k // per:02d}.jpg'; sheet.save(out, quality=86); print(out, sheet.size)
