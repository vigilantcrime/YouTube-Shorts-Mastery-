# @imjustgta — Production Blueprint
## "How to get Paul Walker's Fast & Furious car in GTA 6" (16:9 long-form, 5:43)

Built from:
- The reference video supplied on Drive (640×360, 12:50).
- The owner's gameplay recording (1280×714, 14:55).
- Both ElevenLabs voiceovers (3:21 part 1 and 3:22 part 2).

The finished edit was rendered from `gta-short/src/PwLong.tsx` (Remotion composition `PwLong`). This document is the handoff for that edit or any re-cut.

Labels used throughout:
- **[OBSERVED]** means measured or seen in the reference.
- **[EST]** means a closest defensible estimate.
- **[ADAPT]** means my recommendation for @imjustgta.

---

## 1. Reverse-engineered analysis of the reference

### Measured
- **[OBSERVED] Narration density:** about 245 words in the first 60 s. It is near-continuous; only 3 pauses longer than 0.4 s in the first 3 minutes.
- **[OBSERVED] Few hard cuts:** scene detection found only 22 hard cuts in 770 s. The video is not built from cuts. It is one continuous motion-graphics world, and the camera glides between floating panels, so the visual change comes from movement, not cuts. Something new animates on screen roughly every 1–3 s.
- **[OBSERVED] Opening (0–9 s):** pure motion graphics before any screenshot appears.
  - A countdown-style "13 days" card.
  - A Rockstar logo tile flips in, then a fanned row of screenshots, then a website frame showing the screenshot grid.
  - The first full-screen image lands at about 9 s, with a pink title (gang name) over it.
- **[OBSERVED] Hook script:** the stakes and the news hook are in the first sentence ("GTA 6 comes out in 13 days and Rockstar is still showing us new gangs"). By about 20 s the thesis is stated ("gangs in GTA 6 could all be connected").
- **[OBSERVED] Subscribe ask at about 32–38 s:**
  - An animated donut ring fills to "3% ✓ SUBSCRIBED".
  - Then "97%" appears with a fake "subscribe" button.
  - Then "without further ado" leads into item #1 at about 40 s.
