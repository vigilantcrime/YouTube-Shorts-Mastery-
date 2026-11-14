/* VIGILANT CRIME · "The Case File" format, episode VC-001 (Yanko). Format spec: /vigilant_format.md
   Ownable look: police-tape yellow + evidence red on a cold, grainy grade · tape-wipe sting at 0s · footage-first 9:16 windows of the
   music video with a new camera move per shot · exhibit transcript cards · marker circles · CCTV HUD · verdict meter ending. */
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import words from './w11.json';
import {W, H, SHADOW} from './kit';
import {cl, pop, rnd, useFontsReady} from './kit3d';

export const VC1_FRAMES = Math.round(61.3 * 30);
const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
type Wd = [string, number];
const WT = (words as Wd[]).map(([w, t]) => [w, t + 0.03] as Wd);
const at = (word: string, after = 0) => WT.find(([w, t]) => w === word && t >= after - 0.05)?.[1] ?? after;

export const YEL = '#FFD400', MAG = '#E01E37';
const STAGE = 'radial-gradient(ellipse 120% 80% at 50% 25%, #2b3236 0%, #15191c 55%, #07090a 100%)';
const img = (n: number) => staticFile(`vc/i${n}.jpg`);

/* ------------------------------------------------------------------ */
/* Captions: 1–3 word chunks, hard swaps, one coloured key word         */
/* ------------------------------------------------------------------ */
const NUM: Record<string, number> = {ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5, SIX: 6, SEVEN: 7, EIGHT: 8, NINE: 9, TEN: 10, TWENTY: 20, THIRTY: 30, FORTY: 40, FIFTY: 50, SEVENTY: 70};
const YELLOW = new Set(['YANKO', 'NITTY', 'NURSERY', 'BURBERRY', 'NAN', 'GLOVES', 'TRACKY', 'FEDS', 'GORDON', 'HYGIENE', 'EVIDENCE', 'VIGILANT', 'CRIME', 'SCHEDULE', 'PAGANS', 'DANGEROUS', 'FUNNIEST', 'CONFESSION', 'PRINTS', '3PM', 'UK', 'GTA', 'GTA 6', 'GTA 5', 'MIAMI', 'KODAK', 'BLACK', 'JACK', 'HEARTS', 'KING', 'DIAMONDS', 'ROCKSTAR', 'BOOBIE', 'IKE', 'JASON', 'DEADPOOL', 'WOLVERINE', 'VICE', 'CITY', 'SIN', 'UK', 'MARVEL', '2026', '19TH']);
const MAGENTA = new Set(['STAB', 'LINE', 'RISK', 'DISAGREE', 'CHEF', 'LYRICS', 'IMPORTANT', 'RUIN', 'LOUD', 'COPIED', 'EXACTLY', 'STORY', 'BAD', 'NEWS', 'SUBTLE', 'LOST', 'JOURNALISM', 'CONFIRMED', 'RAIN', 'STRIKES', 'MONEY', 'DECIDE', 'HONEST', 'COMMENTS', 'THROW', 'NOT', 'LADS', 'OWNER', 'FAMOUS', 'SAME']);
type Tok = {w: string; t: number};
const normalize = (ws: Wd[]): Tok[] => {
  const out: Tok[] = [];
  for (let i = 0; i < ws.length; i++) {
    const [w, t] = ws[i]; const nx = ws[i + 1]?.[0];
    if (w === 'G' && ws[i + 1]?.[0] === 'T' && ws[i + 2]?.[0] === 'A') { out.push({w: 'GTA ' + (ws[i + 3][0] === 'SIX' ? '6' : '5'), t}); i += 3; continue; }
    if (w === 'GTA' && (nx === 'SIX' || nx === 'FIVE')) { out.push({w: 'GTA ' + (nx === 'SIX' ? '6' : '5'), t}); i++; continue; }
    if (w === 'TWENTY' && nx === 'TWENTY') { out.push({w: '2026', t}); i += 2; continue; }
    if (w === 'U' && nx === 'K') { out.push({w: 'UK', t}); i++; continue; }
    if (w === 'TRAILER' && nx === 'TWO') { out.push({w: 'TRAILER', t}, {w: '2', t: ws[i + 1][1]}); i++; continue; }
    if (w === 'FORTY' && nx === 'DOLLARS') { out.push({w: '$40', t}); i++; continue; }
    if (w === 'THREE' && nx === 'PM') { out.push({w: '3PM', t}); i++; continue; }
    if (w === 'BERBERY') { out.push({w: 'BURBERRY', t}); continue; }
    if (w === 'TRACKEY') { out.push({w: 'TRACKY', t}); continue; }
    if (w === 'NINETEENTH') { out.push({w: '19TH', t}); continue; }
    if (w === 'BOOBI') { out.push({w: 'BOOBIE', t}); continue; }
    // numeric runs with a scale word: "FOUR HUNDRED AND SEVENTY FIVE MILLION" -> "475 MILLION"
    if (NUM[w] !== undefined && ['HUNDRED', 'MILLION'].includes(nx ?? '')) {
      let j = i, total = 0, cur = 0;
      while (j < ws.length && (NUM[ws[j][0]] !== undefined || ['HUNDRED', 'AND', 'MILLION'].includes(ws[j][0]))) {
        const x = ws[j][0];
        if (x === 'HUNDRED') cur *= 100; else if (x === 'MILLION') { total += cur * 1e6; cur = 0; j++; break; } else if (x !== 'AND') cur += NUM[x];
        j++;
      }
      total += cur; const v = total >= 1e6 ? `${total / 1e6} MILLION` : `${total}`;
      out.push({w: v, t}); i = j - 1; continue;
    }
    if (NUM[w] !== undefined && ['DAYS', 'HOURS', 'STRIKES', 'COPIES', 'OF'].includes(nx ?? '') && !(w === 'ONE')) { out.push({w: String(NUM[w] + (w === 'TWENTY' && ws[i + 1][0] === 'FOUR' ? 4 : 0)), t}); continue; }
    if (w === 'TWENTY' && nx === 'FOUR') { out.push({w: '24', t}); i++; continue; }
    out.push({w, t});
  }
  return out;
};
const TOK = normalize(WT);
const CHUNKS = (() => {
  const ch: {t: number; ws: string[]}[] = [];
  for (let i = 0; i < TOK.length; i++) {
    const last = ch[ch.length - 1]; const tk = TOK[i];
    const gap = i > 0 ? tk.t - TOK[i - 1].t : 9;
    const shortWord = tk.w.length <= 3 && !/\d/.test(tk.w);
    const limit = last && last.ws.every((x) => x.length <= 4) ? 3 : 2;
    if (last && last.ws.length < limit && gap < 0.42 && (shortWord || last.ws.length < 2) && !/MILLION/.test(tk.w)) last.ws.push(tk.w);
    else ch.push({t: tk.t, ws: [tk.w]});
  }
  return ch;
})();
const Captions: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS;
  let k = 0; for (let i = 0; i < CHUNKS.length; i++) if (CHUNKS[i].t <= t + 0.02) k = i;
  const c = CHUNKS[k]; if (t - c.t > 1.4) return null;
  let colored = false;
  return (
    <div style={{position: 'absolute', top: H * 0.69, width: W, textAlign: 'center', transform: 'translateY(-50%)'}}>
      {c.ws.map((w, i) => {
        const key = !colored && (YELLOW.has(w) || MAGENTA.has(w) || /\d/.test(w));
        if (key) colored = true;
        const col = !key ? '#fff' : MAGENTA.has(w) ? MAG : YEL;
        const tape = key ? (MAGENTA.has(w) ? MAG : YEL) : null;
        return <span key={i} style={{display: 'inline-block', fontFamily: 'HeroBlack', fontSize: 64, letterSpacing: -0.5, marginRight: i < c.ws.length - 1 ? 16 : 0,
          color: tape ? (tape === YEL ? '#0a0a0a' : '#fff') : '#fff', background: tape ?? 'transparent', padding: tape ? '2px 14px' : 0, transform: tape ? 'rotate(-2deg)' : 'none',
          boxShadow: tape ? '0 6px 18px rgba(0,0,0,.45)' : 'none',
          textShadow: tape ? 'none' : '0 0 2px #000, 0 3px 0 rgba(0,0,0,.65), 0 6px 18px rgba(0,0,0,.55), 2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000'}}>{w}</span>;
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */
export const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#fff', style}) => (
  <div style={{fontFamily: 'HeroBlack', fontSize: size, color, letterSpacing: -size * 0.02, lineHeight: 1, textShadow: SHADOW, ...style}}>{children}</div>
);
const Stage: React.FC<{children?: React.ReactNode; bg?: number}> = ({children, bg}) => (
  <AbsoluteFill style={{background: STAGE, overflow: 'hidden'}}>
    {bg && <AbsoluteFill style={{opacity: 0.22, mixBlendMode: 'soft-light'}}><Img src={img(bg)} style={{width: W, height: H, objectFit: 'cover', filter: 'blur(30px)'}} /></AbsoluteFill>}
    {children}
  </AbsoluteFill>
);
/** Full-screen footage/still with Roddy's slow drift (never a static frame). */
const Plate: React.FC<{n: number; dur: number; from?: number[]; to?: number[]; pos?: string; dim?: number}> = ({n, dur, from = [1.08, 0, 0], to = [1.16, -20, -30], pos = 'center', dim = 0}) => {
  const fr = useCurrentFrame(); const p = interpolate(fr, [0, f(dur)], [0, 1], {...cl, easing: Easing.inOut(Easing.sin)});
  const s = from[0] + (to[0] - from[0]) * p, x = from[1] + (to[1] - from[1]) * p, y = from[2] + (to[2] - from[2]) * p;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <Img src={img(n)} style={{width: W, height: H, objectFit: 'cover', objectPosition: pos, transform: `translate(${x}px,${y}px) scale(${s})`}} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(0,0,0,${0.25 + dim}) 0%, rgba(0,0,0,${dim}) 30%, rgba(0,0,0,${dim}) 55%, rgba(0,0,0,${0.55 + dim}) 100%)`}} />
    </AbsoluteFill>
  );
};
/** Card pop-in: 4-frame blur slide + slight 3D tilt + idle float (Roddy §2.4). */
export const Card: React.FC<{children: React.ReactNode; x: number; y: number; w: number; h: number; t0?: number; tilt?: number; from?: 'left' | 'right' | 'up' | 'down' | 'pop'; radius?: number; border?: boolean}> =
({children, x, y, w, h, t0 = 0, tilt = -8, from = 'pop', radius = 22, border = true}) => {
  const fr = useCurrentFrame(); const lf = fr - t0;
  if (lf < 0) return null;
  const e = interpolate(lf, [0, 5], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const off = from === 'left' ? [-700, 0] : from === 'right' ? [700, 0] : from === 'up' ? [0, -800] : from === 'down' ? [0, 900] : [0, 0];
  const sc = from === 'pop' ? interpolate(lf, [0, 6], [0.6, 1], {...cl, easing: Easing.out(Easing.back(1.8))}) : 1;
  const flo = 1 + 0.02 * Math.sin(lf / 22);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, perspective: 1600}}>
      <div style={{width: '100%', height: '100%', borderRadius: radius, overflow: 'hidden', border: border ? '5px solid rgba(255,255,255,.95)' : 'none',
        boxShadow: '0 30px 80px rgba(20,0,40,.55)', transform: `translate(${off[0] * (1 - e)}px, ${off[1] * (1 - e)}px) rotateY(${tilt}deg) scale(${sc * flo})`,
        filter: `blur(${(1 - e) * 12}px)`, opacity: Math.min(1, lf / 2), background: '#111'}}>{children}</div>
    </div>
  );
};
export const Fit: React.FC<{n: number; pos?: string; zoom?: number}> = ({n, pos = 'center', zoom = 1}) => (
  <Img src={img(n)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${zoom})`}} />
);
const Label: React.FC<{text: string; x: number; y: number; w: number; t0?: number; col?: string}> = ({text, x, y, w, t0 = 0, col = '#fff'}) => {
  const fr = useCurrentFrame(); const p = pop(fr - t0, 5, 0.6);
  return <div style={{position: 'absolute', left: x, top: y, width: w, textAlign: 'center', opacity: p.o, transform: `scale(${p.s})`}}><Txt size={40} color={col} style={{letterSpacing: 2}}>{text}</Txt></div>;
};
/** Pink highlight box that draws in on a word (Roddy §2.6). */
const HBox: React.FC<{x: number; y: number; w: number; h: number; t0: number; label?: string; round?: boolean; col?: string}> = ({x, y, w, h, t0, label, round, col = MAG}) => {
  const fr = useCurrentFrame(); const lf = fr - t0; if (lf < 0) return null;
  const s = interpolate(lf, [0, 5], [1.35, 1], {...cl, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `scale(${s})`, opacity: Math.min(1, lf / 2)}}>
      <div style={{position: 'absolute', inset: 0, border: `6px solid ${col}`, borderRadius: round ? '50%' : 18, boxShadow: `0 0 24px ${col}, inset 0 0 18px ${col}55`}} />
      {label && <div style={{position: 'absolute', left: '50%', top: -58, transform: 'translateX(-50%)', whiteSpace: 'nowrap', padding: '6px 16px', borderRadius: 10, background: col}}><Txt size={34}>{label}</Txt></div>}
    </div>
  );
};
export const Chip: React.FC<{children: React.ReactNode; x: number; y: number; t0: number; bg?: string; size?: number; rot?: number}> = ({children, x, y, t0, bg = YEL, size = 46, rot = -3}) => {
  const fr = useCurrentFrame(); const p = pop(fr - t0, 6, 1.6); if (fr < t0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translateX(-50%) rotate(${rot}deg) scale(${p.s})`, opacity: p.o, padding: '10px 26px', borderRadius: 14, background: bg,
    boxShadow: '0 12px 30px rgba(0,0,0,.4)', whiteSpace: 'nowrap'}}><Txt size={size} color={bg === YEL ? '#111' : '#fff'} style={{textShadow: 'none'}}>{children}</Txt></div>;
};
/** Odometer roll for big numbers (Roddy §2.8). */
const Odometer: React.FC<{value: number; t0: number; t1: number; y: number; size?: number; prefix?: string; suffix?: string; label?: string}> = ({value, t0, t1, y, size = 150, prefix = '', suffix = '', label}) => {
  const fr = useCurrentFrame();
  const v = interpolate(fr, [t0, t1], [0, value], {...cl, easing: Easing.out(Easing.cubic)});
  const land = fr >= t1 ? pop(fr - t1, 6, 1.15).s : 1;
  if (fr < t0) return null;
  return (
    <div style={{position: 'absolute', top: y, width: W, textAlign: 'center', transform: `scale(${land})`}}>
      <Txt size={size} color={YEL} style={{textShadow: '0 6px 0 rgba(0,0,0,.35), 0 10px 30px rgba(0,0,0,.45)'}}>{prefix}{Math.round(v).toLocaleString('en-US')}{suffix}</Txt>
      {label && <Txt size={size * 0.34} style={{marginTop: 14}}>{label}</Txt>}
    </div>
  );
};


/* ------------------------------------------------------------------ */
/* CASE FILE kit                                                       */
/* ------------------------------------------------------------------ */
const T = (w: string, after = 0) => at(w, after);
export const MONO = '"DejaVu Sans Mono", "Courier New", monospace';
const SRC = staticFile('vc/yanko_wide.mp4');
type Move = 'crane' | 'truck' | 'roll' | 'pullback' | 'whip' | 'tilt' | 'dutch' | 'crash' | 'shake' | 'drift' | 'spin' | 'flip' | 'float';
/** A 9:16 window into the 4:3 music video. `src` = seconds in the source, `x` = window offset (0 … -1480), one camera move each. */
const Foot: React.FC<{src: number; x: number; d: number; mv: Move; k?: number; dim?: number; grade?: string; y?: number}> = ({src, x, d, mv, k = 0, dim = 0, grade, y = 0}) => {
  const fr = useCurrentFrame(); const D = f(d);
  const p = interpolate(fr, [0, D], [0, 1], {...cl, easing: Easing.inOut(Easing.sin)});
  let s = 1.12, tx = 0, ty = 0, r = 0, bl = 0;
  if (mv === 'crane') { s = 1.18; ty = 160 - 260 * p; }
  if (mv === 'truck') { s = 1.12; tx = 160 - 320 * p; }
  if (mv === 'roll') { s = 1.25; r = -7 + 12 * p; }
  if (mv === 'pullback') { s = 1.5 - 0.36 * p; }
  if (mv === 'whip') { const e = interpolate(fr, [0, 6], [1, 0], {...cl, easing: Easing.out(Easing.cubic)}); tx = 1100 * e; bl = 30 * e; s = 1.14 + 0.05 * p; }
  if (mv === 'tilt') { s = 1.2; ty = -180 + 300 * p; }
  if (mv === 'dutch') { s = 1.22; r = 9; tx = -60 + 120 * p; }
  if (mv === 'crash') { const c = interpolate(fr, [k, k + 3], [0, 1], cl); s = 1.12 + 0.5 * c; }
  if (mv === 'shake') { s = 1.2; tx = Math.sin(fr * 1.7) * 14 + Math.sin(fr * 0.6) * 20; ty = Math.cos(fr * 1.3) * 12; r = Math.sin(fr * 0.9) * 1.2; }
  if (mv === 'drift') { s = 1.14 + 0.06 * p; tx = -90 * p; ty = 60 * p; }
  if (mv === 'spin') { s = 1.45 - 0.2 * p; r = 18 - 18 * interpolate(fr, [0, 10], [0, 1], {...cl, easing: Easing.out(Easing.cubic)}); }
  if (mv === 'flip') { s = 1.2; r = 180; ty = 60 * p; }
  if (mv === 'float') { s = 1.16; ty = Math.sin(fr / 12) * 18; tx = Math.cos(fr / 16) * 22; }
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <AbsoluteFill style={{transform: `translate(${tx}px,${ty + y}px) rotate(${r}deg) scale(${s})`, filter: `${grade ?? 'saturate(.72) contrast(1.14) brightness(.96)'} blur(${bl}px)`}}>
        <OffthreadVideo src={SRC} muted startFrom={f(src)} style={{position: 'absolute', left: x, top: 0, width: 2560, height: 1920}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(4,10,16,${0.35 + dim}) 0%, rgba(4,10,16,${0.08 + dim}) 28%, rgba(4,10,16,${0.08 + dim}) 58%, rgba(4,10,16,${0.6 + dim}) 100%)`}} />
      <AbsoluteFill style={{background: 'rgba(30,60,80,.12)', mixBlendMode: 'multiply'}} />
    </AbsoluteFill>
  );
};
/** Police tape band (the format's signature). */
export const Tape: React.FC<{y: number; rot: number; t0: number; dir?: 1 | -1; col?: string; text?: string; out?: number}> = ({y, rot, t0, dir = 1, col = YEL, text = 'VIGILANT CRIME · DO NOT CROSS ·', out}) => {
  const fr = useCurrentFrame(); const lf = fr - t0; if (lf < 0) return null;
  const e = interpolate(lf, [0, 7], [1, 0], {...cl, easing: Easing.out(Easing.cubic)});
  const o = out !== undefined ? interpolate(fr, [out, out + 6], [0, 1], {...cl, easing: Easing.in(Easing.cubic)}) : 0;
  return (
    <div style={{position: 'absolute', left: -500, top: y, width: W + 1000, height: 92, background: col, transform: `rotate(${rot}deg) translateX(${dir * (e + o) * 1800}px)`,
      boxShadow: '0 14px 30px rgba(0,0,0,.5)', overflow: 'hidden', display: 'flex', alignItems: 'center', borderTop: '4px solid rgba(0,0,0,.25)', borderBottom: '4px solid rgba(0,0,0,.25)'}}>
      <div style={{whiteSpace: 'nowrap', transform: `translateX(${-600 + ((lf * 5 * dir) % 600)}px)`, fontFamily: 'HeroBlack', fontSize: 50, letterSpacing: 4, color: col === YEL ? '#0a0a0a' : '#fff'}}>{(text + ' ').repeat(10)}</div>
    </div>
  );
};
/** Hand-drawn marker ring that draws itself on. */
export const Ring: React.FC<{x: number; y: number; w: number; h: number; t0: number; col?: string; label?: string; lx?: number; ly?: number}> = ({x, y, w, h, t0, col = MAG, label, lx = 0, ly = -70}) => {
  const fr = useCurrentFrame(); const lf = fr - t0; if (lf < 0) return null;
  const draw = interpolate(lf, [0, 8], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const rx = w / 2, ry = h / 2, cx = rx + 20, cy = ry + 20;
  const d = `M ${cx + rx * 0.9} ${cy - ry * 0.55} A ${rx} ${ry} 0 1 0 ${cx + rx * 0.98} ${cy + ry * 0.1} A ${rx * 1.05} ${ry * 1.02} 0 0 0 ${cx + rx * 0.55} ${cy - ry * 0.95}`;
  const lp = pop(lf - 5, 5, 1.6);
  return (
    <div style={{position: 'absolute', left: x - 20, top: y - 20}}>
      <svg width={w + 40} height={h + 40} style={{overflow: 'visible', transform: 'rotate(-6deg)', filter: `drop-shadow(0 0 10px ${col}aa)`}}>
        <path d={d} fill="none" stroke={col} strokeWidth={11} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      </svg>
      {label && lf > 5 && <div style={{position: 'absolute', left: (w + 40) / 2 + lx, top: ly, transform: `translateX(-50%) rotate(-4deg) scale(${lp.s})`, whiteSpace: 'nowrap', padding: '6px 18px', background: col, borderRadius: 8, boxShadow: '0 10px 24px rgba(0,0,0,.45)'}}>
        <Txt size={40} color={col === YEL ? '#111' : '#fff'} style={{textShadow: 'none'}}>{label}</Txt></div>}
    </div>
  );
};
export const Stamp: React.FC<{text: string; t0: number; col?: string; y?: number; size?: number; rot?: number; x?: number}> = ({text, t0, col = MAG, y = 0.4, size = 120, rot = -8, x = 0}) => {
  const fr = useCurrentFrame(); if (fr < t0) return null; const lf = fr - t0;
  const s = interpolate(lf, [0, 4], [2.4, 1], {...cl, easing: Easing.in(Easing.cubic)}); const sh = lf < 8 && lf > 3 ? Math.sin(lf * 4) * 6 : 0;
  return <div style={{position: 'absolute', top: H * y, left: x, width: W, textAlign: 'center', transform: `translate(${sh}px,${sh}px) rotate(${rot}deg) scale(${s})`, opacity: Math.min(1, lf / 2)}}>
    <span style={{display: 'inline-block', fontFamily: 'HeroBlack', fontSize: size, lineHeight: 1.05, color: col, border: `${size * 0.08}px solid ${col}`, borderRadius: size * 0.12, padding: `${size * 0.06}px ${size * 0.22}px`, background: 'rgba(0,0,0,.35)', letterSpacing: 2}}>{text}</span></div>;
};
/** Typewriter transcript card: paper, mono, a highlighter sweep on the key phrase. */
const Exhibit: React.FC<{tag: string; text: string; hl: string; t0: number; t1: number; th: number; x?: number; y: number; w?: number; size?: number; rot?: number}> = ({tag, text, hl, t0, t1, th, x = 70, y, w = 940, size = 56, rot = -2}) => {
  const fr = useCurrentFrame(); if (fr < t0 - 4) return null;
  const n = Math.floor(interpolate(fr, [t0, t1], [0, text.length], cl));
  const i0 = text.indexOf(hl), i1 = i0 + hl.length;
  const sweep = interpolate(fr, [th, th + 8], [0, 100], {...cl, easing: Easing.out(Easing.cubic)});
  const inn = interpolate(fr, [t0 - 4, t0 + 2], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const shown = text.slice(0, n);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `translateY(${(1 - inn) * 120}px) rotate(${rot}deg)`, opacity: inn, background: '#efeadc', borderRadius: 6,
      boxShadow: '0 30px 70px rgba(0,0,0,.6)', padding: '64px 46px 46px'}}>
      <div style={{position: 'absolute', left: 40, top: -26, padding: '8px 22px', background: MAG, transform: 'rotate(-3deg)'}}><Txt size={38} style={{textShadow: 'none', letterSpacing: 3}}>{tag}</Txt></div>
      <div style={{position: 'absolute', right: 30, top: 16, fontFamily: MONO, fontSize: 24, color: '#7a7465'}}>TRANSCRIPT · VC-001</div>
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: size, lineHeight: 1.32, color: '#141414'}}>
        {shown.slice(0, Math.min(n, i0))}
        {n > i0 && <span style={{backgroundImage: `linear-gradient(${YEL}, ${YEL})`, backgroundRepeat: 'no-repeat', backgroundSize: `${sweep}% 78%`, backgroundPosition: '0 70%'}}>{shown.slice(i0, Math.min(n, i1))}</span>}
        {n > i1 && shown.slice(i1)}
        <span style={{opacity: fr % 16 < 8 ? 1 : 0}}>▌</span>
      </div>
    </div>
  );
};
export const Polaroid: React.FC<{n: number; x: number; y: number; w: number; rot: number; t0: number; cap?: string; pos?: string}> = ({n, x, y, w, rot, t0, cap, pos = '50% 25%'}) => {
  const fr = useCurrentFrame(); const lf = fr - t0; if (lf < 0) return null;
  const s = interpolate(lf, [0, 4], [1.6, 1], {...cl, easing: Easing.in(Easing.quad)}); const h = w * 1.18;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h + w * 0.2, background: '#f6f3ea', padding: w * 0.06, boxShadow: '0 18px 40px rgba(0,0,0,.55)', transform: `rotate(${rot}deg) scale(${s})`, opacity: Math.min(1, lf / 2)}}>
      <Img src={img(n)} style={{width: '100%', height: h - w * 0.06, objectFit: 'cover', objectPosition: pos, filter: 'saturate(.8) contrast(1.1)'}} />
      {cap && <div style={{fontFamily: MONO, fontWeight: 700, fontSize: w * 0.09, color: '#222', textAlign: 'center', marginTop: w * 0.03}}>{cap}</div>}
      <div style={{position: 'absolute', left: '50%', top: -12, width: 30, height: 30, marginLeft: -15, borderRadius: 15, background: 'radial-gradient(circle at 35% 35%, #ff6b6b, #a10d1f)', boxShadow: '0 4px 8px rgba(0,0,0,.5)'}} />
    </div>
  );
};
export const Paper: React.FC<{children: React.ReactNode; x: number; y: number; w: number; t0?: number; rot?: number; from?: 'down' | 'left' | 'right'}> = ({children, x, y, w, t0 = 0, rot = 0, from = 'down'}) => {
  const fr = useCurrentFrame(); const lf = fr - t0; if (lf < 0) return null;
  const e = interpolate(lf, [0, 7], [1, 0], {...cl, easing: Easing.out(Easing.cubic)});
  const off = from === 'down' ? [0, 1100 * e] : from === 'left' ? [-1200 * e, 0] : [1200 * e, 0];
  return <div style={{position: 'absolute', left: x, top: y, width: w, background: '#efeadc', borderRadius: 6, boxShadow: '0 30px 70px rgba(0,0,0,.6)', padding: 40,
    transform: `translate(${off[0]}px,${off[1]}px) rotate(${rot}deg)`}}>{children}</div>;
};
export const Mono: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 40, color = '#141414', style}) =>
  <div style={{fontFamily: MONO, fontWeight: 700, fontSize: size, color, lineHeight: 1.3, ...style}}>{children}</div>;
