/* GTA 5 (2013) vs GTA 6 (built from the SaVsSix template) — beat-locked at 112 BPM (same tempo/pace as video 1).
   Every cut lands on a beat; each comparison = 2 bars: bar A = 2004, downbeat of bar B = GTA 6 reveal (flash + drop).
   Source images: @mr_sleepygta6 (watermark kept, credit shown). */
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import {W, H, GRAD, SHADOW} from './kit';
import {cl, pop, useFontsReady} from './kit3d';

const BPM = 112;
const BEAT = 60 / BPM;            // 0.5357 s
const BAR = BEAT * 4;             // 2.1429 s
export const V56_FRAMES = Math.round(10 * BAR * 30);   // 10 bars = 21.43 s
const fb = (beats: number) => Math.round(beats * BEAT * 30);   // beats -> frames

const ITEMS = [
  {img: 'cmp/v0.png', what: 'THE SNIPER', emoji: '🎯', h: false},
  {img: 'cmp/v2.png', what: 'THE ROBBERY', emoji: '🔫', h: false},
  {img: 'cmp/v1.png', what: 'CHARACTERS', emoji: '👤', h: true},
  {img: 'cmp/v3.png', what: 'POOL DAY', emoji: '🍸', h: false},
];
const KICKERS = ['NOW HE SWEATS', 'SAME GLASSES. NEW BANDANA.', 'GOLDEN HOUR HITS DIFFERENT', 'EVEN THE DRINK GOT AN UPGRADE'];

const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#fff', style}) => (
  <div style={{fontFamily: 'HeroBlack', fontSize: size, color, letterSpacing: -size * 0.02, lineHeight: 1, textShadow: SHADOW, ...style}}>{children}</div>
);
const GT: React.CSSProperties = {backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', textShadow: 'none', filter: 'drop-shadow(0 5px 12px rgba(30,0,20,.55))'};

/** One half of a comparison image (top = San Andreas, bottom = GTA 6), shown big with a blurred fill behind. */
const Half: React.FC<{img: string; half: 0 | 1; z0: number; z1: number; dx?: number; dur: number; k?: number; h?: boolean}> = ({img, half, z0, z1, dx = 0, dur, k = 1.45, h = false}) => {
  const fr = useCurrentFrame();
  const z = interpolate(fr, [0, dur], [z0, z1], {...cl, easing: Easing.inOut(Easing.sin)});
  const x = interpolate(fr, [0, dur], [-dx, dx], cl);
  const PH = 1080 * (627 / 1254) * k;                    // panel height (k = zoom; k=1 keeps the full width + watermark)
  const IW = 1080 * k;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      {/* blurred fill */}
      <AbsoluteFill style={{transform: 'scale(1.6)', filter: 'blur(40px) brightness(.55) saturate(1.3)'}}>
        <div style={{position: 'absolute', left: 0, top: H / 2 - 540, width: W, height: 1080, overflow: 'hidden'}}>
          <Img src={staticFile(img)} style={{width: W, height: 1080 * 2, marginTop: half ? -1080 : 0, objectFit: 'cover'}} />
        </div>
      </AbsoluteFill>
      {/* main panel */}
      {h ? <div style={{position: 'absolute', left: (W - H * 0.76 * 0.5) / 2, top: H * 0.19, width: H * 0.76 * 0.5, height: H * 0.76, overflow: 'hidden', transform: `translateX(${x}px) scale(${z})`, boxShadow: '0 40px 120px rgba(0,0,0,.7)'}}>
        <Img src={staticFile(img)} style={{position: 'absolute', top: 0, left: half ? -H * 0.76 * 0.5 : 0, width: H * 0.76, height: H * 0.76}} />
      </div> :
      <div style={{position: 'absolute', left: 0, top: H / 2 - PH / 2, width: W, height: PH, overflow: 'hidden', transform: `translateX(${x}px) scale(${z})`,
        boxShadow: '0 40px 120px rgba(0,0,0,.7)'}}>
        <Img src={staticFile(img)} style={{position: 'absolute', left: (W - IW) / 2, top: half ? -PH : 0, width: IW, height: IW}} />
      </div>}
    </AbsoluteFill>
  );
};

