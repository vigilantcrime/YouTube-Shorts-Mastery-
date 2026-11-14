/* VIGILANT CRIME · "BARS ON PAUSE" format, VC-002: Yanko, "Life of a Rider".
   The real song plays bar by bar with its music video. Each bar ends in a tape-stop PAUSE: the frame freezes, goes VHS-grey,
   and the voiceover breaks the bar down with a slang decoder, red-pen lyric sheet and stamps. Then ▶ resumes the next bar.
   Lyrics are transcribed from the clip's own audio; only the bars under discussion are shown. */
import React from 'react';
import {AbsoluteFill, Audio, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import data from './bars1.json';
import {W, H} from './kit';
import {cl, pop, rnd, useFontsReady} from './kit3d';
import {YEL, MAG, MONO, Txt, Mono, Stamp, Chip, Paper, Grain, Tape} from './VigilantCase';

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
type TL = {kind: 'bar' | 'pause' | 'end'; id?: string; t0: number; t1: number; src: number; vo?: number[]};
const TLS = data.tl as TL[];
export const BARS_FRAMES = Math.ceil(data.total * FPS);
const VOW = data.vo as [string, number][];
const vt = (w: string, after = 0) => VOW.find(([x, t]) => x === w && t >= after - 0.05)?.[1] ?? after;
const SRC = staticFile('vc/yanko_wide.mp4');

/* 9:16 window per source second (subject tracking keyframes, from the contact sheet). */
const KX: [number, number][] = [[0, -714], [2.5, -750], [5.5, -526], [7.5, -293], [9.5, -777], [10.2, -777], [28.4, -365], [30.0, -768], [31.4, -714], [32.0, -302], [33.5, -706], [35.0, -876],
  [36.55, -1480], [38.1, -1480], [38.6, -768], [42.2, -858], [43.6, -356], [44.8, -258], [48.5, -840], [50.0, -830], [51.8, -800], [55.2, -813], [56.6, -768], [58.0, -446], [58.4, -446],
  [65.2, -660], [66.4, -616], [80.5, -80], [82.5, -777], [84.5, -992], [88, -900]];
const xAt = (t: number) => { for (let i = 0; i < KX.length - 1; i++) { const [a, xa] = KX[i], [b, xb] = KX[i + 1]; if (t >= a && t <= b) return xa + (xb - xa) * ((t - a) / (b - a)); } return t < KX[0][0] ? KX[0][1] : KX[KX.length - 1][1]; };

/* Bars: what is sung (transcribed), with source timestamps per word. Key words get tape. */
const LYR: Record<string, [string, number][]> = {
  nursery: [['…STAB', 36.68], ['MAN', 36.92], ['DOWN', 37.16], ['IN', 37.36], ['FRONT', 37.48], ['OF A', 37.68], ['NURSERY', 37.9]],
  intro: [['LET', 0.0], ['ME', 0.16], ['TELL', 0.4], ['YOU', 0.52], ['ABOUT', 0.64], ['THE', 0.8], ['LIFE', 0.92], ['OF A', 1.12], ['RIDER', 1.36], ["'CAUSE", 1.92], ['THIS', 2.16], ['IS', 2.32], ['THE', 2.44], ['LIFE', 2.56], ['THAT', 2.72], ['I', 2.84], ['LIVE', 2.96]],
  intro2: [['EVERY', 5.2], ['TIME', 5.44], ['I', 5.64], ['STEP', 5.8], ['UP', 6.04], ['I', 6.6], ['KNOW', 6.72], ['THAT', 6.88], ['I', 7.0], ['COULD', 7.16], ['END', 7.36], ['UP', 7.52], ['AS A', 7.72], ['LIGHTS-OFF', 8.0], ['BUT', 8.52], ['THIS', 8.76], ['IS', 8.92], ['THE', 9.04], ['LIFE', 9.2], ['OF A', 9.4], ['RIDER', 9.64]],
  pm: [['WE', 28.4], ['HAD', 28.52], ['TO', 28.64], ['SLIDE', 28.76], ['AT', 29.04], ['3PM', 29.24], ["'CAUSE", 29.6], ['ALL', 29.84], ['THE', 30.1], ['PAGANS', 30.28], ['GO', 30.96], ['HOME', 31.12], ['EARLY', 31.36]],
  tracky: [["I'M", 31.72], ['GONNA', 31.88], ['GLIDE', 32.08], ['IN A', 32.36], ['BANGED-OUT', 32.56], ['TRACKY', 33.0], ["'CAUSE", 33.48], ['I', 33.68], ["DON'T", 33.76], ['WANNA', 33.96], ['RUIN', 34.2], ['THE', 34.48], ['BURBERRY', 34.6]],
  gloves: [['I', 42.0], ["AIN'T TRYNA", 42.12], ['LEAVE', 42.56], ['NO', 42.76], ['PRINTS', 42.92], ["I'M", 43.24], ['WEARING', 43.4], ['GLOVES', 43.76], ["IT'S", 44.12], ['VERY', 44.32], ['IMPORTANT', 44.6]],
  chef: [['RUN', 48.32], ['UP', 48.48], ['IN THE', 48.6], ['KITCHEN', 48.84], ['RAISING', 49.2], ['HELL', 49.56], ['WITH A', 49.76], ['RAMSAY…', 50.0], ['CHEF', 50.84], ['LIKE', 51.08], ['GORDON', 51.32]],
  feds: [['THE', 54.92], ['FEDS', 55.04], ['KEEP', 55.28], ['SAYING', 55.44], ["I'M A", 55.68], ['RISK', 55.8], ['TO THE', 56.12], ['PUBLIC', 56.32], ["I'M NOT", 56.6], ['GONNA', 56.92], ['LIE', 57.12], ["DON'T", 57.36], ['DISAGREE', 57.56]],
  hygiene: [["THAT'S", 65.04], ['VERY', 65.24], ['BAD', 65.44], ['HYGIENE', 65.68]],
};
const KEY = new Set(['NURSERY', 'RIDER', 'LIGHTS-OFF', '3PM', 'PAGANS', 'TRACKY', 'BURBERRY', 'PRINTS', 'GLOVES', 'KITCHEN', 'GORDON', 'RAMSAY…', 'FEDS', 'RISK', 'DISAGREE', 'HYGIENE', '…STAB']);
const RED = new Set(['…STAB', 'RISK', 'DISAGREE', 'LIGHTS-OFF']);
const BAR_IDS = TLS.filter((x) => x.kind === 'bar').map((x) => x.id!);

/* ------------------------------------------------------------------ */
const Footage: React.FC<{src: number; mv: number; freeze?: boolean; grade?: string; d: number}> = ({src, mv, freeze, grade, d}) => {
  const fr = useCurrentFrame(); const t = freeze ? src : src + fr / FPS; const x = xAt(t);
  const p = interpolate(fr, [0, f(d)], [0, 1], {...cl, easing: Easing.inOut(Easing.sin)});
  const mvs = [
    {s: 1.1 + 0.08 * p, tx: 0, ty: 0, r: 0},                 // slow creep
    {s: 1.16, tx: 0, ty: 120 - 200 * p, r: 0},                // rise
    {s: 1.2, tx: 80 - 160 * p, ty: 0, r: -2 + 4 * p},         // arc
    {s: 1.28 - 0.14 * p, tx: 0, ty: 0, r: 0},                 // breathe out
    {s: 1.14, tx: Math.sin(fr / 9) * 16, ty: Math.cos(fr / 11) * 12, r: Math.sin(fr / 13) * 0.8},  // handheld
  ][mv % 5];
  const v = <OffthreadVideo src={SRC} muted startFrom={f(src)} style={{position: 'absolute', left: x, top: 0, width: 2560, height: 1920}} />;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <AbsoluteFill style={{transform: `translate(${mvs.tx}px,${mvs.ty}px) rotate(${mvs.r}deg) scale(${mvs.s})`, filter: grade ?? 'saturate(.8) contrast(1.12)'}}>
        {freeze ? <Freeze frame={0}>{v}</Freeze> : v}
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,10,16,.45) 0%, rgba(4,10,16,.05) 25%, rgba(4,10,16,.1) 55%, rgba(4,10,16,.7) 100%)'}} />
    </AbsoluteFill>
  );
};

