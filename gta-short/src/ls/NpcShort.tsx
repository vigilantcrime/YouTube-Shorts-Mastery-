/* Leonida Shifts — Short: "NPCs in GTA 6 will ask you for help… and you'll regret it" (the swamp van + tiger).
   1:1 replication of the Roddy Games "dog digging spot" Short grammar (720×1280 reference, 24.9 s):
   full-bleed hard-cut 9:16 gameplay with a soft lens vignette · logo top-centre 0–3 s · 1–3-word captions at ~74% height
   with one yellow/magenta key word · in-game-map zoom with a location pill · yellow target brackets · game-prompt badges ·
   green location title · icon pops · money-style pop · channel-page end card "ON MY CHANNEL". Own assets only. */
import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Emblem, GRAD} from './kit';
import geo from './geo.json';

const FPS = 30, W = 1080, H = 1920;
export const NS_FRAMES = Math.round(25.3 * FPS);
const f = (s: number) => Math.round(s * FPS);
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const YEL = '#FFD400', MAG = '#FF2FA8';
const VO_B = 14.2;            // second VO part starts after the NPC line
const NPC_AT = 11.9;          // "You know... just stuff." (game audio)

/* ---------- shots: g7 source time, crop centre (0–1 of the 1920 width), extra zoom ---------- */
type Shot = {t: number; src: number; cx: number; z?: number; cy?: number};
const SHOTS: Shot[] = [
  {t: 0.0, src: 13.0, cx: 0.72},            // hook: NPC waving you over
  {t: 2.36, src: 18.0, cx: 0.47},           // "for help"
  {t: 3.12, src: 44.2, cx: 0.47, z: 1.3, cy: 0.56}, // "regret it" — 0.6 s tiger tease
  {t: 3.72, src: -1, cx: 0},                // map zoom card
  {t: 4.62, src: 2.8, cx: 0.42},            // arriving at the swamp at sunset
  {t: 5.40, src: 9.6, cx: 0.3},             // "two guys have their van stuck in the mud"
  {t: 7.60, src: 17.4, cx: 0.46},           // "walk up and they'll ask you to push"
  {t: 9.20, src: 30.2, cx: 0.38},           // "dig your heels in"
  {t: 10.12, src: 24.4, cx: 0.5},           // "ask what they're doing out here"
  {t: NPC_AT, src: 27.45, cx: 0.47},        // NPC: "You know... just stuff."
  {t: VO_B, src: 31.6, cx: 0.42},           // "keep pushing until they open"
  {t: 15.48, src: 35.5, cx: 0.45},          // "the back doors"
  {t: 16.28, src: 42.8, cx: 0.55, z: 1.28, cy: 0.55}, // "and a tiger climbs out"
  {t: 17.68, src: 44.4, cx: 0.44, z: 1.22, cy: 0.56}, // "turns out just stuff meant smuggling a tiger"
  {t: 20.92, src: 46.6, cx: 0.48, z: 1.15, cy: 0.55}, // "and now it's loose, right next to you"
  {t: 22.64, src: -2, cx: 0},               // end card
];
const shotAt = (t: number) => { let k = 0; SHOTS.forEach((s, i) => { if (t >= s.t) k = i; }); return k; };

