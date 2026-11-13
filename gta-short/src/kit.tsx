import React from 'react';
/* Shared building blocks for the GTA shorts (style tokens measured in /style.md). */
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile,
  useCurrentFrame, interpolate, Easing, continueRender, delayRender,
} from 'remotion';

/* ------------------------------------------------------------------ */
/* Style tokens (measured from the reference, see /style.md)           */
/* ------------------------------------------------------------------ */
export const FPS = 30;
export const W = 1080, H = 1920;
export const GRAD = 'linear-gradient(135deg,#FF2D78 0%,#FF5C9E 45%,#FF9BE0 100%)';  // ref #C05366→#ED7B8C→#FA9DE0, pushed hotter for bright plates
export const HERO_SIZE = 132;            // ~100px cap height at 1920 (5.2% H)
export const HERO_Y = 0.70;              // vertical centre of hero titles
export const SHADOW = '0 6px 22px rgba(0,0,0,.45), 0 2px 6px rgba(0,0,0,.35)';
export const f = (s: number) => Math.round(s * FPS);
export const ease = Easing.bezier(0.22, 1, 0.36, 1);

/* word timings (speech model is ~0.12s early on some onsets; nudge) */
type Wd = [string, number];
let WT: Wd[] = [];
export const setWords = (w: Wd[]) => { WT = w.map(([x, t]) => [x, t + 0.05] as Wd); };
export const at = (word: string, nth = 0, after = 0) => {
  const hits = WT.filter(([w, t]) => w === word && t >= after);
  return hits[nth]?.[1] ?? after;
};

/* ------------------------------------------------------------------ */
/* Fonts                                                               */
/* ------------------------------------------------------------------ */
export const useFonts = () => {
  const [handle] = React.useState(() => delayRender('fonts'));
  React.useEffect(() => {
    const a = new FontFace('HeroBlack', `url(${staticFile('InterDisplay-Black.otf')})`);
    const b = new FontFace('UIBold', `url(${staticFile('Inter-Bold.otf')})`);
    Promise.all([a.load(), b.load()]).then(([x, y]) => {
      document.fonts.add(x); document.fonts.add(y); continueRender(handle);
    });
  }, [handle]);
};

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */
export const Grade: React.FC<{mono?: number}> = ({mono = 0}) => (
  <>
    {/* magenta cast: pull green, lift red/blue (ref RGB mean 106/82/91) */}
    <AbsoluteFill style={{background: '#ff3d9a', mixBlendMode: 'soft-light', opacity: 0.22 * (1 - mono)}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(10,0,20,.55) 100%)'}} />
  </>
);

/** Video clip with eased camera move + optional whip-in and B&W. */
export const Clip: React.FC<{
  src: string; from: number; dur: number; rate?: number;
  zoom?: [number, number]; mono?: number; whip?: boolean; originX?: string; blur?: number;
}> = ({src, from, dur, rate = 1, zoom = [1.04, 1.14], mono = 0, whip = false, originX = '50%', blur = 0}) => {
  const fr = useCurrentFrame();
  const total = f(dur);
  const s = interpolate(fr, [0, total], zoom, {easing: Easing.inOut(Easing.cubic), extrapolateRight: 'clamp'});
  // whip-in: 7 frames, peak velocity in first 2 frames (style.md §3)
  const wp = whip ? interpolate(fr, [0, 7], [1, 0], {easing: ease, extrapolateRight: 'clamp'}) : 0;
  const ty = -wp * 38;                      // % of height, travelling upward
  const mb = wp * 26;                       // motion blur proxy
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#12061c'}}>
      <AbsoluteFill style={{
        transform: `translateY(${ty}%) scale(${s}) scaleY(${1 + wp * 0.25})`,
        transformOrigin: `${originX} 50%`,
        filter: `blur(${mb + blur}px) grayscale(${mono}) contrast(${1.08 + mono * 0.1}) saturate(${1.12})`,
      }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * FPS)} playbackRate={rate} muted
          style={{width: W, height: H, objectFit: 'cover'}} />
      </AbsoluteFill>
      <Grade mono={mono} />
    </AbsoluteFill>
  );
};

