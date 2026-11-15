/* VIGILANT CRIME NEWS — parody "breaking news" format (fictional character Zaydoon Kablawi).
   News chrome (BREAKING bar, LIVE bug, lower-third headline per beat, ticker) + proof cards on every claim. */
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import data from './zk1.json';
import {W, H} from './kit';
import {cl, pop, useFontsReady} from './kit3d';
import {YEL, MAG, MONO, Txt, Mono, Stamp, Chip, Grain} from './VigilantCase';

const FPS = 30; const f = (s: number) => Math.round(s * FPS);
export const ZK_FRAMES = f(data.total);
const VOW = data.vo as [string, number][];
const vt = (w: string, after = 0) => VOW.find(([x, t]) => x === w && t >= after - 0.05)?.[1] ?? after;
const RED = '#d0021b';

const Clip: React.FC<{c: number; from: number; mv: number; d: number; z?: number; oy?: string}> = ({c, from, mv, d, z = 1.2, oy = '0%'}) => {
  const fr = useCurrentFrame(); const p = interpolate(fr, [0, f(d)], [0, 1], cl); const e = interpolate(fr, [0, 6], [1, 0], {...cl, easing: Easing.out(Easing.cubic)});
  const M = [{s: 1 + 0.07 * p, x: 0, r: 0}, {s: 1.1 - 0.08 * p, x: 0, r: 0}, {s: 1.04, x: 30 - 60 * p, r: -1.5 + 3 * p}, {s: 1 + 0.3 * e, x: 0, r: 0}, {s: 1.05, x: Math.sin(fr / 8) * 10, r: Math.sin(fr / 12) * 0.6}][mv % 5];
  return <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
    <AbsoluteFill style={{transformOrigin: `50% ${oy}`, transform: `translateX(${M.x}px) rotate(${M.r}deg) scale(${z * M.s})`, filter: 'contrast(1.08) saturate(1.1)'}}>
      <OffthreadVideo src={staticFile(`zk/c${c}.mp4`)} muted startFrom={f(from)} style={{width: W, height: H}} /></AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,.5) 0%, transparent 22%, transparent 60%, rgba(0,0,0,.75) 100%)'}} />
  </AbsoluteFill>;
};
const Card: React.FC<{t0: number; out?: number; x: number; y: number; w: number; rot?: number; from?: 'l' | 'r' | 'u'; children: React.ReactNode}> = ({t0, out, x, y, w, rot = 0, from = 'l', children}) => {
  const fr = useCurrentFrame(); if (fr < t0 || (out !== undefined && fr >= out)) return null; const e = interpolate(fr - t0, [0, 6], [1, 0], {...cl, easing: Easing.out(Easing.back(1.4))});
  const o = from === 'l' ? [-1200 * e, 0] : from === 'r' ? [1200 * e, 0] : [0, -900 * e];
  return <div style={{position: 'absolute', left: x, top: y, width: w, transform: `translate(${o[0]}px,${o[1]}px) rotate(${rot}deg)`, boxShadow: '0 30px 70px rgba(0,0,0,.65)', borderRadius: 24, overflow: 'hidden'}}>{children}</div>;
};

