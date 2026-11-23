/* Leonida Shifts — brand kit. Reverse-engineered from the reference (floating glass cards with a pink glow, pill tags,
   flip digits, tilted vector maps with pins, browser/source frames, quote cards) and re-skinned for Leonida Shifts:
   sunset pink→orange accent, teal for "confirmed", gameplay always running underneath. */
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';

export const FPS = 30, W = 1920, H = 1080;
export const C = {pink: '#FF4FB0', orange: '#FF9A3C', teal: '#38F0D2', amber: '#FFC83D', red: '#FF4D6A', violet: '#8B5CFF', night: '#130A22',
  glass: 'rgba(17,8,32,.84)', cream: '#FFF3E6', mute: 'rgba(255,220,240,.74)', line: 'rgba(255,205,236,.9)'};
export const GRAD = `linear-gradient(100deg, ${C.pink}, ${C.orange})`;
export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const eo = Easing.out(Easing.cubic), eio = Easing.inOut(Easing.cubic), eback = Easing.out(Easing.back(1.5));
export const ramp = (t: number, a: number, b: number, from = 0, to = 1, e = eo) => interpolate(t, [a, b], [from, to], {...cl, easing: e});
export const TimeCtx = React.createContext<((frame: number) => number) | null>(null);
export const useT = () => { const fr = useCurrentFrame(); const m = React.useContext(TimeCtx); return m ? m(fr) : fr / FPS; };
export const useRealT = () => useCurrentFrame() / FPS;
export const f = (s: number) => Math.round(s * FPS);
export const HERO = 'Road', UI = 'RoadB', MONO = 'RoadMono';
/* measure text with the loaded font and shrink it to fit a box: overflow becomes impossible */
let _ctx: CanvasRenderingContext2D | null = null;
export const fit = (text: string, font: string, base: number, maxW: number, spacing = 0) => {
  if (typeof document === 'undefined') return base; if (!_ctx) _ctx = document.createElement('canvas').getContext('2d');
  if (!_ctx) return base; _ctx.font = `${base}px ${font}`; const w = _ctx.measureText(text).width + spacing * text.length;
  return w > maxW ? Math.floor((base * maxW) / w) : base;
};

/* ---------- motion wrapper: every pop-up enters with rise+scale+blur and exits with a quick shrink ---------- */
export const Beat: React.FC<{t0: number; t1: number; x: number; y: number; w?: number; tilt?: number; from?: 'up' | 'left' | 'right' | 'down'; delay?: number; float?: boolean; origin?: string; road?: boolean; children: React.ReactNode}> =
  ({t0, t1, x, y, w, tilt = 0, from = 'up', delay = 0, float = true, origin = '50% 50%', road = false, children}) => {
    const t = useT(); const s0 = t0 + delay;
    if (t < s0 || t > t1 + 0.3) return null;
    if (road) {   /* a roadside sign: approaches from down the road, holds, then whips past the camera */
      const a = ramp(t, s0, s0 + 0.55, 0, 1, Easing.out(Easing.cubic)), p = ramp(t, t1 - 0.05, t1 + 0.3, 0, 1, Easing.in(Easing.quad));
      const hx = 960 - x, hy = 470 - y; const k = 1 - a;
      const tx = hx * 0.78 * k - hx * 0.9 * p, ty = hy * 0.6 * k - hy * 0.5 * p, sc = (0.22 + 0.78 * a) * (1 + 0.9 * p);
      return <div style={{position: 'absolute', left: x, top: y, width: w, transformOrigin: '50% 50%', opacity: Math.min(1, a * 3) * (1 - p),
        transform: `perspective(1600px) translate(${tx}px, ${ty}px) rotateY(${(x > 960 ? -10 : 10) * (0.4 + 0.6 * k)}deg) scale(${sc})`, filter: p > 0.02 || a < 0.9 ? `blur(${p * 14 + k * 3}px)` : undefined}}>{children}</div>;
    }
    const e = ramp(t, s0, s0 + 0.34, 0, 1, eback), x1 = ramp(t, t1, t1 + 0.24, 0, 1, Easing.in(Easing.cubic));
    const vis = Math.min(ramp(t, s0, s0 + 0.18), 1 - x1);
    const d = (1 - e) * 60; const [dx, dy] = from === 'up' ? [0, d] : from === 'down' ? [0, -d] : from === 'left' ? [-d * 1.6, 0] : [d * 1.6, 0];
    const bob = float ? Math.sin(t * 1.25 + x * 0.01) * 5 : 0;
    return <div style={{position: 'absolute', left: x, top: y, width: w, opacity: vis, transformOrigin: origin,
      transform: `perspective(1800px) translate(${dx}px, ${dy + bob - x1 * 20}px) rotateY(${tilt * (0.6 + 0.4 * e)}deg) rotateX(${2.5 * (1 - e)}deg) scale(${(0.86 + 0.14 * e) * (1 - 0.08 * x1)})`,
      filter: e < 0.98 || x1 > 0 ? `blur(${(1 - e) * 10 + x1 * 8}px)` : undefined}}>{children}</div>;
  };
