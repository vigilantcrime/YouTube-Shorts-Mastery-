/* VC long-form: extra data / illustration components (all original vector art — no logos, no press photos). */
import React from 'react';
import {Easing} from 'remotion';
import {C, Card, F, H, Icon, PV, Pill, Title, W, eio, eo, fit, ramp, rnd, spring, useT} from './kit';

/* ---------- titles that fit ---------- */
export const TF: React.FC<{text: string; size?: number; max?: number; hot?: boolean; style?: React.CSSProperties}> = ({text, size = 150, max = 1560, hot, style}) =>
  <Title size={fit(text.toUpperCase(), F.display, size, max, size * 0.012)} hot={hot} style={style}>{text}</Title>;

/* pill with an animated strike-through ("not a few people") */
export const SPill: React.FC<{t0: number; text: string; icon?: React.ReactNode; v?: PV; size?: number; style?: React.CSSProperties}> = ({t0, ...p}) => {
  const t = useT(); const k = ramp(t, t0, t0 + 0.32, 0, 1, eio); return <Pill {...p} strike={k > 0.02 ? k : undefined} />;
};
export const StruckTitle: React.FC<{text: string; size?: number; max?: number; t0: number; hot?: boolean; lineColor?: string}> = ({text, size = 150, max = 900, t0, hot, lineColor = C.red}) => {
  const t = useT(); const s = fit(text.toUpperCase(), F.display, size, max, size * 0.012); const p = ramp(t, t0, t0 + 0.35, 0, 1, eio);
  return <div style={{position: 'relative', display: 'inline-block', opacity: 1 - 0.3 * p}}>
    <Title size={s} hot={hot}>{text}</Title>
    <div style={{position: 'absolute', left: '-3%', top: '54%', height: Math.max(8, s * 0.07), width: `${106 * p}%`, background: lineColor, borderRadius: 6, transform: 'rotate(-3deg)', transformOrigin: '0 50%', boxShadow: `0 0 24px ${lineColor}`}} />
  </div>;
};

/* dim everything except a spotlight zone (scene-local, oversized so camera dips never reveal an edge) */
export const Dim: React.FC<{t0: number; t1: number; x: number; y: number; rx?: number; ry?: number; dim?: number}> = ({t0, t1, x, y, rx = 520, ry = 360, dim = 0.82}) => {
  const t = useT(); const o = ramp(t, t0, t0 + 0.35) * (1 - ramp(t, t1, t1 + 0.35)); if (o <= 0.01) return null;
  return <div style={{position: 'absolute', left: -900, top: -700, width: W + 1800, height: H + 1400, zIndex: 5, opacity: o, pointerEvents: 'none', background: `radial-gradient(ellipse ${rx}px ${ry}px at ${x + 900}px ${y + 700}px, rgba(2,6,16,0) 38%, rgba(2,6,16,${dim}) 100%)`}} />;
};

/* ---------- magnifier ---------- */
export const Lens: React.FC<{w: number; h: number; from: [number, number]; to: [number, number]; t0: number; t1: number; r?: number; zoom?: number; children: React.ReactNode}> = ({w, h, from, to, t0, t1, r = 110, zoom = 1.9, children}) => {
  const t = useT(); const p = ramp(t, t0, t1, 0, 1, eio); const a = spring(t, t0 - 0.2, 14, 7); if (t < t0 - 0.2) return <div style={{position: 'relative', width: w, height: h}}>{children}</div>;
  const lx = from[0] + (to[0] - from[0]) * p + Math.sin(t * 2.1) * 4, ly = from[1] + (to[1] - from[1]) * p + Math.cos(t * 1.7) * 5;
  return <div style={{position: 'relative', width: w, height: h}}>
    {children}
    <div style={{position: 'absolute', left: lx - r, top: ly - r, width: r * 2, height: r * 2, borderRadius: '50%', overflow: 'hidden', border: '7px solid #fff', background: '#0a1a3a', transform: `scale(${a})`, zIndex: 4,
      boxShadow: '0 0 0 4px rgba(47,123,255,0.45), 0 0 46px rgba(47,123,255,0.75), 0 22px 40px rgba(0,0,0,0.55), inset 0 0 36px rgba(255,255,255,0.22)'}}>
      <div style={{position: 'absolute', left: -(lx - r), top: -(ly - r), width: w, height: h, transformOrigin: `${lx}px ${ly}px`, transform: `scale(${zoom})`}}>{children}</div>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 30% 24%, rgba(255,255,255,0.35), rgba(255,255,255,0) 38%)'}} />
    </div>
    <div style={{position: 'absolute', left: lx + r * 0.66, top: ly + r * 0.66 - 11, width: r * 0.95, height: 22, borderRadius: 11, background: 'linear-gradient(180deg, #fff, #9db4d8)', transformOrigin: '0 50%', transform: `rotate(45deg) scale(${a})`, boxShadow: '0 6px 18px rgba(0,0,0,0.55)', zIndex: 3}} />
  </div>;
};

