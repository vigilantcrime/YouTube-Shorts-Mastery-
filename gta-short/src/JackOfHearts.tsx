/* "Jack of Hearts": built in the Roddy Games format (see /roddy_style.md).
   Emblem sting with glint at 0s · 1–3 word captions (yellow/magenta key word, y=69%) · Vice City gradient card stage ·
   side-by-side proof · highlight boxes · animated numbers · chat/press/poll cards · recap + subscribe-click ending. */
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import words from './w8.json';
import {W, H, SHADOW} from './kit';
import {cl, pop, rnd, useFontsReady} from './kit3d';

export const JOH_FRAMES = Math.round(72.2 * 30);
const FPS = 30;
const f = (s: number) => Math.round(s * FPS);
type Wd = [string, number];
const WT = (words as Wd[]).map(([w, t]) => [w, t + 0.03] as Wd);
const at = (word: string, after = 0) => WT.find(([w, t]) => w === word && t >= after - 0.05)?.[1] ?? after;

const YEL = '#FFD400', MAG = '#FF2FA8';
const STAGE = 'radial-gradient(ellipse 120% 75% at 50% 18%, #ffb06a 0%, #ff5fa8 32%, #b13cd6 62%, #3a0f5e 100%)';
const img = (n: number) => staticFile(`jh/i${n}.jpg`);

/* ------------------------------------------------------------------ */
/* Captions: 1–3 word chunks, hard swaps, one coloured key word         */
/* ------------------------------------------------------------------ */
const NUM: Record<string, number> = {ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5, SIX: 6, SEVEN: 7, EIGHT: 8, NINE: 9, TEN: 10, TWENTY: 20, THIRTY: 30, FORTY: 40, FIFTY: 50, SEVENTY: 70};
const YELLOW = new Set(['GTA', 'GTA 6', 'GTA 5', 'MIAMI', 'KODAK', 'BLACK', 'JACK', 'HEARTS', 'KING', 'DIAMONDS', 'ROCKSTAR', 'BOOBIE', 'IKE', 'JASON', 'DEADPOOL', 'WOLVERINE', 'VICE', 'CITY', 'SIN', 'UK', 'MARVEL', '2026', '19TH']);
const MAGENTA = new Set(['COPIED', 'EXACTLY', 'STORY', 'BAD', 'NEWS', 'SUBTLE', 'LOST', 'JOURNALISM', 'CONFIRMED', 'RAIN', 'STRIKES', 'MONEY', 'DECIDE', 'HONEST', 'COMMENTS', 'THROW', 'NOT', 'LADS', 'OWNER', 'FAMOUS', 'SAME']);
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
/* Shots                                                               */
/* ------------------------------------------------------------------ */
type Shot = {t: number; C: React.FC<{s: number; d: number}>};
const T = (w: string, after = 0) => at(w, after);

