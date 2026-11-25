/* VC long-form: real photography in floating glass screens (Wikimedia Commons / NASA, credited), graded blue/red. */
import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, F, eio, ramp, useT} from './kit';

export const Photo: React.FC<{src: string; w: number; h: number; t0: number; label?: string; credit?: string; z0?: number; z1?: number; px?: number; py?: number; dur?: number; fx?: number; fy?: number; round?: boolean; dim?: number; warm?: boolean; pos?: string; children?: React.ReactNode}> =
({src, w, h, t0, label = 'ILLUSTRATIVE', credit, z0 = 1.04, z1 = 1.14, px = 30, py = 14, dur = 7, fx = 0.5, fy = 0.5, round, dim = 0.18, warm, pos = '50% 50%', children}) => {
  const t = useT(); const k = ramp(t, t0, t0 + dur, 0, 1, eio); const z = z0 + (z1 - z0) * k; const R = round ? '50%' : 26;
  const sw = ((t - t0 - 0.35) % 5.2 + 5.2) % 5.2 / 1.1;          // a glint sweeps the glass every ~5 s
  return <div style={{width: w, height: h, borderRadius: R, position: 'relative', overflow: 'hidden', background: '#050B1A', border: '3px solid rgba(255,255,255,0.93)', boxShadow: '0 0 0 6px rgba(47,123,255,0.16), 0 0 50px rgba(47,123,255,0.5), 0 32px 70px rgba(0,0,0,0.68)'}}>
    <div style={{position: 'absolute', left: '-7%', top: '-7%', width: '114%', height: '114%', transform: `translate(${(0.5 - fx) * w * 1.14 * z + px * (k - 0.5)}px, ${(0.5 - fy) * h * 1.14 * z + py * (k - 0.5)}px) scale(${z})`, filter: warm ? 'saturate(1.0) contrast(1.1) brightness(0.92)' : 'saturate(0.85) contrast(1.14) brightness(0.86)'}}>
      <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} />{children}</div>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(118deg, rgba(47,123,255,0.46) 0%, rgba(8,18,44,0.10) 48%, rgba(255,46,74,0.40) 100%)', mixBlendMode: 'soft-light'}} />
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(5,11,26,${dim}) 0%, rgba(5,11,26,0) 35%, rgba(5,11,26,${dim + 0.22}) 100%)`}} />
    <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 2px, rgba(0,0,0,0) 2px 5px)'}} />
    <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 90px rgba(0,0,0,0.55)', borderRadius: R}} />
    {sw < 1 && <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(255,255,255,0) 38%, rgba(255,255,255,0.20) 50%, rgba(255,255,255,0) 62%)', transform: `translateX(${(sw * 2 - 1) * 100}%)`}} />}
    {!round && [[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y], i) => <div key={i} style={{position: 'absolute', [x ? 'right' : 'left']: 16, [y ? 'bottom' : 'top']: 16, width: 34, height: 34, borderTop: y ? undefined : '4px solid rgba(255,255,255,0.85)', borderBottom: y ? '4px solid rgba(255,255,255,0.85)' : undefined, borderLeft: x ? undefined : '4px solid rgba(255,255,255,0.85)', borderRight: x ? '4px solid rgba(255,255,255,0.85)' : undefined}} />)}
    {!round && label && <div style={{position: 'absolute', left: 30, top: 28, display: 'flex', alignItems: 'center', gap: 9, fontFamily: F.hero, fontSize: 19, letterSpacing: 3.2, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}><span style={{width: 10, height: 10, borderRadius: 5, background: C.red, boxShadow: `0 0 10px ${C.red}`, opacity: Math.floor(t * 1.6) % 2 ? 0.25 : 1}} />{label}</div>}
    {!round && credit && <div style={{position: 'absolute', right: 26, bottom: 24, fontFamily: F.mono, fontSize: 13, letterSpacing: 1.2, color: 'rgba(255,255,255,0.78)', background: 'rgba(5,11,26,0.62)', padding: '4px 10px', borderRadius: 8}}>{/CC0|PUBLIC DOMAIN/i.test(credit) ? credit : credit + ' · EDITED'}</div>}
  </div>;
};
