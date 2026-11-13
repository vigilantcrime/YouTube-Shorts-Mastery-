/* "Every sin's a story" — 13 years of waiting. 22 original shots, 22 unique camera moves.
   Shot list + psychological trigger per shot: /shotlist.md (video 5). Formula: /style.md. */
import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import * as THREE from 'three';
import words from './w5.json';
import {W, H, GRAD, SHADOW, f, Title} from './kit';
import {cl, lerp, rnd, pop, useFontsReady, useTex, Rig, Stage} from './kit3d';

type Wd = [string, number];
const WT = (words as Wd[]).map(([w, t]) => [w, t + 0.05] as Wd);
const at = (word: string, after = 0) => WT.find(([w, t]) => w === word && t >= after)?.[1] ?? after;

const CUT = [0, 4.04, 6.87, 8.53, 10.25, 11.75, 15.45, 16.65, 17.45, 22.75, 25.04, 28.27, 31.57, 32.62, 34.2, 35.89, 41.37, 44.29, 46.5, 47.6, 51.13, 53.73, 57.7];
const FLASHES: [number, number, string][] = [[15.45, 0.9, '#fff'], [34.2, 0.5, '#c8ffd8'], [52.6, 0.6, '#fff']];

const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#fff', style}) => (
  <div style={{fontFamily: 'HeroBlack', fontSize: size, color, letterSpacing: -size * 0.02, lineHeight: 1, ...style}}>{children}</div>
);
const GradTxt: React.CSSProperties = {backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 5px 12px rgba(30,0,20,.55))'};
const Src: React.FC<{text: string; y: number}> = ({text, y}) => (
  <div style={{position: 'absolute', top: H * y, width: W, textAlign: 'center', fontFamily: 'UIBold', fontSize: 26, color: 'rgba(255,255,255,.75)', textShadow: SHADOW}}>{text}</div>
);