export const Grain: React.FC = () => {
  const fr = useCurrentFrame();
  return <AbsoluteFill style={{opacity: 0.13, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
    <svg width={W} height={H}><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={fr % 12} /></filter><rect width={W} height={H} filter="url(#gr)" /></svg>
  </AbsoluteFill>;
};
/** Persistent case chrome (series branding). */
const Chrome: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; const o = interpolate(fr, [20, 30], [0, 1], cl);
  return <div style={{position: 'absolute', left: 0, top: 150, width: W, display: 'flex', justifyContent: 'space-between', padding: '0 44px', opacity: o * 0.92}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '6px 16px', background: 'rgba(0,0,0,.55)', borderLeft: `8px solid ${YEL}`}}>
      <div style={{width: 16, height: 16, borderRadius: 8, background: MAG, opacity: fr % 30 < 18 ? 1 : 0.2}} />
      <Mono size={26} color="#fff">CASE VC-001 · {String(Math.floor(t / 60)).padStart(2, '0')}:{String(Math.floor(t % 60)).padStart(2, '0')}</Mono></div>
    <div style={{padding: '6px 16px', background: YEL}}><Txt size={28} color="#0a0a0a" style={{textShadow: 'none', letterSpacing: 2}}>VIGILANT CRIME</Txt></div>
  </div>;
};
const Credit: React.FC = () => <div style={{position: 'absolute', bottom: 40, width: W, textAlign: 'center', fontFamily: MONO, fontSize: 22, color: 'rgba(255,255,255,.7)'}}>footage: Yanko – "Life of a Rider" (film by Biggz) · commentary</div>;

