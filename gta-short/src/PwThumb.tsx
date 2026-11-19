/* @imjustgta thumbnails for the Fast & Furious car video — 3 variants for YouTube "Test & Compare". 1280×720. */
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {useFontsReady} from './kit3d';

const W = 1280, H = 720;
/** Source frames are 1280×714. Place source point (px,py) at screen (tx,ty) with zoom z. */
const Shot: React.FC<{src: string; p: [number, number]; t: [number, number]; z: number; grade?: string}> = ({src, p, t, z, grade = 'saturate(1.45) contrast(1.18) brightness(1.06)'}) =>
  <AbsoluteFill style={{overflow: 'hidden'}}><Img src={staticFile(`pw/thumb/${src}.jpg`)} style={{position: 'absolute', width: 1280 * z, height: 714 * z, left: t[0] - p[0] * z, top: t[1] - p[1] * z, filter: grade}} /></AbsoluteFill>;
/** Heavy outlined text: stroke layer under a fill layer (crisp at thumbnail size). */
const Big: React.FC<{children: React.ReactNode; size: number; color?: string; stroke?: number; x: number; y: number; rot?: number; grad?: string; align?: 'left' | 'center'}> = ({children, size, color = '#fff', stroke = 0.12, x, y, rot = 0, grad, align = 'left'}) => {
  const base: React.CSSProperties = {fontFamily: 'HeroBlack', fontSize: size, lineHeight: 0.92, letterSpacing: -size * 0.03, whiteSpace: 'nowrap', textAlign: align};
  return <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) ${align === 'center' ? 'translateX(-50%)' : ''}`, transformOrigin: 'left top'}}>
    <div style={{...base, color: '#000', WebkitTextStroke: `${size * stroke}px #000`, filter: 'drop-shadow(0 8px 0 rgba(0,0,0,.55))'}}>{children}</div>
    <div style={{...base, position: 'absolute', inset: 0, color, ...(grad ? {backgroundImage: grad, WebkitBackgroundClip: 'text', color: 'transparent'} : {})}}>{children}</div>
  </div>;
};
const Glow: React.FC<{x: number; y: number; r: number; col: string; a?: number}> = ({x, y, r, col, a = 0.55}) =>
  <AbsoluteFill style={{background: `radial-gradient(circle ${r}px at ${x}px ${y}px, ${col} 0%, transparent 70%)`, mixBlendMode: 'screen', opacity: a}} />;
const Vignette: React.FC<{side?: 'left' | 'right'; s?: number}> = ({side = 'left', s = 0.85}) =>
  <AbsoluteFill style={{background: `linear-gradient(${side === 'left' ? '90deg' : '270deg'}, rgba(0,0,0,${s}) 0%, rgba(0,0,0,${s * 0.55}) 38%, transparent 62%), radial-gradient(ellipse 90% 85% at 60% 50%, transparent 60%, rgba(0,0,0,.6) 100%)`}} />;
const Arrow: React.FC<{x: number; y: number; rot: number; s?: number; col?: string}> = ({x, y, rot, s = 1, col = '#ff2d2d'}) =>
  <svg width={260 * s} height={160 * s} viewBox="0 0 260 160" style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 6px 0 rgba(0,0,0,.55))'}}>
    <path d="M10 120 Q 110 20 200 60" stroke="#000" strokeWidth={42} fill="none" strokeLinecap="round" /><path d="M10 120 Q 110 20 200 60" stroke={col} strokeWidth={28} fill="none" strokeLinecap="round" />
    <path d="M168 18 L 250 74 L 160 108 Z" fill={col} stroke="#000" strokeWidth={10} strokeLinejoin="round" /></svg>;
const Tag: React.FC<{x: number; y: number; bg: string; children: React.ReactNode; size?: number; rot?: number; color?: string}> = ({x, y, bg, children, size = 46, rot = -4, color = '#fff'}) =>
  <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, padding: `${size * 0.14}px ${size * 0.42}px`, borderRadius: size * 0.28, background: bg, border: `${size * 0.1}px solid #000`, boxShadow: '0 8px 0 rgba(0,0,0,.55)', fontFamily: 'HeroBlack', fontSize: size, color, whiteSpace: 'nowrap', letterSpacing: -1}}>{children}</div>;
const GTA = 'linear-gradient(90deg, #ff4fb3 0%, #ff8a3d 55%, #ffd23d 100%)';

export const PwThumb: React.FC<{v: 'A' | 'B' | 'C'}> = ({v}) => {
  const ready = useFontsReady('thumb'); if (!ready) return <AbsoluteFill style={{background: '#000'}} />;
  if (v === 'A') return <AbsoluteFill style={{background: '#000'}}>
    {/* rear 3/4 — side graphics + wing visible */}
    <Shot src="rear" p={[640, 492]} t={[870, 455]} z={1.55} />
    <Glow x={870} y={455} r={420} col="#7dff3a" a={0.35} /><Vignette side="left" s={0.88} />
    <Big size={84} x={44} y={70}>PAUL WALKER'S</Big>
    <Big size={210} x={36} y={160} color="#ffe600">CAR</Big>
    <Big size={92} x={44} y={380} grad={GTA}>IN GTA 6</Big>
    <Arrow x={400} y={430} rot={14} s={1.15} />
    <Tag x={1010} y={560} bg="#1fd14a" size={70} rot={-6}>FREE</Tag>
  </AbsoluteFill>;
  if (v === 'B') return <AbsoluteFill style={{background: '#000'}}>
    {/* garage reveal — hidden location */}
    <Shot src="garage" p={[765, 360]} t={[900, 400]} z={1.85} grade="saturate(1.5) contrast(1.22) brightness(1.08)" />
    <Glow x={900} y={400} r={380} col="#7dff3a" a={0.4} /><Vignette side="left" s={0.9} />
    <Big size={150} x={40} y={70} color="#ffe600">HIDDEN</Big>
    <Big size={74} x={46} y={235}>FAST & FURIOUS</Big>
    <Big size={74} x={46} y={318}>CAR IN <span style={{color: '#ff4fb3'}}>GTA 6</span></Big>
    <Arrow x={470} y={430} rot={-6} s={1.1} />
    <Tag x={60} y={560} bg="#111" size={48} rot={-3}>🔒 1 GARAGE ONLY</Tag>
  </AbsoluteFill>;
  // C — before / after (the crash happens about a minute after taking it)
  return <AbsoluteFill style={{background: '#000'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 640, height: H, overflow: 'hidden'}}><Shot src="garage" p={[765, 360]} t={[330, 400]} z={1.9} /></div>
    <div style={{position: 'absolute', left: 640, top: 0, width: 640, height: H, overflow: 'hidden'}}><div style={{position: 'absolute', left: -640, top: 0, width: W, height: H}}><Shot src="crash" p={[560, 420]} t={[960, 420]} z={1.9} grade="saturate(1.35) contrast(1.25) brightness(1.04)" /></div></div>
    <div style={{position: 'absolute', left: 632, top: 0, width: 16, height: H, background: '#fff', boxShadow: '0 0 0 5px #000'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,.75) 0%, transparent 34%, transparent 72%, rgba(0,0,0,.6) 100%)'}} />
    <Big size={104} x={640} y={26} align="center" color="#ffe600">1 MINUTE LATER…</Big>
    <Tag x={40} y={600} bg="#1fd14a" size={56} rot={-4}>BEFORE ✨</Tag>
    <Tag x={1000} y={600} bg="#ff2d2d" size={56} rot={4}>AFTER 💀</Tag>
  </AbsoluteFill>;
};
