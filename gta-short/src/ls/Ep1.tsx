/* Leonida Shifts — Episode 1 ("everything that changed this week in GTA 6"). 1920×1080, 310.85 s.
   VO1 at 0 s, VO2 at O2 = 166.9 s (trimmed after "in-game podcasts"), 12 s outro / end-screen.
   Gameplay always runs underneath; every fact is a roadside / in-car object; chapters = exits & gears 1–6. */
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, interpolate, Easing, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {useFontsReady} from '../kit3d';
import {Background, Beat, Big, C, Count, Emblem, Flip, GRAD, HERO, MapPin, MapSvg, Pill, S, Seg, Small, Stamp, Title, UI, Wordmark, cl, eio, eo, pop, ramp, useT, Hi, FPS, fit, TimeCtx, MONO} from './kit';
import {BlueSign, Billboard, Citation, Departures, ExitSign, GREEN, Gantry, Gauge, Led, Meter, Mirror, NextExit, NoSign, Odometer, Plate, PriceBoard, Receipt, SatNav, ScoreSign, Splat, Stereo, Tape, Warn, Wiper, YELLOW, springIn, wipeClear, HUD} from './road';
import geo from './geo.json';
import TL from './ep1_timeline.json';

export const EP1_FRAMES = Math.round(TL.end * FPS);
const O2 = 166.9; const v2 = (s: number) => O2 + s; const OUTRO = 298.85;
/* VO clock ("virtual") vs real clock: each gameplay break pauses the VO and everything synced to it */
const INSV = TL.insV as {p: number; d: number}[];
const R = (v: number) => v + INSV.reduce((a, i) => a + (i.p <= v + 1e-6 ? i.d : 0), 0);
const virt = (r: number) => { let off = 0; for (const i of INSV) { const s0 = i.p + off; if (r < s0) return r - off; if (r < s0 + i.d) return i.p - 0.001; off += i.d; } return r - off; };
const SV: React.FC<{at: number; n: string; v?: number}> = ({at, n, v}) => <S at={R(at)} n={n} v={v} />;
const useRoadFonts = () => {
  const [h] = React.useState(() => delayRender('road-fonts')); const [ok, setOk] = React.useState(false);
  React.useEffect(() => { Promise.all([['Road', 'road900'], ['RoadB', 'road700'], ['RoadMono', 'mono700']].map(([n, f]) => new FontFace(n, `url(${staticFile(`ls/fonts/${f}.woff2`)})`).load()))
    .then((fs) => { fs.forEach((x) => document.fonts.add(x)); setOk(true); continueRender(h); }); }, [h]);
  return ok;
};
const CHAPTERS = [{t: 17.3, name: 'THE REVIEWS'}, {t: 72.3, name: 'THE NUMBERS'}, {t: 128.9, name: 'THE HYPE'}, {t: v2(0), name: 'THE FIRST PATCH'}, {t: v2(58.4), name: 'TROPHY WARNING'}, {t: v2(110.4), name: 'SECRET STATION'}];

/* gameplay bed + gameplay-with-sound breaks: see ep1_timeline.json (built by build_tl.py from the highlight analysis) */
/* camera punches on gameplay action peaks (boost, fight, crash-out, truck pass, chair crash, bike crash, robbery, kicks, mud fall) */
const PUNCH = [1.4, 3.0, 6.0, 11.1, 97.6, 141.7, 195.2, 201.7, 208.7, 246.7, 251.0];

