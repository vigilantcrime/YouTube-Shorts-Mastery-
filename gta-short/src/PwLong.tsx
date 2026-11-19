/* @PatientGTA · LONG-FORM · "How to get Paul Walker's Fast & Furious car in GTA 6" (16:9, 6:26).
   Editing language reverse-engineered from the supplied reference: one continuous purple "stage" world, 3D-tilted glowing cards,
   white-outline pill tags, pink heavy titles, tilted map with pins + route, spotlight focus, magnifier insets, highlighted quote
   cards, chapter "?" grid (open loop → recap payoff). Adapted to be gameplay-first: footage is always moving (push / glide / speed ramp). */
import React from 'react';
import {AbsoluteFill, Audio, Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import data from './pw1.json';
import {cl, pop, rnd, useFontsReady} from './kit3d';

export const PW_W = 1920, PW_H = 1080, FPS = 30;
const W = PW_W, H = PW_H;
export const PW_FRAMES = Math.ceil(data.total * FPS);
const f = (s: number) => Math.round(s * FPS);
const VOW = data.vo as [string, number][];
const vt = (w: string, after = 0) => VOW.find(([x, t]) => x === w && t >= after - 0.05)?.[1] ?? after;
const L = (w: string, s: number, after = 0) => f(vt(w, Math.max(after, s - 0.2)) - s);   // word → local frame inside a shot that starts at s

/* ---- brand system (pink/violet from the reference; @imjustgta teal for "our" UI accents) ---- */
const PINK = '#ff5fcf', PINK2 = '#ffb8ec', VIO = '#9b5cff', TEAL = '#3ff0d0', INK = '#160c22';
const GLOW = '0 0 0 2px rgba(255,190,245,.85), 0 0 26px rgba(255,120,220,.55), 0 30px 80px rgba(0,0,0,.6)';
const SRC = staticFile('pw/gta.mp4');
const CLEAN: [number, number][] = [[0, 28], [54, 78], [768.5, 812]];
const TAPES = (data as unknown as {tapes: {id: string; t0: number; t1: number; src: number; end: number; label: string; bleep: number[] | null}[]}).tapes;
const inTape = (t: number) => TAPES.some((x) => t >= x.t0 && t < x.t1);
const Sfx: React.FC<{at: number; n: string; v?: number}> = ({at, n, v = 0.6}) => <Sequence from={Math.max(0, at)} durationInFrames={45}><Audio src={staticFile(`pw/${n}.wav`)} volume={v} /></Sequence>;
const T: React.FC<{size: number; children: React.ReactNode; color?: string; style?: React.CSSProperties; w?: number}> = ({size, children, color = '#fff', style, w = 900}) =>
  <div style={{fontFamily: w >= 900 ? 'HeroBlack' : 'UIBold', fontSize: size, color, lineHeight: 1.02, letterSpacing: size > 60 ? -1 : 0.5, ...style}}>{children}</div>;

/* ---------------- primitives ---------------- */
const Stage: React.FC<{children?: React.ReactNode; bg?: [number, number]}> = ({children, bg}) => {
  const fr = useCurrentFrame();
  return <AbsoluteFill style={{background: `radial-gradient(ellipse 85% 75% at 50% 45%, #3b2352 0%, #24163a 45%, ${INK} 100%)`, overflow: 'hidden'}}>
    {bg && <><AbsoluteFill style={{filter: 'blur(3px)'}}><Foot src={bg[0]} rate={bg[1]} d={60} mv={0} vol={0.12} /></AbsoluteFill><AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 45%, rgba(40,20,64,.55) 0%, rgba(22,12,36,.78) 100%)'}} /></>}
    <AbsoluteFill style={{perspective: 1200}}><div style={{position: 'absolute', left: -800, right: -800, top: 560, height: 1400, transform: 'rotateX(72deg)', transformOrigin: 'top',
      backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.06) 2px, transparent 2px)', backgroundSize: '90px 90px', backgroundPosition: `0 ${(fr * 2) % 90}px`}} /></AbsoluteFill>
    {Array.from({length: 26}, (_, i) => <div key={i} style={{position: 'absolute', left: rnd(i) * W, top: ((rnd(i + 40) * H - fr * (0.3 + rnd(i + 9))) % H + H) % H, width: 3, height: 3, borderRadius: 2, background: 'rgba(255,200,255,.35)'}} />)}
    {children}
  </AbsoluteFill>;
};
/** Gameplay plate. rate = speed; mv = move; spot = spotlight ellipse [cx,cy,rx,ry] in 0..1; freezeAt = hold a frame */
const Foot: React.FC<{src: number; rate?: number; d: number; mv?: number; spot?: number[]; spotT?: number; vol?: number; freeze?: boolean; grade?: string; force?: number | ((f: number) => number)}> = ({src, rate = 1, d, mv = 0, spot, spotT = 0, vol = 0.3, freeze, grade, force}) => {
  const fr = useCurrentFrame(); const p = interpolate(fr, [0, f(d)], [0, 1], cl); const e = interpolate(fr, [0, 7], [1, 0], {...cl, easing: Easing.out(Easing.cubic)});
  const M = [{s: 1.04 + 0.08 * p, x: 0, y: 0, r: 0}, {s: 1.14 - 0.1 * p, x: 0, y: 0, r: 0}, {s: 1.08, x: 40 - 80 * p, y: 0, r: 0}, {s: 1.06 + 0.22 * e, x: 0, y: 0, r: 0},
    {s: 1.08, x: 0, y: 25 - 50 * p, r: 0}, {s: 1.1, x: Math.sin(fr / 9) * 8, y: Math.cos(fr / 11) * 6, r: Math.sin(fr / 14) * 0.4}, {s: 1.1, x: 0, y: 0, r: -1 + 2 * p}][mv % 7];
  const clean = !freeze && rate <= 1.6 && CLEAN.some(([a, b]) => src >= a && src + d * rate <= b);
  const v = <OffthreadVideo src={SRC} startFrom={f(src)} playbackRate={freeze ? 1 : rate} volume={force ?? (clean ? Math.min(vol, 0.35) : 0)} style={{width: W, height: H}} />;
  const so = spot ? interpolate(fr, [spotT, spotT + 8], [0, 1], cl) : 0;
  return <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
    <AbsoluteFill style={{transform: `translate(${M.x}px,${M.y}px) rotate(${M.r}deg) scale(${M.s})`, filter: grade ?? 'contrast(1.06) saturate(1.12)'}}>{freeze ? <Freeze frame={0}>{v}</Freeze> : v}</AbsoluteFill>
    {spot && <AbsoluteFill style={{opacity: so, background: `radial-gradient(ellipse ${spot[2] * 100}% ${spot[3] * 100}% at ${spot[0] * 100}% ${spot[1] * 100}%, transparent 55%, rgba(8,4,16,.78) 100%)`}} />}
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,4,20,.35) 0%, transparent 18%, transparent 75%, rgba(10,4,20,.55) 100%)'}} />
  </AbsoluteFill>;
};
/** Footage inside a tilted glowing card on the stage (reference's signature "floating screen"). */
const Screen: React.FC<{src: number; rate?: number; x: number; y: number; w: number; ry?: number; rx?: number; t0?: number; freeze?: boolean; d: number; children?: React.ReactNode}> = ({src, rate = 1, x, y, w, ry = -14, rx = 6, t0 = 0, freeze, d, children}) => {
  const fr = useCurrentFrame(); const lf = fr - t0; if (lf < 0) return null; const e = interpolate(lf, [0, 9], [1, 0], {...cl, easing: Easing.out(Easing.cubic)});
  const h = w * 9 / 16; const drift = Math.sin(fr / 40) * 2;
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, perspective: 1600}}>
    <div style={{width: '100%', height: '100%', borderRadius: 22, overflow: 'hidden', boxShadow: GLOW, transform: `translateY(${e * 300}px) rotateY(${ry + drift}deg) rotateX(${rx}deg) scale(${1 - 0.1 * e})`, opacity: 1 - e, position: 'relative'}}>
      <Sequence from={t0}><AbsoluteFill style={{transform: `scale(${w / W})`, transformOrigin: 'top left', width: W, height: H}}><Foot src={src} rate={rate} d={d} mv={0} freeze={freeze} vol={0} force={0} /></AbsoluteFill></Sequence>
      {children}
    </div>
  </div>;
};
/** Pill tag (dark navy, thin white border, uppercase bold, optional icon). */
const Pill: React.FC<{t0: number; x: number; y: number; children: React.ReactNode; icon?: string; hot?: boolean; out?: number; size?: number; anchor?: 'l' | 'c' | 'r'}> = ({t0, x, y, children, icon, hot, out, size = 34, anchor = 'l'}) => {
  const fr = useCurrentFrame(); if (fr < t0 || (out !== undefined && fr > out + 5)) return null; const p = pop(fr - t0, 6, 1.6);
  const o = out !== undefined ? interpolate(fr, [out, out + 5], [1, 0], cl) : 1;
  const tx = anchor === 'c' ? '-50%' : anchor === 'r' ? '-100%' : '0';
  return <div style={{position: 'absolute', left: x, top: y, transform: `translateX(${tx}) scale(${p.s})`, transformOrigin: anchor === 'r' ? 'right center' : anchor === 'c' ? 'center' : 'left center', opacity: p.o * o,
    display: 'flex', alignItems: 'center', gap: 12, padding: `${size * 0.32}px ${size * 0.62}px`, borderRadius: 999, whiteSpace: 'nowrap',
    background: hot ? `linear-gradient(90deg, ${PINK}, ${VIO})` : 'rgba(22,16,38,.92)', border: hot ? 'none' : '2px solid rgba(255,255,255,.75)', boxShadow: '0 10px 30px rgba(0,0,0,.45)'}}>
    <Sequence from={t0} durationInFrames={6}><Audio src={staticFile('pw/pop.wav')} volume={0.35} /></Sequence>{icon && <span style={{fontSize: size * 0.95}}>{icon}</span>}<T size={size} w={800} style={{letterSpacing: 2, textTransform: 'uppercase'}}>{children}</T></div>;
};
/** Big pink title (heavy, gradient fill, white stroke). */
const Title: React.FC<{t0: number; children: React.ReactNode; y?: number; size?: number; out?: number}> = ({t0, children, y = 380, size = 130, out}) => {
  const fr = useCurrentFrame(); if (fr < t0 || (out !== undefined && fr > out + 4)) return null; const e = interpolate(fr - t0, [0, 8], [0, 1], {...cl, easing: Easing.out(Easing.back(1.6))});
  return <div style={{position: 'absolute', top: y, width: W, textAlign: 'center', transform: `scale(${0.6 + 0.4 * e}) translateY(${(1 - e) * 40}px)`, opacity: Math.min(1, (fr - t0) / 3)}}>
    <span style={{fontFamily: 'HeroBlack', fontSize: size, letterSpacing: -2, backgroundImage: `linear-gradient(180deg, ${PINK2} 0%, ${PINK} 60%, #d93fb0 100%)`, WebkitBackgroundClip: 'text', color: 'transparent',
      WebkitTextStroke: '3px #fff', filter: 'drop-shadow(0 8px 0 rgba(60,0,60,.55)) drop-shadow(0 0 30px rgba(255,95,207,.45))'}}>{children}</span></div>;
};
const Stamp: React.FC<{t0: number; text: string; col?: string; x?: number; y?: number; size?: number; rot?: number}> = ({t0, text, col = PINK, x = W / 2, y = 520, size = 96, rot = -6}) => {
  const fr = useCurrentFrame(); if (fr < t0) return null; const lf = fr - t0; const s = interpolate(lf, [0, 4], [2.2, 1], {...cl, easing: Easing.in(Easing.cubic)}); const sh = lf > 3 && lf < 9 ? Math.sin(lf * 4) * 6 : 0;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) translate(${sh}px,${sh}px) rotate(${rot}deg) scale(${s})`, opacity: Math.min(1, lf / 2)}}>
    <Sequence from={t0} durationInFrames={20}><Audio src={staticFile('pw/impact.wav')} volume={0.55} /></Sequence><span style={{display: 'inline-block', fontFamily: 'HeroBlack', fontSize: size, color: col, border: `${size * 0.07}px solid ${col}`, borderRadius: size * 0.16, padding: `${size * 0.04}px ${size * 0.24}px`, background: 'rgba(16,8,26,.55)', whiteSpace: 'nowrap'}}>{text}</span></div>;
};
/** Magnifier: outline box on the source region + linked enlarged inset (reference frame 0:57 style). */
const Mag: React.FC<{t0: number; src: number; rate?: number; box: number[]; at: number[]; z?: number; label?: string; d: number}> = ({t0, src, rate = 1, box, at, z = 3, label, d}) => {
  const fr = useCurrentFrame(); if (fr < t0) return null; const e = interpolate(fr - t0, [0, 8], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const [bx, by, bw, bh] = [box[0] * W, box[1] * H, box[2] * W, box[3] * H]; const iw = bw * z, ih = bh * z; const [ix, iy] = [at[0], at[1]];
  return <>
    <div style={{position: 'absolute', left: bx, top: by, width: bw, height: bh, border: '3px solid #fff', borderRadius: 10, boxShadow: '0 0 18px rgba(255,140,230,.7)', opacity: e}} />
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: e}}><line x1={bx + bw / 2} y1={by + bh} x2={ix + iw / 2} y2={iy} stroke="#fff" strokeWidth={3} /><circle cx={bx + bw / 2} cy={by + bh} r={6} fill="#fff" /></svg>
    <div style={{position: 'absolute', left: ix, top: iy, width: iw, height: ih, borderRadius: 18, overflow: 'hidden', boxShadow: GLOW, transform: `scale(${0.5 + 0.5 * e})`, opacity: e}}>
      <Sequence from={t0}><div style={{position: 'absolute', left: -bx * z, top: -by * z, width: W * z, height: H * z}}><div style={{transform: `scale(${z})`, transformOrigin: 'top left', width: W, height: H}}>
        <OffthreadVideo src={SRC} startFrom={f(src)} playbackRate={rate} muted style={{width: W, height: H}} /></div></div></Sequence>
    </div>
    {label && <Pill t0={t0 + 6} x={ix + iw / 2} y={iy + ih + 14} anchor="c" size={28}>{label}</Pill>}
  </>;
};
/** Glass info card (reference "ROCKSTAR'S DESCRIPTION" card) with pink highlighter sweep on a phrase. */
const Quote: React.FC<{t0: number; x: number; y: number; w: number; head: string; text: string; hl: string; th: number}> = ({t0, x, y, w, head, text, hl, th}) => {
  const fr = useCurrentFrame(); if (fr < t0) return null; const e = interpolate(fr - t0, [0, 8], [1, 0], {...cl, easing: Easing.out(Easing.cubic)}); const sw = interpolate(fr, [th, th + 10], [0, 100], cl);
  const i0 = text.indexOf(hl);
  return <div style={{position: 'absolute', left: x, top: y, width: w, padding: '30px 36px', borderRadius: 24, background: 'rgba(24,16,40,.94)', boxShadow: GLOW, transform: `translateX(${e * 600}px) rotateY(${-10 + 10 * (1 - e)}deg)`, opacity: 1 - e}}>
    <T size={22} w={800} color={PINK2} style={{letterSpacing: 3}}>{head}</T>
    <div style={{fontFamily: 'UIBold', fontSize: 40, lineHeight: 1.35, color: '#fff', marginTop: 12}}>{text.slice(0, i0)}<span style={{backgroundImage: `linear-gradient(${PINK}, ${PINK})`, backgroundRepeat: 'no-repeat', backgroundSize: `${sw}% 85%`, backgroundPosition: '0 60%'}}>{hl}</span>{text.slice(i0 + hl.length)}</div>
  </div>;
};
const Chapter: React.FC<{n: string; title: string}> = ({n, title}) => {
  const fr = useCurrentFrame(); const a = interpolate(fr, [0, 6, 22, 28], [0, 1, 1, 0], cl); if (a <= 0) return null;
  return <AbsoluteFill style={{background: `rgba(22,12,36,${0.75 * a})`, alignItems: 'center', justifyContent: 'center'}}>
    <div style={{transform: `scale(${0.85 + 0.15 * a})`, opacity: a, textAlign: 'center', width: W}}><T size={44} w={800} color={PINK2} style={{letterSpacing: 10}}>CHAPTER {n}</T>
      <div style={{fontFamily: 'HeroBlack', fontSize: 150, letterSpacing: -2, marginTop: 10, backgroundImage: `linear-gradient(180deg, ${PINK2} 0%, ${PINK} 60%, #d93fb0 100%)`, WebkitBackgroundClip: 'text', color: 'transparent', WebkitTextStroke: '3px #fff'}}>{title}</div></div></AbsoluteFill>;
};

