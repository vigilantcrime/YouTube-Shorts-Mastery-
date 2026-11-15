/* VIGILANT CRIME · DRILL BAR BREAKDOWN · EP 2 — "25 bodies in 29 seconds" (OFB SJ, Plugged In w/ Fumez).
   Format: "THE TALLY". A live scoreboard counts every claim. Real-audio clips (▶ THE TAPE) alternate with VO maths.
   No marker rings: pure cuts, counters, receipts, cards. Lyrics are performance, not evidence (stated on screen). */
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import data from './sj1.json';
import {W, H} from './kit';
import {cl, pop, rnd, useFontsReady} from './kit3d';
import {YEL, MAG, MONO, Txt, Mono, Stamp, Chip, Paper, Grain, Tape} from './VigilantCase';

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
type TL = {kind: 'vo' | 'clip'; id: string; t0: number; t1: number; src?: number};
const TLS = data.tl as TL[];
export const SJ_FRAMES = Math.ceil(data.total * FPS);
const FIX: Record<string, string> = {QING: 'CHING', MIDWORD: 'MID-WORD', FUMES: 'FUMEZ', OPS: 'OPPS', CENTER: 'CENTRE', FOURTEEN: '14'};
const RAW = data.vo as [string, number][];
const VOW: [string, number][] = (() => { const o: [string, number][] = []; for (let i = 0; i < RAW.length; i++) { const [w, t] = RAW[i]; const nx = RAW[i + 1]?.[0];
  if (w === 'TWENTY' && (nx === 'FIVE' || nx === 'NINE')) { o.push([nx === 'FIVE' ? '25' : '29', t]); i++; continue; }
  if (w === 'SO' && nx === 'CAP') { o.push(['NO', t]); continue; }
  if (w === 'SO' && nx === 'FULL') { o.push(["THAT'S A", t]); continue; }
  o.push([FIX[w] ?? w, t]); } return o; })();
const vt = (w: string, after = 0) => VOW.find(([x, t]) => x === w && t >= after - 0.05)?.[1] ?? after;
const seg = (id: string) => TLS.find((x) => x.id === id)!;
const SRC = staticFile('sj/sj_wide.mp4');

/* subject tracking: centre of interest (0..1 of source width) per source second */
const KC: [number, number][] = [[0, .45], [.5, .8], [1, .75], [1.5, .6], [2, .52], [2.5, .66], [3.9, .66], [4, .62], [4.9, .62], [5, .6], [6.5, .5], [7, .5], [7.4, .5], [7.5, .67], [8.9, .67], [9, .6], [9.5, .5], [10, .2], [10.5, .3], [11.2, .3], [11.5, .65], [12, .55], [12.5, .6], [13.5, .55],
  [14, .5], [14.5, .6], [15, .55], [15.5, .5], [16, .55], [16.5, .6], [17, .45], [17.5, .6], [18.5, .65], [19, .55], [19.5, .6], [20, .67], [20.4, .67], [20.5, .6], [21, .55], [21.5, .5], [22.2, .5], [22.5, .6], [23.2, .6], [23.5, .5], [25, .5], [25.5, .55], [26, .6], [27, .55], [27.5, .6], [28.5, .6], [29.6, .55]];
const xAt = (t: number) => { let c = KC[KC.length - 1][1]; for (let i = 0; i < KC.length - 1; i++) { const [a, ca] = KC[i], [b, cb] = KC[i + 1]; if (t >= a && t <= b) { c = ca + (cb - ca) * ((t - a) / (b - a)); break; } } return Math.max(-2334, Math.min(0, -(c * 3414 - 540))); };

