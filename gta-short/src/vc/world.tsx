/* The continuous canvas: scenes are laid out left→right in one world; the camera glides between them (ease + zoom dip +
   directional motion blur), idle drift/push-in inside a scene, and objects parallax by depth. Outside the world:
   HUD (brand bug, chapter pill, case progress bar) and chapter bumpers. */
import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {C, CamCtx, F, H, Icon, SceneCtx, Stage, W, cl, eio, eo, ramp, useT} from './kit';

export type SceneDef = {t0: number; t1: number; y?: number; zoom?: number; children: React.ReactNode};
export const SP = 2300;
const TA = 0.32, TB = 0.58;
const bez = Easing.bezier(0.65, 0, 0.2, 1);

export const World: React.FC<{scenes: SceneDef[]}> = ({scenes}) => {
  const t = useT();
  const centre = (i: number) => { const s = scenes[i]; const dur = Math.max(1, s.t1 - s.t0); const p = Math.min(1, Math.max(0, (t - s.t0) / dur));
    return {x: i * SP + W / 2 + Math.sin(t * 0.45 + i) * 10 + (p - 0.5) * 24, y: (s.y ?? 0) + H / 2 + Math.cos(t * 0.38 + i * 2) * 7, z: (s.zoom ?? 1) * (1 + 0.05 * p)}; };
  let k = 0; scenes.forEach((s, i) => { if (t >= s.t0 - TA) k = i; });
  let cam = {...centre(k), q: 1}; let sx = 0;
  if (k > 0) { const s = scenes[k]; const q = (t - (s.t0 - TA)) / (TA + TB);
    if (q < 1) { const e = bez(Math.max(0, q)); const A = centre(k - 1), B = centre(k); const e2 = bez(Math.min(1, q + 0.02)); const dip = 1 - 0.1 * Math.sin(Math.PI * Math.max(0, q));
      cam = {x: A.x + (B.x - A.x) * e, y: A.y + (B.y - A.y) * e, z: (A.z + (B.z - A.z) * e) * dip, q};
      sx = Math.min(24, (Math.hypot(B.x - A.x, B.y - A.y) * (e2 - e)) / (0.02 * (TA + TB)) * 0.0052); } }
  return <CamCtx.Provider value={cam}>
    <Stage cx={cam.x} cy={cam.y} t={t} />
    <svg width={0} height={0} style={{position: 'absolute'}}><defs><filter id="vcmb" filterUnits="userSpaceOnUse" x={-30000} y={-30000} width={90000} height={90000}><feGaussianBlur stdDeviation={`${sx} 0`} /></filter></defs></svg>
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${W / 2 - cam.x * cam.z}px, ${H / 2 - cam.y * cam.z}px) scale(${cam.z})`, filter: sx > 0.4 ? 'url(#vcmb)' : undefined}}>
      {scenes.map((s, i) => (t >= s.t0 - TA - 0.4 && t <= s.t1 + TB + 0.5) ? <div key={i} style={{position: 'absolute', left: i * SP, top: s.y ?? 0, width: W, height: H}}>
        <SceneCtx.Provider value={{t0: s.t0, t1: s.t1, cx: i * SP + W / 2, cy: (s.y ?? 0) + H / 2}}>{s.children}</SceneCtx.Provider></div> : null)}
    </div>
  </CamCtx.Provider>;
};

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
  const x = (1 - inn) * -W + out * W; const BAND = 'repeating-conic-gradient(#fff 0% 25%, #2F7BFF 0% 50%) 0 0 / 44px 44px';
  return <>
    <AbsoluteFill style={{background: 'rgba(2,6,18,0.5)', opacity: inn * (1 - out), pointerEvents: 'none'}} />
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