/* ---------- captions: [time, text, key word, colour] ---------- */
const CAPS: [number, string, string, string][] = [
  [0.0, 'NPCS IN', 'NPCS', YEL], [0.84, 'GTA 6', 'GTA 6', YEL], [1.76, 'WILL ASK YOU', 'ASK', MAG], [2.36, 'FOR HELP', 'HELP', YEL], [2.72, "AND YOU'LL", '', ''], [3.12, 'REGRET IT', 'REGRET', MAG],
  [3.72, 'HEAD OUT TO', '', ''], [4.2, 'THE SWAMP', 'SWAMP', YEL], [4.68, 'AT SUNSET', 'SUNSET', MAG], [5.4, 'WHERE TWO GUYS', 'GUYS', YEL], [6.08, 'HAVE THEIR VAN', 'VAN', YEL], [6.76, 'STUCK IN', 'STUCK', MAG],
  [7.16, 'THE MUD', 'MUD', YEL], [7.6, 'WALK UP', '', ''], [8.04, "AND THEY'LL ASK", 'ASK', MAG], [8.6, 'YOU TO PUSH', 'PUSH', YEL], [9.2, 'DIG YOUR', '', ''], [9.6, 'HEELS IN', 'HEELS', MAG],
  [10.12, 'THEN ASK', '', ''], [10.64, "WHAT THEY'RE", '', ''], [11.08, 'DOING OUT HERE', 'HERE', YEL], [NPC_AT + 0.05, '"YOU KNOW…', '', ''], [NPC_AT + 1.2, 'JUST STUFF"', 'JUST STUFF"', YEL],
  [VO_B, 'KEEP PUSHING', 'PUSHING', MAG], [VO_B + 0.52, 'UNTIL THEY OPEN', 'OPEN', YEL], [VO_B + 1.28, 'THE BACK DOORS', 'DOORS', YEL], [VO_B + 2.08, 'AND A TIGER', 'TIGER', YEL], [VO_B + 2.76, 'CLIMBS OUT', 'CLIMBS', MAG],
  [VO_B + 3.48, 'TURNS OUT', '', ''], [VO_B + 4.04, 'JUST STUFF', 'JUST STUFF', YEL], [VO_B + 4.6, 'MEANT SMUGGLING', 'SMUGGLING', MAG], [VO_B + 5.44, 'A TIGER', 'TIGER', YEL], [VO_B + 5.88, 'THROUGH LEONIDA', 'LEONIDA', YEL],
  [VO_B + 6.72, 'AND NOW', '', ''], [VO_B + 7.04, "IT'S LOOSE", 'LOOSE', MAG], [VO_B + 7.6, 'RIGHT NEXT', 'NEXT', YEL], [VO_B + 8.04, 'TO YOU', 'YOU', YEL], [VO_B + 8.44, 'MORE UNHINGED', 'UNHINGED', MAG],
  [VO_B + 9.2, 'NPCS', 'NPCS', YEL], [VO_B + 9.88, 'ON MY CHANNEL', 'CHANNEL', YEL],
];
const Caption: React.FC<{t: number}> = ({t}) => {
  let k = -1; CAPS.forEach((c, i) => { if (c[0] <= t + 0.03) k = i; }); if (k < 0) return null;
  const [, txt, key, col] = CAPS[k]; const i0 = key ? txt.indexOf(key) : -1;
  const parts = i0 >= 0 ? [txt.slice(0, i0), key, txt.slice(i0 + key.length)] : [txt, '', ''];
  return <div style={{position: 'absolute', left: 0, right: 0, top: H * 0.735, textAlign: 'center', fontFamily: 'HeroBlack', fontSize: 66, letterSpacing: 0.5, lineHeight: 1,
    color: '#fff', textShadow: '0 3px 0 rgba(0,0,0,.85), 0 0 10px rgba(0,0,0,.65), 0 0 2px #000', WebkitTextStroke: '1.5px rgba(0,0,0,.6)'}}>
    {parts[0]}<span style={{color: col || '#fff'}}>{parts[1]}</span>{parts[2]}</div>;
};

/* ---------- footage (hard cuts) + lens vignette ---------- */
const Footage: React.FC<{t: number}> = ({t}) => {
  const k = shotAt(t); const s = SHOTS[k]; if (s.src < 0) return null;
  const z = s.z ?? 1; const vw = 3413 * z, vh = 1920 * z;  // 1920×1080 source scaled so its height fills 1920
  const left = W / 2 - s.cx * vw; const top = s.cy !== undefined ? H / 2 - s.cy * vh : (H - vh) / 2;
  const drift = (t - s.t) * 6;                               // the slow handheld drift Roddy's shots have
  return <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
    <Sequence from={f(s.t) - f(s.src)} layout="none">
      <OffthreadVideo src={staticFile('ls/g7.mp4')} muted style={{position: 'absolute', left: left - drift, top, width: vw, height: vh}} />
    </Sequence>
  </AbsoluteFill>;
};
const Lens: React.FC = () => <>
  <AbsoluteFill style={{backdropFilter: 'blur(6px)', WebkitMaskImage: 'radial-gradient(ellipse 100% 78% at 50% 48%, transparent 74%, #000 100%)', maskImage: 'radial-gradient(ellipse 100% 78% at 50% 48%, transparent 74%, #000 100%)'}} />
  <AbsoluteFill style={{background: 'radial-gradient(ellipse 105% 80% at 50% 48%, transparent 70%, rgba(255,255,255,.14) 100%)'}} />
</>;

