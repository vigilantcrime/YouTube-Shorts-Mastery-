/* "The badge or the billboard" — footage-first (video-1 formula): one Miami world, graphics as overlays.
   Visual system: BADGE = siren light bars / pursuit HUD / badges · BILLBOARD = footage framed as ads. */
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import words from './w7.json';
import {FPS, W, H, GRAD, SHADOW, f, ease, Title, Grade, Accent} from './kit';
import {cl, lerp, rnd, pop, useFontsReady} from './kit3d';

type Wd = [string, number];
const WT = (words as Wd[]).map(([w, t]) => [w, t + 0.05] as Wd);
const at = (word: string, after = 0) => WT.find(([w, t]) => w === word && t >= after)?.[1] ?? after;

const CUT = [0, 1.86, 4.3, 7.7, 9.7, 12.6, 15.0, 16.9, 19.5, 22.3, 23.9, 26.4, 30.2, 31.2, 34.4, 38.7, 41.5, 45.1, 49.2, 50.2, 51.8, 55.2, 58.7, 61.7, 64.9, 68.4, 70.9, 74.4, 78.0];
const FLASHES: [number, number, string][] = [[7.7, 0.5, '#fff'], [30.2, 0.8, '#fff'], [38.7, 0.5, '#9fd6ff'], [49.2, 0.7, '#ff2d2d'], [50.2, 0.6, '#ffe7a0']];
const RED = '#ff2a3a', BLUE = '#2a7bff';

const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#fff', style}) => (
  <div style={{fontFamily: 'HeroBlack', fontSize: size, color, letterSpacing: -size * 0.02, lineHeight: 1, ...style}}>{children}</div>
);
const GT: React.CSSProperties = {backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 5px 12px rgba(30,0,20,.55))'};
const Src: React.FC<{text: string; y?: number}> = ({text, y = 0.93}) => (
  <div style={{position: 'absolute', top: H * y, width: W, textAlign: 'center', fontFamily: 'UIBold', fontSize: 26, color: 'rgba(255,255,255,.8)', textShadow: SHADOW}}>{text}</div>
);

/* footage plate: src = 'cars' | 'walk', `from` in source seconds, with a slow eased move (never a plain push-in) */
const Foot: React.FC<{src: 'cars' | 'walk'; from: number; dur: number; rate?: number; move?: 'driftL' | 'driftR' | 'rise' | 'sink' | 'pullout' | 'none'; mono?: number; blur?: number}> =
({src, from, dur, rate = 1, move = 'driftL', mono = 0, blur = 0}) => {
  const fr = useCurrentFrame();
  const p = lerp(fr, 0, f(dur), 0, 1, Easing.inOut(Easing.sin));
  const t = move === 'driftL' ? `translateX(${30 - p * 60}px) scale(1.1)` : move === 'driftR' ? `translateX(${-30 + p * 60}px) scale(1.1)` : move === 'rise' ? `translateY(${40 - p * 80}px) scale(1.1)`
    : move === 'sink' ? `translateY(${-40 + p * 80}px) scale(1.1)` : move === 'pullout' ? `scale(${1.22 - p * 0.12})` : 'scale(1.04)';
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <AbsoluteFill style={{transform: t, filter: `grayscale(${mono}) contrast(${1.06 + mono * 0.15}) saturate(1.08) blur(${blur}px)`}}>
        <OffthreadVideo src={staticFile(src === 'cars' ? 'm_cars.mp4' : 'm_walk.mp4')} startFrom={Math.round(from * FPS)} playbackRate={rate} muted style={{width: W, height: H, objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,.35) 0%, transparent 22%, transparent 55%, rgba(0,0,0,.55) 100%)'}} />
    </AbsoluteFill>
  );
};