/** Now-playing HUD with live EQ. */
const NowPlaying: React.FC<{n: number}> = ({n}) => {
  const fr = useCurrentFrame();
  return <div style={{position: 'absolute', left: 44, top: 238, display: 'flex', alignItems: 'center', gap: 16, padding: '10px 18px', background: 'rgba(0,0,0,.6)', borderRadius: 12, borderLeft: `8px solid ${YEL}`}}>
    <Txt size={34} color={YEL}>▶</Txt>
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 4, height: 34}}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{width: 7, height: 8 + 26 * Math.abs(Math.sin(fr * (0.5 + i * 0.13) + i)), background: YEL}} />)}</div>
    <Mono size={26} color="#fff">LIFE OF A RIDER · YANKO</Mono>
    <div style={{marginLeft: 8, padding: '2px 10px', background: MAG}}><Mono size={24} color="#fff">BAR {String(n).padStart(2, '0')}</Mono></div>
  </div>;
};

/** Karaoke bar: words arrive as they are sung; the current key word is taped. */
const Karaoke: React.FC<{id: string; src: number}> = ({id, src}) => {
  const fr = useCurrentFrame(); const t = src + fr / FPS; const ws = LYR[id] ?? [];
  const cur = ws.reduce((k, w, i) => (w[1] <= t + 0.03 ? i : k), -1);
  return <div style={{position: 'absolute', left: 60, right: 60, top: 1150, textAlign: 'center', lineHeight: 1.25}}>
    {ws.map(([w, wt], i) => { if (wt > t + 0.03 || i < Math.floor(Math.max(0, cur - 1) / 7) * 7) return null; const on = i === cur; const key = KEY.has(w); const col = RED.has(w) ? MAG : YEL;
      const sc = on ? interpolate(t - wt, [0, 0.12], [1.25, 1], cl) : 1;
      return <span key={i} style={{display: 'inline-block', margin: '0 9px 10px', fontFamily: 'HeroBlack', fontSize: 62, transform: `scale(${sc}) rotate(${key && on ? -2 : 0}deg)`,
        color: key ? (col === YEL ? '#0a0a0a' : '#fff') : on ? '#fff' : 'rgba(255,255,255,.72)', background: key ? col : 'transparent', padding: key ? '0 12px' : 0,
        textShadow: key ? 'none' : '0 3px 0 rgba(0,0,0,.6), 2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000'}}>{w}</span>; })}
  </div>;
};