/* ---------- dashboard rows (the thing the lens reads) ---------- */
export const DashRows: React.FC<{t0: number; w: number; h: number}> = ({t0, w, h}) => {
  const t = useT(); const n = 7; const rh = (h - 40) / n;
  return <div style={{width: w, height: h, padding: '20px 26px', boxSizing: 'border-box'}}>
    {Array.from({length: n}, (_, i) => { const p = ramp(t, t0 + i * 0.07, t0 + 0.55 + i * 0.07, 0, 1, eo); const v = 0.3 + 0.55 * rnd(i, 21); const red = i === 2 || i === 5;
      return <div key={i} style={{height: rh, display: 'flex', alignItems: 'center', gap: 18, opacity: Math.min(1, p * 1.5)}}>
        <div style={{fontFamily: F.mono, fontSize: 21, letterSpacing: 2, color: C.mute, width: 130}}>FIRM {String(i * 713 % 997).padStart(3, '0')}</div>
        <div style={{flex: 1, height: 26, borderRadius: 13, background: 'rgba(255,255,255,0.08)', position: 'relative'}}><div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${v * p * 100}%`, borderRadius: 13, background: red ? 'linear-gradient(90deg, #A3122A, #FF2E4A)' : 'linear-gradient(90deg, #123C8F, #4C93FF)'}} /></div>
        <div style={{fontFamily: F.uiB, fontSize: 24, color: red ? C.redL : C.blueL, width: 66, textAlign: 'right'}}>{Math.round(v * p * 100)}</div></div>; })}
  </div>;
};

/* ---------- diary (a spokesperson said it was "very full") ---------- */
export const Diary: React.FC<{w?: number; fillAt: number}> = ({w = 540, fillAt}) => {
  const t = useT(); const hrs = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17'];
  return <div style={{width: w, borderRadius: 16, overflow: 'hidden', background: '#f1f5ff', color: '#0a1a3a', border: '3px solid #fff', boxShadow: '0 0 0 4px rgba(255,255,255,0.15), 0 30px 70px rgba(0,0,0,0.65)'}}>
    <div style={{background: 'linear-gradient(100deg, #123C8F, #0a1a3a)', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><span style={{fontFamily: F.hero, fontSize: 30, letterSpacing: 4}}>DIARY</span><span style={{fontFamily: F.mono, fontSize: 20, letterSpacing: 2, color: C.blueL}}>ILLUSTRATIVE</span></div>
    {hrs.map((h, i) => { const at = fillAt + i * 0.17; const p = ramp(t, at, at + 0.35, 0, 1, eo);
      return <div key={h} style={{display: 'flex', alignItems: 'center', height: 56, borderBottom: '2px solid #cdd8f0', padding: '0 20px', gap: 16}}><span style={{fontFamily: F.mono, fontSize: 20, color: '#4a5d86', width: 62}}>{h}:00</span>
        <div style={{flex: 1, height: 34, position: 'relative'}}><div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${p * 100}%`, borderRadius: 8, background: i % 3 === 1 ? 'repeating-linear-gradient(45deg, #FF2E4A 0 12px, #d41d3a 12px 24px)' : 'repeating-linear-gradient(45deg, #2F7BFF 0 12px, #1d63d6 12px 24px)'}} /></div></div>; })}
  </div>;
};

