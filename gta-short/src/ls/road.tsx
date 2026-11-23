/* Leonida Shifts — "road trip" presentation kit. The channel's own visual language: every piece of information is a
   physical roadside / in-car object (exit signs, speed signs, warning diamonds, price boards, odometers, sat-nav,
   rear-view mirror, toll receipt, car stereo, windshield + wiper). Chapters are gears 1–6 and exits on the road. */
import React from 'react';
import {Easing, interpolate} from 'remotion';
import {C, GRAD, HERO, UI, cl, eio, eo, ramp, useT, FPS} from './kit';

export const GREEN = '#0B6B46', BLUE = '#1257A8', YELLOW = '#FFCB05', ASPH = '#1d1c22';
const sign = (bg: string): React.CSSProperties => ({background: bg, borderRadius: 18, padding: 9, boxShadow: '0 26px 44px rgba(0,0,0,.55), 0 2px 0 rgba(255,255,255,.25) inset'});
const sheen = <div style={{position: 'absolute', inset: 0, borderRadius: 18, background: 'linear-gradient(115deg, rgba(255,255,255,.22) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 70%, rgba(255,255,255,.08) 100%)', pointerEvents: 'none'}} />;
export const springIn = (t: number, t0: number, k = 16, d = 5.5) => (t < t0 ? 0 : 1 - Math.exp(-d * (t - t0)) * Math.cos(k * (t - t0)));

/* ---------- green highway exit sign (chapters / big labels) ---------- */
export const ExitSign: React.FC<{exit?: string; title: string; sub?: string; arrow?: string; w?: number; size?: number; color?: string}> = ({exit, title, sub, arrow = '↗', w, size = 74, color = GREEN}) =>
  <div style={{position: 'relative', display: 'inline-block', width: w}}>
    {exit && <div style={{position: 'absolute', right: 26, top: -size * 0.62, ...sign(color), padding: 5, borderRadius: 10}}>
      <div style={{border: '3px solid #fff', borderRadius: 7, padding: `4px ${size * 0.22}px`, fontFamily: UI, fontSize: size * 0.34, color: '#fff', letterSpacing: 2}}>{exit}</div></div>}
    <div style={{position: 'relative', ...sign(color)}}>
      <div style={{border: '4px solid #fff', borderRadius: 12, padding: `${size * 0.28}px ${size * 0.45}px`, display: 'flex', alignItems: 'center', gap: size * 0.4}}>
        <div style={{flex: 1}}>
          <div style={{fontFamily: HERO, fontSize: size, color: '#fff', lineHeight: 1, letterSpacing: -1, whiteSpace: 'nowrap'}}>{title}</div>
          {sub && <div style={{fontFamily: UI, fontSize: size * 0.3, color: '#fff', opacity: 0.9, letterSpacing: 3, marginTop: size * 0.16, whiteSpace: 'nowrap', textTransform: 'uppercase'}}>{sub}</div>}
        </div>
        {arrow && <div style={{fontFamily: HERO, fontSize: size * 1.05, color: '#fff', lineHeight: 1}}>{arrow}</div>}
      </div>
      {sheen}
    </div>
  </div>;

