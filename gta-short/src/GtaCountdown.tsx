import React from 'react';
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile,
  useCurrentFrame, interpolate, Easing,
} from 'remotion';
import words from './w3.json';
import {FPS, W, H, GRAD, SHADOW, f, ease, useFonts, Grade, Clip, Title, Label, Accent, Bubble} from './kit';

/* Local word lookup (kit's `at` is bound to the 40s video's words). */
type Wd = [string, number];
const WT = (words as Wd[]).map(([w, t]) => [w, t + 0.05] as Wd);
const at = (word: string, after = 0) => WT.find(([w, t]) => w === word && t >= after)?.[1] ?? after;

/* ------------------------------------------------------------------ */
/* Shot list — cut ~1 frame before each clause (style.md §2)            */
/* ------------------------------------------------------------------ */
const CUT = [
  0,      // 0  "6 days"                         flip counter hook
  0.93,   // 1  "That's all that's left"         ticking countdown
  2.13,   // 2  "before Vice City opens its doors"
  4.12,   // 3  "GTA 6 drops"                    FLASH + DROP
  5.25,   // 4  "November 19th"                  calendar flips 13 -> 19
  6.33,   // 5  "people are already booking the day off work"  time-off cards + APPROVED
  8.65,   // 6  "One estimate… lose a billion dollars"          $ ticker
  11.42,  // 7  "in productivity on launch day alone"           office lights go out
  13.40,  // 8  "Analysts reckon… $5.2 billion first week"      tower
  17.22,  // 9  "That's more than most films make in their lifetime"  bars
  19.97,  // 10 "pre-orders… strongest ever recorded"           record graph + stamp
  23.13,  // 11 "Rockstar printed money"                        money rain
  24.41,  // 12 "before anyone even pressed start"              PRESS START
  26.25,  // 13 "So be honest."                                  black, bass out
  27.37,  // 14 "Are you calling in sick on the 19th?"           call screen, DROP
  29.41,  // 15 "Tell me in the comments"                        comment stack
  30.45,  // 16 "and follow Vice City Sin for everything GTA 6"  follow tap
  35.0,
];
const FLASHES: [number, number, string][] = [[4.12, 1, '#fff'], [15.95, 0.35, '#ffd2ea'], [22.6, 0.4, '#fff'], [27.37, 0.6, '#ffd2ea']];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const pop = (lf: number, frames = 8, from = 0.5) => ({
  s: interpolate(lf, [0, frames], [from, 1], {easing: Easing.out(Easing.back(2.2)), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  o: interpolate(lf, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
});
const ramp = (fr: number, a: number, b: number, from: number, to: number, e = Easing.out(Easing.cubic)) =>
  interpolate(fr, [a, b], [from, to], {easing: e, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
const Void: React.FC<{children?: React.ReactNode; bg?: string; from?: number; dur: number}> = ({children, bg = 'c1_street.mp4', from = 1, dur}) => (
  <AbsoluteFill>
    <Clip src={bg} from={from} dur={dur} zoom={[1.3, 1.4]} blur={18} whip />
    <AbsoluteFill style={{background: 'rgba(14,4,26,.55)'}} />
    <NeonFloor />
    {children}
  </AbsoluteFill>
);
const NeonFloor: React.FC<{opacity?: number}> = ({opacity = 0.5}) => {
  const fr = useCurrentFrame();
  return (
    <AbsoluteFill style={{top: H * 0.62, opacity, transform: 'perspective(700px) rotateX(62deg)', transformOrigin: 'top',
      backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,80,190,.6) 0 3px, transparent 3px 90px), repeating-linear-gradient(0deg, rgba(255,80,190,.5) 0 3px, transparent 3px 70px)',
      backgroundPosition: `0 ${fr * 4}px`}} />
  );
};
const Src: React.FC<{text: string; y?: number}> = ({text, y = 0.9}) => (
  <div style={{position: 'absolute', top: H * y, width: W, textAlign: 'center', fontFamily: 'UIBold', fontSize: 26, color: 'rgba(255,255,255,.72)', textShadow: SHADOW}}>{text}</div>
);
const money = (v: number) => '$' + Math.round(v).toLocaleString('en-US');

/* ------------------------------------------------------------------ */
/* Scenes                                                              */
/* ------------------------------------------------------------------ */

/** 0 · "6 days" — split-flap digit flips 7 -> 6, DAYS slams. */
const Hook: React.FC = () => {
  const fr = useCurrentFrame();
  const flip = ramp(fr, 0, 6, 1, 0, Easing.in(Easing.quad));       // top half of "7" folds down
  const d = pop(fr - f(at('DAYS') - 0.05), 7, 1.5);
  const digit = (n: string, style: React.CSSProperties = {}) => (
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'HeroBlack', fontSize: 470,
      backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', lineHeight: 1, ...style}}>{n}</div>
  );
  return (
    <AbsoluteFill>
      <Clip src="c1_street.mp4" from={0} dur={1} zoom={[1.15, 1.22]} />
      <AbsoluteFill style={{background: 'rgba(14,4,26,.35)'}} />
      <div style={{position: 'absolute', left: (W - 440) / 2, top: 440, width: 440, height: 560, borderRadius: 40, background: 'rgba(16,6,28,.9)',
        boxShadow: '0 30px 90px rgba(0,0,0,.6), 0 0 60px rgba(255,90,170,.45), inset 0 0 0 4px rgba(255,255,255,.12)', overflow: 'hidden', perspective: 1200}}>
        {digit('6')}
        {/* folding top half of the old digit */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: '50%', overflow: 'hidden', background: 'rgba(16,6,28,1)',
          transformOrigin: 'bottom', transform: `rotateX(${(1 - flip) * -90}deg)`, opacity: flip > 0.02 ? 1 : 0}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 560}}>{digit('7')}</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: 6, background: 'rgba(0,0,0,.7)'}} />
      </div>
      <div style={{position: 'absolute', top: 1050, width: W, textAlign: 'center', fontFamily: 'HeroBlack', fontSize: 170, color: '#fff', letterSpacing: -4,
        textShadow: SHADOW, opacity: d.o, transform: `scale(${d.s})`}}>DAYS</div>
      <Src text="until GTA 6 · Nov 19, 2026" y={0.66} />
    </AbsoluteFill>
  );
};

