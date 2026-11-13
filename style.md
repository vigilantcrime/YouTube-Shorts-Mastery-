# Reference style breakdown: "Comment GTA" (Riccardo Bosso)

Source: `Riccardo_Bosso__Comment__GTA__to_receive_the_full.mp4`. This is the uploaded file; the repo has no `reference/` folder.
Specs: **59.42 s · 720×1280 (9:16) · 30 fps · AAC**. Every frame is a 3D render: a stylised low-poly Miami diorama, with no live-action footage.

How these numbers were measured:
- Every frame was analysed with OpenCV: HSV histogram distance for cuts, Farneback optical flow for motion and zoom, Laplacian variance for blur, and luma, saturation and RGB means.
- Audio was analysed with librosa (beat tracking, percussive onsets, a <120 Hz bass envelope) and ffmpeg `ebur128`.
- Voiceover word timestamps come from a local speech model (sherpa-onnx Zipformer).
- Every cut was then checked by eye on 4 fps timestamped contact sheets, plus full-resolution frames at 2.6 / 7.6 / 12.6 / 27.2 / 47.2 / 52.6 / 53.5 / 56.6 s.

All times below are in seconds from the start of the video.

---

## 1. Cuts and shot length

**35 shots, 34 transitions. Average shot length 1.70 s, median 1.23 s, shortest 0.20 s, longest 5.30 s.**

| # | In | Dur | What's on screen | Transition **into** this shot |
|---|----|-----|------------------|-------------------------------|
| 1 | 0.00 | 3.50 | Street queue, counter 4,074,197 → 6,000,000+, dolly toward "COMING" shutter | – (opens mid-motion) |
| 2 | 3.50 | 0.50 | Padlock close-up on shutter | hard cut, push-in continues |
| 3 | 4.00 | 0.80 | Logo + "NOV 19" sign, "NOT EVEN OUT." | zoom-blur whip (out) |
| 4 | 4.80 | 4.20 | Box-office towers: $2.93B vs WEEK 1 $3.25–5.2B | **white flash** |
| 5 | 9.00 | 2.87 | Isometric deco block on cream background, star badge fills 1→3 | hard cut |
| 6 | 11.87 | 1.20 | Camera drops to street: "SAY NOTHING" painted on road | tilt-down motion blur (9 frames) |
| 7 | 13.07 | 2.60 | Newswire article scrolling | **vertical whip** (peak 30 px/f) |
| 8 | 15.67 | 0.86 | Zoom to highlighted quote (yellow highlight) | zoom blur |
| 9 | 16.53 | 2.40 | Shutter with "488 DAYS" ticker | hard cut |
| 10 | 18.93 | 1.00 | 3D play-button icon | hard cut |
| 11 | 19.93 | 2.47 | Particle burst → ring counter 90,421,491 "3 WORLD RECORDS" | hard cut + particle burst (**music drop**) |
| 12 | 22.40 | 0.77 | Star block callback, 2 stars | hard cut |
| 13 | 23.17 | 1.03 | "NEVER RUSH" painted on road | tilt-down motion blur (8 frames) |
| 14 | 24.20 | 1.23 | Calendar: FALL 2025 crossed out → 26 MAY → 19 NOV 2026 | hard cut |
| 15 | 25.43 | 2.17 | TTWO stock line −7% / −8% → red "WASTED" + grey-out at 27.0 | whip (5 frames) |
| 16 | 27.60 | 1.20 | Apology cards "SORRY ×3" | hard cut |
| 17 | 28.80 | 1.20 | Cards fly away → logo hero | fly-through blur (4 frames) |
| 18 | 30.00 | 1.63 | Game box in rain-grid void | hard cut |
| 19 | 31.63 | 3.90 | "RELEASED 2013" tag swings in → pull-out to stack, 190M → 230M+ | hard cut + tag swing |
| 20 | 35.53 | 0.47 | Star block callback, 3rd star filling | hard cut |
| 21 | 36.00 | 1.23 | Night street, neon "GO LOUD" lights up | whip/blur (11 frames) |
| 22 | 37.23 | 0.47 | Bloom-out of the same scene | **pink-white flash** |
| 23 | 37.70 | 2.27 | Living room, push-in to TV (streaming UI) | hard cut |
| 24 | 39.97 | 1.36 | "#1 ON [streamer] 31.1M views" | push-through blur (6 frames) |
| 25 | 41.33 | 5.30 | Skyline: "PAID $975,000" tag → neon "WELCOME TO VICE CITY" builds letter by letter | hard cut |
| 26 | 46.63 | 2.47 | **Black-and-white** diorama "SILENCE." → clock "PATIENCE." | hard cut |
| 27 | 49.10 | 1.33 | Colour back, fireworks, searchlights, "NOISE." | hard cut (**drop**) |
| 28 | 50.43 | 2.47 | Bookend: the opening street again, "IT SELLS THE WAIT." | whip (5 frames) |
| 29 | 52.90 | 0.80 | Black, "Still watching?" | cut to black |
| 30 | 53.70 | 0.33 | Editor timeline screen 1 | hard cut |
| 31 | 54.03 | 0.24 | Editor timeline screen 2 | hard cut |
| 32 | 54.27 | 0.20 | Editor timeline screen 3 | hard cut |
| 33 | 54.47 | 0.36 | Wall of thumbnails | hard cut |
| 34 | 54.83 | 2.77 | "Comment GTA" + typed comment box | scale-blur slam |
| 35 | 57.60 | 1.82 | Black end card with creator credit | cut to black |