/** VO captions for the breakdowns (1–3 word chunks, key word taped). */
const VKEY = new Set(['NITTY', 'LINE', 'YANKO', 'CONFESSION', 'RIDER', 'SCHEDULE', 'BURBERRY', 'NAN', 'BUS', 'EVIDENCE', 'QUIET', 'LOUD', 'LYRICS', 'DANGEROUS', 'FUNNIEST', 'COMMENT', 'SUBSCRIBE', 'VIGILANT', 'CRIME']);
const CH = (() => { const out: {t: number; ws: string[]}[] = []; VOW.forEach(([w, t], i) => { const l = out[out.length - 1]; const gap = i ? t - VOW[i - 1][1] : 9;
  if (l && l.ws.length < 3 && gap < 0.4 && (w.length <= 4 || l.ws.length < 2) && !VKEY.has(l.ws[l.ws.length - 1])) l.ws.push(w); else out.push({t, ws: [w]}); }); return out; })();
const VOCaps: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; let k = -1; CH.forEach((c, i) => { if (c.t <= t + 0.02) k = i; }); if (k < 0) return null; const c = CH[k]; if (t - c.t > 1.1) return null;
  const inPause = TLS.some((x) => x.kind !== 'bar' && t >= x.t0 && t < x.t1); if (!inPause) return null;
  return <div style={{position: 'absolute', top: H * 0.69, width: W, textAlign: 'center', transform: 'translateY(-50%)'}}>
    {c.ws.map((w, i) => { const key = VKEY.has(w); return <span key={i} style={{display: 'inline-block', margin: '0 8px', fontFamily: 'HeroBlack', fontSize: 66, color: key ? '#0a0a0a' : '#fff', background: key ? YEL : 'transparent', padding: key ? '2px 14px' : 0, transform: key ? 'rotate(-2deg)' : 'none',
      textShadow: key ? 'none' : '0 3px 0 rgba(0,0,0,.65), 2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000'}}>{w}</span>; })}
  </div>;
};

