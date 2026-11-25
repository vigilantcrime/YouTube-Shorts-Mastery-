/* VIGILANT CRIME — long-form engine (16:9, authored at 1920×1080, rendered with --scale=2 → 3840×2160).
   Reverse-engineered from the PatientGTA long-form (patientgta_blueprint.md): ONE continuous motion-graphics world where the
   camera glides between floating panels, pills landing on every noun, heavy gradient titles, 3D-tilted screens, spotlight,
   magnifier, quote cards with highlighter, labelled connectors, tilted map with pins + route, donut/bars, "?" grid, bumpers.
   Recoloured for a UK crime channel: police blue + siren red on navy, white outlines, evidence-board / case-file accents. */
import React from 'react';
import {AbsoluteFill, Easing, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';

export const FPS = 30, W = 1920, H = 1080;
export const C = {
  ink: '#050B1A', navy: '#0A1A3A', deep: '#0E2552', blue: '#2F7BFF', blueL: '#8FC1FF', blueD: '#123C8F',
  red: '#FF2E4A', redL: '#FF8A99', redD: '#A3122A', white: '#FFFFFF', ice: '#E6F0FF', mute: '#9DB4D8',
};
export const F = {display: 'Anton', hero: 'HeroBlack', ui: 'In5', uiR: 'In4', uiB: 'UIBold', mono: 'Mono'};
export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const eo = Easing.out(Easing.cubic), eio = Easing.inOut(Easing.cubic), ebk = Easing.out(Easing.back(1.6)), eq = Easing.out(Easing.quad);
export const ramp = (t: number, a: number, b: number, from = 0, to = 1, e: (x: number) => number = eo) => interpolate(t, [a, b], [from, to], {...cl, easing: e});
export const useT = () => useCurrentFrame() / FPS;
export const spring = (t: number, t0: number, k = 15, d = 6.5) => (t < t0 ? 0 : 1 - Math.exp(-d * (t - t0)) * Math.cos(k * (t - t0)));
export const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

/* ---------- word anchors: A('fifty six percent') → the onset (s) of that phrase in the voiceover ---------- */
export type Word = {w: string; t: number; on: number};
const nrm = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, '');
export const mkA = (words: Word[]) => (phrase: string, nth = 0, off = -0.04): number => {
  const p = phrase.split(/\s+/).map(nrm).filter(Boolean); let found = 0;
  for (let i = 0; i + p.length <= words.length; i++) {
    let ok = true; for (let j = 0; j < p.length; j++) if (nrm(words[i + j].w) !== p[j]) { ok = false; break; }
    if (ok) { if (found === nth) return words[i].on + off; found++; }
  }
  throw new Error(`ANCHOR NOT FOUND: "${phrase}" #${nth}`);
};

/* ---------- fonts ---------- */
export const useFonts = () => {
  const [h] = React.useState(() => delayRender('vc-fonts')); const [ok, setOk] = React.useState(false);
  React.useEffect(() => {
    const list: [string, string][] = [['Anton', 'ls/fonts/anton.woff2'], ['HeroBlack', 'InterDisplay-Black.otf'], ['UIBold', 'Inter-Bold.otf'], ['In4', 'ls/fonts/inter400.woff2'], ['In5', 'ls/fonts/inter500.woff2'], ['Mono', 'ls/fonts/mono700.woff2']];
    Promise.all(list.map(([n, p]) => new FontFace(n, `url(${staticFile(p)})`).load())).then((fs) => { fs.forEach((x) => document.fonts.add(x)); setOk(true); continueRender(h); });
  }, [h]);
  return ok;
};
let mctx: CanvasRenderingContext2D | null = null;
export const textW = (text: string, font: string, px: number, ls = 0) => { if (!mctx) mctx = document.createElement('canvas').getContext('2d'); const c = mctx!; c.font = `${px}px ${font}`; return c.measureText(text).width + ls * text.length; };
export const fit = (text: string, font: string, base: number, maxW: number, ls = 0) => { const w = textW(text, font, base, ls); return w <= maxW ? base : Math.floor(base * (maxW / w) * 0.985); };

