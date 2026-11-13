import React from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile,
  useCurrentFrame, interpolate, Easing,
} from 'remotion';
import words from './w40.json';
import {
  FPS, W, H, GRAD, SHADOW, f, ease, at, setWords, useFonts,
  Grade, Clip, Title, Label, Accent, Bubble, StoryScene, Slam, Cta,
} from './kit';

setWords(words as [string, number][]);

/* ------------------------------------------------------------------ */
/* Shot list: one cut ~1 frame before each clause (style.md §2).        */
/* 23 shots / 40 s -> ASL 1.74 s (reference 1.70 s).                    */
/* ------------------------------------------------------------------ */
const CUT = [
  0,      // 0  hook: real vs game seam
  2.06,   // 1  "A clip of cars driving down a…"
  3.80,   // 2  "…sunny Miami street went viral this week"
  5.93,   // 3  "and everyone thought it was real life"
  7.89,   // 4  "It wasn't."  (B&W, bass out)
  8.82,   // 5  "It was GTA 6." (FLASH + drop)
  10.35,  // 6  "The clip was posted by Only In Dade"
  12.64,  // 7  "A page that normally posts real Miami videos"
  15.43,  // 8  "Rockstar shared it… liked the post"
  18.94,  // 9  "Fans were arguing in the comments"
  20.72,  // 10 "Some said it was AI,"
  21.77,  // 11 "some said it was a real street"
  23.46,  // 12 "It's actually the game."
  24.86,  // 13 "Recreating a real promo… West Coast Customs last month"
  28.86,  // 14 "Same cars,"
  29.73,  // 15 "same street,"
  30.68,  // 16 "same sun."
  31.61,  // 17 "Except this time, it's all pixels." (pixelate + impact)
  33.76,  // 18 "If you can't tell the difference anymore," (B&W, bass out)
  35.49,  // 19 "what happens when the game actually comes out?" (drop)
  37.62,  // 20 rapid flurry
  38.05,  // 21 "Comment GTA"
  40.0,
];
const FLASHES: [number, number, string][] = [[8.82, 1, '#fff'], [23.46, 0.5, '#ffd2ea'], [33.0, 0.45, '#fff'], [35.49, 0.6, '#ffd2ea']];

/* ------------------------------------------------------------------ */
/* New scenes                                                          */
/* ------------------------------------------------------------------ */
const NeonFloor: React.FC<{opacity?: number}> = ({opacity = 0.55}) => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill style={{top: H * 0.6, opacity, transform: 'perspective(700px) rotateX(62deg)', transformOrigin: 'top',
      backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,80,190,.6) 0 3px, transparent 3px 90px), repeating-linear-gradient(0deg, rgba(255,80,190,.5) 0 3px, transparent 3px 70px)',
      backgroundPosition: `0 ${fr * 4}px`}} />
  );
};

