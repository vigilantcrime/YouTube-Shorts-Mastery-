/* VC long-form Part 2 components (all original vector art). */
import React from 'react';
import {C, Card, F, Icon, Pill, ramp, eio, eo, rnd, spring, useT} from './kit';

/* raffle ticket: "prize draw" */
export const Ticket: React.FC<{t0: number; w?: number}> = ({t0, w = 780}) => {
  const t = useT(); const h = w * 0.4; const a = spring(t, t0 + 0.2, 14, 7);
  return <div style={{width: w, height: h, borderRadius: 24, position: 'relative', overflow: 'hidden', background: 'linear-gradient(110deg, #A3122A 0%, #FF2E4A 60%, #FF8A99 100%)', border: '3px solid #fff', boxShadow: '0 0 50px rgba(255,46,74,0.55), 0 30px 70px rgba(0,0,0,0.6)'}}>
    <div style={{position: 'absolute', right: w * 0.26, top: 0, bottom: 0, borderRight: '4px dashed rgba(255,255,255,0.65)'}} />
    <div style={{position: 'absolute', right: w * 0.26 - 24, top: -24, width: 48, height: 48, borderRadius: '50%', background: '#0a1a3a'}} /><div style={{position: 'absolute', right: w * 0.26 - 24, bottom: -24, width: 48, height: 48, borderRadius: '50%', background: '#0a1a3a'}} />
    <div style={{position: 'absolute', left: 38, top: 26, fontFamily: F.mono, fontSize: 21, letterSpacing: 5, color: '#ffe3e8'}}>ADMIT ONE · FULL ATTENDANCE</div>
    <div style={{position: 'absolute', left: 34, top: h * 0.3, fontFamily: F.display, fontSize: h * 0.36, lineHeight: 1, color: '#fff', textShadow: '0 6px 0 rgba(90,10,28,0.7)', whiteSpace: 'nowrap'}}>PRIZE DRAW</div>
    <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: w * 0.26, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${(1 - a) * -40}deg) scale(${0.6 + 0.4 * a})`}}><Icon n="star" size={w * 0.13} sw={6} /></div>
  </div>;
};

/* classroom: a grid of seats, a chunk of them go empty */
export const EmptySeats: React.FC<{t0: number; offAt: number; cols?: number; rows?: number; size?: number}> = ({t0, offAt, cols = 6, rows = 4, size = 100}) => {
  const t = useT();
  return <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: size * 0.16}}>{Array.from({length: cols * rows}, (_, i) => {
    const a = spring(t, t0 + i * 0.03, 16, 8); const off = rnd(i, 51) < 0.42; const g = off ? ramp(t, offAt + rnd(i, 52) * 0.9, offAt + rnd(i, 52) * 0.9 + 0.3, 0, 1, eo) : 0; const gh = g > 0.5;
    return <div key={i} style={{width: size, height: size, borderRadius: size * 0.22, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px ${gh ? 'dashed' : 'solid'} ${gh ? 'rgba(255,46,74,0.8)' : 'rgba(255,255,255,0.85)'}`, background: gh ? 'rgba(255,46,74,0.07)' : 'rgba(47,123,255,0.26)', opacity: Math.min(1, a * 1.3), transform: `scale(${0.5 + 0.5 * a})`}}>
      <Icon n={gh ? 'chair' : 'person'} size={size * 0.6} color={gh ? 'rgba(255,138,153,0.55)' : C.blueL} /></div>; })}</div>;
};

