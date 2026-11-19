/* @imjustgta SHORT (9:16) — "Is Mandy a serial killer?" Same visual language as PwLong (purple stage, pills, pink titles,
   stamps, spotlight) adapted to vertical. Uses ALL supplied assets: Pipework gameplay, the creepy-door clip, the 4-panel
   collage, the car-boot photo and the yard photo. Game audio muted; VO + original bed + SFX. */
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import data from './md1.json';
import {cl, pop, rnd, useFontsReady} from './kit3d';

const W = 1080, H = 1920, FPS = 30;
export const MD_FRAMES = Math.ceil(data.total * FPS);
const f = (s: number) => Math.round(s * FPS);
const VOW = data.vo as [string, number][];
const vt = (w: string, after = 0) => VOW.find(([x, t]) => x === w && t >= after - 0.05)?.[1] ?? after;
const L = (w: string, s: number, after = 0) => f(vt(w, Math.max(after, s - 0.2)) - s);
const PINK = '#ff5fcf', PINK2 = '#ffb8ec', VIO = '#9b5cff', TEAL = '#3ff0d0', RED = '#ff2d55', INK = '#160c22';
const GLOW = '0 0 0 3px rgba(255,190,245,.85), 0 0 30px rgba(255,120,220,.55), 0 30px 80px rgba(0,0,0,.6)';
const T: React.FC<{size: number; children: React.ReactNode; color?: string; style?: React.CSSProperties; w?: number}> = ({size, children, color = '#fff', style, w = 900}) =>
  <div style={{fontFamily: w >= 900 ? 'HeroBlack' : 'UIBold', fontSize: size, color, lineHeight: 1.02, letterSpacing: size > 60 ? -1 : 0.5, ...style}}>{children}</div>;
const Sfx: React.FC<{at: number; n: string; v?: number}> = ({at, n, v = 0.6}) => <Sequence from={Math.max(0, at)} durationInFrames={40}><Audio src={staticFile(`pw/${n}.wav`)} volume={v} /></Sequence>;

const Stage: React.FC<{children?: React.ReactNode}> = ({children}) => { const fr = useCurrentFrame();
  return <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 70% at 50% 45%, #3b2352 0%, #24163a 45%, ${INK} 100%)`, overflow: 'hidden'}}>
    <AbsoluteFill style={{perspective: 1200}}><div style={{position: 'absolute', left: -900, right: -900, top: 1150, height: 1600, transform: 'rotateX(72deg)', transformOrigin: 'top',
      backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.06) 2px, transparent 2px)', backgroundSize: '90px 90px', backgroundPosition: `0 ${(fr * 2) % 90}px`}} /></AbsoluteFill>
    {Array.from({length: 24}, (_, i) => <div key={i} style={{position: 'absolute', left: rnd(i) * W, top: ((rnd(i + 40) * H - fr * (0.4 + rnd(i + 9))) % H + H) % H, width: 4, height: 4, borderRadius: 2, background: 'rgba(255,200,255,.35)'}} />)}
    {children}</AbsoluteFill>; };
