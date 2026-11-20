# VIGILANT CRIME — "The Case File" format (UK drill breakdowns, TikTok 9:16)

Episode 1: VC-001 Yanko, "Life of a Rider" (`gta-short/src/VigilantCase.tsx`, 61.3 s)

## Brand system
- **Colours:** police-tape yellow `#FFD400` and evidence red `#E01E37` on a cold, desaturated grade. The footage gets saturate .72 and contrast 1.14, plus a blue multiply, film grain (feTurbulence at 13%) and a vignette.
- **Type:**
  - HeroBlack for captions and stamps.
  - Bold monospace for anything "official": transcripts, forms, CCTV, chrome.
- **Captions:** 1–3 words at y=69%. The key word is set on a strip of tape: black on yellow, or white on red, rotated −2°.
- **Persistent chrome:** a blinking red dot with "CASE VC-001 · mm:ss" on the left, and a yellow "VIGILANT CRIME" badge on the right (y=150). A credit line for the footage sits at the bottom.
- **Sting at 0s:** two crime-scene tapes reading "VIGILANT CRIME · DO NOT CROSS" wipe in across the best close-up, with a "CASE #001 · <ARTIST>" plate. The tapes rip out at 1.5s. The same tape closes the episode.
- 9:16 only. The 4:3 music video is used as a 2560×1920 plate, and each shot is a 1080-wide window into it with its own camera move. No letterbox and no horizontal frames.

## Repeatable devices
| Device | Use it on |
|---|---|
| EXHIBIT A/B transcript card (paper, typewriter, highlighter sweep) | every quoted lyric |
| Hand-drawn marker ring with a label | the object the VO names (face, scarf, gloves, tracky) |
| Rubber stamp (LYRIC, CONFESSION?, HIGH RISK, NOT EVIDENCE…) | the punch word of each claim |
| Evidence board: every supplied frame as a pinned polaroid with red string | "This is <artist>" |
| CCTV HUD with a timestamp that rolls to the stated time | any time or place in the lyrics |
| Split-flap schedule board | routines or plans |
| Evidence bag tag, fingerprint scan ✕ | forensic-sounding lines |
| Risk-assessment form with a meter, plus tick boxes | police and public-safety lines |
| Side-by-side proof cards (A vs B) | comparisons and jokes |
| Verdict gauge, DANGEROUS 😈 ↔ FUNNIEST 😂 | the question at the end, driving comments |
| Comment bubble, then a "+ FOLLOW" tap with a hand, then the closing tape | CTA |

## Retention layer (added after review)
- **Open loop** at 5.4s: "…and EXHIBIT B is worse 💀", paid off at 47.7s.
- **"DRILL LYRICS ON TRIAL ⚖️"** framing chip in the hook.
- **Case progress bar** under the chrome, with markers at 25/50/75/88%, so people stay for the verdict.
- **Impact punch on every key word:** a 7% zoom with shake plus a sub hit (STAB, NURSERY, LINE, NAN, CONFESSION, 3PM, PRINTS, GLOVES, TRACKY, LOUD, RISK, DISAGREE, CHEF, HYGIENE, EVIDENCE, FUNNIEST).
- **Marker rings:** check the ring on a still at its exact frame. Lock it to the subject by putting it inside the same zoom transform, and never let a ring outlive a cut in the source footage.

## Rules
- Mute the music video's audio. Use our own 142 BPM bed with tape-rip, typewriter, stamp and CCTV SFX. Mix at −18 LUFS.
- Satire, not glorification:
  - No weapon graphics.
  - Always show "THESE ARE LYRICS / NOT EVIDENCE".
  - Credit the video's director on screen.
- Cut on clause starts, with a 1-frame 35% white flash on each hard cut. Average shot length is about 2.4s, with on-screen changes inside each shot on every key noun.
- Render 1080×1920 at about 3.3 Mbps so the file stays under 28 MB.

---
# Format 2 — "BARS ON PAUSE" (VC-002, `gta-short/src/BarsBreakdown.tsx`)
- The **real song plays bar by bar** with its own music video, synced because the clip audio is the song. The 9:16 window tracks the artist using keyframes taken from a contact sheet.
- **Live bar HUD:** "▶ LIFE OF A RIDER · YANKO · BAR 0n" with an animated EQ. Karaoke lyrics appear word by word as sung, with key words on tape and pages of 7 words.
- **Each bar ends in a tape-stop PAUSE:**
  - the song's last 0.36s is slowed to a stop
  - the frame freezes and goes VHS blue-grey with scanlines
  - a big ⏸ and a "⏸ PAUSED · BAR n · mm:ss" HUD appear
