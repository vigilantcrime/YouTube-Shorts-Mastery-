/* r35 "Rockstar please make printers" — pundit split, captions already burned into the influencer clip.
   Top: influencer (native 1080 wide, framed so his own captions + controller stay in the panel).
   Bottom: gameplay. 4.2–15.5 s the bottom splits side-by-side: gameplay (works ✔) vs a cartoon printer stage (✖).
   Gag timings are locked to the burned-in caption word changes (detected per frame). */
import React from 'react';
import {AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {cl, useFontsReady} from './kit3d';

const W = 1080, H = 1920, FPS = 30, SEAM = 990, BH = H - SEAM;
export const FB3_FRAMES = 603;
const f = (s: number) => Math.round(s * FPS);
const YEL = '#FFE600', INK = '#23272e';
const eo = Easing.out(Easing.cubic), eio = Easing.inOut(Easing.cubic);
const ramp = (t: number, a: number, b: number, from = 0, to = 1, e = eo) => interpolate(t, [a, b], [from, to], {...cl, easing: e});
const popS = (t: number, t0: number) => interpolate((t - t0) * FPS, [0, 4, 8], [0.3, 1.14, 1], cl);
const spring = (t: number, t0: number, amp: number, k = 18, d = 5) => (t < t0 ? 0 : amp * Math.exp(-d * (t - t0)) * Math.cos(k * (t - t0)));

/* word anchors = burned-in caption changes */
const A = {rock: 1.57, works: 3.33, mean: 4.2, printer: 4.87, one: 5.63, job: 6.03, printing: 6.53, paper: 7.73, jam: 8.0, theres: 9.37, nopaper: 9.77,
  put: 11.13, now: 12.3, ink: 13.13, cart: 13.4, costs: 13.8, more: 14.03, than: 14.17, printer2: 14.37, itself: 14.63, rock2: 15.47, please: 16.2,
  make: 16.57, printers: 16.73, beat: 17.6, wallahi: 18.43, hurt: 18.97, rambo: 19.53};

const useSilk = () => {
  const [h] = React.useState(() => delayRender('silk3')); const [ok, setOk] = React.useState(false);
  React.useEffect(() => { const ff = new FontFace('Silk', `url(${staticFile('ab/silk.woff2')})`); ff.load().then((x) => { document.fonts.add(x); setOk(true); continueRender(h); }); }, [h]);
  return ok;
};
const Sfx: React.FC<{at: number; n: string; v?: number}> = ({at, n, v = 0.5}) => <Sequence from={Math.max(0, f(at))} durationInFrames={45}><Audio src={staticFile(`${n}.wav`)} volume={v} /></Sequence>;

/* ---------- cartoon printer (viewBox 600×520) ---------- */
type PState = {lcd: string[]; lcdBg: string; lcdFg: string; led: string; prog?: number; sheets?: number; sheetDrop?: number[]};
const Printer: React.FC<PState & {w: number}> = ({w, lcd, lcdBg, lcdFg, led, prog, sheets = 0, sheetDrop = []}) =>
  <svg width={w} height={w * 520 / 600} viewBox="0 0 600 520" style={{overflow: 'visible', display: 'block'}}>
    <defs><linearGradient id="pb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbfcfd" /><stop offset="1" stopColor="#c7cdd5" /></linearGradient></defs>
    <ellipse cx="300" cy="500" rx="250" ry="16" fill="rgba(0,0,0,.28)" />
    <polygon points="170,180 430,180 405,40 195,40" fill="#c3c9d1" stroke={INK} strokeWidth="7" strokeLinejoin="round" />
    {Array.from({length: sheets}).map((_, i) => <polygon key={i} transform={`translate(0 ${-(sheetDrop[i] ?? 0)})`} points={`210,176 390,176 376,${62 - i * 6} 224,${62 - i * 6}`} fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />)}
    <rect x="50" y="160" width="500" height="300" rx="40" fill="url(#pb)" stroke={INK} strokeWidth="8" />
    <line x1="62" y1="238" x2="538" y2="238" stroke={INK} strokeWidth="5" />
    <rect x="95" y="330" width="235" height="24" rx="12" fill={INK} />
    <rect x="80" y="392" width="280" height="20" rx="10" fill="#b9c0c9" stroke={INK} strokeWidth="5" />
    <rect x="352" y="250" width="178" height="104" rx="14" fill={lcdBg} stroke={INK} strokeWidth="7" />
    {lcd.map((s, i) => <text key={i} x="441" y={lcd.length === 1 ? 312 : 294 + i * 38} textAnchor="middle" fontFamily="Silk" fontSize={s.length > 6 ? 21 : 32} fill={lcdFg}>{s}</text>)}
    {prog !== undefined && <><rect x="370" y="326" width="142" height="14" rx="7" fill="rgba(0,0,0,.2)" /><rect x="370" y="326" width={142 * prog} height="14" rx="7" fill={lcdFg} /></>}
    <circle cx="418" cy="392" r="11" fill="#9aa3ad" stroke={INK} strokeWidth="4" /><circle cx="456" cy="392" r="11" fill="#9aa3ad" stroke={INK} strokeWidth="4" />
    <circle cx="496" cy="392" r="14" fill={led} stroke={INK} strokeWidth="4" />
    {led !== '#3ddc5a' && <circle cx="496" cy="392" r="28" fill={led} opacity="0.35" />}
  </svg>;

const Cart: React.FC<{c: string; l: string; lvl: number; w?: number}> = ({c, l, lvl, w = 74}) =>
  <div style={{position: 'relative', width: w, height: w * 1.5, borderRadius: 12, border: `6px solid ${INK}`, background: '#eef0f2', overflow: 'hidden', boxShadow: '0 8px 16px rgba(0,0,0,.3)'}}>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${lvl * 100}%`, background: c}} />
    <div style={{position: 'absolute', top: 6, width: '100%', textAlign: 'center', fontFamily: 'Silk', fontSize: w * 0.34, color: INK}}>{l}</div>
  </div>;

/* ---------- top: presenter ---------- */
const ZOOM: [number, number][] = [[0, 1.14], [0.67, 1.0], [1.57, 1.08], [4.2, 1.0], [5.63, 1.12], [7.53, 1.0], [9.37, 1.15], [11.13, 1.04], [12.3, 1.1], [13.8, 1.18], [15.47, 1.0], [16.2, 1.1], [18.43, 1.2], [18.97, 1.26]];
const zAt = (t: number) => ZOOM.reduce((z, [a, v]) => (t >= a ? v : z), 1);
const Presenter: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; let z = zAt(t); let rot = 0;
  if (t >= 17.33 && t < A.wallahi) { const k = ramp(t, 17.33, A.wallahi, 0, 1, eio); z = 1.1 + 0.07 * k; rot = 2.5 * k; }  // dutch roll on the silent beat
  z += spring(t, A.hurt, 0.06, 26, 7) + spring(t, A.jam, 0.035, 30, 9);
  return <div style={{position: 'absolute', left: 0, top: 0, width: W, height: SEAM, overflow: 'hidden', background: '#000'}}>
    <div style={{position: 'absolute', inset: 0, transform: `rotate(${rot}deg) scale(${z})`, transformOrigin: '50% 45%'}}>
      <OffthreadVideo src={staticFile('fb3/inf.mp4')} muted style={{position: 'absolute', left: 0, top: -330, width: 1080, height: 1920}} />
    </div>
    {t >= A.please && t < 17.5 && <div style={{position: 'absolute', left: 836, top: 800, fontSize: 130, transform: `scale(${popS(t, A.please)}) rotate(${Math.sin(t * 9) * 6}deg)`}}>🙏</div>}
  </div>;
};

/* ---------- bottom: gameplay + side-by-side printer stage ---------- */
const splitK = (t: number) => (t < A.rock2 ? ramp(t, A.mean, A.mean + 0.28, 0, 1, eio) : ramp(t, A.rock2, A.rock2 + 0.3, 1, 0, eio));
const Badge: React.FC<{ok: boolean; s: number; x: number; y: number}> = ({ok, s, x, y}) =>
  <div style={{position: 'absolute', left: x, top: y, width: 96, height: 96, borderRadius: 48, background: ok ? '#22c55e' : '#ff2d55', border: '7px solid #fff', boxShadow: '0 8px 20px rgba(0,0,0,.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'HeroBlack', fontSize: 58, transform: `scale(${s})`}}>{ok ? '✔' : '✖'}</div>;

const Gameplay: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; const k = splitK(t);
  let z = t < A.rock ? 1.12 + 0.02 * t : t < A.works + 0.4 ? ramp(t, A.rock, A.works + 0.4, 1.36, 1.0) : 1.0 + 0.05 * ramp(t, A.rock2, 20.1, 0, 1, eio);
  if (t < 0.25) z += ramp(t, 0, 0.25, 0.25, 0);
  const gw = W - 540 * k;
  return <div style={{position: 'absolute', left: 0, top: SEAM, width: W, height: BH, overflow: 'hidden', background: '#000'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: gw, height: BH, overflow: 'hidden'}}>
      <OffthreadVideo src={staticFile('fb3/gta.mp4')} muted style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`, filter: t < 0.25 ? `blur(${ramp(t, 0, 0.25, 14, 0)}px)` : undefined}} />
    </div>
    {t >= A.works && <Badge ok s={popS(t, A.works)} x={28} y={28} />}
  </div>;
};