/** 9:16 window into the performance. rate = playback speed; mv = camera move index (never repeats back-to-back). */
const Foot: React.FC<{src: number; rate?: number; mv: number; d: number; grade?: string; dim?: number}> = ({src, rate = 1, mv, d, grade, dim = 0}) => {
  const fr = useCurrentFrame(); const t = src + (fr / FPS) * rate; const x = xAt(t);
  const p = interpolate(fr, [0, f(d)], [0, 1], cl); const e = interpolate(fr, [0, 5], [1, 0], {...cl, easing: Easing.out(Easing.cubic)});
  const M = [
    {s: 1.06 + 0.1 * p, tx: 0, ty: 0, r: 0},
    {s: 1.2 - 0.12 * p, tx: 0, ty: 0, r: 0},
    {s: 1.14, tx: 60 - 120 * p, ty: 0, r: -1.5 + 3 * p},
    {s: 1.12 + 0.25 * e, tx: 0, ty: 0, r: 0},
    {s: 1.14, tx: 0, ty: 70 - 140 * p, r: 0},
    {s: 1.16, tx: Math.sin(fr / 7) * 12, ty: Math.cos(fr / 9) * 10, r: Math.sin(fr / 11) * 0.7},
    {s: 1.18, tx: 0, ty: 0, r: 4 - 8 * p},
  ][mv % 7];
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <AbsoluteFill style={{transform: `translate(${M.tx}px,${M.ty}px) rotate(${M.r}deg) scale(${M.s})`, filter: grade ?? 'contrast(1.12) saturate(1.1)'}}>
        <OffthreadVideo src={SRC} muted playbackRate={rate} startFrom={f(src)} style={{position: 'absolute', left: x, top: 0, width: 3414, height: 1920}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(3,6,14,${0.55 + dim}) 0%, rgba(3,6,14,${0.05 + dim}) 24%, rgba(3,6,14,${0.08 + dim}) 55%, rgba(3,6,14,${0.72 + dim}) 100%)`}} />
    </AbsoluteFill>
  );
};

/* ---------------- THE TALLY (signature scoreboard) ---------------- */
const CATS = [{k: 'SPLASH', e: '💦', n: 14}, {k: 'WHACKED', e: '📦', n: 5}, {k: 'CHING', e: '⚡', n: 3}, {k: 'SWIM', e: '🏊', n: 1}, {k: 'WING', e: '🪽', n: 2}];
/* count events: [time, category index, new value] */
const EV: [number, number, number][] = (() => { const o: [number, number, number][] = [];
  const sp = seg('splash'); [1.04, 1.84, 2.64].forEach((t, i) => o.push([sp.t0 + t - sp.src!, 0, i + 1]));
  const b0 = vt('14'), b1 = vt('SPLASH'); for (let i = 4; i <= 14; i++) o.push([b0 + ((b1 + 0.25 - b0) * (i - 4)) / 10, 0, i]);
  const wh = seg('whacked'); [15.92, 16.72, 17.48].forEach((t, i) => o.push([wh.t0 + t - wh.src!, 1, i + 1])); o.push([vt('FIVE', 20), 1, 4], [vt('WHACKED', 20), 1, 5]);
  const ch = seg('ching'); [21.76, 22.2].forEach((t, i) => o.push([ch.t0 + t - ch.src!, 2, i + 1])); o.push([ch.t0 + 22.9 - ch.src!, 3, 1], [vt('THREE'), 2, 3]);
  const wi = seg('wing'); o.push([wi.t0 + 26.0 - wi.src!, 4, 1], [vt('TWO', 36), 4, 2]);
  return o.sort((a, b) => a[0] - b[0]); })();
const valAt = (c: number, t: number) => EV.filter((e) => e[1] === c && e[0] <= t).reduce((m, e) => Math.max(m, e[2]), 0);
const lastHit = (c: number, t: number) => EV.filter((e) => e[1] === c && e[0] <= t).reduce((m, e) => Math.max(m, e[0]), -9);
const Tally: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; const show = interpolate(fr, [f(4.6), f(5.1)], [0, 1], cl); if (show <= 0) return null;
  const tot = CATS.reduce((s, _, i) => s + valAt(i, t), 0); const lastAny = Math.max(...CATS.map((_, i) => lastHit(i, t)));
  const tp = 1 + 0.18 * Math.max(0, 1 - (t - lastAny) / 0.18);
  return (
    <div style={{position: 'absolute', left: 36, right: 36, top: 232, opacity: show, transform: `translateY(${(1 - show) * -60}px)`}}>
      <div style={{display: 'flex', alignItems: 'stretch', background: 'rgba(6,8,12,.88)', border: `3px solid ${YEL}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,.55)'}}>
        {CATS.map((c, i) => { const v = valAt(i, t); const hit = Math.max(0, 1 - (t - lastHit(i, t)) / 0.2); return (
          <div key={i} style={{flex: 1, padding: '10px 0 8px', textAlign: 'center', borderRight: '2px solid rgba(255,255,255,.12)', background: hit > 0 ? `rgba(255,212,0,${0.35 * hit})` : 'transparent'}}>
            <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 19, color: v ? '#fff' : 'rgba(255,255,255,.45)', letterSpacing: 1}}>{c.k}</div>
            <div style={{fontFamily: 'HeroBlack', fontSize: 58, lineHeight: 1.05, color: v ? YEL : 'rgba(255,255,255,.25)', transform: `scale(${1 + 0.35 * hit})`}}>{v}</div>
          </div>); })}
        <div style={{width: 190, background: MAG, textAlign: 'center', padding: '10px 0 8px'}}>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 19, color: '#fff', letterSpacing: 1}}>CLAIMED</div>
          <div style={{fontFamily: 'HeroBlack', fontSize: 58, lineHeight: 1.05, color: '#fff', transform: `scale(${tp})`}}>{tot}</div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- captions (VO) ---------------- */
const VKEY = new Set(['25', '29', 'MATHS', '14', 'SPLASH', 'MID-WORD', 'WASH', 'WHACKED', 'PACKED', 'DEAL', 'VIOLENCE', 'CHING', 'SWIM', 'CENTRE', 'WING', 'CHICKEN', 'HOSPITAL', 'HIMSELF', 'TOTAL', 'SQUAD', 'SUBS', 'FACE', 'SPOTIFY', 'OPPS', 'NAMES', 'BALACLAVA', 'FUMEZ', 'POLICE', 'RECORDS', 'FOLLOW', 'MOON', 'SECOND', 'BODIES']);
const VRED = new Set(['BODIES', 'VIOLENCE', 'MID-WORD', 'POLICE', 'HIMSELF', 'SPOTIFY', 'WHACKED']);
const CH = (() => { const out: {t: number; ws: string[]}[] = []; VOW.forEach(([w, t], i) => { const l = out[out.length - 1]; const gap = i ? t - VOW[i - 1][1] : 9;
  if (l && l.ws.length < 3 && gap < 0.42 && (w.length <= 4 || l.ws.length < 2) && !VKEY.has(l.ws[l.ws.length - 1]) && l.ws.join(' ').length + w.length < 15) l.ws.push(w); else out.push({t, ws: [w]}); }); return out; })();