/* ------------------------------------------------------------------ */
/* SHOTS                                                               */
/* ------------------------------------------------------------------ */
type Shot = {t: number; C: React.FC<{s: number; d: number}>};
const SHOTS: Shot[] = [
  // 1 · HOOK — tape-wipe sting over the close-up; pull-back reveal, marker on NITTY
  {t: 0, C: ({s, d}) => { const fr = useCurrentFrame(); return <>
    <Foot src={102.2} x={-740} d={d} mv="pullback" />
    <Tape y={300} rot={-9} t0={0} dir={1} out={f(1.5)} />
    <Tape y={980} rot={7} t0={2} dir={-1} out={f(1.5)} />
    {fr < f(1.6) && <div style={{position: 'absolute', top: 560, width: W, textAlign: 'center', opacity: interpolate(fr, [3, 6], [0, 1], cl)}}>
      <span style={{display: 'inline-block', padding: '10px 26px', background: 'rgba(0,0,0,.7)', border: `5px solid ${YEL}`, transform: 'rotate(-3deg)'}}><Mono size={54} color={YEL}>CASE #001 · YANKO</Mono></span></div>}
    {fr >= f(1.5) && <Chip x={540} y={1450} t0={f(1.5)} bg={MAG} size={42} rot={-2}>DRILL LYRICS ON TRIAL ⚖️</Chip>}
    <Ring x={630} y={240} w={360} h={440} t0={f(T('NITTY') - s)} label="NOT A NITTY?" ly={490} lx={-30} />
  </>; }},
  // 2 · "This UK drill rapper Yanko" — whip in + suspect lower-third
  {t: 2.63, C: ({s, d}) => { const fr = useCurrentFrame(); const k = f(T('YANKO') - s); const n = Math.floor(interpolate(fr, [k, k + 10], [0, 5], cl));
    return <><Foot src={16.2} x={-800} d={d} mv="whip" />
      <Paper x={70} y={880} w={620} t0={4} rot={-3} from="left"><Mono size={28} color="#7a7465">SUSPECT</Mono><Txt size={92} color="#111" style={{textShadow: 'none'}}>{'YANKO'.slice(0, n) || ' '}</Txt><Mono size={30}>GENRE: UK DRILL</Mono></Paper></>; }},
  // 3 · EXHIBIT A — the lyric, typed out, highlighter on "nursery"
  {t: 5.32, C: ({s, d}) => { const fr = useCurrentFrame(); return <>
    <Foot src={62.4} x={-740} d={d} mv="drift" dim={0.45} grade="saturate(.4) contrast(1.1) blur(14px)" />
    <Exhibit tag="EXHIBIT A" text={'"I\'ll stab man down in front of a nursery"'} hl="in front of a nursery" t0={2} t1={f(T('NURSERY') - s) + 6} th={f(T('NURSERY') - s)} y={380} />
    <Stamp text="LYRIC" t0={f(T('NURSERY') - s) + 8} col={MAG} y={0.47} size={84} rot={8} x={220} />
  </>; }},
  // 4 · "That's the line" — red line tape slashes across, Dutch angle
  {t: 7.92, C: ({s, d}) => { const fr = useCurrentFrame(); const k = f(T('LINE') - s); return <>
    <Foot src={12.0} x={-580} d={d} mv="dutch" />
    <Tape y={760} rot={-4} t0={k} dir={-1} col={MAG} text="THAT'S THE LINE ·" />
  </>; }},
  // 5 · "...coming from this man" — crane down, pointer arrow on MAN
  {t: 9.08, C: ({s, d}) => { const fr = useCurrentFrame(); const k = f(T('MAN', 10) - s); const p = pop(fr - k, 6, 1.6); return <>
    <Foot src={60.2} x={-560} d={d} mv="crane" />
    {fr >= k && <div style={{position: 'absolute', left: 640, top: 400 + Math.sin(fr / 3) * 12, transform: `scale(${p.s}) rotate(18deg)`}}><Txt size={150}>👇</Txt></div>}
    {fr >= k && <Chip x={730} y={320} t0={k} bg={YEL} size={44} rot={4}>THIS MAN</Chip>}
  </>; }},
  // 6 · Burberry scarf vs your Nan at the bus stop — side-by-side proof
  {t: 10.68, C: ({s, d}) => { const fr = useCurrentFrame(); const b = f(T('BURBERRY') - s), nan = f(T('NAN') - s), bus = f(T('BUS') - s); return <Stage>
    <Card x={50} y={250} w={470} h={820} t0={0} tilt={10} from="left"><Fit n={3} pos="50% 30%" zoom={1.25} /></Card>
    <Ring x={170} y={560} w={300} h={330} t0={b} col={YEL} label="BURBERRY" ly={400} />
    <Card x={560} y={250} w={470} h={820} t0={nan} tilt={-10} from="right"><div style={{width: '100%', height: '100%', background: 'linear-gradient(180deg,#9fb3bf,#5d6d75)', position: 'relative'}}>
      <div style={{position: 'absolute', left: 300, top: 120, width: 14, height: 700, background: '#ccc'}} />
      <div style={{position: 'absolute', left: 230, top: 70, width: 150, height: 150, borderRadius: 75, background: '#d0021b', border: '8px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Txt size={34} style={{textAlign: 'center', textShadow: 'none'}}>BUS<br />STOP</Txt></div>
      <div style={{position: 'absolute', left: 40, top: 360, fontSize: 280}}>👵</div></div></Card>
    {fr >= nan && <Label text="YOUR NAN" x={560} y={1090} w={470} t0={nan} col={YEL} />}
    <Label text="YANKO" x={50} y={1090} w={470} t0={2} />
    {fr >= bus && <Chip x={540} y={160} t0={bus} bg={MAG} size={46} rot={-2}>SAME SCARF ENERGY</Chip>}
  </Stage>; }},
  // 7 · "This is Yanko" — evidence board: all 18 frames pinned machine-gun style, overhead rotation
  {t: 14.69, C: ({s, d}) => { const fr = useCurrentFrame(); const rot = interpolate(fr, [0, f(d)], [-4, 3], cl), z = interpolate(fr, [0, f(d)], [1.18, 1.0], {...cl, easing: Easing.out(Easing.cubic)});
    const cells = Array.from({length: 18}, (_, i) => ({n: i + 1, x: 30 + (i % 3) * 340 + rnd(i * 3) * 30, y: 160 + Math.floor(i / 3) * 280 + rnd(i * 7) * 30, r: (rnd(i * 11) - 0.5) * 18}));
    return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #8a6440, #4a3320)', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `rotate(${rot}deg) scale(${z})`}}>
        {cells.map((c, i) => <Polaroid key={i} n={c.n} x={c.x} y={c.y} w={300} rot={c.r} t0={1 + Math.floor(i * 1.6)} />)}
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>{cells.slice(0, Math.min(18, Math.floor(fr / 1.6))).map((c, i) => <line key={i} x1={c.x + 150} y1={c.y} x2={540} y2={900} stroke="#c8102e" strokeWidth={4} opacity={0.85} />)}</svg>
      </AbsoluteFill>
      <Stamp text="SUSPECT: YANKO" t0={f(T('YANKO', 14.7) - s)} col={YEL} y={0.42} size={92} rot={-6} />
    </AbsoluteFill>; }},
  // 8 · "his track Life of a Rider plays like a confession" — truck move + player bar, CONFESSION stamp
  {t: 15.89, C: ({s, d}) => { const fr = useCurrentFrame(); const c = f(T('CONFESSION') - s); const prog = interpolate(fr, [0, f(d)], [0.12, 0.64], cl); return <>
    <Foot src={30.3} x={-770} d={d} mv="truck" />
    <div style={{position: 'absolute', left: 70, top: 260, width: 940, padding: '22px 30px', background: 'rgba(10,12,14,.82)', borderRadius: 18, border: '3px solid rgba(255,255,255,.25)', transform: `translateY(${interpolate(fr, [0, 6], [-300, 0], {...cl, easing: Easing.out(Easing.cubic)})}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 24}}><Txt size={60}>▶</Txt><div><Txt size={48}>LIFE OF A RIDER</Txt><Mono size={26} color="#bbb">Yanko · now playing</Mono></div></div>
      <div style={{marginTop: 18, height: 10, borderRadius: 5, background: 'rgba(255,255,255,.2)'}}><div style={{width: `${prog * 100}%`, height: '100%', borderRadius: 5, background: YEL}} /></div></div>
    <Stamp text="CONFESSION?" t0={c} col={MAG} y={0.36} size={110} rot={-7} />
  </>; }},
  // 9 · "We had to slide at 3pm" — CCTV HUD, locked tilt, timestamp rolls to 15:00
  {t: 19.91, C: ({s, d}) => { const fr = useCurrentFrame(); const k = f(T('THREE') - s); const sec = Math.min(60, 57 + Math.floor(fr / ((k || 1) / 3)));
    const ts = fr >= k ? '15:00:00' : `14:59:${String(Math.min(59, sec)).padStart(2, '0')}`; const hot = fr >= k && fr < k + 20 && fr % 6 < 3;
    return <><Foot src={64.0} x={-1092} d={d} mv="tilt" grade="grayscale(.85) contrast(1.35) brightness(1.05) sepia(.25) hue-rotate(60deg)" />
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 2px, transparent 2px 5px)'}} />
      {[[40, 230], [W - 120, 230], [40, H - 330], [W - 120, H - 330]].map(([x, y], i) => <div key={i} style={{position: 'absolute', left: x, top: y, width: 80, height: 80, borderColor: '#e8e8e8', borderStyle: 'solid', borderWidth: `${i < 2 ? 5 : 0}px ${i % 2 ? 5 : 0}px ${i >= 2 ? 5 : 0}px ${i % 2 ? 0 : 5}px`}} />)}
      <div style={{position: 'absolute', left: 80, top: 270}}><Mono size={40} color="#fff">CAM 01 · ESTATE</Mono><Mono size={40} color={MAG}>{fr % 30 < 18 ? '● REC' : ' '}</Mono></div>
      <div style={{position: 'absolute', right: 80, top: 270, padding: '4px 14px', background: hot ? YEL : 'transparent'}}><Mono size={52} color={hot ? '#000' : '#fff'}>{ts}</Mono></div>
    </>; }},
  // 10 · "because all of the pagans go home early" — split-flap departures board
  {t: 21.79, C: ({s, d}) => { const fr = useCurrentFrame(); const pg = f(T('PAGANS') - s), ho = f(T('HOME') - s);
    const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const flap = (txt: string, t0: number) => txt.split('').map((ch, i) => { const done = fr >= t0 + i * 1.2 + 6; const c = ch === ' ' ? ' ' : done ? ch : fr < t0 ? ' ' : AZ[Math.floor(rnd(fr * 31 + i) * AZ.length)];
      return <span key={i} style={{display: 'inline-block', width: 40, margin: 2, textAlign: 'center', background: '#151515', borderRadius: 4, color: done ? YEL : '#ddd', borderBottom: '2px solid #000'}}>{c}</span>; });
    return <><Foot src={86.2} x={-500} d={d} mv="float" dim={0.5} />
      <div style={{position: 'absolute', left: 50, top: 300, width: 980, padding: 26, background: '#0b0b0b', borderRadius: 14, boxShadow: '0 30px 80px rgba(0,0,0,.7)', border: '4px solid #333'}}>
        <Mono size={34} color="#fff" style={{marginBottom: 14}}>🕒 TODAY'S SCHEDULE</Mono>
        <Mono size={46} color={YEL}>{flap('15:00 SLIDE', 0)}</Mono>
        <Mono size={46} color={YEL} style={{marginTop: 10}}>{flap('15:00 PAGANS', pg)}</Mono>
        <Mono size={46} color={YEL} style={{marginTop: 10}}>{flap('  HOME EARLY', ho)}</Mono>
      </div></>; }},
  // 11 · "He's got a schedule" — roll + ORGANISED stamp
  {t: 24.2, C: ({s, d}) => { const k = f(T('SCHEDULE') - s); return <>
    <Foot src={56.3} x={-770} d={d} mv="roll" />
    <Stamp text="ORGANISED 📅" t0={k} col={YEL} y={0.3} size={100} rot={6} />
  </>; }},
  // 12 · "careful with evidence too" — glove close-up, evidence tag swings in
  {t: 25.46, C: ({s, d}) => { const fr = useCurrentFrame(); const k = f(T('EVIDENCE') - s); const sw = Math.sin(Math.max(0, fr - k) / 4) * 12 * Math.exp(-Math.max(0, fr - k) / 14);
    return <><Foot src={76.2} x={-300} d={d} mv="spin" />
      {fr >= k && <div style={{position: 'absolute', left: 560, top: 300, transformOrigin: '20px 0', transform: `rotate(${-10 + sw}deg)`}}>
        <div style={{width: 420, padding: 26, background: '#f2d16b', borderRadius: 10, boxShadow: '0 20px 50px rgba(0,0,0,.6)', border: '4px solid #8a6d1a'}}>
          <Mono size={28} color="#5a4500">EVIDENCE BAG #07</Mono><Txt size={66} color="#111" style={{textShadow: 'none'}}>GLOVES 🧤</Txt><Mono size={26} color="#5a4500">handle with care</Mono></div></div>}
    </>; }},
  // 13 · "I ain't trying to leave no prints" — masked man, fingerprint scan crossed out
  {t: 27.57, C: ({s, d}) => { const fr = useCurrentFrame(); const k = f(T('PRINTS') - s); const scan = interpolate(fr, [k - 12, k + 6], [0, 1], cl);
    return <><Foot src={36.6} x={-380} d={d} mv="shake" />
      <div style={{position: 'absolute', left: 340, top: 300, width: 400, height: 400, borderRadius: 30, background: 'rgba(0,0,0,.6)', border: `4px solid ${fr >= k ? MAG : '#3dff8a'}`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 260, filter: 'grayscale(1) brightness(1.6)'}}>🫆</div>
        <div style={{position: 'absolute', left: 0, top: `${scan * 100}%`, width: '100%', height: 8, background: '#3dff8a', boxShadow: '0 0 30px #3dff8a'}} />
        {fr >= k && <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Txt size={300} color={MAG}>✕</Txt></div>}</div>
      {fr >= k && <Chip x={540} y={740} t0={k} bg={MAG} size={46}>NO PRINTS FOUND</Chip>}
    </>; }},
  // 14 · "I'm wearing gloves, it's very important" — orbit-ish rotation on the blue gloves, warning sign
  {t: 29.1, C: ({s, d}) => { const fr = useCurrentFrame(); const g = f(T('GLOVES') - s), im = f(T('IMPORTANT') - s); return <>
    {(() => { const z = interpolate(fr, [g, g + 3], [1.0, 1.32], cl) + 0.04 * interpolate(fr, [0, f(d)], [0, 1], cl); return <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <AbsoluteFill style={{transformOrigin: '560px 1060px', transform: `scale(${z})`}}>
        <Img src={img(8)} style={{width: W, height: H, objectFit: 'cover', filter: 'saturate(.72) contrast(1.14) brightness(.96)'}} />
        <Ring x={250} y={900} w={780} h={300} t0={g + 3} col={YEL} label="GLOVES 🧤" ly={-66} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,10,16,.35) 0%, rgba(4,10,16,.08) 28%, rgba(4,10,16,.08) 58%, rgba(4,10,16,.6) 100%)'}} /></AbsoluteFill>; })()}
    {fr >= im && <div style={{position: 'absolute', left: 880, top: 250, transform: `translateX(-50%) scale(${0.55 * pop(fr - im, 6, 1.8).s})`}}>
      <div style={{width: 0, height: 0, borderLeft: '200px solid transparent', borderRight: '200px solid transparent', borderBottom: `340px solid ${YEL}`, filter: 'drop-shadow(0 16px 30px rgba(0,0,0,.6))'}} />
      <div style={{position: 'absolute', left: -200, top: 120, width: 400, textAlign: 'center'}}><Txt size={140} color="#111" style={{textShadow: 'none'}}>!</Txt><Txt size={34} color="#111" style={{textShadow: 'none', marginTop: -4}}>VERY IMPORTANT</Txt></div></div>}
  </>; }},
  // 15 · "changes into a banged out tracky" — upside-down flip reveal → full body, outfit-change wipe
  {t: 32.05, C: ({s, d}) => { const fr = useCurrentFrame(); const k = f(T('TRACKY') - s); const w = interpolate(fr, [k - 14, k], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)}); return <>
    <Foot src={98.3} x={-300} d={d} mv="flip" />
    <AbsoluteFill style={{clipPath: `inset(0 0 ${100 - w * 100}% 0)`}}><Sequence from={k - 14}><Foot src={49.5} x={-836} d={d - (k - 14) / FPS} mv="drift" /></Sequence></AbsoluteFill>
    <div style={{position: 'absolute', left: 0, top: w * H - 6, width: W, height: 12, background: YEL, boxShadow: `0 0 30px ${YEL}`, opacity: w > 0 && w < 1 ? 1 : 0}} />
    {fr >= k && <Ring x={170} y={720} w={360} h={560} t0={k} col={MAG} label="BANGED-OUT TRACKY" ly={-64} />}
  </>; }},
  // 16 · "Cause I don't want to ruin the Burberry" — protected vs expendable
  {t: 34.68, C: ({s, d}) => { const fr = useCurrentFrame(); const r = f(T('RUIN') - s), b = f(T('BURBERRY', 35) - s); return <Stage>
    <Card x={60} y={240} w={460} h={780} t0={0} tilt={9} from="up"><Fit n={14} pos="50% 20%" zoom={1.1} /></Card>
    <Card x={560} y={240} w={460} h={780} t0={4} tilt={-9} from="down"><Fit n={9} pos="50% 60%" zoom={1.1} /></Card>
    {fr >= b && <Chip x={290} y={1040} t0={b} bg="#2fbf5b" size={40} rot={-3}>BURBERRY ✅ SAFE</Chip>}
    {fr >= r && <Chip x={790} y={1040} t0={r} bg={MAG} size={40} rot={3}>TRACKY ❌ EXPENDABLE</Chip>}
    {fr >= b && <Stamp text="PROTECTED" t0={b + 6} col="#2fbf5b" y={0.24} size={70} rot={-10} x={-250} />}
  </Stage>; }},
  // 17 · "says the quiet part out loud" — volume meter, low tracking
  {t: 37.01, C: ({s, d}) => { const fr = useCurrentFrame(); const q = f(T('QUIET') - s), l = f(T('LOUD') - s);
    const lvl = fr < q ? 2 : fr < l ? 3 : 10; return <>
    <Foot src={82.3} x={-680} d={d} mv="truck" y={60} />
    <div style={{position: 'absolute', left: 80, top: 260, display: 'flex', alignItems: 'flex-end', gap: 12}}>
      {Array.from({length: 10}, (_, i) => <div key={i} style={{width: 66, height: 40 + i * 34, borderRadius: 8, background: i < lvl ? (i > 6 ? MAG : i > 3 ? YEL : '#3dff8a') : 'rgba(255,255,255,.15)', boxShadow: i < lvl && fr >= l ? `0 0 20px ${i > 6 ? MAG : YEL}` : 'none'}} />)}
      <Txt size={110} style={{marginLeft: 16}}>{fr >= l ? '🔊' : '🔈'}</Txt></div>
    {fr >= l && <Chip x={540} y={700} t0={l} bg={MAG} size={50}>OUT LOUD</Chip>}
  </>; }},
  // 18 · "The feds keep saying I'm a risk to the public" — risk assessment form slides up
  {t: 39.56, C: ({s, d}) => { const fr = useCurrentFrame(); const fe = f(T('FEDS') - s), rk = f(T('RISK') - s); const m = interpolate(fr, [rk, rk + 12], [0.15, 0.97], {...cl, easing: Easing.out(Easing.back(1.3))});
    return <><Foot src={58.3} x={-356} d={d} mv="dutch" dim={0.45} />
      <Paper x={60} y={230} w={960} t0={fe - 6} rot={-1.5}>
        <div style={{background: '#1d2a44', margin: '-40px -40px 26px', padding: '20px 40px'}}><Mono size={40} color="#fff">RISK ASSESSMENT · FORM 7B</Mono></div>
        <Mono size={36}>SUBJECT: <b>YANKO</b></Mono><Mono size={36}>OCCUPATION: DRILL RAPPER</Mono>
        <Mono size={36} style={{marginTop: 20}}>RISK TO THE PUBLIC:</Mono>
        <div style={{position: 'relative', marginTop: 12, height: 60, borderRadius: 30, background: 'linear-gradient(90deg,#3dbf6b,#f4c430,#e01e37)'}}>
          <div style={{position: 'absolute', left: `${m * 100}%`, top: -14, width: 16, height: 88, marginLeft: -8, background: '#111', borderRadius: 4}} /></div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}><Mono size={28}>LOW</Mono><Mono size={28}>HIGH</Mono></div>
      </Paper>
      {fr >= rk + 10 && <Stamp text="HIGH RISK" t0={rk + 10} col={MAG} y={0.47} size={96} rot={-8} />}
    </>; }},
  // 19 · "I'm not gonna lie, don't disagree" — rack-focus style blur → sharp, tick boxes
  {t: 42.21, C: ({s, d}) => { const fr = useCurrentFrame(); const dg = f(T('DISAGREE') - s); const foc = interpolate(fr, [0, 10], [16, 0], cl);
    return <><Foot src={62.5} x={-740} d={d} mv="float" grade={`saturate(.72) contrast(1.14) blur(${foc}px)`} />
      <Paper x={110} y={280} w={860} t0={0} rot={2} from="right">
        <Mono size={34} color="#7a7465">SUBJECT'S RESPONSE:</Mono>
        <Mono size={52} style={{marginTop: 18}}>☐ DISAGREE</Mono>
        <Mono size={52} style={{marginTop: 8}}>{fr >= dg ? <span style={{color: MAG}}>☑</span> : '☐'} DON'T DISAGREE</Mono>
      </Paper>
      {fr >= dg + 6 && <Stamp text="SELF-CONFIRMED" t0={dg + 6} col={YEL} y={0.42} size={84} rot={-6} />}
    </>; }},
  // 20 · "calls himself a chef like Gordon" — chef hat drops onto his head, whip-tilt
  {t: 44.79, C: ({s, d}) => { const fr = useCurrentFrame(); const c = f(T('CHEF') - s), g = f(T('GORDON') - s); const drop = interpolate(fr, [c, c + 8], [-500, 0], {...cl, easing: Easing.bounce});
    return <><Foot src={38.6} x={-868} d={d} mv="tilt" />
      {fr >= c && <div style={{position: 'absolute', left: 380, top: 180 + drop, fontSize: 280, transform: 'rotate(-8deg)'}}>👨‍🍳</div>}
      {fr >= g && <Chip x={540} y={720} t0={g} bg="#fff" size={52} rot={-3}><span style={{color: '#111'}}>"CHEF LIKE GORDON" 🍳</span></Chip>}
    </>; }},
  // 21 · "his last move was very bad hygiene" — hygiene rating sticker slams, overhead spin
  {t: 47.66, C: ({s, d}) => { const fr = useCurrentFrame(); const hy = f(T('HYGIENE') - s); const p = pop(fr - hy, 6, 1.8);
    return <><Foot src={24.2} x={-680} d={d} mv="spin" dim={0.3} />
      <Exhibit tag="EXHIBIT B" text={'"very bad hygiene"'} hl="very bad hygiene" t0={0} t1={f(T('HYGIENE') - s)} th={hy - 4} y={280} size={62} rot={2} />
      {fr >= hy && <div style={{position: 'absolute', left: 190, top: 600, width: 700, transform: `scale(${p.s}) rotate(-5deg)`, background: '#0d0d0d', borderRadius: 26, padding: 22, border: '8px solid #3dbf6b', boxShadow: '0 30px 70px rgba(0,0,0,.7)'}}>
        <Txt size={38} color="#3dbf6b" style={{textAlign: 'center'}}>HYGIENE RATING</Txt>
        <div style={{display: 'flex', justifyContent: 'center', gap: 10, marginTop: 12}}>{[0, 1, 2, 3, 4, 5].map((n) => <div key={n} style={{width: 88, height: 88, borderRadius: 44, background: n === 0 ? '#3dbf6b' : '#222', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Txt size={56} color={n === 0 ? '#000' : '#555'} style={{textShadow: 'none'}}>{n}</Txt></div>)}</div>
        <Mono size={28} color="#fff" style={{textAlign: 'center', marginTop: 12}}>URGENT IMPROVEMENT NECESSARY</Mono></div>}
    </>; }},
  // 22 · "These are lyrics, not evidence" — the disclaimer, typed on black, then the stamp
  {t: 51.19, C: ({s, d}) => { const fr = useCurrentFrame(); const ly = f(T('LYRICS') - s), ev = f(T('EVIDENCE', 52) - s); return <>
    <Foot src={22.3} x={-996} d={d} mv="crane" dim={0.55} grade="grayscale(1) contrast(1.2)" />
    <div style={{position: 'absolute', top: 380, width: W, textAlign: 'center'}}>
      <Mono size={84} color="#fff">THESE ARE</Mono>
      {fr >= ly && <Txt size={170} color={YEL} style={{marginTop: 10, transform: `scale(${pop(fr - ly, 5, 1.6).s})`}}>LYRICS</Txt>}
    </div>
    <Stamp text="NOT EVIDENCE" t0={ev} col={MAG} y={0.5} size={110} rot={-6} />
  </>; }},
  // 23 · "most dangerous drill rapper alive… or the funniest" — verdict gauge
  {t: 53.58, C: ({s, d}) => { const fr = useCurrentFrame(); const dg = f(T('DANGEROUS') - s), fu = f(T('FUNNIEST') - s);
    const ang = fr < dg ? Math.sin(fr / 3) * 10 : fr < fu ? interpolate(fr, [dg, dg + 8], [0, -62], {...cl, easing: Easing.out(Easing.back(2))}) : interpolate(fr, [fu, fu + 8], [-62, 66], {...cl, easing: Easing.out(Easing.back(2.4))});
    return <><Foot src={58.6} x={-356} d={d} mv="roll" dim={0.35} />
      <div style={{position: 'absolute', left: 90, top: 260, width: 900, height: 520, background: 'rgba(8,10,12,.85)', borderRadius: 26, border: `5px solid ${YEL}`}}>
        <Txt size={58} style={{textAlign: 'center', marginTop: 26}}>THE VERDICT</Txt>
        <svg width={900} height={420} style={{position: 'absolute', left: 0, top: 90}}>
          <path d="M 130 360 A 320 320 0 0 1 450 40" stroke={MAG} strokeWidth={46} fill="none" />
          <path d="M 450 40 A 320 320 0 0 1 770 360" stroke={YEL} strokeWidth={46} fill="none" />
          <g transform={`rotate(${ang} 450 360)`}><rect x={443} y={80} width={14} height={280} rx={7} fill="#fff" /></g><circle cx={450} cy={360} r={28} fill="#fff" />
        </svg>
        <div style={{position: 'absolute', left: 30, bottom: 30}}><Txt size={44} color={MAG}>😈 DANGEROUS</Txt></div>
        <div style={{position: 'absolute', right: 30, bottom: 30}}><Txt size={44} color={YEL}>FUNNIEST 😂</Txt></div>
      </div>
    </>; }},
  // 24 · CTA — case file closes, comment bubble, follow tap
  {t: 57.88, C: ({s, d}) => { const fr = useCurrentFrame(); const sb = f(T('SUBSCRIBE') - s), vc = f(T('VIGILANT', 59) - s); const tap = fr >= sb + 6;
    const hx = interpolate(fr, [sb - 10, sb + 4], [900, 640], {...cl, easing: Easing.out(Easing.cubic)}), hy = interpolate(fr, [sb - 10, sb + 4], [1000, 680], {...cl, easing: Easing.out(Easing.cubic)});
    return <><Foot src={110.0} x={-880} d={d} mv="float" dim={0.15} />
      <div style={{position: 'absolute', left: 120, top: 270, transform: `scale(${pop(fr, 6, 1.6).s}) rotate(-3deg)`, padding: '24px 32px', background: '#fff', borderRadius: 30, boxShadow: '0 20px 50px rgba(0,0,0,.5)'}}>
        <Txt size={56} color="#111" style={{textShadow: 'none'}}>😈 or 😂 ?</Txt><Mono size={28} color="#555">comment your verdict 👇</Mono></div>
      <div style={{position: 'absolute', left: 280, top: 580, width: 520, height: 120, borderRadius: 60, background: tap ? '#2a2a2a' : MAG, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${tap ? pop(fr - sb - 6, 5, 1.3).s : 1 + 0.04 * Math.sin(fr / 4)})`, boxShadow: '0 20px 50px rgba(0,0,0,.6)'}}>
        <Txt size={54}>{tap ? '✓ FOLLOWING' : '+ FOLLOW'}</Txt></div>
      {fr >= sb - 10 && <div style={{position: 'absolute', left: hx, top: hy, fontSize: 130, transform: `scale(${fr >= sb + 4 && fr < sb + 8 ? 0.85 : 1})`}}>👆</div>}
      {fr >= vc && <Tape y={1080} rot={-6} t0={vc} dir={1} />}
    </>; }},
];

const PUNCH = ['STAB', 'NURSERY', 'LINE', 'NAN', 'CONFESSION', 'THREE', 'PRINTS', 'GLOVES', 'TRACKY', 'LOUD', 'RISK', 'DISAGREE', 'CHEF', 'HYGIENE', 'EVIDENCE', 'FUNNIEST']
  .map((w, i, a) => f(T(w, i ? T(a[i - 1]) + 0.1 : 0)));
/** Open loop: promises the worst lyric is still coming (pays off at EXHIBIT B). */
const OpenLoop: React.FC = () => {
  const fr = useCurrentFrame(); const a = f(5.4), b = f(7.9); if (fr < a || fr >= b) return null; const p = pop(fr - a, 6, 1.5);
  return <div style={{position: 'absolute', top: 1450, width: W, textAlign: 'center', transform: `scale(${p.s})`, opacity: p.o}}>
    <span style={{display: 'inline-block', padding: '8px 20px', background: 'rgba(0,0,0,.75)', borderRadius: 10, border: `3px solid ${YEL}`}}><Mono size={34} color={YEL}>…and EXHIBIT B is worse 💀</Mono></span></div>;
};
/** Case progress bar: evidence collected (keeps people to the verdict). */
const Progress: React.FC = () => {
  const fr = useCurrentFrame(); const p = fr / VC1_FRAMES;
  return <div style={{position: 'absolute', left: 44, right: 44, top: 205, height: 8, borderRadius: 4, background: 'rgba(255,255,255,.18)'}}>
    <div style={{width: `${p * 100}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${YEL}, ${MAG})`}} />
    {[0.25, 0.5, 0.75, 0.88].map((m) => <div key={m} style={{position: 'absolute', left: `${m * 100}%`, top: -4, width: 4, height: 16, background: p >= m ? MAG : 'rgba(255,255,255,.4)'}} />)}
  </div>;
};

export const VigilantCase: React.FC = () => {
  const ready = useFontsReady('vc1');
  const fr = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{background: '#000'}} />;
  // white flash on every hard cut (1 frame) — keeps the cut rate felt
  const cut = SHOTS.some((sh) => fr === f(sh.t) && sh.t > 0);
  const lf = Math.min(99, ...PUNCH.map((p) => (fr >= p ? fr - p : 99)));
  const punch = lf < 7 ? 1 + 0.07 * Math.exp(-lf / 2.2) : 1; const jit = lf < 5 ? Math.sin(lf * 3.1) * 7 * (1 - lf / 5) : 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `translate(${jit}px,${jit * 0.6}px) scale(${punch})`}}>
      {SHOTS.map((sh, i) => { const s = sh.t, e = i < SHOTS.length - 1 ? SHOTS[i + 1].t : VC1_FRAMES / FPS; const C = sh.C;
        return <Sequence key={i} from={f(s)} durationInFrames={f(e) - f(s)}><C s={s} d={e - s} /></Sequence>; })}
      </AbsoluteFill>
      <OpenLoop />
      <Progress />
      <Grain />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 70% at 50% 50%, transparent 55%, rgba(0,0,0,.55) 100%)', pointerEvents: 'none'}} />
      <Chrome />
      <Captions />
      <Credit />
      {cut && <AbsoluteFill style={{background: '#fff', opacity: 0.35}} />}
      <Audio src={staticFile('mix_vc.wav')} />
    </AbsoluteFill>
  );
};