/* ---------- contexts ---------- */
export const CamCtx = React.createContext({x: 960, y: 540, z: 1});
export const SceneCtx = React.createContext({t0: 0, t1: 1, cx: 960, cy: 540});

/* ---------- police-light stage (parallax by camera) ---------- */
const skylinePath = (() => {
  let x = 0, d = '', win = '', k = 1; const TW = 3600;
  while (x < TW) {
    const tower = rnd(k, 1) > 0.9; const w = tower ? 110 + rnd(k, 2) * 60 : 56 + rnd(k, 3) * 90; const h = tower ? 250 + rnd(k, 4) * 150 : 50 + rnd(k, 5) * 120;
    const y = 300 - h; d += `M${x} 300V${y}`;
    if (!tower && rnd(k, 6) > 0.45) d += `L${x + w / 2} ${y - 34}L${x + w} ${y}`; else d += `H${x + w}`; d += `V300Z`;
    if (!tower && rnd(k, 7) > 0.6) d += `M${x + w * 0.2} ${y}v-26h10v26z`;
    for (let wy = y + 18; wy < 290; wy += tower ? 26 : 30) for (let wx = x + 12; wx < x + w - 14; wx += tower ? 22 : 26) if (rnd(wx + wy, k) > 0.8) win += `M${wx} ${wy}h5v7h-5z`;
    x += w + (rnd(k, 8) > 0.7 ? 10 + rnd(k, 9) * 24 : 2); k++;
  }
  return {d, win, TW};
})();
export const Stage: React.FC<{cx: number; cy: number; t: number}> = ({cx, cy, t}) => {
  const a = 0.5 + 0.5 * Math.sin((2 * Math.PI * t) / 8);
  const sk = ((-(cx * 0.1) % skylinePath.TW) + skylinePath.TW) % skylinePath.TW;
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 75% at 50% 38%, #12306a 0%, #0a1a3a 46%, #050b1a 100%)', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: -380, top: -520, width: 1300, height: 1300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(47,123,255,0.62), rgba(47,123,255,0) 64%)', opacity: 0.3 + 0.5 * a, transform: `translate(${-cx * 0.03}px, 0)`}} />
    <div style={{position: 'absolute', right: -380, top: -520, width: 1300, height: 1300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,46,74,0.58), rgba(255,46,74,0) 64%)', opacity: 0.3 + 0.5 * (1 - a), transform: `translate(${-cx * 0.03}px, 0)`}} />
    {[0, 1].map((i) => <div key={i} style={{position: 'absolute', left: i ? 1500 : 420, top: -260, width: 90, height: 1700, transformOrigin: '50% 0', transform: `rotate(${(i ? 1 : -1) * (24 + 14 * Math.sin(t * 0.35 + i * 2))}deg)`, background: `linear-gradient(180deg, ${i ? 'rgba(255,46,74,0.16)' : 'rgba(47,123,255,0.18)'}, rgba(0,0,0,0))`, filter: 'blur(14px)', mixBlendMode: 'screen'}} />)}
    <svg width={W} height={400} viewBox={`${sk} 0 ${W} 400`} style={{position: 'absolute', left: 0, bottom: 150, opacity: 0.9}} preserveAspectRatio="none">
      <g transform="translate(0 100)"><path d={skylinePath.d} fill="#06122c" /><path d={skylinePath.win} fill="rgba(160,200,255,0.34)" /></g>
      <g transform={`translate(${skylinePath.TW} 100)`}><path d={skylinePath.d} fill="#06122c" /><path d={skylinePath.win} fill="rgba(160,200,255,0.34)" /></g>
    </svg>
    <div style={{position: 'absolute', left: -700, right: -700, bottom: 0, height: 480, transform: 'perspective(760px) rotateX(64deg)', transformOrigin: '50% 100%', backgroundImage: 'linear-gradient(rgba(90,150,255,0.4) 2px, transparent 2px), linear-gradient(90deg, rgba(90,150,255,0.4) 2px, transparent 2px)', backgroundSize: '120px 120px', backgroundPosition: `${-cx * 0.55}px ${-t * 20}px`, WebkitMaskImage: 'linear-gradient(0deg, transparent 0%, #000 70%)', maskImage: 'linear-gradient(0deg, transparent 0%, #000 70%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 148, height: 3, background: `linear-gradient(90deg, rgba(47,123,255,0), rgba(47,123,255,${0.4 + 0.4 * a}), rgba(255,46,74,${0.4 + 0.4 * (1 - a)}), rgba(255,46,74,0))`, filter: 'blur(1px)'}} />
    {Array.from({length: 70}, (_, i) => {
      const d = 0.3 + rnd(i, 1) * 1.4, s = 2 + rnd(i, 2) * 5 * d; const x = ((rnd(i, 3) * 2600 - cx * d * 0.38 + t * (8 + rnd(i, 4) * 16)) % 2600 + 2600) % 2600 - 340;
      const y = ((rnd(i, 5) * 1300 - cy * d * 0.2 - t * (10 + rnd(i, 6) * 22) * d) % 1300 + 1300) % 1300 - 100; const red = rnd(i, 7) > 0.5;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: s, background: red ? '#ff5a6e' : '#6fa8ff', opacity: 0.14 + 0.34 * rnd(i, 8), filter: d > 1.2 ? `blur(${(d - 1.1) * 5}px)` : undefined}} />;
    })}
  </AbsoluteFill>;
};
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='256' height='256' filter='url(%23n)' opacity='0.55'/></svg>")`;
export const Atmos: React.FC<{t: number}> = ({t}) => {
  const fr = Math.floor(t * FPS);
  return <>
    <AbsoluteFill style={{backgroundImage: GRAIN, backgroundSize: '256px 256px', backgroundPosition: `${(Math.floor(fr / 2) * 37) % 256}px ${(Math.floor(fr / 2) * 91) % 256}px`, opacity: 0.075, mixBlendMode: 'overlay'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 78% 74% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)'}} />
  </>;
};

/* ---------- Obj: a positioned, animated object in the scene (centre-anchored) ---------- */
export type From = 'pop' | 'up' | 'down' | 'left' | 'right' | 'zoom' | 'flip' | 'none';
export const Obj: React.FC<{t0: number; t1?: number; x: number; y: number; from?: From; rotY?: number; rotX?: number; rot?: number; depth?: number; float?: number; scale?: number; z?: number; style?: React.CSSProperties; children?: React.ReactNode}> =
({t0, t1, x, y, from = 'pop', rotY = 0, rotX = 0, rot = 0, depth = 0, float = 5, scale = 1, z = 1, style, children}) => {
  const t = useT(); const cam = React.useContext(CamCtx); const sc = React.useContext(SceneCtx);
  if (t < t0 - 0.02 || (t1 !== undefined && t > t1 + 0.35)) return null;
  const a = spring(t, t0, 14, 7.5); let op = ramp(t, t0, t0 + 0.16); let tx = 0, ty = 0, s = 1, rx = 0;
  const blur = (1 - ramp(t, t0, t0 + 0.26)) * 14;
  if (from === 'pop') s = 0.55 + 0.45 * a; else if (from === 'up') { ty = (1 - a) * 100; s = 0.95 + 0.05 * a; } else if (from === 'down') { ty = -(1 - a) * 100; s = 0.95 + 0.05 * a; }
  else if (from === 'left') tx = -(1 - a) * 460; else if (from === 'right') tx = (1 - a) * 460; else if (from === 'zoom') s = 1.6 - 0.6 * a; else if (from === 'flip') rx = -(1 - ramp(t, t0, t0 + 0.55, 0, 1, eo)) * 95;
  if (t1 !== undefined && t > t1) { const p = ramp(t, t1, t1 + 0.3); op *= 1 - p; s *= 1 - 0.07 * p; ty += 26 * p; }
  const fl = float ? Math.sin(t * 1.25 + x * 0.013) * float : 0; const sway = Math.sin(t * 0.7 + y * 0.01) * 1.4;
  const px = -(cam.x - sc.cx) * depth * 0.22, py = -(cam.y - sc.cy) * depth * 0.22;
  return <div style={{position: 'absolute', left: x, top: y, zIndex: Math.round(z * 10), opacity: op, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, transformOrigin: '50% 50%', width: 'max-content',
    transform: `translate(-50%, -50%) translate(${px + tx}px, ${py + ty + fl}px) perspective(1700px) rotateX(${rotX + rx}deg) rotateY(${rotY + sway * (rotY ? 1 : 0)}deg) rotate(${rot}deg) scale(${s * scale})`, ...style}}>{children}</div>;
};

/* ---------- Card / Pill / Title / Big / Stamp / Hi ---------- */
export const Card: React.FC<{w: number; h?: number; v?: 'blue' | 'red' | 'plain'; label?: string; tag?: string; pad?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({w, h, v = 'blue', label, tag, pad = 34, style, children}) => {
  const red = v === 'red', glow = red ? '255,46,74' : '47,123,255';
  return <div style={{width: w, height: h, borderRadius: 28, padding: pad, paddingTop: label ? pad + 26 : pad, position: 'relative', boxSizing: 'border-box',
    background: red ? 'linear-gradient(160deg, rgba(96,14,36,0.95) 0%, rgba(30,6,18,0.97) 72%)' : 'linear-gradient(160deg, rgba(18,40,88,0.95) 0%, rgba(6,15,36,0.97) 72%)',
    border: `2.5px solid ${v === 'plain' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.92)'}`,
    boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.35), 0 0 0 6px rgba(${glow},0.16), 0 0 44px rgba(${glow},0.45), 0 30px 70px rgba(0,0,0,0.65)`, color: C.white, ...style}}>
    {label && <div style={{position: 'absolute', left: 30, top: 20, display: 'flex', alignItems: 'center', gap: 10, fontFamily: F.hero, fontSize: 21, letterSpacing: 3.2, color: red ? C.redL : C.blueL, textTransform: 'uppercase'}}>
      <span style={{width: 10, height: 10, borderRadius: 5, background: red ? C.red : C.blue, boxShadow: `0 0 10px ${red ? C.red : C.blue}`}} />{label}</div>}
    {tag && <div style={{position: 'absolute', right: 26, top: 18, fontFamily: F.mono, fontSize: 19, letterSpacing: 2, color: C.mute}}>{tag}</div>}
    {children}
  </div>;
};
export type PV = 'dark' | 'red' | 'blue' | 'ghost';
export const Pill: React.FC<{text: string; icon?: React.ReactNode; v?: PV; size?: number; strike?: number; style?: React.CSSProperties}> = ({text, icon, v = 'dark', size = 34, strike, style}) => {
  const bg = v === 'red' ? 'linear-gradient(100deg, #FF2E4A, #B3122E)' : v === 'blue' ? 'linear-gradient(100deg, #3F8CFF, #1A4FC0)' : v === 'ghost' ? 'rgba(8,18,44,0.55)' : 'rgba(8,18,44,0.95)';
  const glow = v === 'red' ? '255,46,74' : '47,123,255';
  return <div style={{position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 14, height: size * 2, padding: `0 ${size * 0.9}px`, borderRadius: size, background: bg, border: '2.5px solid rgba(255,255,255,0.95)', whiteSpace: 'nowrap',
    boxShadow: `0 0 26px rgba(${glow},0.55), 0 14px 30px rgba(0,0,0,0.5)`, fontFamily: F.hero, fontSize: size, letterSpacing: size * 0.075, textTransform: 'uppercase', color: C.white, ...style}}>
    {icon}<span>{text}</span>
    {strike !== undefined && <div style={{position: 'absolute', left: size * 0.5, top: '50%', height: 5, width: `${strike * 100 - 6}%`, background: C.red, borderRadius: 3, boxShadow: `0 0 12px ${C.red}`, transform: 'rotate(-2deg)'}} />}
  </div>;
};
export const Title: React.FC<{children: React.ReactNode; size?: number; hot?: boolean; style?: React.CSSProperties}> = ({children, size = 150, hot, style}) =>
  <div style={{fontFamily: F.display, fontSize: size, lineHeight: 1.04, textTransform: 'uppercase', textAlign: 'center', whiteSpace: 'nowrap', letterSpacing: size * 0.012, color: 'transparent',
    background: hot ? 'linear-gradient(180deg, #FF8A99 0%, #FF2E4A 60%, #D01232 100%)' : 'linear-gradient(180deg, #FFFFFF 18%, #BFDDFF 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text',
    WebkitTextStroke: hot ? `${Math.max(3, size * 0.026)}px #fff` : '0px', paintOrder: 'stroke fill',
    filter: hot ? `drop-shadow(0 ${size * 0.04}px 0 #5a0a1c) drop-shadow(0 0 ${size * 0.2}px rgba(255,46,74,0.6))` : `drop-shadow(0 ${size * 0.04}px 0 #0a1a3a) drop-shadow(0 0 ${size * 0.2}px rgba(47,123,255,0.6))`, ...style}}>{children}</div>;
export const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 64, color = C.white, style}) =>
  <div style={{fontFamily: F.uiB, fontSize: size, lineHeight: 1.12, color, ...style}}>{children}</div>;