/* ============ 1 · growth chart on a door frame — TILT UP ============ */
const GrowthChart: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const ty = lerp(fr, 0, T, -1900, 0, Easing.inOut(Easing.cubic));          // the wall slides down = camera tilts up
  const rx = lerp(fr, 0, T, 16, -10, Easing.inOut(Easing.cubic));
  const marks = Array.from({length: 14}).map((_, i) => ({yr: 2013 + i, h: 3400 - (i === 0 ? 0 : 520 + Math.pow(i, 0.85) * 205)}));
  return (
    <AbsoluteFill style={{background: '#2a1a12', overflow: 'hidden', perspective: 1400}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 3600, transform: `translateY(${ty}px) rotateX(${rx}deg)`, transformOrigin: '50% 60%'}}>
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#e9dcc6 0 18%,#f3e8d4 18% 100%)'}} />
        {/* wooden door frame */}
        <div style={{position: 'absolute', left: 250, top: 0, width: 230, height: 3600, background: 'linear-gradient(90deg,#c9a77a,#e2c49a 40%,#b48d5e)', boxShadow: '10px 0 30px rgba(0,0,0,.25)'}} />
        {marks.map((m, i) => {
          const show = i === 0 || fr > 6 + i * (T - 20) / 14;
          return (
            <div key={i} style={{position: 'absolute', left: 220, top: m.h, opacity: show ? 1 : 0}}>
              <div style={{width: 330, height: 9, background: i === 13 ? '#ff2d78' : '#3a2a20', borderRadius: 3}} />
              <div style={{fontFamily: 'UIBold', fontSize: i === 13 || i === 0 ? 64 : 48, color: i === 13 ? '#ff2d78' : '#3a2a20', marginTop: 8, transform: 'rotate(-2deg)', marginLeft: 290,
                fontStyle: 'italic'}}>{i === 0 ? 'born · 17 Sep 2013' : i === 13 ? 'age 13 · 2026' : `${m.yr}`}</div>
            </div>
          );
        })}
      </div>
      {/* afternoon sun shaft */}
      <AbsoluteFill style={{background: 'linear-gradient(115deg, transparent 30%, rgba(255,200,120,.38) 45%, transparent 62%)', mixBlendMode: 'screen'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(30,10,0,.5) 100%)'}} />
      <Title shotStart={start} y={0.13} size={100} lines={[[{w: 'a', t: 0}, {w: 'baby', t: at('BABY')}, {w: 'born', t: at('BORN')}], [{w: 'on', t: at('THE', 0.7)}, {w: 'GTA', t: at('GTA')}, {w: '5', t: at('FIVE')}, {w: 'day', t: at('DAY')}]]} outAt={2.6} />
      <Title shotStart={start} y={0.76} size={170} lines={[[{w: 'is', t: at('IS')}, {w: 'now', t: at('NOW')}, {w: '13.', t: at('THIRTEEN'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 2 · self-checkout age gate — CRASH ZOOM ============ */
const AgeGate: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const hit = f(at('NOT', 4) - start);
  const z = interpolate(fr, [hit - 1, hit + 3], [1, 2.7], {...cl, easing: Easing.out(Easing.cubic)});
  const shake = fr > hit && fr < hit + 8 ? (rnd(fr) - 0.5) * 18 : 0;
  const strobe = Math.floor(fr / 4) % 2 === 0;
  return (
    <AbsoluteFill style={{background: '#0b0f12', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${shake}px,${shake * 0.6}px) scale(${z})`, transformOrigin: '50% 30%'}}>
        <AbsoluteFill style={{background: 'linear-gradient(180deg,#cfe0e6 0%,#8fa3ab 40%,#2a3236 100%)'}} />
        {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', top: 40, left: 60 + i * 260, width: 200, height: 18, background: '#fff', boxShadow: '0 0 40px 10px rgba(255,255,255,.7)'}} />)}
        {/* beacon pole */}
        <div style={{position: 'absolute', left: 520, top: 140, width: 40, height: 380, background: '#2b2f33'}} />
        <div style={{position: 'absolute', left: 470, top: 300, width: 140, height: 120, borderRadius: '60px 60px 12px 12px', background: strobe ? '#ff1f2d' : '#5a0d12',
          boxShadow: strobe ? '0 0 120px 50px rgba(255,30,45,.75)' : 'none'}} />
        {/* kiosk */}
        <div style={{position: 'absolute', left: 140, top: 560, width: 800, height: 1100, borderRadius: 30, background: '#1c2226', boxShadow: '0 30px 80px rgba(0,0,0,.6)'}}>
          <div style={{margin: 40, height: 620, borderRadius: 16, background: '#f3f5f6', padding: 40, boxSizing: 'border-box'}}>
            <div style={{fontFamily: 'UIBold', fontSize: 30, color: '#666'}}>SCANNED</div>
            <div style={{fontFamily: 'HeroBlack', fontSize: 60, color: '#111', marginTop: 6}}>GTA 6 · Standard</div>
            <div style={{marginTop: 50, padding: 34, borderRadius: 18, background: strobe ? '#ff1f2d' : '#d4141f', color: '#fff', textAlign: 'center'}}>
              <div style={{fontFamily: 'HeroBlack', fontSize: 64}}>⚠ AGE RESTRICTED</div>
              <div style={{fontFamily: 'UIBold', fontSize: 34, marginTop: 10}}>Please wait for assistance</div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: `rgba(255,0,20,${strobe ? 0.12 : 0})`}} />
      <Title shotStart={start} y={0.1} lines={[[{w: 'still', t: at('STILL')}, {w: 'not', t: at('NOT', 4)}, {w: 'old', t: at('OLD')}], [{w: 'enough.', t: at('ENOUGH'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 3 · tree rings — TURNTABLE ============ */
const TreeRings: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const rot = lerp(fr, 0, f(dur), -0.6, 1.1, Easing.linear);
  const lit = Math.min(13, Math.floor(fr / 2.6));
  const top = useTex('rings' + lit, 1024, 1024, (g, w, h) => {
    const c = w / 2;
    g.fillStyle = '#c99b62'; g.beginPath(); g.arc(c, c, 500, 0, 7); g.fill();
    for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(110,62,28,${0.35 + rnd(i) * 0.3})`; g.lineWidth = 3 + rnd(i + 2) * 4; g.beginPath(); g.arc(c + rnd(i) * 6, c, 30 + i * 11.5, 0, 7); g.stroke(); }
    for (let i = 0; i < 13; i++) {
      const r = 480 - i * 14;
      g.strokeStyle = i < lit ? '#ff3d8f' : 'rgba(90,50,20,.6)'; g.lineWidth = i < lit ? 7 : 4; g.shadowColor = '#ff3d8f'; g.shadowBlur = i < lit ? 18 : 0;
      g.beginPath(); g.arc(c, c, r, 0, 7); g.stroke();
    }
    g.shadowBlur = 0; g.fillStyle = '#4a2a14'; g.beginPath(); g.arc(c, c, 12, 0, 7); g.fill();
  });
  const bark = useTex('bark', 512, 128, (g, w, h) => { g.fillStyle = '#3b2616'; g.fillRect(0, 0, w, h); for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(20,10,5,${rnd(i) * 0.6})`; g.fillRect(rnd(i + 1) * w, 0, 3 + rnd(i + 2) * 6, h); } });
  const dust = useMemo(() => { const g = new THREE.BufferGeometry(); const p = new Float32Array(300 * 3); for (let i = 0; i < 300; i++) { p[i * 3] = (rnd(i) - 0.5) * 6; p[i * 3 + 1] = rnd(i + 9) * 4; p[i * 3 + 2] = (rnd(i + 5) - 0.5) * 6; } g.setAttribute('position', new THREE.BufferAttribute(p, 3)); return g; }, []);
  return (
    <AbsoluteFill>
      <Stage bg="#0e0907">
        <Rig pos={[0, 3.3, 3.1]} look={[0, 0.1, 0]} fov={46} />
        <ambientLight intensity={0.15} />
        <directionalLight position={[-6, 1.8, 1]} intensity={3.2} color="#ffcf96" />
        <group rotation={[0, rot, 0]}>
          <mesh position={[0, 0, 0]}><cylinderGeometry args={[1.6, 1.62, 0.5, 64, 1, true]} /><meshStandardMaterial map={bark} roughness={1} /></mesh>
          <mesh position={[0, 0.251, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[1.6, 96]} /><meshStandardMaterial map={top} roughness={0.8} emissive="#ff3d8f" emissiveIntensity={0.05} /></mesh>
        </group>
        <points geometry={dust}><pointsMaterial size={0.02} color="#ffe2b8" transparent opacity={0.7} /></points>
      </Stage>
      <Title shotStart={start} y={0.8} size={190} lines={[[{w: '13', t: start + 0.02, accent: true}, {w: 'years.', t: at('YEARS', 7)}]]} />
    </AbsoluteFill>
  );
};

/* ============ 4 · waiting room "now serving 5" — TRUCK ============ */
const WaitingRoom: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const x = lerp(fr, 0, f(dur), -2.8, 1.6, Easing.inOut(Easing.sin));
  const sign = useTex('serve', 512, 256, (g, w, h) => {
    g.fillStyle = '#100405'; g.fillRect(0, 0, w, h); g.textAlign = 'center'; g.fillStyle = '#ff3030'; g.shadowColor = '#ff0000'; g.shadowBlur = 20;
    g.font = '40px HeroBlack'; g.fillText('NOW SERVING', w / 2, 70); g.font = '150px HeroBlack'; g.fillText('05', w / 2, 220);
  });
  const ticket = useTex('tick', 256, 384, (g, w, h) => { g.fillStyle = '#fbf6e8'; g.fillRect(0, 0, w, h); g.fillStyle = '#222'; g.textAlign = 'center'; g.font = '30px UIBold'; g.fillText('YOUR NUMBER', w / 2, 70); g.font = '220px HeroBlack'; g.fillStyle = '#ff2d78'; g.fillText('06', w / 2, 290); });
  const chair = (cx: number, cz: number, c: string, k: number) => (
    <group key={k} position={[cx, 0, cz]}>
      <mesh position={[0, 0.45, 0]}><boxGeometry args={[0.5, 0.06, 0.48]} /><meshStandardMaterial color={c} roughness={0.5} /></mesh>
      <mesh position={[0, 0.75, -0.22]} rotation={[-0.12, 0, 0]}><boxGeometry args={[0.5, 0.55, 0.05]} /><meshStandardMaterial color={c} roughness={0.5} /></mesh>
      <mesh position={[0, 0.22, 0]}><boxGeometry args={[0.04, 0.44, 0.04]} /><meshStandardMaterial color="#888" metalness={0.8} /></mesh>
    </group>
  );
  return (
    <AbsoluteFill>
      <Stage bg="#1a1d20" fog={['#1a1d20', 4, 14]}>
        <Rig pos={[x, 1.25, 3.2]} look={[x * 0.6, 1.4, -3]} fov={52} />
        <ambientLight intensity={0.5} color="#dfe8ee" />
        <directionalLight position={[0, 6, 2]} intensity={1.3} color="#e8f2f5" />
        <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[30, 20]} /><meshStandardMaterial color="#8c9296" roughness={0.6} /></mesh>
        <mesh position={[0, 2, -3.2]}><planeGeometry args={[30, 6]} /><meshStandardMaterial color="#b9c2c4" /></mesh>
        <mesh position={[0.2, 2.35, -3.15]}><planeGeometry args={[1.4, 0.7]} /><meshBasicMaterial map={sign} /></mesh>
        {[-1.3, 0.2].map((z, r) => Array.from({length: 12}).map((_, i) => chair(-5 + i * 0.6 + r * 0.3, z, r ? '#2d6bb0' : '#3a7ec4', r * 20 + i)))}
        {/* foreground hand-held ticket */}
        <mesh position={[x + 0.55, 1.05, 2.2]} rotation={[0, -0.2, 0.08]}><planeGeometry args={[0.2, 0.3]} /><meshStandardMaterial map={ticket} /></mesh>
      </Stage>
      <Title shotStart={start} y={0.8} lines={[[{w: 'Rockstar', t: at('ROCK', 8)}, {w: 'made', t: at('MADE')}, {w: 'us', t: at('US')}], [{w: 'wait.', t: at('WAIT'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 5 · 13 candles + waiting console — SPLIT DIOPTER ============ */
const Candles: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const out = fr > f(at('YEARS', 10.8) - start);
  const sway = interpolate(fr, [0, 45], [-14, 10], cl);
  return (
    <AbsoluteFill style={{background: '#070304', overflow: 'hidden'}}>
      {/* far plane (top-right): dark TV with a waiting spinner, sharp */}
      <div style={{position: 'absolute', right: 70 + sway * 0.3, top: 240, width: 560, height: 330, background: '#050507', border: '14px solid #111', borderRadius: 10, boxShadow: '0 0 80px rgba(255,90,170,.25)'}}>
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 70, height: 70, marginLeft: -35, marginTop: -35, borderRadius: 35, border: '8px solid rgba(255,255,255,.2)',
          borderTopColor: '#ff5c9e', transform: `rotate(${fr * 14}deg)`}} />
      </div>
      {/* the diopter seam: a soft blurred band between the two sharp planes */}
      <div style={{position: 'absolute', left: -200, right: -200, top: 660, height: 160, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', transform: 'rotate(-8deg)'}} />
      {/* near plane (bottom): cake + 13 candles, sharp */}
      <div style={{position: 'absolute', left: -60 + sway, top: 1180, width: 1200, height: 900, borderRadius: '50% 50% 0 0 / 22% 22% 0 0', background: 'linear-gradient(180deg,#f8e8ef,#e9c6d6)'}} />
      {Array.from({length: 13}).map((_, i) => {
        const x = 90 + sway + i * 72, y = 880 + Math.abs(6 - i) * 14;
        const fl = 1 + Math.sin(fr * 0.9 + i) * 0.12;
        return (
          <div key={i}>
            <div style={{position: 'absolute', left: x, top: y, width: 26, height: 300, borderRadius: 6, background: 'repeating-linear-gradient(135deg,#ff6fa8 0 14px,#fff 14px 28px)'}} />
            {!out && <div style={{position: 'absolute', left: x - 9, top: y - 78, width: 44, height: 74, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', transform: `scaleY(${fl})`, transformOrigin: 'bottom',
              background: 'radial-gradient(ellipse at 50% 70%, #fff 0 18%, #ffd36b 30%, #ff7a2a 60%, transparent 70%)', boxShadow: '0 0 60px 20px rgba(255,170,60,.45)'}} />}
            {out && <div style={{position: 'absolute', left: x - 6 + Math.sin(fr * 0.3 + i) * 10, top: y - 120 - (fr % 30) * 2, width: 30, height: 110, borderRadius: 15, background: 'rgba(200,200,210,.25)', filter: 'blur(6px)'}} />}
          </div>
        );
      })}
      <AbsoluteFill style={{background: out ? 'rgba(0,0,0,.35)' : 'radial-gradient(ellipse at 50% 55%, rgba(255,160,60,.18), transparent 60%)'}} />
      <Title shotStart={start} y={0.13} size={210} lines={[[{w: '13', t: start + 0.02, accent: true}], [{w: 'years.', t: at('YEARS', 10.8)}]]} />
    </AbsoluteFill>
  );
};

/* ============ 6 · cake topper: married/divorced/remarried — SNORRICAM ============ */
const Topper: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const dv = f(at('DIVORCED') - start), rm = f(at('REMARRIED') - start);
  const gap = fr < dv ? 0 : fr < rm ? lerp(fr, dv, dv + 6, 0, 120, Easing.out(Easing.back(2))) : lerp(fr, rm, rm + 6, 120, 0, Easing.out(Easing.cubic));
  const spin = fr * 2.4;                                   // the world spins; the couple stays locked to the lens
  const stamp = (txt: string, t0: number, col: string) => { const p = pop(fr - t0, 6, 2.2); return (
    <div style={{position: 'absolute', top: 360, width: W, textAlign: 'center', opacity: p.o, transform: `rotate(-8deg) scale(${p.s})`}}>
      <span style={{fontFamily: 'HeroBlack', fontSize: 92, color: col, border: `9px solid ${col}`, borderRadius: 18, padding: '4px 30px'}}>{txt}</span></div>); };
  const state = fr < dv ? 0 : fr < rm ? 1 : 2;
  return (
    <AbsoluteFill style={{background: '#1a0f08', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `rotate(${spin}deg) scale(1.9)`}}>
        {Array.from({length: 40}).map((_, i) => <div key={i} style={{position: 'absolute', left: rnd(i) * W, top: rnd(i + 40) * H, width: 40 + rnd(i + 3) * 80, height: 40 + rnd(i + 3) * 80, borderRadius: '50%',
          background: i % 3 ? 'rgba(255,200,110,.5)' : 'rgba(255,140,190,.45)', filter: 'blur(14px)'}} />)}
      </AbsoluteFill>
      {/* cake tier */}
      <div style={{position: 'absolute', left: 140, top: 1260, width: 800, height: 700, borderRadius: '40px 40px 0 0', background: 'linear-gradient(180deg,#fff7f0,#efd9c9)', boxShadow: 'inset 0 30px 0 #fff'}} />
      {/* groom + bride figurines */}
      {[-1, 1].map((s) => (
        <div key={s} style={{position: 'absolute', left: W / 2 - 110 + s * (95 + gap), top: 760, width: 220, height: 520}}>
          <div style={{position: 'absolute', left: 70, top: 0, width: 80, height: 80, borderRadius: 40, background: '#f2d2b8'}} />
          <div style={{position: 'absolute', left: s < 0 ? 40 : 10, top: 90, width: s < 0 ? 140 : 200, height: 410, borderRadius: s < 0 ? '30px 30px 10px 10px' : '60px 60px 20px 20px',
            background: s < 0 ? '#16151a' : 'linear-gradient(180deg,#ffffff,#f1ecf4)', clipPath: s > 0 ? 'polygon(30% 0,70% 0,100% 100%,0 100%)' : 'none'}} />
          {state === 2 && <div style={{position: 'absolute', left: s < 0 ? 150 : -60, top: 240, width: 140, height: 50, background: 'rgba(240,230,190,.85)', transform: 'rotate(-12deg)'}} />}
        </div>
      ))}
      {state === 1 && <div style={{position: 'absolute', left: W / 2 - 4, top: 760, width: 8, height: 520, background: 'repeating-linear-gradient(180deg,#ff2d4a 0 22px,transparent 22px 36px)'}} />}
      {state === 0 && stamp('MARRIED', f(at('MARRIED') - start), '#ffd36b')}
      {state === 1 && stamp('DIVORCED', dv, '#ff3048')}
      {state === 2 && stamp('REMARRIED', rm, '#7dffb0')}
      <Title shotStart={start} y={0.1} size={92} lines={[[{w: 'some', t: at('SOME', 11.5)}, {w: 'of', t: at('OF', 11.7)}, {w: 'you…', t: at('YOU', 11.9)}]]} />
    </AbsoluteFill>
  );
};

/* ============ 7 · "same woman" — BULLET-TIME freeze ============ */
const BulletTime: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const a = lerp(fr, 0, f(dur), -0.75, 0.75, Easing.inOut(Easing.sin));
  const conf = useMemo(() => Array.from({length: 260}).map((_, i) => ({
    p: [(rnd(i) - 0.5) * 5, rnd(i + 1) * 3.5 + 0.3, (rnd(i + 2) - 0.5) * 5] as [number, number, number],
    r: [rnd(i + 3) * 6, rnd(i + 4) * 6, rnd(i + 5) * 6] as [number, number, number],
    c: ['#ffffff', '#ff8cc0', '#ffd36b', '#f4f0ff'][i % 4], rice: i % 3 === 0,
  })), []);
  const photo = useTex('cert', 512, 360, (g, w, h) => {
    g.fillStyle = '#fbf4e4'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9a45a'; g.lineWidth = 10; g.strokeRect(14, 14, w - 28, h - 28);
    g.textAlign = 'center'; g.fillStyle = '#333'; g.font = '34px UIBold'; g.fillText('Certificate of Marriage', w / 2, 90);
    g.font = '58px HeroBlack'; g.fillStyle = '#ff2d78'; g.fillText('Same Woman', w / 2, 200); g.font = '28px UIBold'; g.fillStyle = '#555'; g.fillText('(again)', w / 2, 260);
  });
  return (
    <AbsoluteFill>
      <Stage bg="#f6f1ea">
        <Rig pos={[Math.sin(a) * 4.2, 1.9, Math.cos(a) * 4.2]} look={[0, 1.8, 0]} fov={48} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 5, 4]} intensity={1.8} />
        {conf.map((c, i) => (
          <mesh key={i} position={c.p} rotation={c.r}>
            {c.rice ? <capsuleGeometry args={[0.012, 0.035, 4, 8]} /> : <planeGeometry args={[0.07, 0.11]} />}
            <meshStandardMaterial color={c.c} side={THREE.DoubleSide} />
          </mesh>
        ))}
        <mesh position={[0, 1.8, 0]} rotation={[0.1, 0.25, -0.12]}><planeGeometry args={[1.6, 1.12]} /><meshStandardMaterial map={photo} side={THREE.DoubleSide} /></mesh>
      </Stage>
      <Title shotStart={start} y={0.78} size={150} lines={[[{w: 'same', t: at('SAME')}], [{w: 'woman.', t: at('WOMAN'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 8 · "twice" — ELEVATOR DROP with a ring into a flute ============ */
const RingDrop: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const y = lerp(fr, 0, T * 0.75, 3.2, 0.42, Easing.in(Easing.quad));
  const splash = fr > T * 0.75;
  const bubbles = Array.from({length: 40}).map((_, i) => [(rnd(i) - 0.5) * 0.3, ((rnd(i + 4) + fr * 0.02 * (1 + rnd(i))) % 1) * 0.75 + 0.05, (rnd(i + 8) - 0.5) * 0.3] as [number, number, number]);
  return (
    <AbsoluteFill>
      <Stage bg="#140c05">
        <Rig pos={[0.05, y + 0.45, 0.7]} look={[0, y - 0.25, 0]} fov={58} />
        <ambientLight intensity={0.4} />
        <pointLight position={[0.6, 1.6, 1]} intensity={8} distance={6} color="#ffd38a" />
        <mesh position={[0, y, 0]} rotation={[Math.PI / 2 + 0.3, fr * 0.2, 0]}><torusGeometry args={[0.06, 0.014, 16, 48]} /><meshStandardMaterial color="#ffd36b" metalness={1} roughness={0.15} /></mesh>
        <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.18, 0.12, 0.9, 48, 1, true]} /><meshStandardMaterial color="#ffffff" transparent opacity={0.18} side={THREE.DoubleSide} roughness={0.05} /></mesh>
        <mesh position={[0, 0.38, 0]}><cylinderGeometry args={[0.17, 0.125, 0.72, 48]} /><meshStandardMaterial color="#f5c76a" transparent opacity={0.55} emissive="#7a4a10" emissiveIntensity={0.4} /></mesh>
        {bubbles.map((b, i) => <mesh key={i} position={b}><sphereGeometry args={[0.008, 8, 8]} /><meshBasicMaterial color="#fff3cf" /></mesh>)}
        {splash && Array.from({length: 18}).map((_, i) => { const k = fr - T * 0.75; const a = (i / 18) * Math.PI * 2; return (
          <mesh key={i} position={[Math.cos(a) * 0.02 * k, 0.75 + 0.03 * k - 0.004 * k * k, Math.sin(a) * 0.02 * k]}><sphereGeometry args={[0.012, 8, 8]} /><meshBasicMaterial color="#ffe6a6" /></mesh>); })}
      </Stage>
      <Title shotStart={start} y={0.2} size={220} lines={[[{w: 'twice.', t: at('TWICE'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 9 · 220M cases wrap the Earth — CHASE CAM ============ */
const EarthRing: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const prog = lerp(fr, 0, T - 10, 0.05, 1.0, Easing.inOut(Easing.quad));
  const R = 2.25, N = 420;
  const earth = useTex('earth', 1024, 512, (g, w, h) => {
    g.fillStyle = '#0f3d7a'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(${60 + rnd(i) * 40},${120 + rnd(i + 1) * 50},${60},0.95)`; g.beginPath(); g.ellipse(rnd(i + 2) * w, 80 + rnd(i + 3) * (h - 160), 20 + rnd(i + 4) * 90, 14 + rnd(i + 5) * 60, rnd(i) * 3, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(255,255,255,.9)'; g.fillRect(0, 0, w, 26); g.fillRect(0, h - 26, w, 26);
  });
  const mesh = useMemo(() => new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.075, 0.012), new THREE.MeshStandardMaterial({color: '#ffffff', emissive: '#ff4fb0', emissiveIntensity: 0.6}), N), []);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  const shown = Math.floor(N * prog);
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2; const s = i < shown ? 1 : 0.0001;
    e.set(0, -a, 0); q.setFromEuler(e); m.compose(new THREE.Vector3(Math.cos(a) * R, 0, Math.sin(a) * R), q, new THREE.Vector3(s, s, s)); mesh.setMatrixAt(i, m);
  }
  mesh.instanceMatrix.needsUpdate = true;
  const lead = (shown / N) * Math.PI * 2;
  const cam = [Math.cos(lead - 0.55) * 3.3, 0.55, Math.sin(lead - 0.55) * 3.3];
  const look = [Math.cos(lead + 0.25) * R, 0, Math.sin(lead + 0.25) * R];
  const count = Math.round(220e6 * prog);
  return (
    <AbsoluteFill>
      <Stage bg="#01020a">
        <Rig pos={cam} look={look} fov={55} />
        <ambientLight intensity={0.25} />
        <directionalLight position={[6, 2, -4]} intensity={3} color="#fff1dc" />
        <group rotation={[0.35, 0, 0.18]}>
          <mesh rotation={[0, fr * 0.004, 0]}><sphereGeometry args={[2, 64, 64]} /><meshStandardMaterial map={earth} roughness={0.9} /></mesh>
          <mesh><sphereGeometry args={[2.06, 48, 48]} /><meshBasicMaterial color="#5aa8ff" transparent opacity={0.12} /></mesh>
          <primitive object={mesh} />
        </group>
      </Stage>
      <div style={{position: 'absolute', top: H * 0.08, width: W, textAlign: 'center'}}>
        <Txt size={120} style={GradTxt}>{count.toLocaleString('en-US')}</Txt>
        <Txt size={52} style={{marginTop: 14, textShadow: SHADOW}}>COPIES OF GTA 5</Txt>
      </div>
      <Src text="per Take-Two · end to end ≈ 41,800 km: once around the Earth" y={0.9} />
    </AbsoluteFill>
  );
};

/* ============ 10 · odometer 220,000,000 — PAN ============ */
const Odometer: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const pan = lerp(fr, 0, T, 260, -700, Easing.inOut(Easing.sin));
  const digits = '220000000'.split('');
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 40% 30%, #3a2410, #0d0804 70%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: pan, top: 640, height: 640, display: 'flex', gap: 20, padding: '40px 50px', borderRadius: 36,
        background: 'linear-gradient(180deg,#b88a3e,#7a5420)', boxShadow: '0 40px 90px rgba(0,0,0,.6), inset 0 6px 0 rgba(255,230,170,.5)'}}>
        {digits.map((d, i) => {
          const land = 10 + i * 4;
          const spinT = interpolate(fr, [0, land], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
          const val = (Number(d) + 10 * (3 + i)) * spinT;
          const off = (val % 10) * 300;
          return (
            <React.Fragment key={i}>
              {(i === 3 || i === 6) && <div style={{width: 40, display: 'flex', alignItems: 'flex-end', fontFamily: 'HeroBlack', fontSize: 160, color: '#f6e2b0'}}>,</div>}
              <div style={{width: 210, height: 560, overflow: 'hidden', borderRadius: 18, background: 'linear-gradient(180deg,#0b0b0d,#26262a 50%,#0b0b0d)', position: 'relative'}}>
                <div style={{position: 'absolute', top: 130 - off, left: 0, width: '100%'}}>
                  {Array.from({length: 11}).map((_, k) => <div key={k} style={{height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'HeroBlack', fontSize: 240, color: '#f4f0e6'}}>{k % 10}</div>)}
                </div>
                <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,.85), transparent 30%, transparent 70%, rgba(0,0,0,.85))'}} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 120, top: 120, width: 200, height: 200, borderRadius: 100, background: 'radial-gradient(circle, #fff6c8, #ffb14a 40%, transparent 70%)', filter: 'blur(4px)'}} />
      <Title shotStart={start} y={0.82} size={150} lines={[[{w: '220', t: at('TWO', 22.7)}], [{w: 'million.', t: at('MILLION', 24), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 11 · tortoise carrying "6" — LEADING SHOT ============ */
const Tortoise: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const tz = fr * 0.004;                                              // the tortoise barely moves
  const camZ = lerp(fr, 0, T, tz + 1.2, tz + 2.6, Easing.inOut(Easing.sin));   // camera retreats ahead of it
  const leg = Math.sin(fr * 0.25) * 0.15;
  const road = useTex('road', 256, 1024, (g, w, h) => { g.fillStyle = '#35353a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 2000; i++) { g.fillStyle = `rgba(255,255,255,${rnd(i) * 0.08})`; g.fillRect(rnd(i + 1) * w, rnd(i + 2) * h, 2, 2); } g.fillStyle = '#f2c94c'; for (let y = 0; y < h; y += 160) g.fillRect(w / 2 - 6, y, 12, 90); });
  road.wrapS = road.wrapT = THREE.RepeatWrapping; road.repeat.set(1, 6);
  const box = useTex('box6', 256, 320, (g, w, h) => { g.fillStyle = '#16101c'; g.fillRect(0, 0, w, h); g.textAlign = 'center'; g.font = '210px HeroBlack'; g.fillStyle = '#ff4fb0'; g.fillText('6', w / 2, 230); g.font = '28px UIBold'; g.fillStyle = '#fff'; g.fillText('COMING SOON', w / 2, 290); });
  return (
    <AbsoluteFill>
      <Stage bg="#cfe4f2" fog={['#e6d9c4', 6, 26]}>
        <Rig pos={[0.12, 0.32, camZ]} look={[0, 0.2, tz - 1]} fov={50} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 8, 2]} intensity={2.4} color="#fff3d6" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]}><planeGeometry args={[4, 40]} /><meshStandardMaterial map={road} roughness={0.9} /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -10]}><planeGeometry args={[60, 60]} /><meshStandardMaterial color="#c9a76a" /></mesh>
        <group position={[0, 0, tz]}>
          <mesh position={[0, 0.17, 0]} scale={[1, 0.62, 1.2]}><sphereGeometry args={[0.28, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#5a6b2e" roughness={0.6} /></mesh>
          <mesh position={[0, 0.16, 0]} scale={[1.05, 0.08, 1.25]}><cylinderGeometry args={[0.28, 0.28, 1, 32]} /><meshStandardMaterial color="#3e4a1e" /></mesh>
          <mesh position={[0, 0.17, 0.4 + Math.sin(fr * 0.1) * 0.02]}><sphereGeometry args={[0.075, 20, 20]} /><meshStandardMaterial color="#8a9a5a" /></mesh>
          {[[-0.2, 0.25], [0.2, 0.25], [-0.2, -0.25], [0.2, -0.25]].map(([lx, lz], i) => <mesh key={i} position={[lx, 0.07, lz + (i % 2 ? leg : -leg)]}><cylinderGeometry args={[0.05, 0.06, 0.14, 12]} /><meshStandardMaterial color="#8a9a5a" /></mesh>)}
          <mesh position={[0, 0.38, -0.02]} rotation={[0, 0.15, 0]}><boxGeometry args={[0.22, 0.28, 0.04]} /><meshStandardMaterial map={box} /></mesh>
        </group>
      </Stage>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 50%, rgba(255,230,180,.15))'}} />
      <Title shotStart={start} y={0.13} size={110} lines={[[{w: '"nah,', t: at('NAH')}, {w: "we'll", t: at("WE'LL")}, {w: 'take', t: at('TAKE', 27)}], [{w: 'our', t: at('OUR')}, {w: 'time."', t: at('TIME', 27.5), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 12 · pull-to-refresh "TBA" — UI SCROLL ============ */
const Refresh: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const cyc = fr % 22;
  const pull = cyc < 10 ? interpolate(cyc, [0, 9], [0, 220], {...cl, easing: Easing.out(Easing.quad)}) : interpolate(cyc, [10, 18], [220, 0], {...cl, easing: Easing.in(Easing.quad)});
  const count = 600 + Math.floor(fr / 22) * 13 + Math.min(12, Math.floor(cyc / 1.6));
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#0b0d14,#141a2a)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 90, right: 90, top: 200, bottom: 470, borderRadius: 64, background: '#f6f7f9', overflow: 'hidden', boxShadow: '0 30px 90px rgba(0,0,0,.6)'}}>
        <div style={{height: 150, display: 'flex', alignItems: 'flex-end', padding: '0 46px 18px', fontFamily: 'HeroBlack', fontSize: 50, color: '#111'}}>Search</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 150, height: pull, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 64, height: 64, borderRadius: 32, border: '7px solid #ddd', borderTopColor: '#ff2d78', transform: `rotate(${fr * 22}deg)`, opacity: pull / 220}} />
        </div>
        <div style={{transform: `translateY(${pull}px)`, padding: '0 40px'}}>
          <div style={{padding: '24px 30px', borderRadius: 22, background: '#e9eaef', fontFamily: 'UIBold', fontSize: 38, color: '#333'}}>🔍 gta 6 release date</div>
          <div style={{marginTop: 30, padding: '40px 36px', borderRadius: 28, background: '#fff', boxShadow: '0 6px 20px rgba(0,0,0,.08)'}}>
            <div style={{fontFamily: 'UIBold', fontSize: 30, color: '#888'}}>Release date</div>
            <div style={{fontFamily: 'HeroBlack', fontSize: 120, color: '#111', marginTop: 6}}>TBA</div>
            <div style={{fontFamily: 'UIBold', fontSize: 30, color: '#aaa', marginTop: 8}}>updated just now · still TBA</div>
          </div>
          {[1, 2, 3].map((k) => <div key={k} style={{marginTop: 22, height: 120, borderRadius: 22, background: '#eceef2'}} />)}
        </div>
      </div>
      <div style={{position: 'absolute', top: H * 0.81, width: W, textAlign: 'center'}}>
        <Txt size={76} style={{textShadow: SHADOW}}>REFRESHED <span style={GradTxt}>{count}</span> TIMES</Txt>
      </div>
      <Title shotStart={start} y={0.05} size={80} lines={[[{w: "don't", t: at("DON'T")}, {w: 'act', t: at('ACT')}, {w: 'like', t: at('LIKE')}, {w: 'you', t: at('YOU', 28.9)}, {w: "didn't", t: at("DIDN'T")}]]} outAt={30.0} />
    </AbsoluteFill>
  );
};

/* ============ 13 · CCTV of you at 3:12 AM — ROBOTIC PTZ STEPS ============ */
const Cctv: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const steps = [[0, 0, 1], [6, -160, 1], [12, -160, 1.6], [20, -60, 2.1]];
  let px = 0, z = 1;
  for (let i = 0; i < steps.length; i++) {
    const [t0, x, zz] = steps[i]; const [, x0, z0] = steps[Math.max(0, i - 1)];
    if (fr >= t0) { px = interpolate(fr, [t0, t0 + 4], [x0, x], {...cl, easing: Easing.out(Easing.back(1.6))}); z = interpolate(fr, [t0, t0 + 4], [z0, zz], {...cl, easing: Easing.out(Easing.back(1.6))}); }
  }
  const noise = rnd(fr * 3.1);
  return (
    <AbsoluteFill style={{background: '#020804', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translateX(${px}px) scale(${z})`, transformOrigin: '55% 52%', filter: 'grayscale(1) sepia(1) hue-rotate(70deg) saturate(3) brightness(.9) contrast(1.2)'}}>
        <AbsoluteFill style={{background: 'linear-gradient(180deg,#2b2b2b,#141414)'}} />
        <div style={{position: 'absolute', left: 120, top: 1000, width: 900, height: 380, borderRadius: 30, background: '#5a5a5a'}} />
        <div style={{position: 'absolute', left: 160, top: 930, width: 260, height: 120, borderRadius: 50, background: '#8a8a8a'}} />
        {/* you, under the duvet, face lit by the phone */}
        <div style={{position: 'absolute', left: 440, top: 880, width: 420, height: 260, borderRadius: '50% 50% 30% 30%', background: '#6e6e6e'}} />
        <div style={{position: 'absolute', left: 520, top: 800, width: 150, height: 150, borderRadius: 75, background: '#b8b8b8'}} />
        <div style={{position: 'absolute', left: 640, top: 860, width: 70, height: 110, borderRadius: 12, background: '#fff', boxShadow: '0 0 90px 40px rgba(255,255,255,.55)'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 2px, transparent 2px 4px)', opacity: 0.6 + noise * 0.2}} />
      <div style={{position: 'absolute', left: 50, top: 60, fontFamily: 'UIBold', fontSize: 40, color: '#e6ffe6', letterSpacing: 2}}>CAM 03 · BEDROOM</div>
      <div style={{position: 'absolute', right: 50, top: 60, fontFamily: 'UIBold', fontSize: 40, color: '#ff3b3b', opacity: Math.floor(fr / 8) % 2 ? 0.3 : 1}}>● REC</div>
      <div style={{position: 'absolute', left: 50, bottom: 70, fontFamily: 'UIBold', fontSize: 40, color: '#e6ffe6'}}>03:12:{String(41 + Math.floor(fr / 30)).padStart(2, '0')} AM</div>
      {/* PTZ crosshair */}
      <div style={{position: 'absolute', left: W / 2 - 80, top: H / 2 - 80, width: 160, height: 160, border: '4px solid rgba(230,255,230,.7)'}} />
      <Title shotStart={start} y={0.25} size={170} lines={[[{w: 'I', t: at('I', 31.4)}, {w: 'saw', t: at('SAW')}, {w: 'you.', t: at('YOU', 32), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 14 · wall of cameras turning to you — 360° SPIN IN PLACE ============ */
const CameraWall: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const yaw = lerp(fr, 0, T, 0, Math.PI * 2, Easing.inOut(Easing.quad));
  const turnAt = f(at('EVERYONE') - start);
  const cams = useMemo(() => Array.from({length: 54}).map((_, i) => {
    const a = (i % 18) / 18 * Math.PI * 2 + (Math.floor(i / 18) % 2) * 0.17; const y = 0.9 + Math.floor(i / 18) * 1.0;
    return {a, y, k: rnd(i)};
  }), []);
  return (
    <AbsoluteFill>
      <Stage bg="#07070a" fog={['#07070a', 2, 8]}>
        <Rig pos={[0, 1.9, 0]} look={[Math.sin(yaw) * 3, 1.8, -Math.cos(yaw) * 3]} fov={70} />
        <ambientLight intensity={0.35} />
        <pointLight position={[0, 3.5, 0]} intensity={10} distance={8} color="#cfd6ff" />
        <mesh><cylinderGeometry args={[3.2, 3.2, 5, 48, 1, true]} /><meshStandardMaterial color="#2a2c32" side={THREE.BackSide} roughness={0.9} /></mesh>
        {cams.map((c, i) => {
          const turn = lerp(fr, turnAt + c.k * 6, turnAt + c.k * 6 + 5, 1, 0, Easing.out(Easing.back(2)));
          const wx = Math.sin(c.a) * 3.0, wz = -Math.cos(c.a) * 3.0;
          const face = Math.atan2(-wx, -wz);
          return (
            <group key={i} position={[wx, c.y, wz]} rotation={[0.25 * turn, face + (c.k - 0.5) * 2.4 * turn, 0]} scale={1.7}>
              <mesh position={[0, 0, 0.12]}><boxGeometry args={[0.16, 0.14, 0.34]} /><meshStandardMaterial color="#e9ebee" roughness={0.4} /></mesh>
              <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.03, 20]} /><meshStandardMaterial color="#050505" metalness={0.9} roughness={0.1} /></mesh>
              <mesh position={[0.05, 0.05, 0.3]}><sphereGeometry args={[0.012, 8, 8]} /><meshBasicMaterial color={turn < 0.5 ? '#ff2020' : '#401010'} /></mesh>
            </group>
          );
        })}
      </Stage>
      <Title shotStart={start} y={0.78} size={140} lines={[[{w: 'everyone', t: at('EVERYONE'), accent: true}], [{w: 'saw', t: at('SAW', 33.3)}, {w: 'you.', t: at('YOU', 33.7)}]]} />
    </AbsoluteFill>
  );
};

/* ============ 15 · cash counter through a glass table — SLIDE-UNDER ============ */
const CashCounter: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const p = lerp(fr, 0, T, 0, 1, Easing.inOut(Easing.cubic));
  const cam = [0.2, 0.95 - p * 1.25, 1.4 - p * 1.1];
  const bill = useTex('bill', 256, 120, (g, w, h) => { g.fillStyle = '#9fd9a8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2f6b3a'; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12); g.fillStyle = '#2f6b3a'; g.font = '70px HeroBlack'; g.textAlign = 'center'; g.fillText('$100', w / 2, 86); });
  return (
    <AbsoluteFill>
      <Stage bg="#06100a">
        <Rig pos={cam} look={[0, 0.25, 0]} fov={55} />
        <ambientLight intensity={0.2} />
        <pointLight position={[0.6, 1.4, 0.4]} intensity={10} distance={4} color="#bfffcf" />
        <pointLight position={[0, -1, 0.5]} intensity={3} distance={3} color="#40ff90" />
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[3, 2]} /><meshStandardMaterial color="#aaffdd" transparent opacity={0.16} roughness={0.05} side={THREE.DoubleSide} /></mesh>
        <lineSegments position={[0, 0, 0]}><edgesGeometry args={[new THREE.BoxGeometry(3, 0.02, 2)]} /><lineBasicMaterial color="#cfffe8" /></lineSegments>
        <mesh position={[0, 0.16, 0]}><boxGeometry args={[0.6, 0.3, 0.45]} /><meshStandardMaterial color="#1c1f22" metalness={0.5} roughness={0.4} /></mesh>
        {Array.from({length: 12}).map((_, i) => { const ph = (fr * 0.9 + i * 3) % 36; const ang = interpolate(ph, [0, 36], [0, Math.PI], cl); return (
          <mesh key={i} position={[0, 0.33 + Math.sin(ang) * 0.12, 0.05 - Math.cos(ang) * 0.12]} rotation={[-ang, 0, 0]}><planeGeometry args={[0.36, 0.17]} /><meshStandardMaterial map={bill} side={THREE.DoubleSide} /></mesh>); })}
        <mesh position={[-0.6, 0.06, 0.2]}><boxGeometry args={[0.38, 0.12, 0.18]} /><meshStandardMaterial map={bill} /></mesh>
      </Stage>
      <Title shotStart={start} y={0.8} size={150} lines={[[{w: "let's", t: at("LET'S")}, {w: 'talk', t: at('TALK')}], [{w: 'money.', t: at('MONEY'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 16 · 93M views — OPTICAL ZOOM-OUT over a city of screens ============ */
const CityViews: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const fov = lerp(fr, 0, T * 0.8, 3.2, 62, Easing.in(Easing.cubic));
  const lit = lerp(fr, 0, T * 0.85, 0.002, 1, Easing.in(Easing.quad));
  const views = Math.round(93e6 * lerp(fr, 0, T * 0.85, 0, 1, Easing.in(Easing.quad)));
  const hours = Math.min(24, Math.floor(lerp(fr, 0, T * 0.85, 0, 24, Easing.linear)));
  const bld = useMemo(() => Array.from({length: 90}).map((_, i) => ({x: (i % 10 - 4.5) * 2.4 + rnd(i) * 0.6, z: -Math.floor(i / 10) * 2.6 - 4, h: 2 + rnd(i + 3) * 9, w: 1.4 + rnd(i + 5) * 0.6})), []);
  const winTex = (k: number) => useTex('win' + k, 64, 256, (g, w, h) => {
    g.fillStyle = '#0a0c18'; g.fillRect(0, 0, w, h);
    for (let y = 6; y < h; y += 14) for (let x = 6; x < w; x += 14) { const on = rnd(x * 31 + y * 7 + k * 999) < (k + 1) / 5; g.fillStyle = on ? (rnd(x + y) > 0.5 ? '#9fd6ff' : '#ff8cc8') : '#141828'; g.fillRect(x, y, 8, 9); }
  });
  const wins = [winTex(0), winTex(1), winTex(2), winTex(3), winTex(4)];
  const stage = Math.min(4, Math.floor(lit * 5));
  return (
    <AbsoluteFill>
      <Stage bg="#05040e" fog={['#05040e', 20, 60]}>
        <Rig pos={[0, 6, 12]} look={[0.55, 4.1, -4]} fov={fov} />
        <ambientLight intensity={0.6} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -12]}><planeGeometry args={[80, 60]} /><meshStandardMaterial color="#06060c" /></mesh>
        {bld.map((b, i) => (
          <mesh key={i} position={[b.x, b.h / 2, b.z]}><boxGeometry args={[b.w, b.h, b.w]} /><meshBasicMaterial map={wins[i === 0 ? 4 : stage]} /></mesh>
        ))}
      </Stage>
      <div style={{position: 'absolute', top: H * 0.07, width: W, textAlign: 'center'}}>
        <Txt size={124} style={GradTxt}>{views.toLocaleString('en-US')}</Txt>
        <Txt size={50} style={{marginTop: 14, textShadow: SHADOW}}>VIEWS · TRAILER 1</Txt>
      </div>
      <div style={{position: 'absolute', left: W / 2 - 110, top: H * 0.66, width: 220, height: 220}}>
        <svg width={220} height={220}><circle cx={110} cy={110} r={96} stroke="rgba(255,255,255,.2)" strokeWidth={14} fill="none" />
          <circle cx={110} cy={110} r={96} stroke="#ff4fb0" strokeWidth={14} fill="none" strokeDasharray={603} strokeDashoffset={603 * (1 - hours / 24)} transform="rotate(-90 110 110)" strokeLinecap="round" /></svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'HeroBlack', fontSize: 66, color: '#fff'}}>{hours}h</div>
      </div>
      <Src text="YouTube · first 24 hours" y={0.9} />
    </AbsoluteFill>
  );
};

/* ============ 17 · UK of people-dots overflowing — IMPACT SHAKE ============ */
const UK_POLY = [[0.52, 0.02], [0.6, 0.06], [0.58, 0.14], [0.66, 0.2], [0.62, 0.28], [0.7, 0.36], [0.74, 0.46], [0.8, 0.56], [0.86, 0.66], [0.92, 0.76], [0.84, 0.84], [0.9, 0.92], [0.7, 0.96], [0.5, 0.94],
  [0.36, 0.98], [0.3, 0.92], [0.46, 0.84], [0.5, 0.76], [0.42, 0.7], [0.48, 0.62], [0.42, 0.52], [0.46, 0.44], [0.4, 0.36], [0.44, 0.26], [0.4, 0.16], [0.46, 0.08]];
const NI_POLY = [[0.16, 0.4], [0.28, 0.38], [0.32, 0.46], [0.24, 0.5], [0.14, 0.48]];
const inPoly = (x: number, y: number, P: number[][]) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
const UkDots: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const dots = useMemo(() => {
    const inside: number[][] = [], outside: number[][] = [];
    for (let i = 0; i < 9000 && (inside.length < 1400 || outside.length < 560); i++) {
      const x = rnd(i * 2 + 1), y = rnd(i * 2 + 7); const inn = inPoly(x, y, UK_POLY) || inPoly(x, y, NI_POLY);
      if (inn && inside.length < 1400) inside.push([x, y]); else if (!inn && outside.length < 560) outside.push([x, y]);
    }
    return {inside, outside};
  }, []);
  const fill = lerp(fr, 0, T * 0.45, 0, 1, Easing.out(Easing.quad));
  const spill = lerp(fr, T * 0.45, T * 0.8, 0, 1, Easing.out(Easing.cubic));
  const shakeAmt = fr > T * 0.45 && fr < T * 0.8 ? 22 * (1 - (fr - T * 0.45) / (T * 0.35)) : 0;
  const sx = (rnd(fr * 1.7) - 0.5) * shakeAmt, sy = (rnd(fr * 2.3) - 0.5) * shakeAmt;
  const S = 940, ox = 70, oy = 360;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #2a1430, #0a0610 70%)', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${sx}px,${sy}px)`}}>
        <svg width={W} height={H}>
          <polygon points={UK_POLY.map(([x, y]) => `${ox + x * S},${oy + y * S * 1.25}`).join(' ')} fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.35)" strokeWidth={3} />
          <polygon points={NI_POLY.map(([x, y]) => `${ox + x * S},${oy + y * S * 1.25}`).join(' ')} fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.35)" strokeWidth={3} />
          {dots.inside.slice(0, Math.floor(dots.inside.length * fill)).map(([x, y], i) => <circle key={i} cx={ox + x * S} cy={oy + y * S * 1.25} r={5} fill="#9fd6ff" />)}
          {dots.outside.slice(0, Math.floor(dots.outside.length * spill)).map(([x, y], i) => <circle key={'o' + i} cx={ox + x * S} cy={oy + y * S * 1.25} r={5} fill="#ff4fb0" />)}
        </svg>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: H * 0.05, width: W, textAlign: 'center'}}>
        <Txt size={58} style={{textShadow: SHADOW}}><span style={{color: '#9fd6ff'}}>UK POPULATION ≈ 69M</span></Txt>
        <Txt size={58} style={{marginTop: 14, textShadow: SHADOW, opacity: spill > 0 ? 1 : 0}}><span style={{color: '#ff7ab8'}}>TRAILER VIEWERS: 93M</span></Txt>
      </div>
      <Title shotStart={start} y={0.9} size={96} lines={[[{w: 'more', t: at('MORE', 41.5)}, {w: 'than', t: at('THAN', 41.8)}, {w: 'the', t: at('THE', 42)}, {w: 'entire', t: at('ENTIRE')}, {w: 'UK.', t: at('U', 43.5), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 18 · hypnotist stopwatch — PENDULUM RIDE ============ */
const Pendulum: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const sw = Math.sin(fr * 0.16) * 22;                     // the camera rides the pendulum: the world swings, the watch stays centred
  const secs = Math.min(90, Math.floor(fr * 1.6));
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `rotate(${-sw}deg) scale(1.6)`, transformOrigin: '50% -40%'}}>
        <AbsoluteFill style={{background: `repeating-conic-gradient(from ${fr * 4}deg at 50% 60%, #1a0624 0deg 12deg, #3a0d4a 12deg 24deg)`}} />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: W / 2 - 4, top: -100, width: 8, height: 820, background: 'linear-gradient(90deg,#9a7a3a,#f2d48a,#9a7a3a)'}} />
      <div style={{position: 'absolute', left: W / 2 - 260, top: 680, width: 520, height: 520, borderRadius: 260, background: 'radial-gradient(circle at 35% 30%, #fff8e0, #d8b46a 45%, #8a6a2a 70%)', boxShadow: '0 0 120px rgba(255,200,120,.45)'}}>
        <div style={{position: 'absolute', inset: 40, borderRadius: '50%', background: '#fbf8f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Txt size={150} color="#111">{Math.floor(secs / 60)}:{String(secs % 60).padStart(2, '0')}</Txt>
        </div>
      </div>
      <Title shotStart={start} y={0.8} size={130} lines={[[{w: '90', t: at('NINETY', 44.8), accent: true}, {w: 'seconds', t: at('SECONDS')}], [{w: 'of', t: at('OF', 45.7)}, {w: 'a', t: at('A', 45.8)}, {w: 'game.', t: at('GAME', 46)}]]} />
    </AbsoluteFill>
  );
};

/* ============ 19 · the sun crosses the sky — SLINGSHOT ARC ============ */
const OneDay: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const p = lerp(fr, 0, T, 0, 1, Easing.inOut(Easing.quad));
  const yaw = (p - 0.5) * 120;                              // camera slings round following the sun
  const sunA = Math.PI * (1 - p);
  const sx = W / 2 + Math.cos(sunA) * 900 - yaw * 8, sy = 1200 - Math.sin(sunA) * 820;
  const sky = p < 0.5 ? `linear-gradient(180deg, #2a5ad8, #8ec5ff ${40 + p * 40}%, #ffd6a0)` : `linear-gradient(180deg, #2a1a5a, #c8487a ${60 - (p - 0.5) * 30}%, #ff9a4a)`;
  return (
    <AbsoluteFill style={{background: sky, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: sx - 110, top: sy - 110, width: 220, height: 220, borderRadius: 110, background: 'radial-gradient(circle, #fff, #ffe08a 50%, #ffb04a)', boxShadow: '0 0 160px 60px rgba(255,210,120,.6)'}} />
      <div style={{position: 'absolute', left: -400 - yaw * 14, right: -400 + yaw * 14, top: 1240, height: 800, background: 'linear-gradient(180deg,#1a1020,#05030a)'}}>
        {Array.from({length: 40}).map((_, i) => <div key={i} style={{position: 'absolute', left: i * 52, bottom: 780, width: 46, height: 60 + rnd(i) * 260, background: '#0d0814'}} />)}
      </div>
      <Title shotStart={start} y={0.2} size={190} lines={[[{w: 'in', t: at('IN', 46.5)}, {w: 'one', t: at('ONE', 46.7)}], [{w: 'day.', t: at('DAY', 47), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 20 · 2013 time capsule — BOOM-OVER ============ */
const Capsule: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const a = lerp(fr, 0, T, 0.25, Math.PI - 0.35, Easing.inOut(Easing.cubic));       // arc over the top, front -> back
  const cam = [0.15, Math.sin(a) * 2.2 + 0.2, Math.cos(a) * 2.2];
  const lid = lerp(fr, 4, 30, 0, -1.9, Easing.out(Easing.cubic));
  const tag = useTex('tag13', 256, 128, (g, w, h) => { g.fillStyle = '#efe4c8'; g.fillRect(0, 0, w, h); g.fillStyle = '#222'; g.font = '72px HeroBlack'; g.textAlign = 'center'; g.fillText('2013', w / 2, 92); });
  const dvd = useTex('dvd', 256, 360, (g, w, h) => { g.fillStyle = '#0e2a5a'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.font = '44px HeroBlack'; g.textAlign = 'center'; g.fillText('DVD', w / 2, 70); g.font = '30px UIBold'; g.fillText('Season 1', w / 2, 320); });
  const phone = useTex('crack', 256, 512, (g, w, h) => { g.fillStyle = '#0a0a0c'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 3; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(80, 160); g.lineTo(80 + Math.cos(i) * 260, 160 + Math.sin(i * 1.3) * 300); g.stroke(); } });
  const bud = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({length: 14}).map((_, i) => new THREE.Vector3(Math.sin(i * 1.3) * 0.25, 0.08 + (i % 3) * 0.015, Math.cos(i * 0.9) * 0.18))), 160, 0.008, 8), []);
  return (
    <AbsoluteFill>
      <Stage bg="#120c08" fog={['#120c08', 3, 8]}>
        <Rig pos={cam} look={[0, 0.05, 0]} fov={52} />
        <ambientLight intensity={0.25} />
        <pointLight position={[0.3, 1.8, 0.3]} intensity={9} distance={5} color="#ffd28a" />
        <mesh position={[0, -0.12, 0]}><boxGeometry args={[1.3, 0.24, 0.9]} /><meshStandardMaterial color="#6a7078" metalness={0.6} roughness={0.5} /></mesh>
        <mesh position={[0, 0.0, 0]}><boxGeometry args={[1.22, 0.02, 0.82]} /><meshStandardMaterial color="#2a2420" /></mesh>
        <group position={[0, 0.0, -0.45]} rotation={[lid, 0, 0]}><mesh position={[0, 0.02, 0.45]}><boxGeometry args={[1.32, 0.05, 0.92]} /><meshStandardMaterial color="#7a8088" metalness={0.6} roughness={0.45} /></mesh></group>
        <mesh position={[-0.32, 0.04, 0.05]} rotation={[-Math.PI / 2, 0, 0.2]}><planeGeometry args={[0.26, 0.36]} /><meshStandardMaterial map={dvd} /></mesh>
        <mesh position={[0.25, 0.035, -0.12]} rotation={[-Math.PI / 2, 0, -0.4]}><planeGeometry args={[0.13, 0.26]} /><meshStandardMaterial map={phone} /></mesh>
        <mesh geometry={bud} position={[0.15, 0, 0.15]}><meshStandardMaterial color="#f2f2f2" /></mesh>
        <mesh position={[0.4, 0.035, 0.25]} rotation={[-Math.PI / 2, 0, 0.1]}><planeGeometry args={[0.22, 0.11]} /><meshStandardMaterial map={tag} /></mesh>
      </Stage>
      <Title shotStart={start} y={0.12} size={96} lines={[[{w: 'what', t: at('WHAT', 48.4)}, {w: 'were', t: at('WERE', 48.7)}, {w: 'you', t: at('YOU', 48.9)}, {w: 'doing', t: at('DOING')}], [{w: 'in', t: at('WHEN', 49.4)}, {w: '2013?', t: at('FIVE', 50), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 21 · "it wasn't this" — DROSTE LOOP ============ */
const Droste: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const k = 0.42;
  const t = (fr / 40) % 1;
  const zoom = Math.pow(1 / k, t);
  const rot = t * 8;
  const levels = 7;
  const phoneAt = (i: number): React.ReactNode => i >= levels ? null : (
    <div style={{position: 'absolute', left: '50%', top: '50%', width: W * 0.78, height: H * 0.78, transform: `translate(-50%,-50%) scale(${i === 0 ? 1 : k}) rotate(8deg)`, borderRadius: 70,
      background: '#0b0b10', padding: 22, boxSizing: 'border-box', boxShadow: '0 30px 80px rgba(0,0,0,.6)'}}>
      <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 52, overflow: 'hidden', background: 'linear-gradient(180deg,#2a0b48,#a1176f 60%,#ff8a5a)'}}>
        <div style={{position: 'absolute', top: '8%', width: '100%', textAlign: 'center', fontFamily: 'HeroBlack', fontSize: 110, color: '#fff'}}>it wasn't</div>
        <div style={{position: 'absolute', bottom: '6%', width: '100%', textAlign: 'center', fontFamily: 'HeroBlack', fontSize: 130, ...GradTxt}}>this.</div>
        {phoneAt(i + 1)}
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom * 1.28}) rotate(${-rot}deg)`}}>{phoneAt(0)}</AbsoluteFill>
      <Title shotStart={start} y={0.5} size={110} lines={[[{w: 'I', t: at('I', 51.3)}, {w: 'promise', t: at('PROMISE')}, {w: 'you…', t: at('YOU', 52)}]]} outAt={52.55} />
    </AbsoluteFill>
  );
};

/* ============ 22 · fogged mirror signature — LENS-FOG WIPE ============ */
const Mirror: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const write = lerp(fr, 4, f(at('SIN', 54.8) - start) + 4, 0, 1, Easing.inOut(Easing.quad));
  const wipe = lerp(fr, f(at('EVERY', 55.4) - start) - 4, f(at('EVERY', 55.4) - start) + 10, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill style={{background: '#1b1f24', overflow: 'hidden'}}>
      {/* the bathroom behind the glass (reflection) */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#d9e1e6,#9aa7ae 60%,#5f6a70)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 260, background: 'radial-gradient(ellipse at 50% 0%, rgba(255,240,210,.9), transparent 70%)'}} />
      {Array.from({length: 7}).map((_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 1300 + i * 90, height: 4, background: 'rgba(255,255,255,.4)'}} />)}
      {/* steam fog layer with the finger trail cut through it */}
      <AbsoluteFill style={{background: 'rgba(235,240,244,.82)', backdropFilter: 'blur(26px)', WebkitBackdropFilter: 'blur(26px)',
        maskImage: `linear-gradient(100deg, transparent ${wipe * 120 - 20}%, black ${wipe * 120}%)`, WebkitMaskImage: `linear-gradient(100deg, transparent ${wipe * 120 - 20}%, black ${wipe * 120}%)`}}>
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          <text x={W / 2} y={820} textAnchor="middle" fontFamily="HeroBlack" fontSize={150} fill="none" stroke="#7f8b92" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={5200} strokeDashoffset={5200 * (1 - write)} style={{transform: 'rotate(-4deg)', transformOrigin: '50% 40%'}}>Vice City</text>
          <text x={W / 2} y={1010} textAnchor="middle" fontFamily="HeroBlack" fontSize={190} fill="none" stroke="#ff2d78" strokeWidth={24} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={3000} strokeDashoffset={3000 * (1 - Math.max(0, write * 1.6 - 0.6))} style={{transform: 'rotate(-4deg)', transformOrigin: '50% 40%'}}>Sin</text>
        </svg>
        {Array.from({length: 14}).map((_, i) => <div key={i} style={{position: 'absolute', left: 120 + rnd(i) * 840, top: 760 + rnd(i + 4) * 300, width: 8, height: 30 + (fr * (1 + rnd(i))) % 140, background: 'rgba(140,155,165,.6)', borderRadius: 4}} />)}
      </AbsoluteFill>
      {/* behind the fog: the follow call-to-action, revealed by the wipe */}
      <div style={{position: 'absolute', top: H * 0.36, width: W, textAlign: 'center', opacity: wipe}}>
        <Txt size={96} color="#16181c">Follow</Txt>
        <Txt size={150} style={{...GradTxt, marginTop: 10}}>Vice City Sin</Txt>
        <Txt size={64} color="#16181c" style={{marginTop: 50}}>every sin's a story.</Txt>
      </div>
      <Title shotStart={start} y={0.12} size={110} lines={[[{w: 'follow', t: at('FOLLOW', 53.6), accent: true}]]} outAt={55.5} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
export const EverySin: React.FC = () => {
  const ready = useFontsReady('sin');
  const fr = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{background: '#000'}} />;
  const S = (i: number) => ({from: f(CUT[i]), durationInFrames: f(CUT[i + 1]) - f(CUT[i])});
  const d = (i: number) => CUT[i + 1] - CUT[i];
  const scenes = [
    <GrowthChart start={CUT[0]} dur={d(0)} />, <AgeGate start={CUT[1]} />, <TreeRings start={CUT[2]} dur={d(2)} />, <WaitingRoom start={CUT[3]} dur={d(3)} />,
    <Candles start={CUT[4]} />, <Topper start={CUT[5]} />, <BulletTime start={CUT[6]} dur={d(6)} />, <RingDrop start={CUT[7]} dur={d(7)} />,
    <EarthRing start={CUT[8]} dur={d(8)} />, <Odometer start={CUT[9]} dur={d(9)} />, <Tortoise start={CUT[10]} dur={d(10)} />, <Refresh start={CUT[11]} />,
    <Cctv start={CUT[12]} />, <CameraWall start={CUT[13]} dur={d(13)} />, <CashCounter start={CUT[14]} dur={d(14)} />, <CityViews start={CUT[15]} dur={d(15)} />,
    <UkDots start={CUT[16]} dur={d(16)} />, <Pendulum start={CUT[17]} />, <OneDay start={CUT[18]} dur={d(18)} />, <Capsule start={CUT[19]} dur={d(19)} />,
    <Droste start={CUT[20]} />, <Mirror start={CUT[21]} dur={d(21)} />,
  ];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scenes.map((s, i) => <Sequence key={i} {...S(i)}>{s}</Sequence>)}
      {FLASHES.map(([t, peak, col], i) => (
        <AbsoluteFill key={i} style={{background: col, pointerEvents: 'none', opacity: interpolate(fr, [f(t) - 1, f(t), f(t) + 1, f(t) + 4], [0, peak, peak * 0.62, 0], cl)}} />
      ))}
      <Audio src={staticFile('mix_sin.wav')} />
    </AbsoluteFill>
  );
};