/** Word-by-word hero title: each word fades + un-blurs over 7 frames. */
export const Title: React.FC<{
  lines: {w: string; t: number; accent?: boolean}[][]; shotStart: number;
  y?: number; size?: number; outAt?: number;
}> = ({lines, shotStart, y = HERO_Y, size = HERO_SIZE, outAt}) => {
  const fr = useCurrentFrame();
  const gOut = outAt ? interpolate(fr, [f(outAt - shotStart) - 4, f(outAt - shotStart)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center'}}>
      <div style={{position: 'absolute', top: y * H, transform: 'translateY(-50%)', width: W * 0.86, textAlign: 'center', opacity: gOut}}>
        {lines.map((ln, i) => {
          const chars = ln.reduce((n, wd) => n + wd.w.length, 0) + (ln.length - 1) * 0.35;
          const fit = Math.min(size, (W * 0.86) / (chars * 0.66));
          return (
          <div key={i} style={{fontFamily: 'HeroBlack', fontSize: fit, lineHeight: 1.0, letterSpacing: -2, color: '#fff', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>
            {ln.map((wd, j) => {
              const lf = fr - f(wd.t - shotStart);
              const o = interpolate(lf, [0, 7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              const b = interpolate(lf, [0, 7], [14, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              const sc = interpolate(lf, [0, 7], [1.12, 1], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
              const accentStyle: React.CSSProperties = wd.accent ? {
                backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                filter: `blur(${b}px) drop-shadow(0 4px 10px rgba(30,0,20,.55)) drop-shadow(0 0 18px rgba(250,120,190,.5))`,
              } : {textShadow: SHADOW, filter: `blur(${b}px)`};
              return (
                <span key={j} style={{display: 'inline-block', opacity: o, transform: `scale(${sc})`, marginRight: j < ln.length - 1 ? '0.22em' : 0, ...accentStyle}}>
                  {wd.w}
                </span>
              );
            })}
          </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Small data label at 20% height + 1% source line (style.md §5). */
export const Label: React.FC<{text: React.ReactNode; source?: string; t: number; shotStart: number; y?: number}> = ({text, source, t, shotStart, y = 0.2}) => {
  const fr = useCurrentFrame() - f(t - shotStart);
  const o = interpolate(fr, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dy = interpolate(fr, [0, 8], [24, 0], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: y * H, width: W, textAlign: 'center', opacity: o, transform: `translateY(${dy}px)`}}>
      <div style={{fontFamily: 'HeroBlack', fontSize: 66, color: '#fff', letterSpacing: -1, textShadow: SHADOW}}>{text}</div>
      {source && <div style={{fontFamily: 'UIBold', fontSize: 26, color: 'rgba(255,255,255,.72)', marginTop: 10, textShadow: SHADOW}}>{source}</div>}
    </div>
  );
};

export const Accent: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 3px 8px rgba(30,0,20,.6))'}}>{children}</span>
);

/** White pill used for comments and the CTA (matches reference comment box). */
export const Bubble: React.FC<{name: string; text: string; t: number; shotStart: number; x: number; y: number; typed?: boolean; heartAt?: number; tilt?: number}> =
({name, text, t, shotStart, x, y, typed, heartAt, tilt = 0}) => {
  const fr = useCurrentFrame() - f(t - shotStart);
  const s = interpolate(fr, [0, 8], [0.6, 1], {easing: Easing.out(Easing.back(2)), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const o = interpolate(fr, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const shown = typed ? text.slice(0, Math.max(0, Math.min(text.length, Math.floor((fr - 6) / 3)))) : text;
  const hf = heartAt !== undefined ? fr + f(t - shotStart) - f(heartAt - shotStart) : -1;
  const hs = interpolate(hf, [0, 5, 9], [0, 1.4, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: o, transform: `scale(${s}) rotate(${tilt}deg)`, transformOrigin: 'left center',
      background: 'rgba(255,255,255,.97)', borderRadius: 28, padding: '22px 30px', display: 'flex', alignItems: 'center', gap: 22,
      boxShadow: '0 18px 50px rgba(0,0,0,.35)', minWidth: 560}}>
      <div style={{width: 64, height: 64, borderRadius: 32, background: 'linear-gradient(135deg,#ff5fa2,#ff9a5a)'}} />
      <div style={{flex: 1}}>
        <div style={{fontFamily: 'UIBold', fontSize: 26, color: '#111'}}>{name} <span style={{color: '#999', fontSize: 22}}>now</span></div>
        <div style={{fontFamily: 'UIBold', fontSize: 38, color: '#111', minHeight: 46}}>{shown}{typed && fr > 6 && fr % 16 < 8 ? '|' : ''}</div>
      </div>
      {heartAt !== undefined && <div style={{fontSize: 44, color: '#ff3d7f', transform: `scale(${hs})`}}>♥</div>}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 6: "Rockstar shared it on their own Instagram story"           */
/* ------------------------------------------------------------------ */
export const StoryScene: React.FC<{start: number; dur: number; sharedAt: number; likedAt: number}> = ({start, dur, sharedAt, likedAt}) => {
  const fr = useCurrentFrame();
  const push = interpolate(fr, [0, f(dur)], [0.92, 1.04], {easing: Easing.inOut(Easing.cubic)});
  const rise = interpolate(fr, [0, 10], [180, 0], {easing: ease, extrapolateRight: 'clamp'});
  const prog = interpolate(fr, [0, f(dur)], [0, 1]);
  const chip = (t: number, label: React.ReactNode, y: number) => {
    const lf = fr - f(t - start);
    const s = interpolate(lf, [0, 7], [0.5, 1], {easing: Easing.out(Easing.back(2.2)), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const o = interpolate(lf, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return (
      <div style={{position: 'absolute', top: y, width: W, display: 'flex', justifyContent: 'center', opacity: o, transform: `scale(${s})`}}>
        <div style={{fontFamily: 'HeroBlack', fontSize: 50, color: '#fff', padding: '18px 34px', borderRadius: 999,
          background: 'rgba(20,6,32,.82)', border: '3px solid #ED7B8C', boxShadow: '0 0 40px rgba(237,123,140,.55)', letterSpacing: -0.5}}>{label}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Clip src="c1_street.mp4" from={1.73} dur={dur} zoom={[1.25, 1.35]} blur={16} whip />
      <AbsoluteFill style={{background: 'rgba(14,4,26,.45)'}} />
      {/* neon grid floor */}
      <AbsoluteFill style={{top: H * 0.62, background:
        'repeating-linear-gradient(90deg, rgba(255,80,190,.55) 0 3px, transparent 3px 90px), repeating-linear-gradient(0deg, rgba(255,80,190,.45) 0 3px, transparent 3px 70px)',
        transform: 'perspective(700px) rotateX(62deg)', transformOrigin: 'top', opacity: .55}} />
      {/* story frame */}
      <div style={{position: 'absolute', left: (W - 600) / 2, top: 300, width: 600, height: 1066, borderRadius: 46, overflow: 'hidden',
        transform: `translateY(${rise}px) scale(${push})`, boxShadow: '0 30px 90px rgba(0,0,0,.6), 0 0 0 6px rgba(255,255,255,.9)'}}>
        <OffthreadVideo src={staticFile('c2_glitch.mp4')} startFrom={0} playbackRate={0.6} muted style={{width: 600, height: 1066, objectFit: 'cover'}} />
        <div style={{position: 'absolute', top: 18, left: 18, right: 18, height: 6, borderRadius: 3, background: 'rgba(255,255,255,.4)'}}>
          <div style={{width: `${prog * 100}%`, height: 6, borderRadius: 3, background: '#fff'}} />
        </div>
        <div style={{position: 'absolute', top: 40, left: 22, display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 52, height: 52, borderRadius: 26, background: GRAD, border: '3px solid #fff'}} />
          <div style={{fontFamily: 'UIBold', fontSize: 28, color: '#fff', textShadow: SHADOW}}>repost · story</div>
        </div>
      </div>
      {chip(sharedAt, <>SHARED TO <Accent>THEIR STORY</Accent></>, 1430)}
      {chip(likedAt, <><span style={{color: '#ff5f95'}}>♥</span> LIKED THE POST</>, 1560)}
      <Label t={start + 0.05} shotStart={start} y={0.085} text={<>ROCKSTAR <Accent>NOTICED.</Accent></>} />
    </AbsoluteFill>
  );
};

/* "GTA 6" slam: 1.4x + heavy blur -> 1.0 in 8 frames (style.md §5) */
export const Slam: React.FC<{shotStart: number; gtaAt: number; sixAt: number}> = ({shotStart, gtaAt, sixAt}) => {
  const fr = useCurrentFrame();
  const t0 = f(gtaAt - shotStart) - 2;
  const lf = fr - t0;
  const s = interpolate(lf, [0, 8], [1.45, 1], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const b = interpolate(lf, [0, 8], [30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const o = interpolate(lf, [0, 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const six = fr - f(sixAt - shotStart);
  const s6 = interpolate(six, [0, 7], [1.6, 1], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const o6 = interpolate(six, [0, 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <div style={{position: 'absolute', top: H * 0.33, textAlign: 'center', fontSize: 70, fontFamily: 'HeroBlack', color: '#fff', textShadow: SHADOW, opacity: o}}>IT WAS</div>
      <div style={{position: 'absolute', top: H * 0.38, display: 'flex', gap: 30, alignItems: 'baseline'}}>
        <span style={{fontFamily: 'HeroBlack', fontSize: 300, letterSpacing: -10, color: '#fff', opacity: o, transform: `scale(${s})`, filter: `blur(${b}px)`, textShadow: SHADOW, display: 'inline-block'}}>GTA</span>
        <span style={{fontFamily: 'HeroBlack', fontSize: 300, letterSpacing: -10, opacity: o6, transform: `scale(${s6})`, display: 'inline-block',
          backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 6px 14px rgba(30,0,20,.6)) drop-shadow(0 0 30px rgba(250,120,190,.6))'}}>6</span>
      </div>
      <div style={{position: 'absolute', top: H * 0.585, fontFamily: 'UIBold', fontSize: 30, color: 'rgba(255,255,255,.75)', opacity: o6, textShadow: SHADOW}}>
        in-game footage · not a real street
      </div>
    </AbsoluteFill>
  );
};

/* CTA: "Comment GTA" slam + typed comment + heart (style.md §8) */
export const Cta: React.FC<{shotStart: number; ctaAt: number; heartAt: number}> = ({shotStart, ctaAt, heartAt}) => {
  const fr = useCurrentFrame();
  const t0 = f(ctaAt - shotStart);
  const lf = fr - t0;
  const o = interpolate(lf, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const s = interpolate(lf, [0, 8], [1.4, 1], {easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const b = interpolate(lf, [0, 8], [24, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dim = interpolate(lf, [0, 6], [0, 0.55], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <AbsoluteFill style={{background: `rgba(8,2,16,${dim})`}} />
      <div style={{position: 'absolute', top: H * 0.38, width: W, textAlign: 'center', opacity: o}}>
        <div style={{fontFamily: 'HeroBlack', fontSize: 110, color: '#fff', textShadow: SHADOW, letterSpacing: -2}}>Comment</div>
        <div style={{fontFamily: 'HeroBlack', fontSize: 280, lineHeight: 0.95, letterSpacing: -8, transform: `scale(${s})`, filter: `blur(${b}px) drop-shadow(0 6px 14px rgba(30,0,20,.6)) drop-shadow(0 0 30px rgba(250,120,190,.5))`,
          backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', display: 'inline-block'}}>GTA</div>
      </div>
      <Bubble name="you" text="GTA" typed t={ctaAt + 0.05} shotStart={shotStart} x={180} y={H * 0.66} heartAt={heartAt} />
    </>
  );
};