export const Small: React.FC<{children: React.ReactNode; size?: number; color?: string; mono?: boolean; style?: React.CSSProperties}> = ({children, size = 26, color = C.mute, mono, style}) =>
  <div style={{fontFamily: mono ? F.mono : F.ui, fontSize: size, lineHeight: 1.25, color, letterSpacing: mono ? 2 : 0, ...style}}>{children}</div>;
export const Src: React.FC<{text: string; style?: React.CSSProperties}> = ({text, style}) =>
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: F.mono, fontSize: 21, letterSpacing: 2, color: C.blueL, textTransform: 'uppercase', ...style}}>
    <span style={{width: 8, height: 8, background: C.blueL, transform: 'rotate(45deg)'}} />{text}</div>;
export const Stamp: React.FC<{t0: number; text: string; color?: string; size?: number; rot?: number; sub?: string; style?: React.CSSProperties}> = ({t0, text, color = C.red, size = 84, rot = -6, sub, style}) => {
  const t = useT(); const k = t - t0; if (k < 0) return null;
  const s = k < 0.14 ? 2.3 - 1.3 * (k / 0.14) : 1; const sh = k < 0.4 ? Math.sin(k * 90) * 6 * (1 - k / 0.4) : 0; const op = ramp(t, t0, t0 + 0.06);
  return <div style={{display: 'inline-block', opacity: op, transform: `rotate(${rot}deg) translate(${sh}px, ${-sh * 0.4}px) scale(${s})`, padding: `${size * 0.1}px ${size * 0.3}px`, border: `${Math.max(5, size * 0.075)}px solid ${color}`, borderRadius: size * 0.14, color, textAlign: 'center',
    boxShadow: `0 0 0 3px rgba(0,0,0,0.25), inset 0 0 0 3px ${color}55, 0 0 30px ${color}66`, background: 'rgba(5,11,26,0.35)', ...style}}>
    <div style={{fontFamily: F.hero, fontSize: size, letterSpacing: size * 0.06, lineHeight: 1, textTransform: 'uppercase'}}>{text}</div>
    {sub && <div style={{fontFamily: F.mono, fontSize: size * 0.26, letterSpacing: size * 0.04, marginTop: size * 0.08, opacity: 0.85}}>{sub}</div>}
  </div>;
};
export const Hi: React.FC<{t0: number; dur?: number; children: React.ReactNode; color?: string}> = ({t0, dur = 0.45, children, color = 'rgba(255,46,74,0.88)'}) => {
  const t = useT(); const p = ramp(t, t0, t0 + dur, 0, 1, eio);
  return <span style={{backgroundImage: `linear-gradient(${color}, ${color})`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 78%', backgroundSize: `${p * 100}% 86%`, padding: '0 8px', margin: '0 -8px', color: C.white, WebkitBoxDecorationBreak: 'clone'}}>{children}</span>;
};
export const Count: React.FC<{t0: number; dur?: number; from?: number; to: number; fmt: (v: number) => string; size?: number; color?: string; font?: string; style?: React.CSSProperties}> = ({t0, dur = 1.1, from = 0, to, fmt, size = 120, color = C.white, font = F.display, style}) => {
  const t = useT(); const v = ramp(t, t0, t0 + dur, from, to, eo);
  return <div style={{fontFamily: font, fontSize: size, lineHeight: 1, color, fontVariantNumeric: 'tabular-nums', ...style}}>{fmt(v)}</div>;
};
export const commas = (v: number) => Math.round(v).toLocaleString('en-GB');
export const Type: React.FC<{t0: number; text: string; cps?: number; cursor?: boolean; style?: React.CSSProperties}> = ({t0, text, cps = 26, cursor = true, style}) => {
  const t = useT(); const n = Math.max(0, Math.min(text.length, Math.floor((t - t0) * cps))); const on = Math.floor(t * 2.4) % 2 === 0;
  return <span style={style}>{text.slice(0, n)}{cursor && n < text.length + 4 && <span style={{opacity: on ? 1 : 0, color: C.red}}>|</span>}</span>;
};

/* ---------- screen-space overlays: Spotlight / Ring / Connector / Flash / Shockwave ---------- */
export const Spot: React.FC<{t0: number; t1: number; x: number; y: number; rx: number; ry: number; dim?: number}> = ({t0, t1, x, y, rx, ry, dim = 0.78}) => {
  const t = useT(); const o = ramp(t, t0, t0 + 0.3) * (1 - ramp(t, t1, t1 + 0.3)); if (o <= 0.01) return null;
  return <AbsoluteFill style={{pointerEvents: 'none', opacity: o, background: `radial-gradient(ellipse ${rx}px ${ry}px at ${x}px ${y}px, rgba(2,6,16,0) 55%, rgba(2,6,16,${dim}) 100%)`}} />;
};
export const Ring: React.FC<{t0: number; x: number; y: number; w: number; h: number; color?: string; dur?: number; sw?: number}> = ({t0, x, y, w, h, color = C.red, dur = 0.5, sw = 7}) => {
  const t = useT(); const p = ramp(t, t0, t0 + dur, 0, 1, eio); if (p <= 0) return null; const L = Math.PI * (w + h) * 0.78;
  return <svg width={w + 40} height={h + 40} style={{position: 'absolute', left: x - (w + 40) / 2, top: y - (h + 40) / 2, overflow: 'visible', filter: `drop-shadow(0 0 10px ${color})`}}>
    <ellipse cx={(w + 40) / 2} cy={(h + 40) / 2} rx={w / 2} ry={h / 2} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${L * p} ${L}`} transform={`rotate(-8 ${(w + 40) / 2} ${(h + 40) / 2})`} />
  </svg>;
};
export const Conn: React.FC<{t0: number; x1: number; y1: number; x2: number; y2: number; color?: string; label?: string; dur?: number; sag?: number}> = ({t0, x1, y1, x2, y2, color = C.red, label, dur = 0.6, sag = 60}) => {
  const t = useT(); const p = ramp(t, t0, t0 + dur, 0, 1, eio); if (p <= 0) return null;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + sag; const d = `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`; const L = Math.hypot(x2 - x1, y2 - y1) * 1.12;
  return <>
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', filter: `drop-shadow(0 0 8px ${color})`}}>
      <path d={d} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeDasharray={`${L * p} ${L}`} />
      <circle cx={x1} cy={y1} r={11} fill={C.white} stroke={color} strokeWidth={4} /><circle cx={x2} cy={y2} r={11} fill={C.white} stroke={color} strokeWidth={4} opacity={p > 0.95 ? 1 : 0} />
    </svg>
    {label && p > 0.6 && <div style={{position: 'absolute', left: mx, top: my * 0.5 + (y1 + y2) / 4, transform: 'translate(-50%,-50%)'}}><Pill text={label} v="red" size={24} /></div>}
  </>;
};
export const Flash: React.FC<{t0: number; color?: string; peak?: number; dur?: number}> = ({t0, color = '#fff', peak = 0.5, dur = 0.22}) => {
  const t = useT(); const k = t - t0; if (k < 0 || k > dur) return null; return <AbsoluteFill style={{background: color, opacity: peak * (1 - k / dur), pointerEvents: 'none'}} />;
};
export const Shock: React.FC<{t0: number; x: number; y: number; color?: string; size?: number}> = ({t0, x, y, color = C.red, size = 700}) => {
  const t = useT(); const k = t - t0; if (k < 0 || k > 0.7) return null; const p = k / 0.7;
  return <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: '50%', border: `${Math.max(2, 16 * (1 - p))}px solid ${color}`, opacity: 0.8 * (1 - p), transform: `scale(${0.15 + 0.85 * eo(p)})`, boxShadow: `0 0 40px ${color}`, pointerEvents: 'none'}} />;
};

/* ---------- icons (line style, 100×100) ---------- */
const I: Record<string, React.ReactNode> = {
  person: <><circle cx={50} cy={32} r={17} /><path d="M16 90 C16 60 84 60 84 90" /></>, phone: <><rect x={30} y={10} width={40} height={80} rx={9} /><path d="M44 80H56" /></>,
  clock: <><circle cx={50} cy={50} r={37} /><path d="M50 26V50L67 60" /></>, calendar: <><rect x={14} y={22} width={72} height={64} rx={9} /><path d="M14 42H86M32 11V30M68 11V30" /></>,
  tv: <><rect x={10} y={20} width={80} height={54} rx={7} /><path d="M32 88H68M50 74V88" /></>, pad: <><path d="M26 34H74Q90 34 92 60L88 76Q84 86 76 76L68 66H32L24 76Q16 86 12 76L8 60Q10 34 26 34Z" /><path d="M30 46V58M25 52H35" /><circle cx={66} cy={47} r={3} /><circle cx={75} cy={55} r={3} /></>,
  bed: <><path d="M10 72V28M10 58H90V72M90 58V46Q90 40 82 40H44V58" /><circle cx={26} cy={46} r={8} /></>, stick: <><rect x={12} y={38} width={62} height={26} rx={7} /><path d="M74 45H90V57H74" /><circle cx={28} cy={51} r={3} /></>,
  scales: <><path d="M50 14V84M30 84H70M18 30H82M18 30L8 58H28ZM82 30L72 58H92Z" /></>, basket: <><path d="M16 42H84L75 84H25ZM32 42L43 18M68 42L57 18" /></>,
  lock: <><rect x={22} y={44} width={56} height={42} rx={9} /><path d="M34 44V32A16 16 0 0 1 66 32V44" /><circle cx={50} cy={65} r={4} /></>, tick: <path d="M16 54L40 78L84 26" />, cross: <path d="M22 22L78 78M78 22L22 78" />,
  warn: <><path d="M50 14L90 84H10Z" /><path d="M50 40V60M50 71V73" /></>, siren: <><path d="M28 80V56A22 22 0 0 1 72 56V80ZM18 80H82M50 12V22M16 28L25 34M84 28L75 34" /></>, chat: <path d="M12 22H88V66H44L26 86V66H12Z" />,
  wifi: <><path d="M10 40A56 56 0 0 1 90 40M25 55A35 35 0 0 1 75 55M40 69A15 15 0 0 1 60 69" /><circle cx={50} cy={82} r={3} /></>, thermo: <path d="M42 14H58V56A19 19 0 1 1 42 56ZM50 36V68" />,
  house: <path d="M10 50L50 16L90 50M22 44V86H78V44M42 86V62H58V86" />, case: <><rect x={12} y={30} width={76} height={54} rx={9} /><path d="M36 30V18H64V30M12 56H88" /></>, chair: <path d="M30 12H70V50H30ZM22 50H78M50 50V76M28 90L50 76L72 90" />,
  mountain: <path d="M6 84L38 26L56 58L68 40L94 84Z" />, moon: <path d="M62 14A38 38 0 1 0 86 66A32 32 0 0 1 62 14Z" />, bell: <path d="M24 72V46A26 26 0 0 1 76 46V72L84 80H16ZM41 88H59" />,
  bag: <><rect x={22} y={28} width={56} height={60} rx={15} /><path d="M36 28V18H64V28M34 60H66V76H34Z" /></>, school: <path d="M8 46L50 20L92 46V86H8ZM42 86V64H58V86M50 20V8" />, flag: <path d="M24 90V12M24 14H80L68 34L80 54H24" />,
  pound: <path d="M64 24C54 14 36 18 36 36V56C36 70 30 76 22 82H78M26 56H62" />, dots: <><circle cx={22} cy={50} r={7} /><circle cx={50} cy={50} r={7} /><circle cx={78} cy={50} r={7} /></>, search: <><circle cx={42} cy={42} r={26} /><path d="M62 62L88 88" /></>,
  brick: <><rect x={12} y={42} width={76} height={40} rx={7} /><circle cx={32} cy={32} r={8} /><circle cx={50} cy={32} r={8} /><circle cx={68} cy={32} r={8} /></>, book: <path d="M50 26C36 16 20 16 10 22V80C20 74 36 74 50 84C64 74 80 74 90 80V22C80 16 64 16 50 26ZM50 26V84" />,
  shirt: <path d="M34 16L10 32L22 48L32 42V86H68V42L78 48L90 32L66 16C62 26 38 26 34 16Z" />, sun: <><circle cx={50} cy={50} r={18} /><path d="M50 10V22M50 78V90M10 50H22M78 50H90M22 22L30 30M70 70L78 78M78 22L70 30M30 70L22 78" /></>,
  speaker: <path d="M14 38H32L56 20V80L32 62H14ZM68 34C77 42 77 58 68 66M78 24C95 40 95 60 78 76" />, heart: <path d="M50 84C10 56 14 22 36 22C44 22 50 28 50 34C50 28 56 22 64 22C86 22 90 56 50 84Z" />,
  voucher: <><rect x={8} y={26} width={84} height={48} rx={8} /><path d="M66 26V74" strokeDasharray="6 7" /><circle cx={34} cy={50} r={9} /></>, key: <><circle cx={32} cy={50} r={16} /><path d="M48 50H90M76 50V64M64 50V60" /></>,
  disc: <><circle cx={50} cy={50} r={38} /><circle cx={50} cy={50} r={9} /><path d="M24 34A30 30 0 0 1 40 22" /></>, download: <path d="M50 12V62M30 44L50 64L70 44M16 80H84" />,
  hourglass: <path d="M28 12H72M28 88H72M32 12V26L50 50L68 26V12M32 88V74L50 50L68 74V88" />, building: <><rect x={24} y={12} width={52} height={76} rx={4} /><path d="M38 28H44M56 28H62M38 44H44M56 44H62M38 60H44M56 60H62M44 88V74H56V88" /></>,
  group: <><circle cx={34} cy={34} r={12} /><circle cx={68} cy={38} r={10} /><path d="M10 84C10 62 58 62 58 84M58 66C64 62 90 64 90 84" /></>, star: <path d="M50 10L61 38L92 40L68 60L76 90L50 74L24 90L32 60L8 40L39 38Z" />,
  newspaper: <><rect x={14} y={18} width={72} height={64} rx={6} /><path d="M26 34H74M26 48H50M26 62H50M60 48H74V62H60Z" /></>, trophy: <path d="M30 14H70V40C70 56 60 64 50 64C40 64 30 56 30 40ZM30 22H14C14 40 20 46 30 46M70 22H86C86 40 80 46 70 46M50 64V78M34 88H66" />,
  snow: <path d="M50 8V92M14 29L86 71M86 29L14 71M38 14L50 24L62 14M38 86L50 76L62 86" />, flame: <path d="M50 8C58 28 78 40 76 64C74 82 62 92 50 92C36 92 24 82 24 64C24 50 34 44 38 30C44 38 46 44 50 8Z" />,
  up: <path d="M50 88V16M22 44L50 14L78 44" />, down: <path d="M50 12V84M22 56L50 86L78 56" />, desk: <><rect x={10} y={40} width={80} height={12} rx={4} /><path d="M20 52V86M80 52V86M34 40V24H66V40" /></>,
    door: <><rect x={26} y={12} width={48} height={78} rx={4} /><circle cx={64} cy={52} r={3.5} /></>, shield: <path d="M50 10L86 24V52C86 72 70 86 50 92C30 86 14 72 14 52V24Z" />, eye: <><path d="M6 50C22 24 78 24 94 50C78 76 22 76 6 50Z" /><circle cx={50} cy={50} r={13} /></>,
};
export const Icon: React.FC<{n: string; size?: number; color?: string; sw?: number; style?: React.CSSProperties}> = ({n, size = 60, color = C.white, sw = 6.5, style}) =>
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flex: 'none', ...style}}>{I[n] ?? I.dots}</svg>;