/* ---------- checklist ---------- */
export const Checklist: React.FC<{w?: number; title: string; items: {t: number; label: string; icon: string}[]}> = ({w = 660, title, items}) => {
  const t = useT();
  return <Card w={w} label={title} v="blue" pad={30}>
    {items.map((it, i) => { const a = spring(t, it.t, 15, 7); const tk = spring(t, it.t + 0.2, 16, 7);
      return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, height: 100, opacity: Math.min(1, a * 1.4), transform: `translateX(${(1 - a) * -70}px)`, borderBottom: i < items.length - 1 ? '2px solid rgba(255,255,255,0.12)' : undefined}}>
        <div style={{width: 62, height: 62, borderRadius: 18, border: '3px solid #fff', background: tk > 0.05 ? 'linear-gradient(160deg, #2F7BFF, #123C8F)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>
          <div style={{transform: `scale(${tk})`}}><Icon n="tick" size={40} sw={11} /></div></div>
        <Icon n={it.icon} size={50} color={C.blueL} />
        <div style={{fontFamily: F.hero, fontSize: 36, letterSpacing: 3, color: '#fff', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{it.label}</div></div>; })}
  </Card>;
};

/* ---------- thought bubble ---------- */
export const Thought: React.FC<{w: number; h: number; children: React.ReactNode}> = ({w, h, children}) =>
  <div style={{position: 'relative', width: w, height: h}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(240,246,255,0.97)', border: '4px solid #fff', boxShadow: '0 0 44px rgba(47,123,255,0.45), 0 26px 56px rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `0 ${w * 0.13}px`, boxSizing: 'border-box', color: '#0a1a3a', textAlign: 'center'}}>{children}</div>
    {[[0.02, 1.02, 40], [-0.07, 1.16, 26], [-0.13, 1.27, 16]].map(([fx, fy, s], i) => <div key={i} style={{position: 'absolute', left: w * fx, top: h * fy - s / 2, width: s, height: s, borderRadius: '50%', background: 'rgba(240,246,255,0.97)', border: '3px solid #fff'}} />)}
  </div>;

/* ---------- ring timer ---------- */
export const Donut: React.FC<{size: number; p: number; color?: string; children?: React.ReactNode}> = ({size, p, color = C.red, children}) => {
  const r = size / 2 - 18, L = 2 * Math.PI * r;
  return <div style={{width: size, height: size, position: 'relative'}}>
    <svg width={size} height={size} style={{transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 16px ${color})`}}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={28} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={28} strokeLinecap="round" strokeDasharray={`${L * p} ${L}`} /></svg>
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>{children}</div></div>;
};

/* ---------- moon ---------- */
export const Moon: React.FC<{size: number}> = ({size}) =>
  <div style={{width: size, height: size, borderRadius: '50%', position: 'relative', background: 'radial-gradient(circle at 34% 30%, #f4f7ff 0%, #bccaea 36%, #6f84b8 70%, #2a3a66 100%)', boxShadow: `0 0 ${size * 0.22}px rgba(143,193,255,0.6), inset -${size * 0.09}px -${size * 0.06}px ${size * 0.14}px rgba(0,0,0,0.55)`}}>
    {[[0.3, 0.32, 0.17], [0.62, 0.26, 0.1], [0.55, 0.62, 0.21], [0.24, 0.66, 0.09], [0.78, 0.5, 0.08], [0.42, 0.84, 0.07]].map(([x, y, s], i) => <div key={i} style={{position: 'absolute', left: `${(x - s / 2) * 100}%`, top: `${(y - s / 2) * 100}%`, width: `${s * 100}%`, height: `${s * 100}%`, borderRadius: '50%', background: 'radial-gradient(circle at 60% 60%, rgba(60,80,130,0.55), rgba(60,80,130,0.15))', boxShadow: 'inset 3px 3px 8px rgba(0,0,0,0.35)'}} />)}
  </div>;

/* ---------- paper: newspaper mock + sick note + leave form ---------- */
export const Paper: React.FC<{w?: number; head: string; kicker?: string; mast?: string}> = ({w = 620, head, kicker = 'COVERAGE', mast = 'THE DAILY EXAMPLE'}) => {
  const ln = (n: number, k: number) => Array.from({length: n}, (_, i) => <div key={i} style={{height: 11, borderRadius: 6, background: '#b9c6e2', width: `${60 + 40 * rnd(i, k)}%`, marginBottom: 12}} />);
  return <div style={{width: w, background: '#eef3ff', color: '#0a1a3a', borderRadius: 10, border: '3px solid #fff', boxShadow: '0 0 0 4px rgba(255,255,255,0.12), 0 30px 70px rgba(0,0,0,0.65)', padding: '22px 30px 24px'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '3px solid #0a1a3a', paddingBottom: 8}}><div style={{fontFamily: F.display, fontSize: 40, letterSpacing: 2}}>{mast}</div><div style={{fontFamily: F.mono, fontSize: 18, letterSpacing: 2, color: '#4a5d86'}}>{kicker}</div></div>
    <div style={{fontFamily: F.display, fontSize: 82, lineHeight: 1.0, margin: '16px 0 16px', textTransform: 'uppercase'}}>{head}</div>
    <div style={{display: 'flex', gap: 20}}><div style={{width: 200, height: 150, borderRadius: 6, flex: 'none', background: 'repeating-linear-gradient(45deg, #c7d3ee 0 10px, #dbe4f8 10px 20px)'}} /><div style={{flex: 1}}>{ln(5, 3)}</div></div>
    <div style={{marginTop: 6}}>{ln(3, 7)}</div>
  </div>;
};
export const FitNote: React.FC<{t0: number; w?: number}> = ({t0, w = 600}) => {
  const t = useT(); const sig = ramp(t, t0 + 1.4, t0 + 2.2, 0, 1, eio); const txt = 'SEVERE CASE OF LAUNCH DAY'; const n = Math.max(0, Math.min(txt.length, Math.floor((t - t0 - 0.25) * 30)));
  return <div style={{width: w, background: '#f4f7ff', color: '#0a1a3a', borderRadius: 14, padding: '26px 32px 30px', border: '3px solid #fff', boxShadow: '0 0 0 4px rgba(255,255,255,0.12), 0 30px 70px rgba(0,0,0,0.65)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16, borderBottom: '3px solid #0a1a3a', paddingBottom: 12}}>
      <div style={{width: 46, height: 46, position: 'relative', flex: 'none'}}><div style={{position: 'absolute', left: 16, top: 0, width: 14, height: 46, background: C.red, borderRadius: 3}} /><div style={{position: 'absolute', left: 0, top: 16, width: 46, height: 14, background: C.red, borderRadius: 3}} /></div>
      <div style={{fontFamily: F.display, fontSize: 52, letterSpacing: 2}}>FIT NOTE</div><div style={{marginLeft: 'auto', fontFamily: F.mono, fontSize: 16, letterSpacing: 2, color: '#4a5d86'}}>ILLUSTRATIVE</div></div>
    <div style={{fontFamily: F.mono, fontSize: 19, letterSpacing: 2, color: '#4a5d86', marginTop: 20}}>PATIENT</div><div style={{height: 14, width: '55%', background: '#05080f', borderRadius: 4, marginTop: 8}} />
    <div style={{fontFamily: F.mono, fontSize: 19, letterSpacing: 2, color: '#4a5d86', marginTop: 20}}>CONDITION</div>
    <div style={{fontFamily: F.uiB, fontSize: 38, lineHeight: 1.1, marginTop: 6, minHeight: 84}}>{txt.slice(0, n)}<span style={{color: C.red, opacity: Math.floor(t * 2.4) % 2 ? 0 : 1}}>|</span></div>
    <div style={{fontFamily: F.mono, fontSize: 19, letterSpacing: 2, color: '#4a5d86', marginTop: 14}}>SIGNED</div>
    <svg width={260} height={70} viewBox="0 0 260 70"><path d="M6 52C26 6 40 6 40 34C40 60 54 14 76 30C92 42 104 40 120 24C132 12 140 46 168 38C190 30 210 28 252 40" pathLength={1} strokeDasharray={`${sig} 1`} fill="none" stroke="#123C8F" strokeWidth={5} strokeLinecap="round" /></svg>
  </div>;
};
export const LeaveForm: React.FC<{t0: number; w?: number}> = ({t0, w = 560}) => {
  const t = useT(); const tk = spring(t, t0 + 0.9, 15, 7);
  return <div style={{width: w, background: '#f4f7ff', color: '#0a1a3a', borderRadius: 14, padding: '26px 32px 30px', border: '3px solid #fff', boxShadow: '0 0 0 4px rgba(255,255,255,0.12), 0 30px 70px rgba(0,0,0,0.65)', position: 'relative'}}>
    <div style={{fontFamily: F.display, fontSize: 50, letterSpacing: 2, borderBottom: '3px solid #0a1a3a', paddingBottom: 10}}>ANNUAL LEAVE REQUEST</div>
    {[['TYPE', 'ANNUAL LEAVE'], ['DATE', 'THURSDAY 19 NOV'], ['NOTICE', 'WEEKS']].map(([k, v], i) => <div key={k} style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 20, opacity: ramp(t, t0 + 0.1 + i * 0.18, t0 + 0.4 + i * 0.18)}}><div style={{fontFamily: F.mono, fontSize: 19, letterSpacing: 2, color: '#4a5d86', width: 100}}>{k}</div><div style={{fontFamily: F.uiB, fontSize: 32}}>{v}</div></div>)}
    <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 28}}>
      <div style={{width: 64, height: 64, borderRadius: 14, border: '4px solid #123C8F', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div style={{transform: `scale(${tk})`}}><Icon n="tick" size={44} color="#123C8F" sw={11} /></div></div>
      <div style={{fontFamily: F.hero, fontSize: 34, letterSpacing: 3, color: '#123C8F', opacity: tk}}>APPROVED</div></div>
  </div>;
};
export const AgeBadge: React.FC<{size?: number}> = ({size = 340}) =>
  <div style={{width: size, height: size, borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%, #FF5A6E, #A3122A)', border: `${size * 0.035}px solid #fff`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 90px rgba(255,46,74,0.75), 0 30px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.25)'}}>
    <div style={{fontFamily: F.display, fontSize: size * 0.5, lineHeight: 1, color: '#fff', textShadow: '0 6px 0 rgba(90,10,28,0.8)'}}>18</div>
    <div style={{fontFamily: F.hero, fontSize: size * 0.07, letterSpacing: size * 0.012, color: '#fff', opacity: 0.92, marginTop: size * 0.02}}>AGE RATING</div></div>;

/* ---------- subscribe button: cursor travels in, clicks, bell rings ---------- */
export const SubBtn: React.FC<{t0: number; click: number}> = ({t0, click}) => {
  const t = useT(); const a = spring(t, t0, 14, 7); const done = t >= click; const cp = ramp(t, t0 + 0.2, click, 0, 1, eio);
  const cx = 150 * (1 - cp) + 40, cy = 130 * (1 - cp) + 14; const press = t >= click && t < click + 0.16; const rp = ramp(t, click, click + 0.7, 0, 1, eo);
  const ring = done ? Math.sin((t - click) * 34) * 16 * (1 - ramp(t, click, click + 1.1)) : 0;
  return <div style={{position: 'relative', width: 640, height: 190, transform: `scale(${0.6 + 0.4 * a})`, opacity: Math.min(1, a * 1.4)}}>
    <div style={{position: 'absolute', left: 60, top: 30, width: 520, height: 116, borderRadius: 58, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, transform: `scale(${press ? 0.94 : 1})`,
      background: done ? 'rgba(255,255,255,0.14)' : 'linear-gradient(100deg, #FF2E4A, #B3122E)', border: '3px solid rgba(255,255,255,0.95)', boxShadow: done ? '0 14px 34px rgba(0,0,0,0.5)' : '0 0 40px rgba(255,46,74,0.7), 0 14px 34px rgba(0,0,0,0.5)', fontFamily: F.hero, fontSize: 46, letterSpacing: 5, color: '#fff'}}>
      <div style={{transform: `rotate(${ring}deg)`, transformOrigin: '50% 10%'}}><Icon n="bell" size={58} color="#fff" sw={7} /></div>{done ? 'SUBSCRIBED' : 'SUBSCRIBE'}</div>
    {rp > 0 && rp < 1 && <div style={{position: 'absolute', left: 320 - 80 - rp * 220, top: 88 - 80 - rp * 60, width: 160 + rp * 440, height: 160 + rp * 120, borderRadius: '50%', border: `${6 * (1 - rp)}px solid #fff`, opacity: 1 - rp}} />}
    <svg width={50} height={64} viewBox="0 0 30 44" style={{position: 'absolute', left: 320 + cx, top: 80 + cy, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.6))'}}><path d="M2 2L2 34L11 26L17 40L23 37L17 23L28 23Z" fill="#fff" stroke="#0a1a3a" strokeWidth={2.4} strokeLinejoin="round" /></svg>
  </div>;
};

/* ---------- arrow, silhouette, portal ---------- */
export const Arrow: React.FC<{t0: number; len?: number; color?: string}> = ({t0, len = 120, color = '#fff'}) => {
  const t = useT(); const p = ramp(t, t0, t0 + 0.45, 0, 1, eio);
  return <svg width={len} height={70} style={{overflow: 'visible', filter: `drop-shadow(0 0 10px ${color})`}}><path d={`M6 35H${len - 10}`} stroke={color} strokeWidth={9} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={`${p} 1`} /><path d={`M${len - 40} 8L${len - 6} 35L${len - 40} 62`} stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={p > 0.85 ? 1 : 0} /></svg>;
};
export const Bust: React.FC<{w?: number; name: string; role?: string}> = ({w = 400, name, role}) =>
  <div style={{width: w, borderRadius: 26, overflow: 'hidden', border: '3px solid #fff', background: 'linear-gradient(170deg, #1a3a7a, #0a1a3a)', boxShadow: '0 0 44px rgba(47,123,255,0.45), 0 30px 70px rgba(0,0,0,0.65)'}}>
    <svg width={w} height={w * 0.86} viewBox="0 0 400 344"><defs><linearGradient id="bustg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8FC1FF" stopOpacity={0.55} /><stop offset="1" stopColor="#2F7BFF" stopOpacity={0.2} /></linearGradient></defs>
      <circle cx={200} cy={132} r={72} fill="url(#bustg)" stroke="#fff" strokeWidth={4} /><path d="M54 344C54 232 124 206 200 206C276 206 346 232 346 344Z" fill="url(#bustg)" stroke="#fff" strokeWidth={4} /></svg>
    <div style={{padding: '16px 24px 22px', background: 'rgba(5,11,26,0.92)'}}><div style={{fontFamily: F.display, fontSize: 50, letterSpacing: 2, textTransform: 'uppercase', color: '#fff'}}>{name}</div>{role && <div style={{fontFamily: F.mono, fontSize: 20, letterSpacing: 3, color: C.redL, marginTop: 4}}>{role}</div>}</div>
  </div>;
export const Portal: React.FC<{w?: number; h?: number}> = ({w = 360, h = 520}) => {
  const t = useT(); const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
  return <div style={{width: w, height: h, position: 'relative'}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: `${w / 2}px ${w / 2}px 18px 18px`, border: '7px solid #fff', overflow: 'hidden', background: 'radial-gradient(ellipse at 50% 58%, #ffffff 0%, #bfe0ff 18%, #4C93FF 46%, #0a1a3a 100%)', boxShadow: `0 0 ${80 + 50 * pulse}px rgba(143,193,255,0.85), inset 0 0 60px rgba(255,255,255,0.5)`}}>
      <div style={{position: 'absolute', left: '50%', top: '58%', width: w * 3, height: w * 3, marginLeft: -w * 1.5, marginTop: -w * 1.5, background: 'repeating-conic-gradient(rgba(255,255,255,0.26) 0 5deg, rgba(255,255,255,0) 5deg 15deg)', transform: `rotate(${t * 16}deg)`, WebkitMaskImage: 'radial-gradient(circle, #000 0%, transparent 46%)', maskImage: 'radial-gradient(circle, #000 0%, transparent 46%)'}} /></div>
  </div>;
};

/* ---------- offices going dark ---------- */
export const OfficeBlock: React.FC<{w?: number; h?: number; off: number; cols?: number; rows?: number}> = ({w = 420, h = 560, off, cols = 5, rows = 8}) => {
  const t = useT(); const cw = (w - 48) / cols, rh = (h - 60) / rows;
  return <div style={{width: w, height: h, borderRadius: 14, border: '3px solid #fff', background: 'linear-gradient(180deg, #0f2a5c, #08142e)', boxShadow: '0 0 40px rgba(47,123,255,0.4), 0 30px 70px rgba(0,0,0,0.65)', padding: '30px 24px', boxSizing: 'border-box', display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cw}px)`, gridTemplateRows: `repeat(${rows}, ${rh}px)`}}>
    {Array.from({length: cols * rows}, (_, i) => { const o = off + rnd(i, 31) * 1.3; const lit = t < o ? 1 : 1 - ramp(t, o, o + 0.18);
      return <div key={i} style={{margin: 5, borderRadius: 4, background: `rgba(255, 224, 150, ${0.12 + 0.82 * lit})`, boxShadow: lit > 0.5 ? '0 0 16px rgba(255,224,150,0.55)' : undefined}} />; })}
  </div>;
};

/* ---------- ghosts: a row of people who "didn't show up" ---------- */
export const Vanish: React.FC<{t0: number; at: number; n?: number; size?: number}> = ({t0, at, n = 7, size = 96}) => {
  const t = useT();
  return <div style={{display: 'flex', gap: size * 0.16}}>{Array.from({length: n}, (_, i) => { const a = spring(t, t0 + i * 0.05, 16, 8); const g = ramp(t, at + i * 0.13, at + i * 0.13 + 0.35, 0, 1, eo); const gh = g > 0.5;
    return <div key={i} style={{width: size, height: size * 1.15, borderRadius: size * 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px ${gh ? 'dashed' : 'solid'} ${gh ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.9)'}`, background: gh ? 'rgba(255,255,255,0.03)' : 'rgba(47,123,255,0.28)', opacity: Math.min(1, a * 1.3) * (1 - 0.5 * g), transform: `scale(${0.5 + 0.5 * a})`}}>
      <Icon n="person" size={size * 0.64} color={gh ? 'rgba(255,255,255,0.28)' : C.blueL} /></div>; })}</div>;
};
/* a figure that dissolves top-to-bottom */
export const Dissolve: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const t = useT(); const p = ramp(t, at, at + 1.1, 0, 1, eio); const edge = 112 - p * 124;
  return <div style={{position: 'relative'}}>
    <div style={{WebkitMaskImage: `linear-gradient(180deg, #000 ${edge - 14}%, transparent ${edge}%)`, maskImage: `linear-gradient(180deg, #000 ${edge - 14}%, transparent ${edge}%)`, filter: p > 0 ? `blur(${p * 2}px)` : undefined}}>{children}</div>
    {p > 0.02 && p < 0.98 && <div style={{position: 'absolute', left: -20, right: -20, top: `${edge}%`, height: 5, background: C.blueL, boxShadow: `0 0 24px ${C.blueL}, 0 0 60px ${C.blue}`, borderRadius: 3}} />}
  </div>;
};
/* rising hearts / sparkles */
export const Rise: React.FC<{t0: number; n?: number; icon?: string; x0?: number; x1?: number; y0?: number; color?: string}> = ({t0, n = 9, icon = 'heart', x0 = 260, x1 = 1660, y0 = 930, color = C.red}) => {
  const t = useT();
  return <>{Array.from({length: n}, (_, i) => { const at = t0 + i * 0.22; const k = t - at; if (k < 0 || k > 2.6) return null; const p = k / 2.6; const x = x0 + (x1 - x0) * rnd(i, 3) + Math.sin(k * 3 + i) * 26; const y = y0 - p * 620; const s = 0.7 + rnd(i, 4) * 0.9;
    return <div key={i} style={{position: 'absolute', left: x, top: y, opacity: Math.sin(Math.PI * Math.min(1, p)) * 0.95, transform: `translate(-50%,-50%) scale(${s})`, filter: `drop-shadow(0 0 14px ${color})`, zIndex: 4}}><Icon n={icon} size={90} color={color} sw={7} /></div>; })}</>;
};