type Shot = {a: number; c: number; from: number; z?: number; oy?: string; head: string; tape?: boolean; L: React.FC<{s: number}>};
type TLx = {kind: string; id: string; t0: number; t1: number; c?: number; src?: number};
const TLS = (data as unknown as {tl: TLx[]}).tl; const seg = (id: string) => TLS.find((x) => x.id === id)!;
const T = (w: string, s: number, after = 0) => f(vt(w, after) - s);
const VSHOTS: Shot[] = [
  {a: seg('V1').t0, c: 7, from: 0.2, z: 1.75, oy: '8%', head: 'BREAKING NEWS', L: ({s}) => { const fr = useCurrentFrame(); const o = 1; return <>
    <AbsoluteFill style={{background: RED, opacity: o, alignItems: 'center', justifyContent: 'center'}}><div style={{transform: `scale(${pop(fr, 6, 2.2).s})`, textAlign: 'center'}}><Txt size={190}>BREAKING</Txt><Txt size={190} color={YEL}>NEWS</Txt><Mono size={44} color="#fff" style={{marginTop: 20}}>VIGILANT CRIME · LIVE</Mono></div></AbsoluteFill>
</>; }},
  {a: vt('VICTIM') - 0.2, c: 6, from: 0.3, head: 'VICTIM: ZAYDOON KABLAWI, "ENTREPRENEUR"', L: ({s}) => { const fr = useCurrentFrame(); return <>
    <Card t0={T('ZAYDOON', s)} out={T('KNOWN', s)} x={90} y={880} w={900} rot={-2}><div style={{background: '#fff', padding: '24px 30px'}}><Mono size={28} color="#888">THE VICTIM</Mono><Txt size={84} color="#111" style={{textShadow: 'none'}}>ZAYDOON KABLAWI</Txt>
      {fr >= T('SELF-DESCRIBED', s) && <Mono size={40} color={RED}>"entrepreneur" (self-described)</Mono>}</div></Card>
    {fr >= T('TIKTOK', s) && <Chip x={540} y={900} t0={T('TIKTOK', s)} bg="#111" size={54}>📱 KNOWN FOR TIKTOKS</Chip>}</>; }},
  {a: vt('WALLAHI') - 0.15, c: 1, from: 1, head: 'THE "RAMBO" TREND SWEEPS TIKTOK', L: ({s}) => <>
    <Card t0={2} x={60} y={830} w={960} rot={2} from="r"><Img src={staticFile('zk/comment.jpg')} style={{width: 960, display: 'block'}} /></Card>
    <Stamp text="REAL COMMENT ✅" t0={T('RAMBO', s)} col="#1faa4f" y={0.58} size={76} rot={-5} /></>},
  {a: vt('ACCORDING') - 0.15, c: 5, from: 1, head: 'SOURCES: "CHEFFED IN ONE"', L: ({s}) => { const fr = useCurrentFrame(); return <>
    <Card t0={2} out={T('ONE', s)} x={190} y={900} w={700} from="u"><div style={{background: '#111', padding: 24, textAlign: 'center'}}><Mono size={34} color={YEL}>🎙️ SOURCES (his cousin)</Mono></div></Card>
    {fr >= T('ONE', s) && fr < T('STRAIGHT', s) && <div style={{position: 'absolute', top: 820, width: W, textAlign: 'center', transform: `scale(${pop(fr - T('ONE', s), 6, 2).s}) rotate(-4deg)`}}><span style={{display: 'inline-block', background: RED, padding: '6px 30px'}}><Txt size={150} style={{textShadow: 'none'}}>ONE. 🎬</Txt></span><Mono size={46} color="#fff" style={{marginTop: 14}}>(a Rambo. allegedly.)</Mono></div>}
    <Stamp text="STRAIGHT TO THE BACK" t0={T('STRAIGHT', s)} col={YEL} y={0.46} size={74} rot={5} /></>; }},
  {a: vt('WITNESSES') - 0.15, c: 3, from: 0.5, head: 'VICTIM WALKS HIMSELF TO A&E', L: ({s}) => { const fr = useCurrentFrame(); return <>
    <Stamp text="DIDN'T FLINCH 🗿" t0={T('FLINCH', s)} col="#fff" y={0.44} size={90} rot={-5} />
    <Card t0={T('A&E', s)} out={T('HANDED', s)} x={240} y={850} w={600} from="u"><div style={{background: '#005eb8', padding: '20px 30px', textAlign: 'center'}}><Txt size={120} style={{textShadow: 'none'}}>A&E →</Txt><Mono size={34} color="#fff">walk-ins welcome</Mono></div></Card>
    <Card t0={T('BUSINESS', s)} out={T('PRODUCTIVITY', s)} x={140} y={860} w={800} rot={-4} from="r"><div style={{background: '#f6f1e4', padding: '34px 40px', border: '3px solid #c8b98a'}}><Txt size={64} color="#111" style={{textShadow: 'none'}}>ZAYDOON KABLAWI</Txt><Mono size={36} color="#555">CEO · Founder · Visionary</Mono><Mono size={30} color="#888">"link in bio"</Mono></div></Card>
    <Card t0={T('PRODUCTIVITY', s)} x={140} y={840} w={800} rot={3}><div style={{background: '#fff', padding: '28px 34px'}}><Mono size={28} color="#888">🛒 DIGITAL PRODUCT</Mono><Txt size={58} color="#111" style={{textShadow: 'none'}}>Productivity Template 📋</Txt>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14}}><Txt size={70} color={RED} style={{textShadow: 'none'}}>£19.99</Txt><div style={{background: '#111', padding: '12px 26px', borderRadius: 40}}><Txt size={38} style={{textShadow: 'none'}}>BUY NOW</Txt></div></div></div></Card>
    {fr >= T('MID-STITCH', s) && <Chip x={540} y={1180} t0={T('MID-STITCH', s)} bg={RED} size={50}>🧵 MID-STITCH</Chip>}</>; }},
  {a: vt('BUT') - 0.1, c: 4, from: 0.2, head: "BUT THAT'S NOT WHY WE'RE HERE", L: ({s}) => <Stamp text="PLOT TWIST" t0={T('NOT', s)} col={YEL} y={0.44} size={130} rot={-7} />},
  {a: vt('LAST') - 0.1, c: 1, from: 9, head: 'VOICE NOTE: 2 MINUTES 40 SECONDS', L: ({s}) => { const fr = useCurrentFrame(); const k = T('VOICE', s); const sec = Math.round(interpolate(fr, [T('2', s), T('LONG', s)], [0, 160], cl)); return <>
    <Card t0={k} x={90} y={860} w={900} from="r"><div style={{background: '#dcf8c6', padding: '26px 30px', display: 'flex', alignItems: 'center', gap: 20}}><Txt size={70} color="#128c7e" style={{textShadow: 'none'}}>▶</Txt>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: 5, height: 80}}>{Array.from({length: 34}, (_, i) => <div key={i} style={{flex: 1, height: 12 + 60 * Math.abs(Math.sin(i * 1.7 + fr / 4)), background: i / 34 < sec / 160 ? '#128c7e' : '#9bbf8f', borderRadius: 3}} />)}</div>
      <Mono size={50} color="#111">{Math.floor(sec / 60)}:{String(sec % 60).padStart(2, '0')}</Mono></div></Card>
    <Stamp text="2:40 ?!" t0={T('LONG', s)} col={RED} y={0.6} size={120} rot={-6} /></>; }},
  {a: vt('OUR') - 0.1, c: 6, from: 8, head: 'ANALYSTS: "HEARTFELT. POETIC. UNNECESSARY."', L: ({s}) => <>
    <Stamp text="HEARTFELT 💔" t0={T('HEARTFELT', s)} col="#fff" y={0.4} size={86} rot={-4} /><Stamp text="POETIC ✍️" t0={T('POETIC', s)} col={YEL} y={0.49} size={86} rot={3} /><Stamp text="UNNECESSARY" t0={T('UNNECESSARY', s)} col={RED} y={0.58} size={110} rot={-6} /></>},
  {a: vt('HE', 41.5) - 0.1, c: 4, from: 9, head: 'SHE LEFT HIM ON RED', L: ({s}) => { const fr = useCurrentFrame(); return <>
    {fr < T('SHE', s) && <Chip x={540} y={880} t0={T('BEAT', s) - 6} bg="#111" size={60}>🎹 + ADDED A BEAT</Chip>}
    <Card t0={T('SHE', s)} x={140} y={820} w={800} from="r"><div style={{background: '#fff', padding: '26px 30px'}}><div style={{background: '#dcf8c6', borderRadius: 18, padding: '16px 20px', marginLeft: 120}}><Mono size={36}>🎤 Voice note (2:40)</Mono></div>
      {fr >= T('RED', s) && <div style={{textAlign: 'right', marginTop: 12, transform: `scale(${pop(fr - T('RED', s), 5, 1.6).s})`, transformOrigin: 'right'}}><Txt size={64} color={RED} style={{textShadow: 'none'}}>Seen ✓✓ 21:04</Txt></div>}</div></Card></>; }},
  {a: vt('HOURS') - 0.1, c: 5, from: 10, head: 'SUSPECT SPOTTED AT NANDO\'S', L: ({s}) => { const fr = useCurrentFrame(); const hot = interpolate(fr, [T('EXTRA', s), T('EXTRA', s) + 12], [10, 100], cl); return <>
    <Card t0={T('INSTAGRAM', s) - 4} x={190} y={760} w={700} from="u"><div style={{background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', padding: 10}}><div style={{background: '#111', borderRadius: 16, padding: '22px 26px'}}>
      <Mono size={30} color="#fff">◉ her_story · 2h</Mono><Txt size={66} style={{textShadow: 'none', marginTop: 10}}>🍗 Nando's w/ HIM 😍</Txt>
      {fr >= T('EXTRA', s) && <><Mono size={28} color="#ccc" style={{marginTop: 14}}>PERi-ometer</Mono><div style={{height: 34, borderRadius: 17, background: '#333', overflow: 'hidden'}}><div style={{width: `${hot}%`, height: '100%', background: 'linear-gradient(90deg,#f4c430,#d0021b)'}} /></div><Txt size={48} color={YEL} style={{textShadow: 'none', marginTop: 6}}>EXTRA HOT 🔥</Txt></>}
      {fr >= T('BOTTOMLESS', s) && <Txt size={48} style={{textShadow: 'none'}}>🥤 BOTTOMLESS DRINKS</Txt>}</div></div></Card>
    <Stamp text="ANOTHER MAN" t0={T('ANOTHER', s)} col={RED} y={0.3} size={96} rot={-6} /></>; }},
  {a: vt('WHEN') - 0.1, c: 3, from: 8, head: 'KABLAWI BREAKS HIS SILENCE', L: ({s}) => <Stamp text="EXCLUSIVE 🎤" t0={T('COMMENT', s)} col={YEL} y={0.44} size={110} rot={-6} />},
];

const tapeL = (id: string): React.FC<{s: number}> => ({s}) => { const fr = useCurrentFrame();
  if (id === 'H1') return <div style={{position: 'absolute', top: 330, width: W, textAlign: 'center', transform: `scale(${pop(fr, 5, 2).s}) rotate(-3deg)`}}><span style={{display: 'inline-block', background: RED, padding: '8px 30px'}}><Txt size={100} style={{textShadow: 'none'}}>🚨 STABBED. OUTSIDE BOOTS.</Txt></span></div>;
  if (id === 'H2') return <div style={{position: 'absolute', top: 330, width: W, textAlign: 'center', transform: `scale(${pop(fr, 5, 2).s}) rotate(2deg)`}}><span style={{display: 'inline-block', background: YEL, padding: '8px 30px'}}><Txt size={92} color="#0a0a0a" style={{textShadow: 'none'}}>…AND THAT'S NOT WHAT HURT 💔</Txt></span></div>;
  if (id === 'T1') return <Chip x={540} y={380} t0={2} bg={RED} size={56}>🎤 THE VICTIM'S OWN WORDS</Chip>;
  if (id === 'T2') return <Chip x={540} y={380} t0={2} bg={RED} size={56}>🍗 HIS SIDE OF THE STORY</Chip>;
  const fo = 14, tap = fr >= fo + 14; return <>
    <Chip x={540} y={380} t0={2} bg={YEL} size={56}>💬 OFFICIAL STATEMENT</Chip>
    <div style={{position: 'absolute', left: 250, top: 560, width: 580, height: 120, borderRadius: 60, background: tap ? '#2a2a2a' : RED, display: fr >= fo ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(fr - (tap ? fo + 14 : fo), 5, 1.4).s})`}}><Txt size={56}>{tap ? '✓ FOLLOWING' : '+ FOLLOW'}</Txt></div>
    {fr >= fo && <div style={{position: 'absolute', left: interpolate(fr, [fo, fo + 12], [900, 660], cl), top: interpolate(fr, [fo, fo + 12], [900, 640], cl), fontSize: 130}}>👆</div>}</>; };
const SHOTS: Shot[] = [...VSHOTS, ...TLS.filter((x) => x.kind === 'tape').map((x) => ({a: x.t0, c: x.c!, from: x.src!, z: 1.0, head: '', tape: true, L: tapeL(x.id)}))].sort((p, q) => p.a - q.a);
const KEY = new Set(['BREAKING', 'NEWS', 'VIGILANT', 'CRIME', 'BAFFLED', 'VICTIM', 'ZAYDOON', 'KABLAWI', 'ENTREPRENEUR', 'TIKTOK', 'RAMBO', 'CHEFED', 'KNIFE', 'BACK', 'FLINCH', 'A&E', 'CARD', 'TEMPLATE', 'MID-STITCH', 'NOTE', '40', 'HEARTFELT', 'POETIC', 'UNNECESSARY', 'BEAT', 'RED', 'SUSPECT', 'NANDOS', 'MAN', 'HOT', 'DRINKS', 'WALLAHI', 'HURT']);
const CH = (() => { const out: {t: number; ws: string[]}[] = []; VOW.forEach(([w, t], i) => { const l = out[out.length - 1]; const gap = i ? t - VOW[i - 1][1] : 9;
  if (l && l.ws.length < 3 && gap < 0.4 && (w.length <= 4 || l.ws.length < 2) && !KEY.has(l.ws[l.ws.length - 1]) && l.ws.join(' ').length + w.length < 15) l.ws.push(w); else out.push({t, ws: [w]}); }); return out; })();
const Caps: React.FC = () => { const fr = useCurrentFrame(); const t = fr / FPS; let k = -1; CH.forEach((c, i) => { if (c.t <= t + 0.02) k = i; }); if (k < 0 || TLS.some((x) => x.kind === 'tape' && t >= x.t0 && t < x.t1)) return null; const c = CH[k]; if (t - c.t > 1.1) return null;
  return <div style={{position: 'absolute', top: 690, width: W, textAlign: 'center', transform: `translateY(-50%) scale(${interpolate(t - c.t, [0, 0.08], [1.15, 1], cl)})`}}>
    {c.ws.map((w, i) => { const key = KEY.has(w); return <span key={i} style={{display: 'inline-block', margin: '0 9px', fontFamily: 'HeroBlack', fontSize: 78, color: key ? '#0a0a0a' : '#fff', background: key ? YEL : 'transparent', padding: key ? '0 16px' : 0, transform: key ? 'rotate(-2deg)' : 'none',
      textShadow: key ? 'none' : '0 4px 0 rgba(0,0,0,.7), 3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000'}}>{w}</span>; })}</div>; };

const TICK = 'KABLAWI "STABLE", STILL SELLING TEMPLATES  ·  VOICE NOTE UNDER REVIEW BY ANALYSTS  ·  NANDO\'S DECLINES TO COMMENT  ·  PARODY · FICTIONAL CHARACTER  ·  ';
export const ZkNews: React.FC = () => {
  const ready = useFontsReady('zk1'); const fr = useCurrentFrame(); if (!ready) return <AbsoluteFill style={{background: '#000'}} />;
  const t = fr / FPS; let si = 0; SHOTS.forEach((s, i) => { if (f(s.a) <= fr) si = i; }); const sh = SHOTS[si]; const lf = fr - f(sh.a); const cut = lf === 0 && si > 0;
  const lt = interpolate(lf, [0, 7], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{background: '#000'}}>
    {SHOTS.map((s, i) => { const from = f(s.a), dur = (i < SHOTS.length - 1 ? f(SHOTS[i + 1].a) : ZK_FRAMES) - from; return <Sequence key={i} from={from} durationInFrames={dur}><Clip c={s.c} from={s.from} mv={i} d={dur / FPS} z={s.z} oy={s.oy} /><s.L s={s.a} /></Sequence>; })}
    <Grain />
    {<>
      <div style={{position: 'absolute', left: 36, top: 150, display: 'flex', gap: 10, alignItems: 'center'}}><div style={{padding: '8px 16px', background: RED, display: 'flex', gap: 10, alignItems: 'center'}}><div style={{width: 16, height: 16, borderRadius: 8, background: '#fff', opacity: fr % 30 < 18 ? 1 : 0.2}} /><Txt size={30} style={{textShadow: 'none', letterSpacing: 2}}>LIVE</Txt></div>
        <div style={{padding: '8px 16px', background: YEL}}><Txt size={30} color="#0a0a0a" style={{textShadow: 'none', letterSpacing: 2}}>VIGILANT CRIME NEWS</Txt></div><div style={{padding: '8px 14px', background: 'rgba(0,0,0,.7)'}}><Mono size={24} color="#fff">{sh.tape ? '▶ REAL AUDIO' : 'PARODY'}</Mono></div></div>
      <div style={{position: 'absolute', left: 0, top: 1440, width: W, overflow: 'hidden', display: sh.tape || si === SHOTS.findIndex((x) => x.head === 'BREAKING NEWS') ? 'none' : 'block'}}>
        <div style={{display: 'inline-block', background: RED, padding: '6px 22px', marginLeft: 36, transform: `translateY(${(1 - lt) * 60}px)`}}><Txt size={34} style={{textShadow: 'none', letterSpacing: 3}}>BREAKING</Txt></div>
        <div style={{background: '#fff', margin: '0 36px', padding: '14px 22px', clipPath: `inset(0 ${(1 - lt) * 100}% 0 0)`}}><Txt size={46} color="#0a0a0a" style={{textShadow: 'none'}}>{sh.head}</Txt></div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 1640, width: W, height: 280, background: '#0a0a0a'}}><div style={{position: 'absolute', top: 90, width: W, textAlign: 'center'}}><Mono size={26} color='rgba(255,255,255,.6)'>VIGILANT CRIME NEWS · satire · fictional character</Mono></div></div>
      <div style={{position: 'absolute', left: 0, top: 1640, width: W, height: 56, background: '#0a0a0a', overflow: 'hidden', borderTop: `4px solid ${YEL}`}}><div style={{whiteSpace: 'nowrap', transform: `translateX(${-fr * 6}px)`, fontFamily: MONO, fontWeight: 700, fontSize: 32, lineHeight: '52px', color: '#fff'}}>{TICK.repeat(8)}</div></div></>}
    <Caps />
    {cut && <AbsoluteFill style={{background: '#fff', opacity: 0.3}} />}
    <Audio src={staticFile('mix_zk1.wav')} />
  </AbsoluteFill>;
};
