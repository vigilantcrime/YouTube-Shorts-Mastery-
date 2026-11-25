/* The continuous canvas: scenes are laid out left→right in one world; the camera glides between them (ease + zoom dip +
   directional motion blur), idle drift/push-in inside a scene, and objects parallax by depth. Outside the world:
   HUD (brand bug, chapter pill, case progress bar) and chapter bumpers. */
import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {C, CamCtx, F, H, Icon, SceneCtx, Stage, W, cl, eio, eo, ramp, rnd, useT} from './kit';
import {CUES} from './anchors';

export type SceneDef = {t0: number; t1: number; y?: number; zoom?: number; children: React.ReactNode};
export const SP = 2300;
/* kick grid mirrored from tools/vc/music_lf.py (90 BPM, bars restart at each section start) so the whole world breathes on the beat */
const BEAT = 60 / 90;
const SECTK: [number, number, number[]][] = [[0, 28.9, [0, 2]], [39.4, 100.9, [0, 2]], [100.9, 161.9, [0, 2]], [161.9, 222.3, [0, 2]], [222.3, 253.2, [0, 2]], [254.8, 301.0, [0, 2]], [306.0, 332.7, [0]], [332.7, 343.2, [0, 2]], [347.3, 351.5, [0, 1, 2, 3]]];
const KICKS: number[] = []; for (const [a, b, beats] of SECTK) for (let bar = a; bar < b; bar += 4 * BEAT) for (const x of beats) { const kt = bar + x * BEAT; if (kt < b) KICKS.push(kt); }
const kickPulse = (t: number) => { let p = 0; for (const kt of KICKS) { const k = t - kt; if (k >= 0 && k < 0.3) p += Math.exp(-k * 17); else if (k < 0) break; } return p; };
const TA = 0.32, TB = 0.58;
const bez = Easing.bezier(0.65, 0, 0.2, 1);