/* ---------- gauge (broadband traffic pegs the needle) ---------- */
export const Gauge: React.FC<{t0: number; w?: number}> = ({t0, w = 640}) => {
  const t = useT(); const R = w * 0.4, cx = w / 2, cy = w * 0.5; const k = ramp(t, t0, t0 + 0.85, 0, 1, Easing.out(Easing.back(1.5))); const ang = -125 + 262 * k + (t > t0 + 0.85 ? Math.sin(t * 40) * 1.4 : 0);
  const pt = (a: number, r: number): [number, number] => [cx + r * Math.sin((a * Math.PI) / 180), cy - r * Math.cos((a * Math.PI) / 180)];
  const arc = (a0: number, a1: number, r: number) => { const [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r); return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
  return <svg width={w} height={w * 0.72} viewBox={`0 0 ${w} ${w * 0.72}`} style={{overflow: 'visible'}}>
    <path d={arc(-125, 125, R)} stroke="rgba(255,255,255,0.14)" strokeWidth={46} fill="none" strokeLinecap="round" />
    <path d={arc(-125, 20, R)} stroke={C.blue} strokeWidth={46} fill="none" strokeLinecap="round" opacity={0.9} /><path d={arc(30, 125, R)} stroke={C.red} strokeWidth={46} fill="none" strokeLinecap="round" style={{filter: `drop-shadow(0 0 14px ${C.red})`}} />
    {Array.from({length: 11}, (_, i) => { const a = -125 + i * 25; const [x0, y0] = pt(a, R - 42), [x1, y1] = pt(a, R - 66); return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#fff" strokeWidth={4} opacity={0.7} />; })}
    <g style={{filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.6))'}}><line x1={cx} y1={cy} x2={pt(ang, R - 22)[0]} y2={pt(ang, R - 22)[1]} stroke="#fff" strokeWidth={10} strokeLinecap="round" /><circle cx={cx} cy={cy} r={22} fill="#fff" stroke={C.red} strokeWidth={8} /></g>
    <text x={cx} y={cy + 150} textAnchor="middle" fontFamily={F.mono} fontSize={26} letterSpacing={4} fill={C.blueL}>HOME BROADBAND TRAFFIC</text></svg>;
};

/* ---------- battery: five hours' sleep is "negotiable" ---------- */
export const Battery: React.FC<{t0: number; dur: number; w?: number; from?: number; to?: number}> = ({t0, dur, w = 600, from = 1, to = 0.18}) => {
  const t = useT(); const p = ramp(t, t0, t0 + dur, from, to, eio); const col = p > 0.5 ? C.blue : p > 0.3 ? '#FFB02E' : C.red; const h = w * 0.42;
  return <div style={{position: 'relative', width: w + 40, height: h}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: 34, border: '8px solid #fff', background: 'rgba(5,11,26,0.7)', overflow: 'hidden', boxShadow: `0 0 40px ${col}88`}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${p * 100}%`, background: `linear-gradient(180deg, ${col}, ${col}aa)`}} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: h * 0.52, color: '#fff', textShadow: '0 4px 14px rgba(0,0,0,0.6)'}}>{Math.round(p * 100)}%</div></div>
    <div style={{position: 'absolute', left: w + 4, top: h * 0.3, width: 30, height: h * 0.4, borderRadius: '0 12px 12px 0', background: '#fff'}} /></div>;
};

/* ---------- gift voucher ticket ---------- */
export const Voucher: React.FC<{t0: number; w?: number}> = ({t0, w = 720}) => {
  const t = useT(); const v = ramp(t, t0, t0 + 0.9, 0, 90, eo); const h = w * 0.43;
  return <div style={{width: w, height: h, borderRadius: 26, position: 'relative', overflow: 'hidden', background: 'linear-gradient(110deg, #123C8F 0%, #2F7BFF 62%, #8FC1FF 100%)', border: '3px solid #fff', boxShadow: '0 0 50px rgba(47,123,255,0.5), 0 30px 70px rgba(0,0,0,0.6)'}}>
    <div style={{position: 'absolute', right: w * 0.27, top: 0, bottom: 0, borderRight: '4px dashed rgba(255,255,255,0.6)'}} />
    <div style={{position: 'absolute', right: w * 0.27 - 24, top: -24, width: 48, height: 48, borderRadius: '50%', background: '#0a1a3a'}} /><div style={{position: 'absolute', right: w * 0.27 - 24, bottom: -24, width: 48, height: 48, borderRadius: '50%', background: '#0a1a3a'}} />
    <div style={{position: 'absolute', left: 40, top: 28, fontFamily: F.mono, fontSize: 22, letterSpacing: 5, color: '#dbe9ff'}}>GIFT VOUCHER · PLAYSTATION</div>
    <div style={{position: 'absolute', left: 36, top: h * 0.3, fontFamily: F.display, fontSize: h * 0.56, lineHeight: 1, color: '#fff', textShadow: '0 6px 0 rgba(10,26,58,0.6)'}}>£{Math.round(v)}</div>
    <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: w * 0.27, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon n="pad" size={w * 0.15} sw={6} /></div>
  </div>;
};

/* ---------- a to-do list that never gets ticked ---------- */
export const TodoCard: React.FC<{w?: number; items: {t: number; label: string}[]}> = ({w = 480, items}) => {
  const t = useT();
  return <Card w={w} label="To do · Thursday" v="red" pad={28}>{items.map((it, i) => { const a = spring(t, it.t, 15, 7);
    return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, height: 88, opacity: Math.min(1, a * 1.4), transform: `translateX(${(1 - a) * 60}px)`, borderBottom: i < items.length - 1 ? '2px solid rgba(255,255,255,0.12)' : undefined}}>
      <div style={{width: 46, height: 46, borderRadius: 12, border: '3px dashed rgba(255,255,255,0.6)', flex: 'none'}} /><div style={{fontFamily: F.hero, fontSize: 30, letterSpacing: 2.5, color: '#fff'}}>{it.label}</div></div>; })}</Card>;
};

/* ---------- missed-calls screen ---------- */
export const CallScreen: React.FC<{t0: number}> = ({t0}) => {
  const t = useT();
  return <div style={{position: 'absolute', inset: 0, padding: '84px 22px 0', color: '#fff'}}>
    <div style={{fontFamily: F.hero, fontSize: 26, letterSpacing: 4, color: C.redL, textAlign: 'center', marginBottom: 20}}>CALLS TO MAKE</div>
    {Array.from({length: 6}, (_, i) => { const a = spring(t, t0 + 0.2 + i * 0.16, 15, 7); const ring = (t * 1.5 + i * 0.3) % 1;
      return <div key={i} style={{height: 76, marginBottom: 12, borderRadius: 18, background: 'rgba(255,255,255,0.09)', border: '2px solid rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', gap: 14, padding: '0 14px', opacity: Math.min(1, a * 1.3), transform: `translateX(${(1 - a) * 50}px)`}}>
        <div style={{width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(160deg, #FF5A6E, #B3122E)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flex: 'none'}}><div style={{position: 'absolute', inset: -4 - ring * 10, borderRadius: '50%', border: '3px solid #FF2E4A', opacity: 0.7 * (1 - ring)}} /><Icon n="phone" size={26} sw={9} /></div>
        <div style={{flex: 1, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.3)', width: `${50 + 40 * rnd(i, 41)}%`}} /></div>; })}
  </div>;
};

/* ---------- four day tiles ("booked four days off") ---------- */
export const DayTiles: React.FC<{t0: number; n?: number}> = ({t0, n = 4}) => {
  const t = useT();
  return <div style={{display: 'flex', gap: 18}}>{Array.from({length: n}, (_, i) => { const a = spring(t, t0 + i * 0.26, 15, 7); const tk = spring(t, t0 + 0.14 + i * 0.26, 16, 7);
    return <div key={i} style={{width: 130, height: 168, borderRadius: 20, overflow: 'hidden', border: '3px solid #fff', background: 'linear-gradient(160deg, rgba(18,40,88,0.97), rgba(6,15,36,0.98))', boxShadow: '0 0 30px rgba(47,123,255,0.45), 0 18px 40px rgba(0,0,0,0.55)', opacity: Math.min(1, a * 1.4), transform: `translateY(${(1 - a) * 60}px) scale(${0.7 + 0.3 * a})`, position: 'relative'}}>
      <div style={{background: 'linear-gradient(100deg, #FF2E4A, #A3122A)', textAlign: 'center', fontFamily: F.mono, fontSize: 20, letterSpacing: 3, padding: '7px 0', color: '#fff'}}>DAY</div>
      <div style={{textAlign: 'center', fontFamily: F.display, fontSize: 96, lineHeight: '110px', color: '#fff'}}>{i + 1}</div>
      <div style={{position: 'absolute', right: 8, bottom: 8, transform: `scale(${tk})`}}><Icon n="tick" size={34} color={C.blueL} sw={11} /></div></div>; })}</div>;
};

/* ---------- horizontal race bars (+62% vs +149%) ---------- */
export const Race: React.FC<{t0: number; t1: number; w: number}> = ({t0, t1, w}) => {
  const t = useT(); const pa = ramp(t, t0, t0 + 1.0, 0, 1, eo), pb = ramp(t, t1, t1 + 1.5, 0, 1, eo);
  const row = (label: string, icon: string, v: number, p: number, red: boolean, y: number) => <div style={{position: 'absolute', left: 0, top: y, width: w}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14}}><Icon n={icon} size={46} color={red ? C.redL : C.blueL} /><div style={{fontFamily: F.hero, fontSize: 36, letterSpacing: 4, color: '#fff'}}>{label}</div></div>
    <div style={{height: 96, borderRadius: 48, background: 'rgba(255,255,255,0.08)', border: '3px solid rgba(255,255,255,0.7)', position: 'relative', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${v * p * 100}%`, borderRadius: 48, background: red ? 'linear-gradient(90deg, #A3122A, #FF2E4A)' : 'linear-gradient(90deg, #123C8F, #4C93FF)', boxShadow: red ? '0 0 40px rgba(255,46,74,0.7)' : undefined}} />
      <div style={{position: 'absolute', right: 30, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: F.display, fontSize: 64, color: '#fff'}} />
    </div>
    <div style={{position: 'absolute', left: `calc(${v * p * 100}% - 8px)`, top: 56, transform: 'translateX(-100%)', fontFamily: F.display, fontSize: 70, color: '#fff', textShadow: '0 4px 12px rgba(0,0,0,0.5)', paddingRight: 8, opacity: p > 0.05 ? 1 : 0}}>+{Math.round((red ? 149 : 62) * p)}%</div></div>;
  return <div style={{position: 'relative', width: w, height: 400}}>{row('JOHN LEWIS · CONSOLES & ACCESSORIES', 'bag', 62 / 149, pa, false, 0)}{row('CURRYS · PLAYSTATION 5', 'pad', 1, pb, true, 210)}</div>;
};

/* ---------- oversize flash (safe during camera dips), late-reveal wrapper, download bar ---------- */
export const Burst: React.FC<{t0: number; color?: string; peak?: number; dur?: number}> = ({t0, color = '#fff', peak = 0.35, dur = 0.22}) => {
  const t = useT(); const k = t - t0; if (k < 0 || k > dur) return null;
  return <div style={{position: 'absolute', left: -900, top: -700, width: W + 1800, height: H + 1400, zIndex: 40, background: color, opacity: peak * (1 - k / dur), pointerEvents: 'none'}} />;
};
export const Late: React.FC<{t0: number; children: React.ReactNode}> = ({t0, children}) => { const t = useT(); return <span style={{opacity: ramp(t, t0, t0 + 0.3)}}>{children}</span>; };
export const Download: React.FC<{t0: number; t1: number; w: number; label?: string}> = ({t0, t1, w, label = 'DOWNLOADING… 212 GB'}) => {
  const t = useT(); const p = ramp(t, t0, t1, 0, 1, Easing.inOut(Easing.quad));
  return <div style={{width: w}}><div style={{height: 84, borderRadius: 42, background: 'rgba(255,255,255,0.1)', border: '3px solid rgba(255,255,255,0.9)', overflow: 'hidden', position: 'relative', boxShadow: '0 0 34px rgba(47,123,255,0.5)'}}>
    <div style={{width: `${p * 100}%`, height: '100%', background: 'linear-gradient(90deg, #2F7BFF, #8FC1FF)', borderRadius: 42, position: 'relative'}}><div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(110deg, rgba(255,255,255,0.0) 0 24px, rgba(255,255,255,0.22) 24px 48px)', backgroundPosition: `${-t * 70}px 0`, borderRadius: 42}} /></div>
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px', fontFamily: F.hero, fontSize: 34, letterSpacing: 3, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.7)'}}><span>{label}</span><span>{Math.round(p * 100)}%</span></div></div></div>;
};