/** 1 · "That's all that's left" — live countdown ticking. */
const Countdown: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const secs = 6 * 86400 - Math.floor(fr / 3) * 37;   // ticks fast for energy
  const dd = Math.floor(secs / 86400), hh = Math.floor((secs % 86400) / 3600), mm = Math.floor((secs % 3600) / 60), ss = secs % 60;
  const p = pop(fr - 1, 8, 0.8);
  const box = (v: number, l: string) => (
    <div style={{textAlign: 'center'}}>
      <div style={{width: 200, height: 220, borderRadius: 26, background: 'rgba(16,6,28,.88)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'HeroBlack', fontSize: 130, color: '#fff', boxShadow: '0 0 40px rgba(255,90,170,.35), inset 0 0 0 3px rgba(255,255,255,.12)'}}>{String(v).padStart(2, '0')}</div>
      <div style={{fontFamily: 'UIBold', fontSize: 30, color: 'rgba(255,255,255,.8)', marginTop: 14, letterSpacing: 2}}>{l}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Clip src="c1_street.mp4" from={1} dur={dur} zoom={[1.22, 1.3]} blur={6} />
      <div style={{position: 'absolute', top: 560, width: W, display: 'flex', justifyContent: 'center', gap: 26, opacity: p.o, transform: `scale(${p.s})`}}>
        {box(dd, 'DAYS')}{box(hh, 'HRS')}{box(mm, 'MIN')}{box(ss, 'SEC')}
      </div>
      <Title shotStart={start} lines={[
        [{w: "that's", t: at("THAT'S")}, {w: 'all', t: at('ALL')}],
        [{w: "that's", t: at("THAT'S", 1.3)}, {w: 'left.', t: at('LEFT'), accent: true}],
      ]} />
    </AbsoluteFill>
  );
};

/** 3 · "GTA 6 drops" — flash, wireframe city, slam. */
const DropSlam: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const g = pop(fr, 8, 1.45), six = pop(fr - f(at('SIX', 4.3) - start), 7, 1.6), dr = pop(fr - f(at('DROPS') - start), 7, 1.4);
  const b = ramp(fr, 0, 8, 30, 0);
  return (
    <AbsoluteFill style={{alignItems: 'center'}}>
      <Clip src="c2_glitch.mp4" from={2.6} dur={dur} zoom={[1.0, 1.1]} />
      <div style={{position: 'absolute', top: H * 0.34, display: 'flex', gap: 30, alignItems: 'baseline'}}>
        <span style={{fontFamily: 'HeroBlack', fontSize: 300, letterSpacing: -10, color: '#fff', opacity: g.o, transform: `scale(${g.s})`, filter: `blur(${b}px)`, textShadow: SHADOW, display: 'inline-block'}}>GTA</span>
        <span style={{fontFamily: 'HeroBlack', fontSize: 300, letterSpacing: -10, opacity: six.o, transform: `scale(${six.s})`, display: 'inline-block',
          backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 6px 14px rgba(30,0,20,.6))'}}>6</span>
      </div>
      <div style={{position: 'absolute', top: H * 0.53, fontFamily: 'HeroBlack', fontSize: 150, letterSpacing: -4, color: '#fff', textShadow: SHADOW,
        opacity: dr.o, transform: `scale(${dr.s})`}}>DROPS</div>
    </AbsoluteFill>
  );
};

/** 4 · "November 19th" — calendar pages flip 13 -> 19 (today -> launch). */
const Calendar: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const day = Math.min(19, 13 + Math.floor(fr / 3));
  const landed = day === 19;
  const bounce = landed ? pop(fr - 18, 8, 1.15).s : 1;
  const tilt = landed ? 0 : (fr % 3) * -12;
  return (
    <Void dur={dur} from={2}>
      <div style={{position: 'absolute', left: (W - 640) / 2, top: 360, width: 640, borderRadius: 40, overflow: 'hidden', background: '#fff',
        boxShadow: '0 30px 90px rgba(0,0,0,.6), 0 0 70px rgba(255,90,170,.45)', transform: `scale(${bounce}) perspective(1400px) rotateX(${tilt}deg)`, transformOrigin: 'top'}}>
        <div style={{background: GRAD, fontFamily: 'HeroBlack', fontSize: 50, color: '#fff', textAlign: 'center', padding: '22px 0', letterSpacing: 3}}>RELEASE DATE</div>
        <div style={{fontFamily: 'HeroBlack', fontSize: 380, lineHeight: 1, textAlign: 'center', padding: '30px 0 0',
          ...(landed ? {backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'} : {color: '#222'})}}>{day}</div>
        <div style={{fontFamily: 'HeroBlack', fontSize: 74, color: '#111', textAlign: 'center', padding: '6px 0 0'}}>NOV 2026</div>
        <div style={{fontFamily: 'UIBold', fontSize: 34, color: '#999', textAlign: 'center', padding: '6px 0 40px'}}>THURSDAY</div>
      </div>
      <Title shotStart={start} y={0.78} lines={[[{w: 'November', t: at('NOVEMBER')}, {w: '19th', t: at('NINETEEN'), accent: true}]]} />
    </Void>
  );
};

/** 5 · "people are already booking the day off work" — stacked time-off requests, APPROVED stamps. */
const TimeOff: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const stampAt = f(at('OFF') - start);
  const cards = ['Alex M.', 'Jordan T.', 'Sam R.', 'Priya K.'];
  return (
    <Void dur={dur} bg="c3_split.mp4" from={0.5}>
      {cards.map((n, i) => {
        const p = pop(fr - f(at('PEOPLE') - start) - i * 4, 9, 0.7);
        const st = pop(fr - stampAt - i * 3, 6, 2.4);
        const y = 300 + i * 70, r = [-6, 4, -3, 2][i];
        return (
          <div key={i} style={{position: 'absolute', left: 120 + i * 18, top: y, width: 800, padding: '40px 44px', borderRadius: 30, background: '#fff',
            boxShadow: '0 20px 60px rgba(0,0,0,.45)', opacity: p.o, transform: `scale(${p.s}) rotate(${r}deg)`}}>
            <div style={{fontFamily: 'UIBold', fontSize: 28, color: '#888', letterSpacing: 2}}>TIME-OFF REQUEST</div>
            <div style={{fontFamily: 'HeroBlack', fontSize: 58, color: '#111', marginTop: 8}}>Thu, Nov 19</div>
            <div style={{fontFamily: 'UIBold', fontSize: 32, color: '#555', marginTop: 8}}>{n} · Reason: <span style={{color: '#e0337a'}}>"personal"</span> 🎮</div>
            <div style={{position: 'absolute', right: 40, top: 46, transform: `rotate(-14deg) scale(${st.s})`, opacity: st.o, fontFamily: 'HeroBlack', fontSize: 50,
              color: '#18b663', border: '6px solid #18b663', borderRadius: 14, padding: '2px 16px'}}>APPROVED</div>
          </div>
        );
      })}
      <Title shotStart={start} lines={[
        [{w: 'already', t: at('ALREADY')}, {w: 'booking', t: at('BOOKING')}],
        [{w: 'the', t: at('THE', 7.6)}, {w: 'day', t: at('DAY', 7.8)}, {w: 'off.', t: at('OFF'), accent: true}],
      ]} />
    </Void>
  );
};

/** 6 · "One estimate says the US could lose a billion dollars" — ticker lands on $1,000,000,000. */
const Billion: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const a = 6, b = f(at('DOLLARS') - start) + 4;
  const v = ramp(fr, a, b, 0, 1e9, Easing.out(Easing.poly(4)));
  const landed = fr >= b;
  const s = landed ? pop(fr - b, 7, 1.12).s : 1;
  return (
    <Void dur={dur} from={0.2}>
      <Label t={start + 0.05} shotStart={start} y={0.2} text={<>US PRODUCTIVITY <Accent>LOST</Accent></>} source="one estimate · launch day" />
      <div style={{position: 'absolute', top: 760, width: W, textAlign: 'center', fontFamily: 'HeroBlack', fontSize: 132, letterSpacing: -4, transform: `scale(${s})`,
        ...(landed ? {backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 6px 14px rgba(30,0,20,.6))'}
          : {color: '#fff', textShadow: SHADOW})}}>{v > 0 ? '−' : ''}{money(v)}</div>
      <Title shotStart={start} lines={[[{w: 'a', t: at('A', 10.4)}, {w: 'billion', t: at('BILLION'), accent: true}, {w: 'dollars', t: at('DOLLARS')}]]} />
    </Void>
  );
};

/** 7 · "in productivity on launch day alone" — an office floor's monitors switch off. */
const Office: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const z = ramp(fr, 0, f(dur), 1.0, 1.08, Easing.inOut(Easing.cubic));
  const N = 48;
  return (
    <AbsoluteFill style={{background: '#0d0416'}}>
      <AbsoluteFill style={{transform: `scale(${z}) perspective(1600px) rotateX(28deg)`, transformOrigin: '50% 30%'}}>
        <div style={{position: 'absolute', left: 80, right: 80, top: 260, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 26}}>
          {Array.from({length: N}).map((_, i) => {
            const off = fr > 6 + ((i * 7) % N) * 0.9;
            return (
              <div key={i} style={{height: 110, borderRadius: 12, background: off ? '#1c1226' : 'linear-gradient(135deg,#6be0ff,#ff7ad1)',
                boxShadow: off ? 'none' : '0 0 24px rgba(120,200,255,.55)', border: '4px solid #2b2036', position: 'relative'}}>
                <div style={{position: 'absolute', bottom: -18, left: '42%', width: '16%', height: 16, background: '#2b2036'}} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Grade />
      <Label t={start + 0.05} shotStart={start} y={0.09} text={<>OFFICES <Accent>EMPTY</Accent></>} source="Thu · Nov 19" />
      <Title shotStart={start} lines={[
        [{w: 'on', t: at('ON', 12.2)}, {w: 'launch', t: at('LAUNCH')}, {w: 'day', t: at('DAY', 12.7)}],
        [{w: 'alone.', t: at('ALONE'), accent: true}],
      ]} />
    </AbsoluteFill>
  );
};

/** 8 · "$5.2 billion in its first week" — glowing tower rises with ticker (ref §1 shot 4). */
const Tower: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const a = 5, b = f(at('BILLION', 15.7) - start) + 4;
  const h = ramp(fr, a, b, 40, 900, Easing.out(Easing.cubic));
  const v = ramp(fr, a, b, 0, 5.2, Easing.out(Easing.cubic));
  const ring = pop(fr - b, 10, 0.3);
  return (
    <Void dur={dur} from={2.5}>
      <Label t={start + 0.05} shotStart={start} y={0.07} text={<>WEEK 1: <Accent>UP TO</Accent></>} source="analyst projection" />
      <div style={{position: 'absolute', top: 300, width: W, textAlign: 'center', fontFamily: 'HeroBlack', fontSize: 160, letterSpacing: -5,
        backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 6px 14px rgba(30,0,20,.6))'}}>${v.toFixed(1)}B</div>
      <div style={{position: 'absolute', left: (W - 300) / 2, bottom: 300, width: 300, height: h, borderRadius: '24px 24px 6px 6px',
        background: 'linear-gradient(180deg,#ff9be0,#ff2d78 60%,#8a1450)', boxShadow: '0 0 80px rgba(255,60,150,.7), inset 0 0 0 4px rgba(255,255,255,.25)',
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,.18) 0 4px, transparent 4px 60px), linear-gradient(180deg,#ff9be0,#ff2d78 60%,#8a1450)'}} />
      <div style={{position: 'absolute', left: (W - 520) / 2, bottom: 300 + h - 60, width: 520, height: 120, borderRadius: '50%', border: '6px solid #ffd46b',
        boxShadow: '0 0 40px rgba(255,212,107,.8)', opacity: ring.o, transform: `scale(${ring.s})`}} />
      <Title shotStart={start} y={0.9} size={100} lines={[[{w: 'first', t: at('FIRST', 16.5)}, {w: 'week.', t: at('WEEK', 16.8), accent: true}]]} />
    </Void>
  );
};

/** 9 · "That's more than most films make in their whole lifetime." — bars. */
const Bars: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const g = ramp(fr, 2, 14, 0, 1), m = ramp(fr, f(at('FILMS') - start), f(at('FILMS') - start) + 12, 0, 1);
  const bar = (label: string, sub: string, hpx: number, k: number, hot: boolean, x: number) => (
    <div style={{position: 'absolute', left: x, bottom: 330, width: 330, textAlign: 'center'}}>
      <div style={{height: hpx * k, borderRadius: '20px 20px 6px 6px', background: hot ? 'linear-gradient(180deg,#ff9be0,#ff2d78)' : 'linear-gradient(180deg,#9b93a8,#4a4258)',
        boxShadow: hot ? '0 0 70px rgba(255,60,150,.7)' : 'none'}} />
      <div style={{fontFamily: 'HeroBlack', fontSize: 50, color: '#fff', marginTop: 20, textShadow: SHADOW}}>{label}</div>
      <div style={{fontFamily: 'UIBold', fontSize: 28, color: 'rgba(255,255,255,.75)'}}>{sub}</div>
    </div>
  );
  return (
    <Void dur={dur} from={1.5} bg="c3_split.mp4">
      {bar('GTA 6', 'first week', 980, g, true, 140)}
      {bar('MOST FILMS', 'whole lifetime', 180, m, false, 610)}
      <Title shotStart={start} y={0.13} size={110} lines={[
        [{w: 'more', t: at('MORE')}, {w: 'than', t: at('THAN')}, {w: 'most', t: at('MOST')}],
        [{w: 'films', t: at('FILMS')}, {w: 'ever', t: at('WHOLE')}, {w: 'make.', t: at('LIFETIME'), accent: true}],
      ]} />
    </Void>
  );
};

/** 10 · "pre-orders are reportedly the strongest ever recorded" — graph spikes, RECORD stamp. */
const Record: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const prog = ramp(fr, 2, f(at('STRONGEST') - start) + 6, 0, 1, Easing.in(Easing.quad));
  const pts = Array.from({length: 40}).map((_, i) => {
    const x = i / 39; const y = 0.1 + 0.025 * Math.sin(i * 0.9) + Math.pow(x, 4) * 0.82;
    return [80 + x * 920, 1300 - y * 820] as const;
  });
  const shown = pts.slice(0, Math.max(2, Math.ceil(prog * pts.length)));
  const d = shown.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
  const tip = shown[shown.length - 1];
  const st = pop(fr - f(at('RECORDED') - start), 7, 2.6);
  return (
    <Void dur={dur} from={0.5}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stopColor="#ff2d78" /><stop offset="1" stopColor="#ff9be0" /></linearGradient></defs>
        <path d={d + ` L${tip[0]},1300 L80,1300 Z`} fill="rgba(255,60,150,.18)" />
        <path d={d} stroke="url(#lg)" strokeWidth={12} fill="none" strokeLinejoin="round" style={{filter: 'drop-shadow(0 0 14px rgba(255,90,170,.9))'}} />
        <circle cx={tip[0]} cy={tip[1]} r={20} fill="#fff" style={{filter: 'drop-shadow(0 0 18px #ff5c9e)'}} />
      </svg>
      <Label t={start + 0.05} shotStart={start} y={0.07} text={<>PRE-<Accent>ORDERS</Accent></>} source="reportedly" />
      <div style={{position: 'absolute', top: 470, width: W, textAlign: 'center', opacity: st.o, transform: `rotate(-10deg) scale(${st.s})`}}>
        <span style={{fontFamily: 'HeroBlack', fontSize: 110, color: '#ffd46b', border: '10px solid #ffd46b', borderRadius: 22, padding: '6px 36px',
          textShadow: '0 0 30px rgba(255,212,107,.7)', boxShadow: '0 0 40px rgba(255,212,107,.5)'}}>RECORD</span>
      </div>
      <Title shotStart={start} y={0.8} lines={[
        [{w: 'strongest', t: at('STRONGEST'), accent: true}],
        [{w: 'ever', t: at('EVER')}, {w: 'recorded.', t: at('RECORDED')}],
      ]} />
    </Void>
  );
};

/** 11 · "Rockstar printed money" — bills rain over the neon city. */
const MoneyRain: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const bills = Array.from({length: 34}).map((_, i) => {
    const x = (i * 197) % W, sp = 26 + (i * 13) % 22, y = -260 + ((fr + i * 9) * sp) % (H + 400), r = (fr * (3 + (i % 5)) + i * 40) % 360;
    return (
      <div key={i} style={{position: 'absolute', left: x - 90, top: y, width: 190, height: 90, borderRadius: 8, background: 'linear-gradient(135deg,#9fe6b0,#3c9a5f)',
        border: '4px solid #e6ffe9', transform: `rotate(${r}deg) rotateX(${r}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'HeroBlack', fontSize: 52, color: '#1e5e35', boxShadow: '0 8px 20px rgba(0,0,0,.35)'}}>$</div>
    );
  });
  return (
    <AbsoluteFill>
      <Clip src="c1_street.mp4" from={2} dur={dur} zoom={[1.05, 1.15]} whip />
      {bills}
      <Title shotStart={start} lines={[
        [{w: 'Rockstar', t: at('ROCKSTAR')}],
        [{w: 'printed', t: at('PRINTED')}, {w: 'money.', t: at('MONEY'), accent: true}],
      ]} />
    </AbsoluteFill>
  );
};

/** 12 · "before anyone even pressed start" — PRESS START, pressed on "start". */
const PressStart: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const pressAt = f(at('START', 25.5) - start);
  const blink = fr < pressAt ? (Math.floor(fr / 6) % 2 ? 0.45 : 1) : 1;
  const press = fr >= pressAt ? ramp(fr, pressAt, pressAt + 3, 1, 0.88) + ramp(fr, pressAt + 3, pressAt + 8, 0, 0.12) : 1;
  const glow = fr >= pressAt ? ramp(fr, pressAt, pressAt + 10, 1, 0.3) : 0;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #2a0d3d 0%, #0b0313 70%)'}}>
      <NeonFloor opacity={0.35} />
      <div style={{position: 'absolute', top: 700, width: W, display: 'flex', justifyContent: 'center'}}>
        <div style={{fontFamily: 'HeroBlack', fontSize: 92, letterSpacing: 6, color: '#fff', padding: '34px 70px', borderRadius: 999, opacity: blink,
          border: '6px solid #ff5c9e', transform: `scale(${press})`, boxShadow: `0 0 ${40 + glow * 120}px rgba(255,90,170,${0.6 + glow * 0.4})`,
          background: fr >= pressAt ? GRAD : 'rgba(255,92,158,.08)'}}>PRESS START</div>
      </div>
      <Title shotStart={start} lines={[
        [{w: 'before', t: at('BEFORE', 24.3)}, {w: 'anyone', t: at('ANYONE')}],
        [{w: 'pressed', t: at('PRESSED')}, {w: 'start.', t: at('START', 25.5), accent: true}],
      ]} />
    </AbsoluteFill>
  );
};

/** 13 · "So be honest." — retention beat on black (ref "Still watching?"). */
const BeHonest: React.FC<{start: number}> = ({start}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, #1d0a2a 0%, #000 65%)'}}>
    <Title shotStart={start} y={0.48} size={120} lines={[[{w: 'So', t: at('SO', 26.1)}, {w: 'be', t: at('BE', 26.4)}, {w: 'honest.', t: at('HONEST'), accent: true}]]} />
  </AbsoluteFill>
);

/** 14 · "Are you calling in sick on the 19th?" — incoming call screen. */
const SickCall: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const p = pop(fr, 9, 0.8);
  const ringT = Math.sin(fr * 0.9) * 4;
  return (
    <AbsoluteFill>
      <Clip src="c3_split.mp4" from={2.5} dur={dur} zoom={[1.3, 1.4]} blur={20} />
      <AbsoluteFill style={{background: 'rgba(14,4,26,.5)'}} />
      <div style={{position: 'absolute', left: (W - 620) / 2, top: 230, width: 620, height: 1000, borderRadius: 60, background: 'linear-gradient(180deg,#2b1240,#12061c)',
        boxShadow: '0 30px 90px rgba(0,0,0,.6), 0 0 0 6px rgba(255,255,255,.85)', opacity: p.o, transform: `scale(${p.s})`, textAlign: 'center'}}>
        <div style={{fontFamily: 'UIBold', fontSize: 30, color: 'rgba(255,255,255,.7)', marginTop: 110}}>calling…</div>
        <div style={{fontFamily: 'HeroBlack', fontSize: 80, color: '#fff', marginTop: 10}}>Boss</div>
        <div style={{fontSize: 190, marginTop: 70, transform: `rotate(${ringT}deg)`}}>🤒</div>
        <div style={{position: 'absolute', bottom: 90, left: 0, right: 0, display: 'flex', justifyContent: 'space-around'}}>
          <div style={{width: 140, height: 140, borderRadius: 70, background: '#ff3b47', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64}}>📞</div>
          <div style={{width: 140, height: 140, borderRadius: 70, background: '#2fd36b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64,
            transform: `scale(${1 + 0.08 * Math.sin(fr * 0.6)})`}}>📞</div>
        </div>
      </div>
      <Title shotStart={start} y={0.76} size={118} lines={[
        [{w: 'calling', t: at('CALLING')}, {w: 'in', t: at('IN', 28)}, {w: 'sick', t: at('SICK')}],
        [{w: 'on', t: at('ON', 28.5)}, {w: 'the', t: at('THE', 28.6)}, {w: '19th?', t: at('NINETEENTH'), accent: true}],
      ]} />
    </AbsoluteFill>
  );
};

/** 15 · "Tell me in the comments" — comment stack + your typed answer. */
const Comments: React.FC<{start: number; dur: number}> = ({start, dur}) => (
  <AbsoluteFill>
    <Clip src="c1_street.mp4" from={3} dur={dur} zoom={[1.2, 1.3]} blur={10} whip />
    <AbsoluteFill style={{background: 'rgba(14,4,26,.45)'}} />
    <Title shotStart={start} y={0.16} size={120} lines={[[{w: 'tell', t: at('TELL')}, {w: 'me', t: at('ME')}], [{w: 'below', t: at('COMMENTS'), accent: true}]]} />
    <Bubble name="vice.fan" text="already booked it off 😂" t={start + 0.1} shotStart={start} x={80} y={620} tilt={-2} />
    <Bubble name="dade_local" text="cough cough… 🤒" t={start + 0.3} shotStart={start} x={200} y={800} tilt={2} />
    <Bubble name="you" text="sick 🤒🤒" typed t={start + 0.45} shotStart={start} x={120} y={980} heartAt={start + 0.95} />
  </AbsoluteFill>
);

/** 16 · "follow Vice City Sin for everything GTA 6" — follow button gets tapped. */
const Follow: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const card = pop(fr - 1, 10, 0.75);
  const tapAt = f(at('SIN', 31.4) - start) + 4;
  const tapped = fr >= tapAt;
  const tapS = tapped ? ramp(fr, tapAt, tapAt + 3, 0.9, 1) : 1;
  const cursorY = ramp(fr, tapAt - 14, tapAt, 220, 0, Easing.out(Easing.cubic));
  const ripple = tapped ? ramp(fr, tapAt, tapAt + 12, 0, 1) : 0;
  return (
    <AbsoluteFill>
      <Clip src="c1_street.mp4" from={1.5} dur={dur} zoom={[1.0, 1.12]} />
      <AbsoluteFill style={{background: 'rgba(14,4,26,.35)'}} />
      <div style={{position: 'absolute', left: 90, right: 90, top: 640, padding: '50px 46px', borderRadius: 44, background: 'rgba(255,255,255,.97)',
        boxShadow: '0 30px 90px rgba(0,0,0,.55), 0 0 70px rgba(255,90,170,.45)', opacity: card.o, transform: `scale(${card.s})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
          <div style={{width: 150, height: 150, borderRadius: 75, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'HeroBlack', fontSize: 66, color: '#fff', border: '6px solid #fff', boxShadow: '0 0 0 5px #ff5c9e'}}>VC</div>
          <div>
            <div style={{fontFamily: 'HeroBlack', fontSize: 70, color: '#111', letterSpacing: -2, lineHeight: 1}}>Vice City Sin</div>
            <div style={{fontFamily: 'UIBold', fontSize: 32, color: '#777', marginTop: 10}}>everything GTA 6</div>
          </div>
        </div>
        <div style={{position: 'relative', marginTop: 40, height: 110, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'HeroBlack', fontSize: 50, transform: `scale(${tapS})`, overflow: 'hidden',
          ...(tapped ? {background: '#efe9f3', color: '#333'} : {background: GRAD, color: '#fff', boxShadow: '0 10px 30px rgba(255,60,150,.5)'})}}>
          {tapped ? 'Following ✓' : 'Follow'}
          <div style={{position: 'absolute', width: 600, height: 600, borderRadius: 300, background: 'rgba(255,92,158,.35)', transform: `scale(${ripple})`, opacity: 1 - ripple}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: W / 2 + 40, top: 1090 + cursorY, fontSize: 110, opacity: ramp(fr, tapAt - 14, tapAt - 8, 0, 1), transform: `scale(${tapped ? 0.9 : 1})`}}>👆</div>
      <Title shotStart={start} y={0.2} size={130} lines={[[{w: 'follow', t: at('FOLLOW'), accent: true}]]} />
      <Title shotStart={start} y={0.8} size={96} lines={[[{w: 'for', t: at('FOR', 31.8)}, {w: 'everything', t: at('EVERYTHING')}], [{w: 'GTA', t: at('G', 32.4)}, {w: '6', t: at('SIX', 33), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Composition                                                         */
/* ------------------------------------------------------------------ */
export const GtaCountdown: React.FC = () => {
  useFonts();
  const fr = useCurrentFrame();
  const S = (i: number) => ({from: f(CUT[i]), durationInFrames: f(CUT[i + 1]) - f(CUT[i])});
  const d = (i: number) => CUT[i + 1] - CUT[i];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence {...S(0)}><Hook /></Sequence>
      <Sequence {...S(1)}><Countdown start={CUT[1]} dur={d(1)} /></Sequence>
      <Sequence {...S(2)}>
        <Clip src="c3_split.mp4" from={0} dur={d(2)} zoom={[1.3, 1.42]} originX="0%" whip />
        <Title shotStart={CUT[2]} lines={[
          [{w: 'before', t: at('BEFORE')}, {w: 'Vice', t: at('VICE'), accent: true}, {w: 'City', t: at('CITY'), accent: true}],
          [{w: 'opens', t: at('OPENS')}, {w: 'its', t: at('ITS')}, {w: 'doors.', t: at('DOORS')}],
        ]} />
      </Sequence>
      <Sequence {...S(3)}><DropSlam start={CUT[3]} dur={d(3)} /></Sequence>
      <Sequence {...S(4)}><Calendar start={CUT[4]} dur={d(4)} /></Sequence>
      <Sequence {...S(5)}><TimeOff start={CUT[5]} dur={d(5)} /></Sequence>
      <Sequence {...S(6)}><Billion start={CUT[6]} dur={d(6)} /></Sequence>
      <Sequence {...S(7)}><Office start={CUT[7]} dur={d(7)} /></Sequence>
      <Sequence {...S(8)}><Tower start={CUT[8]} dur={d(8)} /></Sequence>
      <Sequence {...S(9)}><Bars start={CUT[9]} dur={d(9)} /></Sequence>
      <Sequence {...S(10)}><Record start={CUT[10]} dur={d(10)} /></Sequence>
      <Sequence {...S(11)}><MoneyRain start={CUT[11]} dur={d(11)} /></Sequence>
      <Sequence {...S(12)}><PressStart start={CUT[12]} /></Sequence>
      <Sequence {...S(13)}><BeHonest start={CUT[13]} /></Sequence>
      <Sequence {...S(14)}><SickCall start={CUT[14]} dur={d(14)} /></Sequence>
      <Sequence {...S(15)}><Comments start={CUT[15]} dur={d(15)} /></Sequence>
      <Sequence {...S(16)}><Follow start={CUT[16]} dur={d(16)} /></Sequence>

      {FLASHES.map(([t, peak, col], i) => (
        <AbsoluteFill key={i} style={{background: col, pointerEvents: 'none',
          opacity: interpolate(fr, [f(t) - 1, f(t), f(t) + 1, f(t) + 4], [0, peak, peak * 0.62, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      ))}
      <Audio src={staticFile('mix_countdown.wav')} />
    </AbsoluteFill>
  );
};
