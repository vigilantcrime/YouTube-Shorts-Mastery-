# "Roddy Games" format: reverse-engineered spec

Sources: three Shorts by Roddy Games: **R1** "New GTA 6 clip recreates real Miami street" (45.4s), **R2** "Nobody walking around in GTA 6 is just filler" (46.1s), **R3** "GTA 6 TV show Macca and Friends" (46.9s).
All three are 720×1280 at 30 fps.

How these were measured: frame-by-frame analysis (cut detection, colour), 1 fps and 10 fps contact sheets, the speech model for word timing, and `ebur128` for loudness.

> This copies the **editing style**, not their assets. We use our own footage, cards and emblem. See §6 for the logo.

---

## 1. The numbers

| | R1 | R2 | R3 | Target for us |
|---|---|---|---|---|
| Length | 45.4s | 46.1s | 46.9s | **40–47s** |
| Speech rate | **204 wpm** | 184 wpm | 191 wpm | **185–205 wpm** (fast, no pauses) |
| Cuts | 25 | 31 | 30 | about 1 cut per 1.5s |
| Average shot | 1.74s | 1.44s | 1.51s | **1.5s** |
| Median shot | 1.12s | 1.08s | 1.33s | 1.1–1.3s |
| Shortest shot | 0.37s | 0.17s | 0.07s | flash cuts of 0.1–0.3s in montages |
| Loudness | −17.8 LUFS | −18.0 | −18.0 | **−18 LUFS** (quieter than our −14; the voice dominates and the music is a low bed) |

---

## 2. The building blocks (they repeat in every video)

1. **Logo emblem sting (0.0–1.1s or up to 1.9s).** Details in §6.
2. **Word-chunk captions.** 1–3 words at a time, each on screen about 0.3–0.5s, swapping exactly on the spoken word.
   - **Font:** heavy rounded geometric sans, ALL CAPS, small (about 3.2% of frame height).
   - **Position:** centred horizontally, at **about 69% of the height**.
   - **Colour:** white with a soft shadow. **One key word per chunk** is coloured **yellow #FFD400** (names, "GTA 6", "THE GAME") or **magenta #FF2FA8** (verbs and emphasis: "DROPPED", "PINK", "ANIMATION").
   - **Animation:** none, they simply hard-swap. That's the "snappy" feel.