/* a grid of small schools (a "bigger set") */
export const SchoolGrid: React.FC<{t0: number; cols?: number; rows?: number; size?: number}> = ({t0, cols = 8, rows = 5, size = 74}) => {
  const t = useT();
  return <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: size * 0.14}}>{Array.from({length: cols * rows}, (_, i) => { const a = spring(t, t0 + i * 0.022, 16, 8);
    return <div key={i} style={{width: size, height: size, borderRadius: size * 0.2, background: 'rgba(47,123,255,0.2)', border: '2px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, a * 1.3), transform: `scale(${0.5 + 0.5 * a})`}}><Icon n="school" size={size * 0.62} color={C.blueL} sw={7} /></div>; })}</div>;
};

/* the week you were promised vs the week you got */
export const WeekCard: React.FC<{t0: number; w?: number}> = ({t0, w = 760}) => {
  const t = useT(); const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']; const cw = (w - 68 - 6 * 12) / 7;
  const row = (label: string, actual: boolean, y: number) => <div style={{position: 'absolute', left: 34, top: y, width: w - 68}}>
    <div style={{fontFamily: F.hero, fontSize: 24, letterSpacing: 4, color: actual ? C.redL : C.blueL, marginBottom: 12}}>{label}</div>
    <div style={{display: 'flex', gap: 12}}>{days.map((d, i) => { const at = t0 + (actual ? 1.3 : 0.2) + i * 0.1; const a = spring(t, at, 15, 7); const rest = !actual && i >= 5;
      return <div key={d} style={{width: cw, height: 124, borderRadius: 16, border: `3px ${rest ? 'dashed' : 'solid'} ${rest ? 'rgba(143,193,255,0.8)' : 'rgba(255,255,255,0.8)'}`, background: rest ? 'rgba(143,193,255,0.08)' : actual ? 'linear-gradient(160deg, #FF2E4A, #A3122A)' : 'linear-gradient(160deg, #3F8CFF, #123C8F)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: Math.min(1, a * 1.3), transform: `scale(${0.6 + 0.4 * a})`}}>
        <div style={{fontFamily: F.mono, fontSize: 17, letterSpacing: 2, color: '#fff'}}>{d}</div><Icon n={rest ? 'bed' : 'case'} size={42} color={rest ? C.blueL : '#fff'} sw={7} /></div>; })}</div></div>;
  return <Card w={w} h={420} label="The week you were promised" v="blue" pad={34}>{row('PROMISED', false, 72)}{row('ACTUAL', true, 250)}</Card>;
};

/* a comment box with a typed invitation */
export const CommentBox: React.FC<{t0: number; w?: number; text: string}> = ({t0, w = 900, text}) => {
  const t = useT(); const n = Math.max(0, Math.min(text.length, Math.floor((t - t0 - 0.3) * 22))); const blink = Math.floor(t * 2.4) % 2 === 0;
  return <Card w={w} label="Comments" v="blue" pad={34}>
    <div style={{display: 'flex', gap: 26, alignItems: 'flex-start', marginTop: 8}}>
      <div style={{width: 92, height: 92, borderRadius: '50%', background: 'linear-gradient(160deg, #3F8CFF, #123C8F)', border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}><Icon n="person" size={58} /></div>
      <div style={{flex: 1}}><div style={{minHeight: 98, borderRadius: 18, background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.35)', padding: '20px 26px', fontFamily: F.uiB, fontSize: 46, color: '#fff'}}>{text.slice(0, n)}<span style={{color: C.red, opacity: blink ? 1 : 0}}>|</span></div>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 16}}><div style={{padding: '10px 34px', borderRadius: 30, background: 'linear-gradient(100deg, #3F8CFF, #1A4FC0)', border: '2px solid #fff', fontFamily: F.hero, fontSize: 26, letterSpacing: 4, color: '#fff'}}>POST</div></div></div></div>
  </Card>;
};

/* ECG: flat, then alive */
export const Pulse: React.FC<{t0: number; alive: number; w?: number; h?: number}> = ({t0, alive, w = 1200, h = 260}) => {
  const t = useT(); const p = ramp(t, t0, t0 + 1.6, 0, 1, eio); const N = 240;
  const y = (i: number) => { const x = i / N * w; const u = i / N; const ph = (u * 7) % 1; const live = t > alive; if (!live || u < 0.18) return h / 2 + Math.sin(i * 0.7) * 1.5;
    if (ph > 0.40 && ph < 0.44) return h / 2 + h * 0.40 * Math.sin((ph - 0.4) / 0.04 * Math.PI); if (ph > 0.44 && ph < 0.52) return h / 2 - h * 0.38 * Math.sin((ph - 0.44) / 0.08 * Math.PI); if (ph > 0.52 && ph < 0.56) return h / 2 + h * 0.16 * Math.sin((ph - 0.52) / 0.04 * Math.PI); return h / 2; };
  const upto = Math.floor(N * p); const d = Array.from({length: upto + 1}, (_, i) => `${i ? 'L' : 'M'}${(i / N * w).toFixed(1)} ${y(i).toFixed(1)}`).join('');
  return <svg width={w} height={h} style={{overflow: 'visible'}}><path d={d} fill="none" stroke={C.red} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" style={{filter: `drop-shadow(0 0 16px ${C.red})`}} /><circle cx={(upto / N) * w} cy={y(upto)} r={13} fill="#fff" stroke={C.red} strokeWidth={5} /></svg>;
};

/* breathing rings */
export const Breath: React.FC<{size?: number}> = ({size = 280}) => {
  const t = useT(); const b = 0.5 + 0.5 * Math.sin(t * 1.6 - Math.PI / 2);
  return <div style={{width: size, height: size, position: 'relative'}}>{[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: '50%', top: '50%', width: size * (0.5 + 0.22 * i + 0.16 * b), height: size * (0.5 + 0.22 * i + 0.16 * b), marginLeft: -size * (0.25 + 0.11 * i + 0.08 * b), marginTop: -size * (0.25 + 0.11 * i + 0.08 * b), borderRadius: '50%', border: `${5 - i}px solid ${i === 0 ? '#fff' : C.blueL}`, opacity: 0.95 - i * 0.28, boxShadow: `0 0 ${30 + 30 * b}px rgba(47,123,255,0.8)`}} />)}
    <div style={{position: 'absolute', left: '50%', top: '50%', width: size * 0.3 * (0.8 + 0.4 * b), height: size * 0.3 * (0.8 + 0.4 * b), marginLeft: -size * 0.15 * (0.8 + 0.4 * b), marginTop: -size * 0.15 * (0.8 + 0.4 * b), borderRadius: '50%', background: 'radial-gradient(circle, #fff, #8FC1FF 60%, rgba(47,123,255,0))'}} /></div>;
};

/* price card: label + rising arrow */
export const RiseCard: React.FC<{t0: number; label: string; icon: string; w?: number}> = ({t0, label, icon, w = 420}) => {
  const t = useT(); const a = spring(t, t0 + 0.3, 14, 7);
  return <Card w={w} h={330} v="red" pad={30}>
    <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 14}}><Icon n={icon} size={80} color={C.redL} /><div style={{fontFamily: F.hero, fontSize: 34, letterSpacing: 3, color: '#fff'}}>{label}</div></div>
    <div style={{display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - a) * 50}px)`, opacity: Math.min(1, a * 1.4)}}><Icon n="up" size={150} color={C.red} sw={11} style={{filter: `drop-shadow(0 0 24px ${C.red})`}} /></div>
  </Card>;
};
