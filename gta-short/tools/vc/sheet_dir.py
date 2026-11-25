import sys, glob, os
from PIL import Image, ImageDraw
d = sys.argv[1]; per = int(sys.argv[2]) if len(sys.argv) > 2 else 6; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 2
fs = sorted(glob.glob(d + '/t*.png')); ims = []
for f in fs:
    im = Image.open(f).convert('RGB'); 
    if im.width > 960: im = im.resize((960, int(im.height * 960 / im.width)))
    dr = ImageDraw.Draw(im); dr.rectangle([0, im.height - 22, 150, im.height], fill=(0, 0, 0)); dr.text((6, im.height - 18), os.path.basename(f)[1:8] + 's', fill=(255, 255, 0)); ims.append(im)
for k in range(0, len(ims), per):
    g = ims[k:k + per]; w, h = g[0].size; rows = (len(g) + cols - 1) // cols; sh = Image.new('RGB', (w * cols, h * rows))
    for j, im in enumerate(g): sh.paste(im, ((j % cols) * w, (j // cols) * h))
    out = f'{d}/sheet_{k // per:02d}.jpg'; sh.save(out, quality=86); print(out, sh.size)