**Transitions per 10 s:** 0–10 s: 4 · 10–20 s: 6 · 20–30 s: 6 · 30–40 s: 7 · 40–50 s: 3 · 50–59.4 s: 8.

**Transition mix:**

| Type | Count | Share |
|------|------:|------:|
| Hard cut | 20 | 59 % |
| Motion-blur whip / tilt / push-through | 10 | 29 % |
| Flash | 2 | 6 % |
| Cut to black | 2 | 6 % |

There are **no crossfades or dissolves** anywhere.

## 2. How cuts line up with music vs. voice

- **Music:** a continuous bed with no silent gaps. The estimated tempo is **112.3 BPM** (beat = 0.534 s).
- **The cuts are NOT beat-synced:**
  - Only **35 %** of transitions land within ±67 ms (2 frames) of a beat. Random placement would give about 25 %.
  - The mean distance to the nearest beat is **108 ms**.
- **The cuts ARE locked to the voiceover:**
  - **74 %** of transitions land within ±100 ms of a word onset.
  - The median offset is **−20 ms**, so the cut arrives about half a frame *before* the word.
  - The cut almost always lands on the **first word of a new clause**: "ANALYSTS", "ROCKSTAR", "THEN", "WHEN", "DROPPED", "RULE", "NEVER", "DELAYED", "MEANWHILE", "SILENCE", "NOISE", "STILL", "COMMENT".
  - Exact cases at 0 ms: 4.00 "NOT", 9.00 "ROCK(star)", 30.00 "MEANWHILE".
- **Lead-ins:** the largest deliberate lead is **−250 ms**, at 46.63 before "SILENCE". The picture goes black-and-white a quarter-second before the word, so you *see* the silence first.
- **The music is used for structure, not cut timing:**
  - It has two **bass drop-outs**, each ending in a drop:

    | Drop-out | <120 Hz energy during | Drop lands | Energy at drop | Word at drop |
    |----------|----------------------|-----------:|---------------:|--------------|
    | 13.5–19.5 s ("say nothing… went quiet") | 2–32 (normal is 100–350) | 20.0 s | 357 | "DROPPED" |
    | 47.5–48.5 s ("patience") | 20–27 | 49.0 s | 384 | "NOISE" |

  - The drop-outs illustrate the script literally: the music goes quiet when the narration talks about silence.
- **Mix loudness:** −17.1 LUFS integrated, with a loudness range of **2.8 LU**, which is heavily compressed. The voice sits clearly above the bed.

## 3. Speed changes

Everything is CG, so there is **no slow-motion footage and no speed-ramped clips**. Speed is controlled through eased camera moves and animated numbers.

