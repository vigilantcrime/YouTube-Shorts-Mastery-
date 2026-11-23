/* r58 "am I better looking than the main character?" — pundit split (presenter top, gameplay bottom) with our own
   1–3 word captions (clip has none). Gags: VS slam + crown on the main character, mum's "yes" texts stacking,
   CRT switch-off on "without even looking at the screen", cousin polaroid that flips to a boiled potato,
   a live poll card (HIM vs MAIN CHARACTER) that drives comments, then the poll result cracks his avatar. */
import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {cl, useFontsReady} from './kit3d';

const W = 1080, H = 1920, FPS = 30, SEAM = 875, BH = H - SEAM;
export const FB4_FRAMES = 602;
const f = (s: number) => Math.round(s * FPS);
const YEL = '#FFE600', MAG = '#FF2BD6', CYA = '#22D3EE';
const eo = Easing.out(Easing.cubic), eio = Easing.inOut(Easing.cubic);
const ramp = (t: number, a: number, b: number, from = 0, to = 1, e = eo) => interpolate(t, [a, b], [from, to], {...cl, easing: e});
const popS = (t: number, t0: number) => interpolate((t - t0) * FPS, [0, 4, 8], [0.3, 1.14, 1], cl);
const spring = (t: number, t0: number, amp: number, k = 22, d = 6) => (t < t0 ? 0 : amp * Math.exp(-d * (t - t0)) * Math.cos(k * (t - t0)));

/* word anchors (zipformer timings snapped to speech onsets) */
const A = {honest: 0.4, am: 1.56, better: 1.87, main: 2.67, mum: 4.23, yes: 4.99, every: 5.49, without: 6.63, looking: 7.19, screen: 7.79,
  but: 8.92, mum2: 9.19, cousin: 10.55, potato: 12.31, so: 13.99, second: 14.51, opinion: 14.87, comment: 15.69, below: 16.15, kind: 17.1,
  wallahi: 18.34, hurt: 19.03, rambo: 19.67};

const CAPS: [number, string, string][] = [
  [0.0, 'BE HONEST', 'HONEST'], [1.56, 'AM I BETTER', 'BETTER'], [2.07, 'LOOKING', 'LOOKING'], [2.43, 'THAN THE MAIN', 'MAIN'], [2.95, 'CHARACTER?', 'CHARACTER?'],
  [3.88, 'MY MUM', 'MUM'], [4.59, 'SAYS YES', 'YES'], [5.49, 'EVERY TIME', 'EVERY'], [6.63, 'WITHOUT EVEN', 'WITHOUT'], [7.19, 'LOOKING AT', 'LOOKING'], [7.63, 'THE SCREEN', 'SCREEN'],
  [8.92, 'BUT MY MUM', 'MUM'], [9.51, 'ALSO SAID THAT', 'ALSO'], [10.15, 'ABOUT MY COUSIN', 'COUSIN'], [11.21, 'AND HE LOOKS', 'LOOKS'], [11.67, 'LIKE A BOILED', 'BOILED'], [12.3, 'POTATO', 'POTATO'],
  [13.99, 'SO I NEED', 'NEED'], [14.39, 'A SECOND', 'SECOND'], [14.85, 'OPINION', 'OPINION'], [15.69, 'COMMENT', 'COMMENT'], [16.15, 'BELOW', 'BELOW'], [16.78, 'BE KIND', 'KIND'],
  [18.34, 'WALLAHI', 'WALLAHI'], [18.85, 'THAT HURT MORE', 'HURT'], [19.4, 'THAN THE RAMBO', 'RAMBO'],
];
const Caption: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; let k = 0; CAPS.forEach((c, i) => { if (c[0] <= t + 0.02) k = i; });
  if (t > 17.45 && t < A.wallahi) return null;
  const [t0, txt, key] = CAPS[k]; const lf = fr - f(t0); const s = interpolate(lf, [0, 3, 6], [0.82, 1.06, 1], cl);
  const i0 = txt.indexOf(key); const parts = [txt.slice(0, i0), key, txt.slice(i0 + key.length)];
  const style: React.CSSProperties = {fontFamily: 'HeroBlack', fontSize: 84, letterSpacing: -1.5, whiteSpace: 'nowrap', lineHeight: 1};
  const line = (stroke: boolean) => <div style={{...style, ...(stroke ? {color: '#000', WebkitTextStroke: '12px #000', filter: 'drop-shadow(0 5px 6px rgba(0,0,0,.55))'} : {position: 'absolute', inset: 0})}}>
    {parts.map((p, i) => <span key={i} style={stroke ? {} : {color: i === 1 ? YEL : '#fff'}}>{p}</span>)}</div>;
  return <div style={{position: 'absolute', top: 668, width: W, display: 'flex', justifyContent: 'center'}}><div style={{position: 'relative', transform: `scale(${s})`}}>{line(true)}{line(false)}</div></div>;
};
const Sfx: React.FC<{at: number; n: string; v?: number}> = ({at, n, v = 0.5}) => <Sequence from={Math.max(0, f(at))} durationInFrames={45}><Audio src={staticFile(`${n}.wav`)} volume={v} /></Sequence>;

