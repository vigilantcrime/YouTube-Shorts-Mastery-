/* "Jiggle Physics": Roddy Games format v2 (built on the Jack of Hearts engine) (see /roddy_style.md).
   Emblem sting with glint at 0s · 1–3 word captions (yellow/magenta key word, y=69%) · Vice City gradient card stage ·
   side-by-side proof · highlight boxes · animated numbers · chat/press/poll cards · recap + subscribe-click ending. */
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import words from './w9.json';
import {W, H, SHADOW} from './kit';
import {cl, pop, rnd, useFontsReady} from './kit3d';

export const JIG_FRAMES = Math.round(51.0 * 30);
const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
type Wd = [string, number];
const WT = (words as Wd[]).map(([w, t]) => [w, t + 0.03] as Wd);
const at = (word: string, after = 0) => WT.find(([w, t]) => w === word && t >= after - 0.05)?.[1] ?? after;

const YEL = '#FFD400', MAG = '#FF2FA8';
const STAGE = 'radial-gradient(ellipse 120% 75% at 50% 18%, #ffb06a 0%, #ff5fa8 32%, #b13cd6 62%, #3a0f5e 100%)';
const img = (n: number) => staticFile(`jg/i${n}.jpg`);

/* ------------------------------------------------------------------ */
/* Captions: 1–3 word chunks, hard swaps, one coloured key word         */
/* ------------------------------------------------------------------ */
const NUM: Record<string, number> = {ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5, SIX: 6, SEVEN: 7, EIGHT: 8, NINE: 9, TEN: 10, TWENTY: 20, THIRTY: 30, FORTY: 40, FIFTY: 50, SEVENTY: 70};
const YELLOW = new Set(['MRBEAST', '$9', '90.4 MILLION', '$815.7 MILLION', 'GUINNESS', 'MR', 'BEAST', 'RESEARCH', 'PHYSICS', 'JIGGLE', '30', 'GTA', 'GTA 6', 'GTA 5', 'MIAMI', 'KODAK', 'BLACK', 'JACK', 'HEARTS', 'KING', 'DIAMONDS', 'ROCKSTAR', 'BOOBIE', 'IKE', 'JASON', 'DEADPOOL', 'WOLVERINE', 'VICE', 'CITY', 'SIN', 'UK', 'MARVEL', '2026', '19TH']);
const MAGENTA = new Set(['REAL', 'STUDYING', 'BABE', 'BEAT', 'BOUNCING', 'REWIND', 'BUSINESS', 'BEACH', 'ZOOM', 'PAUSE', 'GLASS', 'COPIED', 'EXACTLY', 'STORY', 'BAD', 'NEWS', 'SUBTLE', 'LOST', 'JOURNALISM', 'CONFIRMED', 'RAIN', 'STRIKES', 'MONEY', 'DECIDE', 'HONEST', 'COMMENTS', 'THROW', 'NOT', 'LADS', 'OWNER', 'FAMOUS', 'SAME']);
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
    if (w === 'NINETY' && nx === 'POINT') { out.push({w: '90.4 MILLION', t}); i += 3; continue; }
    if (w === 'EIGHT' && nx === 'HUNDRED') { out.push({w: '$815.7 MILLION', t}); i += 6; continue; }
    if (w === 'NINE' && nx === 'DOLLARS') { out.push({w: '$9', t}); i++; continue; }
    if (w === 'TRAILER' && nx === 'ONE') { out.push({w: 'TRAILER', t}, {w: '1', t: ws[i + 1][1]}); i++; continue; }
    if (w === 'FRAME' && nx === 'TWO') { out.push({w: 'FRAME', t}, {w: '2000-SOMETHING', t: ws[i + 1][1]}); i += 4; continue; }
    if (w === 'THIRTY' && nx === 'FRAMES') { out.push({w: '30', t}); continue; }
    if (w === 'NEXT' && nx === 'GEN') { out.push({w: 'NEXT-GEN', t}); i++; continue; }
    if (w === 'MR' && nx === 'BEAST') { out.push({w: 'MRBEAST', t}); i++; continue; }
    if (w === 'DAY' && nx === 'ONE') { out.push({w: 'DAY', t}, {w: '1', t: ws[i + 1][1]}); i++; continue; }
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
const TOK = normalize(WT).map((t, i) => (i === 2 && t.w === 'AND' ? {...t, w: 'IN'} : t));
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
        return <span key={i} style={{fontFamily: 'HeroBlack', fontSize: 66, color: col, letterSpacing: -0.5, marginRight: i < c.ws.length - 1 ? 18 : 0,
          textShadow: '0 0 2px #000, 0 3px 0 rgba(0,0,0,.65), 0 6px 18px rgba(0,0,0,.55), 2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000'}}>{w}</span>;
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */
const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#fff', style}) => (
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
const Card: React.FC<{children: React.ReactNode; x: number; y: number; w: number; h: number; t0?: number; tilt?: number; from?: 'left' | 'right' | 'up' | 'down' | 'pop'; radius?: number; border?: boolean}> =
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
const Fit: React.FC<{n: number; pos?: string; zoom?: number}> = ({n, pos = 'center', zoom = 1}) => (
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
const Chip: React.FC<{children: React.ReactNode; x: number; y: number; t0: number; bg?: string; size?: number; rot?: number}> = ({children, x, y, t0, bg = YEL, size = 46, rot = -3}) => {
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

/* Emblem sting (Roddy §6) — our own "Vice City Sin" mark, tilted, glint 0.2–0.45s, exit ~1.4s */
const Emblem: React.FC<{size?: number; glintAt?: number}> = ({size = 670, glintAt = 6}) => {
  const fr = useCurrentFrame();
  const g = interpolate(fr, [glintAt, glintAt + 8], [-0.4, 1.4], cl);
  const yaw = -12 + Math.sin(fr / 14) * 3, bob = Math.sin(fr / 18) * 6;
  return (
    <div style={{width: size, height: size * 0.82, perspective: 1600, transform: `translateY(${bob}px)`}}>
      <div style={{position: 'relative', width: '100%', height: '100%', transform: `rotateY(${yaw}deg) rotateX(6deg)`, filter: 'drop-shadow(0 22px 40px rgba(20,0,40,.6))'}}>
        <div style={{position: 'absolute', inset: 0, clipPath: 'polygon(0 0, 100% 0, 100% 62%, 50% 100%, 0 62%)', background: 'linear-gradient(160deg,#ffcf6a 0%,#ff5fa8 45%,#7a2bd8 100%)', border: '0'}} />
        <div style={{position: 'absolute', inset: 14, clipPath: 'polygon(0 0, 100% 0, 100% 62%, 50% 100%, 0 62%)', background: 'linear-gradient(160deg,#2a0b3e,#120420)'}} />
        <div style={{position: 'absolute', top: '12%', width: '100%', textAlign: 'center'}}>
          <Txt size={size * 0.15} style={{letterSpacing: 2}}>VICE CITY</Txt>
          <Txt size={size * 0.34} style={{marginTop: 8, backgroundImage: 'linear-gradient(180deg,#ffd36b,#ff5fa8 60%,#c23cff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', textShadow: 'none',
            filter: 'drop-shadow(0 6px 0 rgba(0,0,0,.4))'}}>SIN</Txt>
          <div style={{fontFamily: 'UIBold', fontSize: size * 0.05, color: 'rgba(255,255,255,.75)', letterSpacing: 8, marginTop: 6}}>EVERY SIN'S A STORY</div>
        </div>
        {/* glint */}
        <div style={{position: 'absolute', inset: 0, clipPath: 'polygon(0 0, 100% 0, 100% 62%, 50% 100%, 0 62%)', overflow: 'hidden'}}>
          <div style={{position: 'absolute', top: '-30%', left: `${g * 100 - 30}%`, width: '22%', height: '160%', transform: 'rotate(35deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.75), transparent)'}} />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Shots — every image + both clips; a visual change on every noun     */
/* ------------------------------------------------------------------ */
type Shot = {t: number; C: React.FC<{s: number; d: number}>};
const T = (w: string, after = 0) => at(w, after);
const Clip: React.FC<{src: string; rate?: number; from?: number; zoom?: [number, number]; d: number; pos?: string}> = ({src, rate = 0.5, from = 0, zoom = [1.05, 1.15], d, pos = 'center'}) => {
  const fr = useCurrentFrame(); const z = interpolate(fr, [0, f(d)], zoom, {...cl, easing: Easing.inOut(Easing.sin)});
  return <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}><OffthreadVideo src={staticFile(src)} startFrom={from} playbackRate={rate} muted style={{width: W, height: H, objectFit: 'cover', objectPosition: pos, transform: `scale(${z})`, filter: 'brightness(1.55) contrast(1.08) saturate(1.15)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,.3) 0%, transparent 30%, transparent 55%, rgba(0,0,0,.55) 100%)'}} /></AbsoluteFill>;
};
const Stamp: React.FC<{text: string; t0: number; col?: string; y?: number; size?: number; rot?: number}> = ({text, t0, col = '#ff2d2d', y = 0.4, size = 120, rot = -8}) => {
  const fr = useCurrentFrame(); if (fr < t0) return null; const p = pop(fr - t0, 5, 2.2);
  return <div style={{position: 'absolute', top: H * y, width: W, textAlign: 'center', transform: `rotate(${rot}deg) scale(${p.s})`, opacity: p.o}}>
    <span style={{fontFamily: 'HeroBlack', fontSize: size, color: col, border: `${size * 0.08}px solid ${col}`, borderRadius: size * 0.15, padding: `0 ${size * 0.25}px`, background: 'rgba(0,0,0,.25)', textShadow: '0 4px 20px rgba(0,0,0,.5)'}}>{text}</span></div>;
};
const Guinness: React.FC<{t0: number; line: string; sub: string}> = ({t0, line, sub}) => {
  const fr = useCurrentFrame(); if (fr < t0) return null; const p = pop(fr - t0, 8, 0.5);
  return <div style={{position: 'absolute', left: 110, right: 110, top: H * 0.5, padding: '34px 30px', borderRadius: 24, background: 'linear-gradient(160deg,#1a1408,#0b0904)', border: '6px solid #e8c46a', textAlign: 'center',
    transform: `scale(${p.s}) rotate(-2deg)`, opacity: p.o, boxShadow: '0 30px 80px rgba(0,0,0,.6), 0 0 50px rgba(232,196,106,.35)'}}>
    <div style={{fontFamily: 'UIBold', fontSize: 26, letterSpacing: 8, color: '#e8c46a'}}>★ WORLD RECORD · CERTIFIED ★</div>
    <Txt size={60} color="#fff6d0" style={{marginTop: 16, lineHeight: 1.1}}>{line}</Txt>
    <div style={{fontFamily: 'UIBold', fontSize: 26, color: '#c9b27a', marginTop: 14}}>{sub}</div></div>;
};

const SHOTS: Shot[] = [
  // 1 · HOOK — emblem sting over the beach jogger (A + emblem), "REAL ✅" stamp on "real"
  {t: 0, C: ({s, d}) => { const fr = useCurrentFrame(); const exit = interpolate(fr, [36, 41], [0, 1], cl);
    return <><Plate n={2} dur={d} from={[1.08, 0, 60]} to={[1.16, 0, 30]} pos="9% 50%" /><AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,0,20,.97) 0%, rgba(10,0,20,.9) 22%, rgba(10,0,20,0) 40%)'}} />
      <div style={{position: 'absolute', left: (W - 640) / 2, top: 210, opacity: 1 - exit, transform: `scale(${1 - exit * 0.15})`, filter: `blur(${exit * 20}px)`}}><Emblem size={640} /></div>
      <Stamp text="REAL ✅" t0={f(T('REAL') - s)} col="#3dff8a" y={0.28} size={130} /></>; }},
  // 2 · "filing them under research" — the file photo slides into a TOP SECRET folder (B)
  {t: 2.51, C: ({s}) => { const fr = useCurrentFrame(); const k = f(T('FILING') - s); const slide = interpolate(fr, [k, k + 10], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
    return <Stage bg={2}>
      <div style={{position: 'absolute', left: 120, top: 640, width: 840, height: 640, borderRadius: '0 26px 26px 26px', background: 'linear-gradient(180deg,#e8c27a,#c99a4a)', boxShadow: '0 30px 80px rgba(0,0,0,.5)'}}>
        <div style={{position: 'absolute', top: -60, left: 0, width: 320, height: 70, borderRadius: '20px 20px 0 0', background: '#e8c27a'}} />
        <div style={{position: 'absolute', left: 50, top: 60}}><Txt size={70} color="#5a3a10" style={{textShadow: 'none'}}>📁 RESEARCH</Txt>
          <div style={{fontFamily: 'UIBold', fontSize: 30, color: '#7a5420', marginTop: 10}}>Ref: GTA6 / physics / "very important"</div></div>
        <div style={{position: 'absolute', right: 40, bottom: 40, transform: 'rotate(-12deg)', border: '8px solid #c8102e', borderRadius: 14, padding: '4px 22px'}}><Txt size={56} color="#c8102e" style={{textShadow: 'none'}}>TOP SECRET</Txt></div>
      </div>
      <Card x={250} y={260 + slide * 520} w={580} h={330} t0={2} tilt={-4} radius={8}><Fit n={2} pos="95% 50%" /></Card>
    </Stage>; }},
  // 3 · paused on frame 2000-something — phone with a paused trailer frame (j3) + girlfriend 👀 (B)
  {t: 5.28, C: ({s}) => { const fr = useCurrentFrame(); const gf = f(T('GIRLFRIEND') - s);
    return <Stage bg={3}>
      <Card x={250} y={170} w={580} h={1180} tilt={-6} radius={50}><Fit n={3} pos="50% 55%" /></Card>
      <Chip x={W / 2} y={1080} t0={f(T('PAUSED') - s)} bg="#111" size={50} rot={0}>⏸ FRAME 2,0??</Chip>
      {fr >= gf && <div style={{position: 'absolute', left: interpolate(fr, [gf, gf + 8], [-300, 20], {...cl, easing: Easing.out(Easing.back(1.5))}), top: 720, fontSize: 210, transform: 'rotate(8deg)'}}>👀</div>}
      <Chip x={250} y={660} t0={gf + 4} bg={MAG} size={40} rot={-6}>GIRLFRIEND</Chip>
    </Stage>; }},
  // 4 · "Babe, I'm studying the physics engine." — Physics 101 notebook (B)
  {t: 9.91, C: ({s}) => { const fr = useCurrentFrame(); const w = interpolate(fr, [f(T('PHYSICS', 10.8) - s), f(T('ENGINE') - s) + 10], [0, 1], cl);
    const eq = ['F = m · a', 'bounce = 30 fps', 'k (jiggle) ≈ 0.7', '∴ research ✓'];
    return <Stage bg={2}>
      <Card x={120} y={250} w={840} h={960} tilt={-5} radius={14}><div style={{width: '100%', height: '100%', background: 'repeating-linear-gradient(180deg,#fffef6 0 62px,#b9d4ff 62px 64px)', padding: '40px 50px 0 110px', boxSizing: 'border-box', position: 'relative'}}>
        <div style={{position: 'absolute', left: 80, top: 0, bottom: 0, width: 4, background: '#ff8a9a'}} />
        <Txt size={58} color="#1a2a8a" style={{textShadow: 'none'}}>PHYSICS ENGINE 101</Txt>
        {eq.map((e, i) => <div key={i} style={{fontFamily: 'HeroBlack', fontSize: 52, color: '#1a2a8a', marginTop: 46, opacity: w * 4 > i ? 1 : 0, transform: 'rotate(-1.5deg)'}}>{e}</div>)}
      </div></Card>
      <Chip x={W / 2} y={160} t0={f(T('BABE') - s)} bg={MAG} size={56}>"BABE…"</Chip></Stage>; }},
  // 5 · "Studying it." — slam zoom on the notebook with a red underline (B)
  {t: 11.92, C: ({s}) => { const fr = useCurrentFrame(); const z = interpolate(fr, [0, 6], [1, 1.35], {...cl, easing: Easing.out(Easing.cubic)}); const u = interpolate(fr, [4, 14], [0, 1], cl);
    return <Stage bg={2}><AbsoluteFill style={{transform: `scale(${z}) rotate(-3deg)`, transformOrigin: '50% 40%'}}>
      <div style={{position: 'absolute', left: 140, top: 560, width: 800, padding: 40, background: '#fffef6', borderRadius: 14, boxShadow: '0 30px 80px rgba(0,0,0,.5)'}}>
        <Txt size={90} color="#1a2a8a" style={{textShadow: 'none'}}>k (jiggle) ≈ 0.7</Txt>
        <svg width={720} height={40}><path d="M5 25 C 200 5, 400 40, 715 15" stroke="#e0144c" strokeWidth={10} fill="none" strokeDasharray={760} strokeDashoffset={760 * (1 - u)} strokeLinecap="round" /></svg>
      </div></AbsoluteFill></Stage>; }},
  // 6 · "with a magnifying glass." — magnifier sweeps Jason's walk to the club (A + C)
  {t: 12.84, C: ({s, d}) => { const fr = useCurrentFrame(); const mx = interpolate(fr, [0, f(d)], [700, 300], {...cl, easing: Easing.inOut(Easing.sin)}), my = 760;
    const R = 230, Z = 2.2, sc = 1.15;
    return <><Plate n={7} dur={d} from={[sc, 0, 0]} to={[sc, 0, 0]} pos="22% 50%" />
      <div style={{position: 'absolute', left: mx - R, top: my - R, width: 2 * R, height: 2 * R, borderRadius: '50%', overflow: 'hidden', border: '18px solid #2a2a2e', boxShadow: '0 20px 60px rgba(0,0,0,.6)'}}>
        <div style={{position: 'absolute', left: -(mx - R) * Z - (Z - 1) * R, top: -(my - R) * Z - (Z - 1) * R, width: W * Z, height: H * Z}}>
          <Img src={img(7)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '22% 50%', transform: `scale(${sc})`}} /></div>
        <AbsoluteFill style={{background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,.3), transparent 50%)'}} /></div>
      <div style={{position: 'absolute', left: mx + R * 0.55, top: my + R * 0.55, width: 50, height: 330, background: '#2a2a2e', borderRadius: 25, transform: 'rotate(-40deg)', transformOrigin: 'top'}} />
      <Chip x={W / 2} y={260} t0={f(T('MAGNIFYING') - s)} bg={YEL} size={50}>🔍 FOR SCIENCE</Chip></>; }},
  // 7 · 90.4M views in 24h + Guinness certificate (A + odometer + ring + certificate)
  {t: 14.09, C: ({s, d}) => { const fr = useCurrentFrame(); const hrs = Math.min(24, Math.floor(interpolate(fr, [f(T('MILLION', 15.7) - s), f(T('HOURS', 17) - s)], [0, 24], cl)));
    return <><Plate n={6} dur={d} from={[1.35, 0, 0]} to={[1.22, 0, 0]} pos="45% 50%" dim={0.25} />
      <Chip x={W / 2} y={220} t0={2} bg={MAG}>▶ TRAILER 1</Chip>
      <Odometer value={90421491} t0={f(T('NINETY') - s)} t1={f(T('MILLION', 15.7) - s) + 4} y={H * 0.17} size={124} label="VIEWS" />
      {hrs > 0 && <div style={{position: 'absolute', left: W / 2 - 100, top: H * 0.34, width: 200, height: 200}}>
        <svg width={200} height={200}><circle cx={100} cy={100} r={86} stroke="rgba(255,255,255,.25)" strokeWidth={13} fill="none" /><circle cx={100} cy={100} r={86} stroke={YEL} strokeWidth={13} fill="none" strokeDasharray={540} strokeDashoffset={540 * (1 - hrs / 24)} transform="rotate(-90 100 100)" strokeLinecap="round" /></svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Txt size={62}>{hrs}H</Txt></div></div>}
      <Guinness t0={f(T('GUINNESS') - s)} line="Most-viewed game trailer in 24 hours" sub="GTA VI · Trailer 1 · Guinness World Records" /></>; }},
  // 8 · "It beat MrBeast." — VS card with crown (B)
  {t: 19.38, C: ({s}) => { const fr = useCurrentFrame(); const k = f(T('BEAT', 19.4) - s);
    return <Stage bg={6}>
      <Card x={60} y={470} w={450} h={620} tilt={10} from="left"><Fit n={6} pos="45% 50%" /></Card>
      <Card x={570} y={470} w={450} h={620} tilt={-10} from="right" t0={3}><div style={{width: '100%', height: '100%', background: 'linear-gradient(160deg,#1f8cff,#0a3a8a)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: 200}}>🎁</div><Txt size={60}>MRBEAST</Txt></div></Card>
      <Label text="GTA VI" x={60} y={400} w={450} /><Label text="RECORD HOLDER" x={570} y={400} w={450} t0={3} />
      <div style={{position: 'absolute', left: W / 2 - 80, top: 700, width: 160, height: 160, borderRadius: 80, background: '#111', border: '6px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(fr - 4, 6, 2).s})`}}><Txt size={64}>VS</Txt></div>
      {fr >= k && <div style={{position: 'absolute', left: 180, top: 290, fontSize: 150, transform: `scale(${pop(fr - k, 6, 2.2).s}) rotate(-12deg)`}}>👑</div>}
    </Stage>; }},
  // 9 · quarter of a million dollars (B: cash tag)
  {t: 20.87, C: ({s}) => <Stage bg={1}>
    <Card x={190} y={330} w={700} h={760} tilt={-6}><Fit n={1} pos="50% 40%" /></Card>
    <Odometer value={250000} t0={f(T('QUARTER') - s) - 2} t1={f(T('DOLLARS', 22.6) - s)} y={H * 0.12} size={150} prefix="$" label="GIVEN AWAY" /></Stage>},
  // 10 · "lost to a bikini bouncing at 30 frames a second" — Real Dimez clip + FPS HUD + LOST stamp (A + C)
  {t: 23.13, C: ({s, d}) => { const fr = useCurrentFrame(); return <><Clip src="jg/dimez.mp4" rate={0.33} d={d} zoom={[1.08, 1.2]} />
    <div style={{position: 'absolute', right: 40, top: 200, padding: '10px 20px', borderRadius: 10, background: 'rgba(0,0,0,.7)', fontFamily: 'UIBold', fontSize: 40, color: '#3dff8a'}}>{`${30} FPS · F${2040 + fr}`}</div>
    <Stamp text="MRBEAST LOST" t0={f(T('LOST', 23.6) - s)} y={0.2} size={100} /></>; }},
  // 11 · "I watched it for the story." — Boobie Ike clip (A + chip)
  {t: 26.25, C: ({s, d}) => <><Clip src="jg/boobie.mp4" rate={0.4} d={d} zoom={[1.25, 1.1]} pos="60% 50%" />
    <Chip x={W / 2} y={300} t0={f(T('STORY', 26.9) - s)} bg="#fff" size={56}>📖 "FOR THE STORY"</Chip></>},
  // 12 · "Now. Let's talk money." — cash hand + money in the air (A)
  {t: 27.47, C: ({d}) => <Plate n={4} dur={d} from={[1.5, 0, 0]} to={[1.25, 0, 0]} pos="70% 30%" />},
  // 13 · GTA 5 $815.7M day one (B + odometer)
  {t: 28.67, C: ({s}) => <Stage bg={1}>
    <Chip x={W / 2} y={250} t0={2} bg="#111" size={48} rot={0}>GTA 5 · LAUNCH DAY</Chip>
    <Odometer value={815700000} t0={f(T('EIGHT') - s)} t1={f(T('MILLION', 31) - s) + 4} y={H * 0.25} size={118} prefix="$" />
    <Card x={340} y={H * 0.42} w={400} h={400} t0={f(T('DAY', 32) - s)} tilt={-6}><div style={{width: '100%', height: '100%', background: '#fff', textAlign: 'center'}}>
      <div style={{background: '#e0144c', padding: '16px 0'}}><Txt size={44}>SEPT 2013</Txt></div><Txt size={200} color="#111" style={{textShadow: 'none', marginTop: 20}}>17</Txt></div></Card></Stage>},
  // 14 · "Also Guinness." (B)
  {t: 32.9, C: () => <Stage bg={1}><Guinness t0={0} line="Highest-grossing video game in 24 hours" sub="GTA V · $815.7M on day 1 · Guinness World Records" /></Stage>},
  // 15 · divide: $815.7M ÷ 90.4M = $9 (B)
  {t: 33.86, C: ({s}) => { const fr = useCurrentFrame(); const a = f(T('DIVIDE') - s), b = f(T('VIEWS', 35) - s), c = f(T('NINE', 37.5) - s);
    const row = (t0: number, el: React.ReactNode, y: number) => fr >= t0 && <div style={{position: 'absolute', top: y, width: W, textAlign: 'center', transform: `scale(${pop(fr - t0, 6, 1.4).s})`}}>{el}</div>;
    return <Stage bg={1}>
      {row(a, <Txt size={110}>$815.7M</Txt>, 330)}
      {row(a + 4, <div style={{width: 600, height: 12, background: '#fff', margin: '0 auto', borderRadius: 6}} />, 490)}
      {row(b, <Txt size={110}>90.4M views</Txt>, 530)}
      {row(f(T('PAUSE') - s), <Txt size={80}>⏸ 🔍</Txt>, 700)}
      {row(c, <Txt size={300} color={YEL} style={{textShadow: '0 10px 0 rgba(0,0,0,.35)'}}>≈ $9</Txt>, 820)}
      {row(c + 6, <Txt size={44}>per view, to Rockstar</Txt>, 1140)}</Stage>; }},
  // 16 · "your rewind button is a business model" — dancers rewinding with VHS scanlines + ⏪ (A + C)
  {t: 39.08, C: ({s, d}) => { const fr = useCurrentFrame(); const x = Math.sin(fr * 0.9) * 26;
    return <><AbsoluteFill style={{transform: `translateX(${x}px)`}}><Plate n={5} dur={d} from={[1.35, 0, 0]} to={[1.2, 0, 0]} pos="50% 20%" /></AbsoluteFill>
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 3px, transparent 3px 7px)'}} />
      <div style={{position: 'absolute', top: 260, width: W, textAlign: 'center', fontSize: 200, transform: `scale(${1 + 0.06 * Math.sin(fr * 0.8)})`}}>⏪</div>
      <Chip x={W / 2} y={1080} t0={f(T('BUSINESS') - s)} bg={YEL} size={56}>💼 BUSINESS MODEL</Chip></>; }},
  // 17 · "next-gen realism?" — the circled thumbnail as evidence (B)
  {t: 41.67, C: ({s}) => <Stage bg={2}>
    <Card x={60} y={420} w={960} h={540} tilt={-4}><Fit n={2} /></Card>
    <Chip x={W / 2} y={300} t0={f(T('REALISM') - s)} bg="#3a7bff" size={52}>🧪 NEXT-GEN REALISM?</Chip></Stage>},
  // 18 · "or the reason half the lobby never leaves the beach" — beach + poll (A + B)
  {t: 44.46, C: ({s, d}) => { const fr = useCurrentFrame(); const a = interpolate(fr, [4, 24], [0, 41], cl), b = interpolate(fr, [f(T('BEACH') - s), f(T('BEACH') - s) + 20], [0, 59], cl);
    const row = (label: string, v: number, col: string, y: number) => <div style={{position: 'absolute', left: 90, top: y, width: 900, height: 120, borderRadius: 22, background: 'rgba(0,0,0,.45)', overflow: 'hidden', border: '3px solid rgba(255,255,255,.4)'}}>
      <div style={{width: `${v}%`, height: '100%', background: col}} /><div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px'}}><Txt size={44}>{label}</Txt><Txt size={46}>{Math.round(v)}%</Txt></div></div>;
    return <><Plate n={2} dur={d} from={[1.08, 0, 60]} to={[1.16, 0, 30]} pos="9% 50%" /><AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,0,20,.97) 0%, rgba(10,0,20,.9) 22%, rgba(10,0,20,0) 40%)'}} />
      {row('🧪 NEXT-GEN REALISM', a, '#3a7bff', 300)}{row('🏖 NEVER LEAVING THE BEACH', b, MAG, 450)}</>; }},
  // 19 · recap collage → emblem → Follow tap (B)
  {t: 46.7, C: ({s}) => { const fr = useCurrentFrame(); const fol = f(T('FOLLOW') - s), tap = f(T('SIN', 48.4) - s);
    const collapse = interpolate(fr, [fol - 6, fol + 4], [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
    const cards = [7, 6, 5, 4, 1, 3, 2]; const tapped = fr >= tap + 4;
    return <Stage>
      {cards.map((n, i) => { const a = (i / cards.length) * Math.PI * 2; const r = 380 * (1 - collapse); return (
        <div key={i} style={{position: 'absolute', left: W / 2 - 125 + Math.cos(a) * r, top: 760 - 160 + Math.sin(a) * r * 1.2, width: 250, height: 320, borderRadius: 16, overflow: 'hidden', border: '4px solid #fff',
          transform: `rotate(${(i - 3) * 8}deg) scale(${pop(fr - i * 2, 6, 0.4).s * (1 - collapse * 0.6)})`, opacity: 1 - collapse, boxShadow: '0 20px 40px rgba(0,0,0,.45)'}}><Fit n={n} pos="50% 30%" /></div>); })}
      {fr >= fol - 2 && <div style={{position: 'absolute', left: (W - 560) / 2, top: 340, transform: `scale(${pop(fr - fol + 2, 8, 0.4).s})`}}><Emblem size={560} glintAt={fol + 4} /></div>}
      {fr >= tap - 8 && <div style={{position: 'absolute', left: W / 2 - 200, top: 980, width: 400, height: 110, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: tapped ? '#e9e9ee' : '#fe2c55', transform: `scale(${tapped ? interpolate(fr - tap - 4, [0, 3, 7], [0.92, 0.92, 1], cl) : pop(fr - tap + 8, 6, 0.5).s})`, boxShadow: '0 16px 40px rgba(0,0,0,.4)'}}>
        <Txt size={50} color={tapped ? '#222' : '#fff'} style={{textShadow: 'none'}}>{tapped ? '✓ Following' : '+ Follow'}</Txt></div>}
      {fr >= tap - 8 && <div style={{position: 'absolute', left: W / 2 + 50 + interpolate(fr, [tap - 8, tap], [200, 0], cl), top: 1040 + interpolate(fr, [tap - 8, tap], [220, 0], cl), fontSize: 90, transform: `scale(${fr >= tap && fr < tap + 4 ? 0.85 : 1})`}}>👆</div>}
    </Stage>; }},
];

export const JigglePhysics: React.FC = () => {
  const ready = useFontsReady('jig');
  if (!ready) return <AbsoluteFill style={{background: '#000'}} />;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOTS.map((sh, i) => { const s = sh.t, e = i < SHOTS.length - 1 ? SHOTS[i + 1].t : JIG_FRAMES / FPS; const C = sh.C;
        return <Sequence key={i} from={f(s)} durationInFrames={f(e) - f(s)}><C s={s} d={e - s} /></Sequence>; })}
      <Captions />
      <Audio src={staticFile('mix_jig.wav')} />
    </AbsoluteFill>
  );
};
