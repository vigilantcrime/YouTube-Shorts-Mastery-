/* "Picture this" — launch-night POV short. Every shot is new (see /shotlist.md, video 4).
   15 shots · 15 different camera moves · real 3D (three.js) or new 2.5D layouts. */
import React, {useMemo} from 'react';
import {
  AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing,
  continueRender, delayRender,
} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import words from './w4.json';
import {W, H, GRAD, SHADOW, f, Title, Bubble} from './kit';

type Wd = [string, number];
const WT = (words as Wd[]).map(([w, t]) => [w, t + 0.05] as Wd);
const at = (word: string, after = 0) => WT.find(([w, t]) => w === word && t >= after)?.[1] ?? after;

/* ------------------------------------------------------------------ */
/* Cuts: 1 frame before each clause (style.md §2)                       */
/* ------------------------------------------------------------------ */
const CUT = [0, 0.73, 3.73, 5.57, 6.89, 8.37, 12.49, 13.65, 15.01, 16.89, 17.97, 18.93, 20.49, 24.17, 24.89, 30.1];
const FLASHES: [number, number, string][] = [[14.44, 1, '#fff'], [16.89, 0.8, '#ff9bd2'], [24.17, 0.35, '#ffd9a8']];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const lerp = (fr: number, a: number, b: number, x: number, y: number, e = io) => interpolate(fr, [a, b], [x, y], {...cl, easing: e});
const rnd = (i: number) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };

const useFontsReady = () => {
  const [handle] = React.useState(() => delayRender('fonts-ln'));
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const a = new FontFace('HeroBlack', `url(${staticFile('InterDisplay-Black.otf')})`);
    const b = new FontFace('UIBold', `url(${staticFile('Inter-Bold.otf')})`);
    Promise.all([a.load(), b.load()]).then(([x, y]) => { document.fonts.add(x); document.fonts.add(y); setReady(true); });
  }, []);
  React.useEffect(() => { if (ready) continueRender(handle); }, [ready, handle]);
  return ready;
};

/** Canvas -> texture. `key` controls redraws. */
const useTex = (key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) =>
  useMemo(() => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d')!; draw(g, w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

/** Sets the camera every frame. `up` lets us spin top-down / worm's-eye / roll. */
const Rig: React.FC<{pos: number[]; look: number[]; fov?: number; up?: number[]}> = ({pos, look, fov, up = [0, 1, 0]}) => {
  const {camera} = useThree();
  camera.position.set(pos[0], pos[1], pos[2]);
  camera.up.set(up[0], up[1], up[2]);
  camera.lookAt(look[0], look[1], look[2]);
  const pc = camera as THREE.PerspectiveCamera;
  if (fov && pc.fov !== fov) { pc.fov = fov; }
  pc.near = 0.02; pc.far = 200; pc.updateProjectionMatrix();
  return null;
};

const Stage: React.FC<{children: React.ReactNode; bg: string; fog?: [string, number, number]}> = ({children, bg, fog}) => (
  <ThreeCanvas width={W} height={H} camera={{fov: 50, position: [0, 0, 5]}} gl={{antialias: true}}>
    <color attach="background" args={[bg]} />
    {fog && <fog attach="fog" args={fog} />}
    {children}
  </ThreeCanvas>
);

const brickTex = (g: CanvasRenderingContext2D, w: number, h: number) => {
  g.fillStyle = '#1b1012'; g.fillRect(0, 0, w, h);
  const bw = 64, bh = 26;
  for (let y = 0, r = 0; y < h; y += bh + 4, r++) for (let x = -(r % 2) * bw / 2; x < w; x += bw + 4) {
    const k = rnd(x * 7 + y); g.fillStyle = `rgb(${70 + k * 40},${30 + k * 14},${28 + k * 10})`; g.fillRect(x, y, bw, bh);
  }
};

/* ================================================================== */
/* 1 · "Picture this." — fly-through an opening camera iris             */
/* ================================================================== */
const Iris: React.FC = () => {
  const fr = useCurrentFrame();
  const open = lerp(fr, 0, 12, 0, 1, Easing.out(Easing.cubic));
  const z = lerp(fr, 0, 22, 4.2, -2.6, Easing.in(Easing.quad));
  return (
    <Stage bg="#050307">
      <Rig pos={[0, 0, z]} look={[0, 0, z - 5]} fov={62} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[2, 3, 5]} intensity={2.2} color="#ffc4e4" />
      <mesh position={[0, 0, -3]}><circleGeometry args={[4, 64]} /><meshBasicMaterial color="#fff2fa" /></mesh>
      {Array.from({length: 7}).map((_, i) => {
        const th = (i / 7) * Math.PI * 2 + open * 0.9;
        const r = 0.55 + open * 2.2;
        return (
          <mesh key={i} position={[Math.cos(th) * r, Math.sin(th) * r, 0]} rotation={[0, 0, th + Math.PI / 2 + 0.55]}>
            <boxGeometry args={[3.4, 1.5, 0.04]} />
            <meshStandardMaterial color="#17121c" metalness={0.85} roughness={0.32} />
          </mesh>
        );
      })}
      <mesh position={[0, 0, 0.05]}><ringGeometry args={[3.1, 6, 64]} /><meshStandardMaterial color="#0d0a10" metalness={0.6} roughness={0.5} /></mesh>
    </Stage>
  );
};

