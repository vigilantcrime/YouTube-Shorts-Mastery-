/* Leonida Shifts — Short: "There's only one way to lose six stars in GTA 6" (our 3-min 6-star chase clip).
   Same frame-exact Roddy Games R4 grammar as NpcShort (roddy_style.md §8): stutter-zoom open + pink leak, 3D emblem with
   two glints, Archivo w105 captions with spread shadow, zoom-blur cuts on caption swaps, punch-ins, vignette on top,
   game-UI overlays (prompt badge R→joke, tracked brackets / spotlight, map + pill, money-style number pops), YouTube-UI
   end card. Own assets only: our gameplay + the real in-game HUD/notification crops from it, our emblem, Natural-Earth
   Florida as "Leonida", open-licence fonts. No gore: the deputy head-shot close-up in the clip is deliberately unused. */
import React from 'react';
import {AbsoluteFill, Audio, Freeze, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {Emblem} from './kit';
import geo from './geo.json';
import SIX from './six_shots.json';

const FPS = 30, W = 1080, H = 1920;
const T = (s: number) => Math.round(s * FPS);
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const YEL = '#F7E327', MAG = '#ED25AB', WHT = '#FEFEFE';
const VW = 3414, VH = 1920;                       // every shot clip is a Lanczos 3414×1920 upscale of the 1080p60 source
const io = Easing.inOut(Easing.cubic), eo = Easing.out(Easing.cubic);

type Key = {s: number; cx: number; cy?: number; z?: number};
type Punch = {t: number; a: number};
type Shot = {id: number; f0: number; f1: number; src: number; rate: number; keys: Key[]; punches: Punch[]; o?: number[]; kind?: string; file?: string; trim?: number; fit?: boolean};
const SH: Shot[] = (SIX as unknown as {shots: Shot[]}).shots;
export const SIX_FRAMES: number = (SIX as unknown as {frames: number}).frames;   // 1574 = 52.46 s (VO ends 52.16 + 0.3 s tail)
const shotIdx = (f: number) => { let k = 0; SH.forEach((s, i) => { if (f >= s.f0) k = i; }); return k; };
const shot = (id: number) => SH.find((s) => s.id === id)!;

/* ---------------- R4 cut transition, punches, opening ---------------- */
const inFx = (k: number) => [[1.11, 30, 0.2], [1.055, 12, 0.1], [1.015, 1.5, 0], [1.005, 0, 0]][k] ?? [1, 0, 0];
const outFx = (j: number) => [[1.14, 18], [1.03, 2]][j] ?? [1, 0];
const punchV = (f: number, p: Punch) => { const d = f - T(p.t); if (d < 0) return 0; if (d < 10) return p.a * io(d / 10); if (d < 14) return p.a * (1 - 0.15 * io((d - 10) / 4)); return 0.85 * p.a; };
const OPEN_R = [0.84, 0, 0, 0.875, 0.89, 0.902, 0.918, 0.936, 0.953, 0.968, 0.981, 0.992, 1];   // base z 1.2 → frame 0 = 1.008
const LEAK = [1, 0, 0, 0.95, 0.9, 0.85, 0.75, 0.6, 0.45, 0.3, 0.12, 0, 0];
const shotZoom = (s: Shot, f: number) => {
  let z = 1 + 0.015 * (f - s.f0) / FPS;
  s.punches.forEach((p) => { z *= 1 + punchV(f, p); });
  const k = f - s.f0, j = s.f1 - 1 - f; let blur = 0, wash = 0;
  if (s.f0 !== 0) { const [zi, bi, wi] = inFx(k); z *= zi; blur = Math.max(blur, bi); wash = wi; } else if (f <= 12) z *= OPEN_R[f];
  if (s.kind !== 'end') { const [zo, bo] = outFx(j); z *= zo; blur = Math.max(blur, bo); }
  return {z, blur, wash};
};
const interpKeys = (keys: Key[], s: number) => {
  if (keys.length === 1) return keys[0]; const xs = keys.map((k) => k.s);
  const g = (sel: (k: Key) => number) => interpolate(s, xs, keys.map(sel), {...cl, easing: io});
  return {s, cx: g((k) => k.cx), cy: g((k) => k.cy ?? 0.5), z: g((k) => k.z ?? 1)};
};
const geomOf = (s: Shot, f: number) => {
  const st = s.src + ((f - s.f0) / FPS) * s.rate; const k = interpKeys(s.keys, st); const zb = k.z ?? 1; const vw = VW * zb, vh = VH * zb;
  const L = Math.min(0, Math.max(W - vw, 540 - k.cx * vw));
  const Tp = s.fit ? 960 - (k.cy ?? 0.5) * vh : Math.min(0, Math.max(H - vh, 960 - (k.cy ?? 0.5) * vh));
  return {st, vw, vh, L, Tp};
};
/* source-pixel point (1920×1080) → frame px, for tracked overlays */
const place = (s: Shot, f: number, x: number, y: number) => {
  const {vw, vh, L, Tp} = geomOf(s, f); const {z} = shotZoom(s, f); const [ox, oy] = s.o ?? [540, 960];
  return [ox + (L + (x / 1920) * vw - ox) * z, oy + (Tp + (y / 1080) * vh - oy) * z] as const;
};

const Footage: React.FC<{s: Shot; f: number; fx?: string}> = ({s, f, fx}) => {
  const {vw, vh, L, Tp} = geomOf(s, f); const {z, blur, wash} = shotZoom(s, f); const [ox, oy] = s.o ?? [540, 960];
  const vid = (style: React.CSSProperties) => <Sequence from={s.f0} layout="none">
    <OffthreadVideo src={staticFile(s.file!)} muted trimBefore={s.trim} style={{position: 'absolute', ...style}} /></Sequence>;
  const filt = [blur ? `blur(${blur}px)` : '', fx ?? ''].join(' ').trim();
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${ox}px ${oy}px`, filter: filt || undefined}}>
      {s.fit && <AbsoluteFill style={{filter: 'blur(26px) brightness(0.5) saturate(1.2)'}}>{vid({left: 540 - 0.5 * VW, top: 0, width: VW, height: VH})}</AbsoluteFill>}
      {vid({left: L, top: Tp, width: vw, height: vh, boxShadow: s.fit ? '0 0 50px rgba(0,0,0,0.7)' : undefined})}
    </AbsoluteFill>
    {wash > 0 && <AbsoluteFill style={{background: wash > 0.15 ? '#B4B4B4' : '#DCDCDC', opacity: wash}} />}
  </AbsoluteFill>;
};

/* ---------------- captions: word onsets of the ElevenLabs VO + 0.06 s (R4 swaps land 0.05–0.14 s after the word) ---------------- */
const CAPS: [number, string, string, string][] = [
  [0, "THERE'S ONLY", '', ''], [0.65, 'ONE WAY', 'ONE WAY', YEL], [1.17, 'TO LOSE', 'LOSE', MAG], [1.58, 'SIX STARS', 'SIX STARS', YEL],
  [2.16, 'IN GTA 6', 'GTA 6', YEL], [3.55, "AND YOU'RE", '', ''], [3.8, 'NOT GONNA', '', ''], [4.38, 'LIKE IT', 'LIKE', MAG],
  [4.91, 'GTA 5', 'GTA 5', YEL], [5.79, 'CAPPED YOU', 'CAPPED', MAG], [6.31, 'AT FIVE STARS', 'FIVE STARS', YEL], [7.31, 'ROCKSTAR', 'ROCKSTAR', YEL],
  [7.83, 'BROUGHT THE', 'BROUGHT', MAG], [8.17, 'SIXTH ONE BACK', 'SIXTH', YEL], [8.96, "AND IT'S THE", '', ''], [9.5, 'FIRST TIME', 'FIRST', MAG],
  [9.88, "WE'VE HAD IT", '', ''], [10.5, 'SINCE 2009', '2009', YEL], [12.06, 'GETTING THERE', '', ''], [12.75, 'TAKES WORK', 'WORK', MAG],
  [13.63, 'KILL A COP', 'KILL', MAG], [14.33, "AND YOU'RE ON", '', ''], [14.95, 'THREE STARS', 'THREE STARS', YEL], [16.06, 'FOR SIX', 'SIX', YEL],
  [16.58, 'YOU NEED', '', ''], [17.01, 'PROPER CARNAGE', 'CARNAGE', MAG], [18.0, 'LIKE STEALING', 'STEALING', MAG], [18.52, 'A TANK', 'TANK', YEL],
  [19.0, 'OFF A', '', ''], [19.33, 'MILITARY BASE', 'MILITARY BASE', YEL], [19.92, 'AND BLOWING UP', 'BLOWING UP', MAG], [20.76, 'EVERYTHING', 'EVERYTHING', MAG],
  [21.34, 'AROUND YOU', '', ''], [22.02, 'AND FORGET', 'FORGET', MAG], [22.31, 'THE OLD TRICK', 'OLD TRICK', YEL], [23.0, 'OF BREAKING', 'BREAKING', MAG],
  [23.59, 'LINE OF SIGHT', 'LINE OF SIGHT', YEL], [24.42, 'AND WAITING', 'WAITING', MAG], [25.4, 'THE COPS', 'COPS', YEL], [25.92, 'NOW TRACK', 'TRACK', MAG],
  [26.52, 'YOUR FACE', 'FACE', YEL], [27.11, 'YOUR CLOTHES', 'CLOTHES', YEL], [27.9, 'YOUR CAR', 'CAR', YEL], [28.47, 'EVEN CCTV', 'CCTV', YEL],
  [30.22, 'NORMALLY', '', ''], [30.67, 'YOU DITCH', 'DITCH', MAG], [31.12, 'THE WHIP', 'WHIP', YEL], [31.68, 'CHANGE YOUR FIT', 'FIT', YEL],
  [32.42, 'OR SPLIT', 'SPLIT', MAG], [32.98, 'JASON AND', 'JASON', YEL], [33.66, 'LUCIA UP', 'LUCIA', YEL], [34.78, 'AT SIX STARS', 'SIX STARS', YEL],
  [36.14, 'NONE OF THAT', 'NONE', MAG], [36.95, 'WORKS', '', ''], [37.5, 'THE HEAT', 'HEAT', YEL], [37.98, "DOESN'T DROP", 'DROP', MAG],
  [39.1, 'THE COPS', 'COPS', YEL], [39.61, 'AND THE MILITARY', 'MILITARY', YEL], [40.44, 'HUNT YOU', 'HUNT', MAG], [40.92, 'ACROSS THE', '', ''],
  [41.54, 'WHOLE MAP', 'WHOLE MAP', YEL], [42.46, 'SO HOW DO', '', ''], [42.78, 'YOU ESCAPE', 'ESCAPE', MAG], [43.56, 'SIX STARS', 'SIX STARS', YEL],
  [44.67, "YOU DON'T", "DON'T", MAG], [45.66, 'YOUR ONLY', '', ''], [46.28, 'WAY OUT', 'WAY OUT', YEL], [47.04, 'IS DYING', 'DYING', MAG],
  [48.54, 'BE HONEST', 'HONEST', YEL], [49.37, 'HOW LONG', 'LONG', YEL], [49.73, 'DID YOU LAST', 'LAST', YEL], [50.82, 'DROP YOUR TIME', 'TIME', YEL],
  [51.57, 'IN THE COMMENTS', 'COMMENTS', YEL],
];
const CAP_PX = 70, CAP_BASE = 1461.25, WORD_GAP = 17.5;
let measureCtx: CanvasRenderingContext2D | null = null;
const wordW = (w: string) => { if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
  const c = measureCtx!; c.font = `${CAP_PX}px Cap`; (c as unknown as {fontKerning: string}).fontKerning = 'none'; return c.measureText(w).width; };
const Caption: React.FC<{f: number}> = ({f}) => {
  let k = 0; CAPS.forEach((c, i) => { if (T(c[0]) <= f) k = i; });
  const [, txt, key, col] = CAPS[k]; const words = txt.split(' '); const keyWords = key ? key.split(' ') : [];
  const ws = words.map(wordW); const total = ws.reduce((a, b) => a + b, 0) + WORD_GAP * (words.length - 1);
  let x = 540 - total / 2; const items = words.map((w, i) => { const it = {w, x, c: keyWords.includes(w) ? col : WHT}; x += ws[i] + WORD_GAP; return it; });
  const txtEl = (shadow: boolean) => items.map((it, i) => <text key={i} x={it.x} y={CAP_BASE} fontFamily="Cap" fontSize={CAP_PX} style={{fontKerning: 'none'}}
    fill={shadow ? '#000' : it.c} stroke={shadow ? '#000' : it.c} strokeWidth={shadow ? 19.5 : 4.5} strokeLinejoin="round" paintOrder="stroke">{it.w}</text>);
  return <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
    <defs><filter id="capsh" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="9" /></filter></defs>
    <g filter="url(#capsh)" opacity={0.74} transform="translate(3 3)">{txtEl(true)}</g>
    <g>{txtEl(false)}</g>
  </svg>;
};

const Vignette: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse 856px 1143px at 540px 961px, rgba(0,0,0,0) 55.5%, rgba(0,0,0,0.285) 80%, rgba(0,0,0,0.53) 100%)'}} />;
const Leak: React.FC<{f: number}> = ({f}) => { const o = f < LEAK.length ? LEAK[f] : 0; if (!o) return null;
  return <AbsoluteFill style={{opacity: o, mixBlendMode: 'screen', background: 'radial-gradient(circle 620px at 46% 56%, rgba(255,70,200,0.62) 0%, rgba(255,70,200,0.3) 45%, rgba(255,70,200,0) 100%), linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))'}} />; };

/* ---------------- logo sting (identical to the tiger short) ---------------- */
const glintX = (t: number) => { for (const [a, b] of [[0.1, 0.37], [0.8, 1.07]]) if (t >= a && t <= b) return interpolate(t, [a, b], [-0.25, 1.25]); return null; };
const Logo: React.FC<{f: number}> = ({f}) => {
  if (f > 91) return null; const t = f / FPS;
  const ex = f >= 86 ? f - 86 : -1; const exY = [0, -10, -32, -70, -125, -190][ex] ?? 0; const exX = [0, -3, -8, -15, -24, -34][ex] ?? 0;
  const exB = [0, 0, 1.5, 4, 7, 10][ex] ?? 0; const exO = [1, 1, 1, 0.92, 0.6, 0.18][ex] ?? 1;
  const bob = 6 * Math.sin((2 * Math.PI * t) / 2.0), yaw = -9 + 3 * Math.sin((2 * Math.PI * t) / 2.6);
  const g = glintX(t); const depth = Array.from({length: 10}, (_, i) => i + 1);
  return <div style={{position: 'absolute', left: 399, top: 114, width: 330, height: 262, transform: `translate(${ex >= 0 ? exX : 0}px, ${bob + (ex >= 0 ? exY : 0)}px) perspective(900px) rotateY(${yaw}deg) rotateX(6deg)`,
    filter: exB ? `blur(${exB}px)` : undefined, opacity: exO}}>
    <div style={{position: 'absolute', left: 65, top: 0, width: 200, height: 200}}>
      {depth.map((i) => <div key={i} style={{position: 'absolute', left: i * 1.5, top: i * 2.0, width: 200, height: 200, borderRadius: 52, background: i === 10 ? '#16041f' : i > 6 ? '#2b0a3d' : '#43125c'}} />)}
      <div style={{position: 'absolute', inset: 0, borderRadius: 52, overflow: 'hidden', boxShadow: '0 0 0 4px #fff, 0 0 34px rgba(255,79,176,0.6)'}}>
        <Emblem size={200} gear={interpolate(t, [0.45, 0.75], [0, 1], cl)} />
        {g !== null && <div style={{position: 'absolute', top: -60, bottom: -60, left: `${g * 100}%`, width: 64, marginLeft: -32, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.85), rgba(255,255,255,0))', transform: 'skewX(-22deg)'}} />}
      </div>
    </div>
    <div style={{position: 'absolute', left: -20, right: -20, top: 226, textAlign: 'center', fontFamily: 'Cap', fontSize: 35, lineHeight: 1, letterSpacing: 0.5, whiteSpace: 'nowrap',
      textShadow: depth.slice(0, 5).map((i) => `${i * 0.8}px ${i * 1.05}px 0 #3d0f55`).join(',') + ', 0 0 16px rgba(255,79,176,0.45)'}}>
      <span style={{color: '#fff'}}>LEONIDA </span><span style={{color: '#FFB347'}}>SHIFTS</span>
    </div>
    {g !== null && <div style={{position: 'absolute', left: -20, right: -20, top: 226, textAlign: 'center', fontFamily: 'Cap', fontSize: 35, lineHeight: 1, letterSpacing: 0.5, whiteSpace: 'nowrap', color: 'transparent',
      backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) ${g * 100 - 9}%, rgba(255,255,255,0.95) ${g * 100}%, rgba(255,255,255,0) ${g * 100 + 9}%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text'}}>LEONIDA SHIFTS</div>}
  </div>;
};

/* ---------------- R4 tracked frame: white rounded rect + yellow L-brackets (optionally brightened = spotlight) ---------------- */
const Frame: React.FC<{x: number; y: number; w: number; h: number; s?: number; o?: number; bright?: boolean; arm?: number; th?: number; r?: number; off?: number}> = ({x, y, w, h, s = 1, o = 1, bright, arm = 54, th = 12, r = 15, off = 14}) => {
  const corner = (sx: number, sy: number) => <div style={{position: 'absolute', left: sx ? undefined : -off, right: sx ? -off : undefined, top: sy ? undefined : -off, bottom: sy ? -off : undefined, width: arm, height: arm,
    borderStyle: 'solid', borderColor: '#F6E22F', borderWidth: `${sy ? 0 : th}px ${sx ? th : 0}px ${sy ? th : 0}px ${sx ? 0 : th}px`,
    borderRadius: `${!sx && !sy ? 10 : 0}px ${sx && !sy ? 10 : 0}px ${sx && sy ? 10 : 0}px ${!sx && sy ? 10 : 0}px`, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.45))'}} />;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `scale(${s})`, opacity: o}}>
    {bright && <div style={{position: 'absolute', inset: 0, borderRadius: r, background: '#fff', opacity: 0.13, mixBlendMode: 'plus-lighter'}} />}
    <div style={{position: 'absolute', inset: 0, borderRadius: r, border: '3px solid #fff', boxShadow: '0 0 0 1.5px rgba(40,40,40,0.55), inset 0 0 0 1.5px rgba(40,40,40,0.4)'}} />
    {corner(0, 0)}{corner(1, 0)}{corner(0, 1)}{corner(1, 1)}
  </div>;
};
const lerpBox = (tr: number[][], t: number) => { const ts = tr.map((r) => r[0]); return [1, 2, 3, 4].map((i) => interpolate(t, ts, tr.map((r) => r[i]), cl)); };
/* hand-checked boxes (source px) — the military Humvee pulling alongside, and the two Humvees ahead opening fire */
const HUMVEE = [[98.55, 876, 344, 986, 424], [98.65, 832, 358, 964, 452], [98.75, 784, 374, 950, 490], [98.85, 686, 388, 854, 546], [98.95, 568, 412, 876, 622], [99.05, 406, 444, 832, 742], [99.15, 300, 505, 728, 786], [99.25, 230, 560, 608, 800]];
const AHEAD = [[122.8, 655, 496, 892, 551], [122.97, 626, 502, 868, 563], [123.1, 630, 540, 872, 616], [123.23, 578, 532, 828, 606], [123.37, 516, 500, 828, 606]];
const WHEEL_TILE = [1154, 462, 1349, 588];        // selected "UNSAVED HEADWEAR" cap tile in the item wheel
const Tracked: React.FC<{f: number}> = ({f}) => {
  const box = (s: Shot, b: number[], pad: number[], k: number, bright?: boolean, o = 1) => {
    const [x0, y0] = place(s, f, b[0], b[1]); const [x1, y1] = place(s, f, b[2], b[3]);
    return <Frame x={(x0 + x1) / 2} y={(y0 + y1) / 2} w={x1 - x0 + pad[0]} h={y1 - y0 + pad[1]} s={[1.12, 1.03][k] ?? 1} o={k === 0 ? 0.7 : o} bright={bright} />;
  };
  const s15 = shot(15), s28 = shot(28), s23 = shot(23);
  if (f >= T(18.67) && f < T(19.25)) { const st = geomOf(s15, f).st; return box(s15, lerpBox(HUMVEE, st), [60, 50], f - T(18.67), false, f >= T(19.25) - 2 ? 0.5 : 1); }
  if (f >= T(39.9) && f < T(40.46)) { const st = geomOf(s28, f).st; return box(s28, lerpBox(AHEAD, st), [44, 40], f - T(39.9), true, f >= T(40.46) - 2 ? 0.5 : 1); }
  if (f >= T(31.85) && f < s23.f1 - 2) return box(s23, WHEEL_TILE, [34, 34], f - T(31.85));
  return null;
};

/* ---------------- wanted-level bar (game-HUD stars, our recurring number device) ---------------- */
const starPts = (R: number) => Array.from({length: 10}, (_, i) => { const r = i % 2 ? R * 0.47 : R; const a = -Math.PI / 2 + (i * Math.PI) / 5; return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`; }).join(' ');
type BarCfg = {a: number; b: number; base: number; fills: number[]; lock?: number; flashFrom?: number; glowFrom?: number};
const StarBar: React.FC<{f: number; c: BarCfg}> = ({f, c}) => {
  if (f < c.a || f >= c.b) return null; const k = f - c.a, j = c.b - 1 - f;
  const sc = ([0.86, 1.04][k] ?? 1) * (j < 3 ? 1 - 0.03 * (3 - j) : 1); const op = ([0.35, 0.85][k] ?? 1) * (j < 3 ? (j + 1) / 4 : 1);
  const R = 54, gap = 136, cy = 600; const pts = starPts(R);
  const glow = c.glowFrom !== undefined && f >= c.glowFrom ? Math.sin(Math.min(1, (f - c.glowFrom) / 14) * Math.PI) : 0;
  return <div style={{position: 'absolute', inset: 0, opacity: op, transform: `scale(${sc})`, transformOrigin: `540px ${cy}px`}}>
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible', filter: `drop-shadow(0 5px 5px rgba(0,0,0,0.6))${glow ? ` drop-shadow(0 0 ${14 * glow}px rgba(255,40,40,${0.9 * glow}))` : ''}`}}>
      {Array.from({length: 6}, (_, i) => {
        const x = 540 + (i - 2.5) * gap; const at = i < c.base ? -999 : c.fills[i - c.base]; const isF = at !== undefined && f >= at; const kk = f - (at ?? 0);
        const s = isF && kk < 4 ? [0.45, 1.28, 1.1, 1][kk] : 1;
        const grey = isF && c.flashFrom !== undefined && f >= c.flashFrom && Math.floor((f - c.flashFrom) / 4) % 2 === 0;
        const locked = c.lock !== undefined && i === 5; const sk = locked && f >= c.lock! ? f - c.lock! : -1; const shake = sk >= 0 && sk < 12 ? 7 * Math.sin(sk * 2.3) * (1 - sk / 12) : 0;
        return <g key={i} transform={`translate(${x + shake} ${cy}) scale(${s})`}>
          <polygon points={pts} fill={isF ? (grey ? '#8d8d8d' : '#F5F5F5') : 'rgba(25,25,30,0.62)'} stroke={isF ? '#1c1c1c' : 'rgba(255,255,255,0.78)'} strokeWidth={isF ? 4 : 3.5} strokeLinejoin="round" />
          {isF && kk >= 0 && kk < 6 && <circle r={R * (1 + kk * 0.14)} fill="none" stroke="#fff" strokeWidth={4} opacity={0.8 * (1 - kk / 6)} />}
          {locked && <g transform="translate(0 8) scale(1.25)">
            <path d="M-17 -6 V-20 A17 17 0 0 1 17 -20 V-6" fill="none" stroke="#f4f4f4" strokeWidth={8} strokeLinecap="round" />
            <rect x={-26} y={-8} width={52} height={40} rx={8} fill="#f4f4f4" stroke="#1c1c1c" strokeWidth={3} />
            <circle cx={0} cy={9} r={6} fill="#1c1c1c" /><rect x={-2.5} y={10} width={5} height={12} rx={2} fill="#1c1c1c" /></g>}
        </g>;
      })}
    </svg>
  </div>;
};
const BARS: BarCfg[] = [
  {a: T(5.79) + 2, b: shot(5).f1 - 1, base: 0, fills: [T(5.95), T(6.02), T(6.09), T(6.16), T(6.23)], lock: T(6.7)},                // GTA 5: five stars, 6th locked
  {a: T(14.33) + 2, b: shot(11).f1 - 1, base: 0, fills: [T(14.95), T(15.02), T(15.09)]},                                          // kill a cop → three stars
  {a: T(16.06) + 2, b: shot(12).f1 - 1, base: 3, fills: [T(16.26), T(16.33), T(16.4)], glowFrom: T(16.44)},                        // for six → 4, 5, 6 + red glow
  {a: T(23.59) + 2, b: shot(18).f1 - 1, base: 6, fills: [], flashFrom: T(24.04)},                                                   // the old trick: stars flashing grey
];

/* ---------------- real HUD crop, magnified in an R4 frame ---------------- */
type Mark = {x: number; y: number; w: number; h: number; at: number};
const HudCard: React.FC<{f: number; a: number; b: number; file: string; from: number; trim: number; marks?: Mark[]; rePop?: number}> = ({f, a, b, file, from, trim, marks, rePop}) => {
  if (f < a || f >= b) return null; const k = f - a, j = b - 1 - f;
  const sc = ([0.72, 0.92, 1.04][k] ?? 1) * (j < 3 ? 1 - 0.03 * (3 - j) : 1) * (rePop !== undefined && f >= rePop && f < rePop + 3 ? [1.03, 1.015, 1.005][f - rePop] : 1);
  const op = ([0.35, 0.85][k] ?? 1) * (j < 3 ? (j + 1) / 4 : 1);
  let m: Mark | undefined; (marks ?? []).forEach((mk) => { if (f >= mk.at) m = mk; }); const mk = m ? f - m.at : 0;
  return <div style={{position: 'absolute', left: 90, top: 490, width: 900, height: 300, opacity: op, transform: `perspective(1200px) rotateY(${2 * Math.sin(k / 12)}deg) scale(${sc})`}}>
    <div style={{position: 'absolute', inset: -6, borderRadius: 20, background: '#0d0d10', boxShadow: '0 16px 34px rgba(0,0,0,0.6)'}} />
    <div style={{position: 'absolute', inset: 0, borderRadius: 15, overflow: 'hidden'}}>
      <Sequence from={from} layout="none"><OffthreadVideo src={staticFile(file)} muted trimBefore={trim} style={{position: 'absolute', left: 0, top: 0, width: 900, height: 300}} /></Sequence>
    </div>
    <Frame x={450} y={150} w={900} h={300} />
    {m && <Frame x={m.x} y={m.y} w={m.w} h={m.h} s={[1.22, 1.07][mk] ?? 1} o={mk === 0 ? 0.7 : 1} arm={30} th={8} r={12} off={9} />}
  </div>;
};

/* ---------------- money-style number pop (R4 "+ $1,218"): odometer year / survival timer ---------------- */
const DIG = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const Odo: React.FC<{v: number; lh: number}> = ({v, lh}) => {        // v: continuous value of this digit wheel (0..10)
  const p = ((v % 10) + 10) % 10;
  return <span style={{display: 'inline-block', height: lh, overflow: 'hidden', verticalAlign: 'top', width: '0.62em', textAlign: 'center'}}>
    <span style={{display: 'block', transform: `translateY(${-p * lh}px)`}}>{DIG.map((d, i) => <span key={i} style={{display: 'block', height: lh, lineHeight: `${lh}px`}}>{d}</span>)}</span></span>;
};
const odoDigits = (N: number, n: number) => Array.from({length: n}, (_, i) => { const p = n - 1 - i; const P = 10 ** p; const base = Math.floor(N / P);
  const frac = p === 0 ? N - Math.floor(N) : Math.max(0, (N % P) - (P - 1)); return (base % 10) + frac; });
const NumPop: React.FC<{f: number; a: number; b: number; label: string; children: React.ReactNode; icon: React.ReactNode}> = ({f, a, b, label, children, icon}) => {
  const k = f - a; if (k < 2 || f >= b) return null;
  const sc = k === 2 ? 0.86 : interpolate(k, [3, 8], [0.9, 1], {...cl, easing: eo}); const rot = interpolate(k, [3, 8], [-4, 0], {...cl, easing: eo});
  const op = k === 2 ? 0.3 : f >= b - 3 ? (b - f) / 4 : 1;
  const parts = k >= 3 && k < 16 ? Array.from({length: 10}, (_, i) => { const ang = (i / 10) * Math.PI * 2 + 0.25; const r = 330 + 18 * (k - 3) + (i % 2) * 26;
    return <div key={i} style={{position: 'absolute', left: 433 + Math.cos(ang) * r * 1.3, top: 164 + Math.sin(ang) * r * 0.5, width: 11, height: 11, borderRadius: 6, background: i % 2 ? '#c8ffd2' : '#7be07b', opacity: 1 - (k - 3) / 13, boxShadow: '0 0 8px rgba(160,255,170,0.9)'}} />; }) : null;
  return <div style={{position: 'absolute', left: 530 - 433, top: 551 - 164, width: 867, height: 328, transform: `scale(${sc}) rotate(${rot}deg)`, opacity: op}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 21, border: '4.5px solid #A3CD96', background: 'rgba(14,26,16,0.34)', backdropFilter: 'blur(2px)', boxShadow: '0 0 0 1.5px rgba(0,0,0,0.25), 0 10px 26px rgba(0,0,0,0.35)'}} />
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 46}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
        <div style={{fontFamily: 'Pill5', fontSize: 38, letterSpacing: 4, color: 'rgba(255,255,255,0.78)', textShadow: '0 2px 6px rgba(0,0,0,0.6)', marginBottom: 4}}>{label}</div>
        <div style={{fontFamily: 'Pill5', fontSize: 118, lineHeight: 1, color: '#fff', textShadow: '0 3px 8px rgba(0,0,0,0.6)', whiteSpace: 'nowrap'}}>{children}</div>
      </div>
      <div style={{width: 142, height: 142, borderRadius: 71, background: '#1f2523', boxShadow: '0 0 0 3px rgba(255,255,255,0.12), 0 4px 10px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon}</div>
    </div>
    {parts}
  </div>;
};
const CalIcon = <svg width={84} height={84} viewBox="0 0 100 100"><rect x={14} y={22} width={72} height={64} rx={10} fill="none" stroke="#7be07b" strokeWidth={8} /><path d="M14 42 H86" stroke="#7be07b" strokeWidth={8} />
  <path d="M32 12 V30 M68 12 V30" stroke="#7be07b" strokeWidth={8} strokeLinecap="round" /><rect x={30} y={54} width={14} height={12} rx={2} fill="#7be07b" /><rect x={56} y={54} width={14} height={12} rx={2} fill="#7be07b" /></svg>;
const WatchIcon = <svg width={84} height={84} viewBox="0 0 100 100"><circle cx={50} cy={56} r={34} fill="none" stroke="#7be07b" strokeWidth={8} /><path d="M50 56 L50 34 M50 56 L64 66" stroke="#7be07b" strokeWidth={8} strokeLinecap="round" />
  <path d="M40 10 H60 M50 10 V22" stroke="#7be07b" strokeWidth={8} strokeLinecap="round" /></svg>;
const YearPop: React.FC<{f: number}> = ({f}) => {
  const N = interpolate(f, [T(10.8), T(11.5)], [2026, 2009], {...cl, easing: eo});
  return <NumPop f={f} a={shot(8).f0} b={shot(8).f1 - 2} label="LAST TIME" icon={CalIcon}>{odoDigits(N, 4).map((v, i) => <Odo key={i} v={v} lh={118} />)}</NumPop>;
};
const TimerPop: React.FC<{f: number}> = ({f}) => {
  const sec = Math.floor(interpolate(f, [T(49.47), T(50.2)], [0, 115], {...cl, easing: eo}));
  return <NumPop f={f} a={T(49.37) - 2} b={shot(36).f0 - 1} label="MY TIME AT 6 STARS" icon={WatchIcon}><span style={{fontVariantNumeric: 'tabular-nums'}}>{`${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`}</span></NumPop>;
};

/* ---------------- CCTV gag on "EVEN CCTV" ---------------- */
const CCTV_A = T(28.75);
const Cctv: React.FC<{f: number}> = ({f}) => {
  const s = shot(21); if (f < CCTV_A || f >= s.f1) return null; const k = f - CCTV_A;
  const jit = [10, -7][k] ?? 0; const sec = 7 + Math.floor(k / FPS); const rec = Math.floor(k / 12) % 2 === 0;
  const corner = (l: boolean, t: boolean) => <div style={{position: 'absolute', [l ? 'left' : 'right']: 66, [t ? 'top' : 'bottom']: t ? 210 : 640, width: 70, height: 70,
    borderColor: 'rgba(255,255,255,0.85)', borderStyle: 'solid', borderWidth: `${t ? 5 : 0}px ${l ? 0 : 5}px ${t ? 0 : 5}px ${l ? 5 : 0}px`}} />;
  return <AbsoluteFill style={{transform: `translateX(${jit}px)`}}>
    <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 5px)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 60% at 50% 48%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)'}} />
    {k < 2 && <AbsoluteFill style={{background: '#fff', opacity: k === 0 ? 0.28 : 0.12}} />}
    {corner(true, true)}{corner(false, true)}{corner(true, false)}{corner(false, false)}
    <div style={{position: 'absolute', left: 122, top: 246, display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'Mono', fontSize: 40, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>
      <div style={{width: 26, height: 26, borderRadius: 13, background: '#ff2d2d', opacity: rec ? 1 : 0.15, boxShadow: '0 0 10px rgba(255,45,45,0.8)'}} />REC</div>
    <div style={{position: 'absolute', right: 122, top: 246, fontFamily: 'Mono', fontSize: 40, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>CAM 07</div>
    <div style={{position: 'absolute', left: 122, top: 304, fontFamily: 'Mono', fontSize: 32, color: 'rgba(255,255,255,0.95)', textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>{`11-24-2026  18:42:${String(sec).padStart(2, '0')}`}</div>
  </AbsoluteFill>;
};

/* ---------------- prompt badge (R4 §8.8.3): realistic "SWITCH" → joke "NOT TODAY" ---------------- */
const Keycap: React.FC<{glyph: 'swap' | 'cross'; size: number}> = ({glyph, size}) => <div style={{width: size, height: size, borderRadius: size / 2, background: 'radial-gradient(circle, #6b7378 0%, #9ea6ab 58%, #c9ced1 100%)',
  boxShadow: '0 0 0 3px #1b2a2f, 0 3px 6px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
  <div style={{width: size * 0.56, height: size * 0.56, borderRadius: size * 0.13, background: '#fdfdfd', boxShadow: '0 0 0 3px #1b2a2f', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    {glyph === 'swap' ? <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 100 100"><path d="M18 34 H78 M62 18 L80 34 L62 50 M82 66 H22 M38 50 L20 66 L38 82" fill="none" stroke="#111" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" /></svg>
      : <svg width={size * 0.36} height={size * 0.36} viewBox="0 0 100 100"><path d="M18 18 L82 82 M82 18 L18 82" stroke="#111" strokeWidth={14} strokeLinecap="round" /></svg>}
  </div></div>;
const Badge: React.FC<{f: number}> = ({f}) => {
  const a = T(32.69), sw = T(33.66), end = shot(24).f1 - 2; if (f < a || f >= end) return null;
  const joke = f >= sw; const k = f - a, j = f - sw;
  const sc = joke ? interpolate(j, [0, 3], [1.06, 1], cl) : [0.62, 0.7, 0.76][k] ?? 0.78;
  const ry = joke ? 2 * Math.sin(j / 9) : [22, 14, 8][k] ?? 4; const op = joke ? (f >= end - 2 ? (end - f) / 3 : 1) : [0.35, 0.8][k] ?? 1;
  const parts = joke && j < 14 ? Array.from({length: 12}, (_, i) => { const ang = (i / 12) * Math.PI * 2 + 0.4; const r = 300 + 140 * (j / 14) + (i % 3) * 30;
    return <div key={i} style={{position: 'absolute', left: 431 + Math.cos(ang) * r * 1.35, top: 105 + Math.sin(ang) * r * 0.55, width: i % 2 ? 9 : 13, height: i % 2 ? 9 : 13, borderRadius: 7,
      background: i % 3 ? '#fff6b0' : '#ffffff', opacity: 1 - j / 14, boxShadow: '0 0 8px rgba(255,240,150,0.9)'}} />; }) : null;
  return <div style={{position: 'absolute', left: 529 - 431, top: 517 - 105, width: 862, height: 210, transform: `perspective(1100px) rotateY(${ry}deg) rotateX(4deg) scale(${sc})`, opacity: op}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 15, background: '#EAD389', boxShadow: '0 14px 30px rgba(0,0,0,0.5)'}} />
    <div style={{position: 'absolute', inset: 5, borderRadius: 11, overflow: 'hidden', background: 'linear-gradient(180deg, #31575f 0%, #2a454d 55%, #203a41 100%)'}}>
      <div style={{position: 'absolute', left: '-20%', top: '-60%', width: '55%', height: '220%', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.10), rgba(255,255,255,0))', transform: 'rotate(18deg)'}} />
    </div>
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 34}}>
      <div style={{fontFamily: 'Prompt', fontSize: 112, lineHeight: 1, color: '#fff', WebkitTextStroke: '6px #0f1d21', paintOrder: 'stroke fill', textShadow: '0 4px 6px rgba(0,0,0,0.45)', letterSpacing: 1, marginTop: 6}}>{joke ? 'NOT TODAY' : 'SWITCH'}</div>
      <Keycap glyph={joke ? 'cross' : 'swap'} size={176} />
    </div>
    {parts}
  </div>;
};

/* ---------------- "NONE OF THAT WORKS": the three escape tricks, each stamped ✕ ---------------- */
const TRICK_ICONS = [
  <path key="car" d="M18 62 L24 44 Q27 36 36 36 H64 Q73 36 76 44 L82 62 V74 H72 V66 H28 V74 H18 Z M30 50 H70 L66 42 H34 Z" fill="#fff" />,
  <g key="hanger" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round"><path d="M50 30 a8 8 0 1 1 8 8 q-8 2 -8 8 L16 68 H84 L50 46" /></g>,
  <g key="swap" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round"><path d="M20 38 H76 M62 24 L78 38 L62 52 M80 64 H24 M38 50 L22 64 L38 78" /></g>,
];
const Triad: React.FC<{f: number}> = ({f}) => {
  const s = shot(26); const a = T(36.2), end = s.f1 - 2; if (f < a || f >= end) return null; const fade = f >= end - 3 ? (end - f) / 4 : 1;
  return <>{TRICK_ICONS.map((ic, i) => {
    const k = f - (a + i * 2); if (k < 0) return null; const sc = [0.4, 1.2, 1.05][k] ?? 1;
    const x = T(36.95) + i * 2, xk = f - x; const xs = xk >= 0 ? ([1.7, 1.15, 0.96][xk] ?? 1) : 0;
    return <div key={i} style={{position: 'absolute', left: 540 + (i - 1) * 230 - 90, top: 600 - 90, width: 180, height: 180, opacity: fade, transform: `scale(${sc})`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 90, background: 'radial-gradient(circle at 40% 35%, #a32020, #6e1010)', boxShadow: '0 0 0 4px #1b1b1b, 0 8px 18px rgba(0,0,0,0.55)'}} />
      <svg width={180} height={180} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0}}>{ic}</svg>
      {xk >= 0 && <svg width={220} height={220} viewBox="0 0 100 100" style={{position: 'absolute', left: -20, top: -20, transform: `scale(${xs})`}}>
        <path d="M18 18 L82 82 M82 18 L18 82" stroke="#fff" strokeWidth={20} strokeLinecap="round" /><path d="M18 18 L82 82 M82 18 L18 82" stroke="#ff2d2d" strokeWidth={12} strokeLinecap="round" /></svg>}
    </div>; })}</>;
};

/* ---------------- map: zoom OUT from Vice City to all of Leonida, police blips spreading (R4 map/ring/pill reversed) ---------------- */
const FL = geo.fl as {n: string; d: string}[]; const FLX = geo.flx as {n: string; d: string}[];
const MIAMI: [number, number] = [857, 811];
const ROADS: number[][][] = [
  [[647, 755], [700, 758], [760, 760], [835, 761]], [[647, 755], [640, 684], [607, 631], [550, 578], [559, 488], [601, 307], [577, 237], [535, 158]],
  [[857, 811], [864, 758], [875, 671], [836, 588], [802, 469], [776, 391], [748, 302], [710, 200], [664, 137]], [[559, 488], [626, 475], [701, 400], [748, 302]],
  [[819, 854], [857, 811], [829, 643], [764, 510], [701, 400], [614, 354]], [[819, 857], [824, 910], [799, 935], [739, 966], [705, 972], [648, 987]], [[647, 755], [711, 793], [781, 811], [857, 811]],
];
const URBAN: number[][] = [[852, 792, 11, 30], [561, 486, 11, 9], [702, 402, 10, 9], [662, 141, 11, 9], [642, 688, 6, 5], [873, 676, 5, 12]];
const BLIPS: number[][] = [[838, 790], [872, 832], [826, 760], [866, 760], [846, 846], [812, 818], [875, 690], [836, 600], [802, 480], [776, 395], [748, 306], [712, 205], [664, 140], [700, 758], [760, 762],
  [640, 684], [607, 631], [552, 578], [560, 492], [600, 310], [577, 240], [536, 160], [700, 402], [724, 424], [576, 502], [739, 962], [799, 934], [650, 985], [420, 140], [300, 116], [180, 96], [60, 84], [-70, 96],
  [690, 520], [622, 560], [762, 610], [702, 676], [470, 190], [250, 60]].sort((p, q) => Math.hypot(p[0] - MIAMI[0], p[1] - MIAMI[1]) - Math.hypot(q[0] - MIAMI[0], q[1] - MIAMI[1]));
const MapOut: React.FC<{s: Shot; f: number}> = ({s, f}) => {
  const k = f - s.f0; const u = interpolate(k, [3, 17], [0, 1], {...cl, easing: io});
  const settle = k < 17 ? 1 : k < 21 ? interpolate(k, [17, 19, 21], [1, 0.97, 1], cl) : k >= 26 && k < 34 ? interpolate(k, [26, 30, 34], [1, 1.025, 1], {...cl, easing: io}) : 1;
  const S = Math.exp(Math.log(3.4) * (1 - u)) * settle;
  const PM = [540 + 480 * u, 860 + 302 * u];
  const scr = (p: number[]) => [PM[0] + S * (p[0] - MIAMI[0]), PM[1] + S * (p[1] - MIAMI[1])];
  const tr = `translate(${PM[0]} ${PM[1]}) scale(${S}) translate(${-MIAMI[0]} ${-MIAMI[1]})`;
  const [zi, bi, wi] = inFx(k); const [zo, bo] = outFx(s.f1 - 1 - f); const blur = Math.max(bi, bo);
  const ring = interpolate(k, [0, 8, 14], [1, 1, 0], cl);
  const pk = k - 19; const pillO = pk < 0 ? 0 : pk === 0 ? 0.3 : 1; const pillS = pk < 0 ? 0.8 : interpolate(pk, [0, 1, 4, 7], [0.8, 0.9, 1.05, 1], cl);
  const pillR = interpolate(pk, [0, 4, 7], [-3, -1.5, 0], cl); const shine = interpolate(pk, [8, 18], [-0.3, 1.3], cl);
  const me = scr(MIAMI);
  return <AbsoluteFill style={{overflow: 'hidden', background: '#1d6f9f'}}>
    <AbsoluteFill style={{transform: `scale(${zi * zo})`, filter: blur ? `blur(${blur}px)` : undefined}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="sea6" cx="55%" cy="45%" r="75%"><stop offset="0" stopColor="#3aa3cf" /><stop offset="0.6" stopColor="#2a87b8" /><stop offset="1" stopColor="#1b6797" /></radialGradient>
          <filter id="shal6" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9" /></filter>
          <filter id="land6" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="4" seed="4" result="n" /><feColorMatrix in="n" type="saturate" values="0" result="g" />
            <feComponentTransfer in="g" result="g2"><feFuncA type="linear" slope="0.4" /></feComponentTransfer><feComposite in="g2" in2="SourceGraphic" operator="in" result="tex" /><feBlend in="SourceGraphic" in2="tex" mode="multiply" /></filter>
        </defs>
        <rect width={W} height={H} fill="url(#sea6)" />
        <g transform={tr}>
          <g filter="url(#shal6)" opacity={0.75}>{[...FLX, ...FL].map((p, i) => <path key={i} d={p.d} fill="none" stroke="#6fd0ea" strokeWidth={26} strokeLinejoin="round" />)}</g>
          {[...FLX, ...FL].map((p, i) => <path key={'b' + i} d={p.d} fill="#e6d39a" stroke="#e6d39a" strokeWidth={3.2} strokeLinejoin="round" />)}
          <g filter="url(#land6)">{[...FLX, ...FL].map((p, i) => <path key={'l' + i} d={p.d} fill={p.n === 'Florida' ? '#7eaa69' : '#86ad70'} />)}</g>
          <ellipse cx={770} cy={818} rx={64} ry={52} fill="#a9c27f" opacity={0.5} /><ellipse cx={640} cy={300} rx={90} ry={120} fill="#6c9a5c" opacity={0.35} />
          <ellipse cx={773} cy={635} rx={25} ry={27} fill="#3d9fcc" stroke="#e6d39a" strokeWidth={1.2} />
          {URBAN.map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#cfd5db" opacity={0.62} />)}
          {ROADS.map((r, i) => <polyline key={i} points={r.map((p) => p.join(',')).join(' ')} fill="none" stroke="#f6f6f6" strokeWidth={2 / S} strokeLinejoin="round" strokeLinecap="round" opacity={0.9} />)}
        </g>
        {/* where you are: R4 ring around the player, fading as we pull out */}
        <g opacity={ring}>
          <circle cx={me[0]} cy={me[1]} r={126} fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={1.6} />
          <ellipse cx={me[0]} cy={me[1]} rx={96} ry={76} fill="rgba(214,226,74,0.28)" stroke="#f5d442" strokeWidth={4.5} strokeDasharray="20 13" />
        </g>
        {/* police blips: red/blue flashing, pulse rings, revealed outward from the player */}
        {BLIPS.map((p, i) => {
          const at = 4 + Math.round((i / BLIPS.length) * 18); const bk = k - at; if (bk < 0) return null; const [x, y] = scr(p);
          const sc = [0.3, 1.35, 1.1][bk] ?? 1; const red = Math.floor((k + i * 3) / 5) % 2 === 0; const ph = ((k + i * 4) % 18) / 18;
          return <g key={i} transform={`translate(${x} ${y})`}>
            <circle r={12 + 16 * ph} fill="none" stroke={red ? '#ff4545' : '#4d8bff'} strokeWidth={3} opacity={0.6 * (1 - ph)} />
            <circle r={11 * sc} fill={red ? '#ff3b3b' : '#3b7bff'} stroke="#fff" strokeWidth={2.5} />
          </g>;
        })}
        <circle cx={me[0]} cy={me[1]} r={15} fill="#e54fa0" stroke="#fff" strokeWidth={4} />
      </svg>
      {pillO > 0 && <div style={{position: 'absolute', left: 540 - 457, top: 270 - 79, width: 915, height: 158, opacity: pillO, transform: `scale(${pillS}) rotate(${pillR}deg)`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 15, background: '#EAD389', boxShadow: '0 10px 24px rgba(0,0,0,0.45)'}} />
        <div style={{position: 'absolute', inset: 7, borderRadius: 10, background: '#1b2b47'}} />
        <div style={{position: 'absolute', inset: 9.5, borderRadius: 8, overflow: 'hidden', background: 'linear-gradient(180deg, #2aa4ec 0%, #0d91dc 42%, #0a84cc 100%)'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: '42%', background: 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0))'}} />
          {shine > -0.3 && shine < 1.3 && <div style={{position: 'absolute', top: -20, bottom: -20, left: `${shine * 100}%`, width: 120, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))', transform: 'skewX(-20deg)'}} />}
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Pill', fontSize: 75, color: '#fff', letterSpacing: 0.5, textShadow: '0 2px 4px rgba(0,40,90,0.35)'}}>All of Leonida</div>
        </div>
        <div style={{position: 'absolute', right: 52, bottom: -22, width: 42, height: 42, borderRadius: 21, background: '#ff3b3b', border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.4)'}} />
      </div>}
    </AbsoluteFill>
    {wi > 0 && <AbsoluteFill style={{background: wi > 0.15 ? '#B4B4B4' : '#DCDCDC', opacity: wi}} />}
  </AbsoluteFill>;
};

/* ---------------- the game's own 6-star notification as proof, "Escape is impossible" marked on "YOU DON'T" ---------------- */
const NotifCard: React.FC<{f: number}> = ({f}) => {
  const s = shot(32); const a = s.f0 + 2, end = s.f1 - 1; if (f < a || f >= end) return null; const k = f - a, j = end - 1 - f;
  const sc = [0.6, 0.9, 1.04][k] ?? 1; const bl = [10, 4][k] ?? 0; const op = ([0.4][k] ?? 1) * (j < 3 ? (j + 1) / 4 : 1);
  const hp = interpolate(f, [T(44.8), T(44.8) + 7], [0, 1], {...cl, easing: io});
  return <div style={{position: 'absolute', left: 80, top: 484, width: 920, height: 312, opacity: op, filter: bl ? `blur(${bl}px)` : undefined,
    transform: `perspective(1200px) rotateY(-6deg) rotate(-2deg) scale(${sc * (1 + 0.012 * Math.sin(k / 10))})`}}>
    <div style={{position: 'absolute', inset: -3, borderRadius: 16, border: '3px solid rgba(255,255,255,0.92)', boxShadow: '0 18px 40px rgba(0,0,0,0.6)'}} />
    <div style={{position: 'absolute', inset: 0, borderRadius: 14, overflow: 'hidden'}}>
      <Img src={staticFile('ls/six/notif.png')} style={{width: 920, height: 312, display: 'block'}} />
      <div style={{position: 'absolute', left: 186, top: 106, width: 478 * hp, height: 50, background: YEL, mixBlendMode: 'multiply'}} />
      <div style={{position: 'absolute', left: 190, top: 154, width: 470 * hp, height: 9, borderRadius: 5, background: YEL, boxShadow: '0 0 10px rgba(247,227,39,0.7)'}} />
    </div>
  </div>;
};

/* ---------------- end card: the YouTube comments sheet (R4 end-card entrance), typed answer with gold cursor ---------------- */
const TYPE = 'I lasted ';
const EndComments: React.FC<{s: Shot; f: number}> = ({s, f}) => {
  const e = f - s.f0;
  const sc = interpolate(e, [0, 1, 4, 5, 8], [2.4, 1.35, 1.06, 1.0, 1.0], {...cl, easing: eo});
  const ty = interpolate(e, [0, 1, 4, 6, 8], [300, 195, 65, -24, 0], cl);
  const bl = interpolate(e, [0, 1, 4, 6, 8], [44, 24, 6, 2, 0], cl);
  const push = 1 + (0.008 * Math.max(0, e - 8)) / FPS;
  const typed = TYPE.slice(0, Math.max(0, Math.min(TYPE.length, e - 10))); const curOn = e < 10 + TYPE.length || Math.floor((e - 10 - TYPE.length) / 8) % 2 === 0;
  const sw = interpolate(e, [4, 14], [-0.3, 1.3], cl); const sweeping = e >= 4 && e <= 14;
  const tw = e - 14; const twS = tw >= 0 && tw < 10 ? Math.sin((tw / 10) * Math.PI) : 0;
  const ui = (size: number, color: string, weight = 'In4'): React.CSSProperties => ({fontFamily: weight, fontSize: size, color, whiteSpace: 'nowrap'});
  return <AbsoluteFill style={{overflow: 'hidden', background: '#0f0f0f'}}>
    <AbsoluteFill style={{transform: `translateY(${ty}px) scale(${sc * push})`, filter: bl ? `blur(${bl}px)` : undefined}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 560, overflow: 'hidden'}}>
        <Img src={staticFile('ls/six/wasted.jpg')} style={{position: 'absolute', left: -220, top: -60, width: 1520, height: 855, objectFit: 'cover', filter: 'blur(20px) brightness(0.55)'}} />
        <Img src={staticFile('ls/six/wasted.jpg')} style={{position: 'absolute', left: 540 - 370, top: 96, width: 740, height: 416, objectFit: 'cover', borderRadius: 16, boxShadow: '0 8px 26px rgba(0,0,0,0.6)'}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 520, bottom: 0, background: '#212121', borderRadius: '38px 38px 0 0', boxShadow: '0 -10px 30px rgba(0,0,0,0.5)'}}>
        <div style={{position: 'absolute', left: 500, top: 18, width: 80, height: 8, borderRadius: 4, background: '#5a5a5a'}} />
        <div style={{position: 'absolute', left: 48, top: 58, ...ui(46, '#f1f1f1', 'UIBold')}}>Comments</div>
        <svg width={40} height={40} viewBox="0 0 24 24" style={{position: 'absolute', right: 48, top: 64}}><path d="M5 5 L19 19 M19 5 L5 19" stroke="#f1f1f1" strokeWidth={2.4} strokeLinecap="round" /></svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: 150, height: 2, background: '#3a3a3a'}} />
        {/* pinned comment from the channel */}
        <div style={{position: 'absolute', left: 40, top: 196, width: 104, height: 104, borderRadius: 52, overflow: 'hidden', background: 'radial-gradient(circle at 40% 35%, #4a1d6b, #1a0828)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 4px #E8C04C'}}><Emblem size={70} gear={1} /></div>
        <div style={{position: 'absolute', left: 172, top: 192, display: 'flex', alignItems: 'center', gap: 10, ...ui(28, '#aaaaaa')}}>
          <svg width={28} height={28} viewBox="0 0 24 24"><path d="M15 3 L21 9 L18 10 L14 14 L15 19 L13 21 L9 17 L4 22 L3 21 L8 16 L4 12 L6 10 L11 11 L15 7 Z" fill="#aaaaaa" /></svg>Pinned by @LeonidaShifts</div>
        <div style={{position: 'absolute', left: 172, top: 238, ...ui(32, sweeping ? 'transparent' : '#d0d0d0', 'In5'), backgroundImage: sweeping ? `linear-gradient(90deg, #d0d0d0 ${sw * 100 - 18}%, ${YEL} ${sw * 100 - 6}%, ${YEL} ${sw * 100 + 6}%, #d0d0d0 ${sw * 100 + 18}%)` : undefined,
          WebkitBackgroundClip: sweeping ? 'text' : undefined, backgroundClip: sweeping ? 'text' : undefined}}>@LeonidaShifts</div>
        {twS > 0 && <svg width={70} height={70} viewBox="-50 -50 100 100" style={{position: 'absolute', left: 430, top: 222, transform: `scale(${0.4 + twS}) rotate(${tw * 9}deg)`, opacity: twS}}>
          <path d="M0 -46 L5 -5 L46 0 L5 5 L0 46 L-5 5 L-46 0 L-5 -5 Z" fill="#fff" /><circle r={6} fill="#fff" /></svg>}
        <div style={{position: 'absolute', left: 172, top: 288, ...ui(40, '#f1f1f1')}}>How long did you last at 6 stars?</div>
        <div style={{position: 'absolute', left: 172, top: 342, ...ui(40, '#f1f1f1')}}>My time: 1:55</div>
        <div style={{position: 'absolute', left: 172, top: 412, display: 'flex', alignItems: 'center', gap: 46}}>
          <svg width={36} height={36} viewBox="0 0 24 24"><path d="M2 10 H6 V21 H2 Z M8 21 V10 L13 3 Q15 3 15 5.5 L14 9 H20 Q22 9 21.6 11.5 L20 19 Q19.5 21 17.5 21 Z" fill="none" stroke="#aaaaaa" strokeWidth={1.8} strokeLinejoin="round" /></svg>
          <svg width={36} height={36} viewBox="0 0 24 24" style={{transform: 'rotate(180deg)'}}><path d="M2 10 H6 V21 H2 Z M8 21 V10 L13 3 Q15 3 15 5.5 L14 9 H20 Q22 9 21.6 11.5 L20 19 Q19.5 21 17.5 21 Z" fill="none" stroke="#aaaaaa" strokeWidth={1.8} strokeLinejoin="round" /></svg>
          <svg width={36} height={36} viewBox="0 0 24 24"><path d="M3 5 H21 V16 H9 L4 20 V16 H3 Z" fill="none" stroke="#aaaaaa" strokeWidth={1.8} strokeLinejoin="round" /></svg>
        </div>
        {[1010, 1190].map((y, i) => <div key={i} style={{position: 'absolute', left: 40, right: 40, top: y, height: 130, opacity: 0.9}}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 88, height: 88, borderRadius: 44, background: '#2e2e2e'}} />
          <div style={{position: 'absolute', left: 132, top: 6, width: 260, height: 22, borderRadius: 11, background: '#2e2e2e'}} />
          <div style={{position: 'absolute', left: 132, top: 46, width: i ? 520 : 680, height: 28, borderRadius: 14, background: '#2a2a2a'}} />
          <div style={{position: 'absolute', left: 132, top: 88, width: i ? 360 : 300, height: 28, borderRadius: 14, background: '#2a2a2a'}} />
        </div>)}
        {/* add-a-comment field (R4 typed search: gold border + gold cursor) */}
        <div style={{position: 'absolute', left: 40, top: 700, width: 80, height: 80, borderRadius: 40, background: '#5c5c5c', overflow: 'hidden'}}>
          <svg width={80} height={80} viewBox="0 0 80 80"><circle cx={40} cy={31} r={14} fill="#bdbdbd" /><path d="M12 76 Q14 52 40 52 Q66 52 68 76 Z" fill="#bdbdbd" /></svg></div>
        <div style={{position: 'absolute', left: 140, right: 40, top: 694, height: 92, borderRadius: 46, background: '#303030', border: '3px solid #E8C04C', boxShadow: '0 0 14px rgba(232,192,76,0.4)'}}>
          <div style={{position: 'absolute', left: 36, top: 22, ...ui(38, typed ? '#f1f1f1' : '#9a9a9a')}}>{typed || (e < 10 ? 'Add a comment...' : '')}
            {e >= 10 && <span style={{color: '#D9A520', opacity: curOn ? 1 : 0, marginLeft: 2, fontFamily: 'Pill'}}>|</span>}</div>
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

/* ---------------- fonts / sfx ---------------- */
const useFonts = () => {
  const [h] = React.useState(() => delayRender('six-fonts')); const [ok, setOk] = React.useState(false);
  React.useEffect(() => {
    const list: [string, string][] = [['Cap', 'ls/fonts/cap900w105.woff2'], ['Prompt', 'ls/fonts/oswald700.woff2'], ['Pill', 'ls/fonts/outfit400.woff2'], ['Pill5', 'ls/fonts/outfit500.woff2'],
      ['Pill7', 'ls/fonts/outfit700.woff2'], ['UIBold', 'Inter-Bold.otf'], ['In4', 'ls/fonts/inter400.woff2'], ['In5', 'ls/fonts/inter500.woff2'], ['Mono', 'ls/fonts/mono700.woff2']];
    Promise.all(list.map(([n, p]) => new FontFace(n, `url(${staticFile(p)})`).load())).then((fs) => { fs.forEach((x) => document.fonts.add(x)); setOk(true); continueRender(h); });
  }, [h]);
  return ok;
};
const S: React.FC<{at: number; n: string; v?: number}> = ({at, n, v = 0.5}) => <Sequence from={Math.max(0, T(at))} durationInFrames={45} layout="none"><Audio src={staticFile(`ls/${n}.wav`)} volume={v} /></Sequence>;
const CUTS = SH.slice(1).map((s) => s.f0 / FPS);

const Visuals: React.FC = () => {
  const f = useCurrentFrame(); const s = SH[shotIdx(f)];
  const fx = s.id === 21 && f >= CCTV_A ? 'grayscale(1) contrast(1.3) brightness(1.08)' : undefined;
  const s6 = shot(6), s19 = shot(19);
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    {s.kind === 'map' ? <MapOut s={s} f={f} /> : s.kind === 'end' ? <EndComments s={s} f={f} /> : <Footage s={s} f={f} fx={fx} />}
    <Leak f={f} />
    <Cctv f={f} />
    <Tracked f={f} />
    {BARS.map((c, i) => <StarBar key={i} f={f} c={c} />)}
    {/* the real sixth star landing (60 fps slow-mo HUD crop), bracket on the new star */}
    <HudCard f={f} a={T(7.83)} b={s6.f1 - 1} file="ls/six/hud6.mp4" from={s6.f0} trim={6} marks={[{x: 123, y: 92, w: 118, h: 112, at: T(8.75)}]} />
    {/* identifier icons: face → clothes → car */}
    <HudCard f={f} a={s19.f0 + 2} b={shot(20).f1 - 2} file="ls/six/hud_icons.mp4" from={s19.f0} trim={6} rePop={shot(20).f0}
      marks={[{x: 681, y: 225, w: 380, h: 128, at: s19.f0 + 2}, {x: 680, y: 225, w: 124, h: 124, at: T(26.84)}, {x: 553, y: 225, w: 124, h: 124, at: T(27.27)}, {x: 809, y: 225, w: 124, h: 124, at: T(27.99)}]} />
    <YearPop f={f} />
    <Badge f={f} />
    <Triad f={f} />
    <NotifCard f={f} />
    <TimerPop f={f} />
    <Logo f={f} />
    <Vignette />
    <Caption f={f} />
  </AbsoluteFill>;
};

export const SixStar: React.FC = () => {
  const ok = useFonts(); const f = useCurrentFrame();
  if (!ok) return <AbsoluteFill style={{background: '#000'}} />;
  const vf = f === 1 ? 9 : f === 2 ? 14 : f;          // R4 opening: frames 1–2 are flash-forwards of 9 and 14
  return <AbsoluteFill style={{background: '#000'}}>
    <Freeze frame={vf} active={f === 1 || f === 2}><Visuals /></Freeze>
    {/* audio (R4 mix): the ElevenLabs VO from frame 0, our own music low-passed 18 LU under it, light SFX — no game audio */}
    <Audio src={staticFile('ls/six/vo.wav')} />
    <Audio src={staticFile('ls/six/bed.wav')} />
    <S at={0.08} n="sfx2/sparkle" v={0.45} /><S at={0.78} n="sfx2/sparkle" v={0.22} />
    {CUTS.map((c, i) => <S key={i} at={c - 0.12} n="sfx2/whoosh" v={0.16} />)}
    {/* star bars */}
    <S at={5.86} n="sfx2/pop" v={0.25} />{[5.95, 6.02, 6.09, 6.16, 6.23].map((t) => <S key={t} at={t} n="sfx2/tap" v={0.32} />)}<S at={6.7} n="sfx/click" v={0.5} />
    <S at={14.4} n="sfx2/pop" v={0.25} />{[14.95, 15.02, 15.09].map((t) => <S key={t} at={t} n="sfx2/tap" v={0.32} />)}
    <S at={16.13} n="sfx2/pop" v={0.25} />{[16.26, 16.33, 16.4].map((t) => <S key={t} at={t} n="sfx2/tap" v={0.32} />)}<S at={16.44} n="sfx2/chime" v={0.2} />
    <S at={23.66} n="sfx2/pop" v={0.22} />
    {/* HUD cards */}
    <S at={7.83} n="sfx2/pop" v={0.3} />{[8.21, 8.31, 8.41, 8.51, 8.61, 8.71].map((t) => <S key={t} at={t} n="sfx2/tap" v={0.3} />)}<S at={8.75} n="sfx2/chime" v={0.25} />
    <S at={25.47} n="sfx2/pop" v={0.3} />{[26.84, 27.27, 27.99].map((t) => <S key={t} at={t} n="sfx2/tap" v={0.4} />)}
    {/* year roll, explosions, brackets */}
    <S at={10.57} n="sfx2/pop" v={0.3} />{Array.from({length: 11}, (_, i) => <S key={'y' + i} at={10.8 + i * 0.066} n="sfx2/key" v={0.18} />)}<S at={11.53} n="sfx2/chime" v={0.3} /><S at={11.55} n="sfx2/sparkle" v={0.15} />
    <S at={17.09} n="sfx/boom" v={0.22} /><S at={19.97} n="sfx/boom" v={0.3} />
    <S at={18.67} n="sfx2/pop" v={0.3} /><S at={39.9} n="sfx2/pop" v={0.3} /><S at={31.85} n="sfx2/pop" v={0.28} />
    {/* CCTV, badge, triad */}
    <S at={28.75} n="sfx/blip" v={0.4} /><S at={28.75} n="sfx/glitch" v={0.14} />
    <S at={32.69} n="sfx/click" v={0.5} /><S at={33.66} n="sfx2/pop" v={0.38} /><S at={33.68} n="sfx2/sparkle" v={0.2} />
    {[36.2, 36.27, 36.34].map((t) => <S key={t} at={t} n="sfx2/tap" v={0.3} />)}{[36.95, 37.02, 37.08].map((t) => <S key={t} at={t} n="sfx/click" v={0.42} />)}
    {/* map, proof card, death, timer, end card */}
    {[41.05, 41.2, 41.35, 41.5].map((t) => <S key={t} at={t} n="sfx2/tap" v={0.12} />)}<S at={41.57} n="sfx2/chime" v={0.22} />
    <S at={44.74} n="sfx2/pop" v={0.3} /><S at={44.8} n="sfx/swish" v={0.18} />
    <S at={47.28} n="sfx/boom" v={0.3} /><S at={47.85} n="sfx/boom" v={0.36} />
    <S at={49.4} n="sfx2/pop" v={0.3} />{Array.from({length: 9}, (_, i) => <S key={'t' + i} at={49.47 + i * 0.09} n="sfx2/key" v={0.16} />)}<S at={50.22} n="sfx2/chime" v={0.3} />
    <S at={50.86} n="sfx2/ding" v={0.3} />{Array.from({length: 9}, (_, i) => <S key={'c' + i} at={51.16 + i / 30} n="sfx2/key" v={0.2} />)}
  </AbsoluteFill>;
};