/** 9:16 window into 16:9 gameplay (cx = subject centre 0..1). */
const Foot: React.FC<{src: number; rate?: number; d: number; cx?: number; mv?: number; spot?: number[]; spotT?: number; file?: string; vertical?: boolean}> = ({src, rate = 1, d, cx = 0.5, mv = 0, spot, spotT = 0, file = 'g1', vertical}) => {
  const fr = useCurrentFrame(); const p = interpolate(fr, [0, f(d)], [0, 1], cl); const e = interpolate(fr, [0, 7], [1, 0], {...cl, easing: Easing.out(Easing.cubic)});
  const M = [{s: 1.04 + 0.1 * p, x: 0, y: 0, r: 0}, {s: 1.16 - 0.1 * p, x: 0, y: 0, r: 0}, {s: 1.08, x: 30 - 60 * p, y: 0, r: 0}, {s: 1.06 + 0.25 * e, x: 0, y: 0, r: 0}, {s: 1.1, x: Math.sin(fr / 9) * 8, y: Math.cos(fr / 11) * 6, r: Math.sin(fr / 14) * 0.5}, {s: 1.1, x: 0, y: 30 - 60 * p, r: -1 + 2 * p}][mv % 6];
  const vw = vertical ? W : 3413, left = vertical ? 0 : Math.max(-(vw - W), Math.min(0, -(cx * vw - W / 2)));
  const so = spot ? interpolate(fr, [spotT, spotT + 8], [0, 1], cl) : 0;
  return <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
    <AbsoluteFill style={{transform: `translate(${M.x}px,${M.y}px) rotate(${M.r}deg) scale(${M.s})`, filter: 'brightness(1.38) contrast(1.1) saturate(1.12)'}}>
      <OffthreadVideo src={staticFile(`md/${file}.mp4`)} muted startFrom={f(src)} playbackRate={rate} style={{position: 'absolute', left, top: 0, width: vw, height: H}} /></AbsoluteFill>
    {spot && <AbsoluteFill style={{opacity: so, background: `radial-gradient(ellipse ${spot[2] * 100}% ${spot[3] * 100}% at ${spot[0] * 100}% ${spot[1] * 100}%, transparent 50%, rgba(8,4,16,.8) 100%)`}} />}
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,4,20,.45) 0%, transparent 18%, transparent 62%, rgba(10,4,20,.7) 84%, rgba(10,4,20,.96) 100%)'}} />
  </AbsoluteFill>;
};
/** Still image plate with slow push (objectFit cover). */
const Plate: React.FC<{img: string; d: number; pos?: string; z?: [number, number]; spot?: number[]; spotT?: number; children?: React.ReactNode}> = ({img, d, pos = 'center', z = [1.04, 1.14], spot, spotT = 0, children}) => {
  const fr = useCurrentFrame(); const s = interpolate(fr, [0, f(d)], z, cl); const so = spot ? interpolate(fr, [spotT, spotT + 8], [0, 1], cl) : 0;
  return <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
    <AbsoluteFill style={{transform: `scale(${s})`}}><Img src={staticFile(`md/${img}.jpg`)} style={{width: W, height: H, objectFit: 'cover', objectPosition: pos, filter: 'brightness(1.12) contrast(1.1) saturate(1.1)'}} />{children}</AbsoluteFill>
    {spot && <AbsoluteFill style={{opacity: so, background: `radial-gradient(ellipse ${spot[2] * 100}% ${spot[3] * 100}% at ${spot[0] * 100}% ${spot[1] * 100}%, transparent 50%, rgba(8,4,16,.82) 100%)`}} />}
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,4,20,.45) 0%, transparent 18%, transparent 62%, rgba(10,4,20,.65) 100%)'}} />
  </AbsoluteFill>;
};
const Pill: React.FC<{t0: number; x: number; y: number; children: React.ReactNode; icon?: string; hot?: boolean; size?: number; anchor?: 'l' | 'c' | 'r'; bg?: string}> = ({t0, x, y, children, icon, hot, size = 44, anchor = 'c', bg}) => {
  const fr = useCurrentFrame(); if (fr < t0) return null; const p = pop(fr - t0, 6, 1.6); const tx = anchor === 'c' ? '-50%' : anchor === 'r' ? '-100%' : '0';
  return <div style={{position: 'absolute', left: x, top: y, transform: `translateX(${tx}) scale(${p.s})`, transformOrigin: 'center', opacity: p.o, display: 'flex', alignItems: 'center', gap: 14, padding: `${size * 0.3}px ${size * 0.6}px`, borderRadius: 999, whiteSpace: 'nowrap',
    background: bg ?? (hot ? `linear-gradient(90deg, ${PINK}, ${VIO})` : 'rgba(22,16,38,.92)'), border: hot || bg ? 'none' : '3px solid rgba(255,255,255,.8)', boxShadow: '0 10px 30px rgba(0,0,0,.5)'}}>
    <Sequence from={t0} durationInFrames={6}><Audio src={staticFile('pw/pop.wav')} volume={0.35} /></Sequence>
    {icon && <span style={{fontSize: size * 0.95}}>{icon}</span>}<T size={size} w={800} style={{letterSpacing: 2, textTransform: 'uppercase'}}>{children}</T></div>; };