/* ---------- top: presenter ---------- */
const ZOOM: [number, number][] = [[0, 1.0], [A.honest, 1.1], [A.am, 1.0], [2.43, 1.16], [3.88, 1.0], [A.every, 1.12], [A.without, 1.04], [A.screen, 1.2], [A.but, 1.0],
  [A.cousin, 1.1], [A.potato, 1.22], [A.so, 1.0], [A.comment, 1.08], [16.78, 1.14], [A.wallahi, 1.18], [A.hurt, 1.28]];
const zAt = (t: number) => ZOOM.reduce((z, [a, v]) => (t >= a ? v : z), 1);
const Presenter: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; let z = zAt(t); let ty = 0;
  if (t >= 17.4 && t < A.wallahi) ty = -46 * ramp(t, 17.4, A.wallahi, 0, 1, eio);        // slow tilt on the silent beat
  z += spring(t, A.hurt, 0.07, 30, 8);
  return <div style={{position: 'absolute', left: 0, top: 0, width: W, height: SEAM, overflow: 'hidden', background: '#000'}}>
    <div style={{position: 'absolute', inset: 0, transform: `translateY(${ty}px) scale(${z})`, transformOrigin: '45% 41%'}}>
      <OffthreadVideo src={staticFile('fb4/inf.mp4')} muted style={{position: 'absolute', left: 0, top: -290, width: 1080, height: 1920}} />
    </div>
    {t >= A.better && t < 3.5 && <div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 120px ${MAG}`, opacity: ramp(t, 3.2, 3.5, 1, 0)}} />}
  </div>;
};

/* ---------- bottom: gameplay ---------- */
const Gameplay: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS;
  let z = 1.0 + 0.04 * ramp(t, 0, A.main, 0, 1, eio);
  if (t >= A.main && t < 3.88) z = ramp(t, A.main, A.main + 0.22, 1.04, 1.6, Easing.out(Easing.exp));     // crash zoom on the main character
  if (t >= 3.88) z = ramp(t, 3.88, 4.1, 1.6, 1.0, eio) + 0.06 * ramp(t, 4.1, 20.1, 0, 1, eio);
  // CRT switch-off on "screen", back on at "but"
  let sy = 1, sx = 1, bright = 1;
  if (t >= A.screen && t < A.but) { sy = ramp(t, A.screen, A.screen + 0.1, 1, 0.006, Easing.in(Easing.quad)); sx = ramp(t, A.screen + 0.1, A.screen + 0.2, 1, 0.0, Easing.in(Easing.quad)); bright = 1 + 4 * ramp(t, A.screen, A.screen + 0.1); }
  if (t >= A.but && t < A.but + 0.2) { sy = ramp(t, A.but + 0.06, A.but + 0.2, 0.006, 1, eo); sx = ramp(t, A.but, A.but + 0.06, 0, 1); bright = 1 + 3 * ramp(t, A.but + 0.06, A.but + 0.2, 1, 0); }
  const dim = t >= A.second ? 1 - 0.3 * ramp(t, A.second, A.second + 0.3) : 1;
  return <div style={{position: 'absolute', left: 0, top: SEAM, width: W, height: BH, overflow: 'hidden', background: '#000'}}>
    <div style={{position: 'absolute', inset: 0, transform: `scale(${sx}, ${sy})`, filter: `brightness(${bright * dim})`}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '544px 564px'}}>
        <OffthreadVideo src={staticFile('fb4/gta.mp4')} muted style={{position: 'absolute', left: -389, top: 0, width: 1858, height: 1046}} />
      </div>
    </div>
    {t >= A.screen + 0.2 && t < A.but && <div style={{position: 'absolute', left: 540 - 6, top: BH / 2 - 6, width: 12, height: 12, borderRadius: 6, background: '#fff', boxShadow: '0 0 24px #fff', opacity: ramp(t, A.screen + 0.2, A.screen + 0.6, 1, 0)}} />}
    {/* crown drops onto the main character */}
    {t >= A.main + 0.2 && t < 3.88 && <div style={{position: 'absolute', left: 544 - 70, top: ramp(t, A.main + 0.2, A.main + 0.42, -160, 396, Easing.in(Easing.quad)) + spring(t, A.main + 0.42, -14, 30, 7), fontSize: 140, transform: `rotate(${-8 + spring(t, A.main + 0.42, 10, 26, 6)}deg)`, filter: 'drop-shadow(0 0 18px rgba(255,230,0,.9))'}}>👑</div>}
    {t >= A.better && t < 3.5 && <div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 120px ${CYA}`, opacity: ramp(t, 3.2, 3.5, 1, 0)}} />}
  </div>;
};

