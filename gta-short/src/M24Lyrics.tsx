/* VIGILANT CRIME · DRILL LYRIC BREAKDOWN PT 2 — M24 "NFTR".
   Format "LYRICS ON PAUSE": a streaming-app lyrics view (full-colour background, big bold lines, word-synced, auto-scroll)
   plays the real song bar by bar; footage only appears as small horizontal pop-up cards on key words; at each pause the
   player shows ▶ and an annotation card slides up with the VO typed word-by-word plus slang decoders. */
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import data from './m24.json';
import {cl, pop, useFontsReady} from './kit3d';

const W = 1080, H = 1920, FPS = 30;
export const M24_FRAMES = Math.ceil(data.total * FPS);
const f = (s: number) => Math.round(s * FPS);
type TL = {kind: 'bar' | 'pause'; n: number; t0: number; t1: number; src: number};
const TLS = data.tl as TL[];
const VOW = data.vo as [string, number][];
const vt = (w: string, after = 0) => VOW.find(([x, t]) => x === w && t >= after - 0.05)?.[1] ?? after;
const YEL = '#FFD400', RED = '#E01E37', BG1 = '#9a1a36', BG2 = '#4e0b1c';
const SONG_LEN = 25.85;

/* lyrics (song-time word stamps) */
const LY: [string, number][][] = [
  [['A', 0.52], ['new', 0.64], ['generation', 0.84], ['got', 1.36], ['so', 1.52], ['much', 1.72], ['packs', 2.4]],
  [['Facts,', 2.72], ['I', 2.8], ['smoke', 2.88], ['B—', 3.12], ['when', 3.36], ["I'm", 3.52], ["windin'", 3.64], ['down', 4.0]],
  [['When', 4.24], ['I', 4.32], ['wake', 4.44], ['up,', 4.64], ['I', 4.72], ['smoke', 4.84], ['on', 5.08], ['lattz', 5.28]],
  [['During', 5.84], ['the', 5.92], ['daytime,', 6.08], ['I', 6.44], ['smoke', 6.52], ['on', 6.76], ['skiz', 6.92]],
  [['To', 7.24], ['inspire', 7.4], ['me', 7.8], ['when', 7.96], ["I'm", 8.12], ["writin'", 8.28], ['tracks', 8.6]],
  [['Let', 8.84], ['me', 8.92], ['talk', 9.08], ['my', 9.28], ['sh*t,', 9.44], ['let', 9.68], ['me', 9.8], ['talk', 9.92], ['my', 10.16], ['was', 10.32]],
  [['I', 10.68], ["ain't", 10.76], ['tryna', 10.96], ['rap,', 11.24], ['battle,', 11.52], ['or', 11.8], ['clash', 12.0]],
  [['Are', 12.56], ['you', 12.72], ["buzzin',", 12.84], ['corn', 13.24], ['gets', 13.5], ['dashed', 13.64]],
  [['When', 13.88], ['I', 14.0], ['send', 14.08], ['my', 14.24], ['young', 14.36], ['boys', 14.56], ["'round", 14.76], ['there', 15.04], ['with', 15.16], ['a', 15.32], ['mash', 15.44]],
  [['Feds', 16.08], ['at', 16.4], ['my', 16.48], ['door', 16.64], ['again', 16.96]],
  [['Cah', 18.0], ['one', 18.08], ['of', 18.2], ['them', 18.28], ['boy', 18.5], ['khalas', 18.68]],
  [['And', 18.96], ['we', 19.08], ["ain't", 19.2], ['got', 19.4], ["nuttin'", 19.6], ['to', 19.84], ['do', 20.0], ['with', 20.12], ['the', 20.28], ['crime', 20.36]],
  [['But', 20.76], ["it's", 20.96], ['always', 21.12], ['us', 21.28], ['man', 21.48], ['getting', 21.68], ['harassed', 21.92]],
  [["Why's", 22.68], ['—', 22.9], ["talkin'", 23.28], ['a', 23.6], ['mess?', 23.72]],
  [['Like', 23.92], ['we', 24.08], ["didn't", 24.2], ['have', 24.4], ['my', 24.56], ['man', 24.76], ["gettin'", 25.0], ['new', 25.2], ['tats', 25.44]],
];
const SLANG = new Set(['packs', 'B—', 'lattz', 'skiz', 'corn', 'dashed', 'mash', 'Feds', 'khalas', 'harassed']);
const rows = (ln: [string, number][]) => Math.ceil(ln.map((x) => x[0]).join(' ').length / 23);
const ROW = 80, GAP = 34;
const CUM = LY.reduce<number[]>((a, ln, i) => { a.push(i ? a[i - 1] + rows(LY[i - 1]) * ROW + GAP : 0); return a; }, []);