/* ================================================================== */
/* 2 · "Nov 19th, 11:59 PM" — overhead top-down spin + descend           */
/* ================================================================== */
const Bedroom: React.FC<{dur: number}> = ({dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const a = lerp(fr, 0, T, -0.15, 0.55);
  const y = lerp(fr, 0, T, 7.2, 4.4);
  const colon = Math.floor(fr / 15) % 2 === 0;
  const floor = useTex('floor', 512, 512, (g, w, h) => {
    for (let i = 0; i < 16; i++) { const k = rnd(i); g.fillStyle = `rgb(${46 + k * 14},${30 + k * 8},${24 + k * 6})`; g.fillRect(0, i * 32, w, 31); }
  });
  const clock = useTex('clock' + colon, 256, 128, (g, w, h) => {
    g.fillStyle = '#080203'; g.fillRect(0, 0, w, h);
    g.font = '96px HeroBlack'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ff2a2a'; g.shadowColor = '#ff0000'; g.shadowBlur = 24;
    g.fillText(colon ? '11:59' : '11 59', w / 2, h / 2 + 4);
  });
  const blinds = useTex('blinds', 256, 256, (g, w, h) => { g.clearRect(0, 0, w, h); for (let i = 0; i < 12; i++) { g.fillStyle = 'rgba(140,170,255,0.55)'; g.fillRect(0, i * 22, w, 11); } });
  return (
    <Stage bg="#06070d">
      <Rig pos={[-1.5, y, -0.9]} look={[-1.5, 0, -0.9]} fov={52} up={[Math.sin(a), 0, -Math.cos(a)]} />
      <ambientLight intensity={0.45} color="#7d8cff" />
      <directionalLight position={[-5, 6, 2]} intensity={2.2} color="#8ea2ff" />
      <pointLight position={[-2.6, 0.9, -0.3]} intensity={6} distance={3.5} color="#ff2a2a" />
      <pointLight position={[1.8, 1.2, 1.6]} intensity={5} distance={4} color="#ff4fb0" />
      <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[7, 9]} /><meshStandardMaterial map={floor} roughness={0.8} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0.3]} position={[-1.8, 0.012, 1.0]}><planeGeometry args={[3, 2.2]} /><meshBasicMaterial map={blinds} transparent blending={THREE.AdditiveBlending} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.1, 0.006, 0.9]}><circleGeometry args={[1.3, 48]} /><meshStandardMaterial color="#3a2a4a" /></mesh>
      {/* bed */}
      <mesh position={[-1.1, 0.25, -1.9]}><boxGeometry args={[2.1, 0.5, 2.8]} /><meshStandardMaterial color="#2a2436" /></mesh>
      <mesh position={[-1.1, 0.53, -1.5]} rotation={[0, 0.05, 0]}><boxGeometry args={[2.0, 0.08, 2.0]} /><meshStandardMaterial color="#5a3f8a" /></mesh>
      <mesh position={[-1.1, 0.56, -3.0]}><boxGeometry args={[1.3, 0.14, 0.45]} /><meshStandardMaterial color="#d8d4e8" /></mesh>
      {/* nightstand + clock */}
      <mesh position={[-2.65, 0.3, -0.25]}><boxGeometry args={[0.6, 0.6, 0.6]} /><meshStandardMaterial color="#251a14" /></mesh>
      <mesh position={[-2.65, 0.62, -0.25]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.58, 0.29]} /><meshBasicMaterial map={clock} /></mesh>
      {/* desk, monitor glow, chair */}
      <mesh position={[1.9, 0.38, 2.0]}><boxGeometry args={[1.6, 0.76, 0.75]} /><meshStandardMaterial color="#1c1a22" /></mesh>
      <mesh position={[1.9, 0.9, 2.3]}><boxGeometry args={[1.1, 0.5, 0.06]} /><meshStandardMaterial color="#0b0a0e" emissive="#ff4fb0" emissiveIntensity={0.6} /></mesh>
      <mesh position={[1.9, 0.5, 1.2]}><cylinderGeometry args={[0.32, 0.32, 0.1, 24]} /><meshStandardMaterial color="#121016" /></mesh>
      {/* controller on bed */}
      <mesh position={[-0.6, 0.6, -1.2]} rotation={[0, 0.6, 0]}><boxGeometry args={[0.32, 0.06, 0.18]} /><meshStandardMaterial color="#e8e6f0" /></mesh>
    </Stage>
  );
};

/* ================================================================== */
/* 3 · "told your boss you've got a cough" — low tracking, empty office  */
/* ================================================================== */
const Office: React.FC<{dur: number}> = ({dur}) => {
  const fr = useCurrentFrame();
  const x = lerp(fr, 0, f(dur), -3.2, 2.6, Easing.inOut(Easing.sin));
  const flick = rnd(Math.floor(fr / 2)) > 0.82 ? 0.25 : 1;
  const note = useTex('note', 256, 256, (g, w, h) => {
    g.fillStyle = '#ffe766'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#222'; g.font = '54px HeroBlack'; g.textAlign = 'center'; g.fillText('OUT', w / 2, 92); g.fillText('SICK', w / 2, 152);
    g.font = '58px sans-serif'; g.fillText('🤒', w / 2, 226);
  });
  const chair = (cx: number, cz: number, k: number) => (
    <group key={`${cx}`} position={[cx, 0, cz]} rotation={[0, k * 3, 0]}>
      <mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.035, 0.035, 0.4, 12]} /><meshStandardMaterial color="#202226" metalness={0.8} roughness={0.3} /></mesh>
      {Array.from({length: 5}).map((_, i) => (
        <group key={i} rotation={[0, (i / 5) * Math.PI * 2, 0]}>
          <mesh position={[0.2, 0.07, 0]}><boxGeometry args={[0.4, 0.04, 0.05]} /><meshStandardMaterial color="#202226" metalness={0.8} roughness={0.3} /></mesh>
          <mesh position={[0.39, 0.035, 0]}><sphereGeometry args={[0.035, 12, 12]} /><meshStandardMaterial color="#0c0c0e" /></mesh>
        </group>
      ))}
      <mesh position={[0, 0.5, 0]}><boxGeometry args={[0.5, 0.08, 0.5]} /><meshStandardMaterial color="#2c3038" /></mesh>
      <mesh position={[0, 0.85, -0.23]}><boxGeometry args={[0.46, 0.6, 0.06]} /><meshStandardMaterial color="#2c3038" /></mesh>
    </group>
  );
  return (
    <Stage bg="#0b1617" fog={['#0b1617', 4, 16]}>
      <Rig pos={[x, 0.17, 2.3]} look={[x + 1.1, 0.42, -0.6]} fov={58} />
      <ambientLight intensity={0.35} color="#9fffd6" />
      <pointLight position={[0.5, 2.6, -0.4]} intensity={26 * flick} distance={12} color="#d8ffe8" />
      <pointLight position={[x + 1.5, 1.2, 1.2]} intensity={4} distance={5} color="#7fffd0" />
      <mesh position={[0.5, 2.7, -0.4]}><boxGeometry args={[3.2, 0.06, 0.18]} /><meshBasicMaterial color={flick > 0.5 ? '#eafff2' : '#5a6b62'} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[40, 20]} /><meshStandardMaterial color="#2a3134" roughness={0.95} /></mesh>
      {[-6, -4.3, -2.6, -0.9, 0.8, 2.5, 4.2, 5.9].map((dx, i) => (
        <group key={i}>
          <mesh position={[dx, 0.74, -1.25]}><boxGeometry args={[1.6, 0.05, 0.8]} /><meshStandardMaterial color="#3b4246" /></mesh>
          <mesh position={[dx - 0.7, 0.37, -1.25]}><boxGeometry args={[0.05, 0.74, 0.7]} /><meshStandardMaterial color="#3b4246" /></mesh>
          <mesh position={[dx, 1.05, -1.5]}><boxGeometry args={[0.7, 0.42, 0.04]} /><meshStandardMaterial color="#0a0b0c" /></mesh>
          {chair(dx + 0.1, -0.35, rnd(i))}
        </group>
      ))}
      <mesh position={[0.8, 1.13, -1.47]}><planeGeometry args={[0.2, 0.2]} /><meshBasicMaterial map={note} /></mesh>
    </Stage>
  );
};