/* BADGE motif: police light bars pulsing on the frame edges */
const Siren: React.FC<{strength?: number}> = ({strength = 1}) => {
  const fr = useCurrentFrame();
  const ph = Math.floor(fr / 4) % 4;
  const r = ph < 2 ? 1 : 0.15, b = ph >= 2 ? 1 : 0.15;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 0% 0%, rgba(255,42,58,${0.55 * r * strength}), transparent 45%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 100% 0%, rgba(42,123,255,${0.55 * b * strength}), transparent 45%)`}} />
      <AbsoluteFill style={{boxShadow: `inset 22px 0 60px -10px rgba(255,42,58,${0.7 * r * strength}), inset -22px 0 60px -10px rgba(42,123,255,${0.7 * b * strength})`}} />
    </AbsoluteFill>
  );
};

/* BILLBOARD motif: footage displayed inside a roadside billboard */
const Billboard: React.FC<{src: 'cars' | 'walk'; from: number; headline: React.ReactNode; sub?: string; x?: number; y?: number; w?: number; tilt?: number; inT?: number}> =
({src, from, headline, sub, x = 70, y = 380, w = 940, tilt = -4, inT = 0}) => {
  const fr = useCurrentFrame();
  const p = pop(fr - inT, 10, 0.75);
  const h = w * 0.62;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, opacity: p.o, transform: `perspective(1400px) rotateY(${tilt * 2}deg) rotate(${tilt * 0.3}deg) scale(${p.s})`}}>
      <div style={{position: 'relative', width: w, height: h, border: '16px solid #111', borderRadius: 8, overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,0,0,.6), 0 0 60px rgba(255,90,170,.35)'}}>
        <OffthreadVideo src={staticFile(src === 'cars' ? 'm_cars.mp4' : 'm_walk.mp4')} startFrom={Math.round(from * FPS)} muted style={{width: w, height: w * 1.78, objectFit: 'cover', marginTop: -w * 0.5}} />
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(10,0,20,.85), transparent 55%)'}} />
        <div style={{position: 'absolute', left: 30, bottom: 26}}><Txt size={w * 0.085}>{headline}</Txt>{sub && <div style={{fontFamily: 'UIBold', fontSize: w * 0.032, color: 'rgba(255,255,255,.85)', marginTop: 8}}>{sub}</div>}</div>
        {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', top: -8, left: 60 + i * (w / 3), width: 60, height: 22, background: '#ffe9a8', boxShadow: '0 20px 40px 10px rgba(255,233,168,.35)'}} />)}
      </div>
      {[0.22, 0.78].map((k, i) => <div key={i} style={{position: 'absolute', left: w * k - 14, top: h, width: 28, height: 700, background: 'linear-gradient(90deg,#2a2a2e,#55555c,#2a2a2e)'}} />)}
    </div>
  );
};

const Badge: React.FC<{label: string; sub: string; col?: string; size?: number; style?: React.CSSProperties}> = ({label, sub, col = '#e8c46a', size = 360, style}) => (
  <div style={{width: size, height: size, position: 'relative', ...style}}>
    <div style={{position: 'absolute', inset: 0, clipPath: 'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)', background: `radial-gradient(circle at 40% 35%, #fff6d0, ${col} 45%, #7a5a1a)`}} />
    <div style={{position: 'absolute', left: '50%', top: '52%', width: size * 0.42, height: size * 0.42, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: '#1a2a4a', border: `${size * 0.02}px solid #fff6d0`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      <Txt size={size * 0.07} color="#fff6d0">{label}</Txt><div style={{fontFamily: 'UIBold', fontSize: size * 0.04, color: '#fff6d0', marginTop: 4}}>{sub}</div>
    </div>
  </div>
);

const Stamp: React.FC<{text: string; t0: number; col?: string; size?: number; y?: number; rot?: number}> = ({text, t0, col = RED, size = 140, y = 0.42, rot = -10}) => {
  const fr = useCurrentFrame();
  const p = pop(fr - t0, 5, 2.4);
  if (fr < t0) return null;
  return (
    <div style={{position: 'absolute', top: H * y, width: W, textAlign: 'center', opacity: p.o, transform: `rotate(${rot}deg) scale(${p.s})`}}>
      <span style={{fontFamily: 'HeroBlack', fontSize: size, color: col, border: `${size * 0.08}px solid ${col}`, borderRadius: size * 0.14, padding: `0 ${size * 0.25}px`, background: 'rgba(255,255,255,.08)',
        textShadow: '0 4px 20px rgba(0,0,0,.4)'}}>{text}</span>
    </div>
  );
};

const Ticker: React.FC<{from: number; to: number; a: number; b: number; fmt: (v: number) => string; y: number; size?: number; label?: string}> = ({from, to, a, b, fmt, y, size = 150, label}) => {
  const fr = useCurrentFrame();
  const v = lerp(fr, a, b, from, to, Easing.out(Easing.cubic));
  const land = fr >= b ? pop(fr - b, 6, 1.12).s : 1;
  return (
    <div style={{position: 'absolute', top: H * y, width: W, textAlign: 'center', transform: `scale(${land})`}}>
      <Txt size={size} style={GT}>{fmt(v)}</Txt>{label && <Txt size={size * 0.34} style={{marginTop: 12, textShadow: SHADOW}}>{label}</Txt>}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Shots                                                               */
/* ------------------------------------------------------------------ */
const L = (i: number) => CUT[i + 1] - CUT[i];

const shots: ((s: number) => React.ReactNode)[] = [
  // 0 · HOOK — payoff on frame 0: siren + headline already on screen
  (s) => <>
    <Foot src="cars" from={11.6} dur={L(0)} move="sink" />
    <Siren />
    <div style={{position: 'absolute', top: H * 0.1, width: W, textAlign: 'center'}}>
      <Txt size={92} style={{textShadow: SHADOW}}>MIAMI POLICE</Txt>
      <Txt size={64} color="#ffd36b" style={{margin: '14px 0', textShadow: SHADOW}}>vs.</Txt>
      <Txt size={104} style={GT}>GRAND THEFT AUTO</Txt>
    </div>
    <Title shotStart={s} y={0.8} size={96} lines={[[{w: 'car', t: at('CAR'), accent: true}, {w: 'theft', t: at('THEFT')}, {w: 'capital', t: at('CAPITAL')}], [{w: 'of', t: at('OF', 2)}, {w: 'Florida.', t: at('FLORIDA')}]]} />
  </>,
  // 1
  (s) => <><Foot src="walk" from={0} dur={L(1)} move="driftR" />
    <Title shotStart={s} y={0.78} lines={[[{w: 'watched', t: at('WATCHED')}, {w: 'its', t: at('ITS')}, {w: 'own', t: at('OWN')}], [{w: 'city', t: at('CITY', 3.9), accent: true}, {w: 'get', t: at('GET')}]]} /></>,
  // 2 — the city wrapped in ads: footage inside a billboard against the deco sky
  (s) => <><Foot src="walk" from={13.3} dur={L(2)} move="rise" />
    <Billboard src="cars" from={6.7} inT={2} headline={<>GRAND THEFT <Accent>AUTO</Accent></>} sub="NOW SHOWING ON EVERY STREET" y={330} />
    <Title shotStart={s} y={0.8} lines={[[{w: 'wrapped', t: at('WRAPPED')}, {w: 'in', t: at('IN', 4.8)}, {w: 'ads', t: at('ADS'), accent: true}], [{w: 'for', t: at('FOR', 5.3)}, {w: 'Grand', t: at('GRAND')}, {w: 'Theft', t: at('THEFT', 6.6)}, {w: 'Auto.', t: at('AUTO')}]]} /></>,
  // 3 — freeze the lowrider mid-hop, B&W
  (s) => <><Foot src="cars" from={4.25} rate={0.02} dur={L(3)} move="none" mono={0.95} />
    <Title shotStart={s} y={0.78} lines={[[{w: "couldn't", t: at("COULDN'T")}, {w: 'do', t: at('DO', 8.2)}], [{w: 'a', t: at('A', 8.5)}, {w: 'thing.', t: at('THING'), accent: true}]]} /></>,
  // 4 — stolen-car ticker (part 1)
  (s) => <><Foot src="walk" from={2.4} rate={0.6} dur={L(4)} move="driftL" /><Siren strength={0.6} />
    <Ticker from={0} to={3374} a={f(at('LOGGED') - s)} b={f(at('FOUR', 12.8) - s) + 6} fmt={(v) => Math.round(v).toLocaleString('en-US')} y={0.14} label="CARS STOLEN" />
    <Title shotStart={s} y={0.8} size={96} lines={[[{w: 'Miami-Dade', t: at('MIAMI-DADE')}, {w: 'police', t: at('POLICE', 10)}, {w: 'logged…', t: at('LOGGED')}]]} /></>,
  // 5 — ticker lands
  (s) => <><Foot src="cars" from={9.0} dur={L(5)} move="driftR" /><Siren strength={0.6} />
    <Ticker from={3374} to={3374} a={0} b={1} fmt={(v) => Math.round(v).toLocaleString('en-US')} y={0.14} label="STOLEN CARS · 2024" />
    <Src text="Miami-Dade Police · 2024" y={0.36} />
    <Title shotStart={s} y={0.8} lines={[[{w: 'stolen', t: at('STOLEN'), accent: true}, {w: 'cars', t: at('CARS', 13.6)}], [{w: 'in', t: at('IN', 14)}, {w: '2024.', t: at('TWENTY', 14.2)}]]} /></>,
  // 6 — "That's nine a day."
  (s) => { const fr = useCurrentFrame(); return <><Foot src="cars" from={0} dur={L(6)} move="pullout" />
    <div style={{position: 'absolute', top: H * 0.16, width: W, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18, padding: '0 120px', boxSizing: 'border-box'}}>
      {Array.from({length: 9}).map((_, i) => { const p = pop(fr - 4 - i * 2, 6, 0.3); return <div key={i} style={{fontSize: 110, opacity: p.o, transform: `scale(${p.s})`}}>🚗</div>; })}
    </div>
    <Title shotStart={s} y={0.72} size={170} lines={[[{w: '9', t: at('NINE'), accent: true}, {w: 'a', t: at('A', 16)}, {w: 'day.', t: at('DAY', 16.2)}]]} /></>; },
  // 7 — badge: their whole job
  (s) => { const fr = useCurrentFrame(); const p = pop(fr - 2, 10, 0.4); return <><Foot src="cars" from={1.6} dur={L(7)} move="driftL" /><Siren strength={0.8} />
    <div style={{position: 'absolute', left: W / 2 - 200, top: 260, opacity: p.o, transform: `scale(${p.s}) rotate(${(1 - p.s) * 40}deg)`}}><Badge label="POLICE" sub="MIAMI" size={400} /></div>
    <Title shotStart={s} y={0.76} size={104} lines={[[{w: 'their', t: at('THEIR')}, {w: 'whole', t: at('WHOLE')}, {w: 'job:', t: at('JOB')}], [{w: 'stopping', t: at('STOPPING')}, {w: 'GTA.', t: at('GRAND', 18.3), accent: true}]]} /></>; },
  // 8 — driving past billboards
  (s) => { const fr = useCurrentFrame(); return <><Foot src="cars" from={11.6} rate={1.4} dur={L(8)} move="none" />
    {[0, 1].map((k) => <div key={k} style={{position: 'absolute', left: interpolate(fr, [k * 30, k * 30 + 40], [W + 50, -1100], cl), top: 260 + k * 60}}>
      <Billboard src={k ? 'walk' : 'cars'} from={k ? 2.6 : 7.3} headline={k ? <>STEAL IN <Accent>STYLE</Accent></> : <>GRAND THEFT <Accent>AUTO</Accent></>} x={0} y={0} w={760} tilt={k ? 4 : -4} /></div>)}
    <Siren strength={0.5} />
    <Title shotStart={s} y={0.8} lines={[[{w: 'they', t: at('THEY', 19.8)}, {w: 'drive', t: at('DRIVE')}, {w: 'past', t: at('PAST')}, {w: 'it', t: at('IT', 20.7)}], [{w: 'on', t: at('ON', 21)}, {w: 'every', t: at('EVERY')}, {w: 'billboard.', t: at('BILLBOARD'), accent: true}]]} /></>; },
  // 9 — "The sheriff literally said"
  (s) => <><Foot src="walk" from={9.6} dur={L(9)} move="driftR" />
    <Title shotStart={s} y={0.78} lines={[[{w: 'the', t: at('THE', 22.1)}, {w: 'sheriff', t: at('SHERIFF'), accent: true}], [{w: 'literally', t: at('LITERALLY')}, {w: 'said…', t: at('SAID')}]]} /></>,
  // 10 — the quote card
  (s) => { const fr = useCurrentFrame(); const p = pop(fr - 1, 9, 0.85); return <><Foot src="walk" from={13.3} rate={0.6} dur={L(10)} move="rise" />
    <div style={{position: 'absolute', left: 80, right: 80, top: 520, padding: '60px 56px', borderRadius: 34, background: 'rgba(255,255,255,.95)', opacity: p.o, transform: `scale(${p.s}) rotate(-1.5deg)`, boxShadow: '0 30px 80px rgba(0,0,0,.5)'}}>
      <Txt size={180} color="#ff2d78" style={{lineHeight: 0.6, height: 70}}>“</Txt>
      <Txt size={82} color="#111" style={{lineHeight: 1.08}}>Miami-Dade County is <span style={{color: '#ff2d78'}}>not</span> Vice City.</Txt>
      <div style={{fontFamily: 'UIBold', fontSize: 32, color: '#666', marginTop: 30}}>— Miami-Dade Sheriff</div>
    </div></>; },
  // 11 — "Vice City was on a bus" (bus wrap drives through)
  (s) => { const fr = useCurrentFrame(); const bx = interpolate(fr, [f(at('BUS') - s) - 26, f(at('BUS') - s) + 8], [W + 60, -40], {...cl, easing: Easing.out(Easing.cubic)});
    return <><Foot src="walk" from={0.6} dur={L(11)} move="driftL" />
      <div style={{position: 'absolute', left: bx, top: 900, width: 1300, height: 420}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 40, background: 'linear-gradient(90deg,#ff2d78,#ff7ab8 50%,#7a2aff)', boxShadow: '0 30px 60px rgba(0,0,0,.5)', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 40, top: 40, display: 'flex', gap: 16}}>{Array.from({length: 6}).map((_, i) => <div key={i} style={{width: 150, height: 120, borderRadius: 14, background: 'rgba(20,10,30,.55)'}} />)}</div>
          <div style={{position: 'absolute', left: 50, top: 200}}><Txt size={120} style={{textShadow: '0 6px 0 rgba(0,0,0,.25)'}}>VICE CITY</Txt><Txt size={40} style={{marginTop: 10}}>COMING TO A STREET NEAR YOU</Txt></div>
        </div>
        {[180, 1000].map((x, i) => <div key={i} style={{position: 'absolute', left: x, top: 360, width: 130, height: 130, borderRadius: 65, background: '#111', border: '14px solid #555'}} />)}
      </div>
      <Title shotStart={s} y={0.16} lines={[[{w: 'she', t: at('SHE')}, {w: 'walked', t: at('WALKED')}, {w: 'outside…', t: at('OUTSIDE')}], [{w: 'Vice', t: at('VICE', 28.4)}, {w: 'City', t: at('CITY', 28.8)}, {w: 'on', t: at('ON', 29.3)}, {w: 'a', t: at('A', 29.5)}, {w: 'bus.', t: at('BUS'), accent: true}]]} /></>; },
  // 12 — "It gets better." whip
  (s) => { const fr = useCurrentFrame(); return <><AbsoluteFill style={{transform: `translateX(${interpolate(fr, [0, 6], [-500, 0], {...cl, easing: ease})}px)`, filter: `blur(${interpolate(fr, [0, 6], [30, 0], cl)}px)`}}><Foot src="walk" from={9.0} dur={L(12)} move="none" /></AbsoluteFill>
    <Title shotStart={s} y={0.5} size={170} lines={[[{w: 'it', t: at('IT', 29.9)}, {w: 'gets', t: at('GETS')}], [{w: 'better.', t: at('BETTER'), accent: true}]]} /></>; },
  // 13 — cop chasing a stolen car down Biscayne: pursuit HUD
  (s) => { const fr = useCurrentFrame(); return <><Foot src="cars" from={3.3} dur={L(13)} move="sink" /><Siren strength={1} />
    <div style={{position: 'absolute', left: 40, top: 60, padding: '14px 24px', background: 'rgba(0,0,0,.65)', borderLeft: `8px solid ${RED}`, fontFamily: 'UIBold', fontSize: 34, color: '#fff', lineHeight: 1.4}}>
      UNIT 7 · <span style={{color: RED}}>PURSUIT</span><br />BISCAYNE BLVD · NB<br />SPEED {Math.round(58 + fr * 0.5)} MPH</div>
    <div style={{position: 'absolute', left: W / 2 - 160, top: H * 0.42, width: 320, height: 320, border: `6px solid ${RED}`, borderRadius: 16, opacity: Math.floor(fr / 6) % 2 ? 0.4 : 1}}><div style={{position: 'absolute', top: -46, left: 0, fontFamily: 'UIBold', fontSize: 32, color: RED}}>STOLEN</div></div>
    <Title shotStart={s} y={0.84} size={96} lines={[[{w: 'a', t: at('A', 31.8)}, {w: 'cop', t: at('COP')}, {w: 'chasing', t: at('CHASING')}, {w: 'a', t: at('A', 32.6)}], [{w: 'stolen', t: at('STOLEN', 32.7), accent: true}, {w: 'car…', t: at('CAR', 33.1)}]]} /></>; },
  // 14 — "you pass a giant ad telling the city how fun stealing cars is"
  (s) => <><Foot src="cars" from={12.5} dur={L(14)} move="driftR" blur={2} /><Siren strength={0.45} />
    <Billboard src="cars" from={6.6} inT={f(at('GIANT') - s) - 4} headline={<>STEALING CARS IS <Accent>FUN</Accent></>} sub="★★★★★  —  the whole city" y={300} tilt={5} />
    <Title shotStart={s} y={0.8} size={96} lines={[[{w: 'how', t: at('HOW')}, {w: 'fun', t: at('FUN'), accent: true}], [{w: 'stealing', t: at('STEALING', 37.3)}, {w: 'cars', t: at('CARS', 37.9)}, {w: 'is.', t: at('IS', 38.3)}]]} /></>,
  // 15 — "And the funniest part? They're already in the game." RGB-split glitch
  (s) => { const fr = useCurrentFrame(); const g = fr % 9 < 2 ? 14 : 4; return <>
    <AbsoluteFill style={{mixBlendMode: 'screen'}}>
      <AbsoluteFill style={{transform: `translateX(${-g}px)`, filter: 'sepia(1) saturate(6) hue-rotate(-50deg)'}}><Foot src="cars" from={7.4} dur={L(15)} move="none" /></AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${g}px)`, filter: 'sepia(1) saturate(6) hue-rotate(160deg)', opacity: 0.7}}><Foot src="cars" from={7.4} dur={L(15)} move="none" /></AbsoluteFill>
    </AbsoluteFill>
    <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 2px, transparent 2px 5px)'}} />
    <Title shotStart={s} y={0.15} size={96} lines={[[{w: 'the', t: at('THE', 38.8)}, {w: 'funniest', t: at('FUNNIEST')}, {w: 'part?', t: at('PART')}]]} />
    <Stamp text="ALREADY IN THE GAME" t0={f(at('ALREADY') - s)} col="#3de0ff" size={90} y={0.62} rot={-6} /></>; },
  // 16 — Vice-Dale PD = Miami-Dade Sheriff
  (s) => { const fr = useCurrentFrame(); const a = pop(fr - 2, 9, 0.4), b = pop(fr - f(at('MIAMI-DADE', 43) - s), 9, 0.4); return <><Foot src="walk" from={5.0} dur={L(16)} move="driftL" blur={10} />
    <AbsoluteFill style={{background: 'rgba(8,6,20,.45)'}} />
    <div style={{position: 'absolute', left: 60, top: 520, opacity: a.o, transform: `scale(${a.s})`, textAlign: 'center'}}><Badge label="VICE-DALE" sub="PD · in-game" col="#ff7ab8" size={440} /><Txt size={44} style={{marginTop: 10}}>IN THE GAME</Txt></div>
    <div style={{position: 'absolute', right: 60, top: 520, opacity: b.o, transform: `scale(${b.s})`, textAlign: 'center'}}><Badge label="MIAMI-DADE" sub="SHERIFF · real" size={440} /><Txt size={44} style={{marginTop: 10}}>IN REAL LIFE</Txt></div>
    <div style={{position: 'absolute', top: 680, width: W, textAlign: 'center', opacity: b.o}}><Txt size={160} style={GT}>=</Txt></div>
    <Title shotStart={s} y={0.16} size={96} lines={[[{w: 'Vice-Dale', t: at('VISDALE'), accent: true}, {w: 'PD', t: at('PD')}], [{w: 'is', t: at('IS', 42.5)}, {w: 'modelled', t: at('MODELED')}, {w: 'on…', t: at('ON', 43.1)}]]} /></>; },
  // 17 — starring in the product (movie-poster credit)
  (s) => { const fr = useCurrentFrame(); const st = f(at('STARRING') - s); return <><Foot src="walk" from={5.4} rate={0.7} dur={L(17)} move="pullout" />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,.6), transparent 40%, rgba(0,0,0,.75))'}} />
    {fr >= st && <div style={{position: 'absolute', top: H * 0.36, width: W, textAlign: 'center', opacity: pop(fr - st, 8, 1.3).o, transform: `scale(${pop(fr - st, 8, 1.3).s})`}}>
      <div style={{fontFamily: 'UIBold', fontSize: 40, letterSpacing: 14, color: '#ffd36b'}}>STARRING</div><Txt size={120} style={{marginTop: 18}}>THE REAL</Txt><Txt size={150} style={GT}>POLICE</Txt>
      <div style={{fontFamily: 'UIBold', fontSize: 30, letterSpacing: 6, color: 'rgba(255,255,255,.8)', marginTop: 20}}>AS THEMSELVES</div></div>}
    <Title shotStart={s} y={0.14} size={92} lines={[[{w: 'complaining', t: at('COMPLAINING')}, {w: 'about', t: at('ABOUT', 46.7)}, {w: 'the', t: at('THE', 46.9)}, {w: 'advert…', t: at('ADVERT')}]]} outAt={47.7} /></>; },
  // 18 — UNPAID
  (s) => <><Foot src="walk" from={8.0} rate={0.02} dur={L(18)} move="none" mono={0.9} /><Stamp text="UNPAID." t0={1} size={190} y={0.42} /></>,
  // 19 — "Now, let's talk money."
  (s) => <><Foot src="cars" from={0.2} rate={1.6} dur={L(19)} move="pullout" />
    <Title shotStart={s} y={0.5} size={150} lines={[[{w: "let's", t: at("LET'S")}, {w: 'talk', t: at('TALK')}], [{w: 'money.', t: at('MONEY'), accent: true}]]} /></>,
  // 20 — $1B in 3 days
  (s) => { const fr = useCurrentFrame(); const d = Math.min(3, Math.floor(lerp(fr, 4, f(at('DAYS', 54.5) - s), 0, 3.2, Easing.linear))); return <><Foot src="cars" from={11.8} dur={L(20)} move="rise" />
    <Ticker from={0} to={1e9} a={4} b={f(at('DOLLARS') - s) + 4} fmt={(v) => '$' + Math.round(v).toLocaleString('en-US')} y={0.12} size={112} label="GTA 5 · LAUNCH" />
    <div style={{position: 'absolute', top: H * 0.44, width: W, display: 'flex', justifyContent: 'center', gap: 24}}>{[1, 2, 3].map((k) => <div key={k} style={{width: 150, height: 150, borderRadius: 24, background: k <= d ? GRAD : 'rgba(255,255,255,.15)', border: '4px solid rgba(255,255,255,.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}><Txt size={64}>{k}</Txt><div style={{fontFamily: 'UIBold', fontSize: 24, color: '#fff'}}>DAY</div></div>)}</div>
    <Title shotStart={s} y={0.8} lines={[[{w: 'a', t: at('A', 52.9)}, {w: 'billion', t: at('BILLION', 53), accent: true}], [{w: 'in', t: at('IN', 54)}, {w: 'three', t: at('THREE', 54.3)}, {w: 'days.', t: at('DAYS', 54.5)}]]} /></>; },
  // 21 — Guinness record plaque
  (s) => { const fr = useCurrentFrame(); const p = pop(fr - 3, 10, 0.6); return <><Foot src="walk" from={13.6} rate={0.5} dur={L(21)} move="sink" />
    <div style={{position: 'absolute', left: 110, right: 110, top: 520, padding: '54px 40px', borderRadius: 28, background: 'linear-gradient(160deg,#2a2210,#0e0b05)', border: '8px solid #e8c46a', textAlign: 'center',
      opacity: p.o, transform: `scale(${p.s})`, boxShadow: '0 30px 80px rgba(0,0,0,.6), 0 0 60px rgba(232,196,106,.35)'}}>
      <div style={{fontFamily: 'UIBold', fontSize: 30, letterSpacing: 8, color: '#e8c46a'}}>WORLD RECORD</div>
      <Txt size={78} color="#fff6d0" style={{marginTop: 24, lineHeight: 1.1}}>Fastest-selling entertainment product ever</Txt>
      <div style={{fontFamily: 'UIBold', fontSize: 30, color: '#c9b27a', marginTop: 24}}>GTA 5 · 2013 · per Guinness World Records</div>
    </div></>; },
  // 22 — police recover cars one at a time (slow)
  (s) => { const fr = useCurrentFrame(); const n = Math.min(3, 1 + Math.floor(fr / 30)); return <><Foot src="cars" from={3.4} rate={0.35} dur={L(22)} move="driftR" /><Siren strength={0.5} />
    <div style={{position: 'absolute', top: H * 0.13, width: W, textAlign: 'center'}}><Txt size={64} style={{textShadow: SHADOW}}>RECOVERED</Txt><Txt size={220} style={{marginTop: 10, textShadow: SHADOW}}>{n}</Txt></div>
    <Title shotStart={s} y={0.8} size={104} lines={[[{w: 'one', t: at('ONE', 60.6)}, {w: 'at', t: at('AT', 60.9)}, {w: 'a', t: at('A', 61.1)}, {w: 'time.', t: at('TIME', 61.2), accent: true}]]} /></>; },
  // 23 — Rockstar makes a billion off pretend ones in a weekend (fast)
  (s) => <><Foot src="cars" from={6.6} rate={1.8} dur={L(23)} move="driftL" />
    <Ticker from={0} to={1e9} a={2} b={f(at('BILLION', 62.5) - s) + 3} fmt={(v) => '$' + (v / 1e9).toFixed(2) + 'B'} y={0.14} size={170} label="OFF PRETEND CARS" />
    <Title shotStart={s} y={0.8} lines={[[{w: 'in', t: at('IN', 64)}, {w: 'a', t: at('A', 64.2)}, {w: 'weekend.', t: at('WEEKEND'), accent: true}]]} /></>,
  // 24 — real Miami: arrested (mugshot board)
  (s) => { const fr = useCurrentFrame(); return <><Foot src="walk" from={3.0} rate={0.5} dur={L(24)} move="none" mono={0.6} />
    <AbsoluteFill style={{background: 'rgba(30,40,60,.35)'}} />
    {Array.from({length: 9}).map((_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 260 + i * 150, height: 4, background: 'rgba(255,255,255,.55)'}}><div style={{position: 'absolute', right: 30, top: -40, fontFamily: 'UIBold', fontSize: 30, color: 'rgba(255,255,255,.8)'}}>{7 - Math.floor(i / 1.5)}′</div></div>)}
    <div style={{position: 'absolute', left: W / 2 - 280, top: 1180, width: 560, padding: 24, background: '#111', border: '4px solid #fff', textAlign: 'center'}}><Txt size={44}>MIAMI-DADE · BOOKING</Txt><div style={{fontFamily: 'UIBold', fontSize: 32, color: '#ccc', marginTop: 8}}>GRAND THEFT AUTO · 2026</div></div>
    <Stamp text="ARRESTED" t0={f(at('ARRESTED') - s)} size={140} y={0.36} />
    <Title shotStart={s} y={0.14} size={92} lines={[[{w: 'in', t: at('IN', 65.2)}, {w: 'the', t: at('THE', 65.4)}, {w: 'real', t: at('REAL', 65.5), accent: true}, {w: 'Miami…', t: at('MIAMI', 65.8)}]]} /></>; },
  // 25 — in the ads: five-star review (wanted-level pun)
  (s) => { const fr = useCurrentFrame(); return <><Foot src="cars" from={9.2} dur={L(25)} move="rise" />
    <div style={{position: 'absolute', top: H * 0.16, width: W, display: 'flex', justifyContent: 'center', gap: 14}}>
      {[0, 1, 2, 3, 4].map((i) => { const p = pop(fr - f(at('FIVE', 69.6) - s) + 6 - i * 3, 6, 2); return <div key={i} style={{fontSize: 150, color: '#ffd36b', opacity: p.o, transform: `scale(${p.s})`, textShadow: '0 0 30px rgba(255,211,107,.8)'}}>★</div>; })}
    </div>
    <Title shotStart={s} y={0.78} lines={[[{w: 'in', t: at('IN', 68.3)}, {w: 'the', t: at('THE', 68.5)}, {w: 'ads…', t: at('ADS', 68.6)}], [{w: 'five-star', t: at('FIVE', 69.6), accent: true}, {w: 'review.', t: at('REVIEW')}]]} /></>; },
  // 26 — badge or billboard: split screen
  (s) => { const fr = useCurrentFrame(); const sp = lerp(fr, 0, 8, 0, 1, Easing.out(Easing.cubic)); return <>
    <div style={{position: 'absolute', left: 0, top: 0, width: W / 2, height: H, overflow: 'hidden', transform: `translateX(${(1 - sp) * -W / 2}px)`}}>
      <div style={{position: 'absolute', left: -W / 4, width: W, height: H}}><Foot src="cars" from={3.4} dur={L(26)} move="none" mono={0.3} /></div><Siren strength={1} />
      <div style={{position: 'absolute', left: 40, top: 640}}><Badge label="POLICE" sub="MIAMI" size={460} /></div></div>
    <div style={{position: 'absolute', left: W / 2, top: 0, width: W / 2, height: H, overflow: 'hidden', transform: `translateX(${(1 - sp) * W / 2}px)`}}>
      <div style={{position: 'absolute', left: -W / 4, width: W, height: H}}><Foot src="cars" from={6.8} dur={L(26)} move="none" /></div>
      <div style={{position: 'absolute', left: 10, top: 700, width: 520, height: 330, border: '12px solid #111', background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><Txt size={70}>GRAND<br />THEFT<br />AUTO</Txt></div></div>
    <div style={{position: 'absolute', left: W / 2 - 4, top: 0, width: 8, height: H, background: '#fff', opacity: sp}} />
    <Title shotStart={s} y={0.14} size={100} lines={[[{w: "who's", t: at("WHO'S")}, {w: 'really', t: at('REALLY')}, {w: 'running', t: at('RUNNING')}], [{w: 'Vice', t: at('VICE', 71.9)}, {w: 'City?', t: at('CITY', 72.2), accent: true}]]} />
    <Title shotStart={s} y={0.85} size={100} lines={[[{w: 'the', t: at('THE', 72.6)}, {w: 'badge', t: at('BADGE')}, {w: 'or', t: at('OR', 73.2)}, {w: 'the', t: at('THE', 73.4)}, {w: 'billboard?', t: at('BILLBOARD', 73.5), accent: true}]]} /></>; },
  // 27 — CTA (short) — returns to the opening aerial so the loop is seamless
  (s) => { const fr = useCurrentFrame(); const p = pop(fr - 2, 9, 0.7); return <><Foot src="cars" from={11.0} dur={L(27)} move="sink" /><Siren strength={0.6} />
    <div style={{position: 'absolute', left: 140, right: 140, top: 760, padding: '36px 40px', borderRadius: 999, background: GRAD, textAlign: 'center', opacity: p.o, transform: `scale(${p.s})`, boxShadow: '0 20px 60px rgba(255,60,150,.5)'}}>
      <Txt size={64}>+ Follow Vice City Sin</Txt></div>
    <Title shotStart={s} y={0.6} size={84} lines={[[{w: 'every', t: at('EVERY', 75.9)}, {w: "sin's", t: at("SIN'S")}, {w: 'a', t: at('A', 76.8)}, {w: 'story.', t: at('STORY'), accent: true}]]} /></>; },
];

const SHOT_COMPS = shots.map((sh, i) => { const C: React.FC = () => <>{sh(CUT[i])}</>; return C; });

export const BadgeBillboard: React.FC = () => {
  const ready = useFontsReady('bb');
  const fr = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{background: '#000'}} />;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOT_COMPS.map((C, i) => <Sequence key={i} from={f(CUT[i])} durationInFrames={f(CUT[i + 1]) - f(CUT[i])}><C /></Sequence>)}
      {FLASHES.map(([t, peak, col], i) => (
        <AbsoluteFill key={i} style={{background: col, pointerEvents: 'none', opacity: interpolate(fr, [f(t) - 1, f(t), f(t) + 1, f(t) + 4], [0, peak, peak * 0.62, 0], cl)}} />
      ))}
      <Audio src={staticFile('mix_bb.wav')} />
    </AbsoluteFill>
  );
};
