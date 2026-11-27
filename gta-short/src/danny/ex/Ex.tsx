/* Explainer-format replacement scenes. All scenes are concatenated in one composition (DExAll) and later
   sliced back into the timeline at their original frame positions. Props come from scenes.json. */
import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, spring, useVideoConfig} from 'remotion';
import {Finish, Hud, cl, useFonts} from '../kit';
import {Avatar, AvatarId, Mood} from './avatars';
import {Icon, IconName} from './icons';
import {ChapterTitle, Stamp} from '../reviewsUi';

export type W = {t: number; w: string; c?: 'y' | 'r'};
export type Phrase = {t0: number; t1: number; words: W[]};
export type Bubble = {who: AvatarId; t0: number; t1: number; words: W[]};
export type Scene = {
  sid: number; start: number; dur: number; pulls: number; hud: boolean;
  layout: 'cast' | 'object' | 'quote' | 'stat' | 'crab' | 'phone' | 'text';
  cast?: AvatarId[]; moods?: Mood[]; tags?: string[]; icon?: IconName; give?: boolean; label?: string;
  stat?: {value: number; prefix?: string; suffix?: string; label: string};
  phone?: {kind: 'reviews' | 'comments' | 'profiles' | 'call' | 'contact' | 'review1' | 'record'};
  crab?: 'intro' | 'pull' | 'reach';
  chapter?: {num: string; title: string; to: number}; stamp?: {n: string; text: string; from: number; to: number};
  phrases: Phrase[]; bubbles?: Bubble[]; quote?: {who: AvatarId; words: W[]}; pullSteps?: [number, number][];
};

const YEL = '#f2b336', RED = '#e4472c', INK = '#f3efe6';
const col = (c?: string) => (c === 'y' ? YEL : c === 'r' ? RED : INK);

/* ---------- background ---------- */
const Bg: React.FC<{seed: number}> = ({seed}) => {
  const f = useCurrentFrame();
  const dx = (f * 0.35 + seed * 37) % 60, dy = (f * 0.18 + seed * 11) % 60;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 72% 66% at 50% 44%, #1e2636 0%, #141b28 42%, #080b12 100%)'}} />
      <AbsoluteFill style={{opacity: 0.18, backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 1.2px, transparent 1.6px)', backgroundSize: '60px 60px', backgroundPosition: `${dx}px ${dy}px`}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 40% 34% at 50% 40%, rgba(242,179,54,0.07) 0%, rgba(0,0,0,0) 70%)'}} />
    </AbsoluteFill>
  );
};