const YearChip: React.FC<{year: string; hot?: boolean; t0?: number}> = ({year, hot, t0 = 0}) => {
  const fr = useCurrentFrame();
  const p = pop(fr - t0, 6, 1.6);
  return (
    <div style={{position: 'absolute', left: 60, top: H * 0.72, opacity: p.o, transform: `scale(${p.s})`, transformOrigin: 'left center',
      padding: '10px 26px', borderRadius: 14, background: hot ? GRAD : 'rgba(20,20,24,.85)', border: hot ? 'none' : '3px solid rgba(255,255,255,.5)'}}>
      <Txt size={64}>{year}</Txt>
    </div>
  );
};

/** One comparison = 2 bars. */
const Compare: React.FC<{i: number}> = ({i}) => {
  const fr = useCurrentFrame();
  const it = ITEMS[i];
  const reveal = fb(4);                                  // downbeat of bar 2
  const after = fr >= reveal;
  const slam = after ? interpolate(fr - reveal, [0, 5], [1.18, 1], {...cl, easing: Easing.out(Easing.cubic)}) : 1;
  const shake = after && fr - reveal < 6 ? Math.sin((fr - reveal) * 3) * 10 * (1 - (fr - reveal) / 6) : 0;
  const title = pop(fr, 6, 1.4);
  // beat pulse on the label (every beat)
  const beatPhase = (fr % fb(1)) / fb(1);
  const pulse = 1 + 0.04 * Math.max(0, 1 - beatPhase * 4);
  return (
    <AbsoluteFill>
      {!after && <Half img={it.img} half={0} z0={1.0} z1={1.07} dx={14} dur={reveal} h={it.h} k={it.h ? 1 : 1.45} />}
      {after && <AbsoluteFill style={{transform: `scale(${slam}) translate(${shake}px, ${shake * 0.4}px)`}}><Half img={it.img} half={1} z0={1.0} z1={1.0} dx={0} dur={fb(4)} k={1} h={it.h} /></AbsoluteFill>}
      {/* category title */}
      <div style={{position: 'absolute', top: H * 0.1, width: W, textAlign: 'center', opacity: title.o, transform: `scale(${title.s * pulse})`}}>
        <Txt size={46} color="rgba(255,255,255,.85)" style={{letterSpacing: 6}}>{i + 1} / 4</Txt>
        <Txt size={112} style={{marginTop: 14}}>{it.what} {it.emoji}</Txt>
      </div>
      {!after ? <YearChip year="2013 · GTA 5" /> : <YearChip year="2026 · GTA 6" hot t0={reveal} />}
      {/* bar-2 kicker text on the reveal */}
      {after && <div style={{position: 'absolute', top: H * 0.8, width: W, textAlign: 'center', opacity: pop(fr - reveal - 3, 6, 1.3).o, transform: `scale(${pop(fr - reveal - 3, 6, 1.3).s})`}}>
        <Txt size={66} style={GT}>{KICKERS[i]}</Txt>
      </div>}
      {/* beat ticks: 4 dots showing the bar count-in to the reveal */}
      {!after && <div style={{position: 'absolute', top: H * 0.86, width: W, display: 'flex', justifyContent: 'center', gap: 22}}>
        {[0, 1, 2, 3].map((k) => <div key={k} style={{width: 28, height: 28, borderRadius: 14, background: fr >= fb(k) ? '#fff' : 'rgba(255,255,255,.25)', boxShadow: fr >= fb(k) ? '0 0 18px #fff' : 'none'}} />)}
      </div>}
    </AbsoluteFill>
  );
};

