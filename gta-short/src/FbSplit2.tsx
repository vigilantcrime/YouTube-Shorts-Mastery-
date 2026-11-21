/* Talking-head-over-B-roll split (football-pundit style): presenter top half, gameplay bottom half,
   1–3 word UPPERCASE captions just above the seam (white, black outline, one yellow key word).
   Gags on the "real life is low graphics" bit: pixelate → blur → lag → buffering. */
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {cl, useFontsReady} from './kit3d';

const W = 1080, H = 1920, FPS = 30, SEAM = 875;
export const FB2_FRAMES = Math.round(20.0 * FPS);
const FB_FRAMES = FB2_FRAMES;
const f = (s: number) => Math.round(s * FPS);
const YEL = '#FFE600';

/* captions: [start, words, key word] */
const CAPS: [number, string, string][] = [
  [0.0, 'LOOK AT THIS', 'THIS'], [0.98, 'WORLD', 'WORLD'], [1.46, 'NOT ONE PERSON', 'PERSON'], [2.42, 'IN IT', 'IT'], [2.7, 'IS MOANING', 'MOANING'], [3.3, 'ABOUT RENT', 'RENT'],
  [4.38, 'DO YOU KNOW', 'KNOW'], [5.06, 'WHAT MY RENT', 'RENT'], [5.66, 'GETS ME?', 'ME?'], [6.74, 'A ROOM', 'ROOM'], [7.42, 'WHERE THE FRIDGE', 'FRIDGE'], [8.06, 'IS ALSO', 'ALSO'],
  [8.46, 'THE WARDROBE', 'WARDROBE'], [10.14, 'ROCKSTAR', 'ROCKSTAR'], [10.94, "I'M NOT ASKING", 'ASKING'], [11.86, 'FOR MUCH', 'MUCH'], [12.5, 'JUST LET ME', 'LET'], [13.18, 'MOVE IN', 'MOVE IN'],
  [13.98, "I'LL BRING", 'BRING'], [14.62, 'MY OWN FACE', 'FACE'], [15.54, "YOU'RE WELCOME", 'WELCOME'], [17.98, 'WALLAHI', 'WALLAHI'], [18.78, 'THAT HURT MORE', 'HURT'], [19.3, 'THAN THE RAMBO', 'RAMBO'],
];
const Caption: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; let k = 0; CAPS.forEach((c, i) => { if (c[0] <= t + 0.02) k = i; });
  const [t0, txt, key] = CAPS[k]; const lf = fr - f(t0); const s = interpolate(lf, [0, 3, 6], [0.82, 1.06, 1], cl);
  const i0 = txt.indexOf(key); const parts = [txt.slice(0, i0), key, txt.slice(i0 + key.length)];
  const style: React.CSSProperties = {fontFamily: 'HeroBlack', fontSize: 84, letterSpacing: -1.5, whiteSpace: 'nowrap', lineHeight: 1};
  const line = (stroke: boolean) => <div style={{...style, ...(stroke ? {color: '#000', WebkitTextStroke: '12px #000', filter: 'drop-shadow(0 5px 6px rgba(0,0,0,.55))'} : {position: 'absolute', inset: 0})}}>
    {parts.map((p, i) => <span key={i} style={stroke ? {} : {color: i === 1 ? YEL : '#fff'}}>{p}</span>)}</div>;
  return <div style={{position: 'absolute', top: 660, width: W, display: 'flex', justifyContent: 'center'}}><div style={{position: 'relative', transform: `scale(${s})`}}>{line(true)}{line(false)}</div></div>;
};