- **Whip profile** (optical-flow magnitude in px/frame at 180 px width):
  - At 13.07: `1.0 → 1.7 → 11.5 → 25.4 → 30.4 → 17.2 → 18.7 → 8.0 → 2.2 → 0.8`.
  - So the camera accelerates over 2 frames, peaks at about **17 % of frame width per frame**, then decelerates over 3–4 frames.
  - **Total whip: 6–8 frames (0.20–0.27 s).**
  - The other whips measured: 25.43 peaks at 13 px/f; 36.00 peaks at 10.7 px/f and holds for about 8 frames; 50.43 peaks at 13.9 px/f.
- **Number tickers:** these ease out with fast initial digits and a slow landing.

| Ticker | Time | Duration |
|--------|------|---------:|
| 4,074,197 → 6,000,000+ | 0.00–0.75 | **0.75 s** |
| 488 → 668 DAYS | 16.75–18.50 | **1.75 s** |
| 50,000,000 → 90,421,491 | 20.25–20.75 | **0.50 s** |
| 190M → 230M+ | 33.25–35.00 | **1.75 s** |
| $0.00B → $2.93B | 5.25–5.75 | **0.50 s** |

- **Slow beats** where the camera nearly stops (mean flow < 0.9 px/f):

| Shot | Time | Flow (px/f) |
|------|------|------------:|
| "488 DAYS" | 16.53 | 0.53 |
| "SILENCE / PATIENCE" | 46.63 | 0.69 |
| "IT SELLS THE WAIT" | 50.43 | 0.92 |
| "Comment GTA" | 54.83 | 0.55 |

  The pace deliberately slows on the lines that carry the meaning.

## 4. Zooms, shakes, flashes, transitions

- **Constant camera motion:** **31 of 35 shots** have a moving camera. The only static shots are black or end cards.
- **Zoom direction and strength:** measured as mean radial flow in px/frame at 180 px width. Roughly, +0.5 ≈ 0.5 % scale per frame ≈ 15 %/s; 3D parallax inflates these values.
  - **Push-in** is most common. Typical values are +0.2 to +0.7. Strongest: Netflix-style TV push +1.16 (37.70), star block +0.71 (22.40).
  - **Pull-out** is used for reveals: −1.71 (4.00, lock → sign), −1.00 (37.23, GO LOUD bloom), −0.90 to −1.38 (53.7–54.8 editor montage).
- **Shake:** **none.** All camera paths are smooth eased curves, with no handheld or impact shake.
- **Flashes:**
  - **4.80 s:** luma jumps **128 → 250** for 1 frame, then decays 159 → 103 over 3 frames (about 100 ms).
  - **37.23 s:** pink-white bloom, luma **159 → 228 → 200** over 3 frames, on the word "LOUD".
- **Light sweeps / glints:** a glint passes across logos and plaques at 8.50, 22.0–22.25 and 29.25. It reads as a sparkle on reveal.
- **Black frames:** at 52.90 (luma 117 → 0.5, a hard cut to black) and at 57.60 (end card). The **"Still watching?" retention beat** sits on black.
- **Colour switch as a transition:**
  - 27.0 "WASTED": saturation drops to about 26 and red text appears. This parodies the game's death screen.
  - 46.63 "SILENCE": saturation **21** (the whole frame is nearly greyscale), returning to **114** at 49.10 "NOISE".

## 5. Text and captions

There are **no running subtitles.** Instead there are **key-phrase titles** (one to four words) plus **data callouts**.

- **Font:** heavy geometric neo-grotesk (SF Pro Display Heavy / Inter Black class), with tight tracking. ALL CAPS for headlines; sentence case for the CTA ("Comment", "Still watching?").
- **Sizes** (cap height on the 1280-tall frame, with the 1080×1920 equivalent):
  - **Hero headline** ("6,000,000+", "IT SELLS THE WAIT.", "SILENCE."): **62–70 px**, about **5.2 % of height**. At 1920 that is about 95–105 px cap height, roughly a 130–140 px font size.
  - **CTA keyword "GTA":** about **140 px** cap height (**11 % of height**), roughly a 280 px font at 1920.
  - **CTA lead word "Comment":** **70 px** (5.5 %).
  - **Sub-line** ("PEOPLE ALREADY BOUGHT"): **27 px** (2.1 %), about a 55 px font at 1920.
  - **Data label** ("WEEK 1:", "$2.93B"): 40–52 px.
  - **Source / citation line** ("est. digital pre-orders · Sensor Tower · Oct 2026"): **13 px** (1 %), white at about 70 % opacity. **Every number on screen carries a source line.**