const pop = (lf: number, frames = 8, from = 0.5) => ({
  s: interpolate(lf, [0, frames], [from, 1], {easing: Easing.out(Easing.back(2.2)), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  o: interpolate(lf, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
});

/** 6 · "The clip was posted by Only In Dade." — profile card slams in. */
const ProfileScene: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const nameAt = start + 0.25;
  const card = pop(fr - 2, 10, 0.7);
  const push = interpolate(fr, [0, f(dur)], [1, 1.06], {easing: Easing.inOut(Easing.cubic)});
  const n = pop(fr - f(nameAt - start), 8, 1.3);
  return (
    <AbsoluteFill>
      <Clip src="c1_street.mp4" from={3.2} dur={dur} zoom={[1.3, 1.4]} blur={18} whip />
      <AbsoluteFill style={{background: 'rgba(14,4,26,.5)'}} />
      <NeonFloor />
      <Label t={start + 0.05} shotStart={start} y={0.13} text={<>POSTED <Accent>BY</Accent></>} />
      <div style={{position: 'absolute', left: 90, right: 90, top: 620, padding: '56px 50px', borderRadius: 44, background: 'rgba(255,255,255,.96)',
        boxShadow: '0 30px 90px rgba(0,0,0,.55), 0 0 60px rgba(255,90,170,.35)', opacity: card.o, transform: `scale(${card.s * push})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
          <div style={{width: 170, height: 170, borderRadius: 85, padding: 7, background: 'linear-gradient(135deg,#ffb347,#ff3d7f,#9b4dff)'}}>
            <Img src={staticFile('tiles/t3.jpg')} style={{width: 156, height: 156, borderRadius: 78, objectFit: 'cover', border: '5px solid #fff'}} />
          </div>
          <div style={{opacity: n.o, transform: `scale(${n.s})`, transformOrigin: 'left center'}}>
            <div style={{fontFamily: 'HeroBlack', fontSize: 74, color: '#111', letterSpacing: -2, lineHeight: 1}}>Only In Dade</div>
            <div style={{fontFamily: 'UIBold', fontSize: 30, color: '#777', marginTop: 10}}>Miami page · Instagram</div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 14, marginTop: 40}}>
          {[0, 1, 2].map((i) => {
            const p = pop(fr - f(nameAt - start) - 6 - i * 3, 7, 0.6);
            return <Img key={i} src={staticFile(`tiles/t${i}.jpg`)} style={{flex: 1, height: 330, objectFit: 'cover', borderRadius: 18, opacity: p.o, transform: `scale(${p.s})`}} />;
          })}
        </div>
      </div>
      <div style={{position: 'absolute', top: H * 0.83, width: W, textAlign: 'center', fontFamily: 'UIBold', fontSize: 26, color: 'rgba(255,255,255,.72)', textShadow: SHADOW, opacity: n.o}}>
        the account that posted the clip · illustration
      </div>
    </AbsoluteFill>
  );
};

/** 7 · "A page that normally posts real Miami videos." — wall of real-looking tiles, REAL stamps. */
const WallScene: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const z = interpolate(fr, [0, f(dur)], [1.18, 1.0], {easing: Easing.inOut(Easing.cubic)});
  const realAt = at('REAL', 0, 13.5);
  const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <AbsoluteFill style={{background: '#0e0418'}}>
      <AbsoluteFill style={{transform: `scale(${z}) rotate(-4deg)`, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, padding: '120px 40px'}}>
        {tiles.map((i) => {
          const p = pop(fr - i * 2, 9, 0.7);
          const st = pop(fr - f(realAt - start) - i * 1.5, 6, 2.2);
          return (
            <div key={i} style={{position: 'relative', borderRadius: 20, overflow: 'hidden', opacity: p.o, transform: `scale(${p.s})`, boxShadow: '0 12px 30px rgba(0,0,0,.5)'}}>
              <Img src={staticFile(`tiles/t${i}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <div style={{position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%,-50%) rotate(-12deg) scale(${st.s})`, opacity: st.o * 0.95,
                fontFamily: 'HeroBlack', fontSize: 64, color: '#3dff9a', border: '6px solid #3dff9a', borderRadius: 14, padding: '2px 18px', textShadow: '0 0 18px rgba(61,255,154,.6)'}}>REAL</div>
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(14,4,24,0) 45%, rgba(14,4,24,.85) 80%)'}} />
      <Title shotStart={start} lines={[
        [{w: 'normally', t: at('NORMALLY')}, {w: 'posts', t: at('POSTS')}],
        [{w: 'real', t: realAt, accent: true}, {w: 'Miami', t: at('MIAMI', 0, 14)}, {w: 'videos', t: at('VIDEOS')}],
      ]} />
    </AbsoluteFill>
  );
};

/** 9 · "Fans were arguing in the comments." — comment wall cascades in. */
const COMMENTS: [string, string][] = [
  ['vice.fan', 'bro this is literally Ocean Drive'], ['pixelpeeper', 'look at the reflections… game'], ['dade_local', "I drove there yesterday, it's real"],
  ['gta_leaks', 'this is AI 100%'], ['carguy305', 'those cars are too clean to be real'], ['nina.m', "wait it's NOT real??"],
  ['real_or_not', 'the shadows give it away'], ['miami.mike', 'yall cooked, this is real'],
];
const CommentWall: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const drift = interpolate(fr, [0, f(dur)], [40, -60]);
  return (
    <AbsoluteFill>
      <Clip src="c3_split.mp4" from={1.5} dur={dur} zoom={[1.3, 1.4]} blur={14} whip />
      <AbsoluteFill style={{background: 'rgba(14,4,26,.55)'}} />
      <AbsoluteFill style={{transform: `translateY(${drift}px)`}}>
        {COMMENTS.slice(0, 7).map(([n, t], i) => (
          <Bubble key={i} name={n} text={t} t={start + 0.05 + i * 0.12} shotStart={start}
            x={i % 2 ? 150 : 60} y={560 + i * 150} tilt={i % 2 ? 2 : -2} />
        ))}
      </AbsoluteFill>
      <Title shotStart={start} y={0.13} lines={[
        [{w: 'fans', t: at('FANS')}, {w: 'were', t: at('WERE', 0, 19)}],
        [{w: 'arguing', t: at('ARGUING'), accent: true}],
      ]} />
    </AbsoluteFill>
  );
};

/** 13 · "Recreating a real promo Rockstar did with West Coast Customs last month." */
const CompareScene: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const top = pop(fr - 2, 10, 0.8), bot = pop(fr - f(at('ROCKSTAR', 0, 26) - start), 10, 0.8);
  const month = pop(fr - f(at('LAST', 0, 28) - start), 8, 1.6);
  const vs = pop(fr - f(at('ROCKSTAR', 0, 26) - start) - 4, 8, 2);
  const card = (src: string, from: number, label: React.ReactNode, tag: string, y: number, p: {s: number; o: number}, zoom: number) => (
    <div style={{position: 'absolute', left: 70, right: 70, top: y, height: 620, borderRadius: 34, overflow: 'hidden', opacity: p.o,
      transform: `scale(${p.s})`, boxShadow: '0 24px 70px rgba(0,0,0,.55), 0 0 0 4px rgba(255,255,255,.85)'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * FPS)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 26, top: 24, fontFamily: 'HeroBlack', fontSize: 30, color: '#fff', background: 'rgba(14,4,26,.75)', padding: '10px 18px', borderRadius: 12}}>{tag}</div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '60px 30px 26px', background: 'linear-gradient(transparent, rgba(10,0,20,.85))',
        fontFamily: 'HeroBlack', fontSize: 56, color: '#fff', letterSpacing: -1}}>{label}</div>
    </div>
  );
  const zA = interpolate(fr, [0, f(dur)], [1.05, 1.18]);
  return (
    <AbsoluteFill style={{background: '#12061c'}}>
      <NeonFloor opacity={0.4} />
      {card('c3_split.mp4', 0.2, <>REAL PROMO</>, 'West Coast Customs · last month', 230, top, zA)}
      {card('c1_street.mp4', 1.0, <>GTA 6 <Accent>RECREATION</Accent></>, 'in-game', 1000, bot, zA)}
      <div style={{position: 'absolute', top: 868, width: W, textAlign: 'center', opacity: vs.o, transform: `scale(${vs.s})`}}>
        <span style={{fontFamily: 'HeroBlack', fontSize: 84, padding: '4px 34px', borderRadius: 999, background: GRAD, color: '#fff', boxShadow: '0 0 40px rgba(255,90,170,.7)'}}>VS</span>
      </div>
      <div style={{position: 'absolute', top: 92, width: W, textAlign: 'center', fontFamily: 'HeroBlack', fontSize: 66, color: '#fff', textShadow: SHADOW,
        opacity: pop(fr - f(at('RECREATING') - start), 6).o}}>RE<Accent>CREATED.</Accent></div>
      <div style={{position: 'absolute', right: 90, top: 1650, opacity: month.o, transform: `scale(${month.s}) rotate(4deg)`, background: '#fff', borderRadius: 18,
        overflow: 'hidden', width: 220, boxShadow: '0 16px 40px rgba(0,0,0,.5)', textAlign: 'center'}}>
        <div style={{background: GRAD, fontFamily: 'HeroBlack', fontSize: 26, color: '#fff', padding: '8px 0'}}>PROMO</div>
        <div style={{fontFamily: 'HeroBlack', fontSize: 50, color: '#111', padding: '12px 0 16px', lineHeight: 1}}>LAST<br />MONTH</div>
      </div>
    </AbsoluteFill>
  );
};

/** 14–16 · "Same cars, same street, same sun." — triad with check marks (ref SILENCE/PATIENCE/NOISE). */
const Same: React.FC<{start: number; dur: number; idx: number; src: string; from: number; zoom: [number, number]; origin: string; word: string}> =
({start, dur, idx, src, from, zoom, origin, word}) => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Clip src={src} from={from} dur={dur} zoom={zoom} originX={origin} whip />
      <div style={{position: 'absolute', top: H * 0.2, width: W, display: 'flex', justifyContent: 'center', gap: 22}}>
        {[0, 1, 2].map((i) => {
          const on = i < idx || (i === idx && fr >= 3);
          const p = pop(i === idx ? fr - 3 : 99, 7, 2);
          return (
            <div key={i} style={{width: 96, height: 96, borderRadius: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: on ? GRAD : 'rgba(255,255,255,.18)', border: '4px solid rgba(255,255,255,.85)', transform: `scale(${i === idx ? p.s : 1})`,
              fontFamily: 'HeroBlack', fontSize: 56, color: '#fff', boxShadow: on ? '0 0 30px rgba(255,90,170,.7)' : 'none'}}>{on ? '✓' : ''}</div>
          );
        })}
      </div>
      <Title shotStart={start} size={150} lines={[[{w: 'same', t: start + 0.03}, {w: word, t: start + 0.2, accent: true}]]} />
    </AbsoluteFill>
  );
};

/** 17 · "Except this time, it's all pixels." — the picture literally pixelates on "pixels". */
const PixelScene: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const z = interpolate(fr, [0, f(dur)], [1.0, 1.12]);
  const idx = Math.min(65, fr);   // frames pre-pixelated in Python (block size ramps 1 -> 26 -> 60 px on "pixels")
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#12061c'}}>
      <Img src={staticFile(`pix/p${String(idx).padStart(3, '0')}.jpg`)} style={{width: W, height: H, transform: `scale(${z})`}} />
      <Grade />
      <Title shotStart={start} lines={[
        [{w: 'except', t: at('EXCEPT')}, {w: 'this', t: at('THIS', 0, 31.8)}, {w: 'time', t: at('TIME', 0, 32)}],
        [{w: "it's", t: at("IT'S", 0, 32.4)}, {w: 'all', t: at('ALL', 0, 32.5)}, {w: 'pixels.', t: at('PIXELS'), accent: true}],
      ]} />
    </AbsoluteFill>
  );
};

/** 20 · rapid flurry (ref 0.20–0.36 s cuts before CTA). */
const Flurry: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const i = Math.min(3, Math.floor(fr / 4));
  const src = ['tiles/t1.jpg', 'tiles/t4.jpg', 'tiles/t6.jpg', 'tiles/t8.jpg'][i];
  const z = 1.25 - (fr % 4) * 0.04;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={staticFile(src)} style={{width: W, height: H, objectFit: 'cover', transform: `scale(${z})`, filter: i % 2 ? 'grayscale(1) contrast(1.2)' : 'saturate(1.3)'}} />
      <Grade />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Composition                                                         */
/* ------------------------------------------------------------------ */
export const GtaShort40: React.FC = () => {
  useFonts();
  const fr = useCurrentFrame();
  const S = (i: number) => ({from: f(CUT[i]), durationInFrames: f(CUT[i + 1]) - f(CUT[i])});
  const d = (i: number) => CUT[i + 1] - CUT[i];

  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* 0 · HOOK */}
      <Sequence {...S(0)}>
        <Clip src="c3_split.mp4" from={3.0} dur={d(0)} zoom={[1.12, 1.2]} />
        <Title shotStart={0} lines={[
          [{w: 'Nobody', t: 0.0}, {w: 'can', t: at('CAN')}, {w: 'tell', t: at('TELL')}],
          [{w: "what's", t: at("WHAT'S")}, {w: 'real.', t: at('REAL'), accent: true}],
        ]} />
      </Sequence>

      {/* 1 */}
      <Sequence {...S(1)}>
        <Clip src="c1_street.mp4" from={0} dur={d(1)} zoom={[1.0, 1.12]} whip />
        <Label t={CUT[1] + 0.1} shotStart={CUT[1]} text={<>ONE CLIP. <Accent>MIAMI.</Accent></>} source="cars · sunny street · real-looking" />
      </Sequence>

      {/* 2 */}
      <Sequence {...S(2)}>
        <Clip src="c3_split.mp4" from={0} dur={d(2)} zoom={[1.3, 1.38]} originX="0%" />
        <Title shotStart={CUT[2]} lines={[
          [{w: 'went', t: at('WENT')}, {w: 'viral', t: at('VIRAL'), accent: true}],
          [{w: 'this', t: at('THIS')}, {w: 'week', t: at('WEEK')}],
        ]} />
      </Sequence>

      {/* 3 */}
      <Sequence {...S(3)}>
        <Clip src="c2_glitch.mp4" from={0} dur={d(3)} zoom={[1.06, 1.16]} whip />
        <Title shotStart={CUT[3]} lines={[
          [{w: 'everyone', t: at('EVERYONE')}, {w: 'thought', t: at('THOUGHT')}],
          [{w: 'it', t: at('IT', 0, 6.7)}, {w: 'was', t: at('WAS', 0, 6.8)}, {w: 'real.', t: at('REAL', 0, 7), accent: true}],
        ]} />
      </Sequence>

      {/* 4 · It wasn't */}
      <Sequence {...S(4)}>
        <Clip src="c2_glitch.mp4" from={1.83} rate={0.8} dur={d(4)} zoom={[1.16, 1.24]} mono={0.92} />
        <Title shotStart={CUT[4]} lines={[[{w: 'It', t: CUT[4] + 0.02}, {w: "wasn't.", t: at("WASN'T")}]]} />
      </Sequence>

      {/* 5 · It was GTA 6 */}
      <Sequence {...S(5)}>
        <Clip src="c2_glitch.mp4" from={2.55} dur={d(5)} zoom={[1.0, 1.1]} />
        <Slam shotStart={CUT[5]} gtaAt={at('GTA', 0, 8.9)} sixAt={at('SIX', 0, 9.5)} />
      </Sequence>

      <Sequence {...S(6)}><ProfileScene start={CUT[6]} dur={d(6)} /></Sequence>
      <Sequence {...S(7)}><WallScene start={CUT[7]} dur={d(7)} /></Sequence>
      <Sequence {...S(8)}><StoryScene start={CUT[8]} dur={d(8)} sharedAt={at('SHARED', 0, 15.5)} likedAt={at('LIKED', 0, 17.5)} /></Sequence>
      <Sequence {...S(9)}><CommentWall start={CUT[9]} dur={d(9)} /></Sequence>

      {/* 10 · AI? */}
      <Sequence {...S(10)}>
        <Clip src="c3_split.mp4" from={2.0} dur={d(10)} zoom={[1.08, 1.16]} whip />
        <Title shotStart={CUT[10]} y={0.2} size={150} lines={[[{w: 'AI?', t: CUT[10] + 0.2, accent: true}]]} />
        <Bubble name="gta_leaks" text="this is 100% AI" t={CUT[10] + 0.12} shotStart={CUT[10]} x={90} y={1290} tilt={-3} />
      </Sequence>

      {/* 11 · or real? */}
      <Sequence {...S(11)}>
        <Clip src="c3_split.mp4" from={3.1} dur={d(11)} zoom={[1.1, 1.2]} whip />
        <Title shotStart={CUT[11]} y={0.2} size={150} lines={[[{w: 'or', t: CUT[11] + 0.02}, {w: 'real?', t: at('REAL', 0, 22.5), accent: true}]]} />
        <Bubble name="gta_leaks" text="this is 100% AI" t={CUT[11] - 10} shotStart={CUT[11]} x={90} y={1180} tilt={-3} />
        <Bubble name="dade_local" text="that's a real street lol" t={CUT[11] + 0.1} shotStart={CUT[11]} x={240} y={1350} tilt={2} />
      </Sequence>

      {/* 12 · It's actually the game */}
      <Sequence {...S(12)}>
        <Clip src="c2_glitch.mp4" from={3.0} dur={d(12)} zoom={[1.15, 1.0]} />
        <Title shotStart={CUT[12]} lines={[
          [{w: "it's", t: at("IT'S", 0, 23.4)}, {w: 'actually', t: at('ACTUALLY', 0, 23.6)}],
          [{w: 'the', t: at('THE', 0, 24)}, {w: 'game.', t: at('GAME', 0, 24.2), accent: true}],
        ]} />
      </Sequence>

      <Sequence {...S(13)}><CompareScene start={CUT[13]} dur={d(13)} /></Sequence>

      <Sequence {...S(14)}><Same start={CUT[14]} dur={d(14)} idx={0} word="cars," src="c3_split.mp4" from={1.0} zoom={[1.9, 2.1]} origin="35%" /></Sequence>
      <Sequence {...S(15)}><Same start={CUT[15]} dur={d(15)} idx={1} word="street," src="c2_glitch.mp4" from={0.4} zoom={[1.1, 1.25]} origin="50%" /></Sequence>
      <Sequence {...S(16)}><Same start={CUT[16]} dur={d(16)} idx={2} word="sun." src="c3_split.mp4" from={2.2} zoom={[1.5, 1.7]} origin="30%" /></Sequence>

      <Sequence {...S(17)}><PixelScene start={CUT[17]} dur={d(17)} /></Sequence>

      {/* 18 · can't tell the difference — B&W */}
      <Sequence {...S(18)}>
        <Clip src="c3_split.mp4" from={0.4} rate={0.7} dur={d(18)} zoom={[1.22, 1.1]} mono={0.95} whip />
        <Title shotStart={CUT[18]} size={118} lines={[
          [{w: "can't", t: at("CAN'T", 0, 33.7)}, {w: 'tell', t: at('TELL', 0, 34)}],
          [{w: 'the', t: at('THE', 0, 34.2)}, {w: 'difference', t: at('DIFFERENCE', 0, 34.3), accent: true}],
        ]} />
      </Sequence>

      {/* 19 · what happens when it comes out? */}
      <Sequence {...S(19)}>
        <Clip src="c1_street.mp4" from={2.4} dur={d(19)} zoom={[1.0, 1.15]} whip />
        <Title shotStart={CUT[19]} y={0.7} size={112} lines={[
          [{w: 'what', t: at('WHAT', 0, 35.3)}, {w: 'happens', t: at('HAPPENS', 0, 35.5)}, {w: 'when', t: at('WHEN', 0, 35.8)}],
          [{w: 'it', t: 36.35}, {w: 'comes', t: 36.7}, {w: 'out?', t: 36.95, accent: true}],
        ]} />
      </Sequence>

      <Sequence {...S(20)}><Flurry start={CUT[20]} /></Sequence>

      {/* 21 · CTA */}
      <Sequence {...S(21)}>
        <Clip src="c1_street.mp4" from={3.0} dur={d(21)} zoom={[1.15, 1.25]} blur={6} />
        <Cta shotStart={CUT[21]} ctaAt={CUT[21] + 0.02} heartAt={39.05} />
      </Sequence>

      {FLASHES.map(([t, peak, col], i) => (
        <AbsoluteFill key={i} style={{background: col, pointerEvents: 'none',
          opacity: interpolate(fr, [f(t) - 1, f(t), f(t) + 1, f(t) + 4], [0, peak, peak * 0.62, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      ))}

      <Audio src={staticFile('mix40.wav')} />
    </AbsoluteFill>
  );
};