/* ---------------- shots ---------------- */
type Sh = {a: number; C: React.FC<{s: number; d: number}>; ch?: [string, string]};
const TapeShot = (x: typeof TAPES[number]): Sh => ({a: x.t0, C: ({d}) => { const fr = useCurrentFrame(); const b = x.bleep; const bf = b ? [f(b[0] - x.src), f(b[1] - x.src)] : null;
  return <><Foot src={x.src} rate={1} d={d} mv={x.id === 'T5' ? 3 : 5} force={(i: number) => (bf && i >= bf[0] && i < bf[1] ? 0 : 1)} grade="contrast(1.08) saturate(1.15)" />
    {bf && <Sfx at={bf[0]} n="bleep" v={0.5} />}
    <div style={{position: 'absolute', left: 60, top: 140, display: 'flex', gap: 12, alignItems: 'center', transform: `scale(${pop(fr, 6, 1.5).s})`, transformOrigin: 'left center'}}>
      <div style={{padding: '10px 22px', borderRadius: 999, background: '#ff2d2d', display: 'flex', gap: 10, alignItems: 'center'}}><div style={{width: 16, height: 16, borderRadius: 8, background: '#fff', opacity: fr % 20 < 12 ? 1 : 0.25}} /><T size={30} w={800} style={{letterSpacing: 2}}>WATCH · GAME AUDIO 🔊</T></div>
      <div style={{padding: '10px 22px', borderRadius: 999, background: 'rgba(22,16,38,.92)', border: '2px solid rgba(255,255,255,.75)'}}><T size={30} w={800} style={{letterSpacing: 2}}>{x.label}</T></div></div></>; }});