/* ------------------------------------------------------------------ */
/* PAUSE kit                                                            */
/* ------------------------------------------------------------------ */
const PauseFX: React.FC<{n: number; d: number; src: number}> = ({n, d, src}) => {
  const fr = useCurrentFrame(); const D = f(d);
  const stop = interpolate(fr, [0, 11], [1, 0], cl);   // tape-stop phase
  const big = interpolate(fr, [0, 3, 10, 14], [0, 1, 1, 0], cl);
  const resume = fr >= D - 5;
  return <>
    <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.22) 0 2px, transparent 2px 5px)', pointerEvents: 'none'}} />
    {stop > 0 && <div style={{position: 'absolute', left: 0, top: 500 + (1 - stop) * 900, width: W, height: 70, background: 'rgba(255,255,255,.18)', filter: 'blur(4px)'}} />}
    {big > 0 && <div style={{position: 'absolute', top: 700, width: W, textAlign: 'center', opacity: big, transform: `scale(${0.8 + 0.3 * big})`}}><Txt size={260}>⏸</Txt></div>}
    <div style={{position: 'absolute', left: 44, top: 238, display: 'flex', gap: 14, alignItems: 'center', padding: '10px 18px', background: '#fff', borderRadius: 12, opacity: fr > 8 ? 1 : 0}}>
      <Txt size={34} color="#111" style={{textShadow: 'none'}}>⏸ PAUSED</Txt><Mono size={26} color="#444">BAR {String(n).padStart(2, '0')} · {String(Math.floor(src / 60)).padStart(2, '0')}:{String(Math.floor(src % 60)).padStart(2, '0')}</Mono></div>
    {resume && <div style={{position: 'absolute', top: 760, width: W, textAlign: 'center', opacity: interpolate(fr, [D - 5, D - 1], [1, 0.2], cl)}}><Txt size={200} color={YEL}>▶</Txt></div>}
  </>;
};
/** Slang decoder card. */
const Decode: React.FC<{word: string; means: string; t0: number; y: number; x?: number; rot?: number}> = ({word, means, t0, y, x = 70, rot = -2}) => {
  const fr = useCurrentFrame(); if (fr < t0) return null; const e = interpolate(fr - t0, [0, 6], [1, 0], {...cl, easing: Easing.out(Easing.cubic)});
  return <div style={{position: 'absolute', left: x, top: y, width: 940, transform: `translateX(${e * -1100}px) rotate(${rot}deg)`, display: 'flex', boxShadow: '0 20px 50px rgba(0,0,0,.6)'}}>
    <div style={{background: YEL, padding: '18px 22px', display: 'flex', alignItems: 'center'}}><Txt size={50} color="#0a0a0a" style={{textShadow: 'none'}}>{word}</Txt></div>
    <div style={{flex: 1, background: '#111', padding: '14px 22px'}}><Mono size={22} color={YEL}>SLANG DECODER</Mono><Mono size={34} color="#fff">{means}</Mono></div>
  </div>;
};
/** Red-pen lyric sheet: the bar as text, one phrase underlined, a margin note. */
const Sheet: React.FC<{text: string; mark: string; note: string; t0: number; tm: number; y: number}> = ({text, mark, note, t0, tm, y}) => {
  const fr = useCurrentFrame(); if (fr < t0) return null; const inn = interpolate(fr - t0, [0, 6], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const u = interpolate(fr, [tm, tm + 8], [0, 1], cl); const i0 = text.indexOf(mark);
  return <div style={{position: 'absolute', left: 80, top: y, width: 920, padding: '34px 40px', background: '#f4f1e8', backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 62px, rgba(60,110,200,.25) 62px 64px)',
    transform: `translateY(${(1 - inn) * 200}px) rotate(1.5deg)`, opacity: inn, boxShadow: '0 30px 70px rgba(0,0,0,.6)', borderLeft: '6px solid rgba(220,40,40,.5)'}}>
    <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 44, lineHeight: '64px', color: '#151515'}}>
      {text.slice(0, i0)}<span style={{position: 'relative'}}>{mark}<svg style={{position: 'absolute', left: 0, bottom: -10, width: '100%', height: 20, overflow: 'visible'}} preserveAspectRatio="none" viewBox="0 0 100 20">
        <path d="M0 12 Q 25 4 50 12 T 100 10" stroke={MAG} strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} vectorEffect="non-scaling-stroke" /></svg></span>{text.slice(i0 + mark.length)}
    </div>
    {u > 0.6 && <div style={{position: 'absolute', right: -10, bottom: -54, transform: `rotate(-6deg) scale(${pop(fr - tm - 5, 5, 1.5).s})`, fontFamily: '"Comic Sans MS", "DejaVu Sans", cursive', fontWeight: 700, fontSize: 40, color: MAG}}>{note}</div>}
  </div>;
};