/* overhead gantry that drops in with the chapter sign */
export const Gantry: React.FC<{t0: number; t1: number; exit: string; title: string; sub: string}> = ({t0, t1, exit, title, sub}) => {
  const t = useT(); if (t < t0 - 0.05 || t > t1 + 0.5) return null;
  const drop = springIn(t, t0, 14, 6); const up = ramp(t, t1, t1 + 0.45, 0, 1, Easing.in(Easing.cubic));
  const y = -560 + 560 * drop - 640 * up; const swing = (t < t1 ? Math.exp(-4 * (t - t0)) * Math.sin((t - t0) * 9) * 2.4 : 0);
  return <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 560, transform: `translateY(${y}px)`}}>
    {/* truss */}
    <div style={{position: 'absolute', left: -40, right: -40, top: 40, height: 54, background: 'linear-gradient(180deg,#9aa0a8,#5d636c)', boxShadow: '0 14px 30px rgba(0,0,0,.5)'}} />
    <div style={{position: 'absolute', left: -40, right: -40, top: 50, height: 34, backgroundImage: 'repeating-linear-gradient(60deg, transparent 0 22px, rgba(40,44,50,.85) 22px 28px), repeating-linear-gradient(-60deg, transparent 0 22px, rgba(40,44,50,.85) 22px 28px)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 94, display: 'flex', justifyContent: 'center', transformOrigin: '50% 0', transform: `rotate(${swing}deg)`}}>
      <div style={{position: 'relative'}}>
        {[90, -90].map((dx) => <div key={dx} style={{position: 'absolute', left: dx > 0 ? 90 : undefined, right: dx < 0 ? 90 : undefined, top: -14, width: 14, height: 40, background: '#6b7079'}} />)}
        <div style={{marginTop: 22}}><ExitSign exit={exit} title={title} sub={sub} size={92} arrow="↓" /></div>
      </div>
    </div>
  </div>;
};

/* small "next exit" teaser (retention bridge) */
export const NextExit: React.FC<{t0: number; t1: number; label: string; dist?: string}> = ({t0, t1, label, dist = '½ MI'}) => {
  const t = useT(); if (t < t0 || t > t1 + 0.3) return null;
  const e = springIn(t, t0, 15, 6); const o = ramp(t, t1, t1 + 0.25, 1, 0);
  return <div style={{position: 'absolute', right: 56, bottom: 92, transform: `translateX(${(1 - e) * 520}px)`, opacity: o}}>
    <ExitSign title={label} sub={`NEXT EXIT · ${dist}`} size={40} arrow="↗" />
  </div>;
};

/* ---------- regulatory sign (speed-limit layout) ---------- */
export const ScoreSign: React.FC<{top: string; big: string; bottom?: string; w?: number; ink?: string}> = ({top, big, bottom, w = 300, ink = '#111'}) =>
  <div style={{position: 'relative', width: w, ...sign('#f7f7f2'), padding: 10}}>
    <div style={{border: `${w * 0.022}px solid ${ink}`, borderRadius: 12, padding: `${w * 0.06}px 0 ${w * 0.05}px`, textAlign: 'center'}}>
      <div style={{fontFamily: UI, fontSize: w * 0.12, letterSpacing: w * 0.012, color: ink, lineHeight: 1.05}}>{top}</div>
      <div style={{fontFamily: HERO, fontSize: w * 0.56, color: ink, lineHeight: 0.95, letterSpacing: -w * 0.02}}>{big}</div>
      {bottom && <div style={{fontFamily: UI, fontSize: w * 0.085, letterSpacing: w * 0.01, color: ink, marginTop: w * 0.02}}>{bottom}</div>}
    </div>{sheen}
  </div>;

/* ---------- yellow warning diamond ---------- */
export const Warn: React.FC<{lines: string[]; size?: number; t0?: number; icon?: string; color?: string}> = ({lines, size = 300, t0, icon, color = YELLOW}) => {
  const t = useT(); const wob = t0 !== undefined ? Math.exp(-5 * Math.max(0, t - t0)) * Math.sin(Math.max(0, t - t0) * 16) * 7 : 0;
  return <div style={{position: 'relative', width: size, height: size, transform: `rotate(${wob}deg)`}}>
    <div style={{position: 'absolute', inset: size * 0.146, transform: 'rotate(45deg)', background: color, borderRadius: size * 0.06, boxShadow: '0 22px 40px rgba(0,0,0,.55)'}}>
      <div style={{position: 'absolute', inset: size * 0.03, border: `${size * 0.022}px solid #111`, borderRadius: size * 0.04}} />
    </div>
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
      {icon && <div style={{fontSize: size * 0.16, lineHeight: 1, marginBottom: size * 0.02}}>{icon}</div>}
      {lines.map((l, i) => <div key={i} style={{fontFamily: HERO, fontSize: size * (l.length > 9 ? 0.085 : 0.11), color: '#111', lineHeight: 1.02, letterSpacing: -0.5, whiteSpace: 'nowrap'}}>{l}</div>)}
    </div>
  </div>;
};
/* red prohibition sign (circle + slash over a word) */
export const NoSign: React.FC<{word: string; size?: number}> = ({word, size = 260}) =>
  <div style={{position: 'relative', width: size, height: size, borderRadius: '50%', background: '#fff', boxShadow: '0 22px 40px rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{fontFamily: HERO, fontSize: size * 0.16, color: '#111'}}>{word}</div>
    <div style={{position: 'absolute', inset: size * 0.04, borderRadius: '50%', border: `${size * 0.075}px solid #E2231A`}} />
    <div style={{position: 'absolute', left: '50%', top: size * 0.08, width: size * 0.075, height: size * 0.84, marginLeft: -size * 0.0375, background: '#E2231A', transform: 'rotate(45deg)'}} />
  </div>;

/* ---------- printed citation slip (sources) ---------- */
export const Citation: React.FC<{t0: number; lines: string[]; w?: number; rot?: number}> = ({t0, lines, w = 470, rot = -2}) => {
  const t = useT(); const p = ramp(t, t0, t0 + 0.45, 0, 100, Easing.out(Easing.quad));
  const zig = Array.from({length: 24}, (_, i) => `${(i / 23) * 100}% ${i % 2 ? 100 : 96}%`).join(',');
  return <div style={{width: w, transform: `rotate(${rot}deg)`, filter: 'drop-shadow(0 14px 18px rgba(0,0,0,.5))', clipPath: `inset(0 0 ${100 - p}% 0)`}}>
    <div style={{background: '#FFF6E2', padding: '16px 22px 24px', clipPath: `polygon(0 0,100% 0,${zig},0 100%)`, fontFamily: UI, color: '#2a2230', textTransform: 'uppercase'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 14, letterSpacing: 3, color: '#c2185b', borderBottom: '2px dashed #d9c9b0', paddingBottom: 8, marginBottom: 10}}><span>◉ SOURCE CITATION</span><span>LS-01</span></div>
      {lines.map((l, i) => <div key={i} style={{fontSize: i === 0 ? 24 : 17, letterSpacing: i === 0 ? 1.5 : 1.8, lineHeight: 1.35, color: i === 0 ? '#16101c' : '#5a4e60'}}>{l}</div>)}
    </div>
  </div>;
};

/* ---------- gas-station price board ---------- */
export const PriceBoard: React.FC<{title: string; rows: {label: string; node: React.ReactNode; dim?: boolean}[]; w?: number}> = ({title, rows, w = 760}) =>
  <div style={{width: w, borderRadius: 22, overflow: 'hidden', background: '#0b0b0e', border: '6px solid #e9e9ee', boxShadow: '0 30px 60px rgba(0,0,0,.6)'}}>
    <div style={{background: GRAD, padding: '14px 26px', fontFamily: HERO, fontSize: 34, color: '#fff', letterSpacing: 1}}>{title}</div>
    {rows.map((r, i) => <div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 26px', borderTop: i ? '2px solid #26262c' : undefined, opacity: r.dim ? 0.75 : 1}}>
      <div style={{fontFamily: UI, fontSize: 26, color: '#fff', letterSpacing: 2, textTransform: 'uppercase', whiteSpace: 'pre-line'}}>{r.label}</div>
      <div>{r.node}</div></div>)}
  </div>;
export const Led: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 86, color = '#FFB000'}) =>
  <div style={{fontFamily: HERO, fontSize: size, color, letterSpacing: 1, lineHeight: 1, textShadow: `0 0 18px ${color}, 0 0 4px ${color}`, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>{children}</div>;

/* ---------- odometer (rolling digit wheels) ---------- */
export const Odometer: React.FC<{t0: number; to: number; digits: number; dur?: number; size?: number; dec?: number; suffix?: string}> = ({t0, to, digits, dur = 1.6, size = 96, dec = 0, suffix}) => {
  const t = useT(); const v = to * ramp(t, t0, t0 + dur, 0, 1, Easing.out(Easing.cubic)) * 10 ** dec; const hh = size * 1.18;
  const wheels = [] as React.ReactNode[];
  for (let i = digits - 1; i >= 0; i--) {
    const unit = 10 ** i; let pos = Math.floor(v / unit) % 10; const rem = (v % unit) / unit;
    if (i === 0) pos += rem; else if (rem > 0.92) pos += (rem - 0.92) / 0.08;     // carry rolls like a real odometer
    const isDec = dec > 0 && i < dec;
    wheels.push(<React.Fragment key={i}>
      {dec > 0 && i === dec - 1 && <div style={{fontFamily: HERO, fontSize: size * 0.8, color: '#fff', alignSelf: 'flex-end', margin: '0 2px'}}>.</div>}
      <div style={{width: size * 0.72, height: hh, overflow: 'hidden', borderRadius: 8, background: isDec ? 'linear-gradient(180deg,#f2f2f2,#c9c9c9)' : 'linear-gradient(180deg,#0c0c0f,#24242a 50%,#0c0c0f)', boxShadow: 'inset 0 6px 10px rgba(0,0,0,.6), inset 0 -6px 10px rgba(0,0,0,.6)'}}>
        <div style={{transform: `translateY(${-(pos % 10) * hh}px)`}}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d, k) => <div key={k} style={{height: hh, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HERO, fontSize: size, color: isDec ? '#111' : '#fff'}}>{d}</div>)}
        </div></div></React.Fragment>);
  }
  return <div style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: 12, borderRadius: 16, background: 'linear-gradient(180deg,#3a3a42,#17171c)', border: '3px solid #8d8f98', boxShadow: '0 24px 40px rgba(0,0,0,.55)'}}>
    {wheels}{suffix && <div style={{fontFamily: UI, fontSize: size * 0.3, color: '#fff', letterSpacing: 2, marginLeft: 12}}>{suffix}</div>}
  </div>;
};

