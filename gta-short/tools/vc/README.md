# VC long-form tooling (working scripts, not a package)
Paths inside point at the session scratchpad; adjust `SB`/`BASE` at the top of each script.
- `music_lf.py cues.json vo1.wav out_prefix dur [full vo2.wav]` — original music + cue-driven SFX + VO mix (cues come from `src/vc/cues_dump*.ts` bundled with esbuild).
- `make_srt.py [p1|full]` — captions aligned to the ASR word timings (`src/vc/*_words.json`).
- `render_p1.sh [crf]` — resumable segmented 4K render (`--scale=2`, PNG frames, HEVC, video only).
- `stills.sh`, `sheet_dir.py`, `qa_sheets.py` — half-res stills and contact sheets for layout QA.