/* Per-pause breakdown overlays (absolute times → local frames via s). */
type PC = React.FC<{s: number; d: number}>;
const L = (t: number, s: number) => f(t - s);
const PAUSES: PC[] = [
  // P1 · nursery → "Do not mistake this man for a nitty. That's the line."
  ({s}) => <>
    <Sheet text={'"…stab man down in front of a nursery"'} mark="in front of a nursery" note="next to KIDS?! 😳" t0={10} tm={L(vt('MISTAKE'), s)} y={330} />
    <Decode word="NITTY" means="UK slang: a crackhead" t0={L(vt('NITTY'), s) - 4} y={720} />
    <Tape y={980} rot={-5} t0={L(vt('LINE'), s)} dir={-1} col={MAG} text="THAT'S THE LINE ·" />
  </>,
  // P2 · title bar → "This is Yanko and his track Life of a Rider plays like a confession"
  ({s}) => { const fr = useCurrentFrame(); const y0 = L(vt('YANKO'), s); return <>
    {fr >= y0 && <div style={{position: 'absolute', left: 80, top: 340, width: 920, padding: 30, background: 'rgba(10,10,12,.88)', borderRadius: 20, border: `4px solid ${YEL}`, transform: `scale(${pop(fr - y0, 6, 1.4).s})`}}>
      <Mono size={26} color="#aaa">ARTIST FILE</Mono><Txt size={90} color={YEL}>YANKO</Txt>
      <Mono size={32} color="#fff">UK DRILL · NEWHAM, EAST LONDON</Mono><Mono size={32} color="#fff">TRACK: "LIFE OF A RIDER" (2023)</Mono></div>}
    <Stamp text="A CONFESSION?" t0={L(vt('CONFESSION'), s)} col={MAG} y={0.42} size={96} rot={-7} />
  </>; },
  // P3 · 3pm → "He's got a schedule"
  ({s}) => <>
    <Decode word="SLIDE" means="pull up on rivals" t0={6} y={330} />
    <Decode word="PAGANS" means="fake friends / enemies" t0={11} y={500} rot={2} />
    <Stamp text="15:00 SHARP 🕒" t0={L(vt('SCHEDULE'), s)} col={YEL} y={0.4} size={90} rot={-5} />
  </>,
  // P4 · tracky/Burberry → "In a Burberry scarf wrapped round his head like your Nan at the bus stop"
  ({s}) => { const fr = useCurrentFrame(); const n = L(vt('NAN'), s); const on = fr >= n; return <>
    <Decode word="BANGED-OUT" means="old, battered, worn-out" t0={6} y={330} />
    <div style={{position: 'absolute', left: 120, top: 560, width: 840, padding: '26px 34px', background: '#f5f5f7', borderRadius: 28, boxShadow: '0 20px 50px rgba(0,0,0,.5)', transform: `translateY(${interpolate(fr, [L(vt('BURBERRY'), s), L(vt('BURBERRY'), s) + 6], [900, 0], {...cl, easing: Easing.out(Easing.cubic)})}px)`}}>
      {[['🛡️ PROTECT THE BURBERRY', true], ['👵 NAN MODE', on]].map(([lab, v], i) => <div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: i ? '2px solid #ddd' : 'none'}}>
        <Txt size={44} color="#111" style={{textShadow: 'none'}}>{lab as string}</Txt>
        <div style={{width: 120, height: 66, borderRadius: 33, background: v ? '#34c759' : '#ccc', position: 'relative'}}><div style={{position: 'absolute', top: 5, left: v ? 59 : 5, width: 56, height: 56, borderRadius: 28, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.3)'}} /></div></div>)}
    </div>
  </>; },
  // P5 · gloves → "He's careful with evidence too"
  ({s}) => { const fr = useCurrentFrame(); const items = ['GLOVES ON 🧤', 'NO PRINTS', 'BURBERRY SAFE']; return <>
    <Paper x={110} y={330} w={860} t0={4} rot={-2}>
      <Mono size={30} color="#7a7465">FORENSICS CHECKLIST</Mono>
      {items.map((it, i) => <Mono key={i} size={50} style={{marginTop: 12}}>{fr >= 10 + i * 7 ? <span style={{color: '#1a9f4a'}}>☑</span> : '☐'} {it}</Mono>)}
    </Paper>
    <Stamp text="EVIDENCE-AWARE" t0={L(vt('EVIDENCE'), s)} col={MAG} y={0.47} size={80} rot={6} />
  </>; },
  // P6 · chef → Gordon card, then "Then he says the quiet part out loud"
  ({s}) => { const fr = useCurrentFrame(); const q = L(vt('QUIET'), s), lo = L(vt('LOUD'), s); return <>
    <Decode word="KITCHEN" means="slang: where the 'work' gets cooked" t0={6} y={330} />
    <div style={{position: 'absolute', left: 90, top: 540, width: 900, padding: '24px 30px', background: '#fff', borderRadius: 30, boxShadow: '0 20px 50px rgba(0,0,0,.5)', transform: `scale(${pop(fr - 14, 6, 1.5).s})`, opacity: fr >= 14 ? 1 : 0}}>
      <Mono size={26} color="#888">👨‍🍳 a famous chef has entered the chat</Mono><Txt size={52} color="#111" style={{textShadow: 'none', marginTop: 8}}>"THIS KITCHEN IS SHUT DOWN."</Txt></div>
    {fr >= lo && <Chip x={540} y={900} t0={lo} bg={MAG} size={56}>🔊 OUT LOUD</Chip>}
    {fr >= q && fr < lo && <Chip x={540} y={900} t0={q} bg="#333" size={56}>🤫 QUIET PART…</Chip>}
  </>; },
  // P7 · feds → no VO: he agrees
  ({d}) => { const fr = useCurrentFrame(); return <>
    <div style={{position: 'absolute', top: 380, width: W, textAlign: 'center', transform: `scale(${pop(fr - 8, 6, 1.6).s})`, opacity: fr >= 8 ? 1 : 0}}><Txt size={120}>HE…</Txt><Txt size={150} color={YEL}>AGREES 💀</Txt></div>
    <Paper x={140} y={860} w={800} t0={22} rot={-2}><Mono size={30} color="#7a7465">RISK TO THE PUBLIC</Mono><Mono size={44}>☑ CONFIRMED BY ARTIST</Mono></Paper>
  </>; },
  // P8 · hygiene → "These are lyrics, not evidence"
  ({s}) => { const fr = useCurrentFrame(); const ly = L(vt('LYRICS'), s); return <>
    <Decode word="HYGIENE" means="…in a kitchen? Gordon's fuming." t0={4} y={330} />
    {fr >= ly && <div style={{position: 'absolute', top: 560, width: W, textAlign: 'center'}}><Mono size={70} color="#fff">THESE ARE</Mono><Txt size={160} color={YEL} style={{transform: `scale(${pop(fr - ly, 5, 1.6).s})`}}>LYRICS</Txt></div>}
    <Stamp text="NOT EVIDENCE" t0={L(vt('EVIDENCE', 51), s)} col={MAG} y={0.47} size={100} rot={-6} />
  </>; },
];

/** End: verdict poll over the song's outro + follow. */
const End: React.FC<{s: number; d: number}> = ({s, d}) => {
  const fr = useCurrentFrame(); const dg = L(vt('DANGEROUS'), s), fu = L(vt('FUNNIEST'), s), sb = L(vt('SUBSCRIBE'), s), cm = L(vt('COMMENT'), s);
  const a = interpolate(fr, [dg, dg + 20], [0, 38], cl), b = interpolate(fr, [fu, fu + 20], [0, 62], cl); const tap = fr >= sb + 6;
  const row = (label: string, v: number, col: string, y: number, t0: number) => fr >= t0 && <div style={{position: 'absolute', left: 90, top: y, width: 900, height: 120, borderRadius: 60, background: 'rgba(0,0,0,.65)', overflow: 'hidden', border: '3px solid rgba(255,255,255,.4)', transform: `scale(${pop(fr - t0, 6, 1.3).s})`}}>
    <div style={{width: `${v}%`, height: '100%', background: col}} />
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px'}}><Txt size={50}>{label}</Txt><Txt size={50}>{Math.round(v)}%</Txt></div></div>;
  return <>
    <Footage src={data.tl[data.tl.length - 1].src} mv={3} d={d} />
    <div style={{position: 'absolute', top: 330, width: W, textAlign: 'center', transform: `scale(${pop(fr - 4, 6, 1.4).s})`}}><Txt size={64}>THE VERDICT ⚖️</Txt></div>
    {row('😈 MOST DANGEROUS', a, MAG, 450, dg - 4)}
    {row('😂 FUNNIEST', b, '#c79a00', 600, fu - 4)}
    {fr >= cm && <Chip x={540} y={780} t0={cm} bg="#fff" size={44}><span style={{color: '#111'}}>💬 vote in the comments</span></Chip>}
    {fr >= sb - 10 && <div style={{position: 'absolute', left: 280, top: 900, width: 520, height: 120, borderRadius: 60, background: tap ? '#2a2a2a' : MAG, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,.6)', transform: `scale(${tap ? pop(fr - sb - 6, 5, 1.3).s : 1})`}}><Txt size={54}>{tap ? '✓ FOLLOWING' : '+ FOLLOW'}</Txt></div>}
    {fr >= sb - 10 && <div style={{position: 'absolute', left: interpolate(fr, [sb - 10, sb + 4], [900, 640], cl), top: interpolate(fr, [sb - 10, sb + 4], [1300, 990], cl), fontSize: 130}}>👆</div>}
    <Tape y={1080} rot={-6} t0={L(vt('VIGILANT'), s)} />
  </>;
};

export const BarsBreakdown: React.FC = () => {
  const ready = useFontsReady('bars1');
  const fr = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{background: '#000'}} />;
  let bi = 0, pi = 0;
  const cut = TLS.some((x) => fr === f(x.t0) && x.t0 > 0);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {TLS.map((x, i) => { const s = x.t0, d = x.t1 - x.t0; const from = f(s), dur = f(x.t1) - f(s);
        if (x.kind === 'bar') { const n = ++bi; return <Sequence key={i} from={from} durationInFrames={dur}><Footage src={x.src} mv={n} d={d} /><NowPlaying n={n} /><Karaoke id={x.id!} src={x.src} /></Sequence>; }
        if (x.kind === 'pause') { const k = pi++; const P = PAUSES[k]; const fsrc = x.src;
          return <Sequence key={i} from={from} durationInFrames={dur}>
            <Footage src={k === 5 ? 50.3 : fsrc - 0.05} mv={k + 2} freeze d={d} grade="grayscale(.75) contrast(1.15) brightness(.7) sepia(.15) hue-rotate(170deg)" />
            <PauseFX n={bi} d={d} src={x.src} /><P s={s} d={d} /></Sequence>; }
        return <Sequence key={i} from={from} durationInFrames={BARS_FRAMES - from}><End s={s} d={d} /></Sequence>; })}
      <Grain />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 70% at 50% 50%, transparent 55%, rgba(0,0,0,.5) 100%)', pointerEvents: 'none'}} />
      <div style={{position: 'absolute', left: 0, top: 150, width: W, display: 'flex', justifyContent: 'flex-end', padding: '0 44px'}}><div style={{padding: '6px 16px', background: YEL}}><Txt size={28} color="#0a0a0a" style={{textShadow: 'none', letterSpacing: 2}}>VIGILANT CRIME · BARS ON PAUSE</Txt></div></div>
      <VOCaps />
      <div style={{position: 'absolute', bottom: 40, width: W, textAlign: 'center', fontFamily: MONO, fontSize: 22, color: 'rgba(255,255,255,.7)'}}>song & video: Yanko – "Life of a Rider" (film by Biggz) · commentary & critique</div>
      {cut && <AbsoluteFill style={{background: '#fff', opacity: 0.3}} />}
      <Audio src={staticFile('mix_bars1.wav')} />
    </AbsoluteFill>
  );
};
