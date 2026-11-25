/* Data / illustration components for the VC long-form (all original vector art; no logos, no press photos). */
import React from 'react';
import geo from '../ls/geo.json';
import {C, F, Icon, Pill, cl, commas, eio, eo, ramp, rnd, spring, textW, useT} from './kit';

/* ---------- UK map (Mercator, same projection as the shared geo.json) ---------- */
const UK = geo.uk as {n: string; d: string}[];
const merc = (lat: number) => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;
const SCL = 1080 / 11.5, M0 = merc(54.3);
export const ukXY = (lon: number, lat: number): [number, number] => [540 + (lon + 3.2) * SCL, 540 - (merc(lat) - M0) * SCL];
export const PLACES: Record<string, [number, number]> = {London: [-0.1276, 51.5072], Birmingham: [-1.8904, 52.4862], Manchester: [-2.2426, 53.4808], 'St Albans': [-0.3365, 51.755], Edinburgh: [-3.1883, 55.9533], Wales: [-3.75, 52.4], Cardiff: [-3.1791, 51.4816], Glasgow: [-4.2518, 55.8642], Leeds: [-1.5491, 53.8008], Bristol: [-2.5879, 51.4545], Newcastle: [-1.6178, 54.9783], Belfast: [-5.9301, 54.5973], Liverpool: [-2.9916, 53.4084], Sheffield: [-1.4701, 53.3811], Bicester: [-1.1536, 51.9], Snowdonia: [-4.08, 53.07]};
export type PinDef = {at: string | [number, number]; label?: string; sub?: string; t: number; col?: 'red' | 'blue' | 'white'; side?: 'l' | 'r' | 't' | 'b'; icon?: string; r?: number};
export type RouteDef = {from: string; to: string; t0: number; t1: number; bend?: number; col?: string};
const xyOf = (a: string | [number, number]) => { const p = typeof a === 'string' ? PLACES[a] : a; return ukXY(p[0], p[1]); };
export const UKMap: React.FC<{w: number; h: number; center?: string | [number, number]; span?: number; t0: number; pins?: PinDef[]; routes?: RouteDef[]; dots?: {t0: number; n: number; dur: number; col?: string}; flood?: {t0: number; dur: number; col?: string}}> =
({w, h, center = [-3.2, 54.3], span = 780, t0, pins = [], routes = [], dots, flood}) => {
  const t = useT(); const [mcx, mcy] = xyOf(center); const vb = [mcx - span / 2, mcy - (span * h) / w / 2, span, (span * h) / w]; const ks = vb[2] / w; const draw = ramp(t, t0, t0 + 0.9, 0, 1, eio);
  const grat: React.ReactNode[] = []; for (let lon = -9; lon <= 3; lon++) { const [x] = ukXY(lon, 54); grat.push(<line key={'x' + lon} x1={x} x2={x} y1={0} y2={1080} />); }
  for (let lat = 49; lat <= 60; lat++) { const [, y] = ukXY(-3, lat); grat.push(<line key={'y' + lat} x1={0} x2={1080} y1={y} y2={y} />); }
  const CITIES = ['London', 'Birmingham', 'Manchester', 'Leeds', 'Glasgow', 'Edinburgh', 'Bristol', 'Newcastle', 'Cardiff', 'Liverpool', 'Sheffield', 'Belfast'];
  return <div style={{width: w, height: h, borderRadius: 24, overflow: 'hidden', position: 'relative', background: 'radial-gradient(ellipse at 50% 40%, rgba(20,60,130,0.55), rgba(5,12,30,0.92))'}}>
    <svg width={w} height={h} viewBox={`${vb[0]} ${vb[1]} ${vb[2]} ${vb[3]}`} style={{position: 'absolute', inset: 0}}>
      <defs><filter id="ukglow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={5 * ks} result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <g stroke="rgba(120,170,255,0.13)" strokeWidth={1.2 * ks}>{grat}</g>
      {UK.map((s, i) => { const gb = s.n === 'United Kingdom'; return <path key={i} d={s.d} fill={gb ? `rgba(47,123,255,${0.10 + 0.12 * draw})` : 'rgba(255,255,255,0.035)'} stroke={gb ? '#7db4ff' : 'rgba(255,255,255,0.22)'} strokeWidth={(gb ? 2.6 : 1.6) * ks} strokeLinejoin="round" filter={gb ? 'url(#ukglow)' : undefined} opacity={0.2 + 0.8 * draw} />; })}
      {flood && <g>{UK.filter((s) => s.n === 'United Kingdom').map((s, i) => <path key={i} d={s.d} fill={flood.col ?? C.red} opacity={0.78 * ramp(t, flood.t0, flood.t0 + flood.dur)} />)}</g>}
      {dots && Array.from({length: dots.n}, (_, i) => { const c = PLACES[CITIES[Math.floor(rnd(i, 3) * CITIES.length) ** 1.0 % CITIES.length]]; const [cx, cy] = ukXY(c[0], c[1]); const a = rnd(i, 4) * 6.283, r = Math.pow(rnd(i, 5), 1.6) * 52;
        const at = dots.t0 + (i / dots.n) * dots.dur; if (t < at) return null; const s = ramp(t, at, at + 0.2, 0, 1, eo);
        return <circle key={i} cx={cx + Math.cos(a) * r * 1.2} cy={cy + Math.sin(a) * r} r={3.1 * ks * s} fill={dots.col ?? C.red} opacity={0.85} />; })}
      {routes.map((r, i) => { const p = ramp(t, r.t0, r.t1, 0, 1, eio); if (p <= 0) return null; const [x1, y1] = xyOf(r.from), [x2, y2] = xyOf(r.to);
        const cx = (x1 + x2) / 2 - (y2 - y1) * (r.bend ?? 0.25), cy = (y1 + y2) / 2 + (x2 - x1) * (r.bend ?? 0.25); const px = (1 - p) * (1 - p) * x1 + 2 * (1 - p) * p * cx + p * p * x2, py = (1 - p) * (1 - p) * y1 + 2 * (1 - p) * p * cy + p * p * y2;
        return <g key={i} filter="url(#ukglow)"><path d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} fill="none" stroke={r.col ?? C.red} strokeWidth={6 * ks} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} /><circle cx={px} cy={py} r={11 * ks} fill="#fff" stroke={r.col ?? C.red} strokeWidth={4 * ks} /></g>; })}
      {pins.map((p, i) => { if (t < p.t) return null; const [x, y] = xyOf(p.at); const a = spring(t, p.t, 14, 7); const col = p.col === 'blue' ? C.blue : p.col === 'white' ? '#fff' : C.red; const R = (p.r ?? 20) * ks * a; const ph = ((t - p.t) % 1.6) / 1.6;
        const side = p.side ?? 'r'; const fs = 27 * ks; const tw = p.label ? textW(p.label, F.hero, fs, fs * 0.06) + 40 * ks : 0; const lh = 54 * ks;
        const lx = side === 'l' ? x - R - 14 * ks - tw : side === 'r' ? x + R + 14 * ks : x - tw / 2; const ly = side === 't' ? y - R - 14 * ks - lh : side === 'b' ? y + R + 14 * ks : y - lh / 2;
        return <g key={i}>
          <circle cx={x} cy={y} r={R + ph * 44 * ks} fill="none" stroke={col} strokeWidth={3 * ks} opacity={0.65 * (1 - ph)} />
          <circle cx={x} cy={y} r={R} fill={col} stroke="#fff" strokeWidth={4 * ks} />
          {p.icon && <g transform={`translate(${x - R * 0.62} ${y - R * 0.62}) scale(${(R * 1.24) / 100})`}><g fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"><IconPaths n={p.icon} /></g></g>}
          {p.label && <g opacity={ramp(t, p.t + 0.1, p.t + 0.3)}><rect x={lx} y={ly} width={tw} height={lh} rx={lh / 2} fill="rgba(6,14,34,0.95)" stroke="#fff" strokeWidth={2.5 * ks} /><text x={lx + tw / 2} y={ly + lh / 2 + fs * 0.34} textAnchor="middle" fontFamily={F.hero} fontSize={fs} letterSpacing={fs * 0.06} fill="#fff">{p.label}</text>
            {p.sub && <text x={lx + tw / 2} y={ly + lh + 26 * ks} textAnchor="middle" fontFamily={F.mono} fontSize={19 * ks} letterSpacing={2 * ks} fill={C.blueL}>{p.sub}</text>}</g>}
        </g>; })}
    </svg>
  </div>;
};
const IconPaths: React.FC<{n: string}> = ({n}) => { const m: Record<string, React.ReactNode> = {person: <><circle cx={50} cy={32} r={17} /><path d="M16 90 C16 60 84 60 84 90" /></>, mountain: <path d="M6 84L38 26L56 58L68 40L94 84Z" />, house: <path d="M10 50L50 16L90 50M22 44V86H78V44" />, flag: <path d="M24 90V12M24 14H80L68 34L80 54H24" />}; return <>{m[n] ?? m.person}</>; };