/** song position at global time t (paused during breakdowns) */
const songAt = (t: number) => { for (const x of TLS) if (t >= x.t0 && t < x.t1) return x.kind === 'bar' ? x.src + (t - x.t0) : x.src; return SONG_LEN; };
const pauseAt = (t: number) => TLS.find((x) => x.kind === 'pause' && t >= x.t0 && t < x.t1);
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const T: React.FC<{size: number; children: React.ReactNode; color?: string; style?: React.CSSProperties; bold?: boolean}> = ({size, children, color = '#fff', style, bold}) =>
  <div style={{fontFamily: bold ? 'UIBold' : 'HeroBlack', fontSize: size, color, lineHeight: 1.12, letterSpacing: size > 50 ? -1 : 0, ...style}}>{children}</div>;

/* ---------------- lyrics view ---------------- */
const Lyrics: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; const st = songAt(t); const p = pauseAt(t);
  let idx = 0; LY.forEach((ln, i) => { if (ln[0][1] <= st + 0.06) idx = i; });
  const ls = LY[idx][0][1]; const e = interpolate(st - ls, [0, 0.28], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const y = idx ? CUM[idx - 1] + (CUM[idx] - CUM[idx - 1]) * e : 0;
  const dimTop = p ? interpolate(t - p.t0, [0.3, 0.7], [0, 1], cl) : 0;
  return <div style={{position: 'absolute', left: 70, right: 70, top: 440 - y}}>
    {LY.map((ln, i) => { const cur = i === idx, past = i < idx;
      return <div key={i} style={{marginBottom: GAP, fontFamily: 'HeroBlack', fontSize: 68, lineHeight: `${ROW}px`, letterSpacing: -1.2,
        opacity: past ? 0.62 - dimTop * 0.3 : 1, filter: !cur && dimTop > 0 ? `blur(${dimTop * 2}px)` : 'none'}}>
        {ln.map(([w, wt], k) => { const sung = cur ? wt <= st + 0.03 : past; const slang = SLANG.has(w);
          const col = cur ? (sung ? (slang ? YEL : '#fff') : 'rgba(0,0,0,.42)') : past ? (slang ? YEL : '#fff') : 'rgba(0,0,0,.42)';
          const just = cur && sung && st - wt < 0.12; return <span key={k} style={{color: col, display: 'inline-block', marginRight: 18, transform: `scale(${just ? 1.06 : 1})`, transformOrigin: 'left bottom',
            textShadow: cur && sung ? '0 2px 16px rgba(255,255,255,.18)' : 'none'}}>{w}</span>; })}
      </div>; })}
  </div>;
};