const Stage: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; const k = splitK(t);
  if (k <= 0) return null;
  // printer state machine
  const jamOn = t >= A.jam && t < 11.57, noInk = t >= 12.63;
  const blink = (t0: number) => (t - t0 < 1.0 ? Math.floor((t - t0) * 6) % 2 === 0 : true);
  let st: PState = {lcd: ['READY'], lcdBg: '#a8e6b0', lcdFg: '#1d4d26', led: '#3ddc5a'};
  if (t >= A.printing && t < A.jam) st = {...st, lcd: ['PRINTING'], prog: ramp(t, A.printing, A.jam, 0, 0.92, eio)};
  if (jamOn) st = {lcd: blink(A.jam) ? ['PAPER', 'JAM!'] : [], lcdBg: '#ff4d5e', lcdFg: '#fff', led: '#ff2d55'};
  if (noInk) st = {lcd: blink(12.63) ? ['NO', 'INK!'] : [], lcdBg: '#ff4d5e', lcdFg: '#fff', led: '#ff2d55'};
  const sheetT = [11.13, 11.27, 11.42, 11.57]; const sheets = t >= A.put ? sheetT.filter((s) => t >= s).length : 0;
  const sheetDrop = sheetT.map((s) => ramp(t, s, s + 0.12, 300, 0, Easing.in(Easing.quad)));
  // printer drop-in, print rattle, jam jolt
  const dropY = ramp(t, A.printer, A.printer + 0.22, -760, 0, Easing.in(Easing.quad)) + spring(t, A.printer + 0.22, -26, 30, 8);
  const rattle = t >= A.printing && t < A.jam ? Math.sin(fr * 2.9) * 3 : 0;
  const jolt = spring(t, A.jam, -9, 24, 5);
  // tray inspect zoom (there's no paper in it)
  const zIn = t < 10.87 ? ramp(t, A.theres, A.theres + 0.25, 1, 1.75, eio) : ramp(t, 10.87, 11.05, 1.75, 1, eio);
  // seesaw scene from "costs"
  const see = t >= A.costs; const swap = ramp(t, A.costs, A.costs + 0.18, 0, 1);
  const ang = see ? -14 + ramp(t, A.more, A.more + 0.12, 0, 8) + ramp(t, A.than, A.than + 0.12, 0, 10) + ramp(t, A.printer2, A.printer2 + 0.1, 0, 14) + spring(t, A.printer2 + 0.1, 4, 28, 7) : -14;
  const launch = ramp(t, A.itself, A.itself + 0.5, 0, 1, Easing.in(Easing.quad));
  const bagT = [A.more, A.than, A.printer2];
  const px = 20, pw = 500, ptop = 700 - pw * 520 / 600;
  const left = W - 540 * k;
  return <div style={{position: 'absolute', left, top: SEAM, width: 540, height: BH, overflow: 'hidden', background: 'linear-gradient(165deg,#f6eedb 0%,#e2d3ae 70%)'}}>
    <div style={{position: 'absolute', inset: 0, opacity: 0.18, backgroundImage: 'repeating-linear-gradient(90deg, #a8916a 0 2px, transparent 2px 60px)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 700, bottom: 0, background: 'linear-gradient(180deg,#9a6a40,#5e3a20)', boxShadow: 'inset 0 10px 0 #b98656'}} />
    {!see && <div style={{position: 'absolute', inset: 0, transform: `scale(${zIn})`, transformOrigin: `270px ${ptop + 110 * pw / 600}px`}}>
      <div style={{position: 'absolute', left: px, top: ptop, width: pw, transform: `translate(${rattle}px, ${dropY}px) rotate(${jolt}deg)`, transformOrigin: '50% 100%'}}>
        <Printer w={pw} {...st} sheets={sheets} sheetDrop={sheetDrop} />
        {t >= A.nopaper && t < A.put && <div style={{position: 'absolute', left: 175, top: 18, fontSize: 92, opacity: ramp(t, A.nopaper, A.nopaper + 0.2)}}>🕸️</div>}
      </div>
      {t >= A.theres && t < 10.95 && <div style={{position: 'absolute', left: 120 + 190 * (0.5 + 0.5 * Math.sin((t - A.theres) * 5.2)), top: ptop + 10, fontSize: 96, transform: 'rotate(-18deg)'}}>🔍</div>}
    </div>}
    {/* one print job flies in from the gameplay side */}
    {t >= A.one && t < A.job + 0.12 && (() => { const p = ramp(t, A.one, A.job + 0.1, 0, 1, eio); return <div style={{position: 'absolute', left: -60 + 330 * p, top: 120 + 260 * p - 240 * Math.sin(p * Math.PI) , fontSize: 88, transform: `rotate(${p * 340}deg) scale(${1 - 0.6 * p})`}}>📄</div>; })()}
    {t >= A.jam && t < A.theres && <div style={{position: 'absolute', left: 205, top: ptop - 150, fontSize: 120, transform: `scale(${popS(t, A.jam)}) rotate(${Math.sin(t * 14) * 5}deg)`}}>⚠️</div>}
    {/* ink cartridges pop + drain */}
    {t >= A.ink && !see && <div style={{position: 'absolute', left: 36, top: 148, display: 'flex', gap: 28}}>
      {[['#00b7eb', 'C'], ['#ff2fa0', 'M'], [YEL, 'Y'], ['#222', 'K']].map(([c, l], i) => <div key={l} style={{transform: `scale(${popS(t, A.ink + i * 0.07)}) rotate(${(i - 1.5) * 5}deg)`}}>
        <Cart c={c} l={l} w={95} lvl={ramp(t, A.cart, A.cart + 0.35, 0.85, 0.04, eio)} /></div>)}
    </div>}
    {/* seesaw: one cartridge outweighs the whole printer */}
    {see && <div style={{position: 'absolute', inset: 0, opacity: swap}}>
      <div style={{position: 'absolute', left: 270 - 70, top: 560, width: 0, height: 0, borderLeft: '70px solid transparent', borderRight: '70px solid transparent', borderBottom: `140px solid ${INK}`}} />
      <div style={{position: 'absolute', left: 270 - 250, top: 548, width: 500, height: 20, transform: `rotate(${ang}deg)`, transformOrigin: '250px 10px'}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 10, background: '#f4b23c', border: `5px solid ${INK}`}} />
        <div style={{position: 'absolute', left: -6, bottom: 18, transform: `translate(${-60 * launch}px, ${-1100 * launch}px) rotate(${-560 * launch}deg)`}}><Printer w={210} {...st} /></div>
        <div style={{position: 'absolute', right: 34, bottom: 18}}><Cart c="#222" l="K" lvl={0.04} w={62} /></div>
        {bagT.map((b, i) => t >= b && <div key={i} style={{position: 'absolute', right: 96 - i * 40 + (i === 2 ? 60 : 0), bottom: 14 + (i === 2 ? 70 : 0), fontSize: 84, transform: `translateY(${ramp(t, b, b + 0.12, -600, 0, Easing.in(Easing.quad))}px)`}}>💰</div>)}
      </div>
    </div>}
    {t >= A.jam && <Badge ok={false} s={popS(t, A.jam)} x={416} y={28} />}
    <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: YEL, boxShadow: '0 0 18px rgba(0,0,0,.55)'}} />
  </div>;
};