/* ================================================================== */
/* 4 · "Your phone's on silent." — rack focus glass -> phone (2.5D)      */
/* ================================================================== */
const RackFocus: React.FC = () => {
  const fr = useCurrentFrame();
  const fg = lerp(fr, 3, 15, 0, 16), ph = lerp(fr, 3, 15, 12, 0);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 60% 20%, #12304a 0%, #060810 60%)', overflow: 'hidden'}}>
      {/* ceiling glow thrown by the phone */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 58% 30%, rgba(120,220,255,.35), transparent 45%)'}} />
      {[...Array(9)].map((_, i) => (
        <div key={i} style={{position: 'absolute', left: rnd(i) * W, top: 120 + rnd(i + 9) * 500, width: 60 + rnd(i + 3) * 90, height: 60 + rnd(i + 3) * 90,
          borderRadius: '50%', background: i % 2 ? 'rgba(255,170,90,.35)' : 'rgba(120,180,255,.3)', filter: 'blur(18px)'}} />
      ))}
      {/* nightstand surface */}
      <div style={{position: 'absolute', left: -200, right: -200, top: 980, height: 1200, background: 'linear-gradient(180deg,#3a2a20,#1a120d)',
        transform: 'perspective(900px) rotateX(58deg)', transformOrigin: 'top', filter: `blur(${ph * 0.25}px)`}} />
      {/* phone lying face up */}
      <div style={{position: 'absolute', left: 300, top: 760, width: 520, height: 1000, transform: 'perspective(1100px) rotateX(54deg) rotateZ(-14deg)', transformOrigin: 'top',
        filter: `blur(${ph}px)`}}>
        <div style={{width: '100%', height: '100%', borderRadius: 56, background: '#0b0b10', padding: 18, boxShadow: '0 30px 60px rgba(0,0,0,.7)'}}>
          <div style={{width: '100%', height: '100%', borderRadius: 44, background: 'linear-gradient(180deg,#14324a,#0a1622)', padding: '50px 30px', boxSizing: 'border-box'}}>
            <div style={{margin: '0 auto', width: 260, padding: '12px 0', borderRadius: 999, background: 'rgba(255,255,255,.14)', fontFamily: 'UIBold', fontSize: 30, color: '#fff', textAlign: 'center'}}>🔕 Silent</div>
            <div style={{fontFamily: 'HeroBlack', fontSize: 150, color: '#fff', textAlign: 'center', marginTop: 30, letterSpacing: -4}}>11:59</div>
            {['Boss · missed call', 'Boss · missed call', 'Boss · missed call'].map((t, i) => (
              <div key={i} style={{marginTop: 18, padding: '20px 24px', borderRadius: 22, background: 'rgba(255,255,255,.16)', fontFamily: 'UIBold', fontSize: 30, color: '#fff'}}>📞 {t}</div>
            ))}
          </div>
        </div>
      </div>
      {/* foreground water glass */}
      <div style={{position: 'absolute', left: -60, top: 980, width: 420, height: 900, filter: `blur(${fg}px)`}}>
        <div style={{width: '100%', height: '100%', borderRadius: '30px 30px 60px 60px', background: 'linear-gradient(90deg, rgba(255,255,255,.28), rgba(180,220,255,.06) 30%, rgba(255,255,255,.04) 70%, rgba(255,255,255,.3))',
          border: '4px solid rgba(255,255,255,.35)', position: 'relative', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 280, bottom: 0, background: 'linear-gradient(180deg, rgba(150,210,255,.25), rgba(80,140,200,.18))'}} />
          <div style={{position: 'absolute', left: 50, top: 40, width: 26, height: 700, borderRadius: 13, background: 'rgba(255,255,255,.45)'}} />
        </div>
      </div>
      <Title shotStart={0} y={0.13} lines={[[{w: "your", t: 0.0}, {w: "phone's", t: 0.1}], [{w: 'on', t: at('ON', 6) - CUT[3]}, {w: 'silent.', t: at('SILENT') - CUT[3], accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 5 · "Your mom thinks you're asleep." — crane down to the door gap     */
/* ================================================================== */
const Hallway: React.FC<{dur: number}> = ({dur}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const y = lerp(fr, 0, T, 2.45, 0.16, Easing.inOut(Easing.quad));
  const ly = lerp(fr, 0, T, 1.3, 0.05, Easing.inOut(Easing.quad));
  const pulse = 0.75 + 0.25 * Math.sin(fr * 0.7) * Math.sin(fr * 0.23);
  const photo = (k: number) => useTex('ph' + k, 128, 160, (g, w, h) => {
    g.fillStyle = '#d9c9a8'; g.fillRect(0, 0, w, h); g.fillStyle = ['#7a5a46', '#5a6d7a', '#7a6a4a'][k]; g.fillRect(10, 10, w - 20, h - 20);
    g.fillStyle = 'rgba(255,230,200,.6)'; g.beginPath(); g.arc(w / 2, h / 2 - 10, 22, 0, 7); g.fill(); g.fillRect(w / 2 - 28, h / 2 + 16, 56, 50);
  });
  const ph = [photo(0), photo(1), photo(2)];
  const glow = useTex('gap', 256, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(190,80,255,1)'); gr.addColorStop(1, 'rgba(190,80,255,0)');
    g.fillStyle = gr; g.fillRect(40, 0, w - 80, h);
  });
  return (
    <Stage bg="#04040a" fog={['#04040a', 6, 16]}>
      <Rig pos={[0.15, y, 1.4]} look={[0, ly, -6]} fov={55} />
      <ambientLight intensity={0.3} color="#5060ff" />
      <directionalLight position={[1, 3, 4]} intensity={0.8} color="#7f8cff" />
      <pointLight position={[0, 0.04, -5.6]} intensity={7 * pulse} distance={4} color="#b450ff" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]}><planeGeometry args={[2.2, 10]} /><meshStandardMaterial color="#2b2024" roughness={0.6} /></mesh>
      <mesh position={[-1.1, 1.3, -2]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[10, 2.6]} /><meshStandardMaterial color="#3a3442" /></mesh>
      <mesh position={[1.1, 1.3, -2]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[10, 2.6]} /><meshStandardMaterial color="#3a3442" /></mesh>
      <mesh position={[0, 2.6, -2]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[2.2, 10]} /><meshStandardMaterial color="#1c1a22" /></mesh>
      <mesh position={[0, 1.3, -6.05]}><planeGeometry args={[2.2, 2.6]} /><meshStandardMaterial color="#3a3442" /></mesh>
      <mesh position={[0, 1.07, -6.0]}><boxGeometry args={[0.92, 2.1, 0.06]} /><meshStandardMaterial color="#4a3326" roughness={0.7} /></mesh>
      <mesh position={[0.36, 1.0, -5.95]}><sphereGeometry args={[0.04, 12, 12]} /><meshStandardMaterial color="#c9a45a" metalness={0.9} roughness={0.2} /></mesh>
      <mesh position={[0, 0.012, -5.6]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.0, 0.9]} /><meshBasicMaterial map={glow} transparent opacity={0.8 * pulse} blending={THREE.AdditiveBlending} /></mesh>
      <mesh position={[0, 0.01, -5.97]}><boxGeometry args={[0.9, 0.02, 0.02]} /><meshBasicMaterial color="#e2a8ff" /></mesh>
      {[[-1.08, 1.5, -2.5, 0], [-1.08, 1.7, -3.6, 1], [1.08, 1.55, -3.0, 2]].map(([px, py, pz, k], i) => (
        <mesh key={i} position={[px, py, pz]} rotation={[0, px < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}><planeGeometry args={[0.4, 0.5]} /><meshStandardMaterial map={ph[k]} /></mesh>
      ))}
    </Stage>
  );
};

/* ================================================================== */
/* 6 · "download bar 99%… stuck… 10 minutes" — orbit around the bar      */
/* ================================================================== */
const ProgressOrbit: React.FC<{dur: number; start: number}> = ({dur, start}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const ang = lerp(fr, 0, T, -1.05, 1.0, Easing.inOut(Easing.sin));
  const cam = [Math.sin(ang) * 7.5, 1.0 + Math.cos(ang * 1.5) * 1.6, Math.cos(ang) * 7.5];
  const tenAt = f(at('TEN', 11) - start);
  const secs = Math.min(600, 592 + Math.floor(Math.max(0, fr - (tenAt - 24)) / 3));
  const mm = Math.floor(secs / 60), ss = secs % 60;
  const label = useTex('pct', 512, 256, (g, w, h) => { g.font = '200px HeroBlack'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.shadowColor = '#ff4fb0'; g.shadowBlur = 40; g.fillText('99%', w / 2, h / 2); });
  const timer = useTex('tm' + secs, 512, 128, (g, w, h) => {
    g.font = '64px HeroBlack'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = secs >= 600 ? '#ff5c9e' : '#9fd6ff';
    g.fillText(`STUCK ${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`, w / 2, h / 2);
  });
  const stripes = useTex('str', 256, 64, (g, w, h) => { g.fillStyle = '#ff2d78'; g.fillRect(0, 0, w, h); g.fillStyle = '#ff7ab8'; for (let x = -64; x < w; x += 48) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + 24, 0); g.lineTo(x + 48, 0); g.lineTo(x + 24, h); g.fill(); } });
  stripes.wrapS = THREE.RepeatWrapping; stripes.repeat.set(8, 1); stripes.offset.x = -fr * 0.02;
  const dust = useMemo(() => {
    const g = new THREE.BufferGeometry(); const p = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) { p[i * 3] = (rnd(i) - 0.5) * 30; p[i * 3 + 1] = (rnd(i + 1e3) - 0.5) * 20; p[i * 3 + 2] = (rnd(i + 2e3) - 0.5) * 30; }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3)); return g;
  }, []);
  const bill = new THREE.Euler(0, Math.atan2(cam[0], cam[2]), 0);
  return (
    <Stage bg="#03040b" fog={['#03040b', 8, 26]}>
      <Rig pos={cam} look={[0, 0.2, 0]} fov={46} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[-6, 4, 6]} intensity={1.6} color="#7fb6ff" />
      <pointLight position={[0, 2, -3]} intensity={30} distance={12} color="#ff4fb0" />
      <points geometry={dust}><pointsMaterial size={0.035} color="#bcd4ff" transparent opacity={0.8} /></points>
      <mesh><boxGeometry args={[6.2, 0.75, 0.75]} /><meshStandardMaterial color="#9fc8ff" transparent opacity={0.12} roughness={0.1} metalness={0.3} /></mesh>
      <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(6.2, 0.75, 0.75)]} /><lineBasicMaterial color="#e6f2ff" /></lineSegments>
      <mesh position={[-0.031, 0, 0]}><boxGeometry args={[6.1 * 0.99, 0.62, 0.62]} /><meshBasicMaterial map={stripes} /></mesh>
      <mesh position={[3.0, 0, 0]}><boxGeometry args={[0.04, 0.7, 0.7]} /><meshBasicMaterial color="#ffffff" /></mesh>
      <mesh position={[0, 1.5, 0]} rotation={bill}><planeGeometry args={[3.2, 1.6]} /><meshBasicMaterial map={label} transparent /></mesh>
    </Stage>
  );
};