const Title: React.FC<{t0: number; children: React.ReactNode; y?: number; size?: number}> = ({t0, children, y = 420, size = 130}) => {
  const fr = useCurrentFrame(); if (fr < t0) return null; const e = interpolate(fr - t0, [0, 8], [0, 1], {...cl, easing: Easing.out(Easing.back(1.6))});
  return <div style={{position: 'absolute', top: y, left: 40, right: 40, textAlign: 'center', transform: `scale(${0.6 + 0.4 * e})`, opacity: Math.min(1, (fr - t0) / 3)}}>
    <span style={{fontFamily: 'HeroBlack', fontSize: size, lineHeight: 1, letterSpacing: -2, backgroundImage: `linear-gradient(180deg, ${PINK2} 0%, ${PINK} 60%, #d93fb0 100%)`, WebkitBackgroundClip: 'text', color: 'transparent',
      WebkitTextStroke: '4px #fff', filter: 'drop-shadow(0 8px 0 rgba(60,0,60,.6)) drop-shadow(0 0 30px rgba(255,95,207,.45))'}}>{children}</span></div>; };
const Stamp: React.FC<{t0: number; text: string; col?: string; y?: number; size?: number; rot?: number}> = ({t0, text, col = RED, y = 760, size = 104, rot = -6}) => {
  const fr = useCurrentFrame(); if (fr < t0) return null; const lf = fr - t0; const s = interpolate(lf, [0, 4], [2.2, 1], {...cl, easing: Easing.in(Easing.cubic)}); const sh = lf > 3 && lf < 9 ? Math.sin(lf * 4) * 6 : 0;
  return <div style={{position: 'absolute', left: W / 2, top: y, transform: `translate(-50%,-50%) translate(${sh}px,${sh}px) rotate(${rot}deg) scale(${s})`, opacity: Math.min(1, lf / 2)}}>
    <Sequence from={t0} durationInFrames={20}><Audio src={staticFile('pw/impact.wav')} volume={0.55} /></Sequence>
    <span style={{display: 'inline-block', fontFamily: 'HeroBlack', fontSize: size, color: col, border: `${size * 0.07}px solid ${col}`, borderRadius: size * 0.16, padding: `${size * 0.04}px ${size * 0.24}px`, background: 'rgba(16,8,26,.6)', whiteSpace: 'nowrap'}}>{text}</span></div>; };
/** Evidence box (corner brackets) on a photo, label above. */
const Box: React.FC<{t0: number; x: number; y: number; w: number; h: number; label: string; below?: boolean}> = ({t0, x, y, w, h, label, below}) => {
  const fr = useCurrentFrame(); if (fr < t0) return null; const e = interpolate(fr - t0, [0, 6], [1.4, 1], {...cl, easing: Easing.out(Easing.cubic)}); const c = 34;
  const corner = (st: React.CSSProperties) => <div style={{position: 'absolute', width: c, height: c, borderColor: '#fff', borderStyle: 'solid', borderWidth: 0, ...st}} />;
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `scale(${e})`, opacity: Math.min(1, (fr - t0) / 3), filter: `drop-shadow(0 0 10px ${PINK})`}}>
    <Sequence from={t0} durationInFrames={6}><Audio src={staticFile('pw/pop.wav')} volume={0.35} /></Sequence>
    {corner({left: 0, top: 0, borderLeftWidth: 6, borderTopWidth: 6})}{corner({right: 0, top: 0, borderRightWidth: 6, borderTopWidth: 6})}{corner({left: 0, bottom: 0, borderLeftWidth: 6, borderBottomWidth: 6})}{corner({right: 0, bottom: 0, borderRightWidth: 6, borderBottomWidth: 6})}
    <div style={{position: 'absolute', left: '50%', top: below ? h + 14 : -66, transform: 'translateX(-50%)', padding: '6px 18px', borderRadius: 999, background: `linear-gradient(90deg, ${PINK}, ${VIO})`, whiteSpace: 'nowrap'}}><T size={34} w={800} style={{letterSpacing: 2}}>{label}</T></div></div>; };