/* ---------- dial gauge (speedo / fuel / difficulty) ---------- */
export const Gauge: React.FC<{t0: number; value: number; max: number; label: string; big: string; size?: number; ticks?: number; endLabels?: [string, string]; col?: string}> = ({t0, value, max, label, big, size = 340, ticks = 10, endLabels, col = C.pink}) => {
  const t = useT(); const p = (value / max) * springIn(t, t0, 10, 4.5); const a0 = -120, a1 = 120; const ang = a0 + (a1 - a0) * Math.max(0, Math.min(1.04, p));
  const r = 140; const arc = (a: number) => [160 + r * Math.sin((a * Math.PI) / 180), 170 - r * Math.cos((a * Math.PI) / 180)];
  const [sx, sy] = arc(a0), [ex, ey] = arc(a0 + (a1 - a0) * Math.max(0, Math.min(1, p)));
  return <div style={{width: size, height: size * 0.92, position: 'relative', borderRadius: '50% 50% 22% 22%', background: 'radial-gradient(circle at 50% 46%, #22202a 0%, #0c0b10 70%)', border: '5px solid #8d8f98', boxShadow: '0 26px 46px rgba(0,0,0,.6)'}}>
    <svg viewBox="0 0 320 300" width={size} height={size * 0.92 - 10}>
      <path d={`M${sx} ${sy} A${r} ${r} 0 1 1 ${arc(a1)[0]} ${arc(a1)[1]}`} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={14} strokeLinecap="round" />
      <path d={`M${sx} ${sy} A${r} ${r} 0 ${(a1 - a0) * Math.min(1, p) > 180 ? 1 : 0} 1 ${ex} ${ey}`} fill="none" stroke={col} strokeWidth={14} strokeLinecap="round" style={{filter: `drop-shadow(0 0 8px ${col})`}} />
      {Array.from({length: ticks + 1}, (_, i) => { const a = a0 + ((a1 - a0) * i) / ticks; const [x1, y1] = [160 + 116 * Math.sin((a * Math.PI) / 180), 170 - 116 * Math.cos((a * Math.PI) / 180)]; const [x2, y2] = [160 + 100 * Math.sin((a * Math.PI) / 180), 170 - 100 * Math.cos((a * Math.PI) / 180)];
        return <g key={i}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={3} />{!endLabels && <text x={160 + 82 * Math.sin((a * Math.PI) / 180)} y={176 - 82 * Math.cos((a * Math.PI) / 180)} fill="#fff" fontFamily={UI} fontSize={17} textAnchor="middle">{Math.round((max * i) / ticks)}</text>}</g>; })}
      {endLabels && <><text x={arc(a0)[0] + 6} y={arc(a0)[1] + 34} fill="#fff" fontFamily={HERO} fontSize={26} textAnchor="middle">{endLabels[0]}</text><text x={arc(a1)[0] - 6} y={arc(a1)[1] + 34} fill="#fff" fontFamily={HERO} fontSize={26} textAnchor="middle">{endLabels[1]}</text></>}
      <g transform={`rotate(${ang} 160 170)`}><path d="M156 172 L160 58 L164 172 Z" fill="#ff3b3b" /><circle cx={160} cy={170} r={13} fill="#ddd" stroke="#333" strokeWidth={3} /></g>
    </svg>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: size * 0.07, textAlign: 'center'}}>
      <div style={{fontFamily: HERO, fontSize: size * 0.15, color: '#fff', lineHeight: 1}}>{big}</div>
      <div style={{fontFamily: UI, fontSize: size * 0.055, color: C.mute, letterSpacing: 3, marginTop: 6}}>{label}</div></div>
  </div>;
};

