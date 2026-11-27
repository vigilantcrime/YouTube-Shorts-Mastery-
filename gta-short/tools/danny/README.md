# Danny barber video: glitch patching

The 3D world is kept wherever it looks right. A shot is swapped for an explainer scene (flat cast, line icons,
word-synced captions on the video's own navy background, HUD kept) only where something visibly breaks:
hands passing through or floating around objects (clippers, phone, mug, broom, money, till, tin), large cracked
ball hands, blown-out faces, the lone finger, the camera inside the car.

- `asr.py` – word timings of the voiceover (sherpa-onnx zipformer) → `words.json`
- `glitchscan.py` – per-shot flicker scan (sign-flip of frame differences), used as a lead list only
- `make_scenes.py` – the 40 replacement windows (`SELECT`) and what each explainer shows → `src/danny/ex/scenes.json`
- Remotion composition `DExAll` (`src/danny/ex/Ex.tsx`) renders all windows back to back
- `track_build.py` – places them on a full-length track at their original frame positions
- `final_cmd.py` – 2-pass x264 splice over the original (audio copied), plus the invisible 3D fixes
  (sinking head retime, title red block, map flash frame, boot squares, coast car direction + headlights)
- `verify_v2.py` – frame checks inside and at both edges of every window