const Caps: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; let k = -1; CH.forEach((c, i) => { if (c.t <= t + 0.02) k = i; }); if (k < 0) return null; const c = CH[k]; if (t - c.t > 1.1) return null;
  if (TLS.some((x) => x.kind === 'clip' && t >= x.t0 && t < x.t1)) return null;
  const sc = interpolate(t - c.t, [0, 0.08], [1.12, 1], cl);
  return <div style={{position: 'absolute', top: H * 0.7, width: W, textAlign: 'center', transform: `translateY(-50%) scale(${sc})`}}>
    {c.ws.map((w, i) => { const key = VKEY.has(w); const col = VRED.has(w) ? MAG : YEL; return <span key={i} style={{display: 'inline-block', margin: '0 9px', fontFamily: 'HeroBlack', fontSize: 74, color: key ? (col === YEL ? '#0a0a0a' : '#fff') : '#fff', background: key ? col : 'transparent', padding: key ? '0 16px' : 0, transform: key ? 'rotate(-2deg)' : 'none',
      boxShadow: key ? '0 8px 20px rgba(0,0,0,.45)' : 'none', textShadow: key ? 'none' : '0 4px 0 rgba(0,0,0,.7), 3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000, 0 8px 24px rgba(0,0,0,.6)'}}>{w}</span>; })}
  </div>;
};

