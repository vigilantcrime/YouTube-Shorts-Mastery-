/* Leonida Shifts — Short: "NPCs in GTA 6 will ask you for help… and you'll regret it" (swamp van + tiger, g7).
   Frame-exact rebuild of Roddy Games R4 ("This Dog Digging Spot in GTA 6 Pays A…") — see roddy_style.md §8.
   Every number below comes from that measurement (720p values ×1.5). Own assets only: our gameplay, our emblem,
   Natural-Earth Florida as the "Leonida" map, open-licence fonts (Archivo, Oswald, Outfit, Ranchers). */
import React from 'react';
import {AbsoluteFill, Audio, Freeze, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {Emblem} from './kit';
import geo from './geo.json';

const FPS = 30, W = 1080, H = 1920;
export const NS_FRAMES = 819;                       // 27.3 s: VO ends 26.99 s + 0.3 s tail (R4)
const T = (s: number) => Math.round(s * FPS);
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const YEL = '#F7E327', MAG = '#ED25AB', WHT = '#FEFEFE';
const SRC0 = 6.0;                                   // ls/g7hq.mp4 = g7 6.0–50.0 s, Lanczos-upscaled to 3414×1920 @30
const VW = 3414, VH = 1920;
const io = Easing.inOut(Easing.cubic), eo = Easing.out(Easing.cubic);

/* ---------------- shots (cut frames = caption swaps) ---------------- */
type Key = {s: number; cx: number; cy?: number; z?: number};
type Punch = {t: number; a: number};
type Shot = {f0: number; f1: number; src: number; keys: Key[]; punches: Punch[]; o?: [number, number]; kind?: 'map' | 'end'; file?: 'b' | 'slo'; rate?: number};
const SH: Shot[] = [
  {f0: 0, f1: T(1.98), src: 12.0, keys: [{s: 12, cx: 0.6, z: 1.18}, {s: 12.9, cx: 0.6, z: 1.18}, {s: 13.98, cx: 0.67, z: 1.18}], punches: [{t: 0.98, a: 0.05}], o: [700, 960]},          // NPC waves you over
  {f0: T(1.98), f1: T(4.15), src: 9.9, keys: [{s: 9.9, cx: 0.6}], punches: [{t: 2.87, a: 0.08}, {t: 3.54, a: 0.05}]},    // straining at the stuck van
  {f0: T(4.15), f1: T(5.68), src: 0, keys: [], punches: [], kind: 'map'},
  {f0: T(5.68), f1: T(7.2), src: 6.65, keys: [{s: 6.65, cx: 0.4}, {s: 7.2, cx: 0.55}, {s: 7.7, cx: 0.54}, {s: 8.17, cx: 0.47}], punches: [{t: 6.73, a: 0.07}]},
  {f0: T(7.2), f1: T(8.08), src: 8.55, keys: [{s: 8.55, cx: 0.36, cy: 0.56, z: 1.25}], punches: [{t: 7.8, a: 0.07}], o: [430, 860]},                     // stuck in the mud
  {f0: T(8.08), f1: T(9.07), src: 14.5, keys: [{s: 14.5, cx: 0.56}], punches: [{t: 8.79, a: 0.05}]},                    // walk up
  {f0: T(9.07), f1: T(9.94), src: 28.8, keys: [{s: 28.8, cx: 0.42}], punches: [{t: 9.47, a: 0.12}], o: [350, 790]},     // the game's own OPEN / PUSH prompt
  {f0: T(9.94), f1: T(10.79), src: 33.2, keys: [{s: 33.2, cx: 0.5}], punches: [{t: 10.23, a: 0.08}]},                   // dig your heels in
  {f0: T(10.79), f1: T(12.32), src: 16.45, keys: [{s: 16.45, cx: 0.5}], punches: [{t: 11.61, a: 0.05}]},               // "what are you doing out here?"
  {f0: T(12.32), f1: T(13.61), src: 31.5, keys: [{s: 31.5, cx: 0.44}], punches: [{t: 12.56, a: 0.07}, {t: 13.4, a: 0.05}]},
  {f0: T(13.61), f1: T(14.37), src: 35.3, keys: [{s: 35.3, cx: 0.45}], punches: [{t: 14.1, a: 0.08}]},                  // the back doors
  {f0: T(14.37), f1: T(15.8), src: 36.87, keys: [{s: 36.87, cx: 0.53}], punches: [{t: 14.63, a: 0.1}, {t: 15.14, a: 0.05}], o: [580, 1080]}, // tiger in the doorway
  {f0: T(15.8), f1: T(17.1), src: 42.85, keys: [{s: 42.85, cx: 0.5}], punches: [{t: 16.78, a: 0.08}]},                  // tiger out by the van
  {f0: T(17.1), f1: T(18.37), src: 44.9, keys: [{s: 44.9, cx: 0.43}], punches: [{t: 17.29, a: 0.06}, {t: 17.95, a: 0.06}]},
  {f0: T(18.37), f1: T(19.65), src: 46.4, keys: [{s: 46.4, cx: 0.52}], punches: [{t: 18.56, a: 0.05}]},                // wide dusk road — LEONIDA
  {f0: T(19.65), f1: T(21.07), src: 40.02, keys: [{s: 40.02, cx: 0.42}, {s: 40.5, cx: 0.42}, {s: 40.97, cx: 0.3, z: 1.18, cy: 0.4237}, {s: 41.44, cx: 0.3, z: 1.18, cy: 0.4237}], punches: [{t: 19.93, a: 0.06}, {t: 20.89, a: 0.08}]},
  /* the kill (g7 49.8–57.3), under "Subscribe to Leonida Shifts because we're putting in that shift…" */
  {f0: T(21.07), f1: T(22.36), src: 49.8, file: 'b', keys: [{s: 49.8, cx: 0.47}], punches: [{t: 21.69, a: 0.07}], o: [600, 900]},          // tiger charges — aim mode, shot 1
  {f0: T(22.36), f1: T(23.17), src: 51.2, file: 'b', keys: [{s: 51.2, cx: 0.49, cy: 0.47, z: 1.12}], punches: [{t: 22.45, a: 0.06}], o: [620, 880]}, // closer, hit markers, shot 2
  {f0: T(23.17), f1: T(24.12), src: 52.3, file: 'b', keys: [{s: 52.3, cx: 0.49}], punches: [{t: 23.62, a: 0.1}], o: [600, 860]},          // the lunge… and it drops
  {f0: T(24.12), f1: T(25.06), src: 52.55, file: 'slo', rate: 0.5, keys: [{s: 52.55, cx: 0.5}], punches: [{t: 24.3, a: 0.06}], o: [580, 880]}, // 60fps slow-mo replay of the kill
  {f0: T(25.06), f1: T(25.8), src: 56.6, file: 'b', keys: [{s: 56.6, cx: 0.47}], punches: [{t: 25.1, a: 0.05}]},                          // standing over the tiger
  {f0: T(25.8), f1: NS_FRAMES, src: 0, keys: [], punches: [], kind: 'end'},
];
const shotIdx = (f: number) => { let k = 0; SH.forEach((s, i) => { if (f >= s.f0) k = i; }); return k; };

/* cut transition (R4 §8.6): outgoing −2/−1 frames, incoming 0..3 frames */
const inFx = (k: number) => [[1.11, 30, 0.2], [1.055, 12, 0.1], [1.015, 1.5, 0], [1.005, 0, 0]][k] ?? [1, 0, 0];
const outFx = (j: number) => [[1.14, 18], [1.03, 2]][j] ?? [1, 0];
const punchV = (f: number, p: Punch) => { const d = f - T(p.t); if (d < 0) return 0; if (d < 10) return p.a * io(d / 10); if (d < 14) return p.a * (1 - 0.15 * io((d - 10) / 4)); return 0.85 * p.a; };
/* opening stutter: R4 frames 0 & 3–12 ease 0.774→1 (rescaled to our 1.18 base), frames 1–2 are flash-forwards of 9 & 14 */
const OPEN_R = [0.847, 0, 0, 0.881, 0.894, 0.905, 0.921, 0.939, 0.955, 0.97, 0.982, 0.992, 1];
const LEAK = [1, 0, 0, 0.95, 0.9, 0.85, 0.75, 0.6, 0.45, 0.3, 0.12, 0, 0];

const shotZoom = (s: Shot, f: number, open: boolean) => {
  let z = 1 + 0.015 * (f - s.f0) / FPS;
  s.punches.forEach((p) => { z *= 1 + punchV(f, p); });
  const k = f - s.f0, j = s.f1 - 1 - f; let blur = 0, wash = 0;
  if (!open) { const [zi, bi, wi] = inFx(k); z *= zi; blur = Math.max(blur, bi); wash = wi; }
  else if (f <= 12) z *= OPEN_R[f];
  if (s.kind !== 'end') { const [zo, bo] = outFx(j); z *= zo; blur = Math.max(blur, bo); }
  return {z, blur, wash};
};
const interpKeys = (keys: Key[], s: number) => {
  if (keys.length === 1) return keys[0]; const xs = keys.map((k) => k.s);
  const g = (sel: (k: Key) => number) => interpolate(s, xs, keys.map(sel), {...cl, easing: io});
  return {s, cx: g((k) => k.cx), cy: g((k) => k.cy ?? 0.5), z: g((k) => k.z ?? 1)};
};
/* source-normalised point → frame px for shot s at frame f (used by tracked overlays) */
const place = (s: Shot, f: number, u: number, v: number) => {
  const st = s.src + (f - s.f0) / FPS; const k = interpKeys(s.keys, st); const zb = k.z ?? 1; const vw = VW * zb, vh = VH * zb;
  const L = Math.min(0, Math.max(W - vw, 540 - k.cx * vw)), Tp = Math.min(0, Math.max(H - vh, 960 - (k.cy ?? 0.5) * vh));
  const {z} = shotZoom(s, f, s.f0 === 0); const [ox, oy] = s.o ?? [540, 960];
  return [ox + (L + u * vw - ox) * z, oy + (Tp + v * vh - oy) * z, z] as const;
};

const Footage: React.FC<{s: Shot; f: number}> = ({s, f}) => {
  const st = s.src + (f - s.f0) / FPS * (s.rate ?? 1); const k = interpKeys(s.keys, st); const zb = k.z ?? 1; const vw = VW * zb, vh = VH * zb;
  const L = Math.min(0, Math.max(W - vw, 540 - k.cx * vw)), Tp = Math.min(0, Math.max(H - vh, 960 - (k.cy ?? 0.5) * vh));
  const {z, blur, wash} = shotZoom(s, f, s.f0 === 0); const [ox, oy] = s.o ?? [540, 960];
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${ox}px ${oy}px`, filter: blur ? `blur(${blur}px)` : undefined}}>
      <Sequence from={s.f0} layout="none">
        <OffthreadVideo src={staticFile(s.file === 'b' ? 'ls/g7hq_b.mp4' : s.file === 'slo' ? 'ls/g7slo.mp4' : 'ls/g7hq.mp4')} muted
          trimBefore={Math.round((s.file === 'b' ? s.src - 44.0 : s.file === 'slo' ? (s.src - 52.45) * 2 : s.src - SRC0) * FPS)} style={{position: 'absolute', left: L, top: Tp, width: vw, height: vh}} />
      </Sequence>
    </AbsoluteFill>
    {wash > 0 && <AbsoluteFill style={{background: wash > 0.15 ? '#B4B4B4' : '#DCDCDC', opacity: wash}} />}
  </AbsoluteFill>;
};

/* ---------------- captions (Archivo 900 w105 + 2.25 px same-colour stroke, spread shadow) ---------------- */
const CAPS: [number, string, string, string][] = [
  [0, 'NPCS IN', 'NPCS', YEL], [0.98, 'GTA 6', 'GTA 6', YEL], [1.98, 'WILL ASK YOU', 'ASK', MAG], [2.56, 'FOR HELP', 'HELP', YEL],
  [3.09, "AND YOU'LL", '', ''], [3.54, 'REGRET IT', 'REGRET', MAG], [4.15, 'HEAD OUT TO', '', ''], [4.6, 'THE SWAMP', 'SWAMP', YEL],
  [5.12, 'AT SUNSET', 'SUNSET', YEL], [5.68, 'WHERE TWO GUYS', '', ''], [6.41, 'HAVE THEIR VAN', 'VAN', YEL], [7.2, 'STUCK IN', 'STUCK', MAG],
  [7.62, 'THE MUD', 'MUD', YEL], [8.08, 'WALK UP', '', ''], [8.49, "AND THEY'LL", '', ''], [9.07, 'ASK YOU TO', '', ''], [9.47, 'PUSH', 'PUSH', MAG],
  [9.94, 'DIG YOUR', '', ''], [10.23, 'HEELS IN', 'HEELS', YEL], [10.79, 'THEN ASK', '', ''], [11.21, "WHAT THEY'RE", '', ''],
  [11.61, 'DOING OUT HERE', '', ''], [12.32, 'KEEP PUSHING', 'PUSHING', MAG], [12.84, 'UNTIL THEY OPEN', '', ''], [13.61, 'THE BACK DOORS', 'BACK DOORS', YEL],
  [14.37, 'AND A TIGER', 'TIGER', YEL], [15.14, 'CLIMBS OUT', 'CLIMBS', MAG], [15.8, 'TURNS OUT', '', ''], [16.51, 'JUST STUFF', 'JUST STUFF', YEL],
  [17.1, 'MEANT SMUGGLING', 'SMUGGLING', MAG], [17.87, 'A TIGER', 'TIGER', YEL], [18.37, 'THROUGH LEONIDA', 'LEONIDA', YEL], [19.29, 'AND NOW', '', ''],
  [19.65, "IT'S LOOSE", 'LOOSE', MAG], [20.26, 'RIGHT NEXT', '', ''], [20.68, 'TO YOU', 'YOU', YEL], [21.07, 'SUBSCRIBE', 'SUBSCRIBE', MAG],
  [21.58, 'TO LEONIDA', 'LEONIDA', YEL], [22.36, 'SHIFTS', 'SHIFTS', YEL], [22.79, "BECAUSE WE'RE", '', ''], [23.17, 'PUTTING IN', '', ''],
  [23.69, 'THAT SHIFT', 'SHIFT', MAG], [24.12, 'TO MAKE SURE', '', ''], [24.59, 'YOU SEE', '', ''], [25.06, 'EVERYTHING', 'EVERYTHING', MAG],
  [25.43, 'RELATED TO', '', ''], [26.2, 'GTA 6', 'GTA 6', YEL],
];
const CAP_PX = 70, CAP_BASE = 1461.25, WORD_GAP = 17.5;
let measureCtx: CanvasRenderingContext2D | null = null;
const wordW = (w: string) => { if (!measureCtx) { measureCtx = document.createElement('canvas').getContext('2d'); }
  const c = measureCtx!; c.font = `${CAP_PX}px Cap`; (c as any).fontKerning = 'none'; return c.measureText(w).width; };
const Caption: React.FC<{f: number}> = ({f}) => {
  let k = 0; CAPS.forEach((c, i) => { if (T(c[0]) <= f) k = i; });
  const [, txt, key, col] = CAPS[k]; const words = txt.split(' '); const keyWords = key ? key.split(' ') : [];
  const ws = words.map(wordW); const total = ws.reduce((a, b) => a + b, 0) + WORD_GAP * (words.length - 1);
  let x = 540 - total / 2; const items = words.map((w, i) => { const it = {w, x, c: keyWords.length && i >= words.length - keyWords.length && keyWords.includes(w) ? col : WHT}; x += ws[i] + WORD_GAP; return it; });
  if (key && !txt.endsWith(key)) { items.forEach((it) => { it.c = keyWords.includes(it.w) ? col : WHT; }); }
  const txtEl = (shadow: boolean) => items.map((it, i) => <text key={i} x={it.x} y={CAP_BASE} fontFamily="Cap" fontSize={CAP_PX} style={{fontKerning: 'none'}}
    fill={shadow ? '#000' : it.c} stroke={shadow ? '#000' : it.c} strokeWidth={shadow ? 19.5 : 4.5} strokeLinejoin="round" paintOrder="stroke">{it.w}</text>);
  return <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
    <defs><filter id="capsh" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="9" /></filter></defs>
    <g filter="url(#capsh)" opacity={0.74} transform="translate(3 3)">{txtEl(true)}</g>
    <g>{txtEl(false)}</g>
  </svg>;
};

/* ---------------- lens: vignette only (R4 §8.5) ---------------- */
const Vignette: React.FC = () => <AbsoluteFill style={{background: 'radial-gradient(ellipse 856px 1143px at 540px 961px, rgba(0,0,0,0) 55.5%, rgba(0,0,0,0.285) 80%, rgba(0,0,0,0.53) 100%)'}} />;

/* ---------------- opening pink leak ---------------- */
const Leak: React.FC<{f: number}> = ({f}) => { const o = f < LEAK.length ? LEAK[f] : 0; if (!o) return null;
  return <AbsoluteFill style={{opacity: o, mixBlendMode: 'screen', background: 'radial-gradient(circle 620px at 46% 56%, rgba(255,70,200,0.62) 0%, rgba(255,70,200,0.3) 45%, rgba(255,70,200,0) 100%), linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))'}} />; };

/* ---------------- logo sting: 3D emblem + wordmark, 2 glints, fly-out (R4 §8.3) ---------------- */
const glintX = (t: number) => { for (const [a, b] of [[0.1, 0.37], [0.8, 1.07]]) if (t >= a && t <= b) return interpolate(t, [a, b], [-0.25, 1.25]); return null; };
const Logo: React.FC<{f: number}> = ({f}) => {
  if (f > 91) return null; const t = f / FPS;
  const ex = f >= 86 ? f - 86 : -1; const exY = [0, -10, -32, -70, -125, -190][ex] ?? 0; const exX = [0, -3, -8, -15, -24, -34][ex] ?? 0;
  const exB = [0, 0, 1.5, 4, 7, 10][ex] ?? 0; const exO = [1, 1, 1, 0.92, 0.6, 0.18][ex] ?? 1;
  const bob = 6 * Math.sin((2 * Math.PI * t) / 2.0), yaw = -9 + 3 * Math.sin((2 * Math.PI * t) / 2.6);
  const g = glintX(t);
  const depth = Array.from({length: 10}, (_, i) => i + 1);
  return <div style={{position: 'absolute', left: 399, top: 114, width: 330, height: 262, transform: `translate(${(ex >= 0 ? exX : 0)}px, ${bob + (ex >= 0 ? exY : 0)}px) perspective(900px) rotateY(${yaw}deg) rotateX(6deg)`,
    filter: exB ? `blur(${exB}px)` : undefined, opacity: exO}}>
    {/* extruded emblem */}
    <div style={{position: 'absolute', left: 65, top: 0, width: 200, height: 200}}>
      {depth.map((i) => <div key={i} style={{position: 'absolute', left: i * 1.5, top: i * 2.0, width: 200, height: 200, borderRadius: 52, background: i === 10 ? '#16041f' : i > 6 ? '#2b0a3d' : '#43125c'}} />)}
      <div style={{position: 'absolute', inset: 0, borderRadius: 52, overflow: 'hidden', boxShadow: '0 0 0 4px #fff, 0 0 34px rgba(255,79,176,0.6)'}}>
        <Emblem size={200} gear={interpolate(t, [0.45, 0.75], [0, 1], cl)} />
        {g !== null && <div style={{position: 'absolute', top: -60, bottom: -60, left: `${g * 100}%`, width: 64, marginLeft: -32, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.85), rgba(255,255,255,0))', transform: 'skewX(-22deg)'}} />}
      </div>
    </div>
    {/* extruded wordmark */}
    <div style={{position: 'absolute', left: -20, right: -20, top: 226, textAlign: 'center', fontFamily: 'Cap', fontSize: 35, lineHeight: 1, letterSpacing: 0.5, whiteSpace: 'nowrap',
      textShadow: depth.slice(0, 5).map((i) => `${i * 0.8}px ${i * 1.05}px 0 #3d0f55`).join(',') + ', 0 0 16px rgba(255,79,176,0.45)'}}>
      <span style={{color: '#fff'}}>LEONIDA </span><span style={{color: '#FFB347'}}>SHIFTS</span>
    </div>
    {g !== null && <div style={{position: 'absolute', left: -20, right: -20, top: 226, textAlign: 'center', fontFamily: 'Cap', fontSize: 35, lineHeight: 1, letterSpacing: 0.5, whiteSpace: 'nowrap', color: 'transparent',
      backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0) ${g * 100 - 9}%, rgba(255,255,255,0.95) ${g * 100}%, rgba(255,255,255,0) ${g * 100 + 9}%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text'}}>LEONIDA SHIFTS</div>}
  </div>;
};

/* ---------------- map zoom + ring + pill (R4 §8.8.1) ---------------- */
const FL = geo.fl as {n: string; d: string}[]; const FLX = geo.flx as {n: string; d: string}[];
const SWAMP: [number, number] = [781, 812];
const ROADS: number[][][] = [
  [[647, 755], [700, 758], [760, 760], [835, 761]],                                                         // I-75 Alligator Alley
  [[647, 755], [640, 684], [607, 631], [550, 578], [559, 488], [601, 307], [577, 237], [535, 158]],        // I-75
  [[857, 811], [864, 758], [875, 671], [836, 588], [802, 469], [776, 391], [748, 302], [710, 200], [664, 137]], // I-95
  [[559, 488], [626, 475], [701, 400], [748, 302]],                                                         // I-4
  [[819, 854], [857, 811], [829, 643], [764, 510], [701, 400], [614, 354]],                                 // Turnpike
  [[819, 857], [824, 910], [799, 935], [739, 966], [705, 972], [648, 987]],                                 // Overseas Hwy
  [[647, 755], [711, 793], [781, 811], [857, 811]],                                                         // Tamiami Trail
];
const URBAN: number[][] = [[852, 792, 11, 30], [561, 486, 11, 9], [702, 402, 10, 9], [662, 141, 11, 9], [642, 688, 6, 5], [873, 676, 5, 12]];
const mapZ = (k: number) => {
  if (k < 3) return 1;
  if (k < 13) return interpolate(k, [3, 13], [1, 2.85], {easing: io});
  if (k < 17) return interpolate(k, [13, 17], [2.85, 3.0], {easing: eo});
  if (k < 21) return interpolate(k, [17, 21], [3.0, 2.94], {easing: io});
  if (k < 26) return 2.94;
  if (k < 30) return interpolate(k, [26, 30], [2.94, 3.06], {easing: io});
  if (k < 35) return interpolate(k, [30, 35], [3.06, 3.0], {easing: io});
  return 3.0;
};
const MapZoom: React.FC<{s: Shot; f: number}> = ({s, f}) => {
  const k = f - s.f0; const Z = mapZ(k); const u = Math.min(1, (Z - 1) / 2.0);
  const S = 1.75 * Z; const P: [number, number] = [638 + (540 - 638) * u, 1401 + (700 - 1401) * u];
  const [zi, bi, wi] = inFx(k); const [zo, bo] = outFx(s.f1 - 1 - f); const blur = Math.max(bi, bo);
  const tr = `translate(${P[0]} ${P[1]}) scale(${S}) translate(${-SWAMP[0]} ${-SWAMP[1]})`;
  const ring = interpolate(k, [11, 14], [0, 1], {...cl, easing: eo}); const inner = interpolate(k, [15, 18], [0, 1], cl);
  const pk = k - 14; const pillO = pk < 0 ? 0 : pk === 0 ? 0.3 : 1; const pillS = pk < 0 ? 0.8 : interpolate(pk, [0, 1, 4, 7], [0.8, 0.9, 1.05, 1], cl);
  const pillR = interpolate(pk, [0, 4, 7], [-3, -1.5, 0], cl); const shine = interpolate(pk, [8, 18], [-0.3, 1.3], cl);
  return <AbsoluteFill style={{overflow: 'hidden', background: '#1d6f9f'}}>
    <AbsoluteFill style={{transform: `scale(${zi * zo})`, filter: blur ? `blur(${blur}px)` : undefined}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="sea" cx="55%" cy="45%" r="75%"><stop offset="0" stopColor="#3aa3cf" /><stop offset="0.6" stopColor="#2a87b8" /><stop offset="1" stopColor="#1b6797" /></radialGradient>
          <filter id="shal" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9" /></filter>
          <filter id="land" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="4" seed="4" result="n" /><feColorMatrix in="n" type="saturate" values="0" result="g" />
            <feComponentTransfer in="g" result="g2"><feFuncA type="linear" slope="0.4" /></feComponentTransfer><feComposite in="g2" in2="SourceGraphic" operator="in" result="tex" /><feBlend in="SourceGraphic" in2="tex" mode="multiply" /></filter>
        </defs>
        <rect width={W} height={H} fill="url(#sea)" />
        <g transform={tr}>
          <g filter="url(#shal)" opacity={0.75}>{[...FLX, ...FL].map((p, i) => <path key={i} d={p.d} fill="none" stroke="#6fd0ea" strokeWidth={26} strokeLinejoin="round" />)}</g>
          {[...FLX, ...FL].map((p, i) => <path key={'b' + i} d={p.d} fill="#e6d39a" stroke="#e6d39a" strokeWidth={3.2} strokeLinejoin="round" />)}
          <g filter="url(#land)">{[...FLX, ...FL].map((p, i) => <path key={'l' + i} d={p.d} fill={p.n === 'Florida' ? '#7eaa69' : '#86ad70'} />)}</g>
          <ellipse cx={770} cy={818} rx={64} ry={52} fill="#a9c27f" opacity={0.5} /><ellipse cx={745} cy={790} rx={30} ry={22} fill="#94b874" opacity={0.45} /><ellipse cx={640} cy={300} rx={90} ry={120} fill="#6c9a5c" opacity={0.35} />
          <ellipse cx={773} cy={635} rx={25} ry={27} fill="#3d9fcc" stroke="#e6d39a" strokeWidth={1.2} />
          {URBAN.map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#cfd5db" opacity={0.62} />)}
          {ROADS.map((r, i) => <polyline key={i} points={r.map((p) => p.join(',')).join(' ')} fill="none" stroke="#f6f6f6" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" opacity={0.9} />)}
          {/* location ring (screen-sized strokes) */}
          <g opacity={ring}>
            <circle cx={SWAMP[0]} cy={SWAMP[1]} r={58} fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={1.6 / S} />
            <ellipse cx={SWAMP[0]} cy={SWAMP[1]} rx={43 * (0.35 + 0.65 * ring)} ry={34 * (0.35 + 0.65 * ring)} fill="rgba(214,226,74,0.28)" stroke="#f5d442" strokeWidth={4.5 / S} strokeDasharray={`${20 / S} ${13 / S}`} />
            <ellipse cx={SWAMP[0]} cy={SWAMP[1] + 1.5} rx={36} ry={28} fill="none" stroke="#fff" strokeWidth={4.5 / S} opacity={inner} />
          </g>
        </g>
      </svg>
      {/* pill (screen space) */}
      {pillO > 0 && <div style={{position: 'absolute', left: 517 - 457, top: P[1] - 14 - 79, width: 915, height: 158, opacity: pillO, transform: `scale(${pillS}) rotate(${pillR}deg)`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 15, background: '#EAD389', boxShadow: '0 10px 24px rgba(0,0,0,0.45)'}} />
        <div style={{position: 'absolute', inset: 7, borderRadius: 10, background: '#1b2b47'}} />
        <div style={{position: 'absolute', inset: 9.5, borderRadius: 8, overflow: 'hidden', background: 'linear-gradient(180deg, #2aa4ec 0%, #0d91dc 42%, #0a84cc 100%)'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: '42%', background: 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0))'}} />
          {shine > -0.3 && shine < 1.3 && <div style={{position: 'absolute', top: -20, bottom: -20, left: `${shine * 100}%`, width: 120, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))', transform: 'skewX(-20deg)'}} />}
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Pill', fontSize: 75, color: '#fff', letterSpacing: 0.5, textShadow: '0 2px 4px rgba(0,40,90,0.35)'}}>The Swamp</div>
        </div>
        <div style={{position: 'absolute', right: 52, bottom: -22, width: 42, height: 42, borderRadius: 21, background: '#e54fa0', border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.4)'}} />
      </div>}
    </AbsoluteFill>
    {wi > 0 && <AbsoluteFill style={{background: wi > 0.15 ? '#B4B4B4' : '#DCDCDC', opacity: wi}} />}
  </AbsoluteFill>;
};

/* ---------------- tracked frame: brackets (close) / spotlight (far) ---------------- */
const Frame: React.FC<{x: number; y: number; w: number; h: number; s?: number; o?: number; bright?: boolean}> = ({x, y, w, h, s = 1, o = 1, bright}) => {
  const arm = 54, th = 12;
  const corner = (sx: number, sy: number) => <div style={{position: 'absolute', left: sx ? undefined : -14, right: sx ? -14 : undefined, top: sy ? undefined : -14, bottom: sy ? -14 : undefined, width: arm, height: arm,
    borderStyle: 'solid', borderColor: '#F6E22F', borderWidth: `${sy ? 0 : th}px ${sx ? th : 0}px ${sy ? th : 0}px ${sx ? 0 : th}px`,
    borderRadius: `${!sx && !sy ? 10 : 0}px ${sx && !sy ? 10 : 0}px ${sx && sy ? 10 : 0}px ${!sx && sy ? 10 : 0}px`, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.45))'}} />;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `scale(${s})`, opacity: o}}>
    {bright && <div style={{position: 'absolute', inset: 0, borderRadius: 15, background: '#fff', opacity: 0.13, mixBlendMode: 'plus-lighter'}} />}
    <div style={{position: 'absolute', inset: 0, borderRadius: 15, border: '3px solid #fff', boxShadow: '0 0 0 1.5px rgba(40,40,40,0.55), inset 0 0 0 1.5px rgba(40,40,40,0.4)'}} />
    {corner(0, 0)}{corner(1, 0)}{corner(0, 1)}{corner(1, 1)}
  </div>;
};
const lerpTrack = (tr: number[][], t: number) => { const ts = tr.map((r) => r[0]); return [1, 2, 3, 4].map((i) => interpolate(t, ts, tr.map((r) => r[i]), cl)); };
const FACE = [[37.05, 0.47, 0.5, 0.56, 0.7], [37.12, 0.49, 0.5, 0.57, 0.68], [37.2, 0.51, 0.49, 0.58, 0.66], [37.3, 0.515, 0.47, 0.585, 0.65], [37.4, 0.52, 0.45, 0.59, 0.62], [37.5, 0.522, 0.46, 0.592, 0.63], [37.6, 0.524, 0.46, 0.594, 0.63], [37.75, 0.524, 0.46, 0.594, 0.63]];
const FAR = [[44.9, 0.405, 0.438, 0.512, 0.545], [45.0, 0.398, 0.438, 0.505, 0.545], [45.1, 0.385, 0.44, 0.492, 0.545], [45.2, 0.37, 0.442, 0.475, 0.545], [45.3, 0.36, 0.445, 0.462, 0.542],
  [45.4, 0.362, 0.445, 0.464, 0.54], [45.5, 0.388, 0.445, 0.49, 0.54], [45.6, 0.415, 0.445, 0.517, 0.542], [45.7, 0.43, 0.448, 0.533, 0.545], [45.8, 0.455, 0.45, 0.555, 0.548], [46.17, 0.45, 0.455, 0.55, 0.555]];
const Tracked: React.FC<{f: number}> = ({f}) => {
  const si = shotIdx(f); const s = SH[si];
  if (si === 11 && f >= T(14.6) && f < T(15.22) + 2) {
    const st = s.src + (f - s.f0) / FPS; const [u0, v0, u1, v1] = lerpTrack(FACE, st);
    const [x0, y0] = place(s, f, u0, v0); const [x1, y1] = place(s, f, u1, v1); const k = f - T(14.6);
    return <Frame x={(x0 + x1) / 2} y={(y0 + y1) / 2} w={Math.max(240, x1 - x0) + 70} h={y1 - y0 + 70} s={[1.15, 1.05][k] ?? 1} o={f >= T(15.22) ? 0.5 : k === 0 ? 0.6 : 1} />;
  }
  if (si === 13 && f >= T(17.3) && f < s.f1 - 2) {
    const st = s.src + (f - s.f0) / FPS; const [u0, v0, u1, v1] = lerpTrack(FAR, st);
    const [x0, y0] = place(s, f, u0, v0); const [x1, y1] = place(s, f, u1, v1); const k = f - T(17.3);
    return <Frame x={(x0 + x1) / 2} y={(y0 + y1) / 2} w={x1 - x0 + 50} h={y1 - y0 + 46} s={[1.12, 1.03][k] ?? 1} o={k === 0 ? 0.7 : 1} bright />;
  }
  return null;
};

/* ---------------- prompt badge: realistic R1 → joke L2 (R4 §8.8.3) ---------------- */
const Keycap: React.FC<{label: string; size: number}> = ({label, size}) => <div style={{width: size, height: size, borderRadius: size / 2, background: 'radial-gradient(circle, #6b7378 0%, #9ea6ab 58%, #c9ced1 100%)',
  boxShadow: '0 0 0 3px #1b2a2f, 0 3px 6px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
  <div style={{width: size * 0.56, height: size * 0.56, borderRadius: size * 0.13, background: '#fdfdfd', boxShadow: '0 0 0 3px #1b2a2f', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Prompt', fontSize: size * 0.33, color: '#111', letterSpacing: 0}}>{label}</div></div>;
const Badge: React.FC<{f: number}> = ({f}) => {
  const a = T(11.0), sw = T(11.61), end = T(12.32); if (f < a || f >= end) return null;
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
      <div style={{fontFamily: 'Prompt', fontSize: 112, lineHeight: 1, color: '#fff', WebkitTextStroke: '6px #0f1d21', paintOrder: 'stroke fill', textShadow: '0 4px 6px rgba(0,0,0,0.45)', letterSpacing: 1, marginTop: 6}}>{joke ? 'JUST STUFF' : 'TALK'}</div>
      <Keycap label={joke ? 'L2' : 'R1'} size={176} />
    </div>
    {parts}
  </div>;
};

/* ---------------- location title (R4 §8.8.5) ---------------- */
const Title: React.FC<{f: number}> = ({f}) => {
  const a = T(18.37), e = a + 23; if (f < a || f >= e) return null; const k = f - a;
  const [, b] = inFx(k); const x = 540 - 1.6 * k; const o = k >= 20 ? (e - f) / 3 : 1;
  return <div style={{position: 'absolute', left: x - 500, width: 1000, top: 128 - 104 * 0.22 + 14, textAlign: 'center', fontFamily: 'Region', fontSize: 104, lineHeight: 1, opacity: o, filter: b ? `blur(${b * 0.6}px)` : undefined,
    transform: `scale(${inFx(k)[0]})`}}>
    <span style={{background: 'linear-gradient(180deg, #c7cb52 0%, #a9c64e 45%, #82a84c 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextStroke: '3px #4f6b1f',
      filter: 'drop-shadow(0 5px 7px rgba(0,0,0,0.65)) drop-shadow(0 0 14px rgba(0,0,0,0.35))', letterSpacing: 2}}>LEONIDA</span>
  </div>;
};

/* ---------------- paw trail (R4 §8.8.6): one print every 6 frames ---------------- */
const Paw: React.FC<{size: number}> = ({size}) => <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.55))'}}>
  <path d="M50 46 C66 46 80 60 80 74 C80 86 70 90 60 88 C55 87 53 85 50 85 C47 85 45 87 40 88 C30 90 20 86 20 74 C20 60 34 46 50 46 Z" fill="#F2C230" stroke="#5b4300" strokeWidth={3} />
  {[[24, 38, 9], [41, 22, 9.5], [60, 22, 9.5], [77, 38, 9]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#fff6cf" stroke="#E0AE1E" strokeWidth={3} />)}
</svg>;
const PAWS: [number, number, number][] = [[960, 1078, -96], [895, 1040, -84], [832, 1084, -100], [766, 1046, -86], [702, 1090, -96]];
const Paws: React.FC<{f: number}> = ({f}) => {
  const a = T(18.55), cut = T(19.65); if (f < a || f >= cut) return null; const drift = (f - a) * 2;
  return <>{PAWS.map(([x, y, r], i) => { const k = f - (a + i * 6); if (k < 0) return null; const s = interpolate(k, [0, 2, 4], [0.2, 1.15, 1], cl);
    return <div key={i} style={{position: 'absolute', left: x - 38 + drift, top: y - 38, transform: `rotate(${r}deg) scale(${s})`, opacity: f >= cut - 2 ? 0.5 : 1}}><Paw size={76} /></div>; })}</>;
};

/* ---------------- "+1 TIGER" notification (R4 §8.8.7 money pop) ---------------- */
const Gain: React.FC<{f: number}> = ({f}) => {
  const s0 = T(19.65), end = T(21.07); const k = f - s0; if (k < 2 || f >= end) return null;
  const sc = k === 2 ? 0.86 : interpolate(k, [3, 8], [0.9, 1], {...cl, easing: eo}); const rot = interpolate(k, [3, 8], [-4, 0], {...cl, easing: eo});
  const op = k === 2 ? 0.3 : f >= end - 3 ? (end - f) / 4 : 1;
  const parts = k >= 3 && k < 16 ? Array.from({length: 10}, (_, i) => { const ang = (i / 10) * Math.PI * 2 + 0.25; const r = 330 + 18 * (k - 3) + (i % 2) * 26;
    return <div key={i} style={{position: 'absolute', left: 433 + Math.cos(ang) * r * 1.3, top: 164 + Math.sin(ang) * r * 0.5, width: 11, height: 11, borderRadius: 6, background: i % 2 ? '#c8ffd2' : '#7be07b', opacity: 1 - (k - 3) / 13, boxShadow: '0 0 8px rgba(160,255,170,0.9)'}} />; }) : null;
  return <div style={{position: 'absolute', left: 530 - 433, top: 551 - 164, width: 867, height: 328, transform: `scale(${sc}) rotate(${rot}deg)`, opacity: op}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 21, border: '4.5px solid #A3CD96', background: 'rgba(14,26,16,0.32)', backdropFilter: 'blur(2px)', boxShadow: '0 0 0 1.5px rgba(0,0,0,0.25), 0 10px 26px rgba(0,0,0,0.35)'}} />
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 46}}>
      <div style={{fontFamily: 'Pill5', fontSize: 107, color: '#fff', textShadow: '0 3px 8px rgba(0,0,0,0.6)', letterSpacing: 1}}>+ 1 TIGER</div>
      <div style={{width: 142, height: 142, borderRadius: 71, background: '#1f2523', boxShadow: '0 0 0 3px rgba(255,255,255,0.12), 0 4px 10px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={86} height={86} viewBox="0 0 100 100"><path d="M50 46 C66 46 80 60 80 74 C80 86 70 90 60 88 C55 87 53 85 50 85 C47 85 45 87 40 88 C30 90 20 86 20 74 C20 60 34 46 50 46 Z" fill="#7be07b" />
          {[[24, 38, 9], [41, 22, 9.5], [60, 22, 9.5], [77, 38, 9]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#7be07b" />)}</svg>
      </div>
    </div>
    {parts}
  </div>;
};
const MintFlash: React.FC<{f: number}> = ({f}) => { const k = f - T(19.65); const o = [0.32, 0.26, 0.14][k]; if (o === undefined || k < 0) return null;
  return <AbsoluteFill style={{background: '#9fe8b4', opacity: o, mixBlendMode: 'screen'}} />; };

/* ---------------- channel end card (R4 §8.8.8) + subscribe click ---------------- */
const NAME = 'Leonida Shifts';
const EndCard: React.FC<{s: Shot; f: number}> = ({s, f}) => {
  const e = f - s.f0;
  const sc = interpolate(e, [0, 1, 4, 5, 8], [2.4, 1.35, 1.06, 1.0, 1.0], {...cl, easing: eo});
  const ty = interpolate(e, [0, 1, 4, 6, 8], [300, 195, 65, -24, 0], cl);
  const bl = interpolate(e, [0, 1, 4, 6, 8], [44, 24, 6, 2, 0], cl);
  const push = 1 + 0.008 * Math.max(0, e - 8) / FPS; const pe = f - T(25.06); const pun = pe < 0 ? 0 : pe < 8 ? 0.04 * io(pe / 8) : 0.04 - 0.015 * io(Math.min(1, (pe - 8) / 5));
  const typed = NAME.slice(0, Math.max(0, Math.min(NAME.length, e))); const curOn = e < NAME.length + 1 || Math.floor((e - NAME.length) / 8) % 2 === 0;
  const sw = interpolate(e, [10, 20], [-0.3, 1.3], cl); const sweeping = e >= 10 && e <= 20;
  const tw = e - 24; const twS = tw >= 0 && tw < 10 ? Math.sin((tw / 10) * Math.PI) : 0;
  const click = NS_FRAMES + 99; const subd = true; const ck = -1;
  const curX = interpolate(f, [T(22.4), click - 1, click + 14], [960, 452, 520], {...cl, easing: io}); const curY = interpolate(f, [T(22.4), click - 1, click + 14], [1020, 538, 600], {...cl, easing: io});
  const curO = 0; const curS = 1;   // the click happens on the SubCard (word SUBSCRIBE); no cursor on the closing card
  const btnS = ck >= 0 && ck < 5 ? interpolate(ck, [0, 2, 5], [0.94, 1.04, 1], cl) : 1; const bell = ck >= 0 && ck < 14 ? 16 * Math.sin(ck * 1.4) * (1 - ck / 14) : 0;
  const secs = 2 + Math.floor(e / FPS); const prog = 34 + (secs / 332) * 1012;
  const cg = interpolate(f, [T(26.2), T(26.2) + 12], [-0.3, 1.3], cl);
  return <AbsoluteFill style={{overflow: 'hidden', background: '#16293a'}}>
    <AbsoluteFill style={{transform: `translateY(${ty}px) scale(${sc * push * (1 + pun)})`, filter: bl ? `blur(${bl}px)` : undefined}}>
      {/* background: the card image blurred to mush, darker at the top */}
      <Img src={staticFile('ls/img/ep1_cardB.jpg')} style={{position: 'absolute', left: -300, top: 250, width: 1680, height: 1700, objectFit: 'cover', filter: 'blur(60px) saturate(1.25) brightness(1.15)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(18,32,48,0.9) 0%, rgba(18,32,48,0.3) 28%, rgba(0,0,0,0) 50%, rgba(8,14,20,0.12) 100%)'}} />
      {/* top bar */}
      <div style={{position: 'absolute', left: 37, top: 147, width: 66, height: 48, borderRadius: 13, background: '#e8202a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.3)'}}>
        <div style={{width: 0, height: 0, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', borderLeft: '18px solid #fff', marginLeft: 4}} /></div>
      <div style={{position: 'absolute', left: 113, top: 146, fontFamily: 'UIBold', fontSize: 40, letterSpacing: -1, color: '#fff', textShadow: '0 2px 6px rgba(0,0,0,0.35)'}}>YouTube</div>
      <div style={{position: 'absolute', left: 330, top: 140, width: 712, height: 64, borderRadius: 32, background: 'linear-gradient(180deg, #e9ebee, #cfd3d7)', border: '3px solid #E8C04C', boxShadow: '0 0 14px rgba(232,192,76,0.45), 0 4px 10px rgba(0,0,0,0.25)'}}>
        <svg width={34} height={34} viewBox="0 0 24 24" style={{position: 'absolute', left: 26, top: 12}}><circle cx={10} cy={10} r={6.5} fill="none" stroke="#666" strokeWidth={2.4} /><path d="M15 15 L21 21" stroke="#666" strokeWidth={2.6} strokeLinecap="round" /></svg>
        <div style={{position: 'absolute', left: 78, top: 10, fontFamily: 'UIBold', fontSize: 34, color: '#262626', whiteSpace: 'nowrap'}}>{typed}<span style={{color: '#D9A520', opacity: curOn ? 1 : 0, marginLeft: 2, fontFamily: 'Pill'}}>|</span></div>
      </div>
      {/* channel row */}
      <div style={{position: 'absolute', left: 33, top: 275, width: 240, height: 240, borderRadius: 120, background: 'radial-gradient(circle at 40% 35%, #4a1d6b, #1a0828)', boxShadow: '0 0 0 6px #E8C04C, 0 8px 20px rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Emblem size={150} gear={1} /></div>
      <div style={{position: 'absolute', left: 307, top: 300, fontFamily: 'Pill7', fontSize: 84, lineHeight: 1, letterSpacing: -1, whiteSpace: 'nowrap',
        color: sweeping ? 'transparent' : '#fff', backgroundImage: sweeping ? `linear-gradient(90deg, #fff ${sw * 100 - 18}%, ${YEL} ${sw * 100 - 6}%, ${YEL} ${sw * 100 + 6}%, #fff ${sw * 100 + 18}%)` : undefined,
        WebkitBackgroundClip: sweeping ? 'text' : undefined, backgroundClip: sweeping ? 'text' : undefined, filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.45))'}}>{NAME}</div>
      {twS > 0 && <svg width={90} height={90} viewBox="-50 -50 100 100" style={{position: 'absolute', left: 925, top: 262, transform: `scale(${0.4 + twS}) rotate(${tw * 9}deg)`, opacity: twS}}>
        <path d="M0 -46 L5 -5 L46 0 L5 5 L0 46 L-5 5 L-46 0 L-5 -5 Z" fill="#fff" /><circle r={6} fill="#fff" /></svg>}
      <div style={{position: 'absolute', left: 310, top: 410, fontFamily: 'Pill5', fontSize: 33, color: 'rgba(240,240,240,0.92)', textShadow: '0 2px 6px rgba(0,0,0,0.4)'}}>GTA 6 news · new Shift every week</div>
      <div style={{position: 'absolute', left: 307, top: 470, height: 76, padding: '0 34px', borderRadius: 38, display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${btnS})`, transformOrigin: '0 50%',
        background: subd ? '#3b3b3f' : '#e8202a', boxShadow: '0 6px 16px rgba(0,0,0,0.35)', fontFamily: 'UIBold', fontSize: 36, color: '#fff'}}>
        {subd && <svg width={34} height={34} viewBox="0 0 24 24" style={{transform: `rotate(${bell}deg)`, transformOrigin: '50% 10%'}}><path d="M12 3 C8.5 3 6.5 5.6 6.5 9 V13 L4.5 16 H19.5 L17.5 13 V9 C17.5 5.6 15.5 3 12 3 Z" fill="#fff" /><circle cx={12} cy={19} r={2.2} fill="#fff" /></svg>}
        {subd ? 'Subscribed' : 'Subscribe'}</div>
      {/* video card (the long-form), "playing" */}
      <div style={{position: 'absolute', left: 34, top: 620, width: 1012, height: 568, borderRadius: 21, overflow: 'hidden', boxShadow: '0 16px 36px rgba(0,0,0,0.5)'}}>
        {e < 4 ? <Img src={staticFile('ls/img/ep1_cardB.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          : <Sequence from={s.f0 + 4} layout="none"><OffthreadVideo src={staticFile('ls/card_clip.mp4')} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} /></Sequence>}
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(10,14,30,0.55) 0%, rgba(10,14,30,0.15) 50%, rgba(0,0,0,0) 70%), linear-gradient(0deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 30%)'}} />
        <div style={{position: 'absolute', left: 58, top: 70, transform: 'rotate(-4deg)'}}><Emblem size={128} gear={1} /></div>
        <div style={{position: 'absolute', left: 54, top: 238, fontFamily: 'Cap', fontSize: 92, lineHeight: 1, color: '#fff', WebkitTextStroke: '3px #fff', paintOrder: 'stroke fill', filter: 'drop-shadow(0 5px 6px rgba(0,0,0,0.6))'}}>WEEK 1</div>
        <div style={{position: 'absolute', left: 50, top: 336, fontFamily: 'Cap', fontSize: 150, lineHeight: 1, color: '#F6D030', WebkitTextStroke: '3px #F6D030', paintOrder: 'stroke fill', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.6))'}}>RECAP</div>
        <div style={{position: 'absolute', left: 24, bottom: 26, fontFamily: 'UIBold', fontSize: 30, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.8)'}}>{`0:0${Math.min(9, secs)} / 5:32`}</div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 6, background: 'rgba(255,255,255,0.25)'}} />
        <div style={{position: 'absolute', left: 0, bottom: 0, width: prog - 34, height: 6, background: '#e8202a'}} />
        {cg > -0.3 && cg < 1.3 && <div style={{position: 'absolute', top: -80, bottom: -80, left: `${cg * 100}%`, width: 150, marginLeft: -75, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.32), rgba(255,255,255,0))', transform: 'skewX(-20deg)'}} />}
        <div style={{position: 'absolute', left: prog - 34 - 9, bottom: -6, width: 18, height: 18, borderRadius: 9, background: '#e8202a'}} />
      </div>
      <div style={{position: 'absolute', left: 36, right: 40, top: 1212, fontFamily: 'UIBold', fontSize: 41, lineHeight: 1.28, color: '#ececec', textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>GTA 6 Just Broke Everything (Week 1 Recap) | Leonida Shifts Ep. 1</div>
      {/* cursor */}
      {curO > 0 && <svg width={64} height={64} viewBox="0 0 24 24" style={{position: 'absolute', left: curX, top: curY, opacity: curO, transform: `scale(${curS})`, transformOrigin: '0 0', filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.5))'}}>
        <path d="M3 2 L3 19 L7.5 15 L10.5 22 L13.5 20.7 L10.6 14 L16.5 14 Z" fill="#fff" stroke="#111" strokeWidth={1.3} strokeLinejoin="round" /></svg>}
      {ck >= 0 && ck < 10 && <div style={{position: 'absolute', left: 452 - 60 * (ck / 10) - 20, top: 508 - 60 * (ck / 10) - 20, width: 40 + 120 * (ck / 10), height: 40 + 120 * (ck / 10), borderRadius: '50%', border: '4px solid rgba(255,255,255,0.8)', opacity: 1 - ck / 10}} />}
    </AbsoluteFill>
  </AbsoluteFill>;
};

/* ---------------- subscribe chip + cursor click on "SUBSCRIBE" ---------------- */
const SubCard: React.FC<{f: number}> = ({f}) => {
  const a = T(21.07), out = T(22.55), end = T(22.75); if (f < a || f >= end) return null; const k = f - a;
  const click = T(21.75), ck = f - click, subd = ck >= 0;
  const sc = f >= out ? interpolate(f, [out, end], [1, 0.82], cl) : interpolate(k, [0, 3, 6], [0.6, 1.08, 1], cl);
  const op = f >= out ? interpolate(f, [out, end], [1, 0], cl) : interpolate(k, [0, 2], [0, 1], cl);
  const btnS = ck >= 0 && ck < 6 ? interpolate(ck, [0, 2, 6], [0.9, 1.05, 1], cl) : 1; const bell = ck >= 0 && ck < 16 ? 18 * Math.sin(ck * 1.4) * (1 - ck / 16) : 0;
  const cx = interpolate(f, [T(21.3), click - 1, click + 12], [1010, 790, 860], {...cl, easing: io}), cy = interpolate(f, [T(21.3), click - 1, click + 12], [620, 372, 470], {...cl, easing: io});
  const co = interpolate(f, [T(21.3), T(21.3) + 3, click + 9, click + 15], [0, 1, 1, 0], cl);
  return <>
    <div style={{position: 'absolute', left: 160, top: 290, width: 760, height: 150, borderRadius: 75, background: 'rgba(18,18,20,0.88)', border: '2px solid rgba(255,255,255,0.12)', boxShadow: '0 14px 30px rgba(0,0,0,0.5)',
      transform: `scale(${sc})`, opacity: op, display: 'flex', alignItems: 'center', padding: '0 22px', gap: 22}}>
      <div style={{width: 106, height: 106, borderRadius: 53, flex: 'none', background: 'radial-gradient(circle at 40% 35%, #4a1d6b, #1a0828)', boxShadow: '0 0 0 4px #E8C04C', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Emblem size={70} gear={1} /></div>
      <div style={{flex: 1, minWidth: 0}}><div style={{fontFamily: 'Pill7', fontSize: 42, color: '#fff', whiteSpace: 'nowrap', letterSpacing: -0.5}}>Leonida Shifts</div>
        <div style={{fontFamily: 'Pill5', fontSize: 25, color: 'rgba(235,235,235,0.75)', marginTop: 2}}>GTA 6 news · every week</div></div>
      <div style={{flex: 'none', height: 84, padding: '0 30px', borderRadius: 42, display: 'flex', alignItems: 'center', gap: 10, transform: `scale(${btnS})`, background: subd ? '#3b3b3f' : '#e8202a',
        fontFamily: 'UIBold', fontSize: 34, color: '#fff', boxShadow: subd ? 'none' : '0 0 18px rgba(232,32,42,0.55)'}}>
        {subd && <svg width={32} height={32} viewBox="0 0 24 24" style={{transform: `rotate(${bell}deg)`, transformOrigin: '50% 10%'}}><path d="M12 3 C8.5 3 6.5 5.6 6.5 9 V13 L4.5 16 H19.5 L17.5 13 V9 C17.5 5.6 15.5 3 12 3 Z" fill="#fff" /><circle cx={12} cy={19} r={2.2} fill="#fff" /></svg>}
        {subd ? 'Subscribed' : 'Subscribe'}</div>
    </div>
    {ck >= 0 && ck < 10 && <div style={{position: 'absolute', left: 790 - 20 - 60 * (ck / 10), top: 372 - 20 - 60 * (ck / 10), width: 40 + 120 * (ck / 10), height: 40 + 120 * (ck / 10), borderRadius: '50%', border: '4px solid rgba(255,255,255,0.85)', opacity: 1 - ck / 10}} />}
    {co > 0 && <svg width={66} height={66} viewBox="0 0 24 24" style={{position: 'absolute', left: cx, top: cy, opacity: co, transform: `scale(${ck >= 0 && ck < 4 ? 0.86 : 1})`, transformOrigin: '0 0', filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.55))'}}>
      <path d="M3 2 L3 19 L7.5 15 L10.5 22 L13.5 20.7 L10.6 14 L16.5 14 Z" fill="#fff" stroke="#111" strokeWidth={1.3} strokeLinejoin="round" /></svg>}
  </>;
};

/* ---------------- fonts / sfx helpers ---------------- */
const useFonts = () => {
  const [h] = React.useState(() => delayRender('ns2-fonts')); const [ok, setOk] = React.useState(false);
  React.useEffect(() => {
    const list: [string, string][] = [['Cap', 'ls/fonts/cap900w105.woff2'], ['Prompt', 'ls/fonts/oswald700.woff2'], ['Pill', 'ls/fonts/outfit400.woff2'], ['Pill5', 'ls/fonts/outfit500.woff2'],
      ['Pill7', 'ls/fonts/outfit700.woff2'], ['Region', 'ls/fonts/ranchers.woff2'], ['UIBold', 'Inter-Bold.otf']];
    Promise.all(list.map(([n, p]) => new FontFace(n, `url(${staticFile(p)})`).load())).then((fs) => { fs.forEach((x) => document.fonts.add(x)); setOk(true); continueRender(h); });
  }, [h]);
  return ok;
};
const S: React.FC<{at: number; n: string; v?: number}> = ({at, n, v = 0.5}) => <Sequence from={Math.max(0, T(at))} durationInFrames={45} layout="none"><Audio src={staticFile(`ls/${n}.wav`)} volume={v} /></Sequence>;
const CUTS = SH.slice(1).map((s) => s.f0 / FPS);

const Visuals: React.FC = () => {
  const f = useCurrentFrame(); const si = shotIdx(f); const s = SH[si];
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    {s.kind === 'map' ? <MapZoom s={s} f={f} /> : s.kind === 'end' ? <EndCard s={s} f={f} /> : <Footage s={s} f={f} />}
    <Leak f={f} />
    <Tracked f={f} />
    <Paws f={f} />
    <Title f={f} />
    <Badge f={f} />
    <MintFlash f={f} />
    <Gain f={f} />
    <SubCard f={f} />
    <Logo f={f} />
    <Vignette />
    <Caption f={f} />
  </AbsoluteFill>;
};

export const NpcShort: React.FC = () => {
  const ok = useFonts(); const f = useCurrentFrame();
  if (!ok) return <AbsoluteFill style={{background: '#000'}} />;
  const vf = f === 1 ? 9 : f === 2 ? 14 : f;          // R4 opening: frames 1–2 are flash-forwards of 9 and 14
  return <AbsoluteFill style={{background: '#000'}}>
    <Freeze frame={vf} active={f === 1 || f === 2}><Visuals /></Freeze>
    {/* audio: the ElevenLabs VO on frame 0, our own music low-passed ~18 LU under it, SFX */}
    <Audio src={staticFile('ls/ns2_vo.wav')} />
    <Audio src={staticFile('ls/ns2_bed.wav')} />
    <S at={0.08} n="sfx2/sparkle" v={0.45} /><S at={0.78} n="sfx2/sparkle" v={0.22} />
    {CUTS.map((c, i) => <S key={i} at={c - 0.12} n="sfx2/whoosh" v={0.16} />)}
    <S at={4.52} n="sfx2/pop" v={0.3} /><S at={4.62} n="sfx2/chime" v={0.18} />
    <S at={11.0} n="sfx/click" v={0.5} /><S at={11.61} n="sfx2/pop" v={0.38} /><S at={11.63} n="sfx2/sparkle" v={0.2} />
    <S at={14.6} n="sfx2/pop" v={0.3} /><S at={17.3} n="sfx2/pop" v={0.28} />
    {[0, 1, 2, 3, 4].map((i) => <S key={i} at={18.55 + i * 0.2} n="sfx2/tap" v={0.4} />)}
    <S at={19.7} n="sfx2/chime" v={0.32} /><S at={19.72} n="sfx2/sparkle" v={0.2} />
    <Sequence from={T(21.07)} layout="none"><Audio src={staticFile('ls/ns2_kill.wav')} volume={0.55} /></Sequence>
    <S at={21.07} n="sfx2/pop" v={0.35} /><S at={21.75} n="sfx/click" v={0.6} /><S at={21.79} n="sfx2/ding" v={0.3} />
    <S at={23.87} n="sfx/boom" v={0.3} /><S at={24.12} n="sfx2/sparkle" v={0.18} />
    {Array.from({length: 14}, (_, i) => <S key={'k' + i} at={25.83 + i / 30} n="sfx2/key" v={0.22} />)}
  </AbsoluteFill>;
};