/* ---------- rear-view mirror ---------- */
export const Mirror: React.FC<{w?: number; label: string; children: React.ReactNode}> = ({w = 760, label, children}) =>
  <div style={{position: 'relative', width: w}}>
    <div style={{position: 'absolute', left: '50%', top: -70, width: 26, height: 80, marginLeft: -13, background: 'linear-gradient(90deg,#2a2a2f,#55565e,#2a2a2f)', borderRadius: 8}} />
    <div style={{position: 'relative', borderRadius: '46px / 60px', padding: 14, background: 'linear-gradient(180deg,#5b5d66,#1c1c22)', boxShadow: '0 30px 50px rgba(0,0,0,.6)'}}>
      <div style={{position: 'relative', borderRadius: '36px / 50px', overflow: 'hidden', background: 'linear-gradient(180deg, rgba(40,60,90,.92), rgba(18,12,30,.95))', padding: '26px 40px 30px'}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,.18) 0%, transparent 30%, transparent 70%, rgba(255,255,255,.06) 100%)'}} />
        <div style={{fontFamily: UI, fontSize: 20, color: C.mute, letterSpacing: 4, marginBottom: 14}}>{label}</div>
        {children}
        <div style={{position: 'absolute', right: 26, bottom: 10, fontFamily: UI, fontSize: 12, color: 'rgba(255,255,255,.45)', letterSpacing: 1.5}}>OBJECTS IN MIRROR ARE OLDER THAN THEY APPEAR</div>
      </div></div>
  </div>;

/* ---------- roadside billboard ---------- */
export const Billboard: React.FC<{w: number; h: number; children: React.ReactNode}> = ({w, h, children}) =>
  <div style={{position: 'relative', width: w, height: h + 150}}>
    {[0.22, 0.78].map((k) => <div key={k} style={{position: 'absolute', left: w * k - 14, top: h - 10, width: 28, height: 170, background: 'linear-gradient(90deg,#4a4c54,#8b8e96,#4a4c54)'}} />)}
    <div style={{position: 'absolute', left: w * 0.08, right: w * 0.08, top: h + 8, height: 10, background: '#6d7078'}} />
    <div style={{position: 'absolute', inset: 0, height: h, borderRadius: 10, padding: 12, background: 'linear-gradient(180deg,#e7e7ea,#a9abb3)', boxShadow: '0 30px 60px rgba(0,0,0,.6)'}}>
      <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 4, overflow: 'hidden', background: '#120a20'}}>{children}</div>
    </div>
    {[0.25, 0.5, 0.75].map((k) => <div key={k} style={{position: 'absolute', left: w * k - 20, top: -26, width: 40, height: 18, borderRadius: '6px 6px 2px 2px', background: '#55575f', boxShadow: '0 10px 30px 8px rgba(255,236,190,.35)'}} />)}
  </div>;

