/* "6 things a Brit should never do in GTA 6" — 27 original shots, 27 unique moves (see /shotlist.md, video 6).
   Visual system: grey-drizzle Britain vs neon Vice City. Formula: /style.md. */
import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';
import * as THREE from 'three';
import words from './w6.json';
import {W, H, GRAD, SHADOW, f, Title} from './kit';
import {cl, lerp, rnd, pop, useFontsReady, useTex, Rig, Stage} from './kit3d';

type Wd = [string, number];
const WT = (words as Wd[]).map(([w, t]) => [w, t + 0.05] as Wd);
const at = (word: string, after = 0) => WT.find(([w, t]) => w === word && t >= after)?.[1] ?? after;

const CUT = [0, 4.42, 6.98, 9.22, 10.96, 14.26, 17.42, 20.08, 22.45, 24.88, 26.57, 29.71, 32.81, 35.53, 36.71, 40.94, 42.27, 43.45, 45.72, 47.79, 50.53, 51.58, 53.35, 56.2, 59.71, 61.88, 65.02, 69.7];
const RULES: [number, number][] = [[1, 6.98], [2, 14.26], [3, 22.45], [4, 29.71], [5, 43.45], [6, 53.35]];
const FLASHES: [number, number, string][] = [[14.26, 0.6, '#fff'], [16.55, 0.8, '#fff'], [43.45, 0.4, '#dfe8f0'], [45.72, 0.7, '#fff3c4'], [59.71, 0.5, '#fff']];

/* palette */
const GREY = '#8a96a3', RED = '#c8102e', NAVY = '#0b1a3a';
const Txt: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = '#fff', style}) => (
  <div style={{fontFamily: 'HeroBlack', fontSize: size, color, letterSpacing: -size * 0.02, lineHeight: 1, ...style}}>{children}</div>
);
const GT: React.CSSProperties = {backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 5px 12px rgba(30,0,20,.55))'};
const Rain: React.FC<{n?: number; op?: number}> = ({n = 70, op = 0.5}) => {
  const fr = useCurrentFrame();
  return <>{Array.from({length: n}).map((_, i) => <div key={i} style={{position: 'absolute', left: rnd(i) * W, top: ((rnd(i + 3) * H + fr * (40 + rnd(i) * 20)) % (H + 200)) - 200,
    width: 3, height: 90, background: `rgba(220,230,240,${op})`, transform: 'rotate(12deg)'}} />)}</>;
};

/* ---------- recurring: RULE plate (UK number-plate style) + 6-dot progress (open loop) ---------- */
const RuleHud: React.FC = () => {
  const fr = useCurrentFrame();
  const t = fr / 30;
  const cur = [...RULES].reverse().find(([, s]) => t >= s);
  if (!cur || t > 61.88) return null;
  const [n, s] = cur;
  const lf = fr - f(s);
  const p = pop(lf, 8, 1.6);
  return (
    <>
      <div style={{position: 'absolute', left: 50, top: 70, opacity: p.o, transform: `scale(${p.s}) rotate(-3deg)`, transformOrigin: 'left top',
        background: '#ffd000', border: '6px solid #111', borderRadius: 14, padding: '6px 24px 4px', boxShadow: '0 12px 30px rgba(0,0,0,.45)'}}>
        <Txt size={70} color="#111" style={{letterSpacing: 2}}>RULE {n}<span style={{fontSize: 40, opacity: 0.6}}>/6</span></Txt>
      </div>
      <div style={{position: 'absolute', right: 50, top: 92, display: 'flex', gap: 12}}>
        {[1, 2, 3, 4, 5, 6].map((k) => <div key={k} style={{width: 26, height: 26, borderRadius: 13, background: k < n ? '#ff5c9e' : k === n ? '#fff' : 'rgba(255,255,255,.25)',
          boxShadow: k === n ? '0 0 16px #fff' : 'none', transform: `scale(${k === n ? p.s : 1})`}} />)}
      </div>
    </>
  );
};

/* ============ 1 · phone box on a neon beach — FPV DRONE DIVE ============ */
const PhoneBoxBeach: React.FC<{dur: number}> = ({dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const p = lerp(fr, 0, T, 0, 1, Easing.inOut(Easing.cubic));
  const a = p * 1.6;
  const cam = [Math.sin(a) * (6 - p * 2.6), 7.5 - p * 6.3, Math.cos(a) * (6 - p * 2.6) + 1];
  const box = useTex('pb', 256, 512, (g, w, h) => {
    g.fillStyle = RED; g.fillRect(0, 0, w, h); g.fillStyle = '#fff6c8'; for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) g.fillRect(34 + c * 66, 110 + r * 62, 56, 52);
    g.fillStyle = '#111'; g.fillRect(30, 30, w - 60, 50); g.fillStyle = '#fff'; g.font = '40px HeroBlack'; g.textAlign = 'center'; g.fillText('TELEPHONE', w / 2, 70);
  });
  const sky = useTex('skyb', 64, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1a0b3a'); gr.addColorStop(0.45, '#b1186f'); gr.addColorStop(0.7, '#ff7a4a'); gr.addColorStop(1, '#ffd48a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const palms = [[-3, -2, 6.5], [3.5, -3, 7.5], [-4.5, 2, 5.8], [4, 2.5, 6.2]];
  return (
    <Stage bg="#1a0b3a" fog={['#ff7a8a', 12, 40]}>
      <Rig pos={cam} look={[0, 1.2 - p * 0.2, 0]} fov={62} up={[Math.sin(fr * 0.05) * 0.15 * (1 - p), 1, 0]} />
      <mesh><sphereGeometry args={[80, 32, 32]} /><meshBasicMaterial map={sky} side={THREE.BackSide} fog={false} /></mesh>
      <ambientLight intensity={0.55} color="#ffb4d0" />
      <directionalLight position={[-6, 3, -8]} intensity={2.4} color="#ff9a5a" />
      <pointLight position={[0, 1.6, 0.8]} intensity={6} distance={4} color="#fff2b0" />
      <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[80, 80]} /><meshStandardMaterial color="#e8b98a" roughness={0.95} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -14]}><planeGeometry args={[80, 18]} /><meshStandardMaterial color="#1f6f8a" metalness={0.3} roughness={0.2} emissive="#ff4f9e" emissiveIntensity={0.15} /></mesh>
      <mesh position={[0, 1.25, 0]}><boxGeometry args={[0.95, 2.5, 0.95]} /><meshStandardMaterial map={box} roughness={0.5} /></mesh>
      <mesh position={[0, 2.62, 0]}><boxGeometry args={[1.05, 0.25, 1.05]} /><meshStandardMaterial color={RED} /></mesh>
      {palms.map(([x, z, h], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, h / 2, 0]} rotation={[0, 0, (i % 2 ? 1 : -1) * 0.08]}><cylinderGeometry args={[0.12, 0.18, h, 10]} /><meshStandardMaterial color="#5a3a24" /></mesh>
          {Array.from({length: 9}).map((_, k) => <mesh key={k} position={[0, h, 0]} rotation={[0, (k / 9) * Math.PI * 2, 0]}><mesh position={[1.1, -0.3, 0]} rotation={[0, 0, -0.45]}><boxGeometry args={[2.3, 0.03, 0.36]} /><meshStandardMaterial color="#1f5a32" /></mesh></mesh>)}
        </group>
      ))}
    </Stage>
  );
};

/* ============ 2 · passport stamp DEPORTED — WIPE-BY ============ */
const Passport: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const hit = f(at('DEPORTED') - start);
  const arm = interpolate(fr, [hit - 8, hit - 1, hit + 1, hit + 9], [-1400, 0, 0, 1500], {...cl, easing: Easing.inOut(Easing.quad)});
  const stamped = fr >= hit;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 20%, #e8ecef, #8f9aa3 80%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 120, top: 520, width: 840, height: 1100, background: '#f3efe2', borderRadius: 18, transform: 'rotate(-4deg)', boxShadow: '0 30px 70px rgba(0,0,0,.35)', padding: 60, boxSizing: 'border-box'}}>
        <div style={{fontFamily: 'UIBold', fontSize: 32, color: '#7a6a8a', letterSpacing: 3}}>VISAS · ENTRY STAMPS</div>
        {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 80 + i * 230, top: 180 + (i % 2) * 140, width: 190, height: 120, border: '5px solid rgba(40,80,160,.35)', borderRadius: 60, transform: `rotate(${i * 9 - 6}deg)`}} />)}
        {stamped && <div style={{position: 'absolute', left: 120, top: 470, transform: `rotate(-12deg) scale(${pop(fr - hit, 4, 1.4).s})`, border: `12px solid ${RED}`, borderRadius: 20, padding: '10px 40px',
          fontFamily: 'HeroBlack', fontSize: 130, color: RED, opacity: 0.88, mixBlendMode: 'multiply'}}>DEPORTED</div>}
      </div>
      <div style={{position: 'absolute', left: 640, top: 1440, width: 320, height: 420, background: '#5a0f22', borderRadius: 18, transform: 'rotate(8deg)', boxShadow: '0 20px 50px rgba(0,0,0,.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><Txt size={34} color="#e8c46a">UNITED<br />KINGDOM<br /><span style={{fontSize: 28}}>PASSPORT</span></Txt></div>
      {/* the stamp arm wiping across the lens */}
      <div style={{position: 'absolute', left: -200, right: -200, top: 640, height: 520, transform: `translateX(${arm}px) rotate(-6deg)`, filter: `blur(${Math.abs(arm) > 50 ? 16 : 3}px)`}}>
        <div style={{position: 'absolute', left: 600, top: 0, width: 280, height: 520, borderRadius: 40, background: 'linear-gradient(90deg,#1a1a1d,#3a3a40,#1a1a1d)'}} />
        <div style={{position: 'absolute', left: 520, top: 380, width: 440, height: 140, borderRadius: 18, background: '#2a2a30'}} />
      </div>
      <Title shotStart={start} y={0.165} size={110} lines={[[{w: 'number', t: at('NUMBER')}, {w: '4', t: at('FOUR'), accent: true}], [{w: 'gets', t: at('WILL', 5)}, {w: 'you', t: at('YOU', 5.7)}, {w: 'deported.', t: at('DEPORTED')}]]} />
    </AbsoluteFill>
  );
};

