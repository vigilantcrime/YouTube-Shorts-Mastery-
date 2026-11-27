"""glitchscan.py SB : per-shot flicker/shake score. A pixel 'flips' when its brightness change reverses sign between
consecutive frame pairs with both changes large (z-fighting, shimmering, jitter, strobing). Smooth motion and fades never flip.
Outputs ex/scan.json and a heat map per shot."""
import sys, json, subprocess, numpy as np
from PIL import Image
SB = sys.argv[1]; IN = SB + '/danny_in/danny.mp4'
shots = [tuple(map(int, l.split())) for l in open(SB + '/danny/inv/shots.txt')]
W, H = 480, 270
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', IN, '-vf', f'scale={W}:{H}:flags=area', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
res = {}; prev2 = prev1 = None; n = -1; cur = None
acc = None
def flush(sid, s, e, acc, cnt, perframe):
    if acc is None or cnt == 0: return
    m = acc / cnt
    # 12x12-pixel blocks (= 48 px at full res)
    bh, bw = H // 12, W // 12
    blk = m[:bh * 12, :bw * 12].reshape(bh, 12, bw, 12).mean((1, 3))
    j = np.unravel_index(np.argmax(blk), blk.shape)
    res[sid] = dict(s=s, e=e, mean=float(m.mean()), blockmax=float(blk.max()), at=[int(j[1] * 48 + 24), int(j[0] * 48 + 24)],
                    p90frame=float(np.percentile(perframe, 90)) if perframe else 0.0, nblk=int((blk > 0.06).sum()))
    hm = np.clip(m / 0.15 * 255, 0, 255).astype(np.uint8)
    Image.fromarray(hm).save(f'{SB}/ex/heat/{sid}.png')
si = 0; sid, s, e = shots[0]; cnt = 0; perframe = []
while True:
    b = p.stdout.read(W * H * 3)
    if len(b) < W * H * 3: break
    n += 1
    f = np.frombuffer(b, np.uint8).reshape(H, W, 3).astype(np.int16).sum(2)
    while n > e:
        flush(sid, s, e, acc, cnt, perframe)
        si += 1; sid, s, e = shots[si]; acc = None; cnt = 0; perframe = []; prev1 = prev2 = None
    if prev1 is not None and prev2 is not None:
        d1 = prev1 - prev2; d2 = f - prev1
        flip = ((np.sign(d1) * np.sign(d2)) < 0) & (np.minimum(np.abs(d1), np.abs(d2)) > 21)
        acc = flip.astype(np.float32) if acc is None else acc + flip
        cnt += 1; perframe.append(float(flip.mean()))
    prev2, prev1 = prev1, f
flush(sid, s, e, acc, cnt, perframe)
json.dump(res, open(SB + '/ex/scan.json', 'w'))
print('shots scanned', len(res))