/* ---------- toll-booth receipt ---------- */
export const Receipt: React.FC<{t0: number; title: string; rows: [string, string][]; w?: number; foot?: string}> = ({t0, title, rows, w = 520, foot}) => {
  const t = useT(); const p = ramp(t, t0, t0 + 0.9, 0, 100, Easing.out(Easing.quad));
  return <div style={{width: w, clipPath: `inset(0 0 ${100 - p}% 0)`, filter: 'drop-shadow(0 18px 22px rgba(0,0,0,.5))'}}>
    <div style={{background: '#FBF7EE', padding: '26px 30px 34px', fontFamily: UI, color: '#1b1720', textTransform: 'uppercase', clipPath: 'polygon(0 0,100% 0,100% 97%,96% 100%,92% 97%,88% 100%,84% 97%,80% 100%,76% 97%,72% 100%,68% 97%,64% 100%,60% 97%,56% 100%,52% 97%,48% 100%,44% 97%,40% 100%,36% 97%,32% 100%,28% 97%,24% 100%,20% 97%,16% 100%,12% 97%,8% 100%,4% 97%,0 100%)'}}>
      <div style={{textAlign: 'center', fontFamily: HERO, fontSize: 34, letterSpacing: 1}}>{title}</div>
      <div style={{textAlign: 'center', fontSize: 15, letterSpacing: 3, color: '#7a6e80', margin: '6px 0 14px'}}>LEONIDA SHIFTS · PATCH TOLL</div>
      <div style={{borderTop: '2px dashed #c9bfae', margin: '8px 0'}} />
      {rows.map(([a, b], i) => <div key={i} style={{display: 'flex', justifyContent: 'space-between', fontSize: 23, letterSpacing: 1.4, padding: '8px 0'}}><span style={{color: '#5d5363'}}>{a}</span><span style={{fontFamily: HERO}}>{b}</span></div>)}
      <div style={{borderTop: '2px dashed #c9bfae', margin: '10px 0'}} />
      {foot && <div style={{textAlign: 'center', fontSize: 15, letterSpacing: 2.4, color: '#7a6e80'}}>{foot}</div>}
      <div style={{marginTop: 14, height: 46, backgroundImage: 'repeating-linear-gradient(90deg,#1b1720 0 3px,transparent 3px 6px,#1b1720 6px 7px,transparent 7px 11px)'}} />
    </div>
  </div>;
};

/* ---------- split-flap departures board ---------- */
export const Departures: React.FC<{t0: number; rows: [string, string, string][]; w?: number; title: string}> = ({t0, rows, w = 900, title}) => {
  const t = useT(); const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%+≤ ·';
  const flap = (s: string, at: number) => s.split('').map((c, i) => { const done = t > at + i * 0.03 + 0.25; const r = CH[Math.floor((t * 40 + i * 7) % CH.length)];
    return <span key={i} style={{display: 'inline-block', width: '0.66em', textAlign: 'center', background: '#141418', margin: '0 1px', borderRadius: 3, borderBottom: '2px solid #000'}}>{t < at ? ' ' : done ? c : r}</span>; });
  return <div style={{width: w, borderRadius: 18, background: '#0a0a0d', border: '4px solid #3a3b42', padding: '20px 24px', boxShadow: '0 30px 60px rgba(0,0,0,.6)'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: UI, fontSize: 22, color: '#FFC83D', letterSpacing: 4, marginBottom: 14}}><span>{title}</span><span>STATUS</span></div>
    {rows.map(([a, b, c], i) => <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: UI, fontSize: 34, color: '#f4f4f4', padding: '8px 0', borderTop: '1px solid #222'}}>
      <span>{flap(a, t0 + i * 0.35)}</span><span style={{color: c === 'GREEN' ? C.teal : '#FFC83D'}}>{flap(b, t0 + i * 0.35 + 0.2)}</span></div>)}
  </div>;
};