/** Hook bar: 4 beat-cuts of the 2004 halves + the promise. */
const Hook: React.FC = () => {
  const fr = useCurrentFrame();
  const k = Math.min(3, Math.floor(fr / fb(1)));
  const imgs = ['cmp/v0.png', 'cmp/v2.png', 'cmp/v3.png', 'cmp/v0.png'];
  const l1 = pop(fr, 5, 1.5), l2 = pop(fr - fb(2), 5, 1.6);
  return (
    <AbsoluteFill>
      <Half img={imgs[k]} half={k === 3 ? 1 : 0} z0={1.12} z1={1.02} dur={fb(1)} key={k} />
      <AbsoluteFill style={{background: 'rgba(0,0,0,.35)'}} />
      <div style={{position: 'absolute', top: H * 0.3, width: W, textAlign: 'center'}}>
        <div style={{opacity: l1.o, transform: `scale(${l1.s})`}}><Txt size={110}>GTA 5</Txt><Txt size={70} color="#ffd36b" style={{margin: '18px 0'}}>vs</Txt></div>
        <div style={{opacity: l2.o, transform: `scale(${l2.s})`}}><Txt size={170} style={GT}>GTA 6</Txt><Txt size={52} style={{marginTop: 24}}>13 years of upgrades in 20 seconds</Txt></div>
      </div>
    </AbsoluteFill>
  );
};

/** Outro bar: the "feet" punch + CTA, then loops back to the hook. */
const Outro: React.FC = () => {
  const fr = useCurrentFrame();
  const p = pop(fr, 7, 0.8), q = pop(fr - fb(2), 6, 1.4);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: 'scale(1.5)', filter: 'blur(40px) brightness(.5)'}}><Img src={staticFile('cmp/v3.png')} style={{width: W, height: W, marginTop: (H - W) / 2}} /></AbsoluteFill>
      <div style={{position: 'absolute', left: 90, top: 520, width: 900, height: 900, opacity: p.o, transform: `scale(${p.s})`, borderRadius: 24, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,.7)'}}>
        <Img src={staticFile('cmp/v3.png')} style={{width: 900, height: 900}} />
      </div>
      <div style={{position: 'absolute', top: H * 0.1, width: W, textAlign: 'center'}}><Txt size={86}>which upgrade</Txt><Txt size={86} style={{marginTop: 10}}>is the <span style={GT}>craziest?</span></Txt></div>
      <div style={{position: 'absolute', top: H * 0.82, width: W, textAlign: 'center', opacity: q.o, transform: `scale(${q.s})`}}><Txt size={64}>comment 1–4 👇</Txt></div>
    </AbsoluteFill>
  );
};

export const FiveVsSix: React.FC = () => {
  const ready = useFontsReady('v56');
  const fr = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{background: '#000'}} />;
  const bar = (n: number) => Math.round(n * BAR * 30);
  const reveals = [0, 1, 2, 3].map((i) => bar(1 + i * 2 + 1));
  const flash = Math.max(0, ...reveals.map((r) => fr >= r - 1 && fr < r + 4 ? interpolate(fr, [r - 1, r, r + 1, r + 4], [0, 1, 0.6, 0], cl) : 0),
    ...[bar(1), bar(3), bar(5), bar(7), bar(9)].map((r) => fr >= r && fr < r + 3 ? interpolate(fr, [r, r + 3], [0.35, 0], cl) : 0));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence from={0} durationInFrames={bar(1)}><Hook /></Sequence>
      {ITEMS.map((_, i) => <Sequence key={i} from={bar(1 + i * 2)} durationInFrames={bar(3 + i * 2) - bar(1 + i * 2)}><Compare i={i} /></Sequence>)}
      <Sequence from={bar(9)} durationInFrames={V56_FRAMES - bar(9)}><Outro /></Sequence>
      <AbsoluteFill style={{background: '#fff', opacity: flash, pointerEvents: 'none'}} />
      <div style={{position: 'absolute', bottom: 34, width: W, textAlign: 'center', fontFamily: 'UIBold', fontSize: 26, color: 'rgba(255,255,255,.75)', textShadow: SHADOW}}>images: @mr_sleepygta6</div>
      <Audio src={staticFile('mix_v56.wav')} />
    </AbsoluteFill>
  );
};
