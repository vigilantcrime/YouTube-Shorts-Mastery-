"""verify_v2.py SB OUT : every explainer window must match the explainer track inside and the original 3D just outside;
kept fixes must match their clips; writes a contact sheet of all windows (mid frame) from the delivered file."""
import sys, json, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFont
SB, OUT = sys.argv[1], sys.argv[2]; SRC = SB + '/danny_in/danny.mp4'; TR = SB + '/ex/track.mp4'
sc = sorted(json.load(open(SB + '/ex/scenes.json'))['scenes'], key=lambda s: s['start'])
def fr(path, n):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{n/25:.4f}', '-i', path, '-frames:v', '1', '-vf', 'scale=480:270', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True)
    return np.frombuffer(p.stdout, np.uint8).reshape(270, 480, 3).astype(float)
psnr = lambda a, b: 99 if ((a - b) ** 2).mean() == 0 else 10 * np.log10(255 ** 2 / ((a - b) ** 2).mean())
bad = []; fixed = {1443: 1480, 2329: 2384, 4851: 4851, 8019: 8122, 8241: 8320}
def expect_src(n):
    for a, b in fixed.items():
        if a <= n <= b: return None
    return SRC
tiles = []; font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
for s in sc:
    a, b = s['start'], s['start'] + s['dur'] - 1
    ins = [psnr(fr(OUT, n), fr(TR, n)) for n in (a, (a + b) // 2, b)]
    outs = []
    for n in (a - 1, b + 1):
        if 0 <= n < 21935 and expect_src(n) and not any(t['start'] <= n < t['start'] + t['dur'] for t in sc): outs.append(psnr(fr(OUT, n), fr(SRC, n)))
    ok = min(ins) > 30 and (not outs or min(outs) > 30)
    if not ok: bad.append((s['sid'], [round(x, 1) for x in ins], [round(x, 1) for x in outs]))
    im = Image.fromarray(fr(OUT, (a + b) // 2).astype(np.uint8)); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 200, 22], fill=(0, 0, 0)); d.text((3, 1), f"#{s['sid']} {a // 25 // 60}:{a / 25 % 60:04.1f}", fill=(255, 255, 0), font=font); tiles.append(im)
for k in range(0, len(tiles), 20):
    sh = Image.new('RGB', (2400, 1080))
    for i, t in enumerate(tiles[k:k + 20]): sh.paste(t, ((i % 5) * 480, (i // 5) * 270))
    sh.save(f'{SB}/ex/verify/final_{k // 20}.jpg', quality=82)
# kept fixes
for (clip, a, b) in [('F1_1443', 1443, 1480), ('F2_2329', 2329, 2384), ('I_4851', 4851, 4851), ('J_8019', 8019, 8122), ('K_8241', 8241, 8320)]:
    v = psnr(fr(OUT, (a + b) // 2), fr(f'{SB}/danny/fix/{clip}.mp4', (a + b) // 2 - a))
    if v < 30: bad.append((clip, round(v, 1)))
print('windows', len(sc), 'problems', bad)
pr = subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames:format=duration,size', '-of', 'compact', OUT], capture_output=True, text=True).stdout
print(pr.strip())