/* ---------- sat-nav device ---------- */
export const SatNav: React.FC<{w: number; h: number; banner: string; bannerSub?: string; eta?: string; children: React.ReactNode}> = ({w, h, banner, bannerSub, eta, children}) =>
  <div style={{width: w, padding: 16, borderRadius: 34, background: 'linear-gradient(180deg,#2c2d34,#0f0f13)', boxShadow: '0 34px 70px rgba(0,0,0,.65), inset 0 2px 0 rgba(255,255,255,.12)'}}>
    <div style={{position: 'relative', height: h, borderRadius: 20, overflow: 'hidden', background: 'radial-gradient(circle at 50% 40%, #1d2438 0%, #0b0d16 80%)'}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(120,150,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,255,.07) 1px, transparent 1px)', backgroundSize: '48px 48px'}} />
      {children}
      <div style={{position: 'absolute', left: 14, right: 14, top: 14, display: 'flex', alignItems: 'center', gap: 18, padding: '12px 20px', borderRadius: 14, background: '#0E7A4F', boxShadow: '0 10px 24px rgba(0,0,0,.45)'}}>
        <div style={{fontFamily: HERO, fontSize: 46, color: '#fff', lineHeight: 1}}>↱</div>
        <div><div style={{fontFamily: HERO, fontSize: 32, color: '#fff', lineHeight: 1.05, whiteSpace: 'nowrap'}}>{banner}</div>{bannerSub && <div style={{fontFamily: UI, fontSize: 17, color: 'rgba(255,255,255,.85)', letterSpacing: 2, marginTop: 3, whiteSpace: 'nowrap'}}>{bannerSub}</div>}</div>
      </div>
      {eta && <div style={{position: 'absolute', left: 14, right: 14, bottom: 14, padding: '10px 18px', borderRadius: 12, background: 'rgba(10,10,14,.88)', fontFamily: UI, fontSize: 20, color: '#fff', letterSpacing: 2, display: 'flex', justifyContent: 'space-between'}}><span>{eta}</span><span style={{color: C.teal}}>● LIVE</span></div>}
    </div>
  </div>;

/* ---------- car stereo head unit ---------- */
export const Stereo: React.FC<{w?: number; line1: string; line2: string; freq: string; lit?: number}> = ({w = 820, line1, line2, freq, lit = 0}) =>
  <div style={{width: w, padding: '22px 26px', borderRadius: 18, background: 'linear-gradient(180deg,#2b2c33,#0d0d11)', border: '3px solid #55565e', boxShadow: '0 30px 60px rgba(0,0,0,.6)', display: 'flex', gap: 22, alignItems: 'center'}}>
    <div style={{width: 96, height: 96, borderRadius: 48, background: 'radial-gradient(circle,#55565e,#1c1c22)', border: '3px solid #777', boxShadow: 'inset 0 4px 8px rgba(0,0,0,.6)'}} />
    <div style={{flex: 1, height: 130, borderRadius: 10, background: 'linear-gradient(180deg,#1a1405,#0d0a02)', border: '2px solid #000', padding: '14px 20px', boxShadow: 'inset 0 0 24px rgba(255,176,0,.18)'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: UI, fontSize: 18, color: '#FFB000', letterSpacing: 3, opacity: 0.85}}><span>FM ▸ {freq}</span><span>ST ◉</span></div>
      <div style={{fontFamily: HERO, fontSize: 46, color: '#FFB000', textShadow: '0 0 14px #FFB000', marginTop: 6, whiteSpace: 'nowrap'}}>{line1}</div>
      <div style={{fontFamily: UI, fontSize: 20, color: '#FFB000', letterSpacing: 3, opacity: 0.85, whiteSpace: 'nowrap'}}>{line2}</div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 52px)', gap: 10}}>{[1, 2, 3, 4, 5, 6].map((n) => <div key={n} style={{height: 40, borderRadius: 8, background: n === lit ? '#FFB000' : '#2a2b31', color: n === lit ? '#111' : '#bbb', fontFamily: UI, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: n === lit ? '0 0 16px #FFB000' : 'none'}}>{n}</div>)}</div>
  </div>;