/* stagger helper for children inside one beat */
export const pop = (t: number, t0: number) => ({opacity: ramp(t, t0, t0 + 0.15), transform: `translateY(${ramp(t, t0, t0 + 0.3, 24, 0, eback)}px) scale(${ramp(t, t0, t0 + 0.3, 0.8, 1, eback)})`});

/* ---------- glass card ---------- */
export const Card: React.FC<{w: number; h?: number; label?: string; icon?: string; pad?: number; glow?: string; children?: React.ReactNode; style?: React.CSSProperties}> =
  ({w, h, label, icon, pad = 30, glow = C.pink, children, style}) =>
    <div style={{position: 'relative', width: w, height: h, borderRadius: 24, background: C.glass, border: `2px solid ${C.line}`, padding: pad, boxSizing: 'border-box',
      boxShadow: `0 0 0 1px ${glow}55, 0 0 34px ${glow}66, inset 0 1px 0 rgba(255,255,255,.18), 0 30px 70px rgba(0,0,0,.6)`, backdropFilter: 'blur(14px)', ...style}}>
      {label && <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: UI, fontSize: 21, letterSpacing: 3.2, color: C.mute, textTransform: 'uppercase', marginBottom: 18}}>
        {icon && <span style={{fontSize: 24, letterSpacing: 0}}>{icon}</span>}<span>{label}</span></div>}
      {children}
    </div>;

/* ---------- pill tag ---------- */
export type PV = 'dark' | 'hot' | 'teal' | 'warn' | 'red';
export const Pill: React.FC<{text: string; icon?: string; v?: PV; size?: number; style?: React.CSSProperties}> = ({text, icon, v = 'dark', size: size0 = 30, style}) => {
  const size = size0 * 1.15;
  const bg = v === 'hot' ? GRAD : v === 'teal' ? 'linear-gradient(100deg,#1fd8b9,#38F0D2)' : v === 'warn' ? 'linear-gradient(100deg,#ffb020,#FFC83D)' : v === 'red' ? 'linear-gradient(100deg,#ff3060,#ff6a5a)' : 'rgba(18,10,34,.92)';
  const col = v === 'teal' || v === 'warn' ? '#140a22' : '#fff';
  return <div style={{display: 'inline-flex', alignItems: 'center', gap: size * 0.38, padding: `${size * 0.36}px ${size * 0.7}px`, borderRadius: 999, background: bg, color: col,
    border: v === 'dark' ? '2px solid rgba(255,255,255,.92)' : '2px solid rgba(255,255,255,.35)', fontFamily: UI, fontSize: size, letterSpacing: size * 0.07, textTransform: 'uppercase', whiteSpace: 'nowrap',
    boxShadow: `0 10px 26px rgba(0,0,0,.45)${v === 'hot' ? `, 0 0 26px ${C.pink}88` : ''}`, ...style}}>{icon && <span style={{letterSpacing: 0}}>{icon}</span>}{text}</div>;
};

/* ---------- source line ---------- */
export const Src: React.FC<{text: string; style?: React.CSSProperties}> = ({text, style}) =>
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 18, padding: '7px 14px', borderRadius: 8, background: 'rgba(255,79,176,.12)', border: '1px solid rgba(255,79,176,.45)',
    fontFamily: UI, fontSize: 17, letterSpacing: 2.2, color: 'rgba(255,225,242,.9)', textTransform: 'uppercase', whiteSpace: 'nowrap', ...style}}>
    <span style={{color: C.pink}}>↗</span> SOURCE · {text}</div>;