/* ---------- logo sting (0–3 s, top centre, glint at 0.3 s) ---------- */
const Logo: React.FC<{t: number}> = ({t}) => {
  if (t > 3.1) return null; const s = interpolate(t, [0, 0.12, 0.22], [0.7, 1.06, 1], cl); const o = interpolate(t, [2.85, 3.1], [1, 0], cl);
  const g = interpolate(t, [0.3, 0.75], [-40, 140], cl);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: o, transform: `scale(${s})`}}>
    <div style={{position: 'relative', overflow: 'hidden', borderRadius: 44}}>
      <Emblem size={170} gear={interpolate(t, [0.5, 0.8], [0, 1], cl)} />
      <div style={{position: 'absolute', top: 0, bottom: 0, left: `${g}%`, width: 46, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.85), transparent)', transform: 'skewX(-18deg)'}} />
    </div>
    <div style={{marginTop: 12, fontFamily: 'Road', fontSize: 50, letterSpacing: -0.5, color: '#fff', textShadow: '0 3px 10px rgba(0,0,0,.6)'}}>LEONIDA <span style={{background: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>SHIFTS</span></div>
  </div>;
};

/* ---------- in-game-style map zoom with a location pill ---------- */
const FL = geo.fl as {n: string; d: string}[]; const FLX = geo.flx as {n: string; d: string}[];
const MapZoom: React.FC<{t: number}> = ({t}) => {
  const t0 = 3.72, t1 = 4.62; if (t < t0 || t >= t1) return null;
  const p = interpolate(t, [t0, t1], [0, 1], cl); const z = 1.5 + 2.2 * p * p; const [rx, ry] = [770, 790];
  const pill = interpolate(t, [t0 + 0.25, t0 + 0.35], [0, 1], cl);
  return <AbsoluteFill style={{background: 'linear-gradient(180deg,#2c9fc9,#1f7fae)', overflow: 'hidden'}}>
    <svg viewBox="0 0 1080 1080" width={1920 * 1.0} height={1920} style={{position: 'absolute', left: -420, top: 0, transform: `scale(${z})`, transformOrigin: `${(rx / 1080) * 1920 - 420}px ${(ry / 1080) * 1920}px`}}>
      {[...FLX, ...FL].map((s, i) => <path key={i} d={s.d} fill={s.n === 'Florida' ? '#a9cf8f' : '#c3d9a8'} stroke="#e8f2d9" strokeWidth={2} />)}
      <circle cx={rx} cy={ry} r={26} fill="rgba(255,255,255,.15)" stroke="#ffe56b" strokeWidth={4} strokeDasharray="8 6" />
    </svg>
    <div style={{position: 'absolute', left: 0, right: 0, top: H * 0.33, display: 'flex', justifyContent: 'center', opacity: pill, transform: `scale(${0.8 + 0.2 * pill})`}}>
      <div style={{padding: '14px 46px', borderRadius: 14, background: 'linear-gradient(180deg,#2b8df0,#1565d8)', border: '3px solid #e9f3ff', fontFamily: 'UIBold', fontSize: 50, color: '#fff', boxShadow: '0 8px 20px rgba(0,0,0,.35)'}}>The Swamp</div>
    </div>
  </AbsoluteFill>;
};

/* ---------- yellow corner brackets on the subject ---------- */
const Brackets: React.FC<{t: number; t0: number; t1: number; x: number; y: number; w: number; h: number}> = ({t, t0, t1, x, y, w, h}) => {
  if (t < t0 || t >= t1) return null; const s = interpolate(t, [t0, t0 + 0.12], [1.25, 1], cl); const L = Math.min(w, h) * 0.28;
  const c = (sx: number, sy: number) => <div style={{position: 'absolute', left: sx ? undefined : 0, right: sx ? 0 : undefined, top: sy ? undefined : 0, bottom: sy ? 0 : undefined, width: L, height: L,
    borderColor: '#FFD400', borderStyle: 'solid', borderWidth: `${sy ? 0 : 7}px ${sx ? 7 : 0}px ${sy ? 7 : 0}px ${sx ? 0 : 7}px`, borderRadius: 6, filter: 'drop-shadow(0 0 4px rgba(0,0,0,.6))'}} />;
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `scale(${s})`}}>{c(0, 0)}{c(1, 0)}{c(0, 1)}{c(1, 1)}
    <div style={{position: 'absolute', inset: 0, background: 'rgba(255,212,0,.08)', borderRadius: 8}} /></div>;
};