/* ---------- parking meter ---------- */
export const Meter: React.FC<{t0: number; dur: number; w?: number}> = ({t0, dur, w = 250}) => {
  const t = useT(); const left = Math.max(0, 1 - ramp(t, t0, t0 + dur, 0, 1, Easing.linear)); const exp = left <= 0;
  return <div style={{width: w, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <div style={{width: w, height: w * 1.05, borderRadius: `${w * 0.5}px ${w * 0.5}px ${w * 0.12}px ${w * 0.12}px`, background: 'linear-gradient(180deg,#8f949e,#4d5059)', padding: w * 0.08, boxShadow: '0 24px 40px rgba(0,0,0,.6)'}}>
      <div style={{position: 'relative', height: '62%', borderRadius: `${w * 0.4}px ${w * 0.4}px 10px 10px`, background: '#f3f1e8', overflow: 'hidden', border: '4px solid #2b2d33'}}>
        <div style={{position: 'absolute', left: '50%', bottom: 8, width: 6, height: '78%', marginLeft: -3, background: '#E2231A', transformOrigin: '50% 100%', transform: `rotate(${-70 + 140 * (1 - left)}deg)`}} />
        {exp && Math.floor(t * 4) % 2 === 0 && <div style={{position: 'absolute', left: 0, right: 0, top: 18, textAlign: 'center', fontFamily: HERO, fontSize: w * 0.15, color: '#E2231A'}}>EXPIRED</div>}
      </div>
      <div style={{marginTop: 12, textAlign: 'center', fontFamily: UI, fontSize: w * 0.08, color: '#fff', letterSpacing: 2}}>GLITCH TIME LEFT</div>
    </div>
    <div style={{width: w * 0.16, height: w * 0.9, background: 'linear-gradient(90deg,#3c3e46,#7b7e88,#3c3e46)'}} />
  </div>;
};

/* ---------- windshield bug splats + wiper ---------- */
export const Splat: React.FC<{x: number; y: number; t0: number; s?: number; seed?: number}> = ({x, y, t0, s = 1, seed = 1}) => {
  const t = useT(); if (t < t0) return null; const k = interpolate((t - t0) * FPS, [0, 3, 6], [0.2, 1.15, 1], cl);
  const blobs = Array.from({length: 9}, (_, i) => { const a = (i / 9) * Math.PI * 2 + seed; const r = 46 + ((seed * 37 + i * 53) % 40); return [Math.cos(a) * r, Math.sin(a) * r, 8 + ((seed * 13 + i * 7) % 14)]; });
  return <svg style={{position: 'absolute', left: x - 120 * s, top: y - 120 * s, overflow: 'visible'}} width={240 * s} height={240 * s} viewBox="-120 -120 240 240">
    <g transform={`scale(${k * s})`} opacity={0.92}>
      <ellipse rx={44} ry={36} fill="#c9d93a" opacity={0.75} />
      {blobs.map(([bx, by, br], i) => <g key={i}><line x1={0} y1={0} x2={bx} y2={by} stroke="#b7c92e" strokeWidth={br * 0.6} strokeLinecap="round" opacity={0.7} /><circle cx={bx} cy={by} r={br} fill="#d3e04a" opacity={0.8} /></g>)}
      <ellipse rx={16} ry={11} fill="#3b2d16" /><circle cx={-5} cy={-4} r={4} fill="#fff" opacity={0.6} />
    </g></svg>;
};
export const Wiper: React.FC<{t0: number; dur?: number}> = ({t0, dur = 0.7}) => {
  const t = useT(); if (t < t0 || t > t0 + dur) return null; const p = ramp(t, t0, t0 + dur, 0, 1, eio); const ang = -80 + 160 * Math.sin(p * Math.PI);
  return <div style={{position: 'absolute', left: 960 - 10, top: 1180, width: 20, height: 1250, transformOrigin: '50% 0', transform: `rotate(${180 + ang}deg)`}}>
    <div style={{position: 'absolute', left: -6, top: 0, width: 32, height: 1250, background: 'linear-gradient(90deg,#0d0d10,#3a3b42,#0d0d10)', borderRadius: 16, boxShadow: '0 0 30px rgba(0,0,0,.7)'}} /></div>;
};
/* wipe mask: splats are cleared where the wiper has swept */
export const wipeClear = (t: number, t0: number, dur = 0.7) => (t < t0 ? 1 : t > t0 + dur * 0.55 ? 0 : 1 - ramp(t, t0, t0 + dur * 0.55));

/* ---------- warning tape across frame ---------- */
export const Tape: React.FC<{t0: number; t1: number; text: string; y: number; rot?: number; color?: string}> = ({t0, t1, text, y, rot = -4, color = YELLOW}) => {
  const t = useT(); if (t < t0 || t > t1 + 0.4) return null; const p = ramp(t, t0, t0 + 0.35, 0, 1, eo) * ramp(t, t1, t1 + 0.35, 1, 0, eo); const drift = (t - t0) * 60;
  return <div style={{position: 'absolute', left: -200, top: y, width: 2400, height: 78, transform: `rotate(${rot}deg) scaleX(${p})`, transformOrigin: rot < 0 ? '0 50%' : '100% 50%', background: color, overflow: 'hidden', boxShadow: '0 14px 30px rgba(0,0,0,.5)', borderTop: '6px solid #111', borderBottom: '6px solid #111'}}>
    <div style={{whiteSpace: 'nowrap', fontFamily: HERO, fontSize: 44, color: '#111', lineHeight: '66px', transform: `translateX(${-drift}px)`, letterSpacing: 2}}>{Array.from({length: 14}).map(() => `${text}  ✕  `).join('')}</div></div>;
};

/* ---------- UK blue motorway services sign ---------- */
export const BlueSign: React.FC<{title: string; rows: {icon: string; text: string; at: number}[]; w?: number}> = ({title, rows, w = 760}) => {
  const t = useT();
  return <div style={{position: 'relative', width: w, ...sign(BLUE)}}>
    <div style={{border: '4px solid #fff', borderRadius: 12, padding: '22px 30px'}}>
      <div style={{fontFamily: HERO, fontSize: 46, color: '#fff', marginBottom: 14}}>{title}</div>
      {rows.map((r, i) => <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '10px 0', opacity: ramp(t, r.at, r.at + 0.2), transform: `translateX(${ramp(t, r.at, r.at + 0.35, -40, 0, eo)}px)`}}>
        <div style={{width: 64, height: 64, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40}}>{r.icon}</div>
        <div style={{fontFamily: UI, fontSize: 30, color: '#fff', letterSpacing: 1.5, textTransform: 'uppercase'}}>{r.text}</div>
        <div style={{marginLeft: 'auto', fontFamily: HERO, fontSize: 40, color: C.teal, opacity: ramp(t, r.at + 0.3, r.at + 0.45)}}>✓</div></div>)}
    </div>{sheen}
  </div>;
};