const Card: React.FC<{t0?: number; x: number; y: number; w: number; h: number; ry?: number; children: React.ReactNode}> = ({t0 = 0, x, y, w, h, ry = 0, children}) => {
  const fr = useCurrentFrame(); if (fr < t0) return null; const e = interpolate(fr - t0, [0, 8], [1, 0], {...cl, easing: Easing.out(Easing.cubic)});
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, perspective: 1600}}><div style={{width: '100%', height: '100%', borderRadius: 26, overflow: 'hidden', boxShadow: GLOW, position: 'relative',
    transform: `translateY(${e * 400}px) rotateY(${ry + Math.sin(fr / 40) * 2}deg) rotateX(5deg) scale(${1 - 0.1 * e})`, opacity: 1 - e}}>{children}</div></div>; };
const Crop: React.FC<{img: string; sx: number; sy: number; sw: number; sh: number; iw: number; ih: number}> = ({img, sx, sy, sw, sh, iw, ih}) =>
  /* show image region (sx,sy,sw,sh as 0..1) filling the parent box */
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}><Img src={staticFile(`md/${img}.jpg`)} style={{position: 'absolute', width: `${100 / sw}%`, height: `${100 / sh}%`, left: `${-sx / sw * 100}%`, top: `${-sy / sh * 100}%`, objectFit: 'fill', filter: 'brightness(1.1) contrast(1.08)'}} data-iw={iw} data-ih={ih} /></div>;
const CardVid: React.FC<{src: number; rate?: number}> = ({src, rate = 1}) => <OffthreadVideo src={staticFile('md/g1.mp4')} muted startFrom={f(src)} playbackRate={rate} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.4) contrast(1.1) saturate(1.1)'}} />;
const Header: React.FC<{text: string; t0?: number}> = ({text, t0 = 0}) => <Pill t0={t0} x={W / 2} y={250} hot size={40}>{text}</Pill>;