/* ---------------- THE TAPE: real-audio clip with slam words ---------------- */
const SLAM: Record<string, [string, number, string?][]> = {
  splash: [['GOES', 0.95], ['SPLASH 💦', 1.04, 'k'], ['GOES', 1.5], ['SPLASH 💦', 1.84, 'k'], ['GOES', 2.3], ['SPLASH 💦', 2.64, 'k']],
  whacked: [['GOT', 15.72], ['WHACKED', 15.92, 'k'], ['GOT', 16.48], ['WHACKED', 16.72, 'k'], ['GOT', 17.24], ['WHACKED', 17.48, 'k'], ['AND PACKED 📦', 17.76, 'r'], ['NO CAP', 18.16]],
  ching: [['GOT', 21.52], ['CHING ⚡', 21.76, 'k'], ['GOT CHING ⚡', 22.2, 'k'], ['SENT IN FOR A', 22.68], ['SWIM 🏊', 23.3, 'r']],
  wing: [['HEAD', 25.84], ['KICKED IN', 26.0, 'k'], ['ON A WING', 26.4, 'r'], ["CAN'T", 27.6], ['COME OFF', 27.92], ['THE WING', 28.2, 'r']],
};
const TapeClip: React.FC<{x: TL; mv: number}> = ({x, mv}) => {
  const fr = useCurrentFrame(); const t = x.src! + fr / FPS; const ws = SLAM[x.id]; let k = -1; ws.forEach((w, i) => { if (w[1] <= t + 0.02) k = i; });
  const cur = k >= 0 ? ws[k] : null; const age = cur ? t - cur[1] : 9; const s = interpolate(age, [0, 0.1], [1.7, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const hitZoom = cur && cur[2] ? 1 + 0.06 * Math.max(0, 1 - age / 0.15) : 1; const sh = cur && cur[2] && age < 0.15 ? Math.sin(age * 90) * 8 : 0;
  return <>
    <AbsoluteFill style={{transform: `translate(${sh}px,${sh * 0.5}px) scale(${hitZoom})`}}><Foot src={x.src!} mv={mv} d={x.t1 - x.t0} grade="contrast(1.2) saturate(1.25) brightness(1.06)" /></AbsoluteFill>
    <div style={{position: 'absolute', left: 36, top: 150, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', background: MAG, borderRadius: 10}}>
      <div style={{width: 16, height: 16, borderRadius: 8, background: '#fff', opacity: fr % 14 < 8 ? 1 : 0.2}} /><Txt size={28} style={{textShadow: 'none', letterSpacing: 2}}>▶ THE TAPE · REAL AUDIO</Txt></div>
    {cur && <div style={{position: 'absolute', top: H * 0.7, width: W, textAlign: 'center', transform: `translateY(-50%) scale(${s}) rotate(${cur[2] ? -3 : 0}deg)`}}>
      <span style={{display: 'inline-block', fontFamily: 'HeroBlack', fontSize: cur[2] ? 118 : 84, padding: cur[2] ? '0 22px' : 0, background: cur[2] === 'k' ? YEL : cur[2] === 'r' ? MAG : 'transparent', color: cur[2] === 'k' ? '#0a0a0a' : '#fff',
        textShadow: cur[2] ? 'none' : '4px 4px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000', boxShadow: cur[2] ? '0 14px 34px rgba(0,0,0,.55)' : 'none'}}>{cur[0]}</span></div>}
    {cur && cur[2] && age < 0.1 && <AbsoluteFill style={{background: '#fff', opacity: 0.22 * (1 - age / 0.1)}} />}
  </>;
};

/* ---------------- VO segments: sub-shots + gag layers ---------------- */
type Sub = [number, number];   // [source second, rate]
const SUBS: Record<string, Sub[]> = {
  A: [[0.0, 0.45], [7.0, 0.5], [13.4, 0.5]],
  B: [[4.95, 0.5], [9.0, 0.45], [10.0, 0.45], [5.9, 0.5]],
  C: [[11.6, 0.45], [14.0, 0.5], [18.1, 0.45]],
  D: [[19.0, 0.5], [16.0, 0.5]],
  E: [[21.4, 0.4], [27.0, 0.5], [24.0, 0.45], [25.0, 0.5]],
  F: [[28.6, 0.28], [4.0, 0.2]],
  G: [[0.1, 0.35], [2.6, 0.3], [22.5, 0.4], [29.0, 0.22]],
};
const L = (t: number, s: number) => f(t - s);
const Num: React.FC<{v: number; t0: number; t1: number; size: number; color?: string; suffix?: string; dec?: number}> = ({v, t0, t1, size, color = YEL, suffix = '', dec = 0}) => {
  const fr = useCurrentFrame(); const x = interpolate(fr, [t0, t1], [0, v], {...cl, easing: Easing.out(Easing.cubic)}); const land = fr >= t1 ? pop(fr - t1, 6, 1.25).s : 1;
  return <Txt size={size} color={color} style={{transform: `scale(${land})`, textShadow: '0 8px 0 rgba(0,0,0,.4), 0 14px 40px rgba(0,0,0,.6)'}}>{x.toFixed(dec)}{suffix}</Txt>;
};
const Slide: React.FC<{t0: number; from?: 'l' | 'r' | 'u' | 'd'; children: React.ReactNode; x: number; y: number; w?: number; rot?: number; out?: number}> = ({t0, from = 'l', children, x, y, w, rot = 0, out}) => {
  const fr = useCurrentFrame(); if (fr < t0 || (out !== undefined && fr >= out + 6)) return null; let e = interpolate(fr - t0, [0, 6], [1, 0], {...cl, easing: Easing.out(Easing.cubic)});
  if (out !== undefined) e += interpolate(fr, [out, out + 6], [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
  const o = from === 'l' ? [-1200 * e, 0] : from === 'r' ? [1200 * e, 0] : from === 'u' ? [0, -900 * e] : [0, 1200 * e];
  return <div style={{position: 'absolute', left: x, top: y, width: w, transform: `translate(${o[0]}px,${o[1]}px) rotate(${rot}deg)`}}>{children}</div>;
};
const Layers: Record<string, React.FC<{s: number; d: number}>> = {
  // A · hook: 25 bodies / 29 seconds → per-second rate → "LET'S DO THE MATHS"
  A: ({s}) => { const fr = useCurrentFrame(); const b = L(vt('25'), s), n = L(vt('29'), s), a = L(vt('ALMOST'), s), m = L(vt("LET'S"), s); const gone = fr >= m - 2; return <>
    <Tape y={150} rot={-3} t0={0} dir={1} text="VIGILANT CRIME · DRILL BAR BREAKDOWN · EP 2 ·" out={f(1.2)} />
    {!gone && fr >= b - 3 && <div style={{position: 'absolute', top: 330, width: W, textAlign: 'center'}}><Num v={25} t0={b - 3} t1={b + 6} size={330} /><Txt size={86} style={{marginTop: -20}}>BODIES 💀</Txt></div>}
    {!gone && fr >= n && <div style={{position: 'absolute', top: 830, width: W, textAlign: 'center', transform: `scale(${pop(fr - n, 6, 1.5).s})`}}><span style={{display: 'inline-block', padding: '6px 26px', background: MAG, transform: 'rotate(-2deg)'}}><Txt size={96} style={{textShadow: 'none'}}>IN 29 SECONDS ⏱️</Txt></span></div>}
    {!gone && fr >= a && <div style={{position: 'absolute', top: 1010, width: W, textAlign: 'center', transform: `scale(${pop(fr - a, 6, 1.5).s})`}}><Mono size={54} color="#fff">= 0.86 per second</Mono></div>}
    {fr >= m && <div style={{position: 'absolute', top: 560, width: W, textAlign: 'center', transform: `scale(${pop(fr - m, 6, 1.8).s}) rotate(-3deg)`}}><span style={{display: 'inline-block', padding: '10px 34px', background: YEL, boxShadow: '0 20px 50px rgba(0,0,0,.6)'}}><Txt size={130} color="#0a0a0a" style={{textShadow: 'none'}}>LET'S DO<br />THE MATHS 🧮</Txt></span></div>}
  </>; },
  // B · 14 splash: drops grid → "SPLA—" cut-offs → car-wash sign
  B: ({s}) => { const fr = useCurrentFrame(); const a = L(vt('14'), s), four = L(vt('FOUR'), s), mid = L(vt('SPLASHED'), s), bro = L(vt("BRO'S"), s), wash = L(vt('CAR'), s); const end1 = bro - 2; return <>
    {fr < end1 && <div style={{position: 'absolute', left: 115, top: 410, width: 850, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center'}}>
      {Array.from({length: 14}, (_, i) => { const t0 = a + i * 2.2; const cut = i >= 10 && fr >= four; const p = pop(fr - t0, 5, 2); return fr >= t0 && <div key={i} style={{width: 108, height: 108, borderRadius: 20, background: cut ? MAG : 'rgba(6,8,12,.85)', border: `3px solid ${cut ? '#fff' : YEL}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p.s}) rotate(${(rnd(i) - 0.5) * 10}deg)`, fontSize: 62}}>{cut ? <Txt size={30} style={{textShadow: 'none'}}>SPLA—</Txt> : '💦'}</div>; })}</div>}
    {fr < end1 && fr >= mid && <Stamp text="4 × MID-WORD" t0={mid} col={MAG} y={0.37} size={92} rot={-6} />}
    <Slide t0={bro} from="u" x={150} y={380} w={780}><div style={{background: '#0b63ce', border: '10px solid #fff', borderRadius: 30, padding: '26px 20px', textAlign: 'center', boxShadow: '0 30px 70px rgba(0,0,0,.65)'}}>
      <Txt size={50} style={{textShadow: 'none'}}>🫧 SJ's HAND 🫧</Txt><Txt size={150} color={YEL} style={{textShadow: '0 6px 0 #063a7a'}}>CAR WASH</Txt>
      <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 12}}><Mono size={34} color="#fff">SPLASH £5</Mono><Mono size={34} color="#fff">FULL VALET £14</Mono></div></div></Slide>
    {fr >= wash + 6 && <Chip x={540} y={900} t0={wash + 6} bg="#fff" size={44} rot={-3}><span style={{color: '#111'}}>⭐⭐⭐⭐⭐ "very thorough"</span></Chip>}
  </>; },
  // C · 5 whacked + whacked AND packed → meal-deal sticker
  C: ({s}) => { const fr = useCurrentFrame(); const one = L(vt('ONE', 21.5), s), two = L(vt('TWO', 23.5), s), meal = L(vt('MEAL'), s), vio = L(vt('VIOLENCE'), s); return <>
    {fr < two - 2 && <div style={{position: 'absolute', top: 420, width: W, display: 'flex', justifyContent: 'center', gap: 16}}>{[0, 1, 2, 3, 4].map((i) => fr >= 2 + i * 4 && <div key={i} style={{width: 150, height: 190, background: '#c69c6d', border: '5px solid #6b4a22', borderRadius: 10, transform: `scale(${pop(fr - 2 - i * 4, 5, 2).s}) rotate(${(rnd(i + 3) - 0.5) * 8}deg)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 30px rgba(0,0,0,.5)'}}>
      <div style={{width: '100%', height: 18, background: 'rgba(255,255,255,.55)'}} /><Txt size={34} color="#3a2408" style={{textShadow: 'none', marginTop: 16}}>WHACKED</Txt><Mono size={26} color="#3a2408">#{i + 1}</Mono></div>)}</div>}
    {fr >= one && fr < two - 2 && <div style={{position: 'absolute', top: 680, width: W, textAlign: 'center', transform: `scale(${pop(fr - one, 6, 1.6).s}) rotate(-2deg)`}}><span style={{display: 'inline-block', padding: '8px 26px', background: MAG}}><Txt size={72} style={{textShadow: 'none'}}>+1 WHACKED & PACKED 📦</Txt></span></div>}
    {fr >= two && <div style={{position: 'absolute', left: 240, top: 380, width: 600, height: 600, borderRadius: 300, background: '#ffe600', border: '14px solid #e4002b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(fr - two, 7, 2).s}) rotate(-12deg)`, boxShadow: '0 30px 70px rgba(0,0,0,.65)'}}>
      <Txt size={150} color="#e4002b" style={{textShadow: 'none'}}>2 FOR 1</Txt>{fr >= meal && <Txt size={84} color="#111" style={{textShadow: 'none'}}>MEAL DEAL</Txt>}{fr >= vio && <Txt size={58} color="#e4002b" style={{textShadow: 'none', marginTop: 6}}>VIOLENCE 🥪</Txt>}</div>}
  </>; },
  // D · 3 ching, 1 swim → leisure-centre timetable
  D: ({s}) => { const fr = useCurrentFrame(); const sw = L(vt('SENT'), s), lc = L(vt('NOW'), s);
    const rows: [string, string, number][] = [['15:00', 'CHING × 3', 2], ['15:30', 'SWIM (1 LANE) 🏊', sw], ['16:00', 'AQUA AEROBICS', lc + 4], ['16:30', 'SPLASH ZONE × 14 💦', lc + 8]]; return <>
    <Slide t0={0} from="d" x={90} y={400} w={900}><div style={{background: '#eaf6fb', borderRadius: 24, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,.65)'}}>
      <div style={{background: '#0a7fa8', padding: '18px 30px'}}><Txt size={54} style={{textShadow: 'none'}}>{fr >= lc ? '🏊 OFB LEISURE CENTRE' : "TODAY'S ACTIVITIES"}</Txt></div>
      {rows.map(([tm, lab, t0], i) => <div key={i} style={{display: 'flex', gap: 26, padding: '16px 30px', borderTop: '2px solid #c5e3ee', opacity: fr >= t0 ? 1 : 0.12, background: fr >= t0 && fr < t0 + 6 ? '#fff6a8' : 'transparent'}}><Mono size={44} color="#0a5f80">{tm}</Mono><Txt size={46} color="#12323d" style={{textShadow: 'none'}}>{lab}</Txt></div>)}</div></Slide>
  </>; },
  // E · which wing? quiz
  E: ({s}) => { const fr = useCurrentFrame(); const wq = L(vt('WHICH'), s), ck = L(vt('CHICKEN'), s), hs = L(vt('HOSPITAL'), s), st = L(vt('STILL'), s), hm = L(vt('HIMSELF'), s);
    const opt = (lab: string, t0: number, i: number, win: boolean) => fr >= t0 && <div style={{margin: '14px 0', padding: '20px 30px', borderRadius: 22, background: win && fr >= st ? '#1faa4f' : 'rgba(255,255,255,.96)', transform: `scale(${pop(fr - t0, 5, 1.5).s})`, display: 'flex', alignItems: 'center', gap: 20}}>
      <div style={{width: 58, height: 58, borderRadius: 29, background: win && fr >= st ? '#fff' : '#111', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Txt size={34} color={win && fr >= st ? '#1faa4f' : '#fff'} style={{textShadow: 'none'}}>{'ABC'[i]}</Txt></div>
      <Txt size={52} color={win && fr >= st ? '#fff' : '#111'} style={{textShadow: 'none'}}>{lab}</Txt></div>; return <>
    {fr < wq - 2 && <div style={{position: 'absolute', top: 420, width: W, textAlign: 'center'}}><Txt size={92}>2 × HEAD KICKED IN</Txt>
      {fr >= L(vt('ONE', 38), s) && <div style={{marginTop: 22, transform: `scale(${pop(fr - L(vt('ONE', 38), s), 6, 1.5).s})`}}><span style={{display: 'inline-block', padding: '6px 22px', background: 'rgba(6,8,12,.85)', border: `3px dashed ${YEL}`}}><Mono size={44} color={YEL}>+1 stuck on the wing (pending)</Mono></span></div>}</div>}
    {fr >= wq && <div style={{position: 'absolute', left: 110, top: 380, width: 860, padding: '26px 30px', borderRadius: 30, background: 'rgba(60,20,120,.94)', border: '5px solid #fff', boxShadow: '0 30px 70px rgba(0,0,0,.65)', transform: `scale(${pop(fr - wq, 6, 1.3).s})`}}>
      <Txt size={70} style={{textAlign: 'center', marginBottom: 10}}>WHICH WING? 🤔</Txt>{opt('🍗 CHICKEN WING', ck, 0, false)}{opt('🏥 HOSPITAL WING', hs, 1, false)}{opt('🔒 B-WING (HIS OWN)', st, 2, true)}</div>}
    {fr >= hm && <Stamp text="FINAL ANSWER ✅" t0={hm} col="#1faa4f" y={0.57} size={76} rot={-5} />}
  </>; },
  // F · receipt total → football squad → engineer's face → not on Spotify
  F: ({s}) => { const fr = useCurrentFrame(); const tot = L(vt('25', 45), s), fb = L(vt('FOOTBALL'), s), sub = L(vt('SUBS'), s), eng = L(vt("ENGINEER'S"), s), sp = L(vt('NOT', 51), s);
    const lines: [string, number][] = [['SPLASH', 14], ['WHACKED (+PACKED)', 5], ['CHING', 3], ['SWIM', 1], ['WING', 2]]; return <>
    {fr < fb - 2 && <Slide t0={0} from="u" x={190} y={370} w={700} rot={-2}><div style={{background: '#fbfaf5', padding: '26px 34px 34px', boxShadow: '0 30px 70px rgba(0,0,0,.65)'}}>
      <Mono size={34} style={{textAlign: 'center'}}>*** OPP-MART ***</Mono><Mono size={22} color="#777" style={{textAlign: 'center'}}>PLUGGED IN BRANCH · TILL 01</Mono>
      {lines.map(([k, v], i) => fr >= 3 + i * 3 && <div key={i} style={{display: 'flex', justifyContent: 'space-between', marginTop: 8}}><Mono size={36}>{k}</Mono><Mono size={36}>{v}</Mono></div>)}
      <div style={{borderTop: '3px dashed #333', marginTop: 14, paddingTop: 10, display: 'flex', justifyContent: 'space-between', opacity: fr >= tot - 4 ? 1 : 0}}><Mono size={56}>TOTAL</Mono><Mono size={56} color={MAG}>25</Mono></div>
      <Mono size={22} color="#777" style={{textAlign: 'center', marginTop: 10}}>NO REFUNDS · NO NAMES</Mono></div></Slide>}
    {fr >= fb && fr < eng - 2 && <div style={{position: 'absolute', left: 140, top: 365, width: 800, height: 880, borderRadius: 26, background: 'linear-gradient(180deg,#1f8a3b,#176e2e)', border: '6px solid #fff', boxShadow: '0 30px 70px rgba(0,0,0,.65)', transform: `scale(${pop(fr - fb, 6, 1.3).s})`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 440, height: 5, background: 'rgba(255,255,255,.7)'}} /><div style={{position: 'absolute', left: 300, top: 340, width: 200, height: 200, borderRadius: 100, border: '5px solid rgba(255,255,255,.7)'}} />
      {[[400, 60], [150, 190], [320, 190], [480, 190], [650, 190], [220, 370], [400, 350], [580, 370], [200, 560], [400, 590], [600, 560]].map(([x, y], i) => fr >= fb + 2 + i && <div key={i} style={{position: 'absolute', left: x - 34, top: y, width: 68, height: 68, borderRadius: 34, background: YEL, border: '4px solid #111', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(fr - fb - 2 - i, 4, 2).s})`}}><Txt size={30} color="#111" style={{textShadow: 'none'}}>{i + 1}</Txt></div>)}
      {fr >= sub && <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 16px', background: 'rgba(0,0,0,.6)'}}><Mono size={26} color="#fff">SUBS BENCH</Mono><div style={{display: 'flex', gap: 8, marginTop: 6}}>{Array.from({length: 14}, (_, i) => fr >= sub + i && <div key={i} style={{width: 46, height: 46, borderRadius: 23, background: MAG, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Txt size={20} style={{textShadow: 'none'}}>{i + 12}</Txt></div>)}</div></div>}</div>}
    {fr >= eng && fr < sp && <Slide t0={eng} from="l" x={60} y={390} rot={-3}><div style={{padding: '10px 26px', background: YEL, boxShadow: '0 16px 40px rgba(0,0,0,.55)'}}><Txt size={64} color="#0a0a0a" style={{textShadow: 'none'}}>FUMEZ RIGHT NOW 😐</Txt></div></Slide>}
    {fr >= sp && <div style={{position: 'absolute', left: 150, top: 380, width: 780, padding: '26px 30px', borderRadius: 26, background: '#121212', border: '3px solid #333', boxShadow: '0 30px 70px rgba(0,0,0,.7)', transform: `scale(${pop(fr - sp, 6, 1.5).s})`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22}}><div style={{width: 110, height: 110, borderRadius: 12, background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64}}>🎧</div><div><Txt size={44} style={{textShadow: 'none'}}>Plugged In (25 Bodies)</Txt><Mono size={28} color="#aaa">upload status</Mono></div></div>
      <div style={{marginTop: 18, padding: '12px 18px', borderRadius: 12, background: MAG}}><Txt size={44} style={{textShadow: 'none'}}>⛔ NOT GOING ON SPOTIFY</Txt></div></div>}
  </>; },
  // G · stat row → who to ring → follow for part 2
  G: ({s}) => { const fr = useCurrentFrame(); const z = L(vt('ZERO'), s), o = L(vt('ONE', 54.8), s), fz = L(vt('FUMEZ'), s), pol = L(vt('POLICE'), s), gu = L(vt('GUINNESS'), s), fo = L(vt('FOLLOW'), s), mo = L(vt('MOON'), s);
    const stat = (n: string, lab: string, t0: number, col: string) => fr >= t0 && <div style={{flex: 1, textAlign: 'center', transform: `scale(${pop(fr - t0, 6, 1.8).s})`}}><Txt size={170} color={col}>{n}</Txt><Txt size={42}>{lab}</Txt></div>;
    const tap = fr >= fo + 14; return <>
    {fr < fz - 2 && <div style={{position: 'absolute', left: 40, right: 40, top: 420, display: 'flex'}}>{stat('25', 'OPPS', 2, YEL)}{stat('0', 'NAMES', z, '#fff')}{stat('1', 'BALACLAVA 🥷', o, MAG)}</div>}
    {fr >= fz && fr < fo - 2 && <div style={{position: 'absolute', left: 190, top: 370, width: 700, padding: '30px 30px 40px', borderRadius: 60, background: '#0c0c0e', border: '6px solid #2c2c2e', boxShadow: '0 30px 80px rgba(0,0,0,.75)', transform: `scale(${pop(fr - fz, 6, 1.3).s})`}}>
      <Mono size={30} color="#888" style={{textAlign: 'center'}}>FUMEZ · choose a contact</Mono>
      {fr >= pol && <div style={{marginTop: 20, padding: '22px 26px', borderRadius: 26, background: '#1c1c1e', display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${pop(fr - pol, 5, 1.5).s})`}}><div style={{fontSize: 70}}>🚔</div><div><Txt size={54} style={{textShadow: 'none'}}>POLICE</Txt><Mono size={28} color="#888">999</Mono></div><div style={{marginLeft: 'auto', width: 84, height: 84, borderRadius: 42, background: '#34c759', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44}}>📞</div></div>}
      {fr >= gu && <div style={{marginTop: 16, padding: '22px 26px', borderRadius: 26, background: '#1c1c1e', display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${pop(fr - gu, 5, 1.5).s})`, border: `4px solid ${YEL}`}}><div style={{fontSize: 70}}>🏆</div><div><Txt size={48} style={{textShadow: 'none'}}>WORLD RECORDS</Txt><Mono size={28} color="#888">most claims / 29 sec</Mono></div><div style={{marginLeft: 'auto', width: 84, height: 84, borderRadius: 42, background: '#34c759', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44}}>📞</div></div>}</div>}
    {fr >= fo && <>
      <div style={{position: 'absolute', top: 390, width: W, textAlign: 'center', transform: `scale(${pop(fr - fo, 6, 1.5).s})`}}><Txt size={76}>PART 2 →</Txt>{fr >= mo - 16 && <Txt size={64} color={YEL} style={{marginTop: 10}}>HE DID THE MOON LANDING 🌙🚀</Txt>}</div>
      <div style={{position: 'absolute', left: 250, top: 640, width: 580, height: 130, borderRadius: 65, background: tap ? '#2a2a2a' : MAG, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,.6)', transform: `scale(${tap ? pop(fr - fo - 14, 5, 1.3).s : 1 + 0.04 * Math.sin(fr / 4)})`}}><Txt size={60}>{tap ? '✓ FOLLOWING' : '+ FOLLOW'}</Txt></div>
      <div style={{position: 'absolute', left: interpolate(fr, [fo, fo + 12], [920, 660], cl), top: interpolate(fr, [fo, fo + 12], [1150, 740], cl), fontSize: 140, transform: `scale(${fr >= fo + 12 && fr < fo + 16 ? 0.85 : 1})`}}>👆</div>
      <Tape y={900} rot={-5} t0={fo + 20} dir={1} text="VIGILANT CRIME · DRILL BAR BREAKDOWN · EP 2 ·" /></>}
  </>; },
};

let MVI = 0;
const PLAN = TLS.map((x) => { if (x.kind === 'clip') return {x, mv: MVI++, subs: [] as {src: number; rate: number; t0: number; d: number; mv: number}[]};
  const S = SUBS[x.id]; const d = (x.t1 - x.t0) / S.length; return {x, mv: 0, subs: S.map(([src, rate], i) => ({src, rate, t0: i * d, d, mv: MVI++}))}; });
const CUTS = PLAN.flatMap((p) => p.x.kind === 'clip' ? [p.x.t0] : p.subs.map((sb) => p.x.t0 + sb.t0)).filter((t) => t > 0).map(f);

export const SjTally: React.FC = () => {
  const ready = useFontsReady('sj1'); const fr = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{background: '#000'}} />;
  const t = fr / FPS; const lastEv = EV.reduce((m, e) => (e[0] <= t ? Math.max(m, e[0]) : m), -9); const age = t - lastEv;
  const punch = age < 0.2 ? 1 + 0.035 * (1 - age / 0.2) : 1; const cut = CUTS.includes(fr);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${punch})`}}>
        {PLAN.map((p, i) => { const {x} = p; const from = f(x.t0), dur = (i < PLAN.length - 1 ? f(PLAN[i + 1].x.t0) : SJ_FRAMES) - from; const Lay = Layers[x.id];
          return <Sequence key={i} from={from} durationInFrames={dur}>
            {x.kind === 'clip' ? <TapeClip x={x} mv={p.mv} /> : <>
              {p.subs.map((sb, k) => <Sequence key={k} from={f(sb.t0)} durationInFrames={k < p.subs.length - 1 ? f(p.subs[k + 1].t0) - f(sb.t0) : dur - f(sb.t0)}><Foot src={sb.src} rate={sb.rate} mv={sb.mv} d={sb.d} dim={0.02} grade="contrast(1.12) saturate(1.0) brightness(.98)" /></Sequence>)}
              <Lay s={x.t0} d={x.t1 - x.t0} /></>}
          </Sequence>; })}
      </AbsoluteFill>
      <Grain />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 75% at 50% 48%, transparent 55%, rgba(0,0,0,.55) 100%)', pointerEvents: 'none'}} />
      {t > 1.3 && !TLS.some((x) => x.kind === 'clip' && t >= x.t0 && t < x.t1) && <div style={{position: 'absolute', left: 36, top: 150, display: 'flex', gap: 10}}>
        <div style={{padding: '8px 16px', background: YEL}}><Txt size={28} color="#0a0a0a" style={{textShadow: 'none', letterSpacing: 2}}>VIGILANT CRIME</Txt></div>
        <div style={{padding: '8px 16px', background: 'rgba(6,8,12,.85)'}}><Txt size={28} style={{textShadow: 'none', letterSpacing: 2}}>DRILL BAR BREAKDOWN · EP 2</Txt></div></div>}
      <Tally />
      <Caps />
      <div style={{position: 'absolute', left: 44, right: 44, bottom: 96, height: 8, borderRadius: 4, background: 'rgba(255,255,255,.18)'}}><div style={{width: `${(fr / SJ_FRAMES) * 100}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${YEL}, ${MAG})`}} /></div>
      <div style={{position: 'absolute', bottom: 44, width: W, textAlign: 'center', fontFamily: MONO, fontSize: 22, color: 'rgba(255,255,255,.72)'}}>OFB SJ – Plugged In w/ Fumez · lyrics are performance, not evidence</div>
      {cut && <AbsoluteFill style={{background: '#fff', opacity: 0.28}} />}
      <Audio src={staticFile('mix_sj1.wav')} />
    </AbsoluteFill>
  );
};