/* ---------- licence-plate label ---------- */
export const Plate: React.FC<{top: string; main: string; bottom?: string; w?: number}> = ({top, main, bottom, w = 420}) =>
  <div style={{position: 'relative', width: w, height: w * 0.5, borderRadius: w * 0.05, background: '#f8f6f0', border: '4px solid #2a2530', boxShadow: '0 20px 34px rgba(0,0,0,.55)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: w * 0.1, background: GRAD}} />
    <div style={{position: 'absolute', top: w * 0.012, fontFamily: UI, fontSize: w * 0.055, color: '#fff', letterSpacing: w * 0.012}}>{top}</div>
    <div style={{fontFamily: HERO, fontSize: Math.min(w * 0.17, (w * 0.86) / (main.length * 0.62)), color: '#1a1424', letterSpacing: 1, marginTop: w * 0.05, whiteSpace: 'nowrap'}}>{main}</div>
    {bottom && <div style={{fontFamily: UI, fontSize: w * 0.045, color: '#6b5f73', letterSpacing: w * 0.01, marginTop: 2}}>{bottom}</div>}
    {[[0.06, 0.2], [0.94, 0.2], [0.06, 0.85], [0.94, 0.85]].map(([x, y], i) => <div key={i} style={{position: 'absolute', left: w * x - 6, top: w * 0.5 * y - 6, width: 12, height: 12, borderRadius: 6, background: '#a7a3ad'}} />)}
  </div>;

/* ---------- persistent HUD: gear indicator + road progress with exits ---------- */
export const HUD: React.FC<{chapters: {t: number; name: string}[]; end: number; vis: number}> = ({chapters, end, vis}) => {
  const t = useT(); let g = 0; chapters.forEach((c, i) => { if (t >= c.t) g = i + 1; });
  const cur = g ? chapters[g - 1] : null; const since = cur ? t - cur.t : 99; const shiftK = since < 0.5 ? Math.exp(-since * 9) * Math.sin(since * 40) * 6 : 0;
  const p = Math.min(1, t / end);
  return <div style={{position: 'absolute', inset: 0, opacity: vis, pointerEvents: 'none'}}>
    {/* gear cluster top-right */}
    {cur && <div style={{position: 'absolute', right: 44, top: 36, display: 'flex', alignItems: 'center', gap: 16, padding: '10px 20px 10px 12px', borderRadius: 16, background: 'rgba(12,8,20,.82)', border: '2px solid rgba(255,255,255,.22)', transform: `translateX(${shiftK}px)`}}>
      <div style={{width: 62, height: 62, borderRadius: 12, background: '#0c0c10', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HERO, fontSize: 46, color: C.teal, textShadow: `0 0 14px ${C.teal}`}}>{g}</div>
      <div><div style={{fontFamily: UI, fontSize: 15, letterSpacing: 3, color: C.mute}}>GEAR {g} OF 6</div><div style={{fontFamily: HERO, fontSize: 28, color: '#fff', whiteSpace: 'nowrap'}}>{cur.name}</div></div>
    </div>}
    {/* road progress */}
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 22, background: ASPH, borderTop: '2px solid #3a3a42'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 10, height: 3, backgroundImage: 'repeating-linear-gradient(90deg, #FFCB05 0 26px, transparent 26px 50px)', opacity: 0.85}} />
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${p * 100}%`, background: 'linear-gradient(90deg, rgba(255,79,176,.25), rgba(255,154,60,.45))'}} />
      {chapters.map((c, i) => <div key={i} style={{position: 'absolute', left: `${(c.t / end) * 100}%`, bottom: 20, transform: 'translateX(-50%)', padding: '2px 8px', borderRadius: 5, background: t >= c.t ? GREEN : '#2f3a35', border: '2px solid #fff', fontFamily: UI, fontSize: 13, color: '#fff', letterSpacing: 1}}>{i + 1}</div>)}
      <div style={{position: 'absolute', left: `calc(${p * 100}% - 22px)`, top: 3, width: 40, height: 16, borderRadius: 6, background: GRAD, boxShadow: `0 0 12px ${C.pink}`}}>
        <div style={{position: 'absolute', left: 24, top: 3, width: 10, height: 10, borderRadius: 2, background: 'rgba(20,10,30,.75)'}} /></div>
    </div>
  </div>;
};