/* presenter (top half): jump-cut zoom levels per sentence, plus the low-graphics gags */
const ZOOM: [number, number][] = [[0, 1.0], [4.38, 1.12], [6.74, 1.0], [10.14, 1.14], [12.5, 1.04], [14.62, 1.26], [15.54, 1.1], [17.98, 1.22]];
const zAt = (t: number) => ZOOM.reduce((z, [a, v]) => (t >= a ? v : z), 1);
const Sfx: React.FC<{at: number; n: string; v?: number}> = ({at, n, v = 0.5}) => <Sequence from={Math.max(0, f(at))} durationInFrames={40}><Audio src={staticFile(`pw/${n}.wav`)} volume={v} /></Sequence>;
const popS = (lf: number) => interpolate(lf, [0, 4, 8], [0.3, 1.12, 1], cl);
const Presenter: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; let z = zAt(t);
  if (t >= 16.2 && t < 17.98) z = 1.1 + 0.12 * (t - 16.2) / 1.78;            // awkward-pause slow push
  const shake = t >= 18.78 && t < 19.3 ? Math.sin(fr * 2.7) * 12 : 0;
  return <div style={{position: 'absolute', left: 0, top: 0, width: W, height: SEAM, overflow: 'hidden', background: '#000'}}>
    <div style={{position: 'absolute', inset: 0, transform: `translate(${shake}px,${shake * 0.4}px) scale(${z})`, transformOrigin: '50% 34%'}}>
      <OffthreadVideo src={staticFile('fb2/inf.mp4')} muted style={{position: 'absolute', left: -81, top: -330, width: 1242, height: 2208}} />
    </div>
    {t >= 18.78 && t < 19.5 && <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(220,0,30,.55) 100%)', opacity: interpolate(t, [18.78, 18.9, 19.5], [0, 1, 0], cl)}} />}
    {t >= 15.12 && t < 16.4 && [0, 1, 2, 3, 4].map((i) => { const a = i * 1.3 + t * 2; return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(a) * 300 - 30, top: 300 + Math.sin(a) * 180, fontSize: 64, transform: `scale(${0.7 + 0.4 * Math.abs(Math.sin(t * 6 + i))})`}}>✨</div>; })}
  </div>;
};
/* sticker gags (top half) */
const Gags: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS;
  const stamp = (t0: number, t1: number, txt: string, col: string, x: number, y: number, rot: number) => { if (t < t0 || t >= t1) return null; const lf = (t - t0) * FPS;
    return <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${interpolate(lf, [0, 4], [2, 1], cl)})`, opacity: interpolate(t, [t1 - 0.15, t1], [1, 0], cl),
      padding: '8px 24px', border: `8px solid ${col}`, borderRadius: 16, background: 'rgba(0,0,0,.35)', fontFamily: 'HeroBlack', fontSize: 70, color: col, whiteSpace: 'nowrap'}}>{txt}</div>; };
  // fridge-wardrobe card
  const fz = t >= 7.42 && t < 10.1; const door = interpolate(t, [8.46, 8.8], [0, 1], cl);
  const fridge = fz && <div style={{position: 'absolute', left: 690, top: 90, width: 300, height: 470, transform: `scale(${popS((t - 7.42) * FPS)}) rotate(4deg)`, opacity: interpolate(t, [9.9, 10.1], [1, 0], cl), perspective: 900}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 26, background: '#2c3138', boxShadow: '0 20px 50px rgba(0,0,0,.6), 0 0 0 6px #fff'}}>
      <div style={{position: 'absolute', left: 30, right: 30, top: 50, height: 6, background: '#888'}} />
      {door > 0.3 && ['👕', '👖', '🧥'].map((e, i) => <div key={i} style={{position: 'absolute', left: 30 + i * 82, top: 60, fontSize: 80, transform: `rotate(${(i - 1) * 6}deg)`}}>{e}</div>)}
      {door > 0.3 && <div style={{position: 'absolute', left: 40, bottom: 40, fontSize: 70}}>🧃🥚</div>}</div>
    <div style={{position: 'absolute', inset: 0, borderRadius: 26, background: 'linear-gradient(135deg,#f4f6f8,#cfd5dc)', transformOrigin: 'left center', transform: `rotateY(${-100 * door}deg)`, boxShadow: '0 0 0 6px #fff', backfaceVisibility: 'hidden'}}>
      <div style={{position: 'absolute', right: 26, top: 150, width: 16, height: 140, borderRadius: 8, background: '#9aa3ad'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', fontFamily: 'HeroBlack', fontSize: 40, color: '#2c3138'}}>FRIDGE</div></div>
  </div>;
  const boxes = t >= 13.18 && t < 14.4 && <div style={{position: 'absolute', left: interpolate(t, [13.18, 13.45], [1100, 640], cl), top: 470, fontSize: 130, transform: `rotate(${Math.sin(t * 20) * 4}deg)`}}>📦📦</div>;
  const heart = t >= 18.78 && t < 19.9 && <div style={{position: 'absolute', left: 120, top: 120, fontSize: 150, transform: `scale(${popS((t - 18.78) * FPS)}) rotate(-12deg)`}}>💔</div>;
  const what = t >= 16.3 && t < 17.9 && <div style={{position: 'absolute', right: 90, top: 140, fontSize: 130, transform: `scale(${popS((t - 16.3) * FPS)})`}}>🤨</div>;
  return <div style={{position: 'absolute', left: 0, top: 0, width: W, height: SEAM, overflow: 'hidden', pointerEvents: 'none'}}>
    {stamp(3.56, 4.6, 'RENT DUE 💸', '#ff2d55', 80, 120, -8)}{stamp(10.16, 11.0, 'ROCKSTAR 📞', '#FFE600', 520, 110, 6)}
    {fridge}{boxes}{what}{heart}
    <Sfx at={3.56} n="impact" v={0.45} /><Sfx at={7.42} n="pop" v={0.5} /><Sfx at={8.5} n="whoosh" v={0.45} /><Sfx at={10.16} n="pop" v={0.45} /><Sfx at={13.18} n="whoosh" v={0.45} />
    <Sfx at={15.12} n="pop" v={0.4} /><Sfx at={16.3} n="pop" v={0.35} /><Sfx at={18.78} n="impact" v={0.6} />
  </div>;
};
const Gameplay: React.FC = () => {
  const fr = useCurrentFrame(); const z = interpolate(fr, [0, FB_FRAMES], [1.0, 1.08], cl);
  return <div style={{position: 'absolute', left: 0, top: SEAM, width: W, height: H - SEAM, overflow: 'hidden', background: '#000'}}>
    <OffthreadVideo src={staticFile('fb2/gta.mp4')} muted style={{position: 'absolute', left: -300, top: 0, width: 1858, height: 1046, transform: `scale(${z})`, transformOrigin: '50% 50%'}} />
  </div>;
};

export const FbSplit2: React.FC = () => {
  const ready = useFontsReady('fb2'); if (!ready) return <AbsoluteFill style={{background: '#000'}} />;
  return <AbsoluteFill style={{background: '#000'}}>
    <Presenter /><Gameplay /><Gags /><Caption />
    <Sequence><Audio src={staticFile('fb2/inf.mp4')} /></Sequence>
  </AbsoluteFill>;
};