/* ---------- VS slam on the seam ---------- */
const VS: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; if (t < A.better || t >= 3.6) return null;
  const s = interpolate((t - A.better) * FPS, [0, 3, 6], [3, 0.9, 1], cl) * ramp(t, 3.35, 3.6, 1, 0);
  return <div style={{position: 'absolute', left: 540 - 130, top: SEAM - 95, width: 260, height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s}) rotate(-6deg)`}}>
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${MAG}, #ff7a00)`, clipPath: 'polygon(8% 0, 100% 10%, 92% 100%, 0 88%)', boxShadow: '0 0 0 8px #000'}} />
    <div style={{position: 'relative', fontFamily: 'HeroBlack', fontSize: 130, color: YEL, WebkitTextStroke: '6px #000', letterSpacing: -4, fontStyle: 'italic'}}>VS</div>
  </div>;
};

/* ---------- mum's texts (top right) ---------- */
const Bubble: React.FC<{txt: string; y: number; s: number; o: number}> = ({txt, y, s, o}) =>
  <div style={{position: 'absolute', left: 0, top: y, transform: `scale(${s})`, transformOrigin: '0 50%', opacity: o, padding: '14px 26px', borderRadius: 30, borderBottomLeftRadius: 8,
    background: '#e9e9eb', color: '#111', fontFamily: 'UIBold', fontSize: 54, whiteSpace: 'nowrap', boxShadow: '0 8px 18px rgba(0,0,0,.35)'}}>{txt}</div>;
