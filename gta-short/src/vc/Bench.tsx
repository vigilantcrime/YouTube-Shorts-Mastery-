import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
const W = 1920, H = 1080;
const rnd = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const Particles: React.FC<{cx: number; t: number}> = ({cx, t}) => <>{Array.from({length: 70}, (_, i) => {
  const d = 0.3 + rnd(i, 1) * 1.4; const s = 2 + rnd(i, 2) * 5 * d; const x = ((rnd(i, 3) * 2600 - cx * d * 0.4 + t * (8 + rnd(i, 4) * 16)) % 2600 + 2600) % 2600 - 340;
  const y = ((rnd(i, 5) * 1300 - t * (10 + rnd(i, 6) * 22) * d) % 1300 + 1300) % 1300 - 100; const red = rnd(i, 7) > 0.5;
  return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: s, background: red ? '#ff5a6e' : '#6fa8ff', opacity: 0.15 + 0.35 * rnd(i, 8), filter: d > 1.2 ? `blur(${(d - 1.1) * 5}px)` : undefined}} />; })}</>;
export const Bench: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / 30; const cx = t * 120;
  const flare = 0.5 + 0.5 * Math.sin(t * 1.1);
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 70% at 50% 40%, #12306a 0%, #0a1a3a 45%, #050b1a 100%)', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: -300, top: -400, width: 1100, height: 1100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(47,123,255,0.55), rgba(47,123,255,0) 65%)', opacity: 0.35 + 0.5 * flare}} />
    <div style={{position: 'absolute', right: -300, top: -400, width: 1100, height: 1100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,46,74,0.5), rgba(255,46,74,0) 65%)', opacity: 0.35 + 0.5 * (1 - flare)}} />
    <div style={{position: 'absolute', left: -600, right: -600, bottom: -420, height: 900, transform: 'perspective(800px) rotateX(68deg)', transformOrigin: '50% 0', backgroundImage: 'linear-gradient(rgba(90,150,255,0.35) 2px, transparent 2px), linear-gradient(90deg, rgba(90,150,255,0.35) 2px, transparent 2px)', backgroundSize: '110px 110px', backgroundPosition: `${-cx}px 0`, WebkitMaskImage: 'linear-gradient(180deg, transparent, #000 60%)'}} />
    <Particles cx={cx} t={t} />
    {Array.from({length: 7}, (_, i) => <div key={i} style={{position: 'absolute', left: 120 + (i % 4) * 440 - cx * 0.2 % 80, top: 130 + Math.floor(i / 4) * 440, width: 400, height: 380, borderRadius: 28, background: 'rgba(8,16,36,0.9)', border: '2px solid rgba(255,255,255,0.85)', boxShadow: '0 0 30px rgba(47,123,255,0.45), 0 24px 50px rgba(0,0,0,0.55)', transform: `perspective(1400px) rotateY(${-14 + i * 4 + 3 * Math.sin(t + i)}deg) rotateX(5deg)`, padding: 24, color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: 40, fontWeight: 800}}>CARD {i} · {Math.round(56 * Math.min(1, t / 2))}%
      <svg width={340} height={200} style={{marginTop: 14}}><path d={`M0 180 C60 ${100 + 30 * Math.sin(t)} 120 160 180 70 S280 150 340 20`} stroke="#ff2e4a" strokeWidth={6} fill="none" /></svg></div>)}
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />
  </AbsoluteFill>;
};