/* ================================================================== */
/* 7 · "Your heart's going." — dolly zoom from behind the chair          */
/* ================================================================== */
const HeartDolly: React.FC<{dur: number; start: number}> = ({dur, start}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const d = lerp(fr, 0, T, 1.9, 6.0, Easing.inOut(Easing.quad));
  const k = Math.tan((64 / 2) * Math.PI / 180) * 1.9;
  const fov = (2 * Math.atan(k / d) * 180) / Math.PI;
  const beats = [0, 13, 24, 33];
  const pulse = Math.max(...beats.map((b) => Math.exp(-Math.max(0, fr - b) / 3) * (fr >= b ? 1 : 0)));
  const screen = useTex('scr', 512, 288, (g, w, h) => {
    g.fillStyle = '#0a0612'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a1838'; g.fillRect(56, 150, 400, 26); g.fillStyle = '#ff3d8f'; g.fillRect(56, 150, 396, 26);
    g.font = '60px HeroBlack'; g.textAlign = 'center'; g.fillStyle = '#fff'; g.fillText('99%', w / 2, 120);
  });
  return (
    <AbsoluteFill>
      <Stage bg="#0a0306">
        <Rig pos={[0, 1.05, d]} look={[0, 1.0, -1]} fov={fov} />
        <ambientLight intensity={0.08} />
        <pointLight position={[0, 2.2, 0.8]} intensity={4 + 30 * pulse} distance={8} color="#ff1a3a" />
        <pointLight position={[0, 1.1, -0.6]} intensity={3} distance={3} color="#ff4fb0" />
        {/* back wall with shelves + posters (the part that warps) */}
        <mesh position={[0, 1.6, -2.2]}><planeGeometry args={[14, 6]} /><meshStandardMaterial color="#26161e" /></mesh>
        {[-2.6, -1.4, 1.4, 2.6].map((x, i) => <mesh key={i} position={[x, 2.1 - (i % 2) * 0.5, -2.1]}><boxGeometry args={[0.9, 1.2, 0.03]} /><meshStandardMaterial color={['#4a2140', '#1f3550', '#50303a', '#2a4038'][i]} /></mesh>)}
        {[-4, -3, 3, 4].map((x, i) => <mesh key={i} position={[x, 1.2 + (i % 2) * 0.9, -2.0]}><boxGeometry args={[1.2, 0.05, 0.3]} /><meshStandardMaterial color="#3a2a22" /></mesh>)}
        {Array.from({length: 22}).map((_, i) => <mesh key={i} position={[-5 + i * 0.48, 2.9 + Math.sin(i) * 0.08, -2.1]}><sphereGeometry args={[0.04, 8, 8]} /><meshBasicMaterial color="#ffcf7a" /></mesh>)}
        {/* desk + monitor (subject: stays the same size) */}
        <mesh position={[0, 0.74, -0.75]}><boxGeometry args={[2.0, 0.06, 0.8]} /><meshStandardMaterial color="#17131a" /></mesh>
        <mesh position={[0, 1.15, -1.0]}><planeGeometry args={[1.12, 0.63]} /><meshBasicMaterial map={screen} /></mesh>
        <mesh position={[0, 1.15, -1.02]}><boxGeometry args={[1.18, 0.69, 0.03]} /><meshStandardMaterial color="#050507" /></mesh>
        {/* chair back silhouette in foreground */}
        <mesh position={[0.62, 0.72, 0.25]}><boxGeometry args={[0.62, 1.1, 0.12]} /><meshStandardMaterial color="#0c0a0e" /></mesh>
        <mesh position={[0.62, 1.35, 0.25]}><boxGeometry args={[0.4, 0.22, 0.12]} /><meshStandardMaterial color="#0c0a0e" /></mesh>
      </Stage>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(160,0,20,${0.15 + pulse * 0.5}) 100%)`}} />
      <Title shotStart={start} y={0.8} lines={[[{w: "your", t: at('YOUR', 12.4)}, {w: "heart's", t: at("HEART'S")}], [{w: 'going.', t: at('GOING'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 8 · "Then it hits 100." — crane up over 7-segment monoliths           */
/* ================================================================== */
const SEG: Record<string, number[]> = {'1': [1, 2], '0': [0, 1, 2, 3, 4, 5]};
const Digit: React.FC<{ch: string; x: number; on: number}> = ({ch, x, on}) => {
  const segs: [number, number, number, number][] = [   // x, y, w, h  (a b c d e f g)
    [0, 3.4, 1.6, 0.35], [0.95, 2.55, 0.35, 1.5], [0.95, 0.85, 0.35, 1.5], [0, 0.0, 1.6, 0.35], [-0.95, 0.85, 0.35, 1.5], [-0.95, 2.55, 0.35, 1.5], [0, 1.7, 1.6, 0.35],
  ];
  return (
    <group position={[x, 0.2, 0]}>
      {segs.map(([sx, sy, sw, sh], i) => {
        const lit = SEG[ch].includes(i);
        return (
          <mesh key={i} position={[sx - (ch === '1' ? 0.95 : 0), sy, 0]}>
            <boxGeometry args={[sw, sh, 0.7]} />
            <meshStandardMaterial color={lit ? '#ffffff' : '#141218'} emissive={lit ? '#ffd6ec' : '#000'} emissiveIntensity={lit ? on * 2.2 : 0} roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
};
const Hundred: React.FC<{dur: number; start: number}> = ({dur, start}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const hit = f(at('ONE', 14) - start);
  const on = lerp(fr, hit - 1, hit + 2, 0.08, 1, Easing.linear);
  const p = lerp(fr, 0, T, 0, 1, Easing.inOut(Easing.cubic));
  const cam = [0.3, 0.4 + p * 7.0, 14.5 - p * 2.0];
  return (
    <Stage bg="#030304" fog={['#09070c', 6, 30]}>
      <Rig pos={cam} look={[0, 1.9 - p * 0.9, 0]} fov={50} />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 3, 2.5]} intensity={on * 60} distance={14} color="#ffe4f3" />
      <pointLight position={[0, 6, -4]} intensity={8} distance={14} color="#ff4fb0" />
      <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[60, 60]} /><meshStandardMaterial color="#09080b" roughness={0.12} metalness={0.7} /></mesh>
      <Digit ch="1" x={-2.68} on={on} /><Digit ch="0" x={-0.78} on={on} /><Digit ch="0" x={1.72} on={on} />
    </Stage>
  );
};

/* ================================================================== */
/* 9 · "The screen goes black." — CRT power-off with camera roll         */
/* ================================================================== */
const CrtOff: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const hgt = lerp(fr, 0, 5, H, 6, Easing.in(Easing.cubic));
  const wid = lerp(fr, 5, 10, W, 8, Easing.in(Easing.cubic));
  const dot = lerp(fr, 10, 40, 1, 0, Easing.out(Easing.quad));
  const roll = lerp(fr, 0, 56, 0, -9, Easing.inOut(Easing.sin));
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `rotate(${roll}deg)`, alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: wid, height: hgt, background: fr < 5 ? 'linear-gradient(180deg,#ffb3dc,#fff,#9fe4ff)' : '#fff', opacity: fr < 10 ? 1 : dot,
          borderRadius: fr >= 10 ? '50%' : 0, boxShadow: `0 0 ${60 + 80 * dot}px ${20 * dot}px rgba(255,190,230,${dot})`}} />
        {/* scanlines */}
        <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.35) 0 2px, transparent 2px 5px)', opacity: fr < 6 ? 1 : 0}} />
      </AbsoluteFill>
      <Title shotStart={start} y={0.72} size={104} lines={[[{w: 'the', t: at('THE', 15)}, {w: 'screen', t: at('SCREEN')}], [{w: 'goes', t: at('GOES')}, {w: 'black.', t: at('BLACK')}]]} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 10 · "Pink neon" — macro track along a neon tube flickering on        */
/* ================================================================== */
const Neon: React.FC<{dur: number; start: number}> = ({dur, start}) => {
  const fr = useCurrentFrame();
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    [-3, 0.2], [-2.4, 1.2], [-1.8, 0.1], [-1.2, 1.3], [-0.5, 0.0], [0.1, 0.9], [-0.2, 1.4], [0.6, 1.1], [1.2, 0.2], [1.9, 1.2], [2.6, 0.3], [3.2, 0.9],
  ].map(([x, y]) => new THREE.Vector3(x, y, 0.14)), false, 'catmullrom', 0.3), []);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 400, 0.05, 12, false), [curve]);
  const glow = useMemo(() => new THREE.TubeGeometry(curve, 400, 0.17, 12, false), [curve]);
  const bricks = useTex('bricks', 1024, 1024, brickTex);
  const t = lerp(fr, 0, f(dur), 0.08, 0.62, Easing.inOut(Easing.sin));
  const p = curve.getPoint(t), q = curve.getPoint(Math.min(1, t + 0.06));
  const flick = fr < 8 ? (rnd(fr) > 0.45 ? 1 : 0.1) : 1;
  return (
    <AbsoluteFill>
      <Stage bg="#0a0406">
        <Rig pos={[p.x - 0.35, p.y + 0.3, 1.25]} look={[q.x, q.y, 0.1]} fov={50} />
        <ambientLight intensity={0.05} />
        {[[-2, 0.7], [0, 0.7], [2, 0.7]].map(([x, y], i) => <pointLight key={i} position={[x, y, 0.5]} intensity={6 * flick} distance={3} color="#ff3da6" />)}
        <mesh><planeGeometry args={[10, 6]} /><meshStandardMaterial map={bricks} roughness={0.9} /></mesh>
        <mesh geometry={tube}><meshBasicMaterial color={flick > 0.5 ? '#ffd2ef' : '#5a2a44'} /></mesh>
        <mesh geometry={glow}><meshBasicMaterial color="#ff2f9e" transparent opacity={0.35 * flick} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
        {[0.15, 0.35, 0.55, 0.75].map((u, i) => { const c = curve.getPoint(u); return <mesh key={i} position={[c.x, c.y, 0.07]}><boxGeometry args={[0.06, 0.12, 0.14]} /><meshStandardMaterial color="#888" metalness={0.9} roughness={0.3} /></mesh>; })}
      </Stage>
      <Title shotStart={start} y={0.8} size={150} lines={[[{w: 'pink', t: at('PINK')}, {w: 'neon.', t: at('NEON'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 11 · "palm trees" — worm's-eye spiral looking straight up            */
/* ================================================================== */
const Palm: React.FC<{x: number; z: number; h: number; lean: number; k: number}> = ({x, z, h, lean, k}) => {
  const segs = 10;
  const pts = Array.from({length: segs + 1}).map((_, i) => { const u = i / segs; return [x + lean * u * u * h * 0.3, u * h, z + lean * 0.5 * u * u]; });
  const top = pts[segs];
  return (
    <group>
      {pts.slice(0, -1).map((p, i) => {
        const n = pts[i + 1]; const mid = [(p[0] + n[0]) / 2, (p[1] + n[1]) / 2, (p[2] + n[2]) / 2];
        const dir = new THREE.Vector3(n[0] - p[0], n[1] - p[1], n[2] - p[2]); const len = dir.length();
        const qn = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        return <mesh key={i} position={mid as any} quaternion={qn}><cylinderGeometry args={[0.13 - i * 0.006, 0.15 - i * 0.006, len, 8]} /><meshBasicMaterial color="#14060f" /></mesh>;
      })}
      {Array.from({length: 11}).map((_, i) => {
        const a = (i / 11) * Math.PI * 2 + k;
        return (
          <group key={i} position={top as any} rotation={[0, a, 0]}>
            <mesh position={[1.3, -0.35, 0]} rotation={[0, 0, -0.45]}><boxGeometry args={[2.8, 0.03, 0.42]} /><meshBasicMaterial color="#14060f" /></mesh>
          </group>
        );
      })}
    </group>
  );
};
const Palms: React.FC<{dur: number; start: number}> = ({dur, start}) => {
  const fr = useCurrentFrame();
  const a = lerp(fr, 0, f(dur), 0, 1.5, Easing.inOut(Easing.sin));
  const y = lerp(fr, 0, f(dur), 0.2, 1.4);
  const sky = useTex('sky', 64, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a0b48'); gr.addColorStop(0.35, '#a1176f'); gr.addColorStop(0.62, '#ff5a6e'); gr.addColorStop(0.8, '#ffb15c'); gr.addColorStop(1, '#ffd9a0');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  return (
    <AbsoluteFill>
      <Stage bg="#2a0b48">
        <Rig pos={[0, y, 0]} look={[0, 20, 0]} fov={84} up={[Math.sin(a), 0, Math.cos(a)]} />
        <mesh><sphereGeometry args={[60, 32, 32]} /><meshBasicMaterial map={sky} side={THREE.BackSide} /></mesh>
        <Palm x={2.6} z={1.2} h={9} lean={-1.2} k={0.2} />
        <Palm x={-2.2} z={2.4} h={10.5} lean={1.0} k={1.1} />
        <Palm x={-1.6} z={-2.8} h={8.2} lean={0.8} k={2.0} />
        <Palm x={3.0} z={-2.2} h={11.5} lean={-0.9} k={0.7} />
        <Palm x={0.4} z={4.0} h={7.4} lean={0.3} k={1.6} />
      </Stage>
      <Title shotStart={start} y={0.5} size={160} lines={[[{w: 'palm', t: at('PALM')}, {w: 'trees.', t: at('TREES'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 12 · "that Vice City sunset" — pull back out of the monitor           */
/* ================================================================== */
const SunsetReveal: React.FC<{dur: number; start: number}> = ({dur, start}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const z = lerp(fr, 0, T, 0.42, 3.4, Easing.inOut(Easing.cubic));
  const sunY = lerp(fr, 0, T, 0.38, 0.5, Easing.linear);
  const scr = useTex('sun' + fr, 1024, 576, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h * 0.62); sky.addColorStop(0, '#2b0a4a'); sky.addColorStop(0.55, '#c3166f'); sky.addColorStop(1, '#ff9a4a');
    g.fillStyle = sky; g.fillRect(0, 0, w, h * 0.62);
    const cx = w / 2, cy = h * sunY, r = 170;
    const sg = g.createLinearGradient(0, cy - r, 0, cy + r); sg.addColorStop(0, '#ffe58a'); sg.addColorStop(1, '#ff3d8f');
    g.save(); g.beginPath(); g.rect(0, 0, w, h * 0.62); g.clip(); g.fillStyle = sg; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
    g.fillStyle = sky; for (let i = 0; i < 7; i++) { const yy = cy + 20 + i * 22; g.fillRect(cx - r, yy, 2 * r, 4 + i * 2.2); } g.restore();
    g.fillStyle = '#12051f'; for (let i = 0; i < 26; i++) { const bw = 18 + rnd(i) * 26, bh = 20 + rnd(i + 5) * 90; g.fillRect(i * 40 + rnd(i) * 10, h * 0.62 - bh, bw, bh); }
    const sea = g.createLinearGradient(0, h * 0.62, 0, h); sea.addColorStop(0, '#5a1050'); sea.addColorStop(1, '#13041e'); g.fillStyle = sea; g.fillRect(0, h * 0.62, w, h * 0.38);
    for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(255,${150 - i * 4},${120},${0.7 - i * 0.035})`; const yy = h * 0.64 + i * 11; const ww = (60 + i * 18) * (1 + 0.08 * Math.sin(fr * 0.3 + i)); g.fillRect(cx - ww / 2, yy, ww, 3); }
  });
  return (
    <AbsoluteFill>
      <Stage bg="#030206">
        <Rig pos={[0.05 * z, 1.2 + z * 0.08, z]} look={[0, 1.15, 0]} fov={50} />
        <ambientLight intensity={0.05} />
        <pointLight position={[0, 1.2, 0.6]} intensity={5} distance={4} color="#ff7a5a" />
        <mesh position={[0, 1.2, 0]}><planeGeometry args={[1.6, 0.9]} /><meshBasicMaterial map={scr} /></mesh>
        <mesh position={[0, 1.2, -0.035]}><boxGeometry args={[1.68, 0.98, 0.06]} /><meshStandardMaterial color="#060608" roughness={0.4} /></mesh>
        <mesh position={[0, 0.62, -0.1]}><boxGeometry args={[0.08, 0.3, 0.08]} /><meshStandardMaterial color="#0d0d10" /></mesh>
        <mesh position={[0, 0.45, 0.3]}><boxGeometry args={[2.6, 0.05, 1.1]} /><meshStandardMaterial color="#1a1418" /></mesh>
        <mesh position={[0, 0.49, 0.45]}><boxGeometry args={[0.9, 0.03, 0.3]} /><meshStandardMaterial color="#141216" /></mesh>
        <mesh position={[0, 0.48, 0.61]}><boxGeometry args={[0.9, 0.012, 0.012]} /><meshBasicMaterial color="#ff4fb0" /></mesh>
        <mesh position={[0.85, 0.55, 0.45]}><cylinderGeometry args={[0.07, 0.06, 0.16, 20]} /><meshStandardMaterial color="#d8d2e0" /></mesh>
      </Stage>
      <Title shotStart={start} y={0.78} lines={[[{w: 'that', t: at('THAT', 18.8)}, {w: 'Vice', t: at('VICE', 19)}, {w: 'City', t: at('CITY', 19.3)}], [{w: 'sunset.', t: at('SUNSET'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 13 · "signed away the next three months" — POV handheld, ToS          */
/* ================================================================== */
const Terms: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const tx = Math.sin(fr * 0.11) * 10 + Math.sin(fr * 0.37) * 4, ty = Math.sin(fr * 0.08 + 1) * 8 + Math.sin(fr * 0.29) * 3;
  const rot = Math.sin(fr * 0.06) * 0.9, br = 1 + Math.sin(fr * 0.05) * 0.006;
  const items = ['December', 'January', 'February', 'Sleep', 'Social life'];
  const tickAt = [at('NEXT'), at('THREE', 22.5), at('MONTHS'), at('OF', 23.2), at('YOUR', 23.4)].map((t) => f(t - start));
  const sigA = f(at('SIGNED') - start), sigB = sigA + 12;
  const sig = lerp(fr, sigA, sigB, 1, 0, Easing.inOut(Easing.quad));
  const acceptAt = f(at('LIFE') - start);
  const pressed = fr >= acceptAt;
  return (
    <AbsoluteFill style={{background: '#06040a', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${tx}px,${ty}px) rotate(${rot}deg) scale(${br})`}}>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, rgba(120,140,255,.18), transparent 60%)'}} />
        <div style={{position: 'absolute', left: 70, right: 70, top: 200, height: 1200, borderRadius: 26, background: '#f4f2f7', boxShadow: '0 0 120px rgba(150,160,255,.35)', padding: '54px 56px', boxSizing: 'border-box'}}>
          <div style={{fontFamily: 'UIBold', fontSize: 28, color: '#8a8696', letterSpacing: 3}}>GTA 6 · INSTALL COMPLETE</div>
          <div style={{fontFamily: 'HeroBlack', fontSize: 66, color: '#111', marginTop: 10, letterSpacing: -1.5}}>Terms of Service</div>
          <div style={{fontFamily: 'UIBold', fontSize: 34, color: '#444', marginTop: 24, lineHeight: 1.35}}>By pressing ACCEPT you agree to hand over the following, effective immediately:</div>
          {items.map((it, i) => {
            const on = fr >= tickAt[i];
            const s = on ? interpolate(fr - tickAt[i], [0, 5], [1.5, 1], cl) : 1;
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 26}}>
                <div style={{width: 58, height: 58, borderRadius: 12, border: '5px solid #111', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: on ? '#ff2d78' : 'transparent', borderColor: on ? '#ff2d78' : '#111', transform: `scale(${s})`, fontFamily: 'HeroBlack', fontSize: 40, color: '#fff'}}>{on ? '✓' : ''}</div>
                <div style={{fontFamily: 'HeroBlack', fontSize: 52, color: on ? '#111' : '#777', textDecoration: on ? 'line-through' : 'none', textDecorationColor: '#ff2d78', textDecorationThickness: 5}}>{it}</div>
              </div>
            );
          })}
          <svg width={600} height={150} style={{position: 'absolute', left: 56, top: 900}}>
            <path d="M10 100 C 60 20, 90 140, 140 70 S 220 30, 240 100 S 320 130, 350 60 C 380 20, 420 120, 470 80 S 560 60, 590 90" stroke="#1a2a8a" strokeWidth={7} fill="none"
              strokeLinecap="round" strokeDasharray={1200} strokeDashoffset={1200 * sig} />
            <line x1={0} y1={130} x2={600} y2={130} stroke="#bbb" strokeWidth={3} />
          </svg>
          <div style={{position: 'absolute', right: 56, bottom: 56, padding: '26px 54px', borderRadius: 18, fontFamily: 'HeroBlack', fontSize: 46,
            background: pressed ? '#ff2d78' : '#111', color: '#fff', transform: `scale(${pressed ? interpolate(fr - acceptAt, [0, 3, 7], [0.9, 0.9, 1], cl) : 1})`}}>{pressed ? 'ACCEPTED ✓' : 'ACCEPT'}</div>
        </div>
        {/* keyboard glow at the bottom edge of the POV */}
        <div style={{position: 'absolute', left: -40, right: -40, bottom: -60, height: 260, background: 'linear-gradient(0deg, rgba(255,60,160,.35), transparent)', filter: 'blur(10px)'}} />
      </AbsoluteFill>
      <Title shotStart={start} y={0.83} size={104} lines={[[{w: 'the', t: at('THE', 22.2)}, {w: 'next', t: at('NEXT')}, {w: '3', t: at('THREE', 22.5)}], [{w: 'months.', t: at('MONTHS'), accent: true}]]} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 14 · "Worth it." — whip pan at dawn onto a sticky note               */
/* ================================================================== */
const WorthIt: React.FC = () => {
  const fr = useCurrentFrame();
  const x = interpolate(fr, [0, 6, 9, 12], [-2.2 * W, 18, -6, 0], {...cl, easing: Easing.out(Easing.cubic)});
  const mb = interpolate(fr, [0, 5, 7], [40, 30, 0], cl);
  return (
    <AbsoluteFill style={{background: '#160c10', overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 0, left: 0, width: 3.2 * W, height: H, transform: `translateX(${x}px)`, filter: `blur(${mb}px)`}}>
        {/* bookshelf, window at dawn, monitor bezel with note — one continuous wall */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 3.2 * W, height: H, background: 'linear-gradient(90deg,#24161a,#3a2420 35%,#5a3424 55%,#2a1a1c 100%)'}} />
        {Array.from({length: 18}).map((_, i) => <div key={i} style={{position: 'absolute', left: 80 + i * 44, top: 520 + (i % 3) * 8, width: 36, height: 260 - (i % 4) * 30, background: ['#5a2a3a', '#2a4a5a', '#6a5a3a', '#3a2a5a'][i % 4]}} />)}
        <div style={{position: 'absolute', left: 1.15 * W, top: 260, width: 700, height: 1000, background: 'linear-gradient(180deg,#ffd29a,#ff8a5a)', boxShadow: '0 0 200px 60px rgba(255,170,100,.5)'}}>
          {Array.from({length: 16}).map((_, i) => <div key={i} style={{position: 'absolute', left: 0, right: 0, top: i * 62, height: 22, background: 'rgba(60,30,20,.55)'}} />)}
        </div>
        <div style={{position: 'absolute', left: 2.2 * W + 40, top: 380, width: 1000, height: 640, background: '#0a090c', borderRadius: 18, border: '26px solid #141216'}} />
      </div>
      {/* sticky note on bezel (lands at frame 9) */}
      <AbsoluteFill style={{transform: `translateX(${x}px)`, filter: `blur(${mb}px)`}}>
        <div style={{position: 'absolute', left: 300, top: 880, width: 480, height: 470, background: '#ffe766', transform: 'rotate(-5deg)', boxShadow: '0 22px 50px rgba(0,0,0,.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
          <div style={{fontFamily: 'HeroBlack', fontSize: 120, color: '#1b1b1b', letterSpacing: -4, lineHeight: 0.95, transform: 'rotate(-3deg) skewX(-8deg)'}}>worth</div>
          <div style={{fontFamily: 'HeroBlack', fontSize: 120, letterSpacing: -4, lineHeight: 0.95, transform: 'rotate(-3deg) skewX(-8deg)',
            backgroundImage: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>it.</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(110deg, rgba(255,170,90,.35), transparent 55%)', mixBlendMode: 'soft-light'}} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 15 · CTA — rainy alley, tilt down from neon sign to puddle            */
/* ================================================================== */
const Alley: React.FC<{dur: number; start: number}> = ({dur, start}) => {
  const fr = useCurrentFrame();
  const T = f(dur);
  const tilt = lerp(fr, 4, 62, 0, 1, Easing.inOut(Easing.cubic));
  const look = [0, 4.6 - tilt * 3.6, -2.6 + tilt * 0.9];
  const followOn = fr >= f(at('FOLLOW') - start) ? (fr < f(at('FOLLOW') - start) + 6 ? (rnd(fr) > 0.5 ? 1 : 0.15) : 1) : 0;
  const bricks = useTex('ab', 1024, 1024, brickTex);
  bricks.wrapS = bricks.wrapT = THREE.RepeatWrapping; bricks.repeat.set(2, 1);
  const sign = (txt: string, sub: string, col: string, key: string) => useTex(key, 1024, 384, (g, w, h) => {
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = col; g.shadowBlur = 40; g.fillStyle = '#fff';
    g.font = '150px HeroBlack'; g.fillText(txt, w / 2, sub ? h * 0.38 : h / 2);
    if (sub) { g.font = '88px HeroBlack'; g.fillStyle = col; g.fillText(sub, w / 2, h * 0.78); }
    g.shadowBlur = 0; g.strokeStyle = col; g.lineWidth = 10; g.strokeRect(20, 20, w - 40, h - 40);
  });
  const s1 = sign('COMMENT 👇', '', '#ff3da6', 's1'), s2 = sign('FOLLOW', 'VICE CITY SIN', '#3de0ff', 's2');
  const rain = useMemo(() => {
    const g = new THREE.BufferGeometry(); const p = new Float32Array(500 * 6);
    g.setAttribute('position', new THREE.BufferAttribute(p, 3)); return g;
  }, []);
  const pos = rain.attributes.position.array as Float32Array;
  for (let i = 0; i < 500; i++) {
    const x = (rnd(i) - 0.5) * 7, z = -3 + rnd(i + 7) * 6.5, y = 7 - ((rnd(i + 3) * 7 + fr * 0.33) % 7.5);
    pos.set([x, y, z, x - 0.02, y - 0.35, z], i * 6);
  }
  rain.attributes.position.needsUpdate = true;
  const signs = (mirror: boolean) => (
    <group scale={[1, mirror ? -1 : 1, 1]}>
      <mesh position={[0, 4.6, -2.95]}><planeGeometry args={[3.4, 1.27]} /><meshBasicMaterial map={s1} transparent opacity={mirror ? 0.55 : 1} /></mesh>
      <mesh position={[0, 2.5, -2.95]}><planeGeometry args={[3.6, 1.35]} /><meshBasicMaterial map={s2} transparent opacity={followOn * (mirror ? 0.6 : 1)} /></mesh>
    </group>
  );
  return (
    <AbsoluteFill>
      <Stage bg="#05040a" fog={['#07050e', 4, 14]}>
        <Rig pos={[0, 1.55, 4.2]} look={look} fov={60} />
        <ambientLight intensity={0.06} />
        <pointLight position={[0, 4.4, -2.3]} intensity={18} distance={7} color="#ff3da6" />
        <pointLight position={[0, 2.5, -2.3]} intensity={14 * followOn} distance={6} color="#3de0ff" />
        <mesh position={[0, 3.5, -3]}><planeGeometry args={[8, 9]} /><meshStandardMaterial map={bricks} roughness={0.85} /></mesh>
        <mesh position={[-2.2, 3.5, 1]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[9, 9]} /><meshStandardMaterial map={bricks} roughness={0.85} /></mesh>
        <mesh position={[2.2, 3.5, 1]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[9, 9]} /><meshStandardMaterial map={bricks} roughness={0.85} /></mesh>
        {signs(false)}
        {signs(true)}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.5]}><planeGeometry args={[4.4, 8]} /><meshStandardMaterial color="#0a0810" roughness={0.15} metalness={0.6} transparent opacity={0.72} /></mesh>
        <lineSegments geometry={rain}><lineBasicMaterial color="#c9d8ff" transparent opacity={0.45} /></lineSegments>
      </Stage>
      <Title shotStart={start} y={0.12} size={110} lines={[[{w: 'tell', t: at('TELL')}, {w: 'me', t: at('ME', 25)}], [{w: 'below.', t: at('COMMENTS'), accent: true}]]} outAt={26.1} />
      <Bubble name="you" text="worth it 🎮" typed t={at('COMMENTS') - 0.1} shotStart={start} x={180} y={1300} heartAt={at('AND', 25.9)} />
      <FollowPill start={start} />
    </AbsoluteFill>
  );
};
const FollowPill: React.FC<{start: number}> = ({start}) => {
  const fr = useCurrentFrame();
  const t0 = f(at('FOLLOW') - start), tap = f(at('SIN', 27) - start) + 3;
  const o = interpolate(fr, [t0, t0 + 5], [0, 1], cl), s = interpolate(fr, [t0, t0 + 8], [0.7, 1], {...cl, easing: Easing.out(Easing.back(2))});
  const tapped = fr >= tap;
  return (
    <div style={{position: 'absolute', top: H * 0.12, width: W, display: 'flex', justifyContent: 'center', opacity: o, transform: `scale(${s * (tapped ? interpolate(fr - tap, [0, 3, 6], [1, 0.92, 1], cl) : 1)})`}}>
      <div style={{fontFamily: 'HeroBlack', fontSize: 64, padding: '26px 60px', borderRadius: 999, color: tapped ? '#111' : '#fff',
        background: tapped ? '#fff' : GRAD, boxShadow: '0 0 50px rgba(255,90,170,.6)', textShadow: tapped ? 'none' : SHADOW}}>
        {tapped ? 'Following ✓  Vice City Sin' : '+ Follow  Vice City Sin'}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Composition                                                         */
/* ------------------------------------------------------------------ */
export const LaunchNight: React.FC = () => {
  const ready = useFontsReady();
  const fr = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{background: '#000'}} />;
  const S = (i: number) => ({from: f(CUT[i]), durationInFrames: f(CUT[i + 1]) - f(CUT[i])});
  const d = (i: number) => CUT[i + 1] - CUT[i];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Sequence {...S(0)}>
        <Iris />
        <Title shotStart={0} y={0.5} size={150} lines={[[{w: 'picture', t: 0.0}, {w: 'this.', t: at('THIS'), accent: true}]]} />
      </Sequence>
      <Sequence {...S(1)}>
        <Bedroom dur={d(1)} />
        <Title shotStart={CUT[1]} y={0.15} lines={[[{w: 'Nov', t: at('NOVEMBER')}, {w: '19th', t: at('NINETEENTH')}], [{w: '11:59', t: at('ELEVEN'), accent: true}, {w: 'PM', t: at('PM')}]]} />
      </Sequence>
      <Sequence {...S(2)}>
        <Office dur={d(2)} />
        <Title shotStart={CUT[2]} y={0.2} lines={[[{w: 'told', t: at('TOLD')}, {w: 'the', t: at('YOUR', 4.1)}, {w: 'boss', t: at('BOSS')}], [{w: "you've", t: at("YOU'VE", 4.6)}, {w: 'got', t: at('GOT')}, {w: 'a', t: at('A', 5)}, {w: 'cough.', t: at('COUGH'), accent: true}]]} />
      </Sequence>
      <Sequence {...S(3)}><RackFocus /></Sequence>
      <Sequence {...S(4)}>
        <Hallway dur={d(4)} />
        <Title shotStart={CUT[4]} y={0.2} lines={[[{w: 'mom', t: at('MOM')}, {w: 'thinks', t: at('THINKS')}], [{w: "you're", t: at("YOU'RE")}, {w: 'asleep.', t: at('ASLEEP'), accent: true}]]} />
      </Sequence>
      <Sequence {...S(5)}>
        <ProgressOrbit dur={d(5)} start={CUT[5]} />
        <Title shotStart={CUT[5]} y={0.8} lines={[[{w: 'stuck', t: at('STUCK')}, {w: 'for', t: at('FOR', 11.4)}], [{w: '10', t: at('TEN', 11.5)}, {w: 'minutes.', t: at('MINUTES'), accent: true}]]} />
        <Title shotStart={CUT[5]} y={0.17} size={96} lines={[[{w: 'the', t: at('THE', 8.3)}, {w: 'download', t: at('DOWNLOAD')}, {w: 'bar', t: at('BAR')}]]} />
      </Sequence>
      <Sequence {...S(6)}><HeartDolly dur={d(6)} start={CUT[6]} /></Sequence>
      <Sequence {...S(7)}>
        <Hundred dur={d(7)} start={CUT[7]} />
        <Title shotStart={CUT[7]} y={0.16} lines={[[{w: 'then', t: at('THEN')}, {w: 'it', t: at('IT', 13.8)}, {w: 'hits', t: at('HITS')}], [{w: '100.', t: at('ONE', 14), accent: true}]]} />
      </Sequence>
      <Sequence {...S(8)}><CrtOff start={CUT[8]} /></Sequence>
      <Sequence {...S(9)}><Neon dur={d(9)} start={CUT[9]} /></Sequence>
      <Sequence {...S(10)}><Palms dur={d(10)} start={CUT[10]} /></Sequence>
      <Sequence {...S(11)}><SunsetReveal dur={d(11)} start={CUT[11]} /></Sequence>
      <Sequence {...S(12)}><Terms start={CUT[12]} /></Sequence>
      <Sequence {...S(13)}><WorthIt /></Sequence>
      <Sequence {...S(14)}><Alley dur={d(14)} start={CUT[14]} /></Sequence>

      {FLASHES.map(([t, peak, col], i) => (
        <AbsoluteFill key={i} style={{background: col, pointerEvents: 'none',
          opacity: interpolate(fr, [f(t) - 1, f(t), f(t) + 1, f(t) + 4], [0, peak, peak * 0.62, 0], cl)}} />
      ))}
      <Audio src={staticFile('mix_launch.wav')} />
    </AbsoluteFill>
  );
};
