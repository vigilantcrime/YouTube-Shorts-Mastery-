# VC long-form tooling (working scripts, not a package)
Paths inside point at the session scratchpad; adjust `SB`/`BASE` at the top of each script.
- `music_lf.py cues.json vo1.wav out_prefix dur [full vo2.wav]` — original music + cue-driven SFX + VO mix (cues come from `src/vc/cues_dump*.ts` bundled with esbuild).
- `make_srt.py [p1|full]` — captions aligned to the ASR word timings (`src/vc/*_words.json`).
- `render_p1.sh [crf]` — resumable segmented 4K render (`--scale=2`, PNG frames, HEVC, video only).
- `render_v2.sh COMP BUNDLE OUTDIR FIRST_SEG TOTAL_FRAMES [crf]` — same, 900-frame segments, used for the v2 render (`VcPart1` frames 0–7199 are pixel-identical to `VcFull` frames 0–7199, so the joined cut takes Part 1 segments 0–7 from either and Part 2 from `VcFull` segments 8–11). Bundle with `npx remotion bundle src/index.ts --out-dir=OUT --public-dir=SMALL_PUBLIC_DIR` (fonts, `vc2/` audio, `ph/` photos only — bundling the whole `public/` is slow).
- `final_encode.sh LIST AUDIO OUT [kbps] [preset]` — joins the CRF-12 masters and does the 2-pass 10-bit x265 delivery encode (4K, about 8.8 Mbps, AAC 320k) that keeps the 5:52 cut under the 400 MiB chat limit. The CRF-12 masters are about 530 MB, which is why the delivery file is a re-encode.
- `stills.sh`, `sheet_dir.py`, `qa_sheets.py` — half-res stills and contact sheets for layout QA.