const SHOTS: Shot[] = [
  // 1 · HOOK — emblem sting over the dressing room (A + emblem)
  {t: 0, C: ({d}) => { const fr = useCurrentFrame();
    const exit = interpolate(fr, [38, 43], [0, 1], cl);
    return <><Plate n={3} dur={d} from={[1.25, 60, 260]} to={[1.15, 40, 200]} pos="35% 0%" />
      <div style={{position: 'absolute', left: (W - 670) / 2, top: 230, opacity: 1 - exit, transform: `scale(${1 - exit * 0.15})`, filter: `blur(${exit * 20}px)`}}><Emblem /></div>
      <Chip x={W / 2} y={H * 0.53} t0={f(T('MIAMI') - 0)} bg={MAG}>📍 REAL MIAMI CLUB</Chip></>; }},
  // 2 · side-by-side proof: game vs real (B)
  {t: 3.34, C: ({s}) => <Stage bg={6}>
    <Label text="GTA 6" x={50} y={330} w={470} />
    <Label text="REAL LIFE" x={560} y={330} w={470} t0={6} />
    <Card x={50} y={400} w={470} h={700} from="left" tilt={8}><Fit n={6} pos="50% 20%" /></Card>
    <Card x={560} y={400} w={470} h={700} t0={6} from="right"><Fit n={7} pos="60% 25%" /></Card>
    <HBox x={110} y={470} w={340} h={360} t0={f(T('KODAK') - s)} />
    <HBox x={640} y={480} w={340} h={360} t0={f(T('KODAK') - s) + 3} />
    <Chip x={W / 2} y={1150} t0={f(T('EXACTLY') - s)}>LOOKS EXACTLY LIKE? 👀</Chip></Stage>},
  // 3 · release date card (B)
  {t: 6.12, C: ({s}) => <Stage bg={2}>
    <Card x={190} y={330} w={700} h={760} tilt={-6}>
      <div style={{width: '100%', height: '100%', background: '#fff', textAlign: 'center'}}>
        <div style={{background: 'linear-gradient(90deg,#ff5fa8,#7a2bd8)', padding: '26px 0'}}><Txt size={62}>GTA VI</Txt></div>
        <Txt size={300} color="#111" style={{textShadow: 'none', marginTop: 40}}>19</Txt>
        <Txt size={90} color="#ff2fa8" style={{textShadow: 'none', marginTop: 10}}>NOV 2026</Txt>
        <div style={{fontFamily: 'UIBold', fontSize: 36, color: '#888', marginTop: 20}}>THURSDAY · LAUNCH DAY</div>
      </div></Card></Stage>},
  // 4 · "5 days, lads" — full plate + slam counter (A + C)
  {t: 9.14, C: ({s, d}) => { const fr = useCurrentFrame(); const n = fr < 4 ? 6 : 5; const p = pop(fr - 4, 6, 1.6);
    return <><Plate n={2} dur={d} from={[1.12, 0, 0]} to={[1.2, 10, -20]} dim={0.1} />
      <div style={{position: 'absolute', top: H * 0.24, width: W, textAlign: 'center', transform: `scale(${p.s})`}}><Txt size={330} color={YEL}>{n}</Txt><Txt size={100} style={{marginTop: -10}}>DAYS</Txt></div></>; }},
  // 5 · "babe I'm only playing it for the story" — chat card (B)
  {t: 10.38, C: ({s}) => { const fr = useCurrentFrame(); const typed = interpolate(fr, [f(T('BABE') - s), f(T('STORY', 13) - s)], [0, 1], cl);
    const msg = "babe I'm only playing it for the story 🙏"; const shown = msg.slice(0, Math.ceil(msg.length * typed));
    return <Stage bg={5}>
      <Card x={150} y={260} w={780} h={900} tilt={-6}>
        <div style={{width: '100%', height: '100%', background: '#f2f2f7', padding: 36, boxSizing: 'border-box'}}>
          <div style={{textAlign: 'center', fontFamily: 'UIBold', fontSize: 30, color: '#555'}}>💗 Babe</div>
          <div style={{marginTop: 40, maxWidth: '72%', padding: '20px 26px', borderRadius: 30, background: '#e5e5ea', fontFamily: 'UIBold', fontSize: 38, color: '#111'}}>are you playing that game again?</div>
          {typed > 0 && <div style={{marginTop: 26, marginLeft: 'auto', maxWidth: '78%', padding: '20px 26px', borderRadius: 30, background: '#0a84ff', fontFamily: 'UIBold', fontSize: 40, color: '#fff'}}>{shown}</div>}
          {typed >= 1 && <div style={{textAlign: 'right', fontFamily: 'UIBold', fontSize: 26, color: '#888', marginTop: 10}}>Delivered</div>}
        </div></Card></Stage>; }},
  // 6 · "Bad news." — the story contains the club (B, same card world, stamp)
  {t: 14.0, C: ({s}) => <Stage bg={5}>
    <Card x={150} y={260} w={780} h={900} tilt={6} t0={0}>
      <div style={{width: '100%', height: '100%', background: '#1a0b22', padding: 40, boxSizing: 'border-box'}}>
        <div style={{fontFamily: 'UIBold', fontSize: 30, color: '#ffb6dc', letterSpacing: 6}}>STORY MODE · MISSION LIST</div>
        {['Leonida Keys', 'Port Gellhorn', 'JACK OF HEARTS ♥', 'Vice Beach'].map((m, i) => <div key={i} style={{marginTop: 26, padding: '22px 26px', borderRadius: 16, background: i === 2 ? MAG : 'rgba(255,255,255,.08)', fontFamily: 'HeroBlack', fontSize: 44, color: '#fff'}}>{m}</div>)}
      </div></Card>
    <Chip x={W / 2} y={1180} t0={3} bg="#ff2d2d" size={60} rot={-6}>🚨 BAD NEWS</Chip></Stage>},
  // 7 · "The club's in the story" — Monalisa plate (A)
  {t: 14.75, C: ({d}) => <Plate n={5} dur={d} from={[1.05, 0, 30]} to={[1.14, 0, -10]} pos="50% 20%" />},
  // 8 · Boobie Ike: club money -> record label flow (B)
  {t: 15.8, C: ({s}) => { const fr = useCurrentFrame(); const m0 = f(T('MONEY', 17.5) - s), l0 = f(T('LABEL') - s);
    const flow = interpolate(fr, [m0, l0 + 6], [0, 1], cl);
    return <Stage bg={5}>
      <Chip x={W / 2} y={250} t0={f(T('BOOBIE') - s)} bg={YEL} size={58}>👑 BOOBIE IKE · OWNER</Chip>
      <Card x={110} y={430} w={380} h={440} t0={4} tilt={8} from="left"><div style={{width: '100%', height: '100%', background: '#1a0b22', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: 150}}>♥</div><Txt size={46}>THE CLUB</Txt></div></Card>
      <Card x={590} y={430} w={380} h={440} t0={l0 - 4} from="right"><div style={{width: '100%', height: '100%', background: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: 150}}>🎤</div><Txt size={46}>RECORD LABEL</Txt></div></Card>
      {Array.from({length: 7}).map((_, i) => { const p = (flow * 1.6 - i * 0.1); if (p < 0 || p > 1) return null; return <div key={i} style={{position: 'absolute', left: 470 + p * 160, top: 600 + Math.sin(p * Math.PI) * -80, fontSize: 70}}>💵</div>; })}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}><path d="M500 640 Q 540 520 580 640" stroke="#fff" strokeWidth={8} fill="none" strokeDasharray={240} strokeDashoffset={240 * (1 - flow)} /></svg>
    </Stage>; }},
  // 9 · neon sign "JACK OF HEARTS" (C over dark plate)
  {t: 19.13, C: ({s, d}) => { const fr = useCurrentFrame(); const on = fr < 6 ? (rnd(fr) > 0.4 ? 1 : 0.2) : 1;
    return <><Plate n={3} dur={d} dim={0.45} />
      <div style={{position: 'absolute', top: H * 0.22, width: W, textAlign: 'center', opacity: on}}>
        <div style={{display: 'inline-block', padding: '30px 50px', border: `10px solid ${MAG}`, borderRadius: 30, boxShadow: `0 0 60px ${MAG}, inset 0 0 40px ${MAG}`}}>
          <Txt size={84} color="#ffe0f2" style={{textShadow: `0 0 20px ${MAG}, 0 0 40px ${MAG}`}}>JACK</Txt>
          <Txt size={50} color="#ffe0f2" style={{textShadow: `0 0 20px ${MAG}`, margin: '6px 0'}}>— OF —</Txt>
          <Txt size={110} color="#ffe0f2" style={{textShadow: `0 0 20px ${MAG}, 0 0 40px ${MAG}`}}>HEARTS ♥</Txt>
        </div></div></>; }},
  // 10 · J♥ vs K♦ cards (B, side-by-side)
  {t: 20.6, C: ({s}) => { const fr = useCurrentFrame(); const k0 = f(T('KING') - s);
    const card = (r: string, suit: string, col: string) => <div style={{width: '100%', height: '100%', background: '#fff', position: 'relative'}}>
      <Txt size={110} color={col} style={{position: 'absolute', left: 26, top: 18, textShadow: 'none'}}>{r}</Txt>
      <div style={{position: 'absolute', left: 0, right: 0, top: '30%', textAlign: 'center', fontSize: 260, color: col}}>{suit}</div>
      <Txt size={110} color={col} style={{position: 'absolute', right: 26, bottom: 18, textShadow: 'none', transform: 'rotate(180deg)'}}>{r}</Txt></div>;
    return <Stage bg={3}>
      <Label text="GTA 6" x={80} y={300} w={420} />
      <Card x={80} y={370} w={420} h={600} tilt={10} from="left">{card('J', '♥', '#e0144c')}</Card>
      {fr >= k0 && <Label text="REAL MIAMI" x={580} y={300} w={420} />}
      <Card x={580} y={370} w={420} h={600} t0={k0} from="right">{card('K', '♦', '#e0144c')}</Card>
      <Chip x={W / 2} y={1020} t0={k0 + 6} bg={MAG}>JACK OF HEARTS ≈ KING OF DIAMONDS</Chip></Stage>; }},
  // 11 · "Very subtle, Rockstar." (B, punch on the cards)
  {t: 22.93, C: ({s}) => { const fr = useCurrentFrame(); const z = interpolate(fr, [0, 30], [1, 1.12], cl);
    return <Stage bg={3}><AbsoluteFill style={{transform: `scale(${z})`}}>
      <Card x={140} y={420} w={380} h={540} tilt={10}><div style={{width: '100%', height: '100%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 240, color: '#e0144c'}}>J♥</div></Card>
      <Card x={560} y={420} w={380} h={540} tilt={-10}><div style={{width: '100%', height: '100%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 240, color: '#e0144c'}}>K♦</div></Card></AbsoluteFill>
      <div style={{position: 'absolute', top: 220, width: W, textAlign: 'center', fontSize: 170, transform: `scale(${pop(fr - f(T('SUBTLE') - s), 6, 2).s})`}}>🙄</div></Stage>; }},
  // 12 · 475M views in 24h (A + odometer + ring)
  {t: 24.15, C: ({s, d}) => { const fr = useCurrentFrame(); const hrs = Math.min(24, Math.floor(interpolate(fr, [f(T('MILLION', 26) - s), f(T('HOURS', 27.4) - s)], [0, 24], cl)));
    return <><Plate n={2} dur={d} dim={0.35} from={[1.2, 0, 0]} to={[1.1, 0, 0]} />
      <Chip x={W / 2} y={230} t0={2} bg={MAG}>▶ TRAILER 2</Chip>
      <Odometer value={475000000} t0={f(T('FOUR', 24.9) - s)} t1={f(T('MILLION', 26) - s) + 4} y={H * 0.27} size={128} label="VIEWS" />
      <div style={{position: 'absolute', left: W / 2 - 110, top: H * 0.48, width: 220, height: 220, opacity: hrs > 0 ? 1 : 0}}>
        <svg width={220} height={220}><circle cx={110} cy={110} r={96} stroke="rgba(255,255,255,.25)" strokeWidth={14} fill="none" /><circle cx={110} cy={110} r={96} stroke={YEL} strokeWidth={14} fill="none" strokeDasharray={603} strokeDashoffset={603 * (1 - hrs / 24)} transform="rotate(-90 110 110)" strokeLinecap="round" /></svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Txt size={70}>{hrs}H</Txt></div></div></>; }},
  // 13 · bar race vs Deadpool & Wolverine; "Marvel lost" stamp (B)
  {t: 28.04, C: ({s}) => { const fr = useCurrentFrame(); const g = interpolate(fr, [2, 22], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
    const bar = (label: string, v: number, col: string, y: number) => <div style={{position: 'absolute', left: 90, top: y, width: 900}}>
      <Txt size={40} style={{marginBottom: 14}}>{label}</Txt>
      <div style={{height: 120, width: 900 * (v / 475) * g, borderRadius: 18, background: col, boxShadow: `0 0 40px ${col}aa`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 24, boxSizing: 'border-box'}}>
        <Txt size={56}>{Math.round(v * g)}M</Txt></div></div>;
    return <Stage bg={2}>
      {bar('GTA 6 · TRAILER 2', 475, MAG, 380)}
      {bar('DEADPOOL & WOLVERINE · TRAILER', 365, '#8a1f2a', 640)}
      <div style={{position: 'absolute', left: 90, top: 860, fontFamily: 'UIBold', fontSize: 28, color: 'rgba(255,255,255,.8)'}}>reported views in the first 24 hours</div>
      {fr >= f(T('LOST') - s) && <div style={{position: 'absolute', top: 960, width: W, textAlign: 'center', transform: `rotate(-8deg) scale(${pop(fr - f(T('LOST') - s), 5, 2.2).s})`}}>
        <span style={{fontFamily: 'HeroBlack', fontSize: 110, color: '#ff2d2d', border: '10px solid #ff2d2d', borderRadius: 18, padding: '0 30px', background: 'rgba(255,255,255,.1)'}}>MARVEL LOST</span></div>}
    </Stage>; }},
  // 14 · frame-by-frame: dance clip in an editor scrubber (B)
  {t: 31.19, C: ({s, d}) => { const fr = useCurrentFrame(); const frameNo = 1200 + Math.floor(fr / 4);
    return <Stage bg={4}>
      <Card x={240} y={220} w={600} h={900} tilt={-6}>
        <OffthreadVideo src={staticFile('jh/dance.mp4')} startFrom={Math.floor(fr / 4) * 4 + 30} playbackRate={0.0001} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </Card>
      <div style={{position: 'absolute', left: 120, top: 1160, width: 840, height: 70, borderRadius: 14, background: 'rgba(10,0,20,.75)', overflow: 'hidden'}}>
        {Array.from({length: 40}).map((_, i) => <div key={i} style={{position: 'absolute', left: i * 22, top: 0, width: 2, height: i % 5 ? 24 : 40, background: 'rgba(255,255,255,.5)'}} />)}
        <div style={{position: 'absolute', left: 60 + (fr * 6) % 760, top: 0, width: 6, height: 70, background: YEL}} />
      </div>
      <Chip x={W / 2} y={150} t0={2} bg="#111" size={40} rot={0}>⏸ FRAME {frameNo}</Chip></Stage>; }},
  // 15 · *cough* for journalism (C: press badge)
  {t: 33.35, C: ({s}) => { const fr = useCurrentFrame(); const sh = fr < 8 ? Math.sin(fr * 3) * 12 : 0;
    return <Stage bg={4}><AbsoluteFill style={{transform: `translateX(${sh}px)`}}>
      <Card x={300} y={330} w={480} h={640} tilt={8}><div style={{width: '100%', height: '100%', background: '#fff', textAlign: 'center', paddingTop: 50, boxSizing: 'border-box'}}>
        <div style={{background: '#111', margin: '0 40px', padding: '16px 0'}}><Txt size={70}>PRESS</Txt></div>
        <div style={{fontSize: 170, marginTop: 30}}>🕵️</div>
        <Txt size={46} color="#111" style={{textShadow: 'none', marginTop: 20}}>FOR JOURNALISM</Txt></div></Card></AbsoluteFill>
      <Chip x={W / 2} y={200} t0={0} bg="#fff" size={50}>*cough* 😷</Chip></Stage>; }},
  // 16 · "Here's what's actually confirmed." — checklist (B)
  {t: 34.78, C: () => <Stage bg={2}>
    <Card x={140} y={300} w={800} h={700} tilt={-5}><div style={{width: '100%', height: '100%', background: '#fff', padding: 50, boxSizing: 'border-box'}}>
      <Txt size={64} color="#111" style={{textShadow: 'none'}}>CONFIRMED ✅</Txt>
      {['ID check at the door', '"THROW" button', 'Making it rain'].map((x, i) => <div key={i} style={{marginTop: 34, fontFamily: 'HeroBlack', fontSize: 46, color: '#bbb'}}>☐ {x}</div>)}
    </div></Card></Stage>},
  // 17 · Jason: ID check → THROW → rain (A + C prompts)
  {t: 36.17, C: ({s, d}) => { const fr = useCurrentFrame(); const r0 = f(T('RAIN') - s);
    return <><Plate n={2} dur={d} from={[1.05, 0, 40]} to={[1.15, -10, -20]} />
      <Chip x={W / 2} y={260} t0={f(T('ID') - s)} bg="#111" size={48} rot={0}>🪪 ID CHECK</Chip>
      {fr >= f(T('THROW') - s) && <div style={{position: 'absolute', left: W / 2 - 190, top: 430, transform: `scale(${pop(fr - f(T('THROW') - s), 6, 1.8).s})`, display: 'flex', alignItems: 'center', gap: 20, padding: '18px 30px',
        borderRadius: 20, background: 'rgba(10,10,14,.85)', border: '3px solid rgba(255,255,255,.6)'}}>
        <div style={{width: 80, height: 80, borderRadius: 40, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Txt size={48} color="#111" style={{textShadow: 'none'}}>X</Txt></div>
        <Txt size={64}>THROW</Txt></div>}
      {fr >= r0 && Array.from({length: 28}).map((_, i) => { const y = -200 + ((fr - r0) * (26 + (i % 5) * 6) + rnd(i) * 400) % (H + 300); return (
        <div key={i} style={{position: 'absolute', left: rnd(i + 3) * W - 80, top: y, width: 170, height: 80, borderRadius: 6, background: 'linear-gradient(135deg,#a8e6b0,#3c9a5f)', border: '3px solid #e6ffe9',
          transform: `rotate(${(fr * (3 + i % 4) + i * 40) % 360}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'HeroBlack', fontSize: 44, color: '#1e5e35'}}>$</div>); })}</>; }},
  // 18 · "Private dances? Not shown yet." (B checklist w/ unknown)
  {t: 40.63, C: ({s}) => <Stage bg={4}>
    <Card x={140} y={300} w={800} h={700} tilt={5}><div style={{width: '100%', height: '100%', background: '#fff', padding: 50, boxSizing: 'border-box'}}>
      <Txt size={64} color="#111" style={{textShadow: 'none'}}>CONFIRMED ✅</Txt>
      {['ID check at the door', '"THROW" button', 'Making it rain'].map((x, i) => <div key={i} style={{marginTop: 30, fontFamily: 'HeroBlack', fontSize: 44, color: '#111'}}>✅ {x}</div>)}
      <div style={{marginTop: 30, fontFamily: 'HeroBlack', fontSize: 44, color: '#ff2fa8'}}>❓ Private dances</div>
    </div></Card>
    <Chip x={W / 2} y={1060} t0={f(T('NOT', 41.4) - s)} bg="#111" size={56}>NOT SHOWN YET</Chip></Stage>},
  // 19 · GTA 5: $40 + three strikes (B)
  {t: 42.31, C: ({s}) => { const fr = useCurrentFrame(); const k = f(T('STRIKES', 45.8) - s);
    return <Stage bg={4}>
      <Label text="BACK IN GTA 5" x={0} y={260} w={W} />
      <Card x={300} y={340} w={480} h={420} t0={f(T('$40'.replace('$40', 'FORTY')) - s)} tilt={-8}><div style={{width: '100%', height: '100%', background: '#fff8e0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontFamily: 'UIBold', fontSize: 34, color: '#777'}}>PRIVATE DANCE</div><Txt size={180} color="#111" style={{textShadow: 'none'}}>$40</Txt></div></Card>
      <div style={{position: 'absolute', top: 830, width: W, display: 'flex', justifyContent: 'center', gap: 40}}>
        {[0, 1, 2].map((i) => { const p = pop(fr - (f(T('THREE', 45.6) - s) + i * 5), 5, 2.2); return <div key={i} style={{fontSize: 170, color: '#ff2d2d', opacity: p.o, transform: `scale(${p.s})`, fontFamily: 'HeroBlack', textShadow: '0 0 30px #ff2d2d'}}>✕</div>; })}
      </div>
      <Chip x={W / 2} y={1060} t0={k + 8} bg="#ff2d2d" size={50}>🦍 BOUNCER: YOU'RE OUT</Chip></Stage>; }},
  // 20 · "Now, let's talk money." (A, quick)
  {t: 46.52, C: ({d}) => <><Plate n={2} dur={d} from={[1.35, 0, 0]} to={[1.05, 0, 0]} /><div style={{position: 'absolute', top: H * 0.3, width: W, textAlign: 'center', fontSize: 200}}>💵</div></>},
  // 21 · 235M copies (B + odometer)
  {t: 47.75, C: ({s}) => <Stage bg={2}>
    <Chip x={W / 2} y={260} t0={2} bg="#111" size={48} rot={0}>GTA 5 · COPIES SOLD</Chip>
    <Odometer value={235000000} t0={f(T('NEARLY') - s)} t1={f(T('MILLION', 50.2) - s) + 4} y={H * 0.28} size={130} prefix="~" />
    <div style={{position: 'absolute', top: H * 0.43, width: W, display: 'flex', justifyContent: 'center', gap: 16}}>{Array.from({length: 8}).map((_, i) => <div key={i} style={{width: 90, height: 120, borderRadius: 8, background: 'linear-gradient(160deg,#2a2a2e,#111)', border: '3px solid #fff', boxShadow: '0 10px 20px rgba(0,0,0,.4)'}} />)}</div>
  </Stage>},
  // 22 · 3 copies per UK person (B)
  {t: 51.4, C: ({s}) => { const fr = useCurrentFrame(); return <Stage bg={2}>
    <div style={{position: 'absolute', top: 420, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30}}>
      <div style={{fontSize: 230, transform: `scale(${pop(fr - 2, 6, 0.5).s})`}}>🧍</div><Txt size={140}>=</Txt>
      {[0, 1, 2].map((i) => { const p = pop(fr - f(T('THREE', 51.9) - s) - i * 3, 6, 0.3); return <div key={i} style={{width: 110, height: 150, borderRadius: 10, background: 'linear-gradient(160deg,#2a2a2e,#111)', border: '4px solid #fff', opacity: p.o, transform: `scale(${p.s}) rotate(${i * 6 - 6}deg)`}} />; })}
    </div>
    <Chip x={W / 2} y={880} t0={f(T('UK') - s)} bg="#0b1a3a" size={50}>🇬🇧 EVERY PERSON IN THE UK</Chip></Stage>; }},
  // 23 · "Three of you. Same bouncer. Same three strikes." (B comedy)
  {t: 54.15, C: ({s}) => { const fr = useCurrentFrame(); return <Stage bg={4}>
    <div style={{position: 'absolute', top: 360, width: W, display: 'flex', justifyContent: 'center', gap: 20}}>{[0, 1, 2].map((i) => <div key={i} style={{fontSize: 200, transform: `scale(${pop(fr - i * 3, 6, 0.4).s})`}}>🧍‍♂️</div>)}</div>
    <div style={{position: 'absolute', top: 640, width: W, textAlign: 'center', fontSize: 220, transform: `scale(${pop(fr - f(T('BOUNCER', 55) - s), 6, 0.4).s})`}}>🦍</div>
    <div style={{position: 'absolute', top: 920, width: W, display: 'flex', justifyContent: 'center', gap: 30}}>{[0, 1, 2].map((i) => { const p = pop(fr - f(T('STRIKES', 56.1) - s) - i * 3, 5, 2); return <div key={i} style={{fontSize: 130, color: '#ff2d2d', fontFamily: 'HeroBlack', opacity: p.o, transform: `scale(${p.s})`}}>✕</div>; })}</div>
  </Stage>; }},
  // 24 · "Oh, and Kodak?" (A)
  {t: 56.81, C: ({d}) => <Plate n={6} dur={d} from={[1.2, 0, 60]} to={[1.1, 0, 0]} pos="50% 20%" />},
  // 25 · highlight boxes on haircut / tattoos / cup (A + boxes)
  {t: 57.88, C: ({s, d}) => <><Plate n={6} dur={d} from={[1.1, 0, 0]} to={[1.12, 0, 0]} pos="50% 30%" />
    <HBox x={150} y={150} w={780} h={420} t0={f(T('HAIRCUT') - s)} label="HAIRCUT" />
    <HBox x={330} y={520} w={420} h={330} t0={f(T('TATTOOS') - s)} label="FACE TATTOOS" />
    <HBox x={0} y={1180} w={300} h={420} t0={f(T('CUP') - s)} label="♥ CUP" /></>},
  // 26 · "Nobody said it's him. You decide." — side-by-side + pendant circles (B)
  {t: 61.77, C: ({s}) => <Stage bg={6}>
    <Label text="GTA 6" x={50} y={290} w={470} /><Label text="REAL LIFE" x={560} y={290} w={470} />
    <Card x={50} y={360} w={470} h={760} tilt={8}><Fit n={6} pos="50% 70%" /></Card>
    <Card x={560} y={360} w={470} h={760} tilt={-8}><Fit n={7} pos="20% 75%" /></Card>
    <HBox x={150} y={610} w={290} h={290} t0={6} round col={YEL} />
    <HBox x={590} y={590} w={330} h={330} t0={10} round col={YEL} />
    <Chip x={W / 2} y={1170} t0={12} bg={YEL} size={50}>SAME PENDANT? 👀</Chip></Stage>},
  // 27 · poll: story first vs Jack of Hearts (B)
  {t: 63.5, C: ({s}) => { const fr = useCurrentFrame(); const a = interpolate(fr, [f(T('STORY', 65.3) - s), f(T('STORY', 65.3) - s) + 20], [0, 38], cl), b = interpolate(fr, [f(T('JACK', 66.8) - s), f(T('JACK', 66.8) - s) + 20], [0, 62], cl);
    const row = (label: string, v: number, col: string, y: number) => <div style={{position: 'absolute', left: 140, top: y, width: 800, height: 140, borderRadius: 24, background: 'rgba(255,255,255,.18)', overflow: 'hidden'}}>
      <div style={{width: `${v}%`, height: '100%', background: col}} /><div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px'}}><Txt size={52}>{label}</Txt><Txt size={52}>{Math.round(v)}%</Txt></div></div>;
    return <Stage bg={3}>
      <Txt size={64} style={{position: 'absolute', top: 260, width: W, textAlign: 'center'}}>DAY ONE…</Txt>
      {row('📖 STORY FIRST', a, '#3a7bff', 420)}{row('♥ JACK OF HEARTS', b, MAG, 620)}</Stage>; }},
  // 28 · recap collage → emblem bookend → subscribe click (B)
  {t: 67.77, C: ({s, d}) => { const fr = useCurrentFrame(); const fol = f(T('FOLLOW') - s), tap = f(T('SIN', 69.6) - s);
    const collapse = interpolate(fr, [fol - 6, fol + 4], [0, 1], {...cl, easing: Easing.in(Easing.cubic)});
    const cards = [3, 6, 2, 5, 7, 4];
    const tapped = fr >= tap + 4;
    return <Stage>
      {cards.map((n, i) => { const a = (i / cards.length) * Math.PI * 2; const r = 380 * (1 - collapse); return (
        <div key={i} style={{position: 'absolute', left: W / 2 - 130 + Math.cos(a) * r, top: 760 - 170 + Math.sin(a) * r * 1.2, width: 260, height: 340, borderRadius: 16, overflow: 'hidden', border: '4px solid #fff',
          transform: `rotate(${(i - 2.5) * 8}deg) scale(${pop(fr - i * 2, 6, 0.4).s * (1 - collapse * 0.6)})`, opacity: 1 - collapse, boxShadow: '0 20px 40px rgba(0,0,0,.45)'}}><Fit n={n} pos="50% 25%" /></div>); })}
      {fr >= fol - 2 && <div style={{position: 'absolute', left: (W - 560) / 2, top: 360, transform: `scale(${pop(fr - fol + 2, 8, 0.4).s})`}}><Emblem size={560} glintAt={fol + 4} /></div>}
      {fr >= tap - 8 && <div style={{position: 'absolute', left: W / 2 - 220, top: 1000, width: 440, height: 110, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: tapped ? '#e9e9ee' : '#ff0033', transform: `scale(${tapped ? interpolate(fr - tap - 4, [0, 3, 7], [0.92, 0.92, 1], cl) : pop(fr - tap + 8, 6, 0.5).s})`, boxShadow: '0 16px 40px rgba(0,0,0,.4)'}}>
        <Txt size={50} color={tapped ? '#222' : '#fff'} style={{textShadow: 'none'}}>{tapped ? '🔔 Subscribed' : 'Subscribe'}</Txt></div>}
      {fr >= tap - 8 && <div style={{position: 'absolute', left: W / 2 + 60 + interpolate(fr, [tap - 8, tap], [200, 0], cl), top: 1060 + interpolate(fr, [tap - 8, tap], [220, 0], cl), fontSize: 90, transform: `scale(${fr >= tap && fr < tap + 4 ? 0.85 : 1})`}}>👆</div>}
    </Stage>; }},
];

export const JackOfHearts: React.FC = () => {
  const ready = useFontsReady('joh');
  const fr = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{background: '#000'}} />;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOTS.map((sh, i) => { const s = sh.t, e = i < SHOTS.length - 1 ? SHOTS[i + 1].t : JOH_FRAMES / FPS; const C = sh.C;
        return <Sequence key={i} from={f(s)} durationInFrames={f(e) - f(s)}><C s={s} d={e - s} /></Sequence>; })}
      <Captions />
      <Audio src={staticFile('mix_joh.wav')} />
    </AbsoluteFill>
  );
};