/* ---------- phone / alarm / chat ---------- */
export const Phone: React.FC<{w?: number; children: React.ReactNode}> = ({w = 360, children}) =>
  <div style={{width: w, height: w * 2.02, borderRadius: w * 0.15, background: '#040813', border: `${w * 0.03}px solid #1c2c52`, boxShadow: '0 0 0 3px rgba(255,255,255,0.85), 0 0 44px rgba(47,123,255,0.5), 0 34px 70px rgba(0,0,0,0.65)', position: 'relative', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: '50%', top: w * 0.03, width: w * 0.3, height: w * 0.07, borderRadius: w, background: '#000', transform: 'translateX(-50%)', zIndex: 3}} />
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(170deg, #12306a 0%, #070f24 70%)'}}>{children}</div></div>;
export const AlarmScreen: React.FC<{t0: number}> = ({t0}) => {
  const t = useT(); const k = t - t0; const shake = k > 0 && k < 3.2 ? Math.sin(k * 52) * 3 * (1 - ramp(k, 2.2, 3.2)) : 0; const ring = (k * 1.6) % 1;
  return <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 120, color: '#fff'}}>
    <div style={{fontFamily: F.mono, fontSize: 24, letterSpacing: 4, color: C.blueL}}>THURSDAY</div>
    <div style={{position: 'relative', marginTop: 30, transform: `translateX(${shake}px)`}}>
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 240 + ring * 150, height: 240 + ring * 150, borderRadius: '50%', border: `4px solid ${C.red}`, opacity: 0.6 * (1 - ring), transform: 'translate(-50%,-50%)'}} />
      <div style={{width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #FF5A6E, #B3122E)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 50px rgba(255,46,74,0.7)'}}><Icon n="bell" size={140} sw={5} /></div></div>
    <div style={{fontFamily: F.uiB, fontSize: 92, marginTop: 36, letterSpacing: -2}}>07:00</div>
    <div style={{fontFamily: F.hero, fontSize: 30, letterSpacing: 5, color: C.redL, marginTop: 4}}>ALARM</div>
    <div style={{marginTop: 54, display: 'flex', gap: 22}}><div style={{padding: '14px 34px', borderRadius: 40, background: 'rgba(255,255,255,0.14)', fontFamily: F.hero, fontSize: 26, letterSpacing: 3}}>SNOOZE</div></div>
  </div>;
};
export const Bubble: React.FC<{text: string; me?: boolean; size?: number; style?: React.CSSProperties}> = ({text, me = true, size = 56, style}) =>
  <div style={{display: 'inline-block', maxWidth: 900, padding: `${size * 0.32}px ${size * 0.55}px`, borderRadius: size * 0.7, background: me ? 'linear-gradient(180deg, #4C93FF, #1F5FE0)' : 'rgba(255,255,255,0.16)', border: me ? 'none' : '2px solid rgba(255,255,255,0.4)', color: '#fff', fontFamily: F.uiB, fontSize: size, lineHeight: 1.15, boxShadow: '0 10px 28px rgba(0,0,0,0.45)', ...style}}>{text}</div>;

/* ---------- No. 10 door (original vector) ---------- */
export const Door10: React.FC<{w?: number}> = ({w = 360}) => <svg width={w} height={w * 1.55} viewBox="0 0 360 560" style={{filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.6))'}}>
  <rect x={0} y={0} width={360} height={560} rx={14} fill="#4a2420" />
  {Array.from({length: 14}, (_, r) => Array.from({length: 7}, (_, c) => <rect key={r + '-' + c} x={c * 56 - (r % 2) * 28 + 2} y={r * 40 + 2} width={52} height={36} rx={3} fill={rnd(r * 7 + c, 2) > 0.5 ? '#5b2b26' : '#51241f'} />))}
  <rect x={50} y={44} width={260} height={500} rx={6} fill="#0a0c12" stroke="#d6dbe6" strokeWidth={5} />
  <path d="M62 140 A118 96 0 0 1 298 140Z" fill="#14264a" stroke="#d6dbe6" strokeWidth={4} /><path d="M180 52 V140 M120 70 L150 140 M240 70 L210 140" stroke="#d6dbe6" strokeWidth={3} opacity={0.7} />
  <g fill="none" stroke="#1c2230" strokeWidth={5}><rect x={84} y={170} width={192} height={120} rx={6} /><rect x={84} y={316} width={192} height={196} rx={6} /></g>
  <circle cx={180} cy={238} r={42} fill="none" stroke="#f4f6fb" strokeWidth={9} /><path d="M120 210 L136 204 V270 M122 270 H150" fill="none" stroke="#f4f6fb" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" transform="translate(-12 -4) scale(0.9)" />
  <rect x={150} y={344} width={60} height={14} rx={7} fill="#c9a24a" /><circle cx={180} cy={410} r={13} fill="#c9a24a" /><circle cx={250} cy={300} r={9} fill="#c9a24a" />
  <rect x={36} y={530} width={288} height={30} rx={4} fill="#9aa3b6" />
</svg>;

/* ---------- people grid / bars / line / calendar / tags / desk / rota / moon bar ---------- */
export const PeopleGrid: React.FC<{t0: number; hot: number; cols?: number; rows?: number; size?: number; lightAll?: number}> = ({t0, hot, cols = 5, rows = 4, size = 120, lightAll}) => {
  const t = useT(); const n = cols * rows;
  return <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: size * 0.16}}>{Array.from({length: n}, (_, i) => { const at = t0 + i * 0.045; const a = spring(t, at, 16, 8); const isH = i === hot || (lightAll !== undefined && t >= lightAll); const hp = lightAll !== undefined ? ramp(t, lightAll, lightAll + 0.25, 0, 1, eo) * (isH ? 1 : 0) : (isH ? ramp(t, t0 + 1.2, t0 + 1.55, 0, 1, eo) : 0);
    return <div key={i} style={{width: size, height: size, borderRadius: size * 0.22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isH && hp > 0 ? 'linear-gradient(160deg, #FF2E4A, #A3122A)' : 'rgba(255,255,255,0.08)', border: `2.5px solid ${isH && hp > 0 ? '#fff' : 'rgba(255,255,255,0.28)'}`, opacity: Math.min(1, a * 1.3), transform: `scale(${(0.5 + 0.5 * a) * (1 + 0.16 * hp)})`, boxShadow: isH && hp > 0 ? '0 0 40px rgba(255,46,74,0.8)' : undefined, zIndex: isH ? 2 : 1}}>
      <Icon n="person" size={size * 0.62} color={isH && hp > 0 ? '#fff' : C.blueL} sw={6.5} /></div>; })}</div>;
};
export const BarPair: React.FC<{t0: number; w: number; h: number; a: {label: string; v: number; sub?: string}; b: {label: string; v: number; sub?: string}; max: number; fmt?: (v: number) => string; delta: string}> = ({t0, w, h, a, b, max, fmt = (v) => String(Math.round(v)), delta}) => {
  const t = useT(); const pa = ramp(t, t0, t0 + 0.7, 0, 1, eo), pb = ramp(t, t0 + 0.45, t0 + 1.25, 0, 1, eo); const bw = w * 0.3; const base = h - 90;
  const ha = (a.v / max) * (base - 40) * pa, hb = (b.v / max) * (base - 40) * pb; const dp = spring(t, t0 + 1.3, 15, 6.5);
  return <div style={{width: w, height: h, position: 'relative'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: base, height: 4, background: 'rgba(255,255,255,0.35)'}} />
    {[[a, ha, 0.12, '#5E86C9', pa], [b, hb, 0.58, C.red, pb]].map(([d, hh, lx, col, pp], i) => { const dd = d as typeof a; return <div key={i} style={{position: 'absolute', left: w * (lx as number), bottom: h - base, width: bw, height: hh as number, borderRadius: '18px 18px 0 0', background: `linear-gradient(180deg, ${col}, ${i ? '#8a0f26' : '#2a4780'})`, boxShadow: i ? '0 0 40px rgba(255,46,74,0.6)' : '0 0 24px rgba(47,123,255,0.35)', border: '2.5px solid rgba(255,255,255,0.9)'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: -92, textAlign: 'center', fontFamily: F.display, fontSize: 70, color: '#fff', opacity: pp as number}}>{fmt(dd.v * (pp as number))}</div></div>; })}
    {[a, b].map((d, i) => <div key={i} style={{position: 'absolute', left: w * (i ? 0.58 : 0.12) - 40, width: bw + 80, top: base + 14, textAlign: 'center', fontFamily: F.hero, fontSize: 26, letterSpacing: 2.5, color: i ? C.redL : C.blueL}}>{d.label}{d.sub && <div style={{fontFamily: F.mono, fontSize: 19, color: C.mute, marginTop: 4}}>{d.sub}</div>}</div>)}
    {dp > 0 && <div style={{position: 'absolute', left: w * 0.0, top: 4, transform: `scale(${0.4 + 0.6 * dp}) rotate(-4deg)`, opacity: Math.min(1, dp * 1.5)}}><Pill text={delta} v="red" size={44} /></div>}
  </div>;
};
export const LineSpike: React.FC<{t0: number; w: number; h: number; dur?: number; spikeAt?: number}> = ({t0, w, h, dur = 2.4, spikeAt = 0.78}) => {
  const t = useT(); const p = ramp(t, t0, t0 + dur, 0, 1, eio); const N = 60; const pts = Array.from({length: N + 1}, (_, i) => { const x = (i / N) * w; const u = i / N; const base = 0.22 + 0.06 * Math.sin(u * 14) + 0.04 * rnd(i, 9); const spike = u > spikeAt ? Math.pow((u - spikeAt) / (1 - spikeAt), 0.8) * 0.62 : 0; return [x, h - (base + spike) * h * 0.9] as [number, number]; });
  const upto = Math.floor(N * p); const d = pts.slice(0, upto + 1).map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(''); const last = pts[Math.max(0, upto)];
  return <svg width={w} height={h} style={{overflow: 'visible'}}><defs><linearGradient id="lsg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.red} stopOpacity={0.5} /><stop offset="1" stopColor={C.red} stopOpacity={0} /></linearGradient></defs>
    {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={0} x2={w} y1={h * g} y2={h * g} stroke="rgba(255,255,255,0.12)" strokeWidth={2} />)}
    <path d={`${d}L${last[0]} ${h}L0 ${h}Z`} fill="url(#lsg)" /><path d={d} fill="none" stroke={C.red} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" style={{filter: `drop-shadow(0 0 12px ${C.red})`}} />
    <circle cx={last[0]} cy={last[1]} r={13} fill="#fff" stroke={C.red} strokeWidth={5} /></svg>;
};
export const CalendarCard: React.FC<{t0: number; w?: number; hot?: number; month?: string}> = ({t0, w = 560, hot = 19, month = 'NOVEMBER 2026'}) => {
  const t = useT(); const cell = (w - 60) / 7; const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']; const off = 6; const hp = spring(t, t0 + 0.55, 14, 6.5);
  return <div style={{width: w, borderRadius: 24, overflow: 'hidden', border: '2.5px solid rgba(255,255,255,0.92)', background: 'linear-gradient(160deg, rgba(18,40,88,0.96), rgba(6,15,36,0.98))', boxShadow: '0 0 44px rgba(47,123,255,0.45), 0 30px 70px rgba(0,0,0,0.65)'}}>
    <div style={{background: 'linear-gradient(100deg, #FF2E4A, #A3122A)', padding: '16px 26px', fontFamily: F.hero, fontSize: 36, letterSpacing: 5, color: '#fff', display: 'flex', justifyContent: 'space-between'}}><span>{month}</span><span style={{opacity: 0.7}}>●●</span></div>
    <div style={{padding: 30, display: 'grid', gridTemplateColumns: `repeat(7, ${cell}px)`, rowGap: 8}}>
      {days.map((d, i) => <div key={d} style={{textAlign: 'center', fontFamily: F.mono, fontSize: 19, letterSpacing: 1.5, color: i === 3 ? C.redL : C.mute}}>{d}</div>)}
      {Array.from({length: 35}, (_, i) => { const d = i - off + 1; const ok = d >= 1 && d <= 30; const isH = d === hot; return <div key={i} style={{height: cell * 0.82, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontFamily: F.uiB, fontSize: 32, color: ok ? '#fff' : 'rgba(255,255,255,0.12)', opacity: ramp(t, t0 + i * 0.012, t0 + 0.3 + i * 0.012)}}>
        {isH && <div style={{position: 'absolute', width: cell * 0.98, height: cell * 0.98, borderRadius: '50%', background: 'radial-gradient(circle, #FF5A6E, #C01634)', boxShadow: '0 0 30px rgba(255,46,74,0.9)', transform: `scale(${hp})`}} />}<span style={{position: 'relative', fontSize: isH ? 40 : 32}}>{ok ? d : ''}</span></div>; })}
    </div></div>;
};
export const EvidenceTag: React.FC<{item: string; icon: string; label: string; sub?: string; w?: number; red?: boolean}> = ({item, icon, label, sub, w = 400, red}) =>
  <div style={{width: w, position: 'relative', paddingTop: 54}}>
    <svg width={w} height={90} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}><path d={`M${w / 2 - 70} 62 Q${w / 2} -20 ${w / 2 + 70} 62`} fill="none" stroke="#fff" strokeWidth={5} opacity={0.8} /></svg>
    <div style={{borderRadius: 18, overflow: 'hidden', background: '#f1f5ff', color: '#0a1a3a', boxShadow: '0 0 0 4px rgba(255,255,255,0.15), 0 24px 50px rgba(0,0,0,0.6)', border: '3px solid #fff'}}>
      <div style={{background: red ? 'linear-gradient(100deg, #FF2E4A, #A3122A)' : 'linear-gradient(100deg, #2F7BFF, #123C8F)', color: '#fff', padding: '12px 22px', fontFamily: F.mono, fontSize: 24, letterSpacing: 4, display: 'flex', justifyContent: 'space-between'}}><span>{item}</span><span style={{opacity: 0.7}}>EXHIBIT</span></div>
      <div style={{padding: '22px 26px 26px', display: 'flex', alignItems: 'center', gap: 22}}><div style={{width: 96, height: 96, borderRadius: 20, background: '#0a1a3a', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}><Icon n={icon} size={64} /></div>
        <div><div style={{fontFamily: F.display, fontSize: 46, lineHeight: 1.05, textTransform: 'uppercase'}}>{label}</div>{sub && <div style={{fontFamily: F.mono, fontSize: 19, letterSpacing: 1.5, color: '#4a5d86', marginTop: 6}}>{sub}</div>}</div></div></div></div>;
export const Redact: React.FC<{t0: number; w: number; h?: number}> = ({t0, w, h = 34}) => { const t = useT(); const p = ramp(t, t0, t0 + 0.4, 0, 1, eio); return <div style={{width: w * p, height: h, background: '#05080f', borderRadius: 4, boxShadow: '0 0 0 2px rgba(255,255,255,0.2)'}} />; };
export const EmptyDesk: React.FC<{w?: number}> = ({w = 640}) => <svg width={w} height={w * 0.7} viewBox="0 0 640 448" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
  <rect x={40} y={250} width={560} height={26} rx={8} fill="rgba(47,123,255,0.25)" /><path d="M70 276V420M570 276V420" /><rect x={210} y={86} width={220} height={140} rx={12} fill="rgba(5,11,26,0.9)" /><path d="M320 226V250M270 250H370" />
  <path d="M470 250 L490 200 H540 L548 250" fill="rgba(255,46,74,0.25)" stroke={C.redL} /><path d="M100 250V220H150V250" /><rect x={110} y={196} width={30} height={24} fill="rgba(255,255,255,0.2)" />
  <g transform="translate(250 290)"><path d="M0 0H140V30H0ZM70 30V110M20 130L70 110L120 130" /></g></svg>;
export const Rota: React.FC<{t0: number; w: number; rows?: number; cols?: number}> = ({t0, w, rows = 4, cols = 5}) => {
  const t = useT(); const cw = (w - 40) / cols; const names = ['AM', 'PM', 'LATE', 'OPEN'];
  return <div style={{width: w, display: 'grid', gridTemplateColumns: `80px repeat(${cols - 1}, 1fr)`, gap: 8}}>{Array.from({length: rows * cols}, (_, i) => { const r = Math.floor(i / cols), c = i % cols; if (c === 0) return <div key={i} style={{fontFamily: F.mono, fontSize: 22, color: C.blueL, display: 'flex', alignItems: 'center'}}>{names[r]}</div>;
    const empty = (r * 3 + c * 2) % 3 !== 0; const at = t0 + 0.2 + i * 0.05 + (empty ? 0.35 : 0); const a = ramp(t, at, at + 0.2);
    return <div key={i} style={{height: 64, borderRadius: 12, background: empty ? 'rgba(255,46,74,0.16)' : 'rgba(47,123,255,0.28)', border: `2px ${empty ? 'dashed' : 'solid'} ${empty ? C.red : 'rgba(255,255,255,0.5)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.hero, fontSize: 26, color: empty ? C.redL : '#fff', opacity: a}}>{empty ? '?' : '✓'}</div>; })}</div>;
};
export const BigBar: React.FC<{t0: number; dur: number; w: number; label?: string; end?: React.ReactNode; to?: number}> = ({t0, dur, w, label, end, to = 1}) => {
  const t = useT(); const p = ramp(t, t0, t0 + dur, 0, to, eio);
  return <div style={{width: w}}><div style={{height: 74, borderRadius: 37, background: 'rgba(255,255,255,0.1)', border: '3px solid rgba(255,255,255,0.85)', overflow: 'hidden', position: 'relative', boxShadow: '0 0 30px rgba(47,123,255,0.4)'}}>
    <div style={{width: `${p * 100}%`, height: '100%', background: 'linear-gradient(90deg, #2F7BFF, #8FC1FF)', borderRadius: 37}} /><div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.hero, fontSize: 34, letterSpacing: 3, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.65)'}}>{label ?? `${Math.round(p * 100)}%`}</div></div>
    {end && <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 16}}>{end}</div>}</div>;
};
export const Quote: React.FC<{w: number; children: React.ReactNode; who?: string; v?: 'blue' | 'red'}> = ({w, children, who, v = 'blue'}) =>
  <div style={{width: w, borderRadius: 28, padding: '46px 52px 40px', position: 'relative', boxSizing: 'border-box', background: v === 'red' ? 'linear-gradient(160deg, rgba(96,14,36,0.95), rgba(30,6,18,0.97))' : 'linear-gradient(160deg, rgba(18,40,88,0.95), rgba(6,15,36,0.97))', border: '2.5px solid rgba(255,255,255,0.92)', boxShadow: `0 0 44px rgba(${v === 'red' ? '255,46,74' : '47,123,255'},0.45), 0 30px 70px rgba(0,0,0,0.65)`}}>
    <div style={{position: 'absolute', left: 34, top: -6, fontFamily: F.display, fontSize: 190, lineHeight: 1, color: v === 'red' ? C.red : C.blue, opacity: 0.9}}>“</div>
    <div style={{paddingLeft: 56, fontFamily: F.uiB, fontSize: 54, lineHeight: 1.22, color: '#fff'}}>{children}</div>
    {who && <div style={{paddingLeft: 56, marginTop: 22, fontFamily: F.mono, fontSize: 24, letterSpacing: 3, color: C.blueL, textTransform: 'uppercase'}}>— {who}</div>}</div>;
export {commas, cl};