/* ---------------- header + player ---------------- */
const Header: React.FC = () => <>
  <div style={{position: 'absolute', left: 60, right: 60, top: 150, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
    <T size={58} bold>⌄</T>
    <div style={{textAlign: 'center'}}><T size={34}>NFTR</T><T size={28} bold color="rgba(255,255,255,.7)">M24</T></div>
    <T size={52} bold>⋯</T></div>
  <div style={{position: 'absolute', left: 0, right: 0, top: 268, textAlign: 'center'}}>
    <span style={{display: 'inline-block', padding: '8px 22px', background: YEL, transform: 'rotate(-1.5deg)', boxShadow: '0 8px 20px rgba(0,0,0,.35)'}}><T size={30} color="#0a0a0a" style={{letterSpacing: 2}}>VIGILANT CRIME · DRILL LYRIC BREAKDOWN PT 2</T></span></div>
</>;
const Player: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; const st = songAt(t); const p = !!pauseAt(t); const prog = Math.min(1, st / SONG_LEN);
  const btn = p ? '▶' : '❚❚';
  const pp = pauseAt(t); const hide = pp ? interpolate(t - pp.t0, [0.15, 0.45], [0, 1], cl) * interpolate(t, [pp.t1 - 0.3, pp.t1], [1, 0], cl) : 0;
  return <div style={{position: 'absolute', left: 70, right: 70, top: 1440, opacity: 1 - hide}}>
    <div style={{height: 8, borderRadius: 4, background: 'rgba(255,255,255,.3)', position: 'relative'}}><div style={{width: `${prog * 100}%`, height: '100%', borderRadius: 4, background: '#fff'}} />
      <div style={{position: 'absolute', left: `calc(${prog * 100}% - 12px)`, top: -8, width: 24, height: 24, borderRadius: 12, background: '#fff'}} /></div>
    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12}}><T size={26} bold color="rgba(255,255,255,.75)">{fmt(st)}</T><T size={26} bold color="rgba(255,255,255,.75)">{fmt(SONG_LEN)}</T></div>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 110, marginTop: 6}}>
      <T size={54} bold>⏮</T>
      <div style={{width: 118, height: 118, borderRadius: 59, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: p ? `0 0 0 8px ${YEL}66` : 'none'}}><T size={p ? 52 : 40} color="#111" style={{marginLeft: p ? 8 : 0, letterSpacing: p ? 0 : -6}}>{btn}</T></div>
      <T size={54} bold>⏭</T></div>
  </div>;
};

/* ---------------- footage pop-ups (song-time windows, synced to the song) ---------------- */
const POPS: [number, number, 'l' | 'r', number][] = [[0.45, 2.6, 'r', 1020], [2.85, 4.3, 'l', 900], [6.5, 7.95, 'r', 980], [9.0, 10.5, 'l', 900], [12.7, 14.2, 'r', 960],
  [14.3, 15.9, 'l', 1000], [16.05, 17.95, 'r', 920], [20.7, 22.6, 'l', 960], [24.0, 25.8, 'r', 940]];
const toGlobal = (s: number) => { const b = TLS.find((x) => x.kind === 'bar' && s >= x.src && s <= x.src + (x.t1 - x.t0)); return b ? b.t0 + (s - b.src) : 0; };
const PopUp: React.FC<{s0: number; s1: number; side: 'l' | 'r'; y: number}> = ({s0, s1, side, y}) => {
  const fr = useCurrentFrame(); const D = f(s1 - s0); const inn = interpolate(fr, [0, 7], [0, 1], {...cl, easing: Easing.out(Easing.back(1.5))}); const out = interpolate(fr, [D - 6, D], [0, 1], cl);
  const w = 700, h = 394, x = side === 'r' ? W - w - 50 : 50; const rot = side === 'r' ? 3 : -3; const dx = (side === 'r' ? 1 : -1) * (1 - inn) * 500;
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `translateX(${dx}px) rotate(${rot}deg) scale(${(0.85 + 0.15 * inn) * (1 - 0.15 * out)})`, opacity: (1 - out) * Math.min(1, inn * 2),
    borderRadius: 26, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,.55), 0 0 0 5px #fff'}}>
    <OffthreadVideo src={staticFile('m24/nftr.mp4')} muted startFrom={f(s0)} style={{width: w, height: h, objectFit: 'cover'}} />
    <div style={{position: 'absolute', left: 14, bottom: 12, padding: '4px 12px', borderRadius: 8, background: 'rgba(0,0,0,.6)'}}><T size={20} bold color="#fff">▶ M24 – NFTR</T></div>
  </div>;
};