- **[OBSERVED] Structure:** numbered segments (gang #1, #2…), each introduced with a "#1" tag on a card. A grid of pink "?" cards flips over to preview what's coming, which works as an open loop and a contents page.

### Visual devices seen in the frames
- **Stage:** a dark violet radial gradient with a faint perspective grid floor and drifting particles. Everything floats on this.
- **Floating screens:** screenshots sit in rounded cards, tilted in 3D (Y-rotation about 8–16°), with a thin white/pink glow outline and a soft drop shadow.
- **Pill tags:** dark navy, rounded, thin white border, uppercase bold small caps with a leading icon (e.g. "◎ FINAL CHAPTER MC", "STREET GANG", "M7 TATTOO").
- **Titles:** very heavy rounded sans, filled with a pink gradient and a white outline (e.g. "MARABUNTA GRANDE", "FINAL CHAPTER MC").
- **Map:** the map is laid flat and tilted. Location pins are avatar circles with label cards, joined by an animated pink route line.
- **Spotlight:** the frame darkens everywhere except an ellipse on the subject (the 0:17 frame).
- **Magnifier:** a white outline box on a detail, joined by a line to an enlarged inset with a pill label (0:57, "M7 TATTOO").
- **Outline ellipses** around people (2:36).
- **Quote / info card:** a dark glass card with a small header ("ROCKSTAR'S DESCRIPTION") and a pink highlighter on key phrases (7:48).
- **Comparison and relationship diagrams:** cards connected by labelled connectors ("BASED ON", "RIVALS").
- **Phone mock-ups, price/edition cards, avatar rows** for characters.
- A **GTA VI logo bug** top-right on full-screen images.

### Why it works
- Because the world is one continuous canvas, every topic change feels like the camera moving rather than a cut, which removes natural exit points.
- Every claim gets a matching visual object: a pill, a pin or a card. Viewers always have something new to read.
- The "?" grid and the numbered order set up a promise of a full list, which keeps people watching to the end.

---

## 2. Visual identity and editing style guide for @imjustgta

### Adaptation [ADAPT]
The reference had almost no gameplay, because GTA 6 wasn't out when it was made. Ours does, so the formula is inverted: **gameplay is the base layer**, and the reference's motion-graphics language goes on top. The purple stage is used only for explanations: the name and comparison, can't-buy, the contents grid, the driver story, price, recap and CTA.

### Palette
| Use | Value |
|---|---|
| Accent pink [EST from frames] | `#FF5FCF` |
| Light pink / outline glow | `#FFB8EC` |
| Violet | `#9B5CFF` |
| Stage centre / mid / edge | `#3B2352` / `#24163A` / `#160C22` |
| "Success / our" accent [ADAPT] (ticks, confirmations) | `#3FF0D0` |
| White | `#FFFFFF` |

### Type [EST]
- The reference titles look like a geometric heavy sans (closest: Gilroy Black or Montserrat Black).
- The build uses **Inter Display Black** for titles and captions, and **Inter Bold** (uppercase, +2 px tracking) for pills.

### Signature elements (built)
| Element | Spec |
|---|---|
| Pill | 34 px, uppercase, 2 px white border, `rgba(22,16,38,.92)`. Hot pills use a pink→violet gradient. Pop-in over 6 f with overshoot 1.6, plus a pop SFX. |
| Title | 96–170 px, pink vertical gradient, 3 px white stroke, glow. Back-ease in over 8 f. |
| Screen | 3D card, rotateY −16…+14°, rotateX 6°, 22 px radius, glow outline. Rises in over 9 f. |
| Stamp | Heavy outlined word, slams from 2.2× to 1× in 4 f with a 6-frame shake, plus an impact SFX. |
| Spotlight | Radial darkening to 78% outside the subject. Fades in over 8 f. |
| Magnifier | White box on the detail, a line to a 2.6–3.4× inset, and a label pill. |
| Chapter bumper | 0.9 s dim, "CHAPTER 0X" plus a pink title. A chapter pill stays top-right afterwards. |
| Brand bug | "@IMJUSTGTA" gradient pill, top-left. |
| Progress bar | 6 px violet→pink bar along the bottom edge. |
| Captions | Bottom-centre, 54 px Inter Display Black on a 72% dark plate, 1–4 words, key nouns in pink. |
| Cut treatment | Every shot change gets a 5-frame blur/scale whip (10 px blur, +5%) and a whoosh. |

### Camera moves (one per shot, rotating so the same move never runs back-to-back)
1. Creep-in 1.04→1.12
2. Pull-out 1.14→1.04
3. Lateral glide ±40 px
4. Snap-settle 1.28→1.06 in 7 f
5. Rise ±25 px
6. Handheld drift
7. Slow roll ±1°

---

## 3. Timestamped edit, line by line (as built)

### VO structure (5:43)
| Section | Time in video | Source |
|---|---|---|
| A | 0:00–1:22.7 | Part 1, from the hook up to "flick the radio onto Flash…" |
| B | 1:23.0–4:45.4 | All of part 2: ride commentary, Paul Walker tribute, franchise, scenery, comment poll, driver update, arrival, garage, car confirmed |
| C | 4:45.7–5:42.7 | Part 1 from "Now here's my advice": the escape, the crash, recap and CTA |

Part 1's own arrival-to-confirmed walkthrough (its 1:23–2:24) is dropped. Part 2 narrates the same steps in more detail, and keeping both would repeat the walkthrough.

### Section B treatments
| Time | Script | Picture | Overlay / FX |
|---|---|---|---|
| 1:23 | "Here's a tip… save your game… spoiler alert, it went wrong for me." | Taxi chase cam | Pills TIP FOR THE RUN, SAVE YOUR GAME FIRST; stamp "SPOILER: IT WENT WRONG" |
| 1:30 | "Take the taxi… battered car, police on your back…" | Bridge drive | Pills TAXI > DRIVING YOURSELF, BATTERED CAR, POLICE ON YOUR BACK, ARRIVE IN ONE PIECE |
| 1:39 | "Let's talk about the man himself…" | Stage: garage screen | Card PAUL WALKER as Brian O'Connor; pills HEART OF THE SERIES, ALONGSIDE DOM; on "2013", a 🕊️ card |
| 1:55 | "Furious 7… the ending…" | Stage | Title FURIOUS 7; split-road graphic where two cars part on "splitting"; quote card with the highlighter on "most famous tributes in cinema"; pills "SEE YOU AGAIN" and IF YOU DIDN'T TEAR UP… (no song audio and no movie footage, for copyright) |
| 2:09 | "Not just a cool Easter egg… a little tribute… sort of properly." | Garage car, soft grade | Title A TRIBUTE TO PAUL; a 0.33 s crash flash-forward on "sort of" (callback) |
| 2:21 | "10 main films, a spin-off… the first one… small, grimy…" | Stage | Count-up to 10 MAIN FILMS; FANS' FAVOURITE ERA card; THE POSTER CAR screen |
| 2:37 | "Look at this scenery… Keys… Vice City is their Miami." | Bridges and coast | Pills PALM TREES, WATER ON BOTH SIDES, THE KEYS = FLORIDA KEYS, VICE CITY = MIAMI |
| 2:52 | "Quick question… Dom's Charger, Brian's orange Supra?" | Stage | Animated poll bars; COMMENT pill. The bar lengths are visual only, not real data. |
| 3:06 | "Driver's still going with this bartender story…" | Stage: taxi interior | Quote card plus stamp RESPECT 🫡 |
| 3:17 | "Getting close… the game will tempt you… don't." | Approach | ⚠️ WARNING card; stamp "(HE DIDN'T)", the open loop for the escape |
| 3:28 | CHAPTER 02, "And we're here…" | Arrival | Pills on each noun; then a $0 FLOORBOARD → MILLIONAIRE'S ROW split (apartment vs mansions) |
| 3:42 | Map check, work vans (Miller's Destruction Co., Avenue Contractors), the house | Map, jog, house | Same treatments as section 2 |
| 4:06 | CHAPTER 03, break in, lock-pick ("don't spam the button") | Lock-pick | Magnifier on the wheel; tick SFX |
| 4:18 | "And there it is…" | Reveal | Garage-door rumble SFX, flash, title, checklist, EXACTLY LIKE THE MOVIE |
| 4:33 | Smash the window, then the name confirmed bottom-left | 13:24 / 13:35 | Glass SFX; magnifier on the HUD name; ✓ YOU'VE GOT IT |
| 4:45 | Section C: the escape (as in the table below, shifted by +2:21.6) | | |

### Section A and C detail
In the table below:
- Rows up to 1:22 are section A.
- Rows from 2:24 onward are section C; add 2:21.6 to get their time in the final video.
- Rows from 1:22.9 to 2:17 are the part 1 walkthrough that was dropped. They're kept for reference only.

Times are VO time. "src" is the gameplay timestamp in the 14:55 recording.

| Time | Script | Picture | Overlay / FX |
|---|---|---|---|
| 0:00 | "If you've ever wanted to drive Brian O'Connor's car…" | src 13:06 car under garage lights, 0.5× slow-mo | Spotlight on the car; pill "BRIAN O'CONNOR'S CAR" |
| 0:03.5 | "GTA 6 has it." | src 13:42 car facing camera, snap-settle | Title "GTA 6 HAS IT." |
| 0:05 | "Neon green paint, those blue and silver side graphics, the massive rear wing…" | src 13:47 chase cam, 0.45× | Pills land on each feature word |
| 0:07.8 | "…and the black hood with the white decal." | src 13:54 top-down hood, 0.4× | Magnifier on the hood decal |
| 0:10.6 | "It's called the Mibatsu '97 Penumbra FF… basically Paul Walker's Mitsubishi Eclipse." | Stage: floating screen (src 13:42) | Pink title with the model name; "≈" connector to a "THE FAST AND THE FURIOUS · 2001 / PAUL WALKER'S MITSUBISHI ECLIPSE" card |
| 0:16.6 | "You can't buy it, and you won't find it driving around… one specific garage…" | Stage | Three cards pop on each clause: 💸 CAN'T BUY ✕, 🚦 NOT IN TRAFFIC ✕, 🏠 ONE GARAGE ✓ (teal) |
| 0:22.4 | "…show you exactly where it is and how to take it." | Stage | "?" grid flips to 01 GET A TAXI · 02 VESPUCCI ISLAND · 03 THE GARAGE · 04 🔒 ??? (open loop) |
| 0:24.8 | "Stick around till the end… things went wrong very fast." | Stage | Card 04 stays locked; a 0.4 s red flash plus a peek of the crash on "wrong" |
| 0:29.2 | CHAPTER 01 GET A TAXI | src 0:06 Jason in the apartment | Bumper; pills JASON, 📍 MARIANA COUNTY, START ANYWHERE |
| 0:33.8 | "…car is all the way over on the East Coast, so this is a long trip." | Stage: tilted in-game map (src 1:33 still) | Pink route draws west→east on "east"; pins for you and the car; stamp "LONG TRIP" |
| 0:37.3 | "Easiest way… grab a taxi." | src 1:18 taxi arriving | Pills 🚕 GRAB A TAXI, NO WRECKED CAR |
| 0:41.1 | "Pull out your phone, contacts, call Paradise Taxi." | src 0:31 phone, 0.55× | Spotlight on the phone; pills PHONE → CONTACTS → PARADISE TAXI |
| 0:44.6 | "Jason just asks for a ride… phone camera if you want." | src 0:56 | Pill 📸 PHONE CAMERA (OPTIONAL) |
| 0:49.8 | "Once the orange Paradise taxi pulls up, jump in the back." | src 1:19 taxi pull-up | Pills ORANGE PARADISE TAXI, JUMP IN THE BACK |
| 0:52.5 | "Open up your map… Mariana… Vice Dale… island chain… Vespucci Island… Neptune Circle." | src 1:29 the real map navigation | Pill on each place name; spotlight on Vespucci; hot pill "📌 WAYPOINT: NEPTUNE CIRCLE" |
| 1:04.8 | "Sit back… a load of bridges… the Keys, Vice City, Hamlet, Downtown and Port V.C." | src 2:30 onward at ×30 (whole ride compressed) | Live "⏩ ×30 SPEED" counter; a stacked pill for each district as it's said |
| 1:12.3 | "The driver will also tell you a story…" | Stage: screen of the taxi interior (src 3:16) | Quote card "PARADISE TAXI · DRIVER'S STORY" with pink highlighter on "it does not go well for him"; stamp "IT DID NOT GO WELL" |
| 1:18.0 | "Flick the radio onto Flash…" | src 5:30 city at 1.6× | Pills 📻 RADIO → FLASH, THE RIGHT VIBE |
| 1:22.9 | CHAPTER 02 VESPUCCI ISLAND, "Here we are… palm trees, massive hedges, luxury houses." | src 10:03 arrival | Pill on each noun |
| 1:29.7 | "Open your map one more time… Neptune Circle." | src 12:00 map | Spotlight plus 📌 NEPTUNE CIRCLE |
| 1:34.4 | "Jog down the street past the construction vans…" | src 11:08 jog, handheld | Pills 🚧 CONSTRUCTION VANS, KEEP GOING |
| 1:39.9 | "Big modern white house with a two-car garage. That's the one." | src 12:49 garage exterior | Spotlight; stamp "THAT'S THE ONE" (teal) |
| 1:43.2 | CHAPTER 03 THE GARAGE, "Walk up… break in… lock-picking minigame." | src 12:52 | Pills 🔓 BREAK IN, 🎯 LOCK-PICKING MINIGAME |
| 1:48.3 | "There's a spinning wheel… time it right… only once." | src 12:57 | Spotlight plus magnifier on the wheel; pills TIME IT RIGHT, ONLY ONCE |
| 1:53.6 | "And there it is. The door rolls up, the garage lights hit it…" | src 13:03 door rolls up, 0.62× | White flash on "there"; spotlight on "lights"; pink title "MIBATSU '97 PENUMBRA FF"; movie-accurate checklist ticks on each word; stamp "EXACTLY LIKE THE MOVIE" |
| 2:06.0 | "No mod shop, no money spent. It spawns like this." | Stage | "TOTAL COST" odometer spins down to $0. The $85,000 start figure is a made-up visual gag, not an in-game price.; pills NO MOD SHOP ✕, IT SPAWNS LIKE THIS |
| 2:09.0 | "Walk around… locked… smash the window… engine fires up." | src 13:24 | Pills LOCKED, SMASH THE WINDOW (white flash on "glass"), ENGINE FIRES UP |
| 2:17.0 | "Check the bottom left of the screen… You've got it." | src 13:35 | Magnifier on the bottom-left vehicle-name HUD; stamp "✓ YOU'VE GOT IT" |
| 2:24.0 | CHAPTER 04 THE ESCAPE (pays off the open loop), "Leave quietly…" | src 13:39 | Hot pill 🤫 LEAVE QUIETLY; red bottom tint on "happened" |
| 2:27.6 | "As soon as I reversed out… crime reported… cop… gun out…" | src 13:36, then 13:59 | Pills CRIME REPORTED, COP IN THE ROAD, "STOP!"; spotlight on the cop |
| 2:33.9 | "Jason gets out, says sorry, then knocks him out with one punch." | src 14:02 | 0.9 s freeze frame with flash and stamp "ONE PUNCH 👊"; pill DON'T ASK WHY |
| 2:39.3 | "Back in the car… the most Fast and Furious thing possible." | src 14:10 | Pink title "THE MOST FAST & FURIOUS THING POSSIBLE" |
| 2:43.3 | "Hit the first intersection way too fast… T-boned a silver saloon." | src 14:25; drops to 0.45× slow-mo just before impact | Flash plus stamp "T-BONED" |
| 2:48.3 | "Sparks everywhere… hood crumpled… engine damaged…" | src 14:29 at 0.35× | Pills SPARKS, HOOD CRUMPLED, ENGINE DAMAGED |
| 2:52.2 | "Straight off the road… road-closed barrier… stuck in the debris." | src 14:38, then freeze at 14:48 | Pills; freeze with stamp "STUCK." |
| 2:59.6 | "Lesson learned. Brian would be ashamed of me." | src 14:51, desaturated | Title "BRIAN WOULD BE ASHAMED" |
| 3:01.9 | Recap: "Taxi… Vespucci… white house near Neptune Circle… garage… window… drive away." | Stage | The same grid, now with 04 unlocked; each card gets a teal ✓ as it's named; pills for SMASH THE WINDOW and DRIVE BETTER THAN I DID |
| 3:14.8 | "Drop a like and subscribe… which movie car next?" | Stage | LIKE turns pink; SUBSCRIBE is tapped and flips to ✓ SUBSCRIBED; comment card with the question highlighted |

---

## 4. Retention strategy

**Opening (first 30 s / first minute)**
- **0–5 s:** the payoff (the car) is on screen from frame 0, and "GTA 6 HAS IT" lands at 3.5 s. This is the reference's "stakes in sentence one" applied to a tutorial.
- **5–17 s:** four feature callouts in 6 s, then the name card. Each one is a fresh reward that confirms the viewer clicked the right video.
- **17–29 s:** the can't-buy / not-in-traffic cards create scarcity. The "?" grid sets out the path, and the locked card 04 is an open loop backed up by the VO's "stick around".
- **First minute:** two chapter bumpers' worth of progress by 0:52, so momentum is felt early.

**Long middle (1:04–1:22)**
- The 8-minute taxi ride becomes 7 s at ×30.
- The driver-story card adds a humour beat.
- Each district name is a pill, so the screen never sits idle.

**Payoffs**
- The garage reveal (1:53) is the biggest moment: flash, title, checklist and slow-mo.
- Chapter 04 resolves the open loop (2:24–3:00) with freeze, slam and slow-mo comedy beats.
- The recap reuses the opening grid, closing the loop the viewer saw at 0:22.

**Rules applied everywhere**
- One camera move per shot, never repeated back-to-back.
- A pill or stamp lands on every noun in the script.
- A whoosh on every cut and a pop on every pill gives the ear a rhythm too.

---

## 5. Sound design and music timeline
- **VO:** the ElevenLabs file, untouched.
- **Final loudness:** −14 LUFS integrated, −1.5 dBTP (YouTube long-form).
- **Music [ADAPT]:** original 100 BPM Vice City synthwave (Am–F–G–Em). It switches to a softer Dm–F–C–G pad with no drums for the Paul Walker tribute (1:39–2:21).
  - Pads plus an arpeggio for the first 4.8 s.
  - Drums enter at 4.8 s, as the feature callouts start.
  - Sits at about −24 dB under the VO; 3 s fade at the end.
- **Gameplay audio: fully muted.** The recording includes in-game radio (licensed music) during the taxi ride. Impacts are replaced with original SFX: lock-pick ticks, garage-door rumble, glass smash, punch, crash ×2.
- **SFX:**
  - Whoosh on every shot change.
  - Impact on every chapter bumper and stamp.
  - Pop on every pill.
- **Silence:** none. The reference has near-continuous narration; the freeze frames carry their own impact hit instead.

## 6. Caption, typography, colour and motion spec
See section 2. Timing rules:
- Captions group up to 4 words, or fewer than 22 characters.
- A new group starts on any pause of 0.45 s or more.
- A group stays up to 1.4 s.
- Key nouns are pink: car names, places, GARAGE, WRONG, PUNCH, T-BONED, STUCK, SUBSCRIBE.

## 7. Footage and asset checklist
| Asset | Status |
|---|---|
| Gameplay recording (14:55) | ✅ used |
| VO 3:21 | ✅ used (the 3:22 v3 file and the duplicate were ignored, as instructed) |
| Synthwave bed, whoosh, pop, impact | ✅ generated (original, royalty-free) |
| Fonts: Inter Display Black, Inter Bold | ✅ in repo |
| Movie still of the 2001 Eclipse | ❌ not used. Copyrighted; a text card replaces it. |
| GTA VI logo bug | ❌ not used. Replaced with the @IMJUSTGTA bug. |
| Optional re-shoot for a stronger cut | Close-ups of the car's livery (side graphics, wing) in a photo-mode orbit; the "bottom-left name" moment held longer; the lock-pick wheel at full screen |

## 8. Editor handoff
- **Source of truth:** `gta-short/src/PwLong.tsx`. Every shot is one entry in `SHOTS` with its VO start word, gameplay source time, speed and camera move. Overlays are keyed to VO words through `vt(word)`.
- **Assets:** `public/pw/` holds `gta.mp4` (1080p re-encode, 30 fps, keyframe every 15 frames), `vo.mp3`, `bed.wav` and the SFX. The large `gta.mp4` is git-ignored; regenerate it from the Drive file with the ffmpeg line in the commit.
- **Render:**
  ```
  npx remotion render src/index.ts PwLong out.mp4 --codec=h264 --video-bitrate=14M
  ```
  Then run `loudnorm=I=-14` with ffmpeg.
- **To change a beat:** edit the `src`, `rate` or `mv` values of that shot. All timing follows the VO automatically.

## 9. Quality-control checklist
- [ ] Car visible on frame 0; "GTA 6 HAS IT" by 0:04.
- [ ] No shot over 9 s without a new overlay landing.
- [ ] No camera move repeated back-to-back.
- [ ] Every place name said in the VO gets a pill at that moment.
- [ ] The "?" grid at 0:22 matches the recap grid at 3:02, and 04 unlocks only after 2:24.
- [ ] Captions never cover a magnifier inset or the HUD being pointed at.
- [ ] Gameplay audio never fights the VO (VO always at least 10 dB louder).
- [ ] Loudness −14 LUFS ±1; true peak no higher than −1.5 dBTP.
- [ ] No movie stills or third-party logos.
- [ ] Final runtime 5:43, matching the combined VO.
- [ ] No in-game radio or other licensed music anywhere; gameplay audio is muted.