- **Positions:**
  - **Hero headlines** are centred horizontally, with their vertical centre at **68–76 % of height**: lower third, but above the platform UI zone.
  - **Data labels** sit at the top, at **18–24 % of height**.
  - **The CTA** is centred at **36–56 %**.
  - **The "Still watching?" beat** is dead centre, at about 47 %.
  - Text width stays within about 85 % of frame width.
- **Colour:**
  - Base text is **#FFFFFF**, with a soft dark drop shadow (about 30–40 % black, blur 8–12 px).
  - **One accent word per line** gets a **pink gradient**: "BOUGHT", "WAIT.", "GTA", "+".
  - Sampled gradient stops: dark end **#C05366**, mid **#ED7B8C**, light end **#FA9DE0** (rose → pink → lilac, running top-left to bottom-right).
  - Negative numbers use hot pink/red ("−7 %").
  - "WASTED" is bright red with a dark outline.
  - Highlighted quotes use a yellow marker (**#F5B700**-ish) behind black text.
- **Animation:**
  - **Word-by-word reveal timed to the voice.** Each word fades and un-blurs in over about **6–8 frames (0.2–0.27 s)**. Example: "PEOPLE" at 0.75, "ALREADY" at 1.50, "BOUGHT" at 2.25.
  - **Accent words** arrive last, in gradient.
  - **CTA keyword** slams in: it starts at about **1.4× scale with heavy blur** at 54.75 and settles to 1.0 by 55.00 (about 8 frames).
  - **Comment box** types "GTA" from 55.25 to 55.75, then a heart pops at 56.00.
- **Text inside the 3D world** is a signature move. "SAY NOTHING", "NEVER RUSH" and "GO LOUD" are painted on the road, and "WELCOME TO VICE CITY" is a neon sign built letter by letter from 43.25 to 44.25. The camera **tilts down onto the road text**, so the transition itself reveals the line.

## 6. Colour grade, filters, grain

- **Overall averages:** luma **90 / 255** (low-key) · luma standard deviation **52.5** (punchy contrast) · saturation **102 / 255** (40 %).
- **Tint:** the overall RGB mean is **R 106 / G 82 / B 91**. Green is pulled down and red and blue are pushed up, giving a **magenta / synthwave cast**.
  - Warm shots run up to R−B **+58** (sunset "NOISE").
  - Night shots run near 0 to −15 (cool violet).
- **Palette:** sunset orange-to-magenta skies, violet voids with a magenta neon grid floor, pastel art deco (mint #A8E0C8 / salmon pink) for the "rule" blocks, and **cream #F2EBDD** backgrounds for the flat isometric scenes.
- **Saturation by section:**

| Section | Saturation (/255) |
|---------|------------------:|
| Rule-1 article scenes | 30–60 (deliberately pale) |
| Neon / data scenes | 130–160 |
| "SILENCE" (B&W) | **21** |

- **Glow and bloom:** strong glow on neon and highlights, a mild lens glint on logos, and shallow depth of field (tilt-shift blur) on the diorama shots.
- **Grain / noise:** **none.** The mean frame-to-frame difference on static frames is **0.43 levels**, which is a clean CG render plus compression. There is no film grain, VHS effect, scanlines or vignette beyond the natural falloff of the lighting.

## 7. Hook structure (first 2 seconds)

- **Frame 0 is already mid-move.** The camera is dollying along a neon-lit queue of colourful figures at sunset, with no title card, logo or black frame.
- **The voice starts at 0.00:** "Six million people have already bought GTA 6". The audio RMS jumps 73 → 256 by 0.5 s.
- **The number on screen counts while you watch:** **4,074,197 → 5,717,180 → 5,987,165 → 6,000,000+** in **0.75 s**. It lands as the voice says "people" (1.08 s).
- **The sub-line builds word by word** in sync with the voice: PEOPLE (0.75) → ALREADY (1.5) → **BOUGHT** (2.25, pink accent). A source line follows.
- **The music bass enters at 0.5 s.**
- **The "big number + paradox" formula:** at 3.5–4.8 s comes "and it's not even out", over a padlock close-up and a whip to "NOT EVEN OUT." The hook is a 4.8 s setup that ends on a **white flash**.

## 8. Pacing and energy

1. **0–9 s: Hook and stakes.** Average shot 2.25 s, with long data reveals and one flash.
2. **9–19.5 s: Rule 1 "Say nothing".** The bass drops out completely (13.5–19.5) and the visuals turn pale and flat (cream backgrounds, article screenshots). Tension comes from **removing** energy; the "488 DAYS" counter ticks in near-silence.
3. **19.93 s: First drop.** "When the first trailer **dropped**": a particle burst, a world-record counter and bass back at full energy (357).
4. **22–35.5 s: Rule 2 "Never rush".** The fastest middle section, with **7 transitions in 30–40 s**. Calendar flips, a stock crash with "WASTED", "sorry ×3", sales stacking up.
5. **36–46.6 s: Rule 3 "Go loud".** A pink flash on "LOUD", a push into the TV, then a **5.3 s hold** (the longest shot) for the neon "WELCOME TO VICE CITY" build. A deliberate breather.
6. **46.6–49.1 s: Recap and second drop.** "SILENCE." in black and white, then "PATIENCE." (ticking clock) with the bass out, then **"NOISE." at 49.10**: colour, fireworks and searchlights, with bass at its peak (384).
7. **50.4 s: Bookend.** A whip back to the **exact opening shot** for the thesis line: "IT SELLS THE WAIT."
8. **52.9–59.4 s: Retention and CTA.** A cut to black for "Still watching?", then the **fastest cuts in the video** (0.20–0.36 s, 4 cuts in 1.13 s) through editor screens, then the "Comment GTA" slam and typed comment, then a 1.8 s black end card.

**Energy recipe:** build → strip it out to silence → drop on the payoff word → speed up → hold on the spectacle → recap → bookend → black → rapid flurry → CTA.

**Recurring devices:**
- A **3-star rating badge** fills one star per rule (10.25, 22.5, 35.5, 46.75): a progress bar the viewer can read.
- Every claim gets **a number and a source**.
- **Every section opens with a new location** but returns to the same diorama world.

---

## Translating this to our 20 s short (for the next step)

| Reference | Our 20 s version |
|-----------|------------------|
| ASL 1.70 s / median 1.23 s | **About 12–14 shots in 20 s** (ASL about 1.5 s): denser, since the hook-to-CTA arc is shorter |
| Cuts on the first word of each clause, −20 ms lead | Cut 1 frame before each clause start in our voiceover word timings |
| 2 bass drops (on "dropped" and "noise") | 1 drop on **"It was GTA 6"** and a pre-drop silence under "It wasn't" |
| White flash, 1 frame peak plus 3-frame decay | Use once, on the reveal |
| Whips of 6–8 frames, ease in and out | Between the 3 Higgsfield clips plus our coded scenes |
| Hero text: white, about 100 px cap at 1920, centred at 70 % height, one pink-gradient word | Same: Inter Black, accent gradient #C05366 → #ED7B8C → #FA9DE0 |
| Word-by-word fade and un-blur, 6–8 frames | Same, driven by our word timestamps |
| Source line under every stat (1 % height, 70 % white) | e.g. "Only In Dade · Instagram · Nov 2026" |
| B&W desaturation for contrast beats | "Real or AI?" moment |
| Bookend + black "Still watching?" + typed comment CTA | Close on the question with a "Comment REAL or GAME" box |
| Magenta tint, R>G by about 24, no grain | Grade our clips to match: lift magenta, pull green, no grain |

**Note:** the reference uses the official GTA logos and box art. Our version should **not** copy those assets, or this creator's diorama renders. We match the *editing grammar* (timing, typography, pacing) with our own footage and graphics.