/* ---------- a proper school building (bell tower, clock, flag, windows) ---------- */
export const SchoolHouse: React.FC<{w?: number}> = ({w = 520}) => {
  const t = useT(); const wave = Math.sin(t * 4) * 5;
  return <svg width={w} height={w * 0.74} viewBox="0 0 400 296" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" style={{overflow: 'visible', filter: 'drop-shadow(0 0 30px rgba(47,123,255,0.9))'}}>
    <path d="M30 270H370" /><path d="M46 270V150H354V270" fill="rgba(47,123,255,0.14)" /><path d="M36 150L200 100L364 150" />
    <path d="M160 100V52H240V100" fill="rgba(47,123,255,0.14)" /><path d="M150 52L200 14L250 52Z" fill="rgba(255,46,74,0.22)" stroke="#FF8A99" />
    <circle cx={200} cy={76} r={15} /><path d="M200 66V77L208 82" strokeWidth={4} /><path d="M200 14V-26" /><path d={`M200 -24C 216 ${-34 + wave} 228 ${-14 - wave} 246 -24V-4C 228 ${-14 - wave} 216 ${-34 + wave} 200 -4Z`} fill="rgba(255,46,74,0.55)" stroke="#FF8A99" strokeWidth={3.5} />
    {[78, 116, 262, 300].map((x) => <g key={x}><rect x={x - 17} y={178} width={34} height={44} rx={4} /><path d={`M${x} 178V222M${x - 17} 200H${x + 17}`} strokeWidth={3} /></g>)}
    <path d="M172 270V218Q172 196 200 196Q228 196 228 218V270" /><path d="M200 196V270" strokeWidth={3} /><path d="M158 270V280H242V270" strokeWidth={4} />
  </svg>;
};