const MumHeader: React.FC<{s: number}> = ({s}) =>
  <div style={{position: 'absolute', left: 0, top: 0, transform: `scale(${s})`, transformOrigin: '0 50%', display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px 10px 10px', borderRadius: 40, background: 'rgba(20,20,24,.85)', boxShadow: '0 8px 18px rgba(0,0,0,.4)'}}>
    <div style={{width: 74, height: 74, borderRadius: 37, background: 'linear-gradient(135deg,#ff9ab8,#ff4f87)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38}}>👩</div>
    <div style={{fontFamily: 'UIBold', fontSize: 50, color: '#fff'}}>Mum ❤️</div></div>;
const YES_T: [number, string][] = [[A.yes, 'YES 😍'], [A.every, 'yes'], [A.every + 0.13, 'YESSS'], [A.every + 0.26, 'yes ❤️'], [A.every + 0.39, 'YES!!'], [A.every + 0.52, 'yes x']];
const MumTexts: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS;
  const a = t >= A.mum && t < 6.75, b = t >= A.mum2 && t < A.cousin + 0.2;
  if (!a && !b) return null;
  const out = a ? ramp(t, 6.5, 6.75, 1, 0) : ramp(t, A.cousin, A.cousin + 0.2, 1, 0);
  const t0 = a ? A.mum : A.mum2;
  const shown = a ? YES_T.filter(([s]) => t >= s) : (t >= A.mum2 + 0.35 ? [[A.mum2 + 0.35, 'yes 😍']] as [number, string][] : []);
  const typing = a ? t < A.yes : t < A.mum2 + 0.35;
  const n = shown.length;
  return <div style={{position: 'absolute', left: 650, top: 60, width: 420, height: 600, opacity: out}}>
    <MumHeader s={popS(t, t0)} />
    {typing && <div style={{position: 'absolute', left: 0, top: 124, padding: '22px 30px', borderRadius: 30, background: '#e9e9eb', display: 'flex', gap: 10}}>
      {[0, 1, 2].map((i) => <div key={i} style={{width: 16, height: 16, borderRadius: 8, background: '#888', transform: `translateY(${Math.sin(t * 12 - i) * 5}px)`}} />)}</div>}
    {shown.map(([s, txt], i) => { const k = n - 1 - i; const y = 124 + Math.min(n - 1, 4) * 88 - k * 88 + (k === 0 ? ramp(t, s, s + 0.1, 30, 0) : 0);
      return k > 4 ? null : <Bubble key={i} txt={txt} y={y} s={popS(t, s)} o={k >= 4 ? 0.35 : 1} />; })}
  </div>;
};

/* ---------- cousin polaroid → boiled potato ---------- */
const Potato: React.FC<{t: number}> = ({t}) =>
  <svg viewBox="0 0 300 260" width="100%" height="100%">
    {[0, 1, 2].map((i) => { const p = ((t * 0.9 + i / 3) % 1); return <path key={i} d={`M${100 + i * 50} ${80 - p * 70} q 14 -16 0 -32 q -14 -16 0 -32`} fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" opacity={0.85 * (1 - p)} />; })}
    <path d="M60 150 C 40 95, 120 70, 175 78 C 240 86, 275 130, 255 180 C 238 225, 150 240, 100 222 C 60 208, 70 190, 60 150 Z" fill="#d9a766" stroke="#7a4a1d" strokeWidth="7" />
    {[[110, 190, 7], [205, 200, 6], [235, 150, 5], [95, 140, 5]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#a8743f" />)}
    <circle cx="135" cy="138" r="24" fill="#fff" stroke="#222" strokeWidth="4" /><circle cx="195" cy="132" r="24" fill="#fff" stroke="#222" strokeWidth="4" />
    <circle cx={137 + Math.sin(t * 9) * 8} cy={142 + Math.cos(t * 7) * 6} r="10" fill="#111" /><circle cx={193 + Math.sin(t * 8 + 1) * 8} cy={136 + Math.cos(t * 9) * 6} r="10" fill="#111" />
    <path d="M140 185 q 25 18 50 0" fill="none" stroke="#5a3210" strokeWidth="6" strokeLinecap="round" />
    <ellipse cx="112" cy="172" rx="14" ry="8" fill="#ff8a8a" opacity=".6" /><ellipse cx="222" cy="166" rx="14" ry="8" fill="#ff8a8a" opacity=".6" />
  </svg>;
const Polaroid: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; if (t < A.cousin || t >= A.so + 0.2) return null;
  const x = ramp(t, A.cousin, A.cousin + 0.3, 1120, 680, Easing.out(Easing.back(1.4)));
  const flip = ramp(t, A.potato - 0.18, A.potato + 0.06, 0, 180, eio);                 // flips over on "potato"
  const out = ramp(t, A.so, A.so + 0.2, 1, 0);
  const face = (back: boolean) => <div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: back ? 'rotateY(180deg)' : undefined, background: '#fbfaf6', borderRadius: 10, boxShadow: '0 16px 36px rgba(0,0,0,.55)', padding: 22}}>
    <div style={{width: 316, height: 300, borderRadius: 4, overflow: 'hidden', background: back ? 'linear-gradient(160deg,#9fd7ff,#d9f0ff)' : '#2b2f36', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {back ? <div style={{width: 290, height: 250}}><Potato t={t} /></div> : <div style={{fontFamily: 'HeroBlack', fontSize: 170, color: '#4b5361'}}>?</div>}</div>
    <div style={{marginTop: 16, textAlign: 'center', fontFamily: 'HeroBlack', fontSize: 46, color: '#222', letterSpacing: 1}}>{back ? 'COUSIN 🥔' : 'MY COUSIN'}</div></div>;
  return <div style={{position: 'absolute', left: x, top: 92, width: 360, height: 440, transform: `rotate(${7 + spring(t, A.cousin + 0.3, 4)}deg) scale(${1 + spring(t, A.potato + 0.06, 0.08, 30, 7)})`, opacity: out, perspective: 1200}}>
    <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${flip}deg)`}}>{face(false)}{face(true)}</div>
  </div>;
};

/* ---------- poll card (bottom) ---------- */
const Avatar: React.FC<{src: string; vw: number; vh: number; l: number; tp: number; cracked: boolean; t: number}> = ({src, vw, vh, l, tp, cracked, t}) =>
  <div style={{position: 'relative', width: 130, height: 130, borderRadius: 65, overflow: 'hidden', border: '6px solid #fff', flexShrink: 0, background: '#000'}}>
    <OffthreadVideo src={staticFile(src)} muted style={{position: 'absolute', left: l, top: tp, width: vw, height: vh, filter: cracked ? `grayscale(${ramp(t, A.hurt, A.hurt + 0.3)})` : undefined}} />
    {cracked && <svg viewBox="0 0 130 130" style={{position: 'absolute', inset: 0}}>{['M65 60 L20 10', 'M65 60 L120 30', 'M65 60 L100 125', 'M65 60 L10 95', 'M65 60 L60 0', 'M40 35 L30 60', 'M95 45 L110 70', 'M85 95 L60 110']
      .map((d, i) => <path key={i} d={d} stroke="#fff" strokeWidth={i < 5 ? 4 : 3} strokeDasharray="200" strokeDashoffset={200 * (1 - ramp(t, A.hurt, A.hurt + 0.12))} />)}</svg>}
  </div>;
const Poll: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; if (t < A.second) return null;
  const locked = t >= A.wallahi;
  const live = 50 + 9 * Math.sin((t - A.second) * 5.1) + 4 * Math.sin((t - A.second) * 11.3);
  const him = locked ? ramp(t, A.wallahi, A.wallahi + 0.35, live, 3, Easing.out(Easing.exp)) : live; const mc = 100 - him;
  const s = popS(t, A.second); const cracked = t >= A.hurt;
  const row = (name: string, pct: number, col: string, av: React.ReactNode, win: boolean) =>
    <div style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 26}}>{av}
      <div style={{flex: 1}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'HeroBlack', fontSize: 44, color: '#fff'}}><span>{name}{win && locked ? ' 👑' : ''}</span><span style={{color: col}}>{Math.round(pct)}%</span></div>
        <div style={{marginTop: 10, height: 30, borderRadius: 15, background: 'rgba(255,255,255,.14)', overflow: 'hidden'}}><div style={{width: `${pct}%`, height: '100%', borderRadius: 15, background: col, boxShadow: `0 0 18px ${col}`}} /></div>
      </div></div>;
  return <div style={{position: 'absolute', left: 60, top: SEAM + 150 + spring(t, A.wallahi, -18, 28, 6), width: 960, transform: `scale(${s})`, transformOrigin: '50% 0'}}>
    <div style={{padding: 6, borderRadius: 40, background: `linear-gradient(120deg, ${MAG}, #ff8a00, ${CYA})`, boxShadow: '0 24px 50px rgba(0,0,0,.6)'}}>
      <div style={{borderRadius: 34, background: 'rgba(12,10,22,.92)', padding: '30px 40px 40px'}}>
        <div style={{fontFamily: 'HeroBlack', fontSize: 58, color: '#fff', letterSpacing: -1}}>WHO'S BETTER <span style={{color: YEL}}>LOOKING?</span></div>
        {row('HIM', him, cracked ? '#ff2d55' : MAG, <Avatar src="fb4/inf.mp4" vw={281} vh={499} l={-62} tp={-104} cracked={cracked} t={t} />, false)}
        {row('MAIN CHARACTER', mc, CYA, <Avatar src="fb4/gta.mp4" vw={650} vh={366} l={-260} tp={-131} cracked={false} t={t} />, true)}
        {locked && <div style={{marginTop: 22, fontFamily: 'UIBold', fontSize: 34, color: 'rgba(255,255,255,.7)', opacity: ramp(t, A.wallahi + 0.3, A.wallahi + 0.5)}}>POLL CLOSED · mum's vote didn't count</div>}
      </div></div>
  </div>;
};
const CommentCue: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; if (t < A.comment || t >= A.wallahi) return null;
  const b = Math.abs(Math.sin((t - A.comment) * 7)) * 26;
  return <div style={{position: 'absolute', left: 0, top: 1660, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, transform: `scale(${popS(t, A.comment)})`}}>
    <div style={{fontSize: 110, transform: `translateY(${-b * 0.4}px)`}}>💬</div>
    {[0, 1, 2].map((i) => <div key={i} style={{fontFamily: 'HeroBlack', fontSize: 96, color: YEL, WebkitTextStroke: '5px #000', transform: `translateY(${Math.abs(Math.sin((t - A.comment) * 7 - i * 0.6)) * 30}px)`}}>↓</div>)}
  </div>;
};

/* ---------- top-panel reaction stickers ---------- */
const Stickers: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS;
  const st = (t0: number, t1: number, e: string, x: number, y: number, size: number, rot = 0) => t >= t0 && t < t1 &&
    <div style={{position: 'absolute', left: x, top: y, fontSize: size, transform: `scale(${popS(t, t0) * ramp(t, t1 - 0.12, t1, 1, 0)}) rotate(${rot + Math.sin(t * 8) * 4}deg)`}}>{e}</div>;
  return <div style={{position: 'absolute', left: 0, top: 0, width: W, height: SEAM, overflow: 'hidden', pointerEvents: 'none'}}>
    {st(A.looking, A.but, '🙈', 770, 120, 170, 6)}
    {st(A.kind, 18.3, '🥺', 760, 130, 170)}
    {t >= A.kind && t < 18.3 && [0, 1, 2, 3].map((i) => { const p = ((t - A.kind) * 0.8 + i * 0.25) % 1; return <div key={i} style={{position: 'absolute', left: 700 + i * 70 + Math.sin(t * 3 + i) * 20, top: 420 - p * 330, fontSize: 56, opacity: 1 - p}}>💕</div>; })}
    {st(A.rambo, 20.2, '🤕', 780, 140, 170, -6)}
  </div>;
};

const Seam: React.FC = () => <div style={{position: 'absolute', left: 0, top: SEAM - 3, width: W, height: 6, background: '#000'}} />;

export const FbSplit4: React.FC = () => {
  const ready = useFontsReady('fb4'); if (!ready) return <AbsoluteFill style={{background: '#000'}} />;
  return <AbsoluteFill style={{background: '#000'}}>
    <Presenter /><Gameplay /><Seam /><Stickers /><MumTexts /><Polaroid /><Poll /><CommentCue /><VS /><Caption />
    <Sequence><Audio src={staticFile('fb4/inf.mp4')} /></Sequence>
    <Sfx at={0} n="pw/whoosh" v={0.35} /><Sfx at={A.better} n="pw/impact" v={0.5} /><Sfx at={A.main} n="pw/whoosh" v={0.4} /><Sfx at={A.main + 0.42} n="fb3/chime" v={0.45} />
    <Sfx at={A.mum} n="pw/pop" v={0.35} /><Sfx at={A.yes} n="fb4/ding" v={0.45} />{YES_T.slice(1).map(([s]) => <Sfx key={s} at={s} n="fb4/ding" v={0.32} />)}
    <Sfx at={A.looking} n="pw/pop" v={0.38} /><Sfx at={A.screen} n="fb4/zap" v={0.5} /><Sfx at={A.but} n="fb4/tvon" v={0.45} />
    <Sfx at={A.mum2} n="pw/pop" v={0.3} /><Sfx at={A.mum2 + 0.35} n="fb4/ding" v={0.4} /><Sfx at={A.cousin} n="pw/whoosh" v={0.4} />
    <Sfx at={A.potato - 0.18} n="pw/whoosh" v={0.35} /><Sfx at={A.potato + 0.06} n="pw/pop" v={0.45} /><Sfx at={A.potato + 0.1} n="fb4/hiss" v={0.4} />
    <Sfx at={A.second} n="pw/impact" v={0.4} /><Sfx at={A.comment} n="pw/pop" v={0.4} /><Sfx at={A.kind} n="pw/pop" v={0.35} />
    <Sfx at={A.wallahi} n="pw/impact" v={0.5} /><Sfx at={A.wallahi + 0.05} n="fb3/ching" v={0.35} /><Sfx at={A.hurt} n="pw/glass" v={0.55} /><Sfx at={A.rambo} n="pw/punch" v={0.45} />
  </AbsoluteFill>;
};