/* ---------- kinetic text ---------- */
const Kinetic: React.FC<{phrases: Phrase[]; y?: number; size?: number; right?: number}> = ({phrases, y = 800, size = 88, right = 160}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {phrases.map((p, i) => {
        const vis = f >= p.t0 - 3 && f < p.t1 + 2;
        if (!vis) return null;
        const out = interpolate(f, [p.t1 - 3, p.t1 + 2], [1, 0], cl);
        return (
          <div key={i} style={{position: 'absolute', left: 160, right, top: y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline',
            columnGap: size * 0.24, rowGap: 4, opacity: out}}>
            {p.words.map((w, j) => {
              const k = interpolate(f, [w.t - 2, w.t + 3], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
              return <span key={j} style={{fontFamily: 'BigShoulders', fontWeight: 800, fontSize: size, lineHeight: 1.02, color: col(w.c), opacity: 0.12 + 0.88 * k,
                transform: `translateY(${(1 - k) * 16}px)`, textShadow: '0 4px 18px rgba(0,0,0,0.55)', whiteSpace: 'nowrap', letterSpacing: '0.005em'}}>{w.w}</span>;
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------- avatars with entrance, bob, blink, talk ---------- */
const talkingAt = (f: number, words: W[]) => words.some((w) => f >= w.t && f < w.t + 5) ? ((Math.floor(f / 3) % 2) ? 1 : 0) : 0;
const Person: React.FC<{id: AvatarId; x: number; y: number; size: number; i: number; mood?: Mood; talk?: number; tag?: string; flip?: boolean}> = ({id, x, y, size, i, mood, talk = 0, tag, flip}) => {
  const f = useCurrentFrame(); const {fps} = useVideoConfig();
  const s = spring({frame: f - i * 4, fps, config: {damping: 12, stiffness: 140}});
  const bob = Math.sin((f + i * 23) / 17) * 4;
  const blink = (f + i * 31) % 96 < 3;
  return (
    <div style={{position: 'absolute', left: x - size / 2, top: y - size * 0.55 + bob, width: size, height: size * 1.1, transform: `scale(${0.7 + 0.3 * s}) scaleX(${flip ? -1 : 1})`, opacity: Math.min(1, s * 1.4)}}>
      <Avatar id={id} mood={mood} blink={blink} talk={talk} size={size} />
      {tag && <div style={{position: 'absolute', left: -60, right: -60, top: size * 1.12, textAlign: 'center', fontFamily: 'PlexMonoBold', fontSize: 24, letterSpacing: '0.28em', color: YEL,
        transform: `scaleX(${flip ? -1 : 1})`}}>{tag}</div>}
    </div>
  );
};

/* speech bubble with serif text revealed in sync */
const SpeechBubble: React.FC<{b: Bubble; x: number; y: number; w?: number; tailLeft?: boolean}> = ({b, x, y, w = 820, tailLeft = true}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [b.t0 - 4, b.t0 + 4], [0, 1], {...cl, easing: Easing.out(Easing.back(1.6))});
  const out = interpolate(f, [b.t1 + 8, b.t1 + 14], [1, 0], cl);
  if (k <= 0 || out <= 0) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, padding: '26px 34px', borderRadius: 26, background: '#f6f2ea', boxShadow: '0 18px 50px rgba(0,0,0,0.45)',
      transform: `scale(${0.85 + 0.15 * k})`, transformOrigin: tailLeft ? '0% 100%' : '100% 100%', opacity: k * out}}>
      <div style={{position: 'absolute', bottom: -22, [tailLeft ? 'left' : 'right']: 46, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: '26px solid #f6f2ea'}} />
      <div style={{fontFamily: 'SerifQ', fontWeight: 700, fontSize: 54, lineHeight: 1.16, color: '#1a1b20'}}>
        “{b.words.map((wd, j) => <span key={j} style={{opacity: f >= wd.t - 1 ? 1 : 0.15}}>{wd.w}{j < b.words.length - 1 ? ' ' : ''}</span>)}”
      </div>
    </div>
  );
};

/* ---------- phone UI ---------- */
const PhoneUI: React.FC<{kind: NonNullable<Scene['phone']>['kind']; x: number; y: number; dur: number}> = ({kind, x, y, dur}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [2, 12], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const card = (i: number, at: number, children: React.ReactNode, tint = '#fdeee9') => {
    const a = interpolate(f, [at, at + 7], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
    return <div key={i} style={{margin: '0 0 14px 0', padding: '16px 18px', borderRadius: 16, background: tint, opacity: a, transform: `translateY(${(1 - a) * 16}px)`, fontFamily: 'InterUI', color: '#1b1c20'}}>{children}</div>;
  };
  const stars = (n: number) => <span style={{color: '#f2a81d', fontSize: 20, letterSpacing: 2}}>{'★'.repeat(n)}<span style={{color: '#cfd3da'}}>{'★'.repeat(5 - n)}</span></span>;
  const rev = (name: string, text: string) => <><div style={{fontFamily: 'InterBold', fontSize: 19}}>{name} <span style={{fontFamily: 'InterUI', fontSize: 14, color: '#80848c'}}>0 reviews · no photo</span></div><div style={{margin: '6px 0'}}>{stars(1)}</div><div style={{fontSize: 20, fontFamily: 'InterMed'}}>{text}</div></>;
  let content: React.ReactNode = null; let title = "Danny's Barbers", sub = 'Barber shop · High St';
  if (kind === 'reviews') content = [card(0, 18, rev('J.', 'Rude. Overpriced. Wouldn’t go back.')), card(1, Math.min(dur * 0.6, 120), rev('M.', 'Butchered my son’s hair. AVOID.'))];
  if (kind === 'review1') content = [card(0, 16, rev('O.', 'The young lad is clueless.'))];
  if (kind === 'comments') { title = 'Comments'; sub = '4,812';
    content = ['Who does he think he is', 'Bet he’s not even paying tax on that', 'Bet it’s not even his money', 'He’s changed'].map((c, i) => card(i, 10 + i * 12, <div style={{fontSize: 20, fontFamily: 'InterMed'}}>{c}</div>, i === 3 ? '#fde4df' : '#eef0f4')); }
  if (kind === 'profiles') { title = '02:04'; sub = 'Profiles';
    const tiles: [string, string][] = [['Ibiza ☀', '#2f8fe0'], ['Big night out', '#8a2546'], ['New trainers', '#e9e9e6'], ['Dubai', '#f2b336'], ['Cheltenham', '#2e7a55'], ['Lads holiday', '#d6332e']];
    content = <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>{tiles.map(([t, c], i) => { const a = interpolate(f, [8 + i * 9, 15 + i * 9], [0, 1], cl);
      return <div key={i} style={{height: 150, borderRadius: 14, background: c, opacity: a, transform: `scale(${0.85 + 0.15 * a})`, display: 'flex', alignItems: 'flex-end', padding: 10, fontFamily: 'InterBold', fontSize: 17, color: i === 2 ? '#222' : '#fff'}}>{t}</div>; })}</div>; }
  if (kind === 'call') { title = 'Incoming call'; sub = '';
    content = <div style={{textAlign: 'center', marginTop: 70}}><div style={{fontFamily: 'InterBold', fontSize: 52}}>Mum</div><div style={{fontFamily: 'InterUI', fontSize: 20, color: '#6a6e76', marginTop: 8}}>mobile</div>
      <div style={{display: 'flex', justifyContent: 'center', gap: 70, marginTop: 300}}>{['#e4472c', '#2fb36a'].map((c, i) => <div key={i} style={{width: 84, height: 84, borderRadius: 42, background: c, transform: `scale(${1 + (i === 1 ? 0.08 * Math.sin(f / 4) : 0)})`}} />)}</div></div>; }
  if (kind === 'contact') { title = 'Contacts'; sub = '';
    content = card(0, 10, <><div style={{fontFamily: 'InterBold', fontSize: 40}}>Kyle</div><div style={{fontSize: 18, color: '#6a6e76'}}>Call · Message</div></>, '#eef0f4'); }
  if (kind === 'record') { title = 'REC'; sub = `00:0${Math.min(9, Math.floor(f / 25))}`;
    content = <div style={{height: 520, borderRadius: 16, border: '3px solid #e4472c', position: 'relative', background: 'linear-gradient(160deg,#2a2f3a,#14171e)'}}>
      <div style={{position: 'absolute', left: 16, top: 14, width: 18, height: 18, borderRadius: 9, background: '#e4472c', opacity: Math.floor(f / 12) % 2 ? 1 : 0.25}} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, fontFamily: 'BigShoulders', fontWeight: 800, fontSize: 54, color: '#f3efe6'}}>
        <span style={{opacity: interpolate(f, [10, 16], [0, 1], cl)}}>BEFORE</span><span style={{color: YEL, opacity: interpolate(f, [40, 46], [0, 1], cl)}}>AFTER</span></div></div>; }
  return (
    <div style={{position: 'absolute', left: x, top: y + (1 - k) * 60, width: 470, height: 900, borderRadius: 60, background: '#0e0f12', boxShadow: '0 30px 80px rgba(0,0,0,0.55)', opacity: k, transform: 'rotate(-2.5deg)'}}>
      <div style={{position: 'absolute', left: 11, top: 11, right: 11, bottom: 11, borderRadius: 50, background: '#f1f3f6', overflow: 'hidden', padding: '86px 18px 0'}}>
        <div style={{position: 'absolute', left: '50%', top: 18, width: 96, height: 30, marginLeft: -48, borderRadius: 15, background: '#0b0b0d'}} />
        <div style={{fontFamily: 'InterBold', fontSize: 28, color: '#121317', marginLeft: 6}}>{title}</div>
        <div style={{fontFamily: 'InterUI', fontSize: 17, color: '#5e626a', margin: '2px 0 18px 6px'}}>{sub}</div>
        {content}
      </div>
    </div>
  );
};

/* ---------- crabs ---------- */
const Crab: React.FC<{x: number; y: number; s?: number; rot?: number; f: number; reach?: number}> = ({x, y, s = 1, rot = 0, f, reach = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[-1, 1].map((sd) => [0, 1, 2, 3].map((k) => {
      const wig = Math.sin(f / 3 + k + sd) * 6;
      return <path key={`${sd}${k}`} d={`M${sd * 26} ${-6 + k * 7} q${sd * 22} ${-10 + wig} ${sd * 36} ${8 + k * 5}`} stroke="#c9402a" strokeWidth={6} fill="none" strokeLinecap="round" />;
    }))}
    {[-1, 1].map((sd) => <g key={sd}><path d={`M${sd * 22} -18 q${sd * 14} ${-26 - (sd > 0 ? reach * 40 : 0)} ${sd * 30} ${-34 - (sd > 0 ? reach * 50 : 0)}`} stroke="#d4472f" strokeWidth={8} fill="none" strokeLinecap="round" />
      <ellipse cx={sd * 34} cy={-40 - (sd > 0 ? reach * 54 : 0)} rx={14} ry={10} fill="#e0553a" /></g>)}
    <ellipse cx={0} cy={0} rx={34} ry={24} fill="#e25a3c" /><ellipse cx={-8} cy={-6} rx={14} ry={7} fill="#f08a64" opacity={0.6} />
    <g fill="#1a1a1a"><circle cx={-9} cy={-26} r={5} /><circle cx={9} cy={-26} r={5} /></g>
    <g stroke="#c9402a" strokeWidth={4}><line x1={-8} y1={-22} x2={-9} y2={-14} /><line x1={8} y1={-22} x2={9} y2={-14} /></g>
  </g>
);
const CrabScene: React.FC<{mode: 'intro' | 'pull' | 'reach'; dur: number}> = ({mode, dur}) => {
  const f = useCurrentFrame();
  const p = f / Math.max(dur, 1);
  const RX = 380, RY = 74, CX = 960, CY = 520;   // rim ellipse
  // climber on the front-left of the rim
  let cx = 760, cy = 560, rot = -18, s = 1.6, reach = 0, pullK = 0, helpedY = 600;
  if (mode === 'intro') { cy = interpolate(p, [0, 0.75], [640, 470], {...cl, easing: Easing.inOut(Easing.cubic)}) + Math.sin(f / 4) * 3; }
  if (mode === 'pull') { pullK = interpolate(p, [0.25, 0.5], [0, 1], cl); cy = interpolate(p, [0, 0.3, 0.55, 1], [560, 470, 480, 700], {...cl, easing: Easing.inOut(Easing.cubic)}); rot = interpolate(p, [0.5, 1], [-18, 25], cl); }
  if (mode === 'reach') { cx = 1180; cy = 440; rot = 12; reach = interpolate(p, [0.05, 0.4], [0, 1], cl); helpedY = interpolate(p, [0.4, 1], [600, 470], {...cl, easing: Easing.inOut(Easing.cubic)}); }
  const inside: [number, number, number][] = [[700, 560, -16], [830, 585, 10], [960, 570, -6], [1090, 590, 14], [1220, 565, -10], [900, 545, 18], [1040, 548, -20]];
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="bk" x1="0" x2="1"><stop offset="0" stopColor="#3e4552" /><stop offset="0.45" stopColor="#7d8796" /><stop offset="0.6" stopColor="#6b7482" /><stop offset="1" stopColor="#353b46" /></linearGradient>
          <clipPath id="above"><rect x="0" y="0" width="1920" height={CY + 2} /><path d={`M${CX - RX} ${CY} A ${RX} ${RY} 0 0 0 ${CX + RX} ${CY} Z`} /></clipPath>
        </defs>
        {/* inner back wall */}
        <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="#1b1f27" />
        {/* crabs inside, only the part above the front rim shows */}
        <g clipPath="url(#above)">
          {inside.map(([x, y, r], i) => <Crab key={i} x={x} y={y - 40 + Math.sin(f / 9 + i) * 6} s={1.25} rot={r} f={f + i * 7} />)}
          {mode === 'reach' && <Crab x={1080} y={helpedY} s={1.3} rot={-10} f={f + 5} />}
          {mode === 'pull' && <path d={`M820 ${600} Q ${800 - 30 * pullK} ${560 - 60 * pullK} ${cx + 10} ${cy + 30}`} stroke="#d4472f" strokeWidth={14} fill="none" strokeLinecap="round" opacity={pullK} />}
        </g>
        {/* bucket body */}
        <path d={`M${CX - RX} ${CY} L${CX - 280} 1010 Q${CX} 1050 ${CX + 280} 1010 L${CX + RX} ${CY} A ${RX} ${RY} 0 0 1 ${CX - RX} ${CY} Z`} fill="url(#bk)" />
        <path d={`M${CX - RX + 20} ${CY + 150} Q${CX} ${CY + 240} ${CX + RX - 20} ${CY + 150}`} stroke="#4e5663" strokeWidth={8} fill="none" opacity={0.7} />
        <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke="#a9b2be" strokeWidth={16} />
        <path d={`M${CX - RX - 30} ${CY - 10} Q${CX} ${CY - 330} ${CX + RX + 30} ${CY - 10}`} stroke="#8b939e" strokeWidth={8} fill="none" opacity={0.55} />
        {/* the climber */}
        <Crab x={cx} y={cy} s={s} rot={rot} f={f} reach={reach} />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- stat ---------- */
const Stat: React.FC<{s: NonNullable<Scene['stat']>; icon?: IconName}> = ({s, icon}) => {
  const f = useCurrentFrame();
  const v = Math.round(interpolate(f, [4, 26], [0, s.value], {...cl, easing: Easing.out(Easing.cubic)}));
  const k = interpolate(f, [0, 8], [0, 1], cl);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: icon ? 520 : 0, top: 190, textAlign: 'center', fontFamily: 'BigShoulders', fontWeight: 900, fontSize: 300, lineHeight: 1, color: YEL, opacity: k,
        textShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>{s.prefix ?? ''}{v.toLocaleString('en-GB')}{s.suffix ?? ''}</div>
      <div style={{position: 'absolute', left: 0, right: icon ? 520 : 0, top: 520, textAlign: 'center', fontFamily: 'PlexMonoBold', fontSize: 30, letterSpacing: '0.3em', color: INK, opacity: interpolate(f, [10, 18], [0, 1], cl)}}>{s.label}</div>
      {icon && <div style={{position: 'absolute', left: 1240, top: 190}}><Icon name={icon} size={380} draw={interpolate(f, [6, 26], [0, 1], cl)} /></div>}
    </AbsoluteFill>
  );
};

/* ---------- the scene ---------- */
const SceneView: React.FC<{sc: Scene}> = ({sc}) => {
  const f = useCurrentFrame();
  const cast = sc.cast ?? []; const n = cast.length;
  const speakingWords = (id: AvatarId) => [...(sc.bubbles ?? []).filter((b) => b.who === id).flatMap((b) => b.words), ...(sc.quote && sc.quote.who === id ? sc.quote.words : [])];
  const drift = interpolate(f, [0, sc.dur], [1, 1.035]);
  const hasBubble = (sc.bubbles ?? []).length > 0;
  const avY = hasBubble ? 520 : 400;
  const people = () => {
    if (!n) return null;
    const size = n === 1 ? 400 : n === 2 ? 340 : n === 3 ? 290 : 230;
    const xs = n === 1 ? [sc.icon ? 620 : 960] : Array.from({length: n}, (_, i) => 960 + (i - (n - 1) / 2) * (n === 2 ? 640 : n === 3 ? 480 : 380));
    return cast.map((id, i) => <Person key={i} id={id} x={xs[i]} y={avY} size={size} i={i} mood={sc.moods?.[i]} talk={talkingAt(f, speakingWords(id))} tag={sc.tags?.[i]} flip={n === 2 && i === 1} />);
  };
  const iconEl = () => {
    if (!sc.icon) return null;
    const draw = interpolate(f, [4, 22], [0, 1], cl);
    const scr = interpolate(f, [12, sc.dur * 0.8], [0, 1], cl);
    if (sc.give && n >= 2) {
      const p = interpolate(f, [sc.dur * 0.25, sc.dur * 0.65], [0, 1], {...cl, easing: Easing.inOut(Easing.cubic)});
      const x = interpolate(p, [0, 1], [960 - 320 + 120, 960 + 320 - 120]); const y = avY + 40 - Math.sin(p * Math.PI) * 120;
      return <div style={{position: 'absolute', left: x - 110, top: y - 110}}><Icon name={sc.icon} size={220} draw={draw} t={scr} /></div>;
    }
    if (n === 1) return <div style={{position: 'absolute', left: 1130, top: avY - 210, transform: `rotate(${Math.sin(f / 20) * 3}deg)`}}><Icon name={sc.icon} size={400} draw={draw} t={scr} /></div>;
    if (n >= 2) return <div style={{position: 'absolute', left: 960 - 100, top: avY - 290}}><Icon name={sc.icon} size={200} draw={draw} t={scr} /></div>;
    return <div style={{position: 'absolute', left: 960 - 230, top: 140, transform: `rotate(${Math.sin(f / 20) * 3}deg)`}}><Icon name={sc.icon} size={460} draw={draw} t={scr} /></div>;
  };
  const bubbles = () => (sc.bubbles ?? []).map((b, i) => {
    const idx = cast.indexOf(b.who); const left = n === 2 ? idx === 0 : true;
    const x = n === 1 ? 1000 : left ? 960 - 640 + 60 : 960 + 640 - 60 - 760;
    return <SpeechBubble key={i} b={b} x={x} y={90} tailLeft={left} />;
  });
  return (
    <AbsoluteFill>
      <Bg seed={sc.sid} />
      <AbsoluteFill style={{transform: `scale(${drift})`}}>
        {sc.layout === 'crab' && <CrabScene mode={sc.crab ?? 'intro'} dur={sc.dur} />}
        {sc.layout === 'stat' && sc.stat && <Stat s={sc.stat} icon={sc.icon} />}
        {(sc.layout === 'cast' || sc.layout === 'object') && <>{people()}{iconEl()}</>}
        {sc.layout === 'phone' && <>{n > 0 && <Person id={cast[0]} x={600} y={430} size={380} i={0} mood={sc.moods?.[0]} talk={0} />}<PhoneUI kind={sc.phone!.kind} x={1180} y={90} dur={sc.dur} /></>}
        {sc.layout === 'quote' && sc.quote && <>
          <Person id={sc.quote.who} x={470} y={470} size={420} i={0} mood={sc.moods?.[0]} talk={talkingAt(f, sc.quote.words)} />
          <div style={{position: 'absolute', left: 800, top: 230, width: 1000, fontFamily: 'PlexMonoBold', fontSize: 26, letterSpacing: '0.3em', color: YEL}}>{sc.quote.who.replace('_hivis', '').toUpperCase()}</div>
          <div style={{position: 'absolute', left: 690, top: 215, fontFamily: 'SerifQ', fontWeight: 700, fontSize: 200, color: YEL, opacity: 0.9, lineHeight: 1}}>“</div>
          {(() => {
            const ws = sc.quote!.words; const pages: W[][] = []; let cur: W[] = [];
            ws.forEach((w, k) => { const gap = k ? w.t - ws[k - 1].t : 0; if (cur.length && (cur.length >= 13 || (cur.length >= 6 && gap >= 9))) { pages.push(cur); cur = []; } cur.push(w); });
            if (cur.length) pages.push(cur);
            let pi = 0; pages.forEach((pg, k) => { if (f >= pg[0].t - 4) pi = k; });
            const pg = pages[pi] ?? []; const a = pg.length ? interpolate(f, [pg[0].t - 4, pg[0].t + 2], [0, 1], cl) : 1;
            return <div style={{position: 'absolute', left: 800, top: 290, width: 1000, fontFamily: 'SerifQ', fontWeight: 700, fontSize: 70, lineHeight: 1.16, color: INK, opacity: pi === 0 ? 1 : a}}>
              {pg.map((wd, j) => <span key={j} style={{opacity: f >= wd.t - 1 ? 1 : 0.13}}>{wd.w}{' '}</span>)}</div>;
          })()}
        </>}
        {sc.layout !== 'quote' && <Kinetic phrases={sc.phrases} y={sc.layout === 'stat' ? 700 : sc.layout === 'phone' ? 760 : 830} size={sc.layout === 'stat' ? 80 : sc.layout === 'phone' ? 72 : 88} right={sc.layout === 'phone' ? 860 : 160} />}
        {bubbles()}
      </AbsoluteFill>
      {sc.label && <div style={{position: 'absolute', left: 140, top: 140, fontFamily: 'PlexMonoBold', fontSize: 40, color: YEL, opacity: interpolate(f, [2, 8], [0, 1], cl), whiteSpace: 'pre'}}>{sc.label}</div>}
      {sc.chapter && <ChapterTitle num={sc.chapter.num} title={sc.chapter.title} from={0} to={sc.chapter.to} />}
      {sc.stamp && <Stamp n={sc.stamp.n} text={sc.stamp.text} from={sc.stamp.from} to={sc.stamp.to} />}
      <Finish />
      {sc.hud && <Hud pulls={(sc.pullSteps ?? []).filter(([t]) => f >= t).reduce((a, [, p]) => p, sc.pulls)} />}
    </AbsoluteFill>
  );
};

export const ExAll: React.FC<{scenes: Scene[]}> = ({scenes}) => {
  useFonts();
  let off = 0;
  return (
    <AbsoluteFill style={{background: '#080b12'}}>
      {scenes.map((sc) => { const from = off; off += sc.dur;
        return <Sequence key={sc.sid} from={from} durationInFrames={sc.dur}><SceneView sc={sc} /></Sequence>; })}
    </AbsoluteFill>
  );
};
export const exTotal = (scenes: Scene[]) => scenes.reduce((a, s) => a + s.dur, 0);