/* ---------------- breakdown card ---------------- */
const QUOTE = ['"A new generation got so much packs"', '"When I wake up, I smoke on lattz…"', '"…corn gets dashed / when I send my young boys…"', '"Feds at my door again… it\'s always us man getting harassed"'];
const KEYW = new Set(['PACKS', 'LYRICS', 'ROUTINE', 'SMOKING', 'SUBSTANCES', 'UNWIND', 'INSPIRATION', 'MUSIC', 'LIFESTYLE', 'STREET', 'VIOLENCE', 'WEAPON', 'THREATENING', 'INTERESTING', 'POLICE', 'DOOR', 'NOTHING', 'CRIMES', 'IRONY', 'OPENLY', 'ENVIRONMENT', 'DOORSTEP']);
type Chip = [string, string, string];   // [trigger word, label, colour]
const CHIPS: Chip[][] = [
  [['PACKS', 'PACKS = drug packages', YEL], ['EXACTLY', 'lyrics ≠ evidence', '#fff']],
  [['UNWIND', '🌙 winding down → "B—"', YEL], ['WAKE', '☀️ wake up → "lattz"', YEL], ['THROUGHOUT', '🏙️ daytime → "skiz"', YEL], ['INSPIRATION', '✍️ writing tracks', YEL]],
  [['VIOLENCE', 'LIFESTYLE → STREET VIOLENCE', RED], ['WEAPON', 'MASH = gun', YEL], ['THREATENING', 'CORN = bullets', YEL], ['CHALLENGES', 'lyrics ≠ evidence', '#fff']],
  [['POLICE', 'FEDS = police', YEL], ['CRIMES', 'KHALAS = "finished" (Arabic)', YEL], ['ENVIRONMENT', '🤔 the irony', RED]],
];
const Card: React.FC<{p: TL}> = ({p}) => {
  const fr = useCurrentFrame(); const t = p.t0 + fr / FPS; const inn = interpolate(fr, [6, 16], [0, 1], {...cl, easing: Easing.out(Easing.cubic)}); const out = interpolate(fr, [f(p.t1 - p.t0) - 7, f(p.t1 - p.t0)], [0, 1], cl);
  const ws = VOW.filter(([, wt]) => wt >= p.t0 && wt < p.t1);
  // page the VO into ≤16-word chunks so it always fits
  const pages: [string, number][][] = []; ws.forEach((w, i) => { if (!pages.length || pages[pages.length - 1].length >= 16 && i < ws.length - 2) pages.push([]); pages[pages.length - 1].push(w); });
  let pi = 0; pages.forEach((pg, i) => { if (pg[0][1] <= t + 0.02) pi = i; }); const pg = pages[pi] ?? [];
  const chips = CHIPS[p.n - 1].filter(([w]) => vt(w, p.t0) <= t);
  const irony = p.n === 4 ? vt('IRONY', p.t0) : 999; const iro = t >= irony ? pop(f(t - irony), 6, 2).s : 0; const end = p.n === 4 ? vt('DOORSTEP', p.t0) + 0.3 : 999;
  return <div style={{position: 'absolute', left: 36, right: 36, top: 700 + (1 - inn) * 1300 + out * 1300, height: 900, borderRadius: 40, background: '#121212', boxShadow: '0 -20px 80px rgba(0,0,0,.6)', padding: '40px 46px', overflow: 'hidden'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div style={{padding: '8px 20px', background: YEL, borderRadius: 8}}><T size={28} color="#0a0a0a" style={{letterSpacing: 2}}>BREAKDOWN · BAR {p.n}/4</T></div>
      <T size={26} bold color="rgba(255,255,255,.6)">❚❚ SONG PAUSED</T></div>
    <div style={{marginTop: 26, paddingLeft: 22, borderLeft: `8px solid ${YEL}`}}><T size={36} bold color="rgba(255,255,255,.85)" style={{fontStyle: 'italic'}}>{QUOTE[p.n - 1]}</T></div>
    <div style={{marginTop: 30, minHeight: 360}}>
      {pg.map(([w, wt], i) => { const on = wt <= t + 0.02; const key = KEYW.has(w); return <span key={i} style={{display: 'inline-block', marginRight: 14, fontFamily: 'HeroBlack', fontSize: 56, lineHeight: '70px', letterSpacing: -1,
        color: on ? (key ? YEL : '#fff') : 'rgba(255,255,255,.14)', transform: `translateY(${on && t - wt < 0.1 ? -4 : 0}px)`}}>{w.toLowerCase()}</span>; })}
    </div>
    <div style={{position: 'absolute', left: 46, right: 46, bottom: 40, display: 'flex', flexWrap: 'wrap', gap: 14}}>
      {chips.map(([w, lab, col], i) => { const s = pop(f(t - vt(w, p.t0)), 6, 1.6).s; return <div key={i} style={{padding: '12px 22px', borderRadius: 999, background: col === '#fff' ? 'transparent' : col, border: col === '#fff' ? '3px solid rgba(255,255,255,.7)' : 'none', transform: `scale(${s})`}}>
        <T size={32} color={col === YEL ? '#0a0a0a' : '#fff'}>{lab}</T></div>; })}
    </div>
    {iro > 0 && <div style={{position: 'absolute', right: 40, top: 560, transform: `rotate(-8deg) scale(${iro})`, padding: '6px 22px', border: `7px solid ${RED}`, borderRadius: 14, background: 'rgba(0,0,0,.4)'}}><T size={70} color={RED}>THE IRONY</T></div>}
    {t >= end && <div style={{position: 'absolute', left: 0, right: 0, top: 680, textAlign: 'center', transform: `scale(${pop(f(t - end), 6, 1.6).s})`}}><span style={{display: 'inline-block', padding: '14px 30px', borderRadius: 999, background: RED}}><T size={40}>FOLLOW FOR PART 3 👇</T></span></div>}
  </div>;
};

export const M24Lyrics: React.FC = () => {
  const ready = useFontsReady('m24'); const fr = useCurrentFrame(); if (!ready) return <AbsoluteFill style={{background: BG2}} />;
  const t = fr / FPS; const p = pauseAt(t); const dim = p ? interpolate(t - p.t0, [0, 0.4], [0, 1], cl) : 0;
  const hit = TLS.some((x) => x.kind === 'pause' && fr >= f(x.t0) && fr < f(x.t0) + 3);
  return <AbsoluteFill style={{background: `linear-gradient(180deg, ${BG1} 0%, #7a1530 45%, ${BG2} 100%)`, overflow: 'hidden'}}>
    <Lyrics />
    <AbsoluteFill style={{background: `rgba(10,2,6,${0.35 * dim})`}} />
    {POPS.map(([s0, s1, side, y], i) => <Sequence key={i} from={f(toGlobal(s0))} durationInFrames={f(s1 - s0)}><PopUp s0={s0} s1={s1} side={side} y={y} /></Sequence>)}
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${BG1} 0%, ${BG1} 300px, rgba(154,26,54,0) 420px, rgba(78,11,28,0) 1330px, ${BG2} 1420px)`}} />
    <Header /><Player />
    {TLS.filter((x) => x.kind === 'pause').map((x, i) => <Sequence key={i} from={f(x.t0)} durationInFrames={f(x.t1) - f(x.t0)}><Card p={x} /></Sequence>)}
    {hit && <AbsoluteFill style={{background: '#fff', opacity: 0.18}} />}
    <Audio src={staticFile('m24/mix.wav')} />
  </AbsoluteFill>;
};