/* ---------- printer pickup inside the game world → jams → paper explosion ---------- */
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const Pickup: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS;
  if (t < A.make || t >= A.wallahi + 0.2) return null;
  const jam = t >= A.beat; const col = jam ? '#ff2d55' : YEL;
  const inK = ramp(t, A.make, A.printers + 0.15, 0, 1, Easing.out(Easing.back(1.6)));
  const spin = jam ? 1 : Math.cos((t - A.make) * 3.2); const bob = jam ? 18 : Math.sin(t * 4.2) * 16;
  const boom = ramp(t, A.wallahi, A.wallahi + 0.15, 1, 2.2); const fade = ramp(t, A.wallahi, A.wallahi + 0.15, 1, 0);
  const st: PState = jam ? {lcd: Math.floor((t - A.beat) * 6) % 2 === 0 ? ['PAPER', 'JAM!'] : [], lcdBg: '#ff4d5e', lcdFg: '#fff', led: '#ff2d55'} : {lcd: ['READY'], lcdBg: '#a8e6b0', lcdFg: '#1d4d26', led: '#3ddc5a'};
  return <div style={{position: 'absolute', left: 0, top: SEAM, width: W, height: BH, overflow: 'hidden', opacity: fade}}>
    <div style={{position: 'absolute', left: 540 - 150, top: 0, width: 300, height: 450, opacity: 0.75 * inK, background: `linear-gradient(0deg, ${col}cc, ${col}00)`, filter: 'blur(6px)'}} />
    <div style={{position: 'absolute', left: 540 - 200, top: 440 - 200, width: 400, height: 400, transform: `scaleY(0.26) scale(${inK})`}}><div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `16px dashed ${col}`, boxShadow: `0 0 40px ${col}, inset 0 0 40px ${col}`, transform: `rotate(${t * 70}deg)`}} /></div>
    <div style={{position: 'absolute', left: 540 - 160, top: 140 + bob, width: 320, transform: `scale(${inK * boom}) scaleX(${0.25 + 0.75 * Math.abs(spin)}) rotate(${jam ? 9 : 0}deg)`, filter: `drop-shadow(0 0 22px ${col})`}}>
      <Printer w={320} {...st} /></div>
    {!jam && [0, 1, 2, 3, 4, 5].map((i) => { const a = i * 1.05 + t * 2.4; return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(a) * 250 - 24, top: 300 + Math.sin(a) * 120, fontSize: 48, opacity: inK}}>✨</div>; })}
  </div>;
};
const PaperStorm: React.FC = () => {
  const fr = useCurrentFrame(); const t = fr / FPS; if (t < A.wallahi) return null;
  const dt = t - A.wallahi; const ox = 540, oy = SEAM + 290;
  return <AbsoluteFill style={{pointerEvents: 'none'}}>
    {dt < 0.1 && <AbsoluteFill style={{background: '#fff', opacity: 1 - dt / 0.1}} />}
    {Array.from({length: 30}).map((_, i) => {
      const side = i % 2 ? 1 : -1; const ang = (side < 0 ? -165 + 40 * rnd(i) : -55 + 40 * rnd(i)) * Math.PI / 180, sp = 1300 + 900 * rnd(i + 50), g = 1300;  // fan out sideways: keep his burned-in caption clear
      const kd = 2.4, e = (1 - Math.exp(-kd * dt)) / kd;  // air drag → sheets flutter down instead of vanishing
      const x = ox + Math.cos(ang) * sp * e + Math.sin(dt * 4 + i) * 46 * Math.min(1, dt * 2), y = oy + Math.sin(ang) * sp * e + (g / kd) * (dt - e);
      const rx = dt * (300 + 400 * rnd(i + 9)), ry = dt * (200 + 500 * rnd(i + 19)), rz = dt * (180 - 360 * rnd(i + 29));
      return <div key={i} style={{position: 'absolute', left: x - 34, top: y - 44, width: 68, height: 88, background: '#fff', borderRadius: 4, boxShadow: '0 4px 10px rgba(0,0,0,.35)',
        transform: `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) rotate(${rz}deg)`,
        backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 14px, #c8ccd2 14px 17px)', backgroundSize: '50px 100%', backgroundPosition: '9px 12px', backgroundRepeat: 'no-repeat'}} />;
    })}
    {t >= A.rambo && <div style={{position: 'absolute', left: 830, top: SEAM - 95, fontSize: 200, transform: `rotate(-22deg) scale(${interpolate((t - A.rambo) * FPS, [0, 4, 7], [2.4, 0.92, 1], cl)})`, filter: 'drop-shadow(0 10px 14px rgba(0,0,0,.5))'}}>🩹</div>}
  </AbsoluteFill>;
};

const Seam: React.FC = () => <div style={{position: 'absolute', left: 0, top: SEAM - 4, width: W, height: 8, background: YEL, boxShadow: '0 0 16px rgba(0,0,0,.6)'}} />;

export const FbSplit3: React.FC = () => {
  const ready = useFontsReady('fb3'); const silk = useSilk();
  if (!ready || !silk) return <AbsoluteFill style={{background: '#000'}} />;
  return <AbsoluteFill style={{background: '#000'}}>
    <Presenter /><Gameplay /><Stage /><Pickup /><Seam /><PaperStorm />
    <Sequence><Audio src={staticFile('fb3/inf.mp4')} /></Sequence>
    <Sfx at={0} n="pw/whoosh" v={0.4} /><Sfx at={A.rock} n="pw/whoosh" v={0.3} /><Sfx at={A.works} n="pw/pop" v={0.45} />
    <Sfx at={A.mean} n="pw/whoosh" v={0.45} /><Sfx at={A.printer + 0.2} n="pw/impact" v={0.5} /><Sfx at={A.one} n="pw/whoosh" v={0.3} /><Sfx at={A.job} n="pw/tick" v={0.5} />
    <Sfx at={A.printing} n="fb3/feed" v={0.5} /><Sfx at={A.jam} n="fb3/beep" v={0.45} /><Sfx at={A.jam} n="pw/impact" v={0.3} />
    <Sfx at={A.theres} n="pw/whoosh" v={0.3} /><Sfx at={A.nopaper} n="pw/tick" v={0.4} />
    {[11.13, 11.27, 11.42, 11.57].map((s) => <Sfx key={s} at={s + 0.1} n="pw/tick" v={0.42} />)}
    <Sfx at={12.63} n="fb3/beep" v={0.35} />{[0, 1, 2, 3].map((i) => <Sfx key={i} at={A.ink + i * 0.07} n="pw/pop" v={0.3} />)}
    <Sfx at={A.costs} n="pw/whoosh" v={0.35} />{[A.more, A.than, A.printer2].map((s) => <Sfx key={s} at={s + 0.1} n="fb3/ching" v={0.42} />)}
    <Sfx at={A.printer2 + 0.1} n="pw/impact" v={0.4} /><Sfx at={A.itself} n="pw/whoosh" v={0.45} /><Sfx at={A.rock2} n="pw/whoosh" v={0.4} />
    <Sfx at={A.please} n="pw/pop" v={0.38} /><Sfx at={A.make} n="fb3/chime" v={0.5} /><Sfx at={A.beat} n="fb3/beep" v={0.42} />
    <Sfx at={A.wallahi} n="pw/crash" v={0.5} /><Sfx at={A.wallahi} n="fb3/crunch" v={0.5} /><Sfx at={A.rambo} n="pw/punch" v={0.5} />
  </AbsoluteFill>;
};