/* ---------- headline text (gradient fill + white edge) ---------- */
export const Title: React.FC<{children: React.ReactNode; size?: number; grad?: string; style?: React.CSSProperties}> = ({children, size = 110, grad = 'linear-gradient(180deg,#ffd0ec 0%,#FF4FB0 55%,#ff8a3c 100%)', style}) =>
  <div style={{position: 'relative', fontFamily: HERO, fontSize: size, lineHeight: 0.98, letterSpacing: -size * 0.02, textTransform: 'uppercase', whiteSpace: 'nowrap', ...style}}>
    <div style={{color: 'transparent', WebkitTextStroke: `${Math.max(3, size * 0.03)}px #fff`, filter: 'drop-shadow(0 10px 18px rgba(0,0,0,.65))'}}>{children}</div>
    <div style={{position: 'absolute', inset: 0, background: grad, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>{children}</div>
  </div>;
export const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 64, color = '#fff', style}) =>
  <div style={{fontFamily: HERO, fontSize: size, lineHeight: 1.02, letterSpacing: -size * 0.015, color, textTransform: 'uppercase', ...style}}>{children}</div>;
export const Small: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 22, color = C.mute, style}) =>
  <div style={{fontFamily: UI, fontSize: size, letterSpacing: size * 0.12, color, textTransform: 'uppercase', ...style}}>{children}</div>;

/* ---------- animated numbers ---------- */
export const Count: React.FC<{t0: number; dur?: number; from?: number; to: number; fmt: (v: number) => string; size?: number; color?: string; style?: React.CSSProperties}> =
  ({t0, dur = 1.1, from = 0, to, fmt, size = 120, color = '#fff', style}) => {
    const t = useT(); const v = from + (to - from) * ramp(t, t0, t0 + dur, 0, 1, Easing.out(Easing.exp));
    const done = t >= t0 + dur; const k = done ? 1 + 0.06 * Math.exp(-(t - t0 - dur) * 9) : 1;
    return <div style={{fontFamily: HERO, fontSize: size, lineHeight: 1, color, letterSpacing: -size * 0.03, fontVariantNumeric: 'tabular-nums', transform: `scale(${k})`, transformOrigin: '0 50%', whiteSpace: 'nowrap',
      textShadow: `0 0 30px ${C.pink}66, 0 8px 20px rgba(0,0,0,.6)`, ...style}}>{fmt(v)}</div>;
  };
export const usd = (v: number) => v >= 1e9 ? `$${(v / 1e9).toFixed(2)}B` : `$${Math.round(v / 1e6)}M`;
export const commas = (v: number) => Math.round(v).toLocaleString('en-US');

