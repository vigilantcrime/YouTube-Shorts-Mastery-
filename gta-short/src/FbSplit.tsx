/* Talking-head-over-B-roll split (football-pundit style): presenter top half, gameplay bottom half,
   1–3 word UPPERCASE captions just above the seam (white, black outline, one yellow key word).
   Gags on the "real life is low graphics" bit: pixelate → blur → lag → buffering. */
import React from 'react';
import {AbsoluteFill, Audio, Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {cl, useFontsReady} from './kit3d';

const W = 1080, H = 1920, FPS = 30, SEAM = 875;
export const FB_FRAMES = Math.round(20.0 * FPS);
const f = (s: number) => Math.round(s * FPS);
const YEL = '#FFE600';

/* captions: [start, words, key word] */
const CAPS: [number, string, string][] = [
  [0.0, 'LOOK AT THIS', 'THIS'], [2.3, 'NO, ACTUALLY', 'ACTUALLY'], [2.94, 'LOOK AT IT', 'IT'], [4.14, 'ROCKSTAR HAVE', 'ROCKSTAR'], [4.94, 'LOST THE PLOT', 'PLOT'],
  [5.86, 'THIS IS MORE', 'MORE'], [6.54, 'REALISTIC', 'REALISTIC'], [7.1, 'THAN REAL LIFE', 'REAL LIFE'], [8.38, 'I WENT OUTSIDE', 'OUTSIDE'], [9.42, 'AFTER SIX HOURS', 'SIX HOURS'],
  [10.26, 'AND REAL LIFE', 'REAL LIFE'], [10.9, 'LOOKED LIKE', 'LIKE'], [11.3, 'LOW GRAPHICS', 'LOW GRAPHICS'], [12.62, 'BLURRY', 'BLURRY'], [13.66, 'LAGGY', 'LAGGY'],
  [14.62, 'MY NAN', 'NAN'], [15.26, 'EVEN BUFFERED', 'BUFFERED'], [16.38, "I'VE ASKED MUM", 'MUM'], [17.26, 'TO UPDATE', 'UPDATE'], [18.22, 'WALLAHI', 'WALLAHI'],
  [18.78, 'THAT HURT MORE', 'HURT'], [19.3, 'THAN THE RAMBO', 'RAMBO'],
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
const ZOOM: [number, number][] = [[0, 1.0], [2.3, 1.13], [4.14, 1.0], [5.86, 1.1], [8.38, 1.0], [11.3, 1.06], [16.38, 1.12], [18.22, 1.2]];
const zAt = (t: number) => ZOOM.reduce((z, [a, v]) => (t >= a ? v : z), 1);
const Presenter: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; const z = zAt(t);
  const pix = t >= 11.3 && t < 12.62, blur = t >= 12.62 && t < 13.66, lag = t >= 13.66 && t < 14.62, buf = t >= 14.62 && t < 16.38;
  const lagFrame = Math.floor(fr / 6) * 6, bufFrame = f(14.62);
  const vid = (extra?: React.CSSProperties) => <OffthreadVideo src={staticFile('fb/inf.mp4')} muted style={{position: 'absolute', left: -81, top: -360, width: 1242, height: 2208, ...extra}} />;
  let body: React.ReactNode = vid();
  if (pix) body = <OffthreadVideo src={staticFile('fb/inf_pix.mp4')} muted style={{position: 'absolute', left: -81, top: -360, width: 1242, height: 2208}} />;
  if (blur) body = vid({filter: 'blur(16px)'});
  if (lag) body = <Freeze frame={lagFrame}>{vid({filter: `hue-rotate(${(lagFrame % 12) * 6}deg)`})}</Freeze>;
  if (buf) body = <Freeze frame={bufFrame}>{vid({filter: 'brightness(.55) saturate(.6)'})}</Freeze>;
  return <div style={{position: 'absolute', left: 0, top: 0, width: W, height: SEAM, overflow: 'hidden', background: '#000'}}>
    <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: '50% 38%'}}>{body}</div>
    {lag && <div style={{position: 'absolute', inset: 0, background: `linear-gradient(90deg, rgba(255,0,80,.12), transparent 30%, transparent 70%, rgba(0,200,255,.12))`, transform: `translateX(${(fr % 6) * 4 - 10}px)`}} />}
    {buf && <div style={{position: 'absolute', left: W / 2 - 70, top: 300, width: 140, height: 140, borderRadius: 70, border: '14px solid rgba(255,255,255,.25)', borderTopColor: '#fff', transform: `rotate(${fr * 18}deg)`}} />}
  </div>;
};
const Gameplay: React.FC = () => {
  const fr = useCurrentFrame(); const z = interpolate(fr, [0, FB_FRAMES], [1.0, 1.08], cl);
  return <div style={{position: 'absolute', left: 0, top: SEAM, width: W, height: H - SEAM, overflow: 'hidden', background: '#000'}}>
    <OffthreadVideo src={staticFile('fb/gta.mp4')} muted style={{position: 'absolute', left: -388, top: 0, width: 1856, height: 1046, transform: `scale(${z})`, transformOrigin: '50% 50%'}} />
  </div>;
};

export const FbSplit: React.FC = () => {
  const ready = useFontsReady('fb'); if (!ready) return <AbsoluteFill style={{background: '#000'}} />;
  return <AbsoluteFill style={{background: '#000'}}>
    <Presenter /><Gameplay /><Caption />
    <Sequence><Audio src={staticFile('fb/inf.mp4')} /></Sequence>
  </AbsoluteFill>;
};