const sh = (w: string, after = 0, pre = 0.12) => vt(w, after) - pre;
const TOC = [{n: '01', t: 'GET A TAXI', src: 80}, {n: '02', t: 'VESPUCCI ISLAND', src: 640}, {n: '03', t: 'THE GARAGE', src: 786}, {n: '04', t: 'THE ESCAPE', src: 886}];
const Toc: React.FC<{reveal: number[]; locked4?: boolean; lit?: number[]; y?: number}> = ({reveal, locked4 = true, lit = [], y = 250}) => {
  const fr = useCurrentFrame();
  return <div style={{position: 'absolute', left: 0, top: y, width: W, display: 'flex', justifyContent: 'center', gap: 34, perspective: 1400}}>
    {TOC.map((c, i) => { const r = fr >= reveal[i]; const flip = interpolate(fr, [reveal[i], reveal[i] + 8], [180, 0], cl); const isLit = lit[i] !== undefined && fr >= lit[i];
      const lock = i === 3 && locked4;
      return <div key={i} style={{width: 380, height: 470, transform: `rotateY(${r ? flip : 180}deg) rotateX(8deg) translateY(${Math.sin(fr / 20 + i) * 6}px) scale(${isLit ? 1.06 : 1})`, transformStyle: 'preserve-3d', position: 'relative'}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 26, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: `repeating-linear-gradient(45deg, ${PINK} 0 22px, #ff7fda 22px 44px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: GLOW}}><T size={200} color="#fff">?</T></div>
        <div style={{position: 'absolute', inset: 0, borderRadius: 26, backfaceVisibility: 'hidden', overflow: 'hidden', background: '#1c1330', boxShadow: isLit ? `0 0 0 4px ${TEAL}, 0 0 40px ${TEAL}` : GLOW}}>
          <div style={{height: 300, position: 'relative', overflow: 'hidden', filter: lock ? 'blur(14px) brightness(.5)' : 'none'}}>
            <Freeze frame={0}><OffthreadVideo src={SRC} startFrom={f(c.src)} muted style={{width: 534, height: 300, marginLeft: -77}} /></Freeze></div>
          {lock && <div style={{position: 'absolute', top: 100, width: '100%', textAlign: 'center', fontSize: 90}}>🔒</div>}
          <div style={{padding: '22px 24px'}}><T size={28} w={800} color={PINK2} style={{letterSpacing: 4}}>{c.n}</T><T size={46} style={{marginTop: 6}}>{lock ? '???' : c.t}</T></div>
          {isLit && <div style={{position: 'absolute', right: 18, top: 18, width: 64, height: 64, borderRadius: 32, background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><T size={40} color={INK}>✓</T></div>}
        </div></div>; })}
  </div>;
};

const SHOTS: Sh[] = [
  // ── HOOK ─────────────────────────────────────────────────────────────
  {a: 0, C: ({s, d}) => <><Foot src={786.5} rate={0.5} d={d} mv={0} spot={[0.62, 0.62, 0.42, 0.5]} spotT={4} vol={0.25} />
    <Pill t0={L('BRIAN', s)} x={120} y={150} icon="🎬">Brian O'Connor's car</Pill></>},
  {a: sh('GTA 6'), C: ({s, d}) => <><Foot src={822.3} rate={0.55} d={d} mv={3} vol={0.3} /><Title t0={0} y={330} size={170}>GTA 6 HAS IT.</Title></>},
  {a: sh('NEON'), C: ({s, d}) => <><Foot src={827.5} rate={0.45} d={d} mv={2} vol={0.2} />
    <Pill t0={0} x={110} y={170} icon="🟢" hot>Neon green paint</Pill><Pill t0={L('BLUE', s)} x={110} y={270} icon="🔷">Blue & silver side graphics</Pill><Pill t0={L('MASSIVE', s)} x={110} y={370} icon="🪽">Massive rear wing</Pill></>},
  {a: sh('BLACK'), C: ({s, d}) => <><Foot src={834.2} rate={0.4} d={d} mv={1} vol={0.2} /><Mag t0={4} src={834.2 + 4 / 30 * 0.4} rate={0.4} box={[0.4, 0.42, 0.2, 0.2]} at={[1180, 160]} z={2.6} label="Black hood + white decal" d={d} /></>},
  {a: sh("IT'S", 10.0), C: ({s, d}) => { const fr = useCurrentFrame(); const pw = L('PAUL', s); return <Stage bg={[828, 0.5]}>
    <Screen src={822} rate={0.6} x={pw > fr ? 560 : 120} y={300} w={800} d={d} ry={pw > fr ? -8 : -16} />
    <Title t0={L('MIBATSU', s)} y={120} size={92}>MIBATSU '97 PENUMBRA FF</Title>
    {fr >= pw && <>
      <div style={{position: 'absolute', left: 950, top: 470, transform: `scale(${pop(fr - pw, 6, 2).s})`}}><T size={110} color={PINK2}>≈</T></div>
      <div style={{position: 'absolute', left: 1100, top: 330, width: 700, padding: 34, borderRadius: 26, background: 'rgba(24,16,40,.94)', boxShadow: GLOW, transform: `translateX(${interpolate(fr - pw, [0, 8], [500, 0], {...cl, easing: Easing.out(Easing.cubic)})}px) rotateY(10deg)`}}>
        <T size={24} w={800} color={PINK2} style={{letterSpacing: 4}}>THE FAST AND THE FURIOUS · 2001</T><T size={64} style={{marginTop: 12}}>PAUL WALKER'S</T><T size={64} color={PINK}>MITSUBISHI ECLIPSE</T>
        </div><Pill t0={pw + 8} x={1130} y={700} size={26} icon="🎬">Brian O'Connor</Pill></>}
  </Stage>; }},
  {a: sh('YOU', 16.5), C: ({s, d}) => { const fr = useCurrentFrame(); const show = L('SHOW', s);
    const row = (t0: number, icon: string, txt: string, ok: boolean, i: number) => fr >= t0 && fr < show && <div key={i} style={{position: 'absolute', left: 260 + i * 480, top: 330, width: 420, padding: '40px 30px', borderRadius: 26, background: 'rgba(24,16,40,.94)', boxShadow: ok ? `0 0 0 3px ${TEAL}, 0 0 30px ${TEAL}66` : GLOW, textAlign: 'center', transform: `scale(${pop(fr - t0, 6, 1.6).s}) rotateX(8deg)`}}>
      <div style={{fontSize: 110}}>{icon}</div><T size={46} style={{marginTop: 14}}>{txt}</T><T size={70} color={ok ? TEAL : PINK} style={{marginTop: 10}}>{ok ? '✓' : '✕'}</T></div>;
    return <Stage bg={[769.5, 0.6]}>{row(L("CAN'T", s), '💸', "CAN'T BUY IT", false, 0)}{row(L("WON'T", s), '🚦', 'NOT IN TRAFFIC', false, 1)}{row(L('ONE', s, 19), '🏠', 'ONE GARAGE', true, 2)}
      {fr >= show && <Toc reveal={[show + 4, show + 10, show + 16, 99999]} />}
      {fr >= show && <Pill t0={show + 22} x={W / 2} y={830} anchor="c" icon="📍">Exactly where + how to take it</Pill>}</Stage>; }},
  {a: sh('STICK'), C: ({s, d}) => { const fr = useCurrentFrame(); const w = L('WRONG', s); const peek = fr >= w && fr < w + 12;
    return <Stage bg={[880, 0.4]}><Toc reveal={[-99, -99, -99, -99]} locked4={!peek} y={250 - Math.min(1, fr / 20) * 0} />
      <Pill t0={6} x={W / 2} y={830} anchor="c" icon="⚠️" hot>Stick around for chapter 04</Pill>
      {peek && <AbsoluteFill style={{background: 'rgba(255,40,120,.18)'}} />}</Stage>; }},
  // ── 01 GET A TAXI ────────────────────────────────────────────────────
  {a: sh('OKAY'), ch: ['01', 'GET A TAXI'], C: ({s, d}) => <><Foot src={6} rate={0.8} d={d} mv={0} vol={0.2} />
    <Pill t0={L('JASON', s)} x={120} y={150} icon="👤">Jason</Pill><Pill t0={L('MARIANA', s)} x={120} y={240} icon="📍">Mariana County</Pill><Pill t0={L('ANYWHERE', s)} x={120} y={330}>Start anywhere</Pill></>},
  {a: sh('BUT', 33.5), C: ({s, d}) => { const fr = useCurrentFrame(); const r = interpolate(fr, [L('EAST', s) - 6, L('EAST', s) + 18], [0, 1], cl); return <Stage bg={[100, 0.8]}>
    <Screen src={93} freeze x={260} y={150} w={1400} d={d} ry={0} rx={18}>
      <svg width="100%" height="100%" viewBox="0 0 1400 788" style={{position: 'absolute', inset: 0}}><path d="M 470 520 C 640 520, 760 380, 905 330" stroke={PINK} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - r} style={{filter: `drop-shadow(0 0 10px ${PINK})`}} /></svg>
    </Screen>
    <Pill t0={4} x={600} y={560} icon="📍" size={28}>You · Mariana County</Pill><Pill t0={L('EAST', s)} x={1100} y={300} icon="🚗" hot size={28}>The car · East Coast</Pill>
    <Stamp t0={L('LONG', s)} text="LONG TRIP" col={PINK2} x={W / 2} y={900} size={80} /></Stage>; }},
  {a: sh('THE', 37.3), C: ({s, d}) => <><Foot src={78} rate={0.9} d={d} mv={2} vol={0.25} /><Pill t0={L('TAXI', s)} x={120} y={150} icon="🚕" hot>Grab a taxi</Pill><Pill t0={L('TAXI', s) + 10} x={120} y={250}>No wrecked car</Pill></>},
  {a: sh('PULL'), C: ({s, d}) => <><Foot src={31.5} rate={0.55} d={d} mv={0} vol={0.2} spot={[0.55, 0.5, 0.3, 0.45]} spotT={L('CONTACTS', s)} />
    <Pill t0={L('PHONE', s)} x={120} y={150} icon="📱">Phone</Pill><Pill t0={L('CONTACTS', s)} x={120} y={240}>Contacts</Pill><Pill t0={L('PARADISE', s)} x={120} y={330} icon="🚕" hot>Paradise Taxi</Pill></>},
  {a: sh('JASON', 44.5), C: ({s, d}) => <><Foot src={56} rate={1} d={d} mv={5} vol={0.2} /><Pill t0={L('CAMERA', s)} x={120} y={150} icon="📸">Phone camera (optional)</Pill></>},
  {a: sh('ONCE', 57.45), C: ({s, d}) => <><Foot src={79} rate={1.15} d={d} mv={4} vol={0.3} /><Pill t0={L('ORANGE', s)} x={120} y={150} icon="🟠">Orange Paradise Taxi</Pill><Pill t0={L('BACK', s, 52)} x={120} y={240}>Jump in the back</Pill></>},
  // ── 02 THE RIDE ──────────────────────────────────────────────────────
  {a: sh('NOW', 60.15), C: ({s, d}) => { const fr = useCurrentFrame(); return <>
    <Foot src={89.2} rate={0.8} d={d} mv={0} vol={0.15} spot={fr >= L('VESPUCCI', s) ? [0.55, 0.45, 0.35, 0.45] : undefined} spotT={L('VESPUCCI', s)} />
    <Pill t0={L('MARIANA', s, 54)} x={120} y={150} icon="📍">Mariana County</Pill><Pill t0={L('VICE', s, 55)} x={120} y={240} icon="➡️">Vice Dale County</Pill>
    <Pill t0={L('ISLAND', s, 56.5)} x={120} y={330} icon="🏝️">Island chain · East Coast</Pill><Pill t0={L('VESPUCCI', s)} x={120} y={420} icon="🎯" hot>Vespucci Island</Pill>
    <Pill t0={L('NEPTUNE', s, 60)} x={1800} y={150} anchor="r" icon="📌" hot>Waypoint: Neptune Circle</Pill></>; }},
  {a: sh('NOW', 72.45), C: ({s, d}) => { const fr = useCurrentFrame(); const sp = interpolate(fr, [0, 8], [1, 30], cl); return <>
    <Foot src={150} rate={30} d={d} mv={5} grade="contrast(1.1) saturate(1.2)" />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(255,255,255,.08), transparent 15%, transparent 85%, rgba(255,255,255,.08))'}} />
    <Pill t0={0} x={1800} y={150} anchor="r" icon="⏩" hot>{`×${Math.round(sp)} SPEED`}</Pill>
    <Pill t0={L('BRIDGES', s)} x={120} y={150} icon="🌉">A load of bridges</Pill>
    {[['KEYS', 'The Keys'], ['VICE', 'Vice City'], ['HAMLET', 'Hamlet'], ['DOWNTOWN', 'Downtown'], ['PORT', 'Port V.C.']].map(([w, t], i) => <Pill key={i} t0={L(w, s, 69)} x={120 + i * 0} y={240 + i * 90} icon="📍" size={30}>{t}</Pill>)}</>; }},
  {a: sh('THE', 79.95), C: ({s, d}) => <Stage bg={[116, 1]}>
    <Screen src={109} rate={1} x={110} y={210} w={900} d={d} ry={14} />
    <Quote t0={8} x={1060} y={250} w={760} head="🚕 PARADISE TAXI · DRIVER'S STORY" text="Trying to order a drink on a date… and honestly, it does not go well for him." hl="it does not go well for him." th={L('DOES', s, 76)} />
    <Stamp t0={L('WELL', s, 77)} text="IT DID NOT GO WELL" col={PINK} x={1440} y={760} size={58} /></Stage>},
  {a: sh('FLICK'), C: ({s, d}) => <><Foot src={278.5} rate={1} d={d} mv={2} /><Pill t0={L('RADIO', s)} x={120} y={150} icon="📻" hot>Radio → Flash</Pill><Pill t0={L('VIBE', s)} x={120} y={250}>The right vibe</Pill></>},
  // ── 03 VESPUCCI ISLAND ───────────────────────────────────────────────
  // ── PART 2 · ride commentary (VO part 2) ─────────────────────────────
  {a: sh('TIP', 105.4, 0.05), C: ({s, d}) => <><Foot src={118} rate={1.3} d={d} mv={2} />
    <Pill t0={2} x={120} y={150} icon="💡" hot>Tip for the run</Pill><Pill t0={L('SAVE', s)} x={120} y={240} icon="💾">Save your game first</Pill>
    <Stamp t0={L('SPOILER', s)} text="SPOILER: IT WENT WRONG" col={PINK} x={1300} y={300} size={62} /></>},
  {a: sh('ALSO', 111.5), C: ({s, d}) => <><Foot src={232} rate={1.4} d={d} mv={4} />
    <Pill t0={L('TAXI', s)} x={120} y={150} icon="🚕" hot>Taxi &gt; driving yourself</Pill><Pill t0={L('BATTERED', s)} x={120} y={240} icon="🚗💥">Battered car</Pill><Pill t0={L('POLICE', s)} x={120} y={330} icon="🚓">Police on your back</Pill><Pill t0={L('ONE', s)} x={120} y={420} icon="✅">Arrive in one piece</Pill></>},
  {a: sh("LET'S", 121.5), C: ({s, d}) => { const fr = useCurrentFrame(); const y13 = L('2013', s); return <Stage bg={[232, 1]}>
    <Screen src={786.5} rate={0.4} x={110} y={240} w={860} d={d} ry={14} />
    <div style={{position: 'absolute', left: 1040, top: 210, width: 780, padding: 34, borderRadius: 26, background: 'rgba(24,16,40,.94)', boxShadow: GLOW, transform: `translateX(${interpolate(fr, [0, 9], [600, 0], {...cl, easing: Easing.out(Easing.cubic)})}px)`}}>
      <T size={24} w={800} color={PINK2} style={{letterSpacing: 4}}>THE MAN HIMSELF</T><T size={72} style={{marginTop: 8}}>PAUL WALKER</T><T size={40} color={PINK}>as Brian O'Connor</T>
      </div>
    <Pill t0={L('HEART', s)} x={1080} y={470} size={28} icon="❤️">Heart of the series</Pill><Pill t0={L('DOM', s)} x={1080} y={550} size={28} icon="🤝">Alongside Dom</Pill>
    {fr >= y13 && <div style={{position: 'absolute', left: 1040, top: 640, width: 780, padding: '24px 34px', borderRadius: 26, background: 'rgba(24,16,40,.94)', boxShadow: GLOW, transform: `scale(${pop(fr - y13, 6, 1.4).s})`, display: 'flex', alignItems: 'center', gap: 26}}>
      <T size={96} color={PINK2}>2013</T><div><T size={34}>🕊️ Paul died in a car crash</T><T size={28} w={800} color="#cbb8e6">Rocked the fans — and the cast</T></div></div>}</Stage>; }},
  {a: sh('FURIOUS', 141.75), C: ({s, d}) => { const fr = useCurrentFrame(); const sp = L('SPLITTING', s); const k = interpolate(fr, [sp - 4, sp + 30], [0, 1], {...cl, easing: Easing.inOut(Easing.sin)}); return <Stage bg={[858, 0.8]}>
    <Title t0={0} y={90} size={96}>FURIOUS 7</Title>
    <Quote t0={L('ENDING', s) - 4} x={1080} y={300} w={720} head="🎬 THE ENDING" text="One of the most famous tributes in cinema." hl="most famous tributes in cinema" th={L('TRIBUTES', s)} />
    <svg width={900} height={620} style={{position: 'absolute', left: 120, top: 300}}>
      <path d="M 450 620 L 450 330" stroke="#3a2a55" strokeWidth={120} /><path d={`M 450 340 Q 450 ${260 - 40 * k} ${450 - 330 * k} ${40}`} stroke="#3a2a55" strokeWidth={110} fill="none" /><path d={`M 450 340 Q 450 ${260 - 40 * k} ${450 + 330 * k} ${40}`} stroke="#3a2a55" strokeWidth={110} fill="none" />
      <path d="M 450 620 L 450 330" stroke="#fff" strokeWidth={6} strokeDasharray="30 30" opacity={0.5} />
      <text x={450 - 40 - 300 * k} y={420 - 300 * k} fontSize={70} textAnchor="middle">🚗</text><text x={450 + 40 + 300 * k} y={420 - 300 * k} fontSize={70} textAnchor="middle">🏎️</text></svg>
    <Pill t0={L('DOM', s)} x={330} y={240} anchor="c" icon="🤝">Dom & Brian, side by side</Pill>
    <Pill t0={L('SEE', s)} x={1440} y={700} anchor="c" icon="🎵">"See You Again"</Pill>
    <Pill t0={L('TEAR', s)} x={1440} y={800} anchor="c" icon="🥲" hot>If you didn't tear up…</Pill></Stage>; }},
  {a: sh('SO', 157.75), C: ({s, d}) => { const fr = useCurrentFrame(); const so = L('SORT', s); return <>
    {fr >= so && fr < so + 10 ? <Foot src={885} rate={1} d={d} mv={3} grade="saturate(1.4) contrast(1.2)" /> : <Foot src={789} rate={0.4} d={d} mv={0} grade="contrast(1.05) saturate(.95) brightness(.9)" spot={[0.62, 0.6, 0.45, 0.5]} spotT={4} />}
    <Pill t0={L('EASTER', s)} x={120} y={150} icon="🥚">Not just an Easter egg</Pill><Title t0={L('TRIBUTE', s)} y={350} size={120}>A TRIBUTE TO PAUL</Title>
    <Pill t0={so} x={W / 2} y={780} anchor="c" icon="😬" hot>…sort of properly</Pill></>; }},
  {a: sh('THE', 170.25), C: ({s, d}) => { const fr = useCurrentFrame(); const tn = L('TEN', s), ask = L('ASK', s), fi = L('FIRST', s); return <Stage bg={[300, 1]}>
    <div style={{position: 'absolute', left: 140, top: 210, width: 760, textAlign: 'center'}}>
      <T size={28} w={800} color={PINK2} style={{letterSpacing: 6}}>THE FRANCHISE</T>
      <T size={240} style={{textShadow: `0 0 40px ${PINK}`}}>{Math.round(interpolate(fr, [tn - 10, tn + 6], [0, 10], cl))}</T><T size={52}>MAIN FILMS</T>
      </div>
    <Pill t0={L('SPINOFF', s)} x={520} y={700} anchor="c" size={28} icon="➕">A spin-off</Pill><Pill t0={L('MENTAL', s)} x={520} y={790} anchor="c" size={28} icon="🤯">Plots got more and more mental</Pill>
    {fr >= ask && <div style={{position: 'absolute', left: 1000, top: 230, width: 800, padding: 34, borderRadius: 26, background: 'rgba(24,16,40,.94)', boxShadow: GLOW, transform: `scale(${pop(fr - ask, 6, 1.3).s})`}}>
      <T size={24} w={800} color={PINK2} style={{letterSpacing: 4}}>FANS' FAVOURITE ERA</T><T size={70} style={{marginTop: 10}}>{fr >= fi ? 'THE FIRST ONE' : '…'}</T>
      {['SMALL', 'GRIMY', 'CARS'].map((w, i) => fr >= L(w, s) && <span key={i} style={{display: 'inline-block', marginTop: 18, marginRight: 12, padding: '8px 18px', borderRadius: 999, background: i === 2 ? PINK : 'rgba(255,255,255,.12)'}}><T size={30}>{['Small', 'Grimy', 'All about the cars'][i]}</T></span>)}</div>}
    <Screen src={829} rate={0.5} x={1060} y={640} w={560} d={d} ry={-10} t0={L('POSTER', s) - 6} />
    <Pill t0={L('POSTER', s)} x={1660} y={760} anchor="c" size={26} icon="🖼️">The poster car</Pill></Stage>; }},
  {a: sh('LOOK', 186.25), C: ({s, d}) => { const fr = useCurrentFrame(); const k = L('KEYS', s); return <><Foot src={fr < k ? 205 : 262} rate={fr < k ? 1.3 : 1.2} d={d} mv={2} />
    <Pill t0={L('PALM', s)} x={120} y={150} icon="🌴">Palm trees</Pill><Pill t0={L('WATER', s)} x={120} y={240} icon="🌊">Water on both sides</Pill><Pill t0={L('UNREAL', s)} x={120} y={330} icon="🤩" hot>Leonida looks unreal</Pill>
    <Pill t0={k} x={1800} y={150} anchor="r" icon="🌴">The Keys = Florida Keys</Pill><Pill t0={L('MIAMI', s)} x={1800} y={240} anchor="r" icon="🌆" hot>Vice City = Miami</Pill></>; }},
  {a: sh('QUICK', 198.75), C: ({s, d}) => { const fr = useCurrentFrame(); const opts: [string, string, number][] = [['CHARGER', "Dom's Charger", 46], ['SUPRA', "Brian's orange Supra", 38], ['SOMETHING', 'Something else?', 16]]; return <Stage bg={[420, 1]}>
    <div style={{position: 'absolute', left: 260, top: 160, width: 1400, padding: '36px 44px', borderRadius: 30, background: 'rgba(24,16,40,.94)', boxShadow: GLOW, transform: `scale(${pop(fr, 7, 1.3).s})`}}>
      <T size={26} w={800} color={PINK2} style={{letterSpacing: 4}}>❓ QUICK QUESTION</T><T size={58} style={{marginTop: 10}}>One Fast & Furious car into GTA 6 — which one?</T>
      {opts.map(([w, lab, v], i) => { const t0 = L(w, s); const on = fr >= t0; const fill = interpolate(fr, [t0, t0 + 20], [0, v], cl); return <div key={i} style={{marginTop: 22, height: 92, borderRadius: 46, background: 'rgba(255,255,255,.08)', position: 'relative', overflow: 'hidden', opacity: on ? 1 : 0.25}}>
        <div style={{position: 'absolute', inset: 0, width: `${fill}%`, background: `linear-gradient(90deg, ${VIO}, ${PINK})`}} /><div style={{position: 'absolute', left: 34, top: 18}}><T size={48}>{lab}</T></div></div>; })}
      <div style={{marginTop: 26}}>{fr >= L('COMMENTS', s) && <Pill t0={L('COMMENTS', s)} x={0} y={0} icon="💬" hot>Comment — it decides the next video</Pill>}</div>
    </div></Stage>; }},
  {a: sh('AND', 213.25), C: ({s, d}) => <Stage bg={[560, 1]}>
    <Screen src={196} rate={1} x={110} y={210} w={900} d={d} ry={14} />
    <Quote t0={6} x={1060} y={250} w={760} head="🚕 PARADISE TAXI · UPDATE" text="The driver is STILL going with the bartender story. He has not given up once." hl="has not given up once." th={L('GIVEN', s)} />
    <Stamp t0={L('RESPECT', s)} text="RESPECT 🫡" col={TEAL} x={1440} y={760} size={70} />
    <Pill t0={L('RUBBISH', s)} x={1440} y={880} anchor="c" icon="😂">Rubbish chat-up line? Blame Paradise Taxi</Pill></Stage>},
  {a: sh('OK', 223.75), C: ({s, d}) => { const fr = useCurrentFrame(); return <><Foot src={560} rate={1.2} d={d} mv={1} />
    <Pill t0={L('CLOSE', s)} x={120} y={150} icon="📍">Getting close</Pill>
    {fr >= L('TEMPT', s) && <div style={{position: 'absolute', left: 1080, top: 200, width: 720, padding: 30, borderRadius: 26, background: 'rgba(40,10,24,.92)', boxShadow: `0 0 0 3px ${PINK}, 0 0 30px ${PINK}88`, transform: `scale(${pop(fr - L('TEMPT', s), 6, 1.4).s})`}}>
      <T size={26} w={800} color={PINK2} style={{letterSpacing: 4}}>⚠️ WARNING</T><T size={56} style={{marginTop: 8}}>DON'T DO ANYTHING SILLY</T><T size={36} color="#e8d6ff" style={{marginTop: 8}}>Just drive off calmly.</T></div>}
    <Stamp t0={L('LISTEN', s)} text="(HE DIDN'T)" col={PINK} x={1440} y={640} size={72} /></>; }},
  {a: sh('AND', 236.25), ch: ['02', 'VESPUCCI ISLAND'], C: ({s, d}) => <><Foot src={603} rate={1} d={d} mv={1} />
    <Pill t0={L('HOP', s)} x={120} y={150} icon="🚕">Hop out</Pill><Pill t0={L('RICH', s)} x={120} y={240} icon="💰">The rich side of Leonida</Pill><Pill t0={L('PALM', s)} x={120} y={330} icon="🌴">Palm trees</Pill>
    <Pill t0={L('HEDGES', s)} x={120} y={420} icon="🌳">Hedges taller than a house</Pill><Pill t0={L('LUXURY', s)} x={120} y={510} icon="🏡">Luxury homes</Pill></>},
  {a: sh("WE'VE", 244.75), C: ({s, d}) => { const fr = useCurrentFrame(); const m = L('MILLIONAIRES', s); return <Stage bg={[645, 0.6]}>
    <Screen src={8} rate={0.6} x={130} y={270} w={760} d={d} ry={14} /><Pill t0={4} x={510} y={760} anchor="c" icon="🪵">$0 floorboard</Pill>
    <div style={{position: 'absolute', left: 905, top: 420, transform: `scale(${pop(fr - 8, 6, 2).s})`}}><T size={110} color={PINK2}>→</T></div>
    <Screen src={645} rate={0.6} x={1030} y={270} w={760} d={d} ry={-14} t0={m - 4} /><Pill t0={m} x={1410} y={760} anchor="c" icon="💎" hot>Millionaire's Row</Pill>
    <Pill t0={L('CAB', s)} x={W / 2} y={880} anchor="c" icon="🚕">…in one cab ride</Pill></Stage>; }},
  {a: sh('OPEN', 249.25), C: ({s, d}) => <><Foot src={720.2} rate={0.9} d={d} mv={0} spot={[0.5, 0.5, 0.3, 0.42]} spotT={L('NEPTUNE', s)} />
    <Pill t0={4} x={120} y={150} icon="🗺️">Check the map</Pill><Pill t0={L('VESPUCCI', s)} x={120} y={240} icon="🏝️">Vespucci Island</Pill><Pill t0={L('NEPTUNE', s)} x={1800} y={150} anchor="r" icon="📌" hot>Neptune Circle</Pill></>},
  {a: sh('NOW', 255.55), C: ({s, d}) => <><Foot src={666} rate={1.05} d={d} mv={5} />
    <Pill t0={L('VANS', s)} x={120} y={150} icon="🚐">Work vans</Pill><Pill t0={L("MILLER'S", s)} x={120} y={240} icon="🏗️">Miller's Destruction Co.</Pill><Pill t0={L('AVENUE', s)} x={120} y={330} icon="🏗️">Avenue Contractors</Pill><Pill t0={L('HEDGES', s)} x={120} y={420} icon="🏃">Keep going past the hedges</Pill></>},
  {a: sh('EVERY', 264.25), C: ({s, d}) => <><Foot src={769.2} rate={0.55} d={d} mv={0} spot={[0.5, 0.48, 0.38, 0.48]} spotT={L('BIG', s)} />
    <Pill t0={L('HUGE', s)} x={120} y={150} icon="🏘️">Every house is huge</Pill><Pill t0={L('MODERN', s)} x={120} y={240} icon="⬜">Big modern white house</Pill><Pill t0={L('CLOSED', s)} x={120} y={330} icon="🚗">Closed two-car garage</Pill>
    <Stamp t0={L("THAT'S", s)} text="THAT'S THE ONE" col={TEAL} x={W / 2} y={820} size={78} /></>},
  {a: sh('WALK', 270.25), ch: ['03', 'THE GARAGE'], C: ({s, d}) => <><Foot src={772} rate={1} d={d} mv={4} /><Sfx at={L('BREAK', s)} n="tick" v={0.6} />
    <Pill t0={L('BREAK', s)} x={120} y={150} icon="🔓" hot>"Break in"</Pill><Pill t0={L('LOCK', s)} x={120} y={240} icon="🎯">Lock-picking minigame</Pill></>},
  {a: sh("THERE'S", 276.25), C: ({s, d}) => <><Foot src={777} rate={0.9} d={d} mv={0} spot={[0.5, 0.47, 0.25, 0.32]} spotT={2} />
    <Mag t0={6} src={777 + 6 / 30 * 0.9} rate={0.9} box={[0.44, 0.38, 0.12, 0.18]} at={[1240, 200]} z={3.2} label="Spinning wheel" d={d} />
    {[0, 1, 2, 3, 4].map((k) => <Sfx key={k} at={12 + k * 22} n="tick" v={0.35} />)}
    <Pill t0={L('TIME', s)} x={120} y={150} icon="⏱️" hot>Time it just right</Pill><Pill t0={L('PANIC', s)} x={120} y={240} icon="🚫">Don't spam the button</Pill><Pill t0={L('BREATH', s)} x={120} y={330} icon="😮‍💨">Take a breath</Pill></>},
  {a: sh('AND', 286.15), C: ({s, d}) => { const fr = useCurrentFrame(); const items: [string, string][] = [['GREEN', 'Green paint'], ['SIDE', 'Side graphics'], ['MASSIVE', 'Massive spoiler']]; const th = L('THERE', s); return <>
    <Foot src={783.4} rate={0.6} d={d} mv={1} spot={[0.62, 0.6, 0.45, 0.5]} spotT={L('LIGHTS', s)} /><Sfx at={L('DOOR', s)} n="door" v={0.7} />
    {fr >= th && fr < th + 4 && <AbsoluteFill style={{background: '#fff', opacity: 0.5}} />}
    <Title t0={L('MIBATSU', s)} y={110} size={96}>MIBATSU '97 PENUMBRA FF</Title>
    <div style={{position: 'absolute', left: 90, top: 330, width: 560, padding: '28px 30px', borderRadius: 26, background: 'rgba(24,16,40,.9)', boxShadow: GLOW, opacity: fr >= L('GREEN', s) - 4 ? 1 : 0}}>
      <T size={24} w={800} color={PINK2} style={{letterSpacing: 4}}>MOVIE-ACCURATE CHECK</T>
      {items.map(([w, t], i) => { const on = fr >= L(w, s); return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 18, opacity: on ? 1 : 0.3}}>
        <div style={{width: 48, height: 48, borderRadius: 12, background: on ? TEAL : 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${on ? pop(fr - L(w, s), 5, 1.8).s : 1})`}}><T size={34} color={INK}>{on ? '✓' : ''}</T></div><T size={42}>{t}</T></div>; })}
    </div>
    <Stamp t0={L('EXACTLY', s)} text="EXACTLY LIKE THE MOVIE" col={TEAL} x={1240} y={900} size={70} /><Pill t0={L('BEAUTIFUL', s)} x={1800} y={150} anchor="r" icon="😍" hot>A beautiful sight</Pill></>; }},
  {a: sh('WALK', 301.75), C: ({s, d}) => { const fr = useCurrentFrame(); const g = L('GLASS', s); return <>
    <Foot src={803.8} rate={1.2} d={d} mv={5} /><Sfx at={g} n="glass" v={0.8} /><Pill t0={L('LOCKED', s)} x={120} y={150} icon="🔒">Locked</Pill><Pill t0={L('SMASH', s)} x={120} y={240} icon="💥" hot>Smash the window</Pill>
    {fr >= g && fr < g + 3 && <AbsoluteFill style={{background: '#fff', opacity: 0.45}} />}<Pill t0={L('CLIMBS', s)} x={120} y={330} icon="🪟">Climbs in</Pill></>; }},
  {a: sh('LOOK', 308.75), C: ({s, d}) => <><Foot src={815.2} rate={0.45} d={d} mv={0} />
    <Mag t0={L('BOTTOM', s) - 2} src={815.2 + (L('BOTTOM', s) - 2) / 30 * 0.45} rate={0.45} box={[0.005, 0.705, 0.14, 0.085]} at={[640, 260]} z={3} label="Name confirmed" d={d} />
    <Stamp t0={L('CONFIRM', s) + 4} text="✓ YOU'VE GOT IT" col={TEAL} x={W / 2} y={170} size={84} rot={-4} /></>},
  {a: sh('NOW', 315.3), ch: ['04', 'THE ESCAPE'], C: ({s, d}) => { const fr = useCurrentFrame(); return <><Foot src={818.6} rate={0.7} d={d} mv={1} vol={0.3} />
    <Pill t0={L('LEAVE', s)} x={120} y={150} icon="🤫" hot>Leave quietly</Pill>{fr >= L('HAPPENED', s) && <AbsoluteFill style={{background: 'linear-gradient(transparent 60%, rgba(255,40,120,.25))'}} />}</>; }},
  {a: sh('AS', 318.8), C: ({s, d}) => { const fr = useCurrentFrame(); const cop = L('COP', s); return <>
    {fr < cop ? <Foot src={816} rate={1} d={d} mv={2} vol={0.35} /> : <Sequence from={cop}><Foot src={838.6} rate={0.75} d={d} mv={3} vol={0.4} spot={[0.48, 0.5, 0.22, 0.4]} spotT={2} /></Sequence>}
    <Pill t0={L('CRIME', s, 149)} x={120} y={150} icon="🚨" hot>Crime reported</Pill><Pill t0={cop + 4} x={120} y={240} icon="👮">Cop in the road</Pill><Pill t0={L('STOP', s, 153)} x={120} y={330}>"Stop!"</Pill></>; }},
  {a: sh('JASON', 325.3), C: ({s, d}) => { const fr = useCurrentFrame(); const p = L('PUNCH', s, 156.5); const frz = fr >= p && fr < p + 26; return <>
    {frz ? <Sequence from={p}><Foot src={844.8} freeze d={1} mv={0} grade="contrast(1.25) saturate(1.3)" /></Sequence> : <Foot src={fr < p ? 842.2 : 845.7} rate={0.9} d={d} mv={5} vol={0.45} />}
    <Pill t0={L('SORRY', s)} x={120} y={150} icon="🙏">"Sorry"</Pill><Sfx at={L('PUNCH', s)} n="punch" v={0.9} />
    {frz && <><AbsoluteFill style={{background: fr < p + 3 ? 'rgba(255,255,255,.5)' : 'transparent'}} /><Stamp t0={p + 1} text="ONE PUNCH 👊" col={PINK} x={W / 2} y={540} size={120} /></>}
    <Pill t0={L("DON'T", s, 157)} x={1800} y={150} anchor="r" icon="🤷">Don't ask why</Pill></>; }},
  {a: sh('BACK', 338.3), C: ({s, d}) => <><Foot src={849.5} rate={1.1} d={d} mv={4} vol={0.4} /><Title t0={L('MOST', s, 161)} y={330} size={110}>THE MOST FAST & FURIOUS THING POSSIBLE</Title></>},
  {a: sh('I', 342.6), C: ({s, d}) => { const fr = useCurrentFrame(); const tb = L('T-BONED', s); return <>
    <Foot src={865.2} rate={fr < tb - 10 ? 1 : 0.45} d={d} mv={3} vol={0.55} />
    <Pill t0={L('INTERSECTION', s)} x={120} y={150} icon="⚡">Way too fast</Pill><Pill t0={L('BACK', s, 165)} x={120} y={240} icon="🌀">Lost the back end</Pill>
    {fr >= tb && fr < tb + 4 && <AbsoluteFill style={{background: '#fff', opacity: 0.5}} />}<Sfx at={tb} n="crash" v={0.9} /><Stamp t0={tb} text="T-BONED" col={PINK} x={1360} y={300} size={110} rot={-8} /></>; }},
  {a: sh('SPARKS', 347.3), C: ({s, d}) => <><Foot src={869.4} rate={0.35} d={d} mv={6} vol={0.5} grade="contrast(1.15) saturate(1.3)" />
    <Pill t0={0} x={120} y={150} icon="✨">Sparks everywhere</Pill><Pill t0={L("HOOD'S", s)} x={120} y={240} icon="🪫">Hood crumpled</Pill><Pill t0={L('ENGINE', s, 170)} x={120} y={330} icon="⚠️" hot>Engine damaged</Pill></>},
  {a: sh('I', 356.4), C: ({s, d}) => { const fr = useCurrentFrame(); const st = L('STUCK', s); return <>
    {fr < st ? <Foot src={878} rate={1.45} d={d} mv={5} vol={0.55} /> : <Sequence from={st}><Foot src={888.4} freeze d={1} mv={0} grade="contrast(1.2) saturate(.9)" /></Sequence>}
    <Pill t0={L('OFF', s, 173)} x={120} y={150} icon="🛣️">Straight off the road</Pill><Pill t0={L('ROAD', s, 175)} x={120} y={240} icon="🚧" hot>Road closed barrier</Pill>
    <Sfx at={L('SMASHED', s)} n="crash" v={0.8} /><Stamp t0={st} text="STUCK." col={PINK} x={W / 2} y={540} size={140} /></>; }},
  {a: sh('SO', 363.8), C: ({s, d}) => <><Foot src={891} rate={0.5} d={d} mv={0} vol={0.2} grade="grayscale(.65) contrast(1.1) brightness(.85)" />
    <Pill t0={L('LESSON', s)} x={W / 2} y={200} anchor="c" icon="📚">Lesson learned</Pill><Title t0={L('BRIAN', s, 180)} y={430} size={104}>BRIAN WOULD BE ASHAMED</Title></>},
  // ── RECAP (pays off the "?" grid) + CTA ───────────────────────────────
  {a: sh('BUT', 366.2), C: ({s, d}) => { const fr = useCurrentFrame(); return <Stage bg={[829, 0.5]}>
    <Title t0={0} y={90} size={74}>THE FAST & FURIOUS CAR · GTA 6</Title>
    <Toc reveal={[-99, -99, -99, -99]} locked4={false} lit={[L('TAXI', s, 186), L('NEPTUNE', s, 188), L('GARAGE', s, 190), L('DRIVE', s, 192)]} y={260} />
    <Pill t0={L('SMASH', s, 191)} x={W / 2} y={790} anchor="c" icon="💥">Smash the window</Pill>
    <Pill t0={L('BETTER', s, 194)} x={W / 2} y={880} anchor="c" icon="😅" hot>Just drive better than I did</Pill></Stage>; }},
  {a: sh('IF', 379.1), C: ({s, d}) => { const fr = useCurrentFrame(); const lk = L('LIKE', s, 195.5), sb = L('SUBSCRIBE', s), cm = L('COMMENT', s, 196); const tap = fr >= sb + 8; return <Stage bg={[786.5, 0.5]}>
    <Screen src={786.5} rate={0.5} x={140} y={240} w={820} d={d} ry={14} />
    <div style={{position: 'absolute', left: 1080, top: 270, display: 'flex', gap: 26}}>
      <div style={{padding: '22px 36px', borderRadius: 999, background: fr >= lk + 6 ? PINK : '#2a2040', transform: `scale(${pop(fr - lk, 6, 1.6).s})`, opacity: fr >= lk ? 1 : 0}}><T size={46}>👍 LIKE</T></div>
      <div style={{padding: '22px 36px', borderRadius: 999, background: tap ? '#3a3350' : '#ff2a2a', transform: `scale(${fr >= sb ? pop(fr - sb, 6, 1.6).s : 0})`}}><T size={46}>{tap ? '✓ SUBSCRIBED' : 'SUBSCRIBE'}</T></div></div>
    {fr >= sb && <div style={{position: 'absolute', left: interpolate(fr, [sb, sb + 8], [1700, 1500], cl), top: interpolate(fr, [sb, sb + 8], [520, 330], cl), fontSize: 110}}>👆</div>}
    <Quote t0={cm} x={1080} y={470} w={720} head="💬 COMMENT BELOW" text="Which movie car should I find next in GTA 6?" hl="Which movie car" th={cm + 6} />
    <Pill t0={6} x={1080} y={180} icon="🎮">@PatientGTA</Pill></Stage>; }},
];

const ALL: Sh[] = [...SHOTS, ...TAPES.map(TapeShot)].sort((p, q) => p.a - q.a);
/* captions (lower third, 2–4 words; pink key words) */
const KEY = new Set(['GTA 6', 'MIBATSU', 'PENUMBRA', 'FF', 'PAUL', "WALKER'S", 'ECLIPSE', 'TAXI', 'PARADISE', 'VESPUCCI', 'ISLAND', 'NEPTUNE', 'CIRCLE', 'GARAGE', 'WRONG', 'FAST', 'FURIOUS', 'PUNCH', 'T-BONED', 'STUCK', 'BRIAN', 'SUBSCRIBE', 'ONCE', 'QUIETLY', 'COP', 'CRIME']);
const CH = (() => { const out: {t: number; ws: string[]}[] = []; VOW.forEach(([w, t], i) => { const l = out[out.length - 1]; const gap = i ? t - VOW[i - 1][1] : 9;
  if (l && l.ws.length < 4 && gap < 0.45 && l.ws.join(' ').length + w.length < 22) l.ws.push(w); else out.push({t, ws: [w]}); }); return out; })();
const Caps: React.FC = () => { const fr = useCurrentFrame(); const t = fr / FPS; let k = -1; CH.forEach((c, i) => { if (c.t <= t + 0.02) k = i; }); if (k < 0) return null; const c = CH[k]; if (t - c.t > 1.4) return null;
  return <div style={{position: 'absolute', bottom: 70, width: W, textAlign: 'center'}}>
    <span style={{display: 'inline-block', padding: '10px 26px', borderRadius: 18, background: 'rgba(14,8,24,.72)'}}>
      {c.ws.map((w, i) => <span key={i} style={{fontFamily: 'HeroBlack', fontSize: 54, margin: '0 9px', color: KEY.has(w) ? PINK : '#fff', textShadow: '0 3px 0 rgba(0,0,0,.6)'}}>{w}</span>)}</span></div>; };

export const PwLong: React.FC = () => {
  const ready = useFontsReady('pw1'); const fr = useCurrentFrame(); if (!ready) return <AbsoluteFill style={{background: INK}} />;
  const t = fr / FPS; let si = 0; ALL.forEach((x, i) => { if (f(x.a) <= fr) si = i; }); const lf = fr - f(ALL[si].a);
  const whip = si > 0 && lf < 5 ? interpolate(lf, [0, 5], [1, 0], cl) : 0; let chap = ['', '']; ALL.forEach((x) => { if (x.ch && f(x.a) <= fr) chap = x.ch; });
  return <AbsoluteFill style={{background: INK}}>
    <AbsoluteFill style={{filter: whip > 0 ? `blur(${whip * 10}px)` : 'none', transform: `scale(${1 + whip * 0.05})`}}>
      {ALL.map((x, i) => { const from = f(x.a), dur = (i < ALL.length - 1 ? f(ALL[i + 1].a) : PW_FRAMES) - from;
        return <Sequence key={i} from={from} durationInFrames={dur}><x.C s={x.a} d={dur / FPS} />{x.ch && <Chapter n={x.ch[0]} title={x.ch[1]} />}<Sequence durationInFrames={12}><Audio src={staticFile(x.ch ? 'pw/impact.wav' : 'pw/whoosh.wav')} volume={x.ch ? 0.6 : 0.3} /></Sequence></Sequence>; })}
    </AbsoluteFill>
    {chap[0] && <div style={{position: 'absolute', right: 60, top: 60, display: 'flex', gap: 10, alignItems: 'center', padding: '10px 20px', borderRadius: 999, background: 'rgba(22,16,38,.85)', border: '2px solid rgba(255,255,255,.5)'}}>
      <T size={24} w={800} color={PINK2} style={{letterSpacing: 3}}>{chap[0]}</T><T size={24} w={800} style={{letterSpacing: 3}}>{chap[1]}</T></div>}
    <div style={{position: 'absolute', left: 60, top: 60, padding: '8px 18px', borderRadius: 12, background: `linear-gradient(90deg, ${PINK}, ${VIO})`, opacity: t > 0.5 ? 1 : 0}}><T size={26} w={800} style={{letterSpacing: 2}}>@PATIENTGTA</T></div>
    <Caps />
    <div style={{position: 'absolute', left: 0, bottom: 0, height: 6, width: `${(fr / PW_FRAMES) * 100}%`, background: `linear-gradient(90deg, ${VIO}, ${PINK})`}} />
    <Audio src={staticFile('pw/vo_full2.wav')} />
    <Audio src={staticFile('pw/bed.wav')} volume={(i: number) => (inTape(i / FPS) ? 0.3 : 1)} />
  </AbsoluteFill>;
};