type Sh = {a: number; C: React.FC<{s: number; d: number}>};
const sh = (w: string, after = 0, pre = 0.1) => Math.max(0, vt(w, after) - pre);
const SHOTS: Sh[] = [
  // HOOK — the finger drop on frame 0
  {a: 0, C: ({s, d}) => { const fr = useCurrentFrame(); return <><Foot src={6.3} rate={0.45} d={d} cx={0.45} mv={3} spot={[0.5, 0.42, 0.45, 0.4]} />
    <Title t0={0} y={330} size={128}>IS MANDY A SERIAL KILLER?</Title><Sfx at={0} n="impact" v={0.7} />
    {fr < 4 && <AbsoluteFill style={{background: '#fff', opacity: 0.4 * (1 - fr / 4)}} />}</>; }},
  {a: sh('IN', 1.7), C: ({s, d}) => <><Foot src={1.0} rate={0.8} d={d} cx={0.16} mv={0} />
    <Pill t0={0} x={W / 2} y={400} icon="👤" hot>Mandy</Pill><Pill t0={L('LEONIDA', s)} x={W / 2} y={500} icon="📍">Leonida Keys</Pill><Pill t0={L('LEONIDA', s) + 8} x={W / 2} y={600} icon="🏠">Landlord's tenant</Pill></>},
  {a: sh('YOU', 2.9), C: ({s, d}) => <Stage><Card x={90} y={560} w={900} h={506} ry={-8}><CardVid src={0.4} /></Card>
    <Pill t0={L('CHAPTER', s)} x={W / 2} y={400} icon="📖">Chapter 1 · Mission</Pill><Title t0={L('PIPEWORK', s)} y={1140} size={150}>PIPEWORK</Title></Stage>},
  {a: sh('WHEN', 5.4), C: ({s, d}) => <><Foot src={10.2} rate={0.9} d={d} cx={0.47} mv={4} /><Pill t0={L('FIXES', s)} x={W / 2} y={400} icon="🔧">Fixing her sink</Pill></>},
  {a: sh('A', 7.0), C: ({s, d}) => { const fr = useCurrentFrame(); const fi = L('FINGER', s); return <><Foot src={6.0} rate={0.5} d={d} cx={0.46} mv={3} spot={[0.5, 0.4, 0.4, 0.38]} spotT={fi} />
    {fr >= fi && fr < fi + 4 && <AbsoluteFill style={{background: '#fff', opacity: 0.5}} />}<Stamp t0={fi} text="A FINGER 😳" col={RED} y={520} size={120} /><Pill t0={L('PIPE', s)} x={W / 2} y={1040} icon="🚰">…out of the pipe</Pill></>; }},
  {a: sh('AND', 8.4), C: ({s, d}) => <><Foot src={8.35} rate={0.55} d={d} cx={0.32} mv={0} />
    <Stamp t0={L('SNATCHES', s)} text="SNATCHED 🫳" col={PINK} y={520} size={116} rot={5} /><Pill t0={L('HIDES', s)} x={W / 2} y={1040} icon="🫣" hot>…and hides it</Pill></>},
  // EVIDENCE
  {a: sh('PEOPLE', 10), C: ({s, d}) => <><Plate img="trunk" d={d} pos="50% 55%" z={[1.0, 1.1]}>
      <Box t0={L('CLEAVER', s)} x={548} y={1192} w={175} h={270} label="CLEAVER 🔪" />
      <Box t0={L('TAPE', s)} x={462} y={1200} w={85} h={80} label="TAPE" below />
      <Box t0={L('ACID', s)} x={126} y={1100} w={262} h={270} label="ACID 🧪" /></Plate>
    <Header text="🕵️ Evidence #1 · her car boot" /><Pill t0={L('ROPE', s)} x={W / 2} y={360} icon="🪢">+ rope</Pill></>},
  {a: sh('ACID', 14.2), C: ({s, d}) => <><Plate img="yard" d={d} pos="40% 50%" z={[1.05, 1.18]} spot={[0.42, 0.33, 0.35, 0.3]} spotT={4} />
    <Header text="🕵️ Evidence #2 · her yard" /><Pill t0={0} x={W / 2} y={1040} icon="🧪" hot>Acid</Pill><Pill t0={L('SAWS', s)} x={W / 2} y={1140} icon="🪚">Saws</Pill></>},
  {a: sh('AND', 16.0), C: ({s, d}) => { const fr = useCurrentFrame(); const g = L('GRAVE', s); const dig = interpolate(fr, [L('FRESHLY', s), g + 6], [0, 1], cl); return <Stage>
    <Header text="🕵️ Evidence #3" /><Card x={90} y={380} w={900} h={506} ry={6}><CardVid src={80} rate={0.8} /></Card>
    <svg width={900} height={300} style={{position: 'absolute', left: 90, top: 940}}><ellipse cx={450} cy={250} rx={380 * dig + 10} ry={70 * dig + 4} fill="#3a2614" /><ellipse cx={450} cy={232} rx={330 * dig + 6} ry={50 * dig + 3} fill="#5a3b1e" />
      <text x={760} y={190} fontSize={140} opacity={dig}>⛏️</text><text x={250} y={210} fontSize={90} opacity={dig}>🪦</text></svg>
    <Title t0={g} y={1190} size={92}>FRESHLY DUG GRAVE?</Title><Pill t0={L('HOUSE', s)} x={W / 2} y={920} icon="🏠">Next to her house</Pill></Stage>; }},
  {a: sh('SHE', 19.2), C: ({s, d}) => { const fr = useCurrentFrame(); const k = L('JUST', s); return <>
    {fr < k ? <Foot src={35} rate={1} d={d} cx={0.64} mv={2} /> : <Sequence from={k}><Foot src={47} rate={1} d={d} cx={0.62} mv={0} /></Sequence>}
    <Pill t0={L('ADMITS', s)} x={W / 2} y={400} icon="🗣️">She admits it</Pill><Pill t0={L('BREAKING', s)} x={W / 2} y={500} icon="🔧" hot>Breaks appliances on purpose</Pill><Pill t0={L('ROUND', s)} x={W / 2} y={600} icon="😏">…just to get Jason round</Pill></>; }},
  // THE INTERNET IS SPLIT
  {a: sh('ONLINE', 23.5), C: ({s, d}) => { const fr = useCurrentFrame(); const fa = L('FANCIES', s); const panels = [[0, 0], [0.505, 0], [0, 0.505], [0.505, 0.505]];
    return fr < fa ? <Stage><Header text="🌐 The internet" />
      {panels.map(([px, py], i) => <Card key={i} t0={i * 3} x={70 + (i % 2) * 480} y={420 + Math.floor(i / 2) * 520} w={460} h={500} ry={i % 2 ? -6 : 6}><Crop img="collage" sx={px} sy={py} sw={0.495} sh={0.495} iw={1320} ih={1311} /></Card>)}
    </Stage> : <Sequence from={fa}><Foot src={20.5} rate={0.6} d={d} cx={0.62} mv={0} /><Pill t0={0} x={W / 2} y={400} icon="😍" hot>Half the internet fancies her</Pill></Sequence>; }},
  {a: sh('AND', 25.7), C: ({s, d}) => <><Foot file="g2" vertical src={3.0} rate={1} d={d} mv={3} spot={[0.55, 0.42, 0.35, 0.35]} spotT={4} />
    <Pill t0={0} x={W / 2} y={400} icon="🔪">The other half…</Pill><Stamp t0={L('SERIAL', s)} text="SERIAL KILLER?" col={RED} y={1080} size={112} /></>},
  {a: sh('IGN', 28), C: ({s, d}) => { const fr = useCurrentFrame(); const outs: [string, string][] = [['IGN', 'IGN'], ['GAMESPOT', 'GAMESPOT'], ['DEXERTO', 'DEXERTO']]; return <Stage>
    <Card x={140} y={330} w={800} h={450} ry={-6}><CardVid src={56} /></Card>
    {outs.map(([w, lab], i) => { const t0 = L(w, s); return fr >= t0 && <div key={i} style={{position: 'absolute', left: 140, top: 860 + i * 150, width: 800, padding: '22px 30px', borderRadius: 22, background: 'rgba(24,16,40,.94)', boxShadow: GLOW, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transform: `translateX(${interpolate(fr - t0, [0, 6], [700, 0], {...cl, easing: Easing.out(Easing.cubic)})}px)`}}>
      <Sequence from={t0} durationInFrames={10}><Audio src={staticFile('pw/whoosh.wav')} volume={0.4} /></Sequence>
      <T size={60}>{lab}</T><T size={34} w={800} color={TEAL}>📰 COVERED IT</T></div>; })}
    <Stamp t0={L('THEORY', s)} text="THE THEORY" col={PINK} y={1380} size={96} rot={-4} /></Stage>; }},
  {a: sh('AND', 31.7), C: ({s, d}) => <><Foot src={62} rate={1} d={d} cx={0.55} mv={4} />
    <Pill t0={L('PLAYERS', s)} x={W / 2} y={400} icon="😭">Players are moaning</Pill><Stamp t0={L('ROMANCED', s)} text="💔 CAN'T BE ROMANCED" col={PINK} y={760} size={76} rot={4} /></>},
  {a: sh('ROCKSTAR', 34.5), C: ({s, d}) => <><Foot src={50} rate={0.7} d={d} cx={0.6} mv={1} />
    <Stamp t0={L('CONFIRMED', s)} text="UNCONFIRMED ❌" col={RED} y={560} size={96} rot={-5} /><Title t0={L('FAN', s)} y={820} size={140}>FAN THEORY 🕵️</Title>
    <Pill t0={L('FAN', s) + 10} x={W / 2} y={1120} icon="👇" hot>Do you trust Mandy?</Pill></>},
];

const KEY = new Set(['MANDY', 'LEONIDA', 'KEYS', 'PIPEWORK', 'FINGER', 'SNATCHES', 'HIDES', 'CLEAVER', 'TAPE', 'ROPE', 'ACID', 'BOOT', 'SAWS', 'YARD', 'GRAVE', 'APPLIANCES', 'FANCIES', 'SERIAL', 'KILLER', 'IGN', 'GAMESPOT', 'DEXERTO', 'ROMANCED', 'ROCKSTAR', 'CONFIRMED', 'FAN', 'THEORY']);
const CH = (() => { const out: {t: number; ws: string[]}[] = []; VOW.forEach(([w, t], i) => { const l = out[out.length - 1]; const gap = i ? t - VOW[i - 1][1] : 9;
  if (l && l.ws.length < 3 && gap < 0.42 && l.ws.join(' ').length + w.length < 16 && !KEY.has(l.ws[l.ws.length - 1])) l.ws.push(w); else out.push({t, ws: [w]}); }); return out; })();
const Caps: React.FC = () => { const fr = useCurrentFrame(); const t = fr / FPS; let k = -1; CH.forEach((c, i) => { if (c.t <= t + 0.02) k = i; }); if (k < 0) return null; const c = CH[k]; if (t - c.t > 1.2) return null;
  return <div style={{position: 'absolute', top: 1450, width: W, textAlign: 'center', transform: `scale(${interpolate(t - c.t, [0, 0.08], [1.12, 1], cl)})`}}>
    {c.ws.map((w, i) => { const key = KEY.has(w); return <span key={i} style={{display: 'inline-block', margin: '0 9px', fontFamily: 'HeroBlack', fontSize: 74, color: key ? '#fff' : '#fff', background: key ? `linear-gradient(90deg, ${PINK}, ${VIO})` : 'transparent', padding: key ? '2px 18px' : 0, borderRadius: 14, transform: key ? 'rotate(-2deg)' : 'none',
      textShadow: key ? 'none' : '0 4px 0 rgba(0,0,0,.7), 3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000, -3px -3px 0 #000'}}>{w}</span>; })}</div>; };

export const MandyShort: React.FC = () => {
  const ready = useFontsReady('md1'); const fr = useCurrentFrame(); if (!ready) return <AbsoluteFill style={{background: INK}} />;
  let si = 0; SHOTS.forEach((x, i) => { if (f(x.a) <= fr) si = i; }); const lf = fr - f(SHOTS[si].a); const whip = si > 0 && lf < 5 ? interpolate(lf, [0, 5], [1, 0], cl) : 0;
  return <AbsoluteFill style={{background: INK}}>
    <AbsoluteFill style={{filter: whip > 0 ? `blur(${whip * 10}px)` : 'none', transform: `scale(${1 + whip * 0.05})`}}>
      {SHOTS.map((x, i) => { const from = f(x.a), dur = (i < SHOTS.length - 1 ? f(SHOTS[i + 1].a) : MD_FRAMES) - from;
        return <Sequence key={i} from={from} durationInFrames={dur}><x.C s={x.a} d={dur / FPS} />{i > 0 && <Sequence durationInFrames={12}><Audio src={staticFile('pw/whoosh.wav')} volume={0.3} /></Sequence>}</Sequence>; })}
    </AbsoluteFill>
    <div style={{position: 'absolute', left: 50, top: 150, padding: '8px 18px', borderRadius: 12, background: `linear-gradient(90deg, ${PINK}, ${VIO})`}}><T size={30} w={800} style={{letterSpacing: 2}}>@IMJUSTGTA</T></div>
    <Caps />
    <div style={{position: 'absolute', left: 0, top: 0, height: 8, width: `${(fr / MD_FRAMES) * 100}%`, background: `linear-gradient(90deg, ${VIO}, ${PINK})`}} />
    <Audio src={staticFile('md/vo.mp3')} />
    <Audio src={staticFile('md/bed.wav')} />
  </AbsoluteFill>;
};