/* ============ 3 · the perfect queue at the gun shop — HYPERLAPSE STEP ============ */
const Queue: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const step = Math.floor(fr / 6);
  const x = -step * 150 - interpolate(fr % 6, [0, 2, 6], [0, 130, 150], cl);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#1b0d2a,#3a1440 55%,#151018)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: x, top: 0, width: 4000, height: H}}>
        <div style={{position: 'absolute', left: 2400, top: 300, padding: '20px 50px', border: '10px solid #ff3da6', borderRadius: 20, boxShadow: '0 0 60px #ff3da6, inset 0 0 40px #ff3da6'}}>
          <Txt size={130} color="#ffd8ef" style={{textShadow: '0 0 30px #ff3da6'}}>GUN SHOP</Txt>
        </div>
        <div style={{position: 'absolute', left: 0, top: 1420, width: 4000, height: 500, background: 'linear-gradient(180deg,#2a2230,#120d16)'}} />
        {Array.from({length: 16}).map((_, i) => {
          const px = 2350 - i * 150;
          return (
            <div key={i} style={{position: 'absolute', left: px, top: 900 + (i % 3) * 6}}>
              <div style={{position: 'absolute', left: 20, top: 0, width: 80, height: 80, borderRadius: 40, background: ['#f0c8a8', '#c8946a', '#8a5a3a', '#f4d4b8'][i % 4]}} />
              <div style={{position: 'absolute', left: 0, top: 90, width: 120, height: 330, borderRadius: '40px 40px 10px 10px', background: [GREY, NAVY, '#5a3a2a', '#2f4a2a'][i % 4]}} />
              {i % 3 === 0 && <div style={{position: 'absolute', left: -60, top: -20, width: 220, height: 60, borderRadius: '110px 110px 0 0', background: '#111'}} />}
              <div style={{position: 'absolute', left: 30, top: 420, width: 26, height: 100, background: '#1a1a22'}} /><div style={{position: 'absolute', left: 66, top: 420, width: 26, height: 100, background: '#1a1a22'}} />
            </div>
          );
        })}
        {Array.from({length: 18}).map((_, i) => <div key={i} style={{position: 'absolute', left: i * 150 - 20, top: 1220, width: 14, height: 200, background: '#c9a24a'}} />)}
        <div style={{position: 'absolute', left: 0, top: 1240, width: 2600, height: 14, background: RED}} />
      </div>
      <Title shotStart={start} y={0.8} size={120} lines={[[{w: "don't", t: at("DON'T", 7.3)}, {w: 'queue', t: at('QUEUE'), accent: true}], [{w: 'at', t: at('AT', 8.1)}, {w: 'the', t: at('THE', 8.3)}, {w: 'gun', t: at('GUNSHOP')}, {w: 'shop.', t: at('GUNSHOP') + 0.12}]]} />
    </AbsoluteFill>
  );
};

/* ============ 4 · "Bruv, nobody's queuing" — COMIC PANEL HOP ============ */
const Comic: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const panels = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}];
  const k = fr < f(at('NOBODY\'S') - start) ? 0 : fr < f(at('QUEUING') - start) ? 1 : 2;
  const prev = Math.max(0, k - 1);
  const hopT = fr - f([CUT[3], at("NOBODY'S"), at('QUEUING')][k] - start);
  const e = interpolate(hopT, [0, 5], [0, 1], {...cl, easing: Easing.out(Easing.cubic)});
  const cx = (panels[prev].x + (panels[k].x - panels[prev].x) * e), cy = (panels[prev].y + (panels[k].y - panels[prev].y) * e);
  const PW = 980, PH = 1300;
  return (
    <AbsoluteFill style={{background: '#fff9e6', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 50 - cx * (PW + 40), top: 300 - cy * (PH + 40), transform: `scale(1)`}}>
        {[['#7ad0ff', 'BRUV,'], ['#ffb84a', "NOBODY'S"], ['#ff6fa8', 'QUEUING.']].map(([c, word], i) => (
          <div key={i} style={{position: 'absolute', left: panels[i].x * (PW + 40), top: panels[i].y * (PH + 40), width: PW, height: PH, border: '12px solid #111', background: c, overflow: 'hidden',
            backgroundImage: `radial-gradient(rgba(0,0,0,.18) 22%, transparent 24%)`, backgroundSize: '26px 26px'}}>
            <div style={{position: 'absolute', left: 300, top: 560, width: 380, height: 380, borderRadius: 190, background: '#f2c9a4', border: '10px solid #111'}} />
            <div style={{position: 'absolute', left: 380, top: 680, width: 50, height: 50, borderRadius: 25, background: '#111'}} /><div style={{position: 'absolute', left: 540, top: 680, width: 50, height: 50, borderRadius: 25, background: '#111'}} />
            <div style={{position: 'absolute', left: 400, top: 830, width: 180, height: 20, background: '#111', transform: `rotate(${i === 2 ? -8 : 4}deg)`}} />
            <div style={{position: 'absolute', left: 60, top: 80, padding: '30px 50px', background: '#fff', border: '10px solid #111', borderRadius: 60, transform: 'rotate(-3deg)'}}>
              <Txt size={150} color="#111">{word}</Txt>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ============ 5 · rocket launcher, zero patience — SCOPE POV ============ */
const Scope: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const sx = lerp(fr, 0, T * 0.5, 380, 0, Easing.inOut(Easing.cubic)) + Math.sin(fr * 0.18) * 14;
  const sy = lerp(fr, 0, T * 0.5, 240, 0, Easing.inOut(Easing.cubic)) + Math.sin(fr * 0.13 + 1) * 10;
  const pat = lerp(fr, f(at('ZERO') - start) - 6, f(at('PATIENCE') - start), 100, 0, Easing.in(Easing.quad));
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${sx}px,${sy}px) scale(1.25)`}}>
        <AbsoluteFill style={{background: 'linear-gradient(180deg,#2a1440,#5a1a4a 50%,#1a1018)'}} />
        <div style={{position: 'absolute', left: 300, top: 560, width: 480, height: 1100}}>
          <div style={{position: 'absolute', left: 150, top: 0, width: 180, height: 180, borderRadius: 90, background: '#8a5a3a'}} />
          <div style={{position: 'absolute', left: 140, top: 50, width: 200, height: 40, background: '#111'}} />
          <div style={{position: 'absolute', left: 60, top: 190, width: 360, height: 560, borderRadius: '80px 80px 20px 20px', background: '#2b2f3a'}} />
          <div style={{position: 'absolute', left: -260, top: 160, width: 900, height: 110, borderRadius: 40, background: 'linear-gradient(180deg,#5a6a3a,#3a4a22)', transform: 'rotate(-6deg)'}} />
          <div style={{position: 'absolute', left: -300, top: 150, width: 90, height: 140, borderRadius: 20, background: '#222'}} />
        </div>
        <div style={{position: 'absolute', left: 260, top: 360, width: 560, padding: 18, borderRadius: 16, background: 'rgba(10,10,14,.75)'}}>
          <Txt size={40} style={{letterSpacing: 2}}>PATIENCE</Txt>
          <div style={{marginTop: 12, height: 34, borderRadius: 17, background: '#333'}}><div style={{width: `${pat}%`, height: 34, borderRadius: 17, background: pat > 30 ? '#4ad66a' : RED}} /></div>
          <Txt size={56} color={pat > 30 ? '#4ad66a' : RED} style={{marginTop: 10}}>{Math.round(pat)}%</Txt>
        </div>
      </AbsoluteFill>
      {/* scope mask + reticle */}
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, transparent 0 400px, rgba(0,0,0,.85) 404px, #000 470px)'}} />
      <div style={{position: 'absolute', left: W / 2 - 2, top: H / 2 - 400, width: 4, height: 800, background: 'rgba(255,40,40,.85)'}} />
      <div style={{position: 'absolute', left: W / 2 - 400, top: H / 2 - 2, width: 800, height: 4, background: 'rgba(255,40,40,.85)'}} />
      <div style={{position: 'absolute', left: W / 2 - 30, top: H / 2 - 30, width: 60, height: 60, borderRadius: 30, border: '4px solid rgba(255,40,40,.85)'}} />
      <Title shotStart={start} y={0.165} size={92} lines={[[{w: 'rocket', t: at('ROCKET')}, {w: 'launcher.', t: at('LAUNCHER')}]]} />
      <Title shotStart={start} y={0.9} size={110} lines={[[{w: 'zero', t: at('ZERO')}, {w: 'patience.', t: at('PATIENCE'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 6 · dashcam thud — DASHCAM ============ */
const Dashcam: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const hit = f(16.55 - start);
  const after = fr >= hit;
  const jolt = fr >= hit && fr < hit + 6 ? (rnd(fr) - 0.5) * 40 : 0;
  const speed = 0.9;
  return (
    <AbsoluteFill style={{background: '#04040a', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${jolt}px,${jolt * 0.7}px)`}}>
        <AbsoluteFill style={{background: 'linear-gradient(180deg,#0a0820,#2a0d3a 45%,#0a0a10 46%)'}} />
        {/* road in perspective */}
        <div style={{position: 'absolute', left: -800, right: -800, top: 880, height: 1400, background: '#1a1a20', transform: 'perspective(500px) rotateX(70deg)', transformOrigin: 'top', overflow: 'hidden'}}>
          {Array.from({length: 12}).map((_, i) => <div key={i} style={{position: 'absolute', left: '49.5%', width: 30, height: 160, top: ((i * 260 + fr * 48 * speed) % 3120) - 300, background: '#ffe066'}} />)}
        </div>
        {Array.from({length: 10}).map((_, i) => { const z = ((i * 0.1 + fr * 0.03) % 1); const s = 0.2 + z * 3; return (
          <div key={i} style={{position: 'absolute', left: W / 2 + (i % 2 ? 1 : -1) * (80 + z * 1200), top: 880 - 260 * s, width: 30 * s, height: 260 * s, background: i % 2 ? '#ff3da6' : '#3de0ff', boxShadow: `0 0 ${30 * s}px ${i % 2 ? '#ff3da6' : '#3de0ff'}`, opacity: Math.min(1, z * 3)}} />); })}
        {/* windscreen crack */}
        {after && <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>{Array.from({length: 14}).map((_, i) => { const a = (i / 14) * Math.PI * 2; const L = 200 + rnd(i) * 420; return (
          <polyline key={i} points={`540,700 ${540 + Math.cos(a) * L * 0.45},${700 + Math.sin(a) * L * 0.45 + (rnd(i + 3) - 0.5) * 40} ${540 + Math.cos(a) * L},${700 + Math.sin(a) * L}`} stroke="rgba(255,255,255,.85)" strokeWidth={4} fill="none" />); })}
          <circle cx={540} cy={700} r={40} fill="rgba(255,255,255,.35)" /></svg>}
      </AbsoluteFill>
      {/* dash + HUD */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 380, background: 'linear-gradient(180deg,#0d0d12,#050507)', borderTopLeftRadius: '50% 40%', borderTopRightRadius: '50% 40%'}} />
      <div style={{position: 'absolute', left: 50, top: 60, fontFamily: 'UIBold', fontSize: 36, color: '#fff', textShadow: '0 0 6px #000'}}>● DASHCAM · 2026-11-19 · 00:14:{String(Math.floor(fr / 30) + 2).padStart(2, '0')}</div>
      <Title shotStart={start} y={0.83} size={100} lines={[[{w: "don't", t: at("DON'T", 14.9)}, {w: 'apologise', t: at('APOLOGIZE'), accent: true}], [{w: 'after', t: at('AFTER')}, {w: 'you', t: at('YOU', 15.9)}, {w: 'hit', t: at('HIT')}, {w: 'someone.', t: at('SOMEONE')}]]} />
    </AbsoluteFill>
  );
};