/* ------------------------------------------------------------------ small local pieces */
const Barricade: React.FC<{top: string; date: string; t0: number; strike?: number}> = ({top, date, t0, strike}) => {
  const t = useT(); const sp = strike !== undefined ? ramp(t, strike, strike + 0.25, 0, 1, eo) : 0;
  return <div style={{width: 440}}>
    <div style={{height: 70, borderRadius: 10, backgroundImage: 'repeating-linear-gradient(-45deg, #FF6A00 0 34px, #fff 34px 68px)', border: '5px solid #222', boxShadow: '0 18px 30px rgba(0,0,0,.5)'}} />
    <div style={{marginTop: -6, padding: '16px 22px', background: '#FF6A00', border: '5px solid #222', borderRadius: '0 0 10px 10px', position: 'relative'}}>
      <div style={{fontFamily: HERO, fontSize: 52, color: '#111', lineHeight: 1}}>{top}</div>
      <div style={{fontFamily: UI, fontSize: 26, color: '#111', letterSpacing: 2, marginTop: 6}}>{date}</div>
      {sp > 0 && <div style={{position: 'absolute', left: 14, top: '52%', height: 9, width: `${sp * 92}%`, background: '#111', transform: 'rotate(-4deg)'}} />}
    </div>
  </div>;
};
const Waffle: React.FC<{t0: number}> = ({t0}) => {
  const t = useT(); const n = Math.floor(ramp(t, t0, t0 + 1.3, 0, 147, Easing.out(Easing.quad)));
  return <div style={{display: 'grid', gridTemplateColumns: 'repeat(21, 26px)', gap: 7, padding: 22, borderRadius: 18, background: '#09080c', border: '4px solid #3a3b42', boxShadow: '0 30px 60px rgba(0,0,0,.6)'}}>
    {Array.from({length: 147}, (_, i) => { const on = i < n; const gold = i < 118; return <div key={i} style={{width: 26, height: 26, borderRadius: 13, background: on ? (gold ? '#FFC83D' : C.teal) : '#1a1a20', boxShadow: on ? `0 0 10px ${gold ? '#FFC83D' : C.teal}` : 'none'}} />; })}
  </div>;
};
const Fork: React.FC<{t0: number; a: string; b: string; tb: number}> = ({t0, a, b, tb}) => {
  const t = useT();
  return <div style={{position: 'relative', width: 980, background: GREEN, borderRadius: 18, padding: 9, boxShadow: '0 26px 44px rgba(0,0,0,.55)'}}>
    <div style={{border: '4px solid #fff', borderRadius: 12, padding: '24px 30px', display: 'flex', alignItems: 'center', gap: 28}}>
      <svg width={180} height={200} viewBox="0 0 180 200"><path d="M90 196 V110 L30 40 M90 110 L150 40" stroke="#fff" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M30 40 l-6 34 M30 40 l34 -2 M150 40 l6 34 M150 40 l-34 -2" stroke="#fff" strokeWidth={18} strokeLinecap="round" /></svg>
      <div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
        <div style={{...pop(t, t0), fontFamily: HERO, fontSize: fit('↖ ' + a, HERO, 54, 650), color: '#fff', whiteSpace: 'nowrap'}}>↖ {a}</div>
        <div style={{...pop(t, tb), fontFamily: HERO, fontSize: fit('↗ ' + b, HERO, 54, 650), color: '#fff', whiteSpace: 'nowrap'}}>↗ {b}</div>
      </div>
    </div>
  </div>;
};
const QuoteCard: React.FC<{outlet: string; date: string; children: React.ReactNode; w?: number}> = ({outlet, date, children, w = 760}) =>
  <div style={{width: w, borderRadius: 18, overflow: 'hidden', background: '#fbfaf7', boxShadow: '0 30px 60px rgba(0,0,0,.6)'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', padding: '14px 24px', background: '#15101d', fontFamily: UI, fontSize: 20, letterSpacing: 3, color: '#fff'}}><span>📰 {outlet}</span><span style={{color: C.mute}}>{date}</span></div>
    <div style={{padding: '24px 28px 28px', fontFamily: HERO, fontSize: 44, lineHeight: 1.18, color: '#16101c'}}>{children}</div>
  </div>;
const Trophy: React.FC<{t0: number}> = ({t0}) => {
  const t = useT(); const shine = ((t - t0) * 0.6) % 1;
  return <div style={{display: 'flex', alignItems: 'center', gap: 30, padding: '26px 36px', borderRadius: 24, background: 'linear-gradient(135deg,#2a1a12,#120b16)', border: '3px solid #d08a4a', boxShadow: '0 0 40px rgba(208,138,74,.45), 0 30px 60px rgba(0,0,0,.6)', width: 900}}>
    <div style={{position: 'relative', width: 170, height: 170, borderRadius: 85, background: 'radial-gradient(circle at 35% 30%, #ffd9a8, #c47a3a 55%, #6b3a17)', boxShadow: 'inset 0 -8px 16px rgba(0,0,0,.4), 0 0 30px rgba(255,170,90,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
      <div style={{fontSize: 90}}>🧘</div>
      <div style={{position: 'absolute', top: 0, bottom: 0, width: 40, left: `${-30 + shine * 260}%`, background: 'rgba(255,255,255,.35)', transform: 'skewX(-20deg)'}} />
    </div>
    <div><Small size={22} color="#ffc48e">BRONZE TROPHY · POTENTIALLY MISSABLE</Small><Big size={64} style={{marginTop: 8}}>POSITIVE MENTAL ATTITUDE</Big><Small size={24} color="#fff" style={{marginTop: 10}}>MEDITATE AT ALL 18 SPOTS</Small></div>
  </div>;
};
const Route18: React.FC<{t0: number; hl: number}> = ({t0, hl}) => {
  const t = useT(); const n = Math.floor(ramp(t, t0, t0 + 1.6, 0, 18, Easing.out(Easing.quad)));
  const pts = Array.from({length: 18}, (_, i) => [70 + i * 62, 150 + Math.sin(i * 0.7) * 70]);
  const d = 'M' + pts.map((p) => p.join(' ')).join(' L');
  return <div style={{position: 'relative', width: 1220, height: 330, borderRadius: 24, background: 'rgba(12,8,20,.86)', border: '2px solid rgba(255,255,255,.2)', boxShadow: '0 30px 60px rgba(0,0,0,.55)'}}>
    <div style={{position: 'absolute', left: 30, top: 22, fontFamily: UI, fontSize: 22, color: C.mute, letterSpacing: 4}}>MEDITATION ROUTE · LEONIDA</div>
    <div style={{position: 'absolute', right: 30, top: 14, fontFamily: HERO, fontSize: 54, color: '#fff'}}>{n}<span style={{color: C.mute, fontSize: 34}}>/18</span></div>
    <svg width={1220} height={330} viewBox="0 0 1220 330" style={{position: 'absolute', left: 0, top: 30}}>
      <path d={d} stroke="#3a3542" strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke="#FFCB05" strokeWidth={3} strokeDasharray="14 14" fill="none" />
      {pts.map(([x, y], i) => { const on = i < n; const h = i === 0 && t >= hl; return <g key={i}>
        {h && <circle cx={x} cy={y} r={22 + ((t * 1.4) % 1) * 26} fill="none" stroke={C.pink} strokeWidth={3} opacity={1 - ((t * 1.4) % 1)} />}
        <circle cx={x} cy={y} r={h ? 20 : 14} fill={on ? (h ? C.pink : C.teal) : '#1a1820'} stroke="#fff" strokeWidth={3} /></g>; })}
    </svg>
    {t >= hl && <div style={{position: 'absolute', left: 30, bottom: 26, ...pop(t, hl)}}><Pill text="SPOT 1 · CHAPTER 1 · JASON'S HOUSE" icon="📍" v="hot" size={26} /></div>}
  </div>;
};
const Prompt: React.FC<{tYes: number; tSkip: number}> = ({tYes, tSkip}) => {
  const t = useT(); const yes = t >= tYes; const glow = 0.5 + 0.5 * Math.sin(t * 8);
  return <div style={{width: 940, padding: '26px 34px', borderRadius: 14, background: 'rgba(5,5,8,.88)', borderLeft: `8px solid ${C.pink}`, boxShadow: '0 30px 60px rgba(0,0,0,.6)'}}>
    <div style={{fontFamily: HERO, fontSize: 30, color: C.pink, letterSpacing: 1}}>LUCIA</div>
    <div style={{fontFamily: UI, fontSize: 40, color: '#fff', marginTop: 6}}>"Want to try meditating with me?"</div>
    <div style={{display: 'flex', gap: 22, marginTop: 24}}>
      <div style={{padding: '14px 40px', borderRadius: 10, fontFamily: HERO, fontSize: 38, background: yes ? C.teal : 'rgba(255,255,255,.1)', color: yes ? '#0b1a16' : '#fff', boxShadow: yes ? `0 0 ${20 + glow * 20}px ${C.teal}` : 'none'}}>✓ YES</div>
      <div style={{position: 'relative', padding: '14px 40px', borderRadius: 10, fontFamily: HERO, fontSize: 38, background: 'rgba(255,255,255,.1)', color: 'rgba(255,255,255,.6)'}}>SKIP
        {t >= tSkip && <div style={{position: 'absolute', left: 10, right: 10, top: '50%', height: 6, background: C.red, transform: `rotate(-8deg) scaleX(${ramp(t, tSkip, tSkip + 0.2)})`}} />}</div>
    </div>
    <div style={{fontFamily: UI, fontSize: 16, color: 'rgba(255,255,255,.45)', letterSpacing: 2, marginTop: 14}}>ILLUSTRATIVE PROMPT · AFTER THE MISSION "DOWN TO EARTH"</div>
  </div>;
};
const Poster: React.FC<{w?: number}> = ({w = 340}) =>
  <div style={{width: w, height: w * 1.4, background: 'linear-gradient(180deg,#d4142f,#8e0a1f)', borderRadius: 6, padding: w * 0.07, boxSizing: 'border-box', boxShadow: '0 30px 60px rgba(0,0,0,.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden'}}>
    <div style={{fontFamily: HERO, fontSize: w * 0.19, color: '#111', letterSpacing: -1, lineHeight: 0.95}}>THE VAULT</div>
    <svg viewBox="0 0 200 220" width={w * 0.78} style={{marginTop: w * 0.05}}>
      <path d="M40 60 Q100 0 160 60 L170 120 Q160 175 100 195 Q40 175 30 120 Z" fill="#111" />
      <circle cx={72} cy={92} r={24} fill="#d4142f" stroke="#333" strokeWidth={8} /><circle cx={128} cy={92} r={24} fill="#d4142f" stroke="#333" strokeWidth={8} />
      <rect x={78} y={150} width={44} height={56} rx={10} fill="#222" stroke="#444" strokeWidth={5} /><path d="M82 165 H118 M82 180 H118 M82 195 H118" stroke="#555" strokeWidth={4} />
    </svg>
    <div style={{position: 'absolute', bottom: w * 0.05, fontFamily: UI, fontSize: w * 0.05, color: '#111', letterSpacing: 3}}>VICE CITY · DOWNTOWN</div>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,.14), transparent 40%)'}} />
  </div>;
const Phone: React.FC<{t0: number; tOk: number}> = ({t0, tOk}) => {
  const t = useT(); const sy = ((t - t0) * 1.6) % 1; const ok = t >= tOk;
  return <div style={{position: 'relative', width: 330, height: 660, borderRadius: 48, background: '#0b0b0e', border: '6px solid #3b3c44', boxShadow: '0 34px 70px rgba(0,0,0,.65)', padding: 14, boxSizing: 'border-box'}}>
    <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 36, overflow: 'hidden', background: '#2a1a22'}}>
      <div style={{position: 'absolute', left: 32, top: 110, transform: 'rotate(-4deg)'}}><Poster w={230} /></div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, padding: '18px 0 10px', textAlign: 'center', background: 'rgba(0,0,0,.55)', fontFamily: UI, fontSize: 18, color: '#fff', letterSpacing: 3}}>WAiNK · SCAN</div>
      {[[24, 96], [270, 96], [24, 470], [270, 470]].map(([x, y], i) => <div key={i} style={{position: 'absolute', left: x - (i % 2 ? 0 : 0), top: y, width: 30, height: 30, borderColor: ok ? C.teal : '#fff', borderStyle: 'solid', borderWidth: `${i < 2 ? 5 : 0}px ${i % 2 ? 5 : 0}px ${i >= 2 ? 5 : 0}px ${i % 2 ? 0 : 5}px`}} />)}
      {!ok && <div style={{position: 'absolute', left: 26, right: 26, top: 100 + sy * 390, height: 4, background: C.teal, boxShadow: `0 0 18px ${C.teal}`}} />}
      {ok && <div style={{position: 'absolute', left: 18, right: 18, bottom: 26, padding: '14px 16px', borderRadius: 16, background: 'rgba(15,15,20,.94)', border: `2px solid ${C.teal}`, ...pop(t, tOk)}}>
        <div style={{fontFamily: UI, fontSize: 15, color: C.teal, letterSpacing: 2}}>✓ UNLOCKED</div><div style={{fontFamily: HERO, fontSize: 28, color: '#fff'}}>VAULT RADIO</div></div>}
    </div>
  </div>;
};
const Glitch: React.FC<{t0: number; dur?: number}> = ({t0, dur = 0.42}) => {
  const t = useT(); if (t < t0 || t > t0 + dur) return null; const k = Math.floor((t - t0) * 40);
  return <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
    {Array.from({length: 9}, (_, i) => { const y = ((k * 37 + i * 131) % 1000) / 1000 * 1080; const h = 18 + ((k * 13 + i * 7) % 60); const dx = (((k + i) * 53) % 120) - 60;
      return <div key={i} style={{position: 'absolute', left: dx, top: y, width: 1920, height: h, background: i % 3 === 0 ? 'rgba(255,40,140,.5)' : i % 3 === 1 ? 'rgba(40,255,230,.4)' : 'rgba(255,255,255,.25)'}} />; })}
  </AbsoluteFill>;
};
const Money: React.FC<{t0: number; t1: number}> = ({t0, t1}) => {
  const t = useT(); if (t < t0 || t > t1) return null;
  return <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>{Array.from({length: 22}, (_, i) => {
    const sx = (i * 197) % 1920, sp = 380 + ((i * 71) % 260), y = -160 + (t - t0 - (i % 7) * 0.12) * sp; const r = (t - t0) * (60 + i * 13);
    return <div key={i} style={{position: 'absolute', left: sx + Math.sin(t * 2 + i) * 60, top: y, width: 150, height: 70, borderRadius: 6, background: 'linear-gradient(135deg,#7fcf8a,#3f8f52)', border: '3px solid #2b6a3a', transform: `rotate(${r}deg) rotateX(${r * 1.3}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HERO, fontSize: 34, color: '#1d4a28', opacity: ramp(t, t1 - 0.3, t1, 1, 0)}}>$</div>;
  })}</AbsoluteFill>;
};

/* geo views */
const UK = geo.uk as {n: string; d: string}[]; const FL = geo.fl as {n: string; d: string}[]; const FLX = geo.flx as {n: string; d: string}[];
const [bx, by] = geo.ukPins.Birmingham as number[]; const [mx, my] = geo.flPins.Miami as number[];

/* ------------------------------------------------------------------ the episode */
const Overlays: React.FC = () => {
  const t = useT();
  const hudVis = ramp(t, 17.3, 18.0) * ramp(t, OUTRO - 0.3, OUTRO, 1, 0);
  const logoDim = t >= 12.6 && t < 17.6 ? ramp(t, 12.6, 12.9) * ramp(t, 17.2, 17.6, 1, 0) : 0;
  const outroDim = ramp(t, OUTRO - 0.2, OUTRO + 0.4);
  const splatsT = [v2(33.7), v2(34.0), v2(34.25), v2(34.5)]; const wipeT = v2(37.2); const sc = wipeClear(t, wipeT);
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    {/* no grade on the gameplay: only a soft shadow behind the logo, and a light dim for the end screen */}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 1050px 420px at 50% 50%, rgba(8,2,16,.62), transparent 72%)', opacity: logoDim}} />
    <AbsoluteFill style={{background: 'rgba(10,4,18,.42)', opacity: outroDim}} />

    {/* ============ COLD OPEN ============ */}
    <Beat t0={0.05} t1={1.9} x={110} y={250} from="left" float={false}>
      <Small size={26} color="#fff" style={{marginBottom: 16}}>GTA V  →  GTA VI</Small>
      <Flip t0={0.15} from="2013" to="2026" size={150} step={0.09} />
      <div style={{marginTop: 26}}><ExitSign title="13 YEARS OF WAITING" size={50} arrow="" /></div>
    </Beat>
    <Beat t0={1.45} t1={4.3} x={1300} y={150} from="right" float={false}>
      <div style={{transform: 'rotate(-3deg)'}}><Barricade top="DELAYED" date="WAS: FALL 2025" t0={1.45} strike={2.0} /></div>
      <div style={{marginTop: 26, transform: 'rotate(2deg)'}}><Barricade top="DELAYED" date="WAS: MAY 26, 2026" t0={1.7} strike={2.25} /></div>
      <div style={{marginTop: 26, ...pop(t, 2.7)}}><Plate top="LEONIDA" main="DAY 4" bottom="OUT SINCE NOV 19, 2026" w={440} /></div>
    </Beat>
    <Beat t0={4.3} t1={8.75} x={470} y={120} float={false}>
      <div style={{width: 980, background: GREEN, borderRadius: 18, padding: 9, boxShadow: '0 26px 44px rgba(0,0,0,.55)'}}>
        <div style={{border: '4px solid #fff', borderRadius: 12, padding: '22px 30px'}}>
          <div style={{fontFamily: HERO, fontSize: 46, color: '#fff', marginBottom: 12}}>EXITS AHEAD THIS WEEK</div>
          {[['1', 'THE REVIEWS', 6.1], ['2', 'THE NUMBERS', 4.8], ['3', 'THE HYPE', 5.4], ['4', 'THE FIRST PATCH', 8.0], ['5', 'TROPHY WARNING', 6.8], ['6', '🔒  ???', 7.4]].map(([n, s, at], i) => {
            const hot = t >= (at as number); const lock = n === '6';
            return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '7px 0', opacity: ramp(t, 4.4 + i * 0.12, 4.6 + i * 0.12)}}>
              <div style={{width: 56, height: 44, borderRadius: 8, border: '3px solid #fff', background: hot && !lock ? '#fff' : 'transparent', color: hot && !lock ? GREEN : '#fff', fontFamily: HERO, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>
              <div style={{fontFamily: HERO, fontSize: 38, color: '#fff', opacity: hot || lock ? 1 : 0.55, whiteSpace: 'nowrap'}}>{s}</div>
              {n === '5' && hot && <div style={{marginLeft: 'auto', ...pop(t, 6.8)}}><Pill text="COULD RUIN YOUR PLATINUM" icon="⚠" v="warn" size={20} /></div>}
            </div>; })}
        </div></div>
    </Beat>
    <Beat t0={8.8} t1={12.55} x={1080} y={150} from="right" float={false}>
      <SatNav w={720} h={560} banner="NOW ENTERING LEONIDA" bannerSub="THIS WEEK · SHIFTED BIG TIME" eta="GTA VI · WEEK 1 RECAP">
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <MapSvg shapes={FL} dim={FLX} vb="150 110 920 860" w={700} h={560} draw={ramp(t, 8.9, 10.2, 0, 1, eio)} hl={(s) => (s.n === 'Florida' ? 'rgba(255,79,176,.45)' : undefined)}
            extra={<MapPin x={mx} y={my} t0={9.7} label="VICE CITY" sub="LEONIDA ≈ FLORIDA" side="l" scale={1.5} />} /></div>
      </SatNav>
    </Beat>
    <Beat t0={10.9} t1={12.55} x={150} y={420} float={false}><Stamp t0={10.9} text="SHIFTED BIG TIME" color={C.orange} size={84} /></Beat>
    {/* logo sting */}
    {t >= 12.7 && t < 17.5 && <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: ramp(t, 17.1, 17.5, 1, 0)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 44, transform: `scale(${interpolate((t - 12.72) * FPS, [0, 5, 9], [1.6, 0.96, 1], cl) + (t - 12.72) * 0.012})`, opacity: ramp(t, 12.72, 12.85)}}>
        <Emblem size={250} gear={t < 13.9 ? 0 : ramp(t, 13.9, 14.15, 0, 1, Easing.out(Easing.back(2)))} />
        <div><Wordmark size={150} />
          <div style={{marginTop: 22, fontFamily: UI, fontSize: 32, letterSpacing: 7, color: '#fff', opacity: ramp(t, 14.4, 14.7)}}>EVERYTHING THAT CHANGED THIS WEEK IN GTA 6</div>
          <div style={{marginTop: 22, display: 'flex', gap: 16, ...pop(t, 15.3)}}><Pill text="EPISODE 01" v="hot" size={26} /><Pill text="WEEK OF NOV 23, 2026" size={26} /></div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, background: `linear-gradient(100deg, transparent ${-30 + ramp(t, 12.72, 13.6, 0, 160)}%, rgba(255,255,255,.22) ${-20 + ramp(t, 12.72, 13.6, 0, 160)}%, transparent ${-10 + ramp(t, 12.72, 13.6, 0, 160)}%)`}} />
    </AbsoluteFill>}
    <Beat t0={17.0} t1={21.0} x={60} y={900} from="left"><Pill text="NEW SHIFT EVERY WEEK — SUBSCRIBE" icon="🔔" v="hot" size={24} /></Beat>

    {/* ============ EXIT 1 · THE REVIEWS ============ */}
    <Gantry t0={17.3} t1={19.45} exit="EXIT 1" title="THE REVIEWS" sub="CRITICS · METACRITIC · PLAYERS" />
    <Beat t0={19.6} t1={22.35} x={120} y={330} from="left"><Title size={124}>WORTH<br />THE WAIT?</Title>
      {t >= 21.4 && <div style={{marginTop: 30}}><Stamp t0={21.4} text="CRITICS: YES ✓" color={C.teal} size={70} /></div>}</Beat>
    <Beat t0={22.45} t1={24.75} x={1060} y={300} from="right"><div style={{display: 'flex', gap: 26}}>
      <Plate top="LEONIDA" main="NOV 18" bottom="REVIEWS GO LIVE" w={360} /><div style={pop(t, 24.2)}><Plate top="LEONIDA" main="NOV 19" bottom="LAUNCH DAY" w={360} /></div></div></Beat>
    <Beat t0={24.8} t1={28.25} x={160} y={170} from="up" road><div style={{display: 'flex', alignItems: 'flex-end', gap: 40}}>
      <ScoreSign top="METASCORE" big={t >= 26.8 ? '99' : '??'} bottom="PS5 · UNIVERSAL ACCLAIM" w={380} />
      <div style={{marginBottom: 30}}><Citation t0={27.6} lines={['METACRITIC · PS5', 'CRITIC SCORE · NOV 18, 2026']} /></div></div></Beat>
    <Beat t0={28.3} t1={33.25} x={330} y={170} float={false}><div style={{display: 'flex', alignItems: 'center', gap: 44}}>
      <ScoreSign top="GTA VI · 2026" big="99" bottom="METASCORE" w={360} />
      <div style={{fontFamily: HERO, fontSize: 150, color: '#fff', textShadow: `0 0 30px ${C.pink}`, ...pop(t, 28.9)}}>=</div>
      <div style={pop(t, 29.6)}><ScoreSign top="OCARINA OF TIME · 1998" big="99" bottom="METASCORE" w={360} /></div></div>
      <div style={{marginTop: 30, display: 'flex', justifyContent: 'center', ...pop(t, 31.0)}}><Pill text="TIED · HIGHEST METASCORE EVER" icon="🏆" v="hot" size={32} /></div></Beat>
    <Beat t0={33.6} t1={38.4} x={1040} y={330} from="right"><Small size={26} color="#fff" style={{marginBottom: 16}}>CRITIC REVIEWS · PS5 VERSION</Small>
      <Odometer t0={33.9} to={147} digits={3} size={120} dur={1.4} /><div style={{marginTop: 22, display: 'flex', gap: 14}}><div style={pop(t, 36.4)}><Pill text="PS5 VERSION" icon="🎮" size={24} /></div><div style={pop(t, 37.7)}><Pill text="METACRITIC" icon="📊" v="hot" size={24} /></div></div></Beat>
    <Beat t0={38.5} t1={43.6} x={110} y={200} from="left"><Small size={26} color="#fff" style={{marginBottom: 14}}>147 REVIEWS · EACH DOT = 1 CRITIC</Small><Waffle t0={38.6} />
      <div style={{display: 'flex', gap: 18, marginTop: 22}}><div style={pop(t, 39.0)}><Pill text="118 PERFECT SCORES" icon="●" v="warn" size={26} /></div><div style={pop(t, 40.7)}><Pill text="0 MIXED" size={26} /></div><div style={pop(t, 41.7)}><Pill text="0 NEGATIVE" size={26} /></div></div>
      <div style={{marginTop: 10}}><Citation t0={42.2} lines={['TECHPOWERUP REVIEW ROUNDUP', 'METACRITIC DATA · AT TIME OF WRITING']} w={520} /></div></Beat>
    <Beat t0={43.7} t1={49.25} x={150} y={640} float={false}><div style={{display: 'flex', gap: 40}}>
      <div style={pop(t, 43.7)}><Plate top="REVIEW" main="IGN 10/10" bottom="NOV 18, 2026" w={500} /></div>
      <div style={pop(t, 45.8)}><Plate top="REVIEW" main="GR+ ★★★★★" bottom="GAMESRADAR+" w={500} /></div>
      <div style={pop(t, 47.1)}><Plate top="REVIEW" main="EG ★★★★★" bottom="EUROGAMER" w={500} /></div></div></Beat>
    <Beat t0={49.3} t1={58.4} x={1000} y={210} from="right">
      <Mirror label="IN THE REAR-VIEW · ROCKSTAR METASCORES" w={800}>
        {[['GTA IV · 2008', 98, 50.2], ['GTA V · 2013', 97, 51.3], ['GTA VI · 2026', 99, 55.4]].map(([l, v, at], i) => <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, margin: '12px 0', ...pop(t, at as number)}}>
          <div style={{width: 250, fontFamily: UI, fontSize: 26, color: '#fff', letterSpacing: 1.5}}>{l}</div>
          <div style={{flex: 1, height: 34, borderRadius: 17, background: 'rgba(255,255,255,.1)', overflow: 'hidden'}}><div style={{height: '100%', width: `${((v as number) - 90) * 10 * ramp(t, at as number, (at as number) + 0.8, 0, 1, eo)}%`, background: i === 2 ? GRAD : 'linear-gradient(90deg,#6a7bd8,#9aa8ff)', borderRadius: 17}} /></div>
          <div style={{width: 80, fontFamily: HERO, fontSize: 42, color: i === 2 ? C.orange : '#fff'}}>{v}</div></div>)}
      </Mirror>
      {t >= 56.3 && <div style={{marginTop: 26, ...pop(t, 56.3)}}><Pill text="ROCKSTAR'S BEST-REVIEWED GAME EVER" icon="🏆" v="hot" size={28} /></div>}</Beat>
    <Glitch t0={58.5} />
    <Beat t0={59.4} t1={66.2} x={300} y={190} float={false}><div style={{display: 'flex', alignItems: 'center', gap: 70}}>
      <ScoreSign top="CRITICS" big="99" bottom="METASCORE" w={360} />
      <div style={{fontFamily: HERO, fontSize: 90, color: '#fff'}}>VS</div>
      <div style={pop(t, 61.6)}><ScoreSign top="PLAYERS" big={t >= 64.9 ? '▼' : '?'} bottom={t >= 64.9 ? 'NOTICEABLY LOWER' : 'USER SCORE'} w={360} ink={t >= 64.9 ? '#c8102e' : '#111'} /></div></div>
      {t >= 62.6 && <div style={{marginTop: 28, display: 'flex', justifyContent: 'center', ...pop(t, 62.6)}}><Pill text="A VERY DIFFERENT STORY" icon="⚠" v="warn" size={30} /></div>}</Beat>
    <Beat t0={66.3} t1={69.0} x={470} y={230} float={false}><Fork t0={66.5} a="REVIEW BOMBING?" b="REAL COMPLAINTS?" tb={68.2} /></Beat>
    <Beat t0={69.1} t1={71.9} x={140} y={360} from="left"><Pill text="TELL ME IN THE COMMENTS" icon="💬" v="hot" size={44} />
      {t >= 70.4 && <div style={{marginTop: 22, ...pop(t, 70.4)}}><Pill text="DEEP DIVE IN A FUTURE EPISODE" icon="🔒" size={28} /></div>}</Beat>
    <NextExit t0={68.6} t1={71.9} label="THE NUMBERS" />

    {/* ============ EXIT 2 · THE NUMBERS ============ */}
    <Gantry t0={72.3} t1={74.6} exit="EXIT 2" title="THE NUMBERS" sub="SALES · CONSOLES · HOLLYWOOD" />
    <Beat t0={74.8} t1={92.8} x={110} y={140} from="left">
      <PriceBoard title="GTA VI · LAUNCH NUMBERS" w={820} rows={[
        {label: 'REVENUE BY\nLAUNCH DAY', at: 76.8, node: <Led>{t >= 76.8 ? <Count t0={76.8} to={1.84e9} fmt={(v) => (v >= 1e9 ? `$${(v / 1e9).toFixed(2)}B` : `$${Math.round(v / 1e6)}M`)} size={86} color="#FFB000" /> : '$-.--B'}</Led>},
        {label: 'COPIES SOLD\n(APPROX.)', at: 79.6, node: <Led color="#FFD24A">{t >= 79.6 ? <Count t0={79.6} to={19} dur={0.8} fmt={(v) => `${Math.round(v)}M`} size={86} color="#FFD24A" /> : '--M'}</Led>},
        ...(t >= 84.9 ? [{label: 'GTA V · DAY ONE\n(2013)', at: 84.9, node: <Led color="#9fb4ff">$800M</Led>, dim: true}] : []),
        ...(t >= 90.7 ? [{label: 'GTA V · TIME\nTO CROSS $1B', at: 90.7, node: <Led color="#9fb4ff">3 DAYS</Led>, dim: true}] : []),
      ]} />
      <div style={{marginTop: 16}}><Citation t0={78.3} lines={['FORBES · SENSOR TOWER ESTIMATE', 'REPORTED NOV 19, 2026 · NOT OFFICIAL']} /></div>
    </Beat>
    <Beat t0={83.6} t1={89.2} x={1010} y={420} float={false}><Stamp t0={83.6} text="MORE THAN 2× GTA V" color={C.orange} size={72} rot={5} /></Beat>
    <Beat t0={93.0} t1={102.6} x={1010} y={130} from="right" road>
      <Billboard w={820} h={430}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#2a0f3e,#120a20)', padding: '26px 34px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}><div style={{fontSize: 54}}>🎬</div><Big size={fit('HOLLYWOOD VS GTA VI', HERO, 50, 560)} style={{whiteSpace: 'nowrap'}}>HOLLYWOOD <span style={{color: C.orange}}>VS</span> GTA VI</Big><div style={{fontSize: 54}}>🎮</div></div>
          <Small size={22} color={C.mute} style={{marginTop: 6}}>2026 · BIGGEST EARNERS SO FAR</Small>
          {[['#1', '🎬', 'SPIDER-MAN: BRAND NEW DAY', '$2.5B', 'BOX OFFICE', 97.8], ['#2', '🎮', 'GRAND THEFT AUTO VI', '$1.84B', 'BY LAUNCH DAY (EST.)', 99.4]].map(([r, ic, n, v, s, at], i) =>
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 26, ...pop(t, at as number)}}>
              <div style={{fontFamily: HERO, fontSize: 50, color: i ? C.orange : '#fff', width: 80}}>{r}</div><div style={{fontSize: 50}}>{ic}</div>
              <div style={{flex: 1, minWidth: 0}}><div style={{fontFamily: HERO, fontSize: fit(n as string, HERO, 34, 330), color: '#fff', whiteSpace: 'nowrap'}}>{n}</div><Small size={18}>{s}</Small></div>
              <div style={{width: 170, textAlign: 'right', fontFamily: HERO, fontSize: 52, color: i ? C.orange : '#fff', whiteSpace: 'nowrap'}}>{v}</div></div>)}
        </div>
      </Billboard>
      <div style={{marginTop: -110, marginLeft: 470}}><Citation t0={95.2} lines={['FORBES', 'ONLY ONE 2026 MOVIE HAS MADE MORE']} w={420} rot={3} /></div>
    </Beat>
    <Beat t0={102.7} t1={112.1} x={230} y={170} float={false}>
      <Small size={28} color="#fff" style={{marginBottom: 20, textAlign: 'center', width: 1460}}>WHO WON LAUNCH WEEK? · SHARE OF SALES</Small>
      <div style={{display: 'flex', alignItems: 'center', gap: 60}}>
        <Gauge t0={105.9} value={75} max={100} label="PLAYSTATION" big={t >= 105.9 ? '75%' : '—'} endLabels={['E', 'F']} size={420} col="#4e8cff" />
        <div style={{...pop(t, 103.2)}}>
          <div style={{width: 300, borderRadius: 18, overflow: 'hidden', border: '3px solid rgba(255,255,255,.8)', boxShadow: '0 24px 50px rgba(0,0,0,.6)'}}>
            <div style={{width: 300, height: 360, background: 'radial-gradient(circle at 50% 45%, #3a3346, #120b1c)'}}><Img src={staticFile('ls/img/ps5.jpg')} style={{width: 300, height: 360, objectFit: 'contain', display: 'block'}} /></div>
            <div style={{padding: '7px 10px', background: '#120b1c', fontFamily: UI, fontSize: 12, color: C.mute, letterSpacing: 1}}>📷 OSH33M · CC BY-SA 4.0 · WIKIMEDIA COMMONS</div></div></div>
        <Gauge t0={110.0} value={25} max={100} label="XBOX" big={t >= 110.0 ? '25%' : '—'} endLabels={['E', 'F']} size={420} col="#3ec46d" />
      </div>
      <div style={{marginTop: 16, display: 'flex', justifyContent: 'center'}}><Citation t0={108.2} lines={['ANALYST ESTIMATES', 'VIA ONEINDIA · LAUNCH WEEK']} w={420} rot={0} /></div>
    </Beat>
    <Beat t0={112.2} t1={116.6} x={150} y={220} from="left" float={false} road><Warn t0={112.2} lines={['ANALYST', 'ESTIMATES', 'NOT OFFICIAL']} size={480} /></Beat>
    <Beat t0={116.7} t1={125.7} x={1120} y={170} from="right">
      <div style={pop(t, 117.0)}><Pill text="HUGE PRE-ORDERS" icon="📦" size={30} /></div>
      <div style={{marginTop: 18, ...pop(t, 120.2)}}><Pill text="MORE SALES LANDED ON DAY ONE?" icon="📅" size={30} /></div>
      <div style={{marginTop: 26, ...pop(t, 124.3)}}><Warn t0={124.3} lines={['SALES MAY', 'SLOW', 'AHEAD']} size={420} /></div></Beat>
    <Beat t0={125.8} t1={128.5} x={130} y={300} from="left" road><ExitSign exit="NEXT REPORT" title="OFFICIAL NUMBERS" sub="WATCH TAKE-TWO'S NEXT EARNINGS" size={64} /></Beat>
    <NextExit t0={125.2} t1={128.5} label="THE HYPE" />

    {/* ============ EXIT 3 · THE HYPE ============ */}
    <Gantry t0={128.9} t1={131.2} exit="EXIT 3" title="THE HYPE" sub="PLAYING · WATCHING · SKIPPING SCHOOL" />
    <Beat t0={131.4} t1={139.2} x={120} y={300} from="left"><Small size={28} color="#fff" style={{marginBottom: 18}}>HOURS WATCHED · FIRST 24 HOURS</Small>
      <Odometer t0={132.8} to={125.47} dec={2} digits={5} size={112} dur={2.2} suffix="M HRS" />
      <div style={{marginTop: 20, display: 'flex', gap: 14}}><div style={pop(t, 136.5)}><Pill text="TWITCH · YOUTUBE · KICK" icon="📡" size={24} /></div><div style={pop(t, 138.2)}><Pill text="FIRST 24 HRS" icon="⏱" v="hot" size={24} /></div></div>
      <div style={{marginTop: 16}}><Citation t0={131.8} lines={['STREAMS CHARTS', 'VIA INVEN GLOBAL · TWITCH + YOUTUBE + KICK']} /></div></Beat>
    <Beat t0={139.3} t1={145.4} x={1060} y={150} from="right">
      <Gauge t0={139.9} value={7.91} max={10} label="PEAK CONCURRENT VIEWERS" big={t >= 139.9 ? '7.91M' : '—'} size={460} col={C.red} />
      <div style={{marginTop: 20, width: 620}}>{[['TWITCH', 3.31], ['YOUTUBE', 3.22], ['KICK', 1.5]].map(([n, v], i) => <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, margin: '8px 0', ...pop(t, 141.6 + i * 0.25)}}>
        <div style={{width: 140, fontFamily: UI, fontSize: 22, color: '#fff', letterSpacing: 2}}>{n}</div>
        <div style={{flex: 1, height: 24, borderRadius: 12, background: 'rgba(255,255,255,.12)'}}><div style={{width: `${((v as number) / 3.4) * 100 * ramp(t, 141.6 + i * 0.25, 142.4 + i * 0.25)}%`, height: '100%', borderRadius: 12, background: GRAD}} /></div>
        <div style={{width: 90, fontFamily: HERO, fontSize: 28, color: '#fff'}}>{v}M</div></div>)}</div>
      <div style={{marginTop: 8, ...pop(t, 142.7)}}><Pill text="ALMOST 8 MILLION AT THE SAME MOMENT" icon="🔴" size={22} /></div></Beat>
    <Beat t0={145.4} t1={148.9} x={180} y={170} from="up" road><Billboard w={760} h={330}>
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#3b0f40,#0f0a20)'}}>
        <div style={{fontSize: 90}}>📺</div><Big size={60} style={{textAlign: 'center'}}>BIGGER THAN A LOT<br />OF TV EVENTS</Big></div></Billboard>
      {t >= 147.9 && <div style={{marginTop: -60, marginLeft: 380}}><Stamp t0={147.9} text="→ REAL LIFE" color={C.teal} size={60} rot={-4} /></div>}</Beat>
    <Beat t0={149.2} t1={157.6} x={1080} y={110} from="right">
      <SatNav w={720} h={600} banner="ARRIVING · BIRMINGHAM, UK" bannerSub="NINESTILES ACADEMY · ACOCKS GREEN" eta="≈ 4,340 MI FROM VICE CITY">
        <svg viewBox={`${bx - 430} ${by - 330} 860 720`} width={720} height={600} style={{position: 'absolute', inset: 0}}>
          {UK.map((s, i) => <path key={i} d={s.d} fill={s.n === 'United Kingdom' ? 'rgba(255,79,176,.22)' : 'rgba(139,92,255,.12)'} stroke="#ffb8e4" strokeWidth={1.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ramp(t, 149.3, 150.6, 0, 1, eio)} />)}
          <path d={`M${bx - 520} ${by + 260} Q ${bx - 260} ${by + 40} ${bx} ${by}`} fill="none" stroke={C.teal} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ramp(t, 149.6, 150.8, 0, 1, eio)} style={{filter: `drop-shadow(0 0 6px ${C.teal})`}} />
          <MapPin x={bx} y={by} t0={150.6} label="BIRMINGHAM" sub="WEST MIDLANDS" side="r" scale={1.2} />
        </svg>
      </SatNav></Beat>
    <Beat t0={150.4} t1={155.6} x={110} y={200} from="left"><QuoteCard outlet="ITV NEWS · CENTRAL" date="19 NOV 2026" w={800}>
      Birmingham school uses a <Hi t0={152.6}>minibus</Hi> to pick up students who miss class after GTA 6 release</QuoteCard>
      <div style={{marginTop: 12}}><Citation t0={151.4} lines={['ITV NEWS CENTRAL · ALSO LBC', 'SCHOOL: NINESTILES, AN ACADEMY']} /></div></Beat>
    <Beat t0={155.7} t1={162.0} x={110} y={210} from="left"><BlueSign title="NINESTILES · LAUNCH WEEK" w={840} rows={[
      {icon: '🚐', text: 'MINIBUS PICK-UPS', at: 155.9}, {icon: '📝', text: 'MOCK EXAMS MOVED INTO LAUNCH WEEK', at: 156.8}, {icon: '🎟️', text: 'PRIZE DRAW · 100% ATTENDANCE', at: 159.1}]} /></Beat>
    <Tape t0={163.8} t1={166.3} text="SCHOOL ZONE · DO NOT SKIP" y={250} rot={-5} />
    <Tape t0={164.4} t1={166.3} text="COUNTER-OPERATIONS IN PROGRESS" y={720} rot={4} color="#ff4fb0" />
    <Beat t0={162.1} t1={166.4} x={620} y={440} float={false}><Stamp t0={164.8} text="COUNTER-OPERATIONS" color="#fff" size={76} rot={-3} /></Beat>

    {/* ============ EXIT 4 · THE FIRST PATCH ============ */}
    <Gantry t0={v2(0)} t1={v2(3.5)} exit="EXIT 4" title="THE FIRST PATCH" sub="STILL AHEAD · MISSABLE TROPHY + SECRET STATION" />
    <Beat t0={v2(3.7)} t1={v2(12.6)} x={130} y={110} from="up" float={false}>
      <Receipt t0={v2(3.8)} hl={[v2(7.8), v2(13.4), v2(16.6), v2(21.6)]} title="UPDATE 01.002.002" rows={[['DATED', 'NOV 23, 2026'], ['PS5', '≈ 604 MB'], ['XBOX SERIES X|S', '≈ 1.2–1.6 GB'], ['ROLLOUT', 'STAGGERED']]} foot="SIZES VIA DATAMINERS · PLAYSTATION GAME SIZE / TEX2" />
    </Beat>
    <Beat t0={v2(12.8)} t1={v2(21.2)} x={510} y={300} from="right"><div style={{width: 900, padding: '30px 36px', borderRadius: 22, background: 'rgba(10,8,16,.88)', border: '2px solid rgba(255,255,255,.2)', boxShadow: '0 30px 60px rgba(0,0,0,.6)'}}>
      <Small size={24} color="#fff" style={{marginBottom: 18}}>⬇ DOWNLOAD SIZE BY PLATFORM</Small>
      {[['PS5', 604, '≈ 604 MB', v2(13.4), '#4e8cff'], ['XBOX SERIES X|S', 1600, '≈ 1.2–1.6 GB', v2(16.4), '#3ec46d']].map(([n, v, s, at, col], i) => {
        const p = ramp(t, at as number, (at as number) + 1.2, 0, 1, eo);
        return <div key={i} style={{margin: '16px 0', ...pop(t, at as number)}}><div style={{display: 'flex', justifyContent: 'space-between', fontFamily: UI, fontSize: 26, color: '#fff', letterSpacing: 2}}><span>{n}</span><span style={{fontFamily: HERO, fontSize: 34}}>{s}</span></div>
          <div style={{marginTop: 8, height: 30, borderRadius: 15, background: 'rgba(255,255,255,.1)', overflow: 'hidden'}}><div style={{width: `${((v as number) / 1600) * 100 * p}%`, height: '100%', background: `repeating-linear-gradient(-45deg, ${col}, ${col} 14px, ${col}cc 14px, ${col}cc 28px)`, backgroundPosition: `${t * 80}px 0`}} /></div></div>; })}
    </div></Beat>
    <Beat t0={v2(21.3)} t1={v2(27.4)} x={500} y={170} float={false}><Departures t0={v2(21.6)} title="ROLLOUT · 01.002.002" rows={[['PHASE 1', '33% OF PLAYERS', 'GREEN'], ['PHASE 2', '66% · +3 HRS', 'AMBER'], ['PHASE 3', 'EVERYONE · ≤6 HRS', 'AMBER']]} />
      <div style={{marginTop: 24, display: 'flex', justifyContent: 'center', ...pop(t, v2(25.4))}}><Pill text="NOT GOT IT YET? DON'T PANIC — IT'S ON THE WAY" icon="⏳" v="teal" size={28} /></div></Beat>
    <Beat t0={v2(27.5)} t1={v2(33.4)} x={1000} y={170} from="right"><div style={{width: 800, borderRadius: 18, overflow: 'hidden', background: '#0f0a18', border: '2px solid rgba(255,205,236,.9)', boxShadow: '0 30px 60px rgba(0,0,0,.6)'}}>
      <div style={{height: 50, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', background: '#1b1228'}}>{['#ff5f57', '#febc2e', '#28c840'].map((c) => <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />)}
        <div style={{marginLeft: 16, flex: 1, height: 30, borderRadius: 15, background: 'rgba(255,255,255,.08)', fontFamily: UI, fontSize: 17, color: 'rgba(255,255,255,.8)', display: 'flex', alignItems: 'center', padding: '0 16px'}}>🔒 support.rockstargames.com · GTA VI updates</div></div>
      <div style={{padding: '28px 34px'}}><Small size={22}>PATCH NOTES · 01.002.002</Small>
        <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14}}>{[0, 1, 2].map((i) => <div key={i} style={{height: 20, width: `${90 - i * 18}%`, borderRadius: 10, background: 'rgba(255,255,255,.08)'}} />)}</div>
        <div style={{marginTop: 24, ...pop(t, v2(29.6))}}><Stamp t0={v2(29.6)} text="NO FULL NOTES (AT RECORDING)" color={C.red} size={40} rot={-2} /></div></div></div>
      <div style={{marginTop: 22, ...pop(t, v2(31.6))}}><div style={{width: 800, padding: '18px 24px', borderRadius: 16, background: 'linear-gradient(100deg,#ffd23f,#ffb020)', boxShadow: '0 20px 40px rgba(0,0,0,.5)', transform: 'rotate(-1.5deg)'}}>
        <div style={{fontFamily: HERO, fontSize: 30, color: '#1a1206'}}>⚡ SINCE RECORDING: NOTES NOW POSTED</div>
        <div style={{fontFamily: UI, fontSize: 20, color: '#3a2a0a', letterSpacing: 1.5, marginTop: 6}}>CRASH FIXES · AUTOSAVE · PHONE CALLS · WANTED LEVEL · VIA ROCKSTARINTEL / PSLS</div></div></div></Beat>
    {/* windshield bugs → wiper */}
    {t >= splatsT[0] && t < wipeT + 1 && <AbsoluteFill style={{opacity: sc, pointerEvents: 'none'}}>
      <Splat x={420} y={310} t0={splatsT[0]} s={0.95} seed={1} /><Splat x={1480} y={260} t0={splatsT[1]} s={0.8} seed={3} /><Splat x={1250} y={760} t0={splatsT[2]} s={1.1} seed={5} /><Splat x={600} y={790} t0={splatsT[3]} s={0.75} seed={7} /><Splat x={980} y={200} t0={splatsT[3] + 0.15} s={0.7} seed={9} />
    </AbsoluteFill>}
    <Beat t0={v2(33.8)} t1={v2(37.0)} x={720} y={430} float={false} road><Warn t0={v2(33.8)} lines={['RANDOM', 'BUGS', 'AHEAD']} size={380} /></Beat>
    <Wiper t0={wipeT} />
    <Beat t0={v2(37.6)} t1={v2(43.0)} x={130} y={230} from="left"><Pill text="PROGRESSION BUG FIXED" icon="✓" v="teal" size={46} />
      <div style={{marginTop: 18, ...pop(t, v2(39.4))}}><Pill text="PS5 + XBOX SERIES X|S" size={30} /></div>
      <div style={{marginTop: 18}}><Citation t0={v2(38.0)} lines={['EUROGAMER (AS REPORTED)', 'PROGRESSION BUG FIX · PS5 / XBOX SERIES X|S']} /></div></Beat>
    <Money t0={v2(45.4)} t1={v2(47.6)} />
    <Beat t0={v2(43.1)} t1={v2(47.3)} x={1180} y={160} from="right" road><ScoreSign top="MONEY GLITCH" big="$$$" bottom="STILL WORKS? · PLAYER REPORTS" w={420} /></Beat>
    <Beat t0={v2(47.4)} t1={v2(52.95)} x={130} y={250} from="left">
      <div style={pop(t, v2(48.3))}><Pill text="SMOOTHER GAMEPLAY?" icon="📈" size={40} /></div>
      <div style={{marginTop: 20, ...pop(t, v2(49.6))}}><Pill text="BETTER VISUALS?" icon="✨" size={40} /></div>
      <div style={{marginTop: 30, ...pop(t, v2(51.6))}}><Warn t0={v2(51.6)} lines={['PLACEBO', 'EFFECT?']} size={360} /></div></Beat>
    <Beat t0={v2(53.0)} t1={v2(58.0)} x={1300} y={120} from="right" road><Meter t0={v2(53.3)} dur={3.0} w={280} />
      {t >= v2(57.0) && <div style={{marginTop: -170, marginLeft: -340, ...pop(t, v2(57.0))}}><Pill text="USE IT WHILE YOU CAN" icon="⏱" v="hot" size={30} /></div>}</Beat>
    <NextExit t0={v2(54.6)} t1={v2(58.0)} label="TROPHY WARNING" />

    {/* ============ EXIT 5 · TROPHY WARNING ============ */}
    <Gantry t0={v2(58.4)} t1={v2(61.5)} exit="EXIT 5" title="TROPHY WARNING" sub="⚠ THIS ONE COULD RUIN YOUR PLATINUM" />
    <Beat t0={v2(62.4)} t1={v2(70.0)} x={150} y={170} from="left"><Gauge t0={v2(64.7)} value={4} max={10} label="ESTIMATED TROPHY DIFFICULTY" big={t >= v2(64.7) ? '4/10' : '—'} size={460} col={C.teal} /></Beat>
    <Beat t0={v2(65.8)} t1={v2(70.0)} x={760} y={250} from="up"><Small size={26} color="#fff" style={{marginBottom: 16}}>HOURS TO PLATINUM</Small><Odometer t0={v2(66.4)} to={200} digits={3} size={120} dur={1.3} suffix="HRS" /></Beat>
    <Beat t0={v2(68.3)} t1={v2(70.9)} x={1360} y={190} from="right" float={false} road><Warn t0={v2(69.3)} lines={['1 MISSABLE', 'TROPHY', 'AHEAD']} size={420} /></Beat>
    <Beat t0={v2(66.0)} t1={v2(70.9)} x={760} y={500} float={false}><Citation t0={v2(66.6)} lines={['POWERPYX TROPHY ROADMAP', '4/10 · ~200 HRS · POTENTIALLY 1 MISSABLE']} w={520} /></Beat>
    <Beat t0={v2(71.0)} t1={v2(77.2)} x={510} y={250} from="up"><Trophy t0={v2(71.0)} />
      {t >= v2(73.4) && <div style={{marginTop: 26, display: 'flex', justifyContent: 'center', ...pop(t, v2(73.4))}}><Pill text="THE FIRST MEDITATION IS MISSABLE · CHAPTER 1" icon="⚠" v="red" size={30} /></div>}
      {t >= v2(76.5) && <div style={{marginTop: 18, display: 'flex', justifyContent: 'center', ...pop(t, v2(76.5))}}><Pill text="HERE'S HOW TO GET IT" icon="↓" v="teal" size={30} /></div>}</Beat>
    <Beat t0={v2(78.4)} t1={v2(85.3)} x={350} y={200} float={false}><Route18 t0={v2(79.6)} hl={v2(82.6)} /></Beat>
    <Beat t0={v2(85.3)} t1={v2(90.4)} x={140} y={180} from="left"><div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
      {[['1', 'FINISH MISSION "DOWN TO EARTH"', v2(85.4)], ['2', 'LUCIA OFFERS A MEDITATION TUTORIAL', v2(87.4)], ['3', 'MEDITATE WITH HER ON THE BALCONY', v2(89.6)]].map(([n, s, at], i) =>
        <div key={i} style={pop(t, at as number)}><ExitSign exit={`STEP ${n}`} title={s as string} size={58} arrow={i < 2 ? '↓' : '✓'} /></div>)}</div></Beat>
    <Beat t0={v2(90.5)} t1={v2(94.2)} x={490} y={600} from="up"><Prompt tYes={v2(92.4)} tSkip={v2(93.4)} /></Beat>
    <Beat t0={v2(94.3)} t1={v2(99.1)} x={1220} y={170} from="right" float={false} road><Warn t0={v2(95.5)} lines={['LOCKOUT', 'NOT', 'CONFIRMED']} size={440} /></Beat>
    <Beat t0={v2(99.2)} t1={v2(102.9)} x={330} y={300} float={false}><div style={{display: 'flex', alignItems: 'center', gap: 40}}>
      <ScoreSign top="AT RISK" big="200" bottom="HOURS · A PLATINUM" w={360} /><div style={{fontFamily: HERO, fontSize: 90, color: '#fff'}}>VS</div>
      <div style={pop(t, v2(101.3))}><ScoreSign top="THE FIX" big="1" bottom="MEDITATION" w={360} ink="#0a7a4f" /></div></div>
      {t >= v2(101.7) && <div style={{marginTop: 26, marginLeft: 300}}><Stamp t0={v2(101.7)} text="JUST MEDITATE 🧘" color={C.teal} size={64} /></div>}</Beat>
    <Beat t0={v2(103.0)} t1={v2(110.0)} x={180} y={200} from="left"><div style={{display: 'flex', alignItems: 'center', gap: 50}}>
      <NoSign word="CHEATS" size={340} />
      <div style={pop(t, v2(105.4))}><Big size={66} style={{textShadow: '0 4px 18px rgba(0,0,0,.85)'}}>CHEATS ON =<br /><span style={{color: '#ff5470'}}>NO TROPHIES</span></Big>
        {t >= v2(108.6) && <div style={{marginTop: 22, fontFamily: UI, fontSize: 34, color: C.teal, letterSpacing: 3, ...pop(t, v2(108.6))}}>&gt; TYPING CODE{'_'.repeat(1 + (Math.floor(t * 4) % 3))}</div>}</div></div></Beat>
    <NextExit t0={v2(106.6)} t1={v2(110.0)} label="SECRET STATION" />

    {/* ============ EXIT 6 · SECRET STATION ============ */}
    <Gantry t0={v2(110.4)} t1={v2(113.3)} exit="EXIT 6" title="SECRET STATION" sub="MOST PLAYERS HAVEN'T FOUND IT YET" />
    <Beat t0={v2(113.3)} t1={v2(115.7)} x={550} y={360} from="up"><Stereo line1={t < v2(114.0) ? 'SCANNING…' : '??? · HIDDEN'} line2={t < v2(114.0) ? `${(88 + ((t * 7) % 20)).toFixed(1)} MHZ` : 'NOT ON THE DIAL'} freq={(88 + ((t * 7) % 20)).toFixed(1)} /></Beat>
    <Beat t0={v2(115.7)} t1={v2(119.9)} x={1080} y={120} from="right">
      <SatNav w={720} h={560} banner="THE VAULT · DOWNTOWN VICE CITY" bannerSub="IN-GAME · VICE CITY ≈ MIAMI" eta="DESTINATION: NIGHTCLUB">
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <MapSvg shapes={FL} dim={FLX} vb={`${mx - 420} ${my - 330} 760 600`} w={700} h={560} draw={ramp(t, v2(115.8), v2(116.8), 0, 1, eio)} hl={(s) => (s.n === 'Florida' ? 'rgba(255,79,176,.35)' : undefined)}
            extra={<MapPin x={mx} y={my} t0={v2(116.5)} label="THE VAULT" sub="VICE CITY · DOWNTOWN" side="l" scale={1.3} />} /></div>
      </SatNav></Beat>
    <Beat t0={v2(118.0)} t1={v2(123.0)} x={150} y={150} from="left"><div style={{display: 'flex', alignItems: 'flex-end', gap: 50}}>
      <div style={{transform: 'rotate(-3deg)'}}><Poster w={360} /><Small size={14} style={{marginTop: 10}}>ILLUSTRATION · "GAS MASK" POSTER INSIDE THE CLUB</Small></div>
      {t >= v2(119.8) && <div style={pop(t, v2(119.8))}><Phone t0={v2(119.8)} tOk={v2(121.2)} /></div>}</div></Beat>
    <Beat t0={v2(122.0)} t1={v2(126.0)} x={1000} y={720} from="right"><Stereo line1="VAULT RADIO" line2="UNLOCKED · ELECTRONIC / RAVE" freq="HIDDEN" lit={6} w={820} /></Beat>
    <Beat t0={v2(123.3)} t1={v2(126.0)} x={960} y={300} from="up"><Pill text="ON TOP OF A MASSIVE SOUNDTRACK" icon="📻" v="hot" size={32} /></Beat>
    <Beat t0={v2(126.2)} t1={OUTRO - 0.1} x={260} y={220} from="up">
      <QuoteCard outlet="ROCKSTAR GAMES · VIA GAMESRADAR+" date="OCT 2026" w={900}>For the first time in <Hi t0={v2(127.6)}>Grand Theft Auto history</Hi> — there are also in-game podcasts 🎙</QuoteCard>
      {t >= v2(130.6) && <div style={{marginTop: 22, ...pop(t, v2(130.6))}}><Stereo line1="PODCASTS · ON DEMAND" line2="IN THE CAR OR ON FOOT" freq="POD" lit={1} w={900} /></div>}</Beat>

    {/* ============ OUTRO / END SCREEN ============ */}
    {t >= OUTRO && <AbsoluteFill>
      <div style={{position: 'absolute', left: 110, top: 150, ...pop(t, OUTRO + 0.1)}}><div style={{display: 'flex', alignItems: 'center', gap: 26}}><Emblem size={120} gear={ramp(t, OUTRO + 0.3, OUTRO + 0.8, 0, 5, eio)} /><Wordmark size={84} /></div></div>
      <div style={{position: 'absolute', left: 110, top: 330, ...pop(t, OUTRO + 0.5)}}><Title size={92}>THAT'S THIS<br />WEEK'S SHIFT</Title></div>
      <div style={{position: 'absolute', left: 110, top: 600, ...pop(t, OUTRO + 1.0)}}><Pill text="WHICH SHIFT SURPRISED YOU? COMMENT BELOW" icon="💬" size={28} /></div>
      <div style={{position: 'absolute', left: 110, top: 700, display: 'flex', alignItems: 'center', gap: 24, ...pop(t, OUTRO + 1.4)}}>
        <div style={{padding: '18px 40px', borderRadius: 14, background: t >= OUTRO + 2.6 ? '#2a2a30' : '#e01b2c', fontFamily: HERO, fontSize: 38, color: '#fff', transform: `scale(${t >= OUTRO + 2.5 && t < OUTRO + 2.7 ? 0.94 : 1})`}}>{t >= OUTRO + 2.6 ? 'SUBSCRIBED ✓' : 'SUBSCRIBE'}</div>
        <div style={{fontSize: 52, transform: `rotate(${t >= OUTRO + 3.0 ? Math.sin((t - OUTRO - 3) * 18) * 14 * Math.exp(-(t - OUTRO - 3) * 2) : 0}deg)`}}>🔔</div>
        <Small size={22} color="#fff">NEW EPISODE EVERY WEEK</Small></div>
      {t >= OUTRO + 1.6 && t < OUTRO + 3.0 && <div style={{position: 'absolute', left: 110 + ramp(t, OUTRO + 1.6, OUTRO + 2.4, 520, 150, eio), top: 700 + ramp(t, OUTRO + 1.6, OUTRO + 2.4, 260, 46, eio), fontSize: 56}}>👆</div>}
      {[0, 1].map((i) => <div key={i} style={{position: 'absolute', left: 1100, top: 170 + i * 380, width: 700, height: 340, borderRadius: 20, border: `4px dashed ${i ? C.orange : C.pink}`, background: 'rgba(10,6,18,.35)', opacity: ramp(t, OUTRO + 0.8 + i * 0.3, OUTRO + 1.2 + i * 0.3),
        display: 'flex', alignItems: 'flex-end', padding: 20, boxSizing: 'border-box'}}><Small size={22} color="#fff">{i ? 'MORE GTA VI ▸' : 'NEXT SHIFT ▸'}</Small></div>)}
    </AbsoluteFill>}

    {/* persistent brand bug + HUD */}
    <div style={{position: 'absolute', left: 40, top: 34, display: 'flex', alignItems: 'center', gap: 14, opacity: hudVis * 0.95}}><Emblem size={58} gear={Math.max(0, CHAPTERS.filter((c) => t >= c.t).length - 1)} />
      <div style={{fontFamily: HERO, fontSize: 30, color: '#fff', letterSpacing: -0.5, textShadow: '0 2px 10px rgba(0,0,0,.7)'}}>LEONIDA <span style={{background: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>SHIFTS</span></div></div>
    <HUD chapters={CHAPTERS} end={OUTRO} vis={hudVis} />

    {/* ============ AUDIO: VO + SFX (music is mixed with ducking after render) ============ */}
    <SV at={0.05} n="ls/sfx/swish" v={0.35} />{[0.2, 0.35, 0.5, 0.65, 0.8, 0.95, 1.1].map((a) => <SV key={a} at={a} n="ls/sfx/flap" v={0.25} />)}
    <SV at={1.45} n="pw/impact" v={0.3} /><SV at={2.0} n="ls/sfx/click" v={0.4} /><SV at={2.25} n="ls/sfx/click" v={0.4} /><SV at={2.7} n="pw/pop" v={0.3} />
    <SV at={4.3} n="ls/sfx/swish" v={0.3} />{[4.8, 6.1, 8.0].map((a) => <SV key={a} at={a} n="ls/sfx/blip" v={0.3} />)}<SV at={6.8} n="fb3/beep" v={0.15} />
    <SV at={8.8} n="ls/sfx/swish" v={0.3} /><SV at={9.7} n="ls/sfx/blip" v={0.3} /><SV at={10.9} n="pw/impact" v={0.35} /><SV at={13.9} n="ls/sfx/click" v={0.5} /><SV at={15.3} n="pw/pop" v={0.3} />
    {CHAPTERS.map((c) => <React.Fragment key={c.t}><SV at={c.t} n="ls/sfx/swish" v={0.35} /><SV at={c.t + 0.28} n="ls/sfx/click" v={0.55} /><SV at={c.t + 0.3} n="pw/door" v={0.18} /></React.Fragment>)}
    <SV at={21.4} n="pw/impact" v={0.3} /><SV at={22.45} n="pw/pop" v={0.25} /><SV at={24.2} n="pw/pop" v={0.25} /><SV at={26.8} n="ls/sfx/boom" v={0.35} /><SV at={27.6} n="pw/tick" v={0.3} />
    <SV at={28.9} n="pw/pop" v={0.3} /><SV at={29.6} n="pw/pop" v={0.3} /><SV at={31.0} n="fb3/chime" v={0.3} /><SV at={33.9} n="pw/tick" v={0.3} /><SV at={38.6} n="ls/sfx/blip" v={0.3} />
    {[43.7, 45.8, 47.1].map((a) => <SV key={a} at={a} n="ls/sfx/click" v={0.45} />)}<SV at={50.2} n="ls/sfx/swish" v={0.25} /><SV at={55.4} n="fb3/chime" v={0.3} />
    <SV at={58.5} n="ls/sfx/glitch" v={0.45} /><SV at={64.9} n="pw/impact" v={0.3} /><SV at={66.3} n="ls/sfx/swish" v={0.3} /><SV at={69.1} n="pw/pop" v={0.3} />
    <SV at={76.8} n="ls/sfx/cash" v={0.4} /><SV at={79.6} n="ls/sfx/flap" v={0.3} /><SV at={78.3} n="pw/tick" v={0.3} /><SV at={83.6} n="pw/impact" v={0.35} /><SV at={84.9} n="ls/sfx/click" v={0.35} /><SV at={90.7} n="ls/sfx/click" v={0.35} />
    <SV at={93.0} n="ls/sfx/swish" v={0.3} /><SV at={97.8} n="pw/pop" v={0.3} /><SV at={99.4} n="pw/pop" v={0.3} /><SV at={105.9} n="ls/sfx/swish" v={0.25} /><SV at={110.0} n="ls/sfx/swish" v={0.25} />
    <SV at={112.2} n="fb3/beep" v={0.25} /><SV at={124.3} n="fb3/beep" v={0.2} /><SV at={125.8} n="ls/sfx/swish" v={0.3} />
    <SV at={132.8} n="pw/tick" v={0.3} /><SV at={139.9} n="ls/sfx/swish" v={0.3} /><SV at={145.4} n="pw/pop" v={0.3} /><SV at={149.3} n="ls/sfx/blip" v={0.35} /><SV at={150.6} n="ls/sfx/blip" v={0.3} />
    <SV at={152.6} n="pw/tick" v={0.3} />{[155.9, 156.8, 159.1].map((a) => <SV key={a} at={a} n="ls/sfx/click" v={0.35} />)}<SV at={163.8} n="ls/sfx/swish" v={0.35} /><SV at={164.8} n="pw/impact" v={0.4} />
    <SV at={v2(3.8)} n="ls/sfx/type" v={0.35} /><SV at={v2(13.4)} n="ls/sfx/blip" v={0.3} /><SV at={v2(16.4)} n="ls/sfx/blip" v={0.3} />{[0, 0.35, 0.7].map((a) => <SV key={a} at={v2(21.6) + a} n="ls/sfx/flap" v={0.3} />)}
    <SV at={v2(25.4)} n="pw/pop" v={0.3} /><SV at={v2(29.6)} n="pw/impact" v={0.3} /><SV at={v2(31.6)} n="fb3/ching" v={0.3} />
    {splatsT.map((a) => <SV key={a} at={a} n="pw/punch" v={0.3} />)}<SV at={wipeT} n="ls/sfx/swish" v={0.5} /><SV at={v2(37.6)} n="fb3/chime" v={0.3} />
    <SV at={v2(43.1)} n="ls/sfx/cash" v={0.35} /><SV at={v2(48.3)} n="pw/pop" v={0.25} /><SV at={v2(49.6)} n="pw/pop" v={0.25} /><SV at={v2(51.6)} n="fb3/beep" v={0.2} /><SV at={v2(56.3)} n="fb3/beep" v={0.25} />
    <SV at={v2(64.7)} n="ls/sfx/swish" v={0.25} /><SV at={v2(66.4)} n="pw/tick" v={0.3} /><SV at={v2(69.3)} n="fb3/beep" v={0.2} /><SV at={v2(71.0)} n="fb3/chime" v={0.35} /><SV at={v2(73.4)} n="pw/impact" v={0.3} />
    <SV at={v2(79.6)} n="ls/sfx/blip" v={0.25} /><SV at={v2(82.6)} n="pw/pop" v={0.3} />{[85.4, 87.4, 89.6].map((a) => <SV key={a} at={v2(a)} n="ls/sfx/click" v={0.35} />)}
    <SV at={v2(92.4)} n="ls/sfx/blip" v={0.35} /><SV at={v2(93.4)} n="pw/tick" v={0.3} /><SV at={v2(95.5)} n="fb3/beep" v={0.2} /><SV at={v2(101.7)} n="pw/impact" v={0.3} />
    <SV at={v2(104.6)} n="pw/impact" v={0.3} /><SV at={v2(108.6)} n="ls/sfx/type" v={0.35} />
    <SV at={v2(113.3)} n="ls/sfx/glitch" v={0.25} /><SV at={v2(116.5)} n="ls/sfx/blip" v={0.3} /><SV at={v2(119.8)} n="ls/sfx/scan" v={0.35} /><SV at={v2(121.2)} n="ls/sfx/unlock" v={0.4} />
    <SV at={v2(122.0)} n="ls/sfx/click" v={0.35} /><SV at={v2(126.2)} n="ls/sfx/swish" v={0.3} /><SV at={v2(130.6)} n="ls/sfx/click" v={0.35} />
    {PUNCH.map((p) => <SV key={'pk' + p} at={p} n="pw/impact" v={0.12} />)}
    <SV at={OUTRO + 2.5} n="ls/sfx/click" v={0.5} /><SV at={OUTRO + 3.0} n="fb4/ding" v={0.35} />
  </AbsoluteFill>;
};

/* gameplay-with-sound break tag */
const SoundOn: React.FC = () => {
  const t = useCurrentFrame() / FPS; const ins = (TL.ins as {t: number; d: number}[]).find((i) => t >= i.t && t < i.t + i.d); if (!ins) return null;
  const e = ramp(t, ins.t, ins.t + 0.25, 0, 1, eo) * ramp(t, ins.t + ins.d - 0.2, ins.t + ins.d, 1, 0);
  return <div style={{position: 'absolute', left: 44, bottom: 44, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderRadius: 14, background: 'rgba(10,8,16,.78)', border: '2px solid rgba(255,255,255,.35)', opacity: e, transform: `translateX(${(1 - e) * -40}px)`}}>
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 4, height: 30}}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{width: 6, borderRadius: 3, background: C.teal, height: 8 + Math.abs(Math.sin(t * (9 + i * 2.3) + i)) * 22}} />)}</div>
    <div style={{fontFamily: UI, fontSize: 22, letterSpacing: 3, color: '#fff'}}>SOUND ON · GAMEPLAY</div>
  </div>;
};
export const LeonidaEp1: React.FC = () => {
  const ready = useFontsReady('ls1'); const road = useRoadFonts(); const rt = useCurrentFrame() / FPS;
  if (!ready || !road) return <AbsoluteFill style={{background: '#000'}} />;
  const insK = (TL.ins as {t: number; d: number}[]).reduce((m, i) => Math.max(m, rt >= i.t - 0.15 && rt < i.t + i.d + 0.1 ? ramp(rt, i.t - 0.15, i.t + 0.05) * ramp(rt, i.t + i.d, i.t + i.d + 0.1, 1, 0) : 0), 0);
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <Background segs={TL.segs as Seg[]} end={TL.end} punches={PUNCH.map(R)} />
    <TimeCtx.Provider value={(fr) => virt(fr / FPS)}><AbsoluteFill style={{opacity: 1 - insK}}><Overlays /></AbsoluteFill></TimeCtx.Provider>
    <SoundOn />
    <Audio src={staticFile('ls/vo_real.wav')} />
  </AbsoluteFill>;
};