export const World: React.FC<{scenes: SceneDef[]}> = ({scenes}) => {
  const t = useT();
  const centre = (i: number) => { const s = scenes[i]; const dur = Math.max(1, s.t1 - s.t0); const p = Math.min(1, Math.max(0, (t - s.t0) / dur));
    return {x: i * SP + W / 2 + Math.sin(t * 0.45 + i) * 10 + (p - 0.5) * 24, y: (s.y ?? 0) + H / 2 + Math.cos(t * 0.38 + i * 2) * 7, z: (s.zoom ?? 1) * (1 + 0.05 * p)}; };
  let k = 0; scenes.forEach((s, i) => { if (t >= s.t0 - TA) k = i; });
  let cam = {...centre(k), q: 1, roll: 0}; let sx = 0;
  if (k > 0) { const s = scenes[k]; const q = (t - (s.t0 - TA)) / (TA + TB);
    if (q < 1) { const e = bez(Math.max(0, q)); const A = centre(k - 1), B = centre(k); const e2 = bez(Math.min(1, q + 0.02)); const dip = 1 - 0.1 * Math.sin(Math.PI * Math.max(0, q));
      cam = {x: A.x + (B.x - A.x) * e, y: A.y + (B.y - A.y) * e, z: (A.z + (B.z - A.z) * e) * dip, q, roll: Math.sin(Math.PI * Math.max(0, Math.min(1, q))) * (k % 2 ? 1.5 : -1.5)};
      sx = Math.min(24, (Math.hypot(B.x - A.x, B.y - A.y) * (e2 - e)) / (0.02 * (TA + TB)) * 0.0052); } }
  let shx = 0, shy = 0, shr = 0, shs = 1 + 0.0042 * kickPulse(t);
  for (const c of CUES) { if (c[1] !== 'slam' && c[1] !== 'bump' && c[1] !== 'tick') continue; const ct = c[1] === 'tick' ? c[0] + c[2] : c[0]; const kk = t - ct; if (kk < 0 || kk > 0.45) continue;
    const amp = (c[1] === 'bump' ? 1.5 : c[1] === 'tick' ? 0.55 : 1) * Math.pow(1 - kk / 0.45, 2); shx += Math.sin(kk * 74 + c[0] * 13) * 11 * amp; shy += Math.cos(kk * 91 + c[0] * 7) * 8 * amp; shr += Math.sin(kk * 57 + c[0]) * 0.28 * amp; shs += 0.022 * Math.pow(Math.max(0, 1 - kk / 0.28), 2) * (c[1] === 'bump' ? 1.4 : 1); }
  return <CamCtx.Provider value={cam}>
    <Stage cx={cam.x} cy={cam.y} t={t} />
    <svg width={0} height={0} style={{position: 'absolute'}}><defs><filter id="vcmb" filterUnits="userSpaceOnUse" x={-30000} y={-30000} width={90000} height={90000}><feGaussianBlur stdDeviation={`${sx} 0`} /></filter></defs></svg>
    <div style={{position: 'absolute', inset: 0, transformOrigin: '50% 50%', transform: `translate(${shx}px, ${shy}px) rotate(${cam.roll + shr}deg) scale(${shs})`}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${W / 2 - cam.x * cam.z}px, ${H / 2 - cam.y * cam.z}px) scale(${cam.z})`, filter: sx > 0.4 ? 'url(#vcmb)' : undefined}}>
      {scenes.map((s, i) => (t >= s.t0 - TA - 0.4 && t <= s.t1 + TB + 0.5) ? <div key={i} style={{position: 'absolute', left: i * SP, top: s.y ?? 0, width: W, height: H}}>
        <SceneCtx.Provider value={{t0: s.t0, t1: s.t1, cx: i * SP + W / 2, cy: (s.y ?? 0) + H / 2}}>{s.children}</SceneCtx.Provider></div> : null)}
    </div>
    </div>
    <Bokeh cx={cam.x} cy={cam.y} t={t} />
  </CamCtx.Provider>;
};

/* foreground bokeh / dust drifting faster than the world (depth) */
const Bokeh: React.FC<{cx: number; cy: number; t: number}> = ({cx, cy, t}) =>
  <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>{Array.from({length: 11}, (_, i) => {
    const d = 1.5 + rnd(i, 11) * 1.7, sz = 60 + rnd(i, 12) * 190; const x = (((rnd(i, 13) * 3000 - cx * d * 0.5 + t * (6 + rnd(i, 14) * 12)) % 3000) + 3000) % 3000 - 500; const y = (((rnd(i, 15) * 1500 - cy * d * 0.22 - t * (4 + rnd(i, 16) * 8)) % 1500) + 1500) % 1500 - 220;
    const red = rnd(i, 17) > 0.55; const col = red ? '255,70,96' : '90,150,255';
    return <div key={i} style={{position: 'absolute', left: x, top: y, width: sz, height: sz, borderRadius: '50%', background: `radial-gradient(circle, rgba(${col},0.55) 0%, rgba(${col},0.18) 55%, rgba(${col},0) 70%)`, opacity: 0.16 + 0.2 * rnd(i, 18), filter: `blur(${6 + sz * 0.05}px)`, mixBlendMode: 'screen'}} />; })}</AbsoluteFill>;

/* ---------- HUD ---------- */
export type Chapter = {t: number; n: string; name: string};
export const HUD: React.FC<{chapters: Chapter[]; end: number; caseId: string}> = ({chapters, end, caseId}) => {
  const t = useT(); const cur = [...chapters].reverse().find((c) => t >= c.t + 1.2);
  const blink = Math.floor(t * 1.6) % 2 === 0; const mm = String(Math.floor(t / 60)).padStart(2, '0'), ss = String(Math.floor(t % 60)).padStart(2, '0');
  const p = Math.min(1, t / end);
  return <>
    <div style={{position: 'absolute', left: 56, top: 40, display: 'flex', flexDirection: 'column', gap: 8, opacity: 0.95}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <div style={{width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg, #2F7BFF 0 50%, #FF2E4A 50% 100%)', border: '2.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(47,123,255,0.5)'}}><Icon n="eye" size={30} sw={7} /></div>
        <div style={{fontFamily: F.hero, fontSize: 27, letterSpacing: 3.5, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.6)'}}>VIGILANT <span style={{color: C.red}}>CRIME</span></div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: F.mono, fontSize: 18, letterSpacing: 2.5, color: C.blueL}}>
        <span style={{width: 12, height: 12, borderRadius: 6, background: C.red, opacity: blink ? 1 : 0.2, boxShadow: `0 0 10px ${C.red}`}} />{caseId} · {mm}:{ss}</div>
    </div>
    {cur && <div style={{position: 'absolute', right: 56, top: 44, opacity: 0.95 * ramp(t, cur.t + 1.2, cur.t + 1.5), display: 'flex', alignItems: 'center', gap: 14, height: 56, padding: '0 26px', borderRadius: 28, background: 'rgba(8,18,44,0.92)', border: '2.5px solid rgba(255,255,255,0.9)', boxShadow: '0 0 22px rgba(47,123,255,0.45)', fontFamily: F.hero, fontSize: 23, letterSpacing: 3, color: '#fff'}}>
      <span style={{color: C.red}}>FILE {cur.n}</span><span style={{opacity: 0.5}}>·</span><span>{cur.name}</span></div>}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 7, background: 'rgba(255,255,255,0.10)'}}>
      <div style={{width: `${p * 100}%`, height: '100%', background: 'linear-gradient(90deg, #2F7BFF, #8FC1FF 55%, #FF2E4A)', boxShadow: '0 0 14px rgba(47,123,255,0.8)'}} />
      {chapters.filter((c) => c.t <= Math.max(t, 254.9)).map((c, i) => <div key={i} style={{position: 'absolute', left: `${(c.t / end) * 100}%`, top: -4, width: 3, height: 15, background: '#fff', opacity: 0.7}} />)}
    </div>
  </>;
};

/* ---------- chapter bumper: a banner strip across the middle (scene stays visible above/below) ---------- */
export const Bumper: React.FC<{t0: number; n: string; title: string; sub?: string}> = ({t0, n, title, sub}) => {
  const t = useT(); const k = t - t0; if (k < -0.05 || k > 1.9) return null;
  const inn = ramp(k, 0, 0.32, 0, 1, Easing.out(Easing.cubic)), out = ramp(k, 1.45, 1.8, 0, 1, Easing.in(Easing.cubic));
  const hit = k > 0.28 && k < 0.5 ? 0.34 * (1 - (k - 0.28) / 0.22) : 0; const x = (1 - inn) * -W + out * W; const BAND = 'repeating-conic-gradient(#fff 0% 25%, #2F7BFF 0% 50%) 0 0 / 44px 44px';
  return <>
    <AbsoluteFill style={{background: 'rgba(2,6,18,0.5)', opacity: inn * (1 - out), pointerEvents: 'none'}} />
    {hit > 0 && <AbsoluteFill style={{background: '#fff', opacity: hit, pointerEvents: 'none'}} />}
    <div style={{position: 'absolute', left: 0, top: 330, width: W, height: 420, transform: `translateX(${x}px)`}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 44, background: BAND}} /><div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 44, background: BAND}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 44, bottom: 44, background: 'linear-gradient(100deg, #0a2a6e 0%, #071733 52%, #5a0a1c 100%)', boxShadow: '0 0 60px rgba(47,123,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 70}}>
        <div style={{fontFamily: F.display, fontSize: 250, lineHeight: 1, color: 'transparent', WebkitTextStroke: '5px #fff', paintOrder: 'stroke fill', filter: 'drop-shadow(0 0 28px rgba(255,46,74,0.7))', transform: `scale(${1 + 0.06 * (1 - ramp(k, 0.2, 0.7))})`}}>{n}</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          <div style={{fontFamily: F.mono, fontSize: 30, letterSpacing: 6, color: C.red}}>FILE {n} · CASE VC-LF-001</div>
          <div style={{fontFamily: F.display, fontSize: 124, lineHeight: 1.02, color: '#fff', textTransform: 'uppercase', letterSpacing: 2, textShadow: '0 5px 0 #0a1a3a, 0 0 40px rgba(47,123,255,0.6)', opacity: ramp(k, 0.18, 0.42)}}>{title}</div>
          {sub && <div style={{fontFamily: F.ui, fontSize: 34, color: C.blueL, opacity: ramp(k, 0.3, 0.55)}}>{sub}</div>}
        </div>
      </div>
    </div>
  </>;
};
export {cl, eio, eo};