/* ============ 7 · 100 down Ocean Drive — CABLE-CAM ============ */
const CableCam: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const dx = lerp(fr, 0, T, 0, -900, Easing.linear), dy = lerp(fr, 0, T, -300, 250, Easing.linear);
  const mph = Math.round(lerp(fr, 0, f(at('HUNDRED') - start) + 4, 61, 100, Easing.out(Easing.cubic)));
  const needle = -120 + (mph / 140) * 240;
  return (
    <AbsoluteFill style={{background: '#0b0716', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${dx}px,${dy}px) rotate(-14deg) scale(1.5)`}}>
        {Array.from({length: 60}).map((_, i) => <div key={i} style={{position: 'absolute', left: ((rnd(i) * 3000 - fr * 120 * (1 + rnd(i + 1))) % 3000 + 3000) % 3000 - 600, top: rnd(i + 2) * 2400 - 300,
          width: 300 + rnd(i + 3) * 500, height: 6 + rnd(i + 4) * 8, borderRadius: 4, background: ['#ff3da6', '#3de0ff', '#ffd36b', '#fff'][i % 4], opacity: 0.7, boxShadow: `0 0 18px ${['#ff3da6', '#3de0ff', '#ffd36b', '#fff'][i % 4]}`}} />)}
        <div style={{position: 'absolute', left: 900 - dx * 0.66, top: 1200 - dy * 0.66, width: 640, height: 200}}>
          <div style={{position: 'absolute', left: 0, top: 60, width: 640, height: 110, borderRadius: '40px 80px 20px 20px', background: 'linear-gradient(180deg,#ff5c9e,#a8195a)'}} />
          <div style={{position: 'absolute', left: 160, top: 0, width: 300, height: 90, borderRadius: '60px 80px 0 0', background: '#1a1426'}} />
          <div style={{position: 'absolute', left: 80, top: 140, width: 110, height: 110, borderRadius: 55, background: '#111', border: '10px solid #555'}} /><div style={{position: 'absolute', left: 460, top: 140, width: 110, height: 110, borderRadius: 55, background: '#111', border: '10px solid #555'}} />
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: W / 2 - 230, top: 300, width: 460, height: 460, borderRadius: 230, background: 'radial-gradient(circle,#1a1426,#0a0810)', border: '10px solid #ff5c9e', boxShadow: '0 0 60px rgba(255,90,170,.6)'}}>
        <div style={{position: 'absolute', left: 225, top: 60, width: 10, height: 175, background: '#fff', transformOrigin: '50% 100%', transform: `rotate(${needle}deg)`, borderRadius: 5}} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 70}}><Txt size={110} style={mph >= 100 ? GT : {}}>{mph}</Txt></div>
        <div style={{position: 'absolute', bottom: 30, width: '100%', textAlign: 'center', fontFamily: 'UIBold', fontSize: 30, color: '#aaa'}}>MPH</div>
      </div>
      <Title shotStart={start} y={0.82} size={110} lines={[[{w: 'a', t: at('A', 18.2)}, {w: 'hundred', t: at('HUNDRED'), accent: true}, {w: 'down', t: at('DOWN')}], [{w: 'Ocean', t: at('OCEAN')}, {w: 'Drive.', t: at('DRIVE')}]]} />
    </AbsoluteFill>
  );
};

/* ============ 8 · x-ray + "sorry mate" — MULTIPLANE RISE ============ */
const Xray: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const p = lerp(fr, 0, T, 0, 1, Easing.inOut(Easing.sin));
  const note = pop(fr - f(at('SORRY') - start), 7, 1.5);
  return (
    <AbsoluteFill style={{background: '#06090c', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translateY(${300 - p * 600 * 0.3}px)`}}><AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, #d8f0ff 0%, #6aa0c8 45%, #0a1420 75%)'}} /></AbsoluteFill>
      <div style={{position: 'absolute', left: 290, top: 200 + 400 - p * 600 * 0.7, width: 500, height: 1600}}>
        {Array.from({length: 17}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 170 + (i === 9 ? 26 : 0), top: i * 92, width: 160, height: 70, borderRadius: 22, background: 'rgba(255,255,255,.92)', boxShadow: '0 0 20px rgba(255,255,255,.6)',
            transform: i === 9 ? 'rotate(14deg)' : 'none'}}>
            <div style={{position: 'absolute', left: -60, top: 22, width: 280, height: 24, borderRadius: 12, background: 'rgba(255,255,255,.65)'}} />
          </div>
        ))}
        <svg width={500} height={1600} style={{position: 'absolute', inset: 0}}><polyline points="160,860 230,880 205,895 290,910 260,925 340,940" stroke={RED} strokeWidth={8} fill="none" /></svg>
      </div>
      <div style={{position: 'absolute', left: 560, top: 980 - p * 600 * 1.2 + 500, opacity: note.o, transform: `rotate(6deg) scale(${note.s})`, width: 400, height: 380, background: '#ffe766', boxShadow: '0 20px 40px rgba(0,0,0,.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><Txt size={86} color="#1b1b1b" style={{transform: 'rotate(-4deg) skewX(-8deg)'}}>sorry<br />mate</Txt></div>
      <Title shotStart={start} y={0.165} size={100} lines={[[{w: "isn't", t: at("ISN'T")}, {w: 'fixing', t: at('FIXING')}], [{w: 'his', t: at('HIS')}, {w: 'spine.', t: at('SPINE'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 9 · zebra crossing + Belisha beacons — FISHEYE SKATE ============ */
const Zebra: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const blink = Math.floor(fr / 10) % 2 === 0;
  const off = fr * 34;
  return (
    <AbsoluteFill style={{background: '#9aa4ae', overflow: 'hidden'}}>
      <AbsoluteFill style={{borderRadius: '50%', transform: 'scale(1.45)', overflow: 'hidden'}}>
        <AbsoluteFill style={{background: 'linear-gradient(180deg,#b9c2ca,#8a96a3 50%,#3a3f44 52%)'}} />
        <div style={{position: 'absolute', left: -600, right: -600, top: 980, height: 1600, transform: 'perspective(420px) rotateX(74deg)', transformOrigin: 'top', background: '#3a3d42', overflow: 'hidden'}}>
          {Array.from({length: 14}).map((_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, height: 120, top: ((i * 240 + off) % 3360) - 240, background: '#f4f4f0'}} />)}
        </div>
        {[-1, 1].map((s) => (
          <div key={s} style={{position: 'absolute', left: W / 2 + s * 300 - 30, top: 640}}>
            <div style={{position: 'absolute', left: 18, top: 120, width: 26, height: 560, background: 'repeating-linear-gradient(180deg,#111 0 50px,#f4f4f0 50px 100px)'}} />
            <div style={{position: 'absolute', left: -30, top: 0, width: 120, height: 120, borderRadius: 60, background: blink ? '#ff9a1f' : '#7a4a1a', boxShadow: blink ? '0 0 90px 30px rgba(255,154,31,.7)' : 'none'}} />
          </div>
        ))}
        <Rain n={50} op={0.35} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(circle, transparent 55%, rgba(0,0,0,.6) 80%)'}} />
      <Title shotStart={start} y={0.83} size={110} lines={[[{w: "don't", t: at("DON'T", 22.7)}, {w: 'stop', t: at('STOP')}, {w: 'at', t: at('AT', 23.5)}, {w: 'the', t: at('THE', 23.7)}], [{w: 'zebra', t: at('ZEBRA'), accent: true}, {w: 'crossing.', t: at('CROSSING')}]]} />
    </AbsoluteFill>
  );
};

/* ============ 10 · "There's no zebra crossing" — SPEED RAMP ============ */
const NoZebra: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  // speed ramp: fast (x4) -> slow-mo (x0.25) on "NO" -> fast again
  const ramp = (t: number) => (t < 10 ? t * 4 : t < 30 ? 40 + (t - 10) * 0.25 : 45 + (t - 30) * 4);
  const tt = ramp(fr);
  const peel = lerp(fr, 10, 34, 0, 1, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill style={{background: '#ffd9a0', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#58b8ff,#bfe6ff 45%,#ffe0b0 50%)'}} />
      <div style={{position: 'absolute', left: -600, right: -600, top: 960, height: 1600, transform: 'perspective(420px) rotateX(72deg)', transformOrigin: 'top', background: '#2e2e33', overflow: 'hidden'}}>
        {Array.from({length: 14}).map((_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, height: 120, top: ((i * 240 + tt * 30) % 3360) - 240, background: '#f4f4f0',
          transform: `translateX(${peel * (i % 2 ? 2600 : -2600) * rnd(i + 1)}px) rotate(${peel * 30 * (i % 2 ? 1 : -1)}deg)`, opacity: 1 - peel * 0.6}} />)}
      </div>
      {Array.from({length: 6}).map((_, i) => <div key={i} style={{position: 'absolute', left: 120 + i * 160, top: 760 - (i % 2) * 40, width: 26, height: 260, background: '#2a5a2a', borderRadius: 10}} />)}
      <AbsoluteFill style={{background: fr >= 10 && fr < 30 ? 'rgba(255,255,255,.08)' : 'transparent', backdropFilter: fr >= 10 && fr < 30 ? 'none' : 'blur(0px)'}} />
      <div style={{position: 'absolute', right: 50, top: 70, fontFamily: 'UIBold', fontSize: 40, color: '#111', background: 'rgba(255,255,255,.75)', padding: '8px 18px', borderRadius: 10}}>{fr < 10 ? '×4' : fr < 30 ? '×0.25' : '×4'}</div>
      <Title shotStart={start} y={0.2} size={120} lines={[[{w: "there's", t: at("THERE'S", 24.8)}, {w: 'no', t: at('NO', 25), accent: true}], [{w: 'zebra', t: at('ZEBRA', 25.2)}, {w: 'crossing.', t: at('CROSSING', 25.6)}]]} />
    </AbsoluteFill>
  );
};

/* ============ 11 · croc vs man filming — SPLIT-SCREEN SLIDE ============ */
const CrocSplit: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const top = lerp(fr, 0, 8, -H / 2, 0, Easing.out(Easing.cubic)), bot = lerp(fr, f(at('MAN', 28) - start) - 8, f(at('MAN', 28) - start), H / 2, 0, Easing.out(Easing.cubic));
  const croc = fr * 1.2;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: top, width: W, height: H / 2, overflow: 'hidden', background: 'linear-gradient(180deg,#7fd0ff,#cdeeff 40%,#3a3a3e 41%)'}}>
        <div style={{position: 'absolute', left: 120 + croc, top: 560, width: 760, height: 150}}>
          <div style={{position: 'absolute', left: 0, top: 40, width: 620, height: 90, borderRadius: '45px 20px 20px 45px', background: '#3e6b2a', boxShadow: 'inset 0 -20px 0 #2d5020'}} />
          <div style={{position: 'absolute', left: 560, top: 60, width: 220, height: 60, borderRadius: '10px 40px 40px 10px', background: '#3e6b2a'}} />
          {Array.from({length: 9}).map((_, i) => <div key={i} style={{position: 'absolute', left: 600 + i * 18, top: 100, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '16px solid #fff'}} />)}
          {Array.from({length: 10}).map((_, i) => <div key={i} style={{position: 'absolute', left: 60 + i * 52, top: 22, width: 30, height: 26, borderRadius: 6, background: '#2d5020'}} />)}
          {[60, 420].map((x, i) => <div key={i} style={{position: 'absolute', left: x, top: 116, width: 60, height: 40, background: '#2d5020', transform: `rotate(${Math.sin(fr * 0.4 + i) * 20}deg)`}} />)}
        </div>
        <div style={{position: 'absolute', left: 40, top: 40, padding: '8px 20px', background: '#111', color: '#fff', fontFamily: 'HeroBlack', fontSize: 44}}>🐊 ON THE ROAD</div>
      </div>
      <div style={{position: 'absolute', left: 0, top: H / 2 + bot, width: W, height: H / 2, overflow: 'hidden', background: 'linear-gradient(180deg,#ffd9a0,#e8b98a)'}}>
        <div style={{position: 'absolute', left: 230, top: 140, width: 620, height: 820, borderRadius: 50, background: '#111', padding: 18, boxSizing: 'border-box', transform: 'rotate(-6deg)'}}>
          <div style={{width: '100%', height: '100%', borderRadius: 36, background: 'linear-gradient(180deg,#7fd0ff,#3a3a3e)', position: 'relative', overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 120, top: 380, width: 330, height: 60, borderRadius: 30, background: '#3e6b2a'}} />
            <div style={{position: 'absolute', left: 24, top: 24, fontFamily: 'UIBold', fontSize: 34, color: '#ff3b3b'}}>● REC 00:{String(Math.floor(fr / 30) + 12).padStart(2, '0')}</div>
          </div>
        </div>
        <div style={{position: 'absolute', left: 60, top: 40, padding: '8px 20px', background: '#111', color: '#fff', fontFamily: 'HeroBlack', fontSize: 44}}>🩴 MAN IN A THONG</div>
      </div>
      <div style={{position: 'absolute', left: 0, top: H / 2 - 6, width: W, height: 12, background: '#fff', opacity: bot < 10 ? 1 : 0}} />
    </AbsoluteFill>
  );
};

/* ============ 12 · inside the teacup — INSIDE-OBJECT CAM ============ */
const TeaCup: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const r = Math.sin(fr * 0.05) * 6;
  const ripple = (fr % 40) / 40;
  return (
    <AbsoluteFill style={{background: '#3a1c0c', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `rotate(${r}deg) scale(1.1)`}}>
        {/* looking up from the surface of the tea: the rim is a circle, neon bar ceiling beyond */}
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, #ff3da6 0 90px, #3de0ff 160px, #2a0d3a 330px, transparent 380px)'}} />
        <div style={{position: 'absolute', left: W / 2 - 420, top: H * 0.46 - 420, width: 840, height: 840, borderRadius: 420, border: '70px solid #f6f2ec', boxShadow: 'inset 0 0 0 14px #2a5aa8, inset 0 0 80px rgba(0,0,0,.4)'}} />
        <div style={{position: 'absolute', left: W / 2 - 520, top: H * 0.46 - 520, width: 1040, height: 1040, borderRadius: 520, border: `6px solid rgba(255,255,255,${0.4 * (1 - ripple)})`, transform: `scale(${0.6 + ripple * 0.5})`}} />
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, transparent 430px, rgba(120,60,20,.92) 500px)'}} />
        {Array.from({length: 4}).map((_, i) => <div key={i} style={{position: 'absolute', left: W / 2 - 40 + Math.sin(fr * 0.06 + i) * 120, top: 300 - ((fr * 2 + i * 60) % 260), width: 80, height: 200, borderRadius: 40, background: 'rgba(255,255,255,.18)', filter: 'blur(14px)'}} />)}
      </AbsoluteFill>
      <Title shotStart={start} y={0.84} size={104} lines={[[{w: "don't", t: at("DON'T", 29.9)}, {w: 'ask', t: at('ASK')}, {w: 'for', t: at('FOR', 30.8)}, {w: 'a', t: at('A', 31)}], [{w: 'cup', t: at('CUP')}, {w: 'of', t: at('OF', 31.3)}, {w: 'tea.', t: at('TEA'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 13 · iced coffee the size of your nan — FORCED-PERSPECTIVE BREAK ============ */
const IcedCoffee: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const brk = f(at('NAN') - start) - 10;
  const p = lerp(fr, brk, brk + 14, 0, 1, Easing.inOut(Easing.cubic));
  const nanX = 640 - p * 180, nanS = 1.8 - p * 0.9, cupS = 0.55 + p * 0.55;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#fff6e8,#f2d9b8 60%,#c99b72 61%,#a87b52)', overflow: 'hidden'}}>
      {/* the nan: starts close to the lens (looks huge), steps back to true scale */}
      <div style={{position: 'absolute', left: nanX, top: 1640 - 900 * nanS, width: 360 * nanS / 1.8, height: 900 * nanS / 1.8 * 1.8, transformOrigin: 'bottom'}}>
        <div style={{position: 'absolute', left: '28%', top: 0, width: '44%', aspectRatio: '1', borderRadius: '50%', background: '#e8c4a8', boxShadow: '0 -30px 0 10px #d9d9de'}} />
        <div style={{position: 'absolute', left: '10%', top: '22%', width: '80%', height: '60%', borderRadius: '40% 40% 10% 10%', background: '#7a5a8a'}} />
        <div style={{position: 'absolute', left: '-4%', top: '50%', width: '34%', height: '20%', borderRadius: 16, background: '#5a2a2a'}} />
      </div>
      {/* the cup: starts far (looks small), reveals true scale (taller than nan) */}
      <div style={{position: 'absolute', left: 120, bottom: 280, width: 420 * cupS, height: 1200 * cupS, transformOrigin: 'bottom left'}}>
        <div style={{position: 'absolute', inset: 0, clipPath: 'polygon(0 0,100% 0,88% 100%,12% 100%)', background: 'linear-gradient(180deg, rgba(255,255,255,.4), rgba(255,255,255,.15))'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: '22%', bottom: 0, clipPath: 'polygon(0 0,100% 0,88% 100%,12% 100%)', background: 'linear-gradient(180deg,#d9b48a,#8a5a32)'}} />
        {Array.from({length: 7}).map((_, i) => <div key={i} style={{position: 'absolute', left: `${18 + (i % 3) * 22}%`, top: `${26 + i * 8}%`, width: '20%', aspectRatio: '1', background: 'rgba(255,255,255,.55)', borderRadius: 8, transform: `rotate(${i * 23}deg)`}} />)}
        <div style={{position: 'absolute', left: '58%', top: '-18%', width: '8%', height: '40%', background: '#ff3da6', transform: 'rotate(10deg)'}} />
      </div>
      {p > 0.9 && <div style={{position: 'absolute', left: 560, top: 380, fontFamily: 'UIBold', fontSize: 40, color: '#5a3a1a'}}>↕ actual size</div>}
      <Title shotStart={start} y={0.165} size={96} lines={[[{w: 'iced', t: at('ICED'), accent: true}, {w: 'coffee', t: at('COFFEE')}], [{w: 'the', t: at('THE', 34)}, {w: 'size', t: at('SIZE')}, {w: 'of', t: at('OF', 34.5)}, {w: 'your', t: at('YOUR', 34.6)}, {w: 'nan.', t: at('NAN')}]]} />
    </AbsoluteFill>
  );
};

/* ============ 14 · "You will cry." teabag — STOP-MOTION (on 3s) ============ */
const Teabag: React.FC<{start: number}> = ({start}) => {
  const fr0 = useCurrentFrame();
  const fr = Math.floor(fr0 / 3) * 3;                     // animated on threes
  const jit = (rnd(fr) - 0.5) * 8;
  const tearY = lerp(fr, 6, 30, 0, 260, Easing.in(Easing.quad));
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#c7d0d8,#9aa4ae)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: W / 2 - 3, top: 0, width: 6, height: 520, background: '#efe6d0', transform: `rotate(${jit * 0.3}deg)`}} />
      <div style={{position: 'absolute', left: W / 2 - 60, top: 470, width: 120, height: 90, background: '#ff3d8f', transform: `rotate(${jit * 0.3}deg)`}} />
      <div style={{position: 'absolute', left: W / 2 - 280 + jit, top: 580, width: 560, height: 640, borderRadius: 40, background: 'radial-gradient(circle at 40% 30%, #f4ead2, #d8c49a)', boxShadow: 'inset 0 0 60px rgba(120,80,30,.4)'}}>
        <div style={{position: 'absolute', left: 140, top: 220, width: 70, height: 26, borderRadius: 13, background: '#3a2a1a', transform: 'rotate(12deg)'}} />
        <div style={{position: 'absolute', left: 350, top: 220, width: 70, height: 26, borderRadius: 13, background: '#3a2a1a', transform: 'rotate(-12deg)'}} />
        <div style={{position: 'absolute', left: 200, top: 430, width: 160, height: 80, borderRadius: '80px 80px 0 0', border: '12px solid #3a2a1a', borderBottom: 'none'}} />
        <div style={{position: 'absolute', left: 168, top: 270 + tearY, width: 36, height: 54, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: 'radial-gradient(circle at 35% 35%, #fff, #8fd0ff)', opacity: tearY < 250 ? 1 : 0}} />
      </div>
      <Title shotStart={start} y={0.165} size={170} lines={[[{w: 'you', t: at('YOU', 35.4)}, {w: 'will', t: at('WILL', 35.7)}], [{w: 'cry.', t: at('CRY'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 15 · heist corkboard — VORTEX SPIRAL ============ */
const Corkboard: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const rot = lerp(fr, 0, T, -40, 12, Easing.inOut(Easing.cubic));
  const sc = lerp(fr, 0, T, 0.55, 1.35, Easing.inOut(Easing.cubic));
  const pins = [[200, 520], [760, 420], [480, 900], [820, 1180], [240, 1300], [600, 1560]];
  const string = lerp(fr, 4, T - 20, 0, 1);
  return (
    <AbsoluteFill style={{background: '#120a06', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `rotate(${rot}deg) scale(${sc})`, transformOrigin: '50% 55%'}}>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #c8945a, #8a5a2a 70%)', backgroundImage: 'radial-gradient(rgba(0,0,0,.12) 18%, transparent 20%)', backgroundSize: '14px 14px'}} />
        {[['SAUSAGE ROLL', '#e8b46a'], ['OPENS 7:00 AM', '#fff'], ['THE TARGET', '#e8b46a'], ['ESCAPE: BUS 64', '#bfe6ff'], ['GETAWAY PASTY', '#e8b46a'], ['HEIST #1', '#ffd6e8']].map(([lbl, c], i) => (
          <div key={i} style={{position: 'absolute', left: pins[i][0] - 140, top: pins[i][1] - 60, width: 280, height: 300, background: '#fafafa', padding: 14, boxSizing: 'border-box', transform: `rotate(${(rnd(i) - 0.5) * 16}deg)`, boxShadow: '0 12px 24px rgba(0,0,0,.45)'}}>
            <div style={{height: 200, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {i % 2 === 0 ? <div style={{width: 180, height: 80, borderRadius: 40, background: 'linear-gradient(180deg,#f2c27a,#c8843a)', boxShadow: 'inset 0 -12px 0 #a8642a'}} /> : <Txt size={44} color="#111" style={{textAlign: 'center'}}>{i === 1 ? '7:00' : i === 3 ? '🚌' : '?'}</Txt>}
            </div>
            <div style={{fontFamily: 'UIBold', fontSize: 28, color: '#222', marginTop: 12, textAlign: 'center'}}>{lbl}</div>
          </div>
        ))}
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          <polyline points={pins.map(([x, y]) => `${x},${y - 60}`).join(' ')} stroke={RED} strokeWidth={6} fill="none" strokeDasharray={4000} strokeDashoffset={4000 * (1 - string)} />
          {pins.map(([x, y], i) => <circle key={i} cx={x} cy={y - 60} r={14} fill={RED} />)}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,.7) 90%)'}} />
      <Title shotStart={start} y={0.84} size={96} lines={[[{w: 'your', t: at('YOUR', 38.4)}, {w: 'first', t: at('FIRST', 38.6)}, {w: 'heist', t: at('HEIST'), accent: true}], [{w: 'around', t: at('AROUND')}, {w: 'opening', t: at('OPENING')}, {w: 'hours.', t: at('HOURS')}]]} />
    </AbsoluteFill>
  );
};

/* ============ 16 · "Doesn't exist over there." — LAYER EXPLODE ============ */
const ShopGone: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const ex = lerp(fr, 6, f(dur), 0, 1, Easing.in(Easing.cubic));
  const layer = (z: number, child: React.ReactNode) => (
    <AbsoluteFill style={{transform: `perspective(1200px) translateZ(${ex * z}px)`, opacity: 1 - ex * 0.9}}>{child}</AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#58b8ff,#ffe0b0)', overflow: 'hidden'}}>
      {layer(200, <div style={{position: 'absolute', left: 90, top: 520, width: 900, height: 1000, background: '#2a4a8a'}} />)}
      {layer(500, <div style={{position: 'absolute', left: 130, top: 600, width: 820, height: 160, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Txt size={90} color="#2a4a8a">BAKERY</Txt></div>)}
      {layer(800, <div style={{position: 'absolute', left: 170, top: 820, width: 740, height: 560, background: 'linear-gradient(180deg,#ffe8c0,#f2c27a)', display: 'flex', flexWrap: 'wrap', gap: 20, padding: 30, boxSizing: 'border-box'}}>
        {Array.from({length: 8}).map((_, i) => <div key={i} style={{width: 150, height: 70, borderRadius: 35, background: 'linear-gradient(180deg,#f2c27a,#c8843a)'}} />)}</div>)}
      {layer(1200, <div style={{position: 'absolute', left: 300, top: 1100, padding: '18px 40px', background: RED, transform: 'rotate(-6deg)'}}><Txt size={64}>CLOSED</Txt></div>)}
      <div style={{position: 'absolute', top: 760, width: W, textAlign: 'center', opacity: ex}}><Txt size={110} color="#111">404</Txt><Txt size={56} color="#333" style={{marginTop: 10}}>bakery not found</Txt></div>
      <Title shotStart={start} y={0.165} size={110} lines={[[{w: "doesn't", t: at("DOESN'T")}, {w: 'exist', t: at('EXIST'), accent: true}], [{w: 'over', t: at('OVER', 41.5)}, {w: 'there.', t: at('THERE', 41.8)}]]} />
    </AbsoluteFill>
  );
};

/* ============ 17 · sausage roll funeral — FLIP-OVER ============ */
const Funeral: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const flip = lerp(fr, 0, 14, 180, 0, Easing.out(Easing.cubic));
  return (
    <AbsoluteFill style={{background: '#0a0706', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `perspective(1600px) rotateX(${flip}deg)`}}>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 60%, rgba(255,170,80,.35), transparent 55%)'}} />
        <div style={{position: 'absolute', left: 250, top: 820, width: 580, height: 300, clipPath: 'polygon(12% 0,88% 0,100% 30%,86% 100%,14% 100%,0 30%)', background: 'linear-gradient(180deg,#5a3018,#2a160a)'}} />
        <div style={{position: 'absolute', left: 300, top: 860, width: 480, height: 220, clipPath: 'polygon(12% 0,88% 0,100% 30%,86% 100%,14% 100%,0 30%)', background: '#f2e8f2'}} />
        <div style={{position: 'absolute', left: 380, top: 920, width: 320, height: 110, borderRadius: 55, background: 'linear-gradient(180deg,#f2c27a,#c8843a)', boxShadow: 'inset 0 -14px 0 #a8642a'}} />
        {[180, 900].map((x, i) => <div key={i} style={{position: 'absolute', left: x - 30, top: 760}}>
          <div style={{width: 60, height: 260, background: '#f4ecd8', borderRadius: 8}} />
          <div style={{position: 'absolute', left: 4, top: -80 + Math.sin(fr * 0.8 + i) * 3, width: 52, height: 80, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: 'radial-gradient(ellipse at 50% 70%, #fff 0 18%, #ffd36b 32%, #ff7a2a 60%, transparent 70%)', boxShadow: '0 0 80px 30px rgba(255,170,60,.4)'}} />
        </div>)}
        <div style={{position: 'absolute', top: 1180, width: W, textAlign: 'center', fontFamily: 'UIBold', fontSize: 40, color: '#e8d4b8', fontStyle: 'italic'}}>R.I.P. · 1 sausage roll · gone too soon</div>
      </AbsoluteFill>
      <Title shotStart={start} y={0.14} size={150} lines={[[{w: 'grieve', t: at('GRIEVE')}], [{w: 'properly.', t: at('PROPERLY'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 18 · rainy window -> Miami — WIPER WIPE ============ */
const Wiper: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const a = interpolate(fr % 34, [0, 14, 17, 31], [-70, 70, 70, -70], {...cl, easing: Easing.inOut(Easing.sin)});
  const cleared = lerp(fr, 10, 50, 0, 1);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#58b8ff,#bfe6ff 45%,#ffd38a 60%,#e8a86a)'}}>
        <div style={{position: 'absolute', left: 640, top: 280, width: 260, height: 260, borderRadius: 130, background: 'radial-gradient(circle,#fff,#ffe08a 55%,#ffb04a)', boxShadow: '0 0 160px 60px rgba(255,220,120,.6)'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `rgba(120,132,145,${0.92 * (1 - cleared)})`, backdropFilter: `blur(${18 * (1 - cleared)}px)`, WebkitBackdropFilter: `blur(${18 * (1 - cleared)}px)`}}><Rain n={90} op={0.6 * (1 - cleared)} /></AbsoluteFill>
      <div style={{position: 'absolute', left: W / 2 - 8, top: H - 120, width: 16, height: 1500, background: '#111', transformOrigin: '50% 0', transform: `rotate(${180 + a}deg)`, borderRadius: 8}} />
      <Title shotStart={start} y={0.84} size={104} lines={[[{w: "don't", t: at("DON'T", 43.8)}, {w: 'complain', t: at('COMPLAIN')}], [{w: 'about', t: at('AH', 44.8)}, {w: 'the', t: at('THE', 45)}, {w: 'weather.', t: at('WEATHER'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 19 · 32° and sunny — TRUST-FALL (camera falls backwards) ============ */
const TrustFall: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const fall = lerp(fr, 0, 16, 0, 1, Easing.in(Easing.quad));
  const ty = fall * 1300, rx = fall * 70;
  const temp = Math.round(lerp(fr, f(at('THIRTY') - start) - 6, f(at('DEGREES') - start), 12, 32, Easing.out(Easing.cubic)));
  return (
    <AbsoluteFill style={{background: '#4aa8ff', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `perspective(900px) rotateX(${-rx}deg) translateY(${ty}px)`, transformOrigin: '50% 100%'}}>
        <AbsoluteFill style={{background: 'linear-gradient(180deg,#58b8ff,#bfe6ff 55%,#ffe0b0)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1150, height: 900, background: 'linear-gradient(180deg,#2aa8c8,#f2d9a8 30%)'}} />
        {Array.from({length: 4}).map((_, i) => <div key={i} style={{position: 'absolute', left: 80 + i * 260, top: 1300, width: 200, height: 70, borderRadius: 12, background: ['#ff5c9e', '#3de0ff', '#ffd36b', '#ff5c9e'][i]}} />)}
      </AbsoluteFill>
      {/* the sky we fall back into */}
      <div style={{position: 'absolute', left: W / 2 - 170, top: -400 + fall * 700, width: 340, height: 340, borderRadius: 170, background: 'radial-gradient(circle,#fff,#ffe08a 55%,#ffb04a)', boxShadow: '0 0 200px 80px rgba(255,220,120,.7)'}} />
      <div style={{position: 'absolute', top: 1050, width: W, textAlign: 'center', opacity: fall}}><Txt size={260} style={GT}>{temp}°</Txt><Txt size={60} style={{marginTop: 10, textShadow: SHADOW}}>AND SUNNY ☀️</Txt></div>
    </AbsoluteFill>
  );
};

/* ============ 20 · umbrellas since 2013 — MATCH-SPEED TRACK, THEN STOP ============ */
const Umbrellas: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const stopAt = f(at('THIRTEEN', 49.5) - start);
  const x = fr < stopAt ? -fr * 26 : -stopAt * 26 - interpolate(fr - stopAt, [0, 6], [0, 30], {...cl, easing: Easing.out(Easing.back(3))});
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#d8dde2,#9aa4ae)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 560, width: 6000, height: 14, background: '#666'}} />
      <div style={{position: 'absolute', left: x + 160, top: 0, height: H}}>
        {Array.from({length: 14}).map((_, i) => {
          const yr = 2026 - i; const col = ['#1b1b1f', NAVY, RED, '#2f4a2a', GREY][i % 5];
          return (
            <div key={i} style={{position: 'absolute', left: i * 300, top: 560}}>
              <div style={{position: 'absolute', left: 120, top: 0, width: 8, height: 520, background: '#3a3a3a'}} />
              <div style={{position: 'absolute', left: 60, top: 0, width: 130, height: 500, clipPath: 'polygon(50% 0,100% 100%,0 100%)', background: col}} />
              <div style={{position: 'absolute', left: 74, top: 640, padding: '10px 18px', background: yr === 2013 ? '#ff2d78' : '#fff', borderRadius: 10, transform: 'rotate(4deg)', boxShadow: '0 6px 14px rgba(0,0,0,.25)'}}>
                <Txt size={44} color={yr === 2013 ? '#fff' : '#111'}>{yr}</Txt></div>
            </div>
          );
        })}
      </div>
      <Rain n={40} op={0.25} />
      <Title shotStart={start} y={0.82} size={100} lines={[[{w: 'moaning', t: at('MOANING')}, {w: 'about', t: at('ABOUT', 48.3)}, {w: 'rain', t: at('RAIN')}], [{w: 'since', t: at('SINCE')}, {w: '2013.', t: at('THIRTEEN', 49.5), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 21 · "Enjoy it." — LENS-DROP (sunglasses over the lens) ============ */
const Shades: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const y = interpolate(fr, [0, 8, 11, 13], [-1100, 40, -14, 0], {...cl, easing: Easing.out(Easing.quad)});
  const on = fr > 8;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#58b8ff,#ffe0b0)', overflow: 'hidden'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#2aa8c8 55%,#f2d9a8 56%)'}} />
      {Array.from({length: 5}).map((_, i) => <div key={i} style={{position: 'absolute', left: 60 + i * 210, top: 820, width: 30, height: 340, background: '#5a3a24'}} />)}
      <AbsoluteFill style={{background: on ? 'rgba(80,20,60,.35)' : 'transparent', mixBlendMode: 'multiply'}} />
      <div style={{position: 'absolute', left: -60, top: 420 + y, width: W + 120, height: 640}}>
        <div style={{position: 'absolute', left: 40, top: 60, width: 560, height: 480, borderRadius: '45% 45% 50% 50%', background: 'linear-gradient(160deg, rgba(255,60,160,.55), rgba(40,10,40,.75))', border: '26px solid #111', boxSizing: 'border-box'}} />
        <div style={{position: 'absolute', right: 40, top: 60, width: 560, height: 480, borderRadius: '45% 45% 50% 50%', background: 'linear-gradient(160deg, rgba(255,60,160,.55), rgba(40,10,40,.75))', border: '26px solid #111', boxSizing: 'border-box'}} />
        <div style={{position: 'absolute', left: W / 2 - 40, top: 160, width: 200, height: 40, background: '#111', borderRadius: 20}} />
      </div>
      <Title shotStart={start} y={0.5} size={200} lines={[[{w: 'enjoy', t: at('ENJOY')}], [{w: 'it.', t: at('IT', 50.9), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 22 · "Now. Let's talk money." — COIN-TUMBLE CAM ============ */
const CoinTumble: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const tumble = lerp(fr, 0, T * 0.75, 0, 1080, Easing.out(Easing.cubic));
  const land = fr > T * 0.75;
  return (
    <AbsoluteFill style={{background: '#0d0a06', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `rotate(${tumble}deg) scale(${1.6 - (tumble / 1080) * 0.6})`}}>
        <AbsoluteFill style={{background: 'repeating-conic-gradient(from 0deg, #2a1e0a 0deg 10deg, #1a1206 10deg 20deg)'}} />
        {Array.from({length: 26}).map((_, i) => <div key={i} style={{position: 'absolute', left: rnd(i) * W, top: rnd(i + 5) * H, width: 120, height: 120, borderRadius: 60, background: 'radial-gradient(circle at 35% 35%, #fff2b0, #d8a83a 50%, #8a6a1a)', boxShadow: '0 10px 30px rgba(0,0,0,.5)'}} />)}
      </AbsoluteFill>
      <div style={{position: 'absolute', left: W / 2 - 260, top: 640, width: 520, height: 520, borderRadius: 260, background: 'radial-gradient(circle at 35% 30%, #fff6c8, #e8b84a 45%, #9a7420)', boxShadow: '0 0 120px rgba(255,200,80,.6)',
        transform: `rotateY(${land ? 0 : tumble * 2}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Txt size={260} color="#7a5a10">£</Txt></div>
      <Title shotStart={start} y={0.82} size={150} lines={[[{w: "let's", t: at("LET'S", 51.9)}, {w: 'talk', t: at('TALK', 52.3)}], [{w: 'money.', t: at('MONEY', 52.8), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 23 · $ -> £ under a magnifier — MAGNIFIER SWEEP ============ */
const Magnifier: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const mx = lerp(fr, 0, T, 180, 860, Easing.inOut(Easing.sin)), my = 1000 + Math.sin(fr * 0.08) * 60;
  const conv = lerp(fr, f(at('POUNDS') - start) - 10, f(at('POUNDS') - start), 0, 1);
  const tag = (big: boolean) => (
    <div style={{position: 'absolute', left: 100, top: 760, width: 880, height: 480, borderRadius: 30, background: '#fffaf0', boxShadow: big ? 'none' : '0 20px 50px rgba(0,0,0,.4)', padding: 50, boxSizing: 'border-box'}}>
      <div style={{fontFamily: 'UIBold', fontSize: 34, color: '#888'}}>STARTER PENTHOUSE · VICE CITY</div>
      <Txt size={150} color="#111" style={{marginTop: 30}}>${'12,500,000'}</Txt>
      <Txt size={60} color={RED} style={{marginTop: 20, opacity: conv}}>≈ £{Math.round(9.8e6 * conv).toLocaleString('en-GB')}*</Txt>
    </div>
  );
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#2a2018,#120c08)', overflow: 'hidden'}}>
      {tag(false)}
      <div style={{position: 'absolute', left: mx - 230, top: my - 230, width: 460, height: 460, borderRadius: 230, overflow: 'hidden', border: '20px solid #2a2a2e', boxShadow: '0 20px 60px rgba(0,0,0,.6)'}}>
        <div style={{position: 'absolute', left: -(mx - 230) * 1.8 - W * 0.4, top: -(my - 230) * 1.8 - H * 0.4, width: W, height: H, transform: 'scale(1.8)', transformOrigin: '0 0'}}>{tag(true)}</div>
        <AbsoluteFill style={{background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,.35), transparent 50%)'}} />
      </div>
      <div style={{position: 'absolute', left: mx + 140, top: my + 140, width: 50, height: 340, background: '#2a2a2e', borderRadius: 25, transform: 'rotate(-40deg)', transformOrigin: 'top'}} />
      <div style={{position: 'absolute', top: H * 0.92, width: W, textAlign: 'center', fontFamily: 'UIBold', fontSize: 26, color: 'rgba(255,255,255,.6)'}}>*illustrative in-game price · real-world rate</div>
      <Title shotStart={start} y={0.165} size={100} lines={[[{w: "don't", t: at("DON'T", 53.8)}, {w: 'convert', t: at('CONVERT')}, {w: 'the', t: at('THE', 54.6)}], [{w: 'prices', t: at('PRICES')}, {w: 'into', t: at('INTO')}, {w: 'pounds.', t: at('POUNDS'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 24 · mansion vs Croydon street — ORTHOGRAPHIC SWEEP ============ */
const Ortho: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const sx = lerp(fr, 0, T, 160, -160, Easing.inOut(Easing.cubic));
  const soldAt = f(at('STREET', 58.4) - start);
  return (
    <AbsoluteFill style={{background: '#cfe4f2', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: W / 2, top: H / 2, transform: `translate(${sx}px, 120px) scale(0.6) rotateX(58deg) rotateZ(-45deg)`, transformStyle: 'preserve-3d'}}>
        <div style={{position: 'absolute', left: -1400, top: -1400, width: 2800, height: 2800, background: 'repeating-linear-gradient(0deg,#9fd08a 0 200px,#8ec47a 200px 400px)'}} />
        {/* mansion */}
        <div style={{position: 'absolute', left: -700, top: -300, width: 520, height: 520, transformStyle: 'preserve-3d'}}>
          <div style={{position: 'absolute', inset: 0, background: '#f7f2ff', transform: 'translateZ(220px)', boxShadow: '0 0 0 10px #ff5c9e'}} />
          <div style={{position: 'absolute', left: 0, top: 520, width: 520, height: 220, background: '#e6dcf2', transformOrigin: 'top', transform: 'rotateX(-90deg)'}} />
          <div style={{position: 'absolute', left: 520, top: 0, width: 220, height: 520, background: '#d4c8e6', transformOrigin: 'left', transform: 'rotateY(90deg)'}} />
          <div style={{position: 'absolute', left: 60, top: 60, width: 220, height: 160, background: '#3de0ff', transform: 'translateZ(221px)'}} />
        </div>
        {/* terraced street */}
        {Array.from({length: 10}).map((_, i) => (
          <div key={i} style={{position: 'absolute', left: 60 + i * 150, top: 200, width: 140, height: 220, transformStyle: 'preserve-3d'}}>
            <div style={{position: 'absolute', inset: 0, background: '#a8583a', transform: 'translateZ(160px)'}} />
            <div style={{position: 'absolute', left: 0, top: 220, width: 140, height: 160, background: '#8a4a30', transformOrigin: 'top', transform: 'rotateX(-90deg)'}} />
            <div style={{position: 'absolute', left: 30, top: 230, width: 30, height: 60, background: ['#c8102e', '#0b1a3a', '#2f4a2a'][i % 3], transformOrigin: 'top', transform: 'rotateX(-90deg) translateZ(-1px)'}} />
            {fr > soldAt + i * 2 && <div style={{position: 'absolute', left: 10, top: 40, padding: '4px 12px', background: RED, transform: `translateZ(${200 + 30 * pop(fr - soldAt - i * 2, 5, 0).s}px) rotateX(-58deg)`}}><Txt size={34}>SOLD</Txt></div>}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', top: H * 0.125, width: W, textAlign: 'center'}}>
        <Txt size={64} style={{textShadow: SHADOW}}><span style={GT}>1 mansion</span> &gt; <span style={{color: '#fff'}}>your whole street</span></Txt>
      </div>
      <Title shotStart={start} y={0.86} size={100} lines={[[{w: 'your', t: at('YOUR', 57.9)}, {w: 'whole', t: at('WHOLE')}, {w: 'street', t: at('STREET', 58.4)}], [{w: 'in', t: at('IN', 58.8)}, {w: 'Croydon.', t: at('CROYDON'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ============ 25 · rob a bank — DOOR-HINGE CAM ============ */
const Vault: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const swing = lerp(fr, 0, T * 0.8, 0, 100, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill style={{background: '#050506', overflow: 'hidden', perspective: 1400}}>
      {/* the room beyond (gold) */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, #ffd36b 0%, #a87420 40%, #1a1206 75%)'}}>
        {Array.from({length: 30}).map((_, i) => <div key={i} style={{position: 'absolute', left: 140 + (i % 6) * 140, top: 900 + Math.floor(i / 6) * 90, width: 130, height: 70, borderRadius: 8, background: 'linear-gradient(180deg,#fff2b0,#d8a83a)', boxShadow: '0 6px 0 #8a6a1a'}} />)}
      </AbsoluteFill>
      {/* camera is bolted to the door: the whole world rotates around the hinge */}
      <AbsoluteFill style={{transformOrigin: '0% 50%', transform: `rotateY(${-swing}deg)`}}>
        <div style={{position: 'absolute', left: 40, top: 360, width: 1000, height: 1200, borderRadius: 40, background: 'radial-gradient(circle at 50% 50%, #5a5e66, #2a2c30 70%)', border: '24px solid #1a1b1e'}}>
          <div style={{position: 'absolute', left: 300, top: 400, width: 360, height: 360, borderRadius: 180, border: '30px solid #8a8e96', transform: `rotate(${fr * 3}deg)`}}>
            {[0, 60, 120].map((r) => <div key={r} style={{position: 'absolute', left: 135, top: -60, width: 30, height: 440, background: '#8a8e96', transform: `rotate(${r}deg)`, transformOrigin: '50% 50%'}} />)}
          </div>
          {Array.from({length: 6}).map((_, i) => <div key={i} style={{position: 'absolute', right: -40, top: 140 + i * 160, width: 80, height: 50, background: '#b8bcc4', borderRadius: 10}} />)}
        </div>
      </AbsoluteFill>
      <Title shotStart={start} y={0.165} size={110} lines={[[{w: 'just', t: at('JUST')}, {w: 'rob', t: at('ROB')}, {w: 'a', t: at('A', 60.2)}, {w: 'bank', t: at('BANK'), accent: true}], [{w: 'like', t: at('LIKE', 60.6)}, {w: 'a', t: at('A', 60.8)}, {w: 'normal', t: at('NORMAL')}, {w: 'person.', t: at('PERSON', 61.3)}]]} />
    </AbsoluteFill>
  );
};

/* ============ 26 · "Which one are you breaking first?" — REEL SPIN ============ */
const Slots: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const icons = ['🔫', '🚗', '🦓', '☕', '☀️', '💷'];
  const reel = (k: number) => {
    const stop = 30 + k * 14;
    const pos = fr < stop ? fr * 1.9 : stop * 1.9 + interpolate(fr - stop, [0, 6], [0, 0.0], cl);
    const final = [3, 0, 5][k];
    const v = fr < stop ? pos : final;
    const off = (v % 6) * 300;
    return (
      <div style={{width: 280, height: 600, overflow: 'hidden', borderRadius: 24, background: '#fff', position: 'relative', boxShadow: 'inset 0 30px 40px rgba(0,0,0,.35), inset 0 -30px 40px rgba(0,0,0,.35)'}}>
        <div style={{position: 'absolute', top: 150 - off, left: 0, width: '100%', filter: fr < stop ? 'blur(6px)' : 'none'}}>
          {[...icons, ...icons].map((ic, i) => <div key={i} style={{height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}><div style={{fontSize: 150}}>{ic}</div>
            <Txt size={44} color="#111">RULE {(i % 6) + 1}</Txt></div>)}
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #4a0d3a, #12040e 70%)', overflow: 'hidden'}}>
      {Array.from({length: 22}).map((_, i) => <div key={i} style={{position: 'absolute', left: (i % 11) * 100 + 20, top: i < 11 ? 330 : 1440, width: 30, height: 30, borderRadius: 15, background: (Math.floor(fr / 4) + i) % 2 ? '#ffd36b' : '#ff3da6', boxShadow: '0 0 20px #ffd36b'}} />)}
      <div style={{position: 'absolute', left: 60, top: 420, width: 960, height: 960, borderRadius: 50, background: 'linear-gradient(180deg,#c8102e,#7a0a1c)', border: '14px solid #ffd36b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20}}>
        {reel(0)}{reel(1)}{reel(2)}
      </div>
      <Title shotStart={start} y={0.165} size={96} lines={[[{w: 'which', t: at('WHICH')}, {w: 'one', t: at('ONE', 62.5)}, {w: 'are', t: at('ARE', 62.8)}, {w: 'you', t: at('YOU', 62.9)}], [{w: 'breaking', t: at('BREAKING'), accent: true}, {w: 'first?', t: at('FIRST', 63.6)}]]} />
      <Title shotStart={start} y={0.86} size={130} lines={[[{w: 'be', t: at('BE', 64)}, {w: 'honest.', t: at('HONEST')}]]} />
    </AbsoluteFill>
  );
};

/* ============ 27 · inside a red postbox — SLOT POV ============ */
const Postbox: React.FC<{start: number; dur: number}> = ({start, dur}) => {
  const fr = useCurrentFrame();
  const drop = lerp(fr, 6, 22, -400, 1300, Easing.in(Easing.quad));
  const followAt = f(at('FOLLOW') - start), tap = f(at('SIN', 66.8) - start) + 3;
  const card = pop(fr - followAt, 9, 0.7);
  const tapped = fr >= tap;
  return (
    <AbsoluteFill style={{background: '#1a0306', overflow: 'hidden'}}>
      {/* the slot: daylight beyond (a neon street) */}
      <div style={{position: 'absolute', left: 140, top: 300, width: 800, height: 170, borderRadius: 30, background: 'linear-gradient(180deg,#ff8ac0,#ffd9a0)', overflow: 'hidden', boxShadow: '0 0 120px 30px rgba(255,180,200,.45)'}}>
        {Array.from({length: 7}).map((_, i) => <div key={i} style={{position: 'absolute', left: 40 + i * 110, bottom: 0, width: 16, height: 110, background: '#2a1020'}} />)}
      </div>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 20%, rgba(255,160,180,.35), transparent 50%)'}} />
      {/* interior walls */}
      <div style={{position: 'absolute', left: 0, top: 520, width: W, height: 1400, background: 'linear-gradient(180deg,#5a0a14,#1a0306)'}} />
      {/* the comment-letter dropping through */}
      <div style={{position: 'absolute', left: 250, top: drop, width: 580, height: 360, background: '#fffaf0', transform: `rotate(${(drop / 1300) * 24 - 6}deg)`, boxShadow: '0 20px 40px rgba(0,0,0,.5)', padding: 40, boxSizing: 'border-box'}}>
        <div style={{fontFamily: 'UIBold', fontSize: 30, color: '#888'}}>new comment</div>
        <Txt size={64} color="#111" style={{marginTop: 20}}>"rule 1 tbh 😭"</Txt>
      </div>
      {Array.from({length: 18}).map((_, i) => <div key={i} style={{position: 'absolute', left: 100 + rnd(i) * 820, top: 1500 + rnd(i + 2) * 300, width: 260, height: 160, background: '#f4ede0', transform: `rotate(${(rnd(i + 4) - 0.5) * 70}deg)`, boxShadow: '0 6px 14px rgba(0,0,0,.4)'}} />)}
      {/* follow card */}
      <div style={{position: 'absolute', left: 90, right: 90, top: 760, padding: '44px 46px', borderRadius: 40, background: 'rgba(255,255,255,.97)', opacity: card.o, transform: `scale(${card.s})`, boxShadow: '0 30px 90px rgba(0,0,0,.6)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
          <div style={{width: 130, height: 130, borderRadius: 65, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'HeroBlack', fontSize: 56, color: '#fff'}}>VC</div>
          <div><Txt size={66} color="#111">Vice City Sin</Txt><div style={{fontFamily: 'UIBold', fontSize: 32, color: '#777', marginTop: 8}}>every sin's a story.</div></div>
        </div>
        <div style={{marginTop: 34, height: 104, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'HeroBlack', fontSize: 48,
          transform: `scale(${tapped ? interpolate(fr - tap, [0, 3, 6], [1, 0.92, 1], cl) : 1})`, ...(tapped ? {background: '#efe9f3', color: '#333'} : {background: GRAD, color: '#fff'})}}>{tapped ? 'Following ✓' : 'Follow'}</div>
      </div>
      <Title shotStart={start} y={0.07} size={110} lines={[[{w: 'comments.', t: at('COMMENTS'), accent: true}]]} outAt={65.8} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
export const BritRules: React.FC = () => {
  const ready = useFontsReady('brit');
  const fr = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{background: '#000'}} />;
  const S = (i: number) => ({from: f(CUT[i]), durationInFrames: f(CUT[i + 1]) - f(CUT[i])});
  const d = (i: number) => CUT[i + 1] - CUT[i];
  const c = CUT;
  const scenes = [
    <AbsoluteFill><PhoneBoxBeach dur={d(0)} /><Title shotStart={0} y={0.14} size={98} lines={[[{w: '6', t: 0, accent: true}, {w: 'things', t: at('THINGS')}, {w: 'you', t: at('YOU')}, {w: 'should', t: at('SHOULD')}], [{w: 'never', t: at('NEVER'), accent: true}, {w: 'do', t: at('DO')}, {w: 'as', t: at('AS')}, {w: 'a', t: at('A', 1.9)}], [{w: 'Brit', t: at('BRITISH')}, {w: 'in', t: at('PLAYING')}, {w: 'GTA', t: at('GTA')}, {w: '6.', t: at('SIX', 3.5)}]]} /></AbsoluteFill>,
    <Passport start={c[1]} />, <Queue start={c[2]} dur={d(2)} />, <Comic start={c[3]} />, <Scope start={c[4]} dur={d(4)} />, <Dashcam start={c[5]} />, <CableCam start={c[6]} dur={d(6)} />,
    <Xray start={c[7]} dur={d(7)} />, <Zebra start={c[8]} dur={d(8)} />, <NoZebra start={c[9]} dur={d(9)} />, <CrocSplit start={c[10]} dur={d(10)} />, <TeaCup start={c[11]} dur={d(11)} />,
    <IcedCoffee start={c[12]} dur={d(12)} />, <Teabag start={c[13]} />, <Corkboard start={c[14]} dur={d(14)} />, <ShopGone start={c[15]} dur={d(15)} />, <Funeral start={c[16]} dur={d(16)} />,
    <Wiper start={c[17]} dur={d(17)} />, <TrustFall start={c[18]} dur={d(18)} />, <Umbrellas start={c[19]} dur={d(19)} />, <Shades start={c[20]} />, <CoinTumble start={c[21]} dur={d(21)} />,
    <Magnifier start={c[22]} dur={d(22)} />, <Ortho start={c[23]} dur={d(23)} />, <Vault start={c[24]} dur={d(24)} />, <Slots start={c[25]} dur={d(25)} />, <Postbox start={c[26]} dur={d(26)} />,
  ];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scenes.map((s, i) => <Sequence key={i} {...S(i)}>{s}</Sequence>)}
      <RuleHud />
      {FLASHES.map(([t, peak, col], i) => (
        <AbsoluteFill key={i} style={{background: col, pointerEvents: 'none', opacity: interpolate(fr, [f(t) - 1, f(t), f(t) + 1, f(t) + 4], [0, peak, peak * 0.62, 0], cl)}} />
      ))}
      <Audio src={staticFile('mix_brit.wav')} />
    </AbsoluteFill>
  );
};