/* ---------- game-prompt badge (the "COOL DOG L2" element) ---------- */
const Prompt: React.FC<{t: number; t0: number; t1: number; text: string; btn: string; y?: number}> = ({t, t0, t1, text, btn, y = 560}) => {
  if (t < t0 || t >= t1) return null; const s = interpolate(t, [t0, t0 + 0.08, t0 + 0.16], [0.6, 1.08, 1], cl);
  return <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', transform: `scale(${s})`}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '18px 30px', borderRadius: 18, background: 'linear-gradient(180deg,#18424a,#0f2e35)', border: '3px solid rgba(255,255,255,.85)', boxShadow: '0 10px 24px rgba(0,0,0,.5)'}}>
      <div style={{fontFamily: 'Road', fontSize: 62, color: '#fff', letterSpacing: 1, whiteSpace: 'nowrap'}}>{text}</div>
      <div style={{width: 74, height: 74, borderRadius: 37, border: '5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'UIBold', fontSize: 34, color: '#fff'}}>{btn}</div>
    </div></div>;
};

/* ---------- icon pops, location title, money-style pop ---------- */
const Paws: React.FC<{t: number; t0: number; t1: number}> = ({t, t0, t1}) => {
  if (t < t0 || t >= t1) return null;
  return <>{[[820, 420, 0], [890, 560, 0.12], [800, 700, 0.24]].map(([x, y, d], i) => { const s = interpolate(t, [t0 + d, t0 + d + 0.1, t0 + d + 0.18], [0, 1.2, 1], cl);
    return <div key={i} style={{position: 'absolute', left: x, top: y, fontSize: 92, transform: `scale(${s}) rotate(${-15 + i * 12}deg)`, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.5)) saturate(1.3)'}}>🐾</div>; })}</>;
};
const Title: React.FC<{t: number; t0: number; t1: number; text: string}> = ({t, t0, t1, text}) => {
  if (t < t0 || t >= t1) return null; const o = interpolate(t, [t0, t0 + 0.1, t1 - 0.1, t1], [0, 1, 1, 0], cl);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: 'Road', fontSize: 96, letterSpacing: 2, color: '#8EE36B', opacity: o,
    WebkitTextStroke: '3px #1b3b12', textShadow: '0 5px 0 #1b3b12, 0 10px 18px rgba(0,0,0,.5)'}}>{text}</div>;
};
const Gain: React.FC<{t: number; t0: number; t1: number}> = ({t, t0, t1}) => {
  if (t < t0 || t >= t1) return null; const s = interpolate(t, [t0, t0 + 0.08, t0 + 0.16], [0.5, 1.1, 1], cl); const o = interpolate(t, [t1 - 0.25, t1], [1, 0], cl);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center', transform: `scale(${s})`, opacity: o}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '14px 30px', borderRadius: 14, background: 'rgba(20,22,24,.82)', border: '3px solid rgba(255,255,255,.8)'}}>
      <div style={{fontFamily: 'UIBold', fontSize: 70, color: '#fff'}}>+ 1 TIGER</div><div style={{fontSize: 64}}>🐯</div></div></div>;
};

/* ---------- channel-page end card ---------- */
const EndCard: React.FC<{t: number}> = ({t}) => {
  const t0 = 22.64; if (t < t0) return null; const e = interpolate(t, [t0, t0 + 0.18], [0, 1], cl);
  return <AbsoluteFill style={{background: 'linear-gradient(180deg,#c9d8e4 0%,#7fa4c4 45%,#355a7d 100%)', opacity: e}}>
    <Img src={staticFile('ls/img/ep1_card.jpg')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(40px) brightness(.85)', opacity: 0.55}} />
    <div style={{position: 'absolute', left: 60, right: 60, top: 70, display: 'flex', alignItems: 'center', gap: 22}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'UIBold', fontSize: 30, color: '#222'}}><div style={{width: 46, height: 32, borderRadius: 9, background: '#e62117', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18}}>▶</div>YouTube</div>
      <div style={{flex: 1, height: 52, borderRadius: 26, background: 'rgba(255,255,255,.85)', display: 'flex', alignItems: 'center', padding: '0 24px', fontFamily: 'UIBold', fontSize: 26, color: '#555'}}>🔍  Leonida Shifts</div>
    </div>
    <div style={{position: 'absolute', left: 60, top: 175, display: 'flex', alignItems: 'center', gap: 26}}>
      <Emblem size={150} gear={1} />
      <div><div style={{fontFamily: 'HeroBlack', fontSize: 68, color: '#fff', textShadow: '0 3px 10px rgba(0,0,0,.35)'}}>Leonida Shifts</div>
        <div style={{fontFamily: 'UIBold', fontSize: 28, color: 'rgba(255,255,255,.9)', marginTop: 6}}>GTA 6 news · new episode every week</div></div>
    </div>
    <div style={{position: 'absolute', left: 60, right: 60, top: 400, borderRadius: 26, overflow: 'hidden', boxShadow: '0 18px 40px rgba(0,0,0,.4)', transform: `translateY(${(1 - e) * 40}px)`}}>
      <Img src={staticFile('ls/img/ep1_card.jpg')} style={{width: '100%', height: 540, objectFit: 'cover', display: 'block'}} />
    </div>
    <div style={{position: 'absolute', left: 64, right: 64, top: 965, fontFamily: 'UIBold', fontSize: 38, lineHeight: 1.25, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,.4)'}}>Everything That Changed in GTA 6 This Week | Leonida Shifts Ep. 1</div>
  </AbsoluteFill>;
};

const useFonts = () => {
  const [h] = React.useState(() => delayRender('ns-fonts')); const [ok, setOk] = React.useState(false);
  React.useEffect(() => { Promise.all([['HeroBlack', 'InterDisplay-Black.otf'], ['UIBold', 'Inter-Bold.otf'], ['Road', 'ls/fonts/road900.woff2']].map(([n, p]) => new FontFace(n, `url(${staticFile(p)})`).load()))
    .then((fs) => { fs.forEach((x) => document.fonts.add(x)); setOk(true); continueRender(h); }); }, [h]);
  return ok;
};
const S: React.FC<{at: number; n: string; v?: number}> = ({at, n, v = 0.4}) => <Sequence from={f(at)} durationInFrames={60} layout="none"><Audio src={staticFile(`${n}.wav`)} volume={v} /></Sequence>;

export const NpcShort: React.FC = () => {
  const ok = useFonts(); const t = useCurrentFrame() / FPS;
  if (!ok) return <AbsoluteFill style={{background: '#000'}} />;
  return <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <Footage t={t} />
    {SHOTS[shotAt(t)].src >= 0 && <Lens />}
    <MapZoom t={t} />
    <Brackets t={t} t0={6.08} t1={7.6} x={20} y={560} w={600} h={500} />
    <Brackets t={t} t0={VO_B + 2.1} t1={VO_B + 3.48} x={130} y={560} w={420} h={270} />
    <Prompt t={t} t0={8.76} t1={9.2} text="PUSH" btn="✕" />
    <Prompt t={t} t0={10.64} t1={11.9} text="WHY YOU HERE?" btn="○" />
    <Paws t={t} t0={VO_B + 2.76} t1={VO_B + 3.48} />
    <Prompt t={t} t0={VO_B + 5.44} t1={VO_B + 5.88} text="TIGER" btn="○" />
    <Title t={t} t0={VO_B + 5.88} t1={VO_B + 6.72} text="LEONIDA" />
    <Gain t={t} t0={VO_B + 7.6} t1={VO_B + 8.44} />
    <EndCard t={t} />
    <Logo t={t} />
    <Caption t={t} />
    {/* audio: VO (Kokoro am_fenrir), the real NPC line, a low original music bed, SFX */}
    <Audio src={staticFile('ls/ns_voA.wav')} />
    <Sequence from={f(NPC_AT)} layout="none"><Audio src={staticFile('ls/npc_juststuff.wav')} volume={1.6} /></Sequence>
    <Sequence from={f(VO_B)} layout="none"><Audio src={staticFile('ls/ns_voB.wav')} /></Sequence>
    <Audio src={staticFile('ls/ns_music.wav')} volume={(fr) => (fr / FPS >= NPC_AT && fr / FPS < VO_B ? 0.05 : 0.11)} />
    <S at={0.02} n="ls/sfx/swish" v={0.3} /><S at={3.12} n="pw/impact" v={0.3} /><S at={3.72} n="ls/sfx/swish" v={0.35} /><S at={4.0} n="ls/sfx/blip" v={0.3} /><S at={6.08} n="pw/pop" v={0.3} />
    <S at={8.76} n="ls/sfx/click" v={0.45} /><S at={10.64} n="ls/sfx/click" v={0.45} /><S at={VO_B + 2.1} n="pw/pop" v={0.3} /><S at={VO_B + 2.76} n="pw/pop" v={0.3} />
    <S at={VO_B + 5.44} n="ls/sfx/click" v={0.45} /><S at={VO_B + 5.88} n="ls/sfx/swish" v={0.3} /><S at={VO_B + 7.6} n="fb3/ching" v={0.35} /><S at={22.64} n="ls/sfx/swish" v={0.35} />
  </AbsoluteFill>;
};