- **The breakdown uses the owner's own VO**, plus:
  - a SLANG DECODER bar (NITTY, SLIDE, PAGANS, BANGED-OUT, KITCHEN…)
  - a red-pen lyric sheet
  - settings toggles, a checklist, a chat card and stamps
- A ▶ flash and click resumes the next bar.
- **Ending:** a TikTok-style verdict poll (DANGEROUS vs FUNNIEST) over the song's outro, then "+ FOLLOW" with a tap and the closing tape.
- **Lyrics come from transcribing the clip's own audio** (no lyrics site was usable), and only the bars under discussion are shown. The most graphic and explicit bars are skipped.
- **Audio:** song at 0.8, sidechained under the VO; hiss and hum bed during pauses; pause/play clicks; stamp thuds. Mixed to −18 LUFS.

---
# Format 3 — "THE TALLY" (Drill Bar Breakdown EP 2, `gta-short/src/SjTally.tsx`)
- **Signature:** a live scoreboard pinned under the brand bar. Yellow category cells (SPLASH / WHACKED / CHING / SWIM / WING) sit beside a red CLAIMED total. Every count flashes its cell, bumps the number, punches the frame 3.5% and plays a tick.
- **Structure:** VO hook, then "LET'S DO THE MATHS". After that it alternates **▶ THE TAPE · REAL AUDIO** clips (2–3s of the actual bars, with slam words on each hit) with VO maths sections, one gag card each:
  - car-wash sign
  - meal-deal sticker
  - leisure-centre timetable
  - "which wing?" quiz
  - till receipt
  - football squad
  - upload-blocked card
  - phone contacts
- **No marker rings.** Only cuts, counters and cards.
- Footage plays at 0.2–0.5× under the VO, with a new camera move on every sub-shot.
- **4K delivery:** render with `--scale=2` (2160×3840) to an H.264 master, then `libx265 -b:v 3250k -tag:v hvc1` so the file stays under 28 MB.
- **Source quality:** graphics are vector-sharp at 4K, but the footage can only be as sharp as the source. A 640×360 source gives soft footage, so ask for a 1080p or better source when possible.
- On-screen disclaimer: "lyrics are performance, not evidence". Counts are labelled CLAIMED.

---
# Format 4 — "VIGILANT CRIME NEWS" (parody bulletin, `gta-short/src/ZkNews.tsx`)
- Full-screen red BREAKING NEWS slam for the first 2s, then the news chrome: LIVE bug, yellow channel badge, PARODY tag, a white lower-third headline that changes on every beat, a scrolling ticker with running jokes, and a solid bottom panel (which also hides captions burned into source clips).
- One clip per sentence, each with a different move, and a proof card on every claim: victim ID card, real fan-comment screenshot, A&E sign, business card, product listing, voice-note bubble counting to 2:40, analyst stamps, "Seen ✓✓" chat, Instagram story with a heat meter, closing quote card and follow tap.
- VO sped up 1.08× to land on 60s. 4K HEVC delivery as in Format 3.

---
# Format 5 — "LYRICS ON PAUSE" (Drill Lyric Breakdown Pt 2, `gta-short/src/M24Lyrics.tsx`)
- **Background:** a streaming-app lyrics screen. Full-bleed colour gradient (`#9A1A36` → `#4E0B1C`), a header with the song and artist, and a yellow VIGILANT CRIME tape label.
- **Lyrics:** 68 px Inter Display Black, left-aligned. They auto-scroll so the current line sits at y≈440.
  - Words light up white as they're sung.
  - Slang words (packs, lattz, skiz, corn, mash, feds, khalas…) light up yellow.
  - Lines not yet sung are 42% black; sung lines are 62% white.
- **Player bar:** progress bar, times, and ❚❚/▶ buttons. It hides during breakdowns.
- **Footage:** only in small horizontal pop-up cards (700×394, white 5 px frame, ±3° tilt, sliding in from the side). They're synced to the song and placed on key lines, filling about 50% of song time.
- **Pause:** the song tape-stops, then a dark annotation card slides up containing:
  - the "BREAKDOWN · BAR n/4" badge
  - the quoted bar
  - the VO typed word by word in 16-word pages, with key words yellow (this is the caption)
  - slang decoder chips that pop in on trigger words
  - the "THE IRONY" stamp
  - "FOLLOW FOR PART 3" at the end
- **Audio:** song → tape-stop → click → VO over a vinyl/hum bed → play-click → next bar. Mixed to −14 LUFS.
- **Export:** H.264 High at about 2.85 Mbps, 1080×1920 at 30 fps. Flat UI graphics stay crisp at this bitrate, and the file is about 20 MB for 74 s.