/* split-flap digits (reference: "1 3 DAYS LEFT", "1980s") */
export const Flip: React.FC<{t0: number; from: string; to: string; size?: number; step?: number}> = ({t0, from, to, size = 120, step = 0.07}) => {
  const t = useT();
  return <div style={{display: 'flex', gap: size * 0.1}}>{to.split('').map((ch, i) => {
    const a = parseInt(from[i] ?? '0', 10), b = parseInt(ch, 10); const span = isNaN(a) || isNaN(b) ? 0 : (b - a + 10) % 10;
    const k = Math.floor(ramp(t, t0 + i * 0.12, t0 + i * 0.12 + Math.max(0.01, span * step), 0, span, Easing.linear)); const cur = isNaN(b) ? ch : String((a + k) % 10);
    const ph = (ramp(t, t0, t0 + 6, 0, 1, Easing.linear) * 60) % 1;
    return <div key={i} style={{position: 'relative', width: size * 0.74, height: size * 1.08, borderRadius: size * 0.12, background: 'linear-gradient(180deg,#2a1640 0%,#1a0c2c 49%,#120820 51%,#1d0e31 100%)',
      border: `2px solid ${C.line}`, boxShadow: `0 0 24px ${C.pink}55, 0 14px 30px rgba(0,0,0,.6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
      <div style={{fontFamily: HERO, fontSize: size * 0.86, color: '#fff', background: 'linear-gradient(180deg,#fff 40%,#ffc2e6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', transform: k < span && ph > 0.5 ? 'scaleY(.92)' : undefined}}>{cur}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: 2, background: 'rgba(0,0,0,.6)'}} />
    </div>;
  })}</div>;
};

/* ---------- slam stamp ---------- */
export const Stamp: React.FC<{t0: number; text: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties}> = ({t0, text, color = C.pink, size = 64, rot = -6, style}) => {
  const t = useT(); const s = interpolate((t - t0) * FPS, [0, 4, 7], [2.3, 0.94, 1], cl); const sh = t - t0 < 0.22 ? Math.sin((t - t0) * 90) * 6 * (1 - (t - t0) / 0.22) : 0;
  return <div style={{display: 'inline-block', padding: `${size * 0.16}px ${size * 0.36}px`, border: `${size * 0.09}px solid ${color}`, borderRadius: size * 0.2, color, fontFamily: HERO, fontSize: size, letterSpacing: 1,
    textTransform: 'uppercase', whiteSpace: 'nowrap', background: 'rgba(14,6,26,.72)', boxShadow: `0 0 30px ${color}77`, transform: `translate(${sh}px,0) rotate(${rot}deg) scale(${s})`, opacity: ramp(t, t0, t0 + 0.05), ...style}}>{text}</div>;
};

/* ---------- highlighter sweep over a phrase ---------- */
export const Hi: React.FC<{t0: number; children: React.ReactNode; color?: string}> = ({t0, children, color = C.pink}) => {
  const t = useT(); const p = ramp(t, t0, t0 + 0.45, 0, 100, eio);
  return <span style={{backgroundImage: `linear-gradient(90deg, ${color}cc ${p}%, transparent ${p}%)`, borderRadius: 6, padding: '0 6px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone', color: p > 40 ? '#fff' : undefined}}>{children}</span>;
};

/* ---------- browser / source frame ---------- */
export const Browser: React.FC<{w: number; h: number; url: string; children?: React.ReactNode}> = ({w, h, url, children}) =>
  <div style={{width: w, height: h, borderRadius: 18, overflow: 'hidden', background: '#0f0a18', border: `2px solid ${C.line}`, boxShadow: `0 0 34px ${C.pink}55, 0 30px 70px rgba(0,0,0,.6)`}}>
    <div style={{height: 52, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', background: '#1b1228', borderBottom: '1px solid rgba(255,255,255,.12)'}}>
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />)}
      <div style={{marginLeft: 16, flex: 1, height: 32, borderRadius: 16, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, fontFamily: UI, fontSize: 18, color: 'rgba(255,255,255,.8)'}}>
        <span style={{fontSize: 14}}>🔒</span>{url}</div>
    </div>
    <div style={{position: 'relative', height: h - 52}}>{children}</div>
  </div>;

/* ---------- photo card with licence credit ---------- */
export const Photo: React.FC<{src: string; w: number; h: number; credit: string; label?: string; pos?: string; kb?: number}> = ({src, w, h, credit, label, pos = '50% 50%', kb = 0}) => {
  const t = useT();
  return <div style={{width: w, borderRadius: 20, overflow: 'hidden', background: '#0f0a18', border: `2px solid ${C.line}`, boxShadow: `0 0 30px ${C.pink}55, 0 26px 60px rgba(0,0,0,.6)`}}>
    <div style={{position: 'relative', width: w, height: h, overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${1.04 + kb * ((t * 0.02) % 1)})`}} />
      {label && <div style={{position: 'absolute', left: 16, top: 16}}><Pill text={label} size={20} /></div>}
    </div>
    <div style={{padding: '9px 14px', fontFamily: UI, fontSize: 14, letterSpacing: 1.4, color: 'rgba(255,225,242,.78)', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', background: '#140b22'}}>📷 {credit}</div>
  </div>;
};

/* ---------- horizontal comparison bars ---------- */
export const Bars: React.FC<{t0: number; rows: {label: string; v: number; txt: string; col?: string; win?: boolean}[]; max: number; w: number; step?: number}> = ({t0, rows, max, w, step = 0.22}) => {
  const t = useT();
  return <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>{rows.map((r, i) => {
    const p = ramp(t, t0 + i * step, t0 + i * step + 0.9, 0, 1, Easing.out(Easing.exp));
    return <div key={i} style={pop(t, t0 + i * step)}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: UI, fontSize: 24, letterSpacing: 2, color: '#fff', marginBottom: 8, textTransform: 'uppercase'}}><span>{r.label}</span><span style={{fontFamily: HERO, fontSize: 32, color: r.win ? C.teal : '#fff'}}>{r.txt}</span></div>
      <div style={{height: 34, width: w, borderRadius: 17, background: 'rgba(255,255,255,.1)', overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${(r.v / max) * 100 * p}%`, borderRadius: 17, background: r.col ?? GRAD, boxShadow: `0 0 22px ${(r.col ?? C.pink)}88`}} /></div>
    </div>;
  })}</div>;
};

/* ---------- vector maps (Natural Earth / US Census shapes via world-atlas & us-atlas) ---------- */
type Shape = {n?: string; id?: string; d: string};
export const MapSvg: React.FC<{shapes: Shape[]; vb: string; w: number; h: number; draw: number; hl?: (s: Shape) => string | undefined; extra?: React.ReactNode; dim?: Shape[]}> = ({shapes, vb, w, h, draw, hl, extra, dim}) =>
  <svg viewBox={vb} width={w} height={h} style={{overflow: 'visible'}}>
    <defs><filter id="mglow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
    {dim?.map((s, i) => <path key={'d' + i} d={s.d} fill="rgba(139,92,255,.10)" stroke="rgba(255,190,230,.35)" strokeWidth={1.2} />)}
    {shapes.map((s, i) => { const c = hl?.(s); return <path key={i} d={s.d} fill={c ?? 'rgba(139,92,255,.16)'} fillOpacity={c ? 0.55 * draw : draw} stroke={c ? '#fff' : '#ffb8e4'} strokeWidth={c ? 2.4 : 1.6}
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} filter="url(#mglow)" />; })}
    {extra}
  </svg>;
export const MapPin: React.FC<{x: number; y: number; t0: number; label: string; sub?: string; side?: 'l' | 'r'; col?: string; scale?: number}> = ({x, y, t0, label, sub, side = 'r', col = C.pink, scale = 1}) => {
  const t = useT(); if (t < t0) return null; const e = ramp(t, t0, t0 + 0.35, 0, 1, eback); const ring = ((t - t0) * 0.9) % 1;
  const lx = side === 'r' ? 46 : -46;
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <circle r={10 + ring * 34} fill="none" stroke={col} strokeWidth={3} opacity={1 - ring} />
    <circle r={10 * e} fill={col} stroke="#fff" strokeWidth={3} />
    <line x1={0} y1={0} x2={lx * e} y2={-40 * e} stroke="#fff" strokeWidth={2} opacity={e} />
    <foreignObject x={side === 'r' ? lx : lx - 520} y={-86} width={520} height={110} opacity={e}>
      <div style={{display: 'flex', justifyContent: side === 'r' ? 'flex-start' : 'flex-end'}}>
        <div style={{padding: '10px 18px', borderRadius: 12, background: 'rgba(17,8,32,.92)', border: `2px solid ${C.line}`, boxShadow: `0 0 20px ${col}77`}}>
          <div style={{fontFamily: UI, fontSize: 24, letterSpacing: 2.4, color: '#fff', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{label}</div>
          {sub && <div style={{fontFamily: UI, fontSize: 15, letterSpacing: 2, color: C.mute, textTransform: 'uppercase', whiteSpace: 'nowrap', marginTop: 3}}>{sub}</div>}
        </div></div></foreignObject>
  </g>;
};

/* ---------- logo: sunset emblem with an H-gate shift pattern ---------- */
export const Emblem: React.FC<{size: number; gear?: number}> = ({size, gear = 0}) => {
  const g = [[30, 32], [30, 68], [50, 32], [50, 68], [70, 32], [70, 68]]; const k = Math.max(0, Math.min(5, gear)); const i0 = Math.floor(k), fr = k - i0; const a = g[i0], b = g[Math.min(5, i0 + 1)];
  const kx = a[0] + (b[0] - a[0]) * fr, ky = a[1] + (b[1] - a[1]) * fr;
  return <div style={{width: size, height: size, borderRadius: size * 0.26, background: 'linear-gradient(135deg,#FF4FB0 0%,#FF7A6A 55%,#FFB347 100%)', boxShadow: `0 0 ${size * 0.4}px ${C.pink}88, inset 0 ${size * 0.04}px 0 rgba(255,255,255,.35)`, position: 'relative', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: '-10%', right: '-10%', bottom: '-38%', height: '70%', borderRadius: '50%', background: 'rgba(255,255,255,.16)'}} />
    <svg viewBox="0 0 100 100" width={size} height={size} style={{position: 'absolute', inset: 0}}>
      <g stroke="#fff" strokeWidth={6.5} strokeLinecap="round" fill="none"><path d="M30 32V68M50 32V68M70 32V68M30 50H70" /></g>
      <circle cx={kx} cy={ky} r={10} fill="#1a0b2c" stroke="#fff" strokeWidth={4.5} />
    </svg>
  </div>;
};
export const Wordmark: React.FC<{size: number}> = ({size}) =>
  <div style={{display: 'flex', alignItems: 'baseline', gap: size * 0.28, fontFamily: HERO, fontSize: size, letterSpacing: -size * 0.02, lineHeight: 1}}>
    <span style={{color: '#fff', textShadow: `0 0 ${size * 0.3}px ${C.pink}88`}}>LEONIDA</span>
    <span style={{background: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: `drop-shadow(0 0 ${size * 0.2}px ${C.orange}77)`}}>SHIFTS</span>
  </div>;

/* ---------- gameplay background with rotating camera moves + shift transitions ---------- */
export type Seg = {t: number; clip: string; src: number; move: number; ins?: boolean; zoom?: number};
/* clips with spoken dialogue have burned-in game subtitles (some with swearing) at the bottom: crop them out */

export const Background: React.FC<{segs: Seg[]; end: number; punches?: number[]}> = ({segs, end, punches = []}) => {
  const t = useRealT(); const pk = punches.reduce((a, p) => a + (t >= p && t < p + 0.6 ? 0.07 * Math.exp(-(t - p) * 7) * Math.cos((t - p) * 14) : 0), 0);
  let k = 0; segs.forEach((s, i) => { if (s.t <= t) k = i; });
  const draw = (i: number, lt: number, extra: string, blur: number) => {
    const s = segs[i]; const nxt = i + 1 < segs.length ? segs[i + 1].t : end; const dur = nxt - s.t; const p = Math.max(0, Math.min(1, lt / dur));
    let tr = '';
    const z = s.zoom ?? 1;
    switch (s.move) {
      case -1: tr = `scale(${z + 0.03 * p})`; break;                                             // gameplay break: clean, slight push on the action
      case 0: tr = `scale(${1.0 + 0.04 * p})`; break;                                            // creep in
      case 1: tr = `scale(${1.04 - 0.04 * p})`; break;                                           // pull out
      case 2: tr = `scale(1.03) translateX(${-16 + 32 * p}px)`; break;                            // glide right
      case 3: tr = `scale(1.03) translateX(${16 - 32 * p}px)`; break;                             // glide left
      case 4: tr = `scale(1.03) translateY(${10 - 20 * p}px)`; break;                             // rise
      default: tr = `scale(${1.025 + 0.015 * p}) rotate(${-0.35 + 0.7 * p}deg)`;                 // slow roll
    }
    return <AbsoluteFill key={i} style={{transform: `${extra} ${tr}`, filter: blur ? `blur(${blur}px)` : undefined}}>
      <Sequence from={-f(s.src - s.t) - 0} layout="none">
        <OffthreadVideo src={staticFile(`ls/${s.clip}.mp4`)} muted style={{width: W, height: H, objectFit: 'cover'}} />
      </Sequence>
    </AbsoluteFill>;
  };
  const lt = t - segs[k].t; const TR = 0.3;
  const inP = ramp(lt, 0, TR, 0, 1, eo);
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}><AbsoluteFill style={{transform: `scale(${1 + pk})`}}>
    {k > 0 && lt < TR && draw(k - 1, t - segs[k - 1].t, `translateX(${-inP * 240}px)`, inP * 26)}
    <AbsoluteFill style={{opacity: k > 0 ? ramp(lt, 0, TR * 0.6) : 1}}>{draw(k, lt, k > 0 ? `translateX(${(1 - inP) * 300}px)` : '', k > 0 ? (1 - inP) * 26 : 0)}</AbsoluteFill></AbsoluteFill>
  </AbsoluteFill>;
};

/* ---------- SFX helper ---------- */
export const S: React.FC<{at: number; n: string; v?: number}> = ({at, n, v = 0.4}) =>
  <Sequence from={Math.max(0, f(at))} durationInFrames={90} layout="none"><Audio src={staticFile(`${n}.wav`)} volume={v} /></Sequence>;
