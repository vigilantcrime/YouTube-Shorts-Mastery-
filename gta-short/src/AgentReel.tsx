/* @agentbrand47 — first reel. Style reverse-engineered from the "Neuron Visuals" diving-board loop:
   pure black, glowing white stick figures, grey lattice diving tower, dark reflective water, splash particles,
   dot-matrix labels, one continuous shot, music only.
   Story: two creators start the same day. WHEN IT'S READY dives (posts) once a week; EVERY DAY dives daily for 90 days.
   Each dive releases follower orbs into the water; counters compound. Numbers are an illustrative model. */
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, interpolate, Easing, delayRender, continueRender} from 'remotion';
import data from './ab.json';
import {cl} from './kit3d';

const W = 1080, H = 1920, FPS = 30;
export const AB_FRAMES = Math.round(data.T * FPS);
const BOARD = 905, WATER = 1300, TIPL = 215, TIPR = 865;
const WHITE = '#f4f6f8';
const rnd = (i: number) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

const useFont = () => {
  const [h] = React.useState(() => delayRender('silk')); const [ok, setOk] = React.useState(false);
  React.useEffect(() => { const ff = new FontFace('Silk', `url(${staticFile('ab/silk.woff2')})`); ff.load().then((x) => { document.fonts.add(x); setOk(true); continueRender(h); }); }, [h]);
  return ok;
};
const Px: React.FC<{size: number; children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({size, children, color = WHITE, style}) =>
  <div style={{fontFamily: 'Silk', fontSize: size, color, letterSpacing: size * 0.12, lineHeight: 1.15, whiteSpace: 'nowrap', ...style}}>{children}</div>;

/* ---------- model ---------- */
const DS = data.daily as number[], WS = data.weekly as number[], DV = data.dview as number[], WV = data.wview as number[];
const DSPL = 0.42, WSPL = 0.62;   // splash offsets
const dayAt = (t: number) => (t < 0.4 ? 1 : t < 4.6 ? 1 + (t - 0.4) / 0.7 : t < 12.8 ? 7 + 83 * ((t - 4.6) / 8.2) ** 1.7 : 90);
const viewsAt = (t: number, starts: number[], vals: number[], off: number) => starts.reduce((s, st, i) => s + vals[i] * interpolate(t, [st + off, st + off + 0.35], [0, 1], cl), 0);
const offersAt = (fol: number) => (fol < 1000 ? 0 : 1 + Math.floor((fol - 1000) / 1500));
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

/* ---------- stick figure ---------- */
type Pose = 'stand' | 'think' | 'dive' | 'crouch' | 'cheer';
const Fig: React.FC<{x: number; y: number; rot?: number; pose: Pose; face?: 1 | -1; k?: number; op?: number}> = ({x, y, rot = 0, pose, face = 1, k = 0, op = 1}) => {
  // y = feet. Units: head r 19, torso 70, legs 78, arms 62
  const crouch = pose === 'crouch' ? 18 : 0; const hipY = -78 + crouch, neckY = hipY - 70, headY = neckY - 26;
  const legs = pose === 'crouch' ? `M0 ${hipY} L${12 * face} ${hipY + 36} L0 0 M0 ${hipY} L${-6 * face} ${hipY + 38} L${-4 * face} 0` :
    pose === 'dive' ? `M0 ${hipY} L6 ${hipY + 40} L2 0 M0 ${hipY} L-2 ${hipY + 42} L-6 2` : `M0 ${hipY} L${8 + Math.sin(k) * 3} 0 M0 ${hipY} L${-8 - Math.sin(k) * 3} 0`;
  const sh = neckY + 10;
  const arms = pose === 'dive' ? `M0 ${sh} L9 ${headY - 46} M0 ${sh} L-9 ${headY - 46}` :
    pose === 'think' ? `M0 ${sh} L${-10 * face} ${sh + 58} M0 ${sh} L${22 * face} ${sh + 34} L${8 * face} ${headY + 16}` :
    pose === 'crouch' ? `M0 ${sh} L${-28 * face} ${sh + 46} M0 ${sh} L${-22 * face} ${sh + 50}` :
    pose === 'cheer' ? `M0 ${sh} L${30} ${sh - 50 + Math.sin(k) * 6} M0 ${sh} L${-30} ${sh - 50 - Math.sin(k) * 6}` :
    `M0 ${sh} L${10 + Math.sin(k) * 2} ${sh + 60} M0 ${sh} L${-10 - Math.sin(k) * 2} ${sh + 60}`;
  return <g transform={`translate(${x} ${y}) scale(1.2) rotate(${rot} 0 ${hipY - 30})`} opacity={op}>
    <path d={`M0 ${neckY} L0 ${hipY} ${legs} ${arms}`} stroke={WHITE} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx={0} cy={headY} r={19} fill={WHITE} />
  </g>;
};
/** one dive: from board tip into the water. dir +1 = right, -1 = left */
const Dive: React.FC<{t: number; t0: number; dir: 1 | -1; tip: number; crouch: number; flight: number; ghost?: boolean}> = ({t, t0, dir, tip, crouch, flight, ghost}) => {
  const lt = t - t0; if (lt < 0 || lt > crouch + flight) return null;
  if (lt < crouch) return <Fig x={tip} y={BOARD} pose="crouch" face={dir} />;
  const s = (lt - crouch) / flight; const x0 = tip, y0 = BOARD - 100, x1 = tip + dir * 150, y1 = WATER + 70;
  const cx = x0 + (x1 - x0) * s, cy = y0 + (y1 - y0) * s * s - 4 * 105 * s * (1 - s);
  return <Fig x={cx} y={cy + 100} rot={dir * (20 + 160 * Math.min(1, s * 1.15))} pose="dive" op={interpolate(s, [0, 0.08], [0.6, 1], cl) * (ghost ? 0.45 : 1)} />;
};
const Splash: React.FC<{t: number; at: number; x: number; big?: number; seed: number}> = ({t, at, x, big = 1, seed}) => {
  const lt = t - at; if (lt < 0 || lt > 1.4) return null;
  const parts = Array.from({length: Math.round(22 * big)}, (_, i) => { const a = -Math.PI / 2 + (rnd(seed * 31 + i) - 0.5) * 1.6; const v = (260 + rnd(seed * 7 + i) * 380) * big;
    const px = x + Math.cos(a) * v * lt, py = WATER + Math.sin(a) * v * lt + 0.5 * 1500 * lt * lt; return py <= WATER + 6 ? <circle key={i} cx={px} cy={py} r={2.5 + rnd(i + seed) * 3.5} fill={WHITE} opacity={Math.max(0, 1 - lt / 0.9)} /> : null; });
  const r = interpolate(lt, [0, 1.4], [8, 150 * big], {...cl, easing: Easing.out(Easing.cubic)});
  return <g>{parts}<ellipse cx={x} cy={WATER + 8} rx={r} ry={r * 0.14} fill="none" stroke={WHITE} strokeWidth={2.5} opacity={Math.max(0, 0.8 - lt / 1.4)} /></g>;
};

/* ---------- diving tower ---------- */
const Tower: React.FC = () => {
  const legs = [470, 520, 560, 610]; const g = '#8f959c';
  return <g stroke={g} strokeWidth={4} fill="none">
    {legs.map((lx) => <line key={lx} x1={lx} y1={BOARD} x2={lx} y2={WATER + 40} />)}
    {Array.from({length: 9}, (_, i) => { const y = BOARD + 20 + i * 44; return <g key={i}><line x1={470} y1={y} x2={520} y2={y + 44} strokeWidth={2.5} /><line x1={520} y1={y} x2={470} y2={y + 44} strokeWidth={2.5} />
      <line x1={560} y1={y} x2={610} y2={y + 44} strokeWidth={2.5} /><line x1={610} y1={y} x2={560} y2={y + 44} strokeWidth={2.5} /><line x1={520} y1={y} x2={560} y2={y} strokeWidth={2} /></g>; })}
    {/* railings */}
    <path d={`M470 ${BOARD} L470 ${BOARD - 60} L520 ${BOARD - 60} L520 ${BOARD} M560 ${BOARD} L560 ${BOARD - 60} L610 ${BOARD - 60} L610 ${BOARD}`} strokeWidth={4} />
    {[480, 490, 500, 510, 570, 580, 590, 600].map((x) => <line key={x} x1={x} y1={BOARD - 60} x2={x} y2={BOARD} strokeWidth={1.5} />)}
    {/* boards */}
    <line x1={470} y1={BOARD} x2={TIPL - 25} y2={BOARD} stroke="#d9dde2" strokeWidth={7} strokeLinecap="round" />
    <line x1={610} y1={BOARD} x2={TIPR + 25} y2={BOARD} stroke="#d9dde2" strokeWidth={7} strokeLinecap="round" />
    <line x1={TIPL - 25} y1={BOARD} x2={TIPL - 5} y2={BOARD} stroke="#e0262b" strokeWidth={7} strokeLinecap="round" />
    <line x1={TIPR + 5} y1={BOARD} x2={TIPR + 25} y2={BOARD} stroke="#e0262b" strokeWidth={7} strokeLinecap="round" />
  </g>;
};

export const AgentReel: React.FC = () => {
  const ok = useFont(); const fr = useCurrentFrame(); if (!ok) return <AbsoluteFill style={{background: '#030406'}} />;
  const t = fr / FPS; const day = Math.min(90, Math.floor(dayAt(t)));
  const dv = viewsAt(t, DS, DV, DSPL), wv = viewsAt(t, WS, WV, WSPL); const df = dv * 0.015, wf = wv * 0.015;
  const dvid = DS.filter((s) => s + DSPL <= t).length, wvid = WS.filter((s) => s + WSPL <= t).length;
  const doff = offersAt(df), woff = offersAt(wf);
  const end = t >= 12.8; const push = interpolate(t, [0, data.T], [1, 1.035], cl);
  // weekly figure: thinks/paces unless mid-dive
  const wDiving = WS.some((s) => t >= s && t < s + 0.15 + 0.47); const wBack = WS.some((s) => t >= s + 0.62 && t < s + 0.9);
  const wx = 255 + Math.sin(t * 1.4) * 22; const wface: 1 | -1 = Math.cos(t * 1.4) > 0 ? 1 : -1;
  const dDivingNow = DS.some((s) => t >= s && t < s + 0.07);
  // orbs (followers)
  const orbs = (fol: number, side: 'l' | 'r') => { const n = Math.min(170, Math.floor(fol / 45)); const x0 = side === 'l' ? 20 : 640, x1 = side === 'l' ? 440 : 1060;
    return Array.from({length: n}, (_, i) => { const ox = x0 + rnd(i * 3 + (side === 'l' ? 1 : 2)) * (x1 - x0), oy = WATER + 36 + rnd(i * 5 + 9) * 210 + Math.sin(t * 1.6 + i) * 4;
      const sz = 2.5 + rnd(i * 11) * 3.5; return <circle key={side + i} cx={ox} cy={oy} r={sz} fill={WHITE} opacity={0.35 + 0.55 * rnd(i * 13)} />; }); };
  const finalO = interpolate(t, [13.2, 13.8], [0, 1], cl), finalO2 = interpolate(t, [14.4, 15.0], [0, 1], cl);
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 60% at 50% 45%, #0c0e12 0%, #030406 70%)'}}>
    <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 55%'}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <clipPath id="above"><rect x={0} y={0} width={W} height={WATER + 4} /></clipPath>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b0e13" /><stop offset="1" stopColor="#040507" /></linearGradient>
        </defs>
        {/* water + reflections */}
        <rect x={0} y={WATER} width={W} height={H - WATER} fill="url(#water)" />
        <g transform={`translate(0 ${2 * WATER + 40}) scale(1 -1)`} opacity={0.16}><Tower /></g>
        {Array.from({length: 26}, (_, i) => <line key={i} x1={0} x2={W} y1={WATER + 14 + i * 16 + ((fr * 0.6 + i * 7) % 16)} y2={WATER + 14 + i * 16 + ((fr * 0.6 + i * 7) % 16)} stroke="#000" strokeWidth={6} opacity={0.35} />)}
        <line x1={0} x2={W} y1={WATER} y2={WATER} stroke="#2a2f36" strokeWidth={2} />
        <g filter="url(#glow)">{orbs(wf, 'l')}{orbs(df, 'r')}</g>
        <Tower />
        <g filter="url(#glow)" clipPath="url(#above)">
          {/* weekly creator */}
          {!wDiving && <Fig x={wBack ? TIPL + 40 : wx} y={BOARD} pose={end ? 'stand' : 'think'} face={wface} k={t * 3} op={wBack ? interpolate(t, [WS.find((s) => t >= s + 0.62 && t < s + 0.9)! + 0.62, WS.find((s) => t >= s + 0.62 && t < s + 0.9)! + 0.8], [0, 1], cl) : 1} />}
          {WS.map((s, i) => <Dive key={'w' + i} t={t} t0={s} dir={-1} tip={TIPL} crouch={0.15} flight={0.47} />)}
          {/* daily creator */}
          {!dDivingNow && !end && <Fig x={TIPR - 10} y={BOARD} pose="stand" face={1} k={t * 8} />}
          {end && <Fig x={TIPR - 30} y={BOARD} pose="cheer" k={t * 6} />}
          {DS.map((s, i) => <Dive key={'d' + i} t={t} t0={s} dir={1} tip={TIPR} crouch={0} flight={DSPL} ghost={i + 1 < DS.length && DS[i + 1] <= t} />)}
        </g>
        <g filter="url(#glow)">
          {WS.map((s, i) => <Splash key={'ws' + i} t={t} at={s + WSPL} x={TIPL - 150} seed={i + 1} big={0.8} />)}
          {DS.map((s, i) => <Splash key={'ds' + i} t={t} at={s + DSPL} x={TIPR + 150} seed={i + 50} big={0.7 + Math.min(0.8, i / 90)} />)}
        </g>
      </svg>
      {/* labels (dot-matrix, like the reference) */}
      <div style={{position: 'absolute', left: 110, top: 625}}><Px size={32}>WHEN IT'S READY</Px></div>
      <div style={{position: 'absolute', left: 730, top: 655}}><Px size={32}>EVERY DAY</Px></div>
    </AbsoluteFill>
    {/* day counter + stats */}
    <div style={{position: 'absolute', top: 190, width: W, textAlign: 'center'}}>
      <Px size={78} style={{textShadow: '0 0 18px rgba(255,255,255,.35)', transform: `scale(${end ? 1 + 0.06 * Math.max(0, 1 - (t - 12.8) * 3) : 1})`}}>DAY {String(day).padStart(2, '0')}</Px>
      <Px size={22} color="#7d838b" style={{marginTop: 8}}>OF 90 · SAME START</Px></div>
    {[{x: 60, head: '1 / WEEK', v: [wvid, wv, wf, woff]}, {x: 580, head: 'DAILY', v: [dvid, dv, df, doff]}].map((c, i) => <div key={i} style={{position: 'absolute', left: c.x, top: 340, width: 440}}>
      <Px size={26} color="#7d838b" style={{marginBottom: 14}}>{c.head}</Px>
      {(['VIDEOS', 'VIEWS', 'FOLLOWERS', 'OFFERS'] as const).map((k, j) => <div key={k} style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10}}>
        <Px size={27} color="#9aa0a7">{k}</Px><Px size={30} color={i === 1 && end ? '#ffffff' : WHITE} style={{textShadow: i === 1 ? '0 0 12px rgba(255,255,255,.35)' : 'none'}}>{fmt(c.v[j])}</Px></div>)}
    </div>)}
    <div style={{position: 'absolute', top: 575, width: W, textAlign: 'center'}}><Px size={17} color="#5c6168">*ILLUSTRATIVE MODEL</Px></div>
    {/* ending */}
    <div style={{position: 'absolute', top: 1390, width: W, textAlign: 'center', opacity: finalO}}><Px size={44} style={{textShadow: '0 0 16px rgba(0,0,0,.9)'}}>SAME START.</Px></div>
    <div style={{position: 'absolute', top: 1460, width: W, textAlign: 'center', opacity: finalO2}}><Px size={44} style={{textShadow: '0 0 16px rgba(0,0,0,.9)'}}>DIFFERENT HABIT.</Px></div>
    <div style={{position: 'absolute', top: 1580, width: W, textAlign: 'center'}}><Px size={20} color={`rgba(255,255,255,${0.18 + 0.5 * finalO2})`}>@AGENTBRAND47</Px></div>
    <Audio src={staticFile('ab/music.wav')} />
  </AbsoluteFill>;
};