3. **The Vice City gradient stage.** A radial gradient: warm orange-pink at the top centre (#FF9A5A → #FF4FA8), fading to deep violet at the bottom (#6A2BD8 → #2A0D4A). This is where every "card" moment lives.
4. **Card pop-ins.** A footage clip or screenshot inside a rounded card (radius about 18px, 3px white border, big soft shadow) with a **slight 3D tilt** (rotateY about −8°).
   - **Entry:** slides or scales in over 3–4 frames with motion blur.
   - **While on screen:** a gentle float of about 2% scale over the shot.
5. **Side-by-side proof.** Two cards next to each other, labelled **"REAL LIFE" | "GTA 6"** (or "GTA 5" | "GTA 6") in small white caps above. The second card slides in about 0.4s after the first.
6. **Highlight boxes and number badges.**
   - **Boxes:** thin pink rounded rectangles track the subject.
   - **Badges:** yellow circles count up (1… 6) as the voice says "one by one".
7. **Icon pops.** Rockstar logo, game box art or a brand mark bounces in at the top centre (scale 0 → 1.15 → 1 over 6 frames) exactly on the noun.
8. **Number moments.**
   - **Odometer roll:** "600,000+".
   - **Comparison bar:** "×11".
   - **Progress bar with tick:** "15 HOURS ✓".
   - **Calendar strip:** MON–SUN, then "168 H".
9. **Article / tweet cards.** A white browser or post card pops in, and a **yellow highlighter sweeps across the quoted words in sync with the voice**.
10. **Tag chips over gameplay.** "MOVE #1, #2, #3… #31" pink chips: a rapid montage with 0.27s cuts.
11. **Map zoom.** A flat stylised map with a pin, zooming to the city.
12. **Recap collage.** All the cards from the video scattered on the gradient (bookend before the CTA).
13. **Subscribe ending (about 2s).**
    - A red **Subscribe** button pops in.
    - A cursor clicks it and it flips to a grey **🔔 Subscribed** pill.
    - The captions read "SUBSCRIBE · FOR MORE · GTA 6 · UPDATES".

---

## 3. Hook formula (first 3 seconds)

- R1: "**Another GTA 6 clip just dropped** and I swear it…"
- R2: "**Nobody walking around in GTA 6 is just filler.**"
- R3: "**Don't skip the TV in GTA 6** because Rockstar…"

**Rule:** "GTA 6" in the first sentence, plus a specific claim that opens a loop. The voice starts on frame 0, with no silence and no music intro.

---

## 4. Second-by-second

Format: `second · caption chunk · what's on screen`.

### R1: real Miami street clip (45s)
| s | Caption | Visual |
|---|---|---|
| 0 | ANOTHER **GTA 6** | **Logo sting** over gameplay (arena + cars) |
| 1 | CLIP JUST | Logo fades and scales out at 1.1s, gameplay continues |
| 2–3 | AND I SWEAR / IT LOOKS LIKE | **Tweet card** pops in over the blurred gameplay (blur-whip entry) |
| 4–5 | ON THEIR PHONE / IN **MIAMI** | Gameplay full screen |
| 6–9 | CUSTOM CARS / THAT WERE DRIVING / LAST MONTH / THE **PINK CORVETTE** | Real-life footage cut every second, **highlight box** on the corvette |
| 10 | THE **POLICE LAMBO** | **Card** on the gradient (blur-in 0.1s), with a box on the car |
| 11 | THE OLD | Real lowrider |
| 12–18 | WITH **GOLD RIMS** … THAT **EXACT MOMENT** IS IN | Card on gradient (one shot held about 7s, the card changes clip) |
| 19 | THE **GAME** | Gameplay full screen |
| 20–28 | BOTH VIDEOS … **SAME ORDER** … MINIVAN | **Side-by-side REAL LIFE / GTA 6**, number badges 1→6 |
| 29–30 | WEREN'T JUST / CRUISING AROUND | Real footage |
| 31–32 | AND THAT ARENA / ALREADY HAS | Gameplay at night |
| 33–34 | A **WELCOME TO** / SIGN ON | Tilted card on the gradient |
| 35–37 | BACK IN / **GTA 5** DAYS / ROCKSTAR BUILT | Gameplay, then **box-art icon pop**, then **Rockstar icon pop** |
| 38–39 | **ONE** REAL CAR / CUSTOMS | Card, plus a brand badge pop |
| 40–41 | THIS TIME / IT'S **SIX** | Cards fly in into a **grid of 6** with a "6" badge |
| 42 | ALL IN / THE **GAME** | **Logo bookend** on the gradient |
| 43–44 | SUBSCRIBE / FOR MORE / **GTA 6** | Subscribe button, cursor click, "Subscribed" |

### R2: "Nobody walking around is filler" (46s)
| s | Caption | Visual |
|---|---|---|
| 0–1 | NOBODY / WALKING / AROUND IN / **GTA 6** | **Logo sting** over beach gameplay (exits at 1.9s) |
| 2 | IS JUST | Gameplay with NPC mini-cards |
| 3 | **ROCKSTAR** MADE | Rockstar icon pop |
| 4–7 | OVER **600,000** / ONLY FOR / ON THE | **Odometer roll** to "600,000+", which then sits as a top label |
| 8–10 | **GTA 5** HAD / **55,000** | Box-art pop, a counter, then a **×11 bar** |
| 11–15 | ACTING OUT … **EVERY SECOND** … NONSTOP … WITH NO SLEEP | **"MOVE #1/#2/#3/#8/#31" chips**, 0.27s flash cuts |
| 16–18 | **GTA 5** / YOU ABOUT / **15 HOURS** | Card with a **progress bar**, then a tick ✓ |
| 19–21 | **GTA 6** / YOU / **A WHOLE WEEK** | **MON–SUN calendar strip**, then "168 H" |
| 22–24 | OPENED A / IN **LA** / THESE PEOPLE | Rockstar icon, then **map zoom to LA** |
| 25–27 | AND SOMEBODY / EVERY / SINGLE ONE | **Polaroid grid** of NPC faces |
| 28–29 | OF THEM HAS / A **PERSONALITY** | NPC with a **stat-card** overlay |
| 30–32 | **ROB NELSON** / **NORTH** / KEPT ASKING | Interview card on the gradient, then a studio icon pop |
| 33–36 | WHO'S / **AGGRESSIVE** / GOING TO GO / FOR A **WEAPON** | Gameplay, then a card with a weapon icon |
| 37–41 | DIDN'T JUST / STREETS / SOMEBODY / **EVERY PERSON** / YOU WALK PAST | Beach crowd with **highlight boxes** on the people |
| 42 | AND TO ME | Polaroid frame |
| 43–45 | SUBSCRIBE / **GTA 6** / UPDATES | Subscribe, click, Subscribed |

### R3: "Macca and Friends" (47s)
| s | Caption | Visual |
|---|---|---|
| 0–2 | DON'T SKIP / THE **TV** / IN **GTA 6** | **Logo sting** over a cartoon character on a TV (glint at 0.3s, flash at 0.4s) |
| 3 | **ROCKSTAR** MADE | Rockstar icon pop |
| 4–7 | **CARTOON** / IT'S CALLED / AND **FRIENDS** / FIRST **TRAILER** | Cartoon clip, then the show's title card |
| 8–14 | JUST **DROPPED** … IN **LEONIDA** … WITH A **CRAB** … AND A | Cartoon clips, 1s each, **name tag "CHUNKEE"** pop |
| 15–19 | IT AIRS ON / **WEAZEL** / TV CHANNEL / **NOVEMBER 19TH** | Cards on the gradient |
| 20 | COMES OUT | Game box card |
| 21 | TOLD | Rockstar icon on the cartoon |
| 22–24 | THEY HIRED / **ANIMATION** / STUDIO | **Article card with a highlighter sweep** in sync |
| 25–29 | ON THE / AND THESE / GUYS WERE / PLAIN SIGHT / **ROCKSTAR'S** | Empty gradient beat, then the product box card |
| 30–31 | **COLLECTOR'S** / COMES WITH | **Price tag "$399.99" pop** |
| 32–38 | FIGURE / **FLAMINGO** / SHOT GLASS / THE MANATEE / AND ROCKSTAR / SELLS MACCA | Product cards with a **circular inset zoom** |
| 39–41 | AS MERCH FROM / **LEONIDA'S** / **HIT TV SHOW** | Article cards with highlights |
| 42–43 | THIS **GATOR** / WAS ON | **Recap collage** of every card |
| 44–46 | SUBSCRIBE / **GTA 6** / UPDATES | Subscribe, click, Subscribed |

---

## 5. Shot grammar (the rules underneath)

1. **Alternate three looks:**
   - **A:** full-screen footage.
   - **B:** a card on the Vice City gradient.
   - **C:** an overlay on footage (icon, counter, box).

   Never stay in one look for more than about 3 visual changes.
2. **Change the picture on every noun.** If the voice names a thing (car, studio, number, date), something new appears on that word.
3. **Every claim gets proof on screen:** a tweet, article, interview card, side-by-side or highlight box.
4. **Numbers are always animated:** odometer, bar, progress or calendar. Never static text.
5. **The middle has one "explain" stretch,** about 5–8s on the gradient with cards, for the main proof.
6. **Bookend:** the logo or a recap collage returns at about 42s, then the 2s subscribe ending.
7. **Captions never carry full sentences.** 1–3 words, hard swaps, one coloured key word.

---

## 6. The logo emblem sting (how to rebuild it exactly)

Measured from all three intros at 10 fps:

| Time | What happens |
|---|---|
| 0.00s | The emblem is already on screen (no fade-in). It's centred in the upper half, **about 62% of the frame width**, over the first gameplay shot. The VO and the first caption chunk start on the same frame. |
| 0.00–1.0s | The emblem is **tilted in 3D** (rotateY about −12°, rotateX about 6°) and drifts slowly (yaw of about ±3° plus a slight bob). |
| 0.2–0.45s | A **diagonal light glint** sweeps across the emblem from top-left to bottom-right: a white band at about 35° with a soft edge, at about 70% opacity, masked to the emblem's shape. In R3 a soft white **screen flash** (about 40%) coincides at 0.4s. |
| 1.0–1.15s (R1) or 1.8–1.95s (R2) | **Exit:** the emblem scales down to about 85%, blurs to 20px and fades out over 3–4 frames, revealing the footage underneath. The footage keeps playing, with no cut. |
| bookend (R1 at 42s) | The same emblem reappears, centred on the gradient, with a recap-card scatter collapsing into it. |

**The emblem itself.** They use the official GTA VI logo. For our channel I recommend **our own "Vice City Sin" emblem** in the same treatment: a bold logotype on a gradient "V"-style badge with a white outline and a drop shadow. That gives you brand recognition from frame 0, and it doesn't re-create Rockstar's trademarked artwork. If you want the official logo anyway, send a PNG and the same sting will use it.

---

## 7. What I need from you per video, and what you get

**You send:**
1. **The voiceover MP3** at 185–205 wpm (tell ElevenLabs to read fast, with no pauses), with a hook that has "GTA 6" in the first sentence.
2. **Footage and screenshots:** gameplay or trailer clips, real-life clips, tweets and articles (screenshots), product shots, interview stills. Name them roughly in the order of the script, if possible.
3. *(optional)* Your emblem PNG.

**I deliver,** automatically from the word timings:
- The logo sting with its glint, captions in 1–3-word chunks with the yellow/magenta keyword rule, and a cut or visual change on every noun.
- The A/B/C look rotation, cards with tilt and float, side-by-sides with REAL LIFE/GTA 6 labels, highlight boxes and badges, icon pops.
- Animated numbers, article highlighter sweeps, the recap collage, and the subscribe-click ending.
- The audio mixed to −18 LUFS with the voice on top, rendered at 1080×1920 and sized to send first time (under about 28 MB).
