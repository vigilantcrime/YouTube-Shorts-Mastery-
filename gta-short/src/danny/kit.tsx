/* Danny re-render kit: toy-style 3D primitives, hands that actually grip things, the barbershop set,
   and the HUD / caption overlays matched to the original video. */
import React, {useMemo} from 'react';
import {AbsoluteFill, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';

export const W = 1920, H = 1080, FPS = 25;
export const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.inOut(Easing.cubic);
export const lerp = (f: number, a: number, b: number, x: number, y: number, e = ease) => interpolate(f, [a, b], [x, y], {...cl, easing: e});
export const mix = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);
export type V3 = [number, number, number];

/* ---------- colours (sampled from the original frames) ---------- */
export const C = {
  dannySkin: '#e7a878', jordanSkin: '#93552f', dannySleeve: '#1d2431', jordanSleeve: '#3a3d43',
  dannyHair: '#3a2a22', slate: '#4a5257', beige: '#d9ccb6', chairRed: '#6c2a24', chairGrey: '#747b82',
  tileDark: '#303030', tileLight: '#f6efde', clipper: '#141414', led: '#34e39a',
};

/* ---------- fonts ---------- */
export const useFonts = () => {
  const [h] = React.useState(() => delayRender('danny-fonts'));
  React.useEffect(() => {
    const fs = [
      new FontFace('BigShoulders', `url(${staticFile('fonts/BigShoulders.ttf')})`, {weight: '100 900'}),
      new FontFace('PlexMono', `url(${staticFile('fonts/IBMPlexMono-Medium.ttf')})`, {weight: '500'}),
      new FontFace('PlexMonoBold', `url(${staticFile('fonts/IBMPlexMono-Bold.ttf')})`, {weight: '700'}),
      new FontFace('InterUI', `url(${staticFile('fonts/inter400.woff2')})`),
      new FontFace('InterMed', `url(${staticFile('fonts/inter500.woff2')})`),
      new FontFace('InterBold', `url(${staticFile('fonts/Inter-Bold.otf')})`),
    ];
    Promise.all(fs.map((f) => f.load())).then((l) => { l.forEach((f) => document.fonts.add(f)); continueRender(h); });
  }, [h]);
};

/* ---------- 2D overlays ---------- */
const PullIcon: React.FC<{x: number}> = ({x}) => (
  <svg width={22} height={18} viewBox="0 0 22 18" style={{position: 'absolute', left: x, top: 0}}>
    <path d="M2 15 C6 8, 11 4, 20 3 C15 6, 13 8, 12 11 C9 9, 6 11, 2 15 Z" fill="#e8452c" />
  </svg>
);
export const Hud: React.FC<{pulls: number; opacity?: number}> = ({pulls, opacity = 1}) => (
  <AbsoluteFill style={{opacity}}>
    <div style={{position: 'absolute', left: 70, top: 58, width: 9, height: 9, borderRadius: 5, background: '#e2432c'}} />
    <div style={{position: 'absolute', left: 116, top: 50, fontFamily: 'PlexMono', fontSize: 18, letterSpacing: '0.255em', color: 'rgba(214,214,210,0.86)', whiteSpace: 'pre'}}>
      {'CASE: DANNY, 31  ·  BARBER  ·  '}<span style={{color: '#f0a832'}}>FICTIONAL</span>
    </div>
    <div style={{position: 'absolute', left: 1564, top: 49, fontFamily: 'PlexMono', fontSize: 18, letterSpacing: '0.3em', color: 'rgba(214,214,210,0.86)'}}>PULLS</div>
    <div style={{position: 'absolute', left: 1664, top: 54, width: 200, height: 20}}>
      {[0, 1, 2, 3, 4].map((i) => (i < pulls ? <PullIcon key={i} x={i * 40} /> : <div key={i} style={{position: 'absolute', left: i * 40 + 6, top: 6, width: 8, height: 8, borderRadius: 4, background: 'rgba(200,200,200,0.18)'}} />))}
    </div>
  </AbsoluteFill>
);

/* bottom caption, Big Shoulders, white or yellow, fades in/out */
export const Caption: React.FC<{text: string; from: number; to: number; color?: string; y?: number}> = ({text, from, to, color = '#f5f2ea', y = 890}) => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [from, from + 6], [0, 1], cl), interpolate(f, [to - 6, to], [1, 0], cl));
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 140, top: y, fontFamily: 'BigShoulders', fontWeight: 800, fontSize: 50, lineHeight: 1, color, opacity: o,
      textShadow: '0 2px 10px rgba(0,0,0,0.55), 0 0 2px rgba(0,0,0,0.5)', letterSpacing: '0.005em', whiteSpace: 'nowrap'}}>{text}</div>
  );
};
/* yellow monospace tag (e.g. "One slow Tuesday.") */
export const Tag: React.FC<{text: string; from: number; to: number}> = ({text, from, to}) => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [from, from + 5], [0, 1], cl), interpolate(f, [to - 6, to], [1, 0], cl));
  if (o <= 0) return null;
  return <div style={{position: 'absolute', left: 140, top: 150, fontFamily: 'PlexMonoBold', fontSize: 50, color: '#f5b335', opacity: o, whiteSpace: 'pre'}}>{text}</div>;
};

/* film finish: vignette + fine grain, like the original */
export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  const noise = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d')!;
    const im = g.createImageData(256, 256);
    for (let i = 0; i < im.data.length; i += 4) { const v = Math.random() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    g.putImageData(im, 0, 0); return c.toDataURL();
  }, []);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.38) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: `url(${noise})`, backgroundPosition: `${(f * 37) % 256}px ${(f * 91) % 256}px`, opacity: 0.045, mixBlendMode: 'overlay'}} />
    </AbsoluteFill>
  );
};

/* ---------- 3D helpers ---------- */
export const Rig: React.FC<{pos: V3; look: V3; fov?: number; roll?: number}> = ({pos, look, fov = 40, roll = 0}) => {
  const {camera} = useThree();
  camera.position.set(...pos);
  camera.up.set(Math.sin(roll), Math.cos(roll), 0);
  camera.lookAt(...look);
  const pc = camera as THREE.PerspectiveCamera; pc.fov = fov; pc.near = 0.02; pc.far = 120; pc.updateProjectionMatrix();
  return null;
};

export const Stage: React.FC<{children: React.ReactNode; bg?: string; exposure?: number}> = ({children, bg = '#2a2d30', exposure = 1.0}) => (
  <ThreeCanvas width={W} height={H} shadows camera={{fov: 40, position: [0, 1, 3]}}
    gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: exposure, outputColorSpace: THREE.SRGBColorSpace}}>
    <color attach="background" args={[bg]} />
    {children}
  </ThreeCanvas>
);

const UP = new THREE.Vector3(0, 1, 0);
/* tapered rod between two points (arms, sleeves, broom handles) */
export const Rod: React.FC<{a: V3; b: V3; r0: number; r1?: number; color: string; rough?: number; caps?: boolean}> = ({a, b, r0, r1, color, rough = 0.55, caps = true}) => {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
  const d = B.clone().sub(A); const len = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize());
  const mid = A.clone().add(B).multiplyScalar(0.5);
  const rr1 = r1 ?? r0;
  return (
    <group>
      <mesh position={mid} quaternion={q} castShadow receiveShadow>
        <cylinderGeometry args={[rr1, r0, len, 40, 1, false]} />
        <meshStandardMaterial color={color} roughness={rough} />
      </mesh>
      {caps && <mesh position={A} castShadow><sphereGeometry args={[r0, 32, 20]} /><meshStandardMaterial color={color} roughness={rough} /></mesh>}
      {caps && <mesh position={B} castShadow><sphereGeometry args={[rr1, 32, 20]} /><meshStandardMaterial color={color} roughness={rough} /></mesh>}
    </group>
  );
};

/* checker floor texture */
export const useChecker = (n = 2, light = C.tileLight, dark = C.tileDark) => useMemo(() => {
  const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d')!;
  const s = 512 / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { g.fillStyle = (i + j) % 2 ? dark : light; g.fillRect(i * s, j * s, s, s); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16;
  return t;
}, [n, light, dark]);

export const Floor: React.FC<{tile?: number; size?: number}> = ({tile = 0.32, size = 30}) => {
  const tex = useChecker();
  const t = tex.clone(); t.needsUpdate = true; t.repeat.set(size / (tile * 2), size / (tile * 2));
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial map={t} roughness={0.32} metalness={0.0} />
    </mesh>
  );
};

/* the red barber chair (blocky, like the original) */
export const Chair: React.FC<{p: V3; ry?: number}> = ({p, ry = 0}) => (
  <group position={p} rotation={[0, ry, 0]}>
    {[ // back, seat, base column, arm rests, foot plate
      {s: [0.62, 0.95, 0.16], q: [0, 1.05, -0.26], c: C.chairRed},
      {s: [0.5, 0.36, 0.12], q: [0, 1.62, -0.28], c: C.chairRed},
      {s: [0.64, 0.16, 0.6], q: [0, 0.56, 0.02], c: C.chairRed},
      {s: [0.1, 0.42, 0.1], q: [0, 0.27, 0.02], c: C.chairGrey},
      {s: [0.12, 0.08, 0.5], q: [-0.37, 0.78, 0.06], c: C.chairGrey},
      {s: [0.12, 0.08, 0.5], q: [0.37, 0.78, 0.06], c: C.chairGrey},
      {s: [0.46, 0.05, 0.4], q: [0, 0.03, 0.05], c: C.chairGrey},
    ].map((b, i) => (
      <mesh key={i} position={b.q as V3} castShadow receiveShadow>
        <boxGeometry args={b.s as V3} />
        <meshStandardMaterial color={b.c} roughness={0.5} />
      </mesh>
    ))}
  </group>
);

/* barbershop room shell */
export const Shop: React.FC = () => (
  <group>
    <Floor />
    <mesh position={[0, 2, -3.2]} receiveShadow><planeGeometry args={[30, 4]} /><meshStandardMaterial color={C.slate} roughness={0.9} /></mesh>
    <mesh position={[2.6, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow><planeGeometry args={[30, 4]} /><meshStandardMaterial color={C.beige} roughness={0.85} /></mesh>
    <mesh position={[-2.2, 0.55, -2.7]} castShadow receiveShadow><boxGeometry args={[1.2, 1.1, 0.8]} /><meshStandardMaterial color="#1e1f22" roughness={0.7} /></mesh>
  </group>
);

export const ShopLights: React.FC<{key1?: V3}> = ({key1 = [-1.6, 3.4, 2.2]}) => (
  <group>
    <hemisphereLight args={['#fff3e2', '#4a4c50', 1.25]} />
    <ambientLight intensity={0.35} />
    <directionalLight position={[0.5, 1.6, 3]} intensity={0.6} color="#ffffff" />
    <directionalLight position={key1} intensity={1.7} color="#fff1dc" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004}
      shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-radius={6} />
    <spotLight position={[0.2, 3.6, 0.6]} angle={0.75} penumbra={0.9} intensity={18} color="#fff7ea" castShadow={false} />
  </group>
);

/* ---------- hands that grip ---------- */
/* A hand gripping a horizontal bar along its local X axis (bar radius rc, centred at the origin).
   curl: 0 = open (fingers straight), 1 = closed round the bar. side: -1 arm comes from -X, +1 from +X.
   Fingers wrap over the top towards the camera; the palm sits behind the bar; the thumb lies along the top. */
export const GripHand: React.FC<{skin: string; rc: number; curl: number; side: number; scale?: number; start?: number; wrap?: number; palm?: V3}> = ({skin, rc, curl, side, scale = 1, start = 0.55, wrap = 2.25, palm = [0.082, 0.078, 0.048]}) => {
  const fr = 0.0235 * scale, R = rc + fr * 0.9;
  const arc = 0.5 + curl * wrap;                 // radians of wrap
  const mat = <meshStandardMaterial color={skin} roughness={0.42} />;
  const fingers = [-1.5, -0.5, 0.5, 1.5].map((k) => k * fr * 1.86);
  const lens = [0.92, 1, 0.97, 0.84];
  return (
    <group>
      {/* palm: rounded block behind the bar */}
      <mesh position={[side * 0.014 * scale, rc * 0.35, -(rc + 0.026 * scale)]} scale={[palm[0] * scale, palm[1] * scale, palm[2] * scale]} castShadow>
        <sphereGeometry args={[1, 40, 28]} />{mat}
      </mesh>
      {/* fingers: arcs starting behind/above the bar and wrapping over to the front */}
      {fingers.map((x, i) => (
        <group key={i} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <group rotation={[0, 0, Math.PI * start]}>
            <mesh castShadow>
              <torusGeometry args={[R, fr, 16, 48, arc * lens[i]]} />{mat}
            </mesh>
            {/* rounded fingertip */}
            <mesh position={[R * Math.cos(arc * lens[i]), R * Math.sin(arc * lens[i]), 0]} castShadow><sphereGeometry args={[fr, 20, 14]} />{mat}</mesh>
            <mesh position={[R, 0, 0]} castShadow><sphereGeometry args={[fr, 20, 14]} />{mat}</mesh>
          </group>
        </group>
      ))}
      {/* thumb along the top, pointing along the bar away from the arm */}
      <mesh position={[-side * 0.02 * scale, rc + fr * 0.7, -0.012 * scale]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <capsuleGeometry args={[fr * 1.08, 0.045 * scale, 8, 20]} />{mat}
      </mesh>
    </group>
  );
};

/* forearm + sleeve from a wrist point out to a shoulder point (usually off-screen) */
export const Arm: React.FC<{wrist: V3; elbow: V3; shoulder: V3; skin: string; sleeve: string; scale?: number}> = ({wrist, elbow, shoulder, skin, sleeve, scale = 1}) => {
  const w = new THREE.Vector3(...wrist), e = new THREE.Vector3(...elbow);
  const cuff = w.clone().add(e.clone().sub(w).normalize().multiplyScalar(0.05 * scale));
  return (
    <group>
      <Rod a={wrist} b={cuff.toArray() as V3} r0={0.032 * scale} r1={0.034 * scale} color={skin} rough={0.42} />
      <Rod a={cuff.toArray() as V3} b={elbow} r0={0.043 * scale} r1={0.052 * scale} color={sleeve} rough={0.75} />
      <Rod a={elbow} b={shoulder} r0={0.052 * scale} r1={0.06 * scale} color={sleeve} rough={0.75} />
    </group>
  );
};

/* clippers: glossy black body, grey blade, green LED */
export const Clippers: React.FC<{len?: number; r?: number}> = ({len = 0.27, r = 0.058}) => (
  <group>
    <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
      <capsuleGeometry args={[r, len, 16, 40]} />
      <meshStandardMaterial color={C.clipper} roughness={0.16} metalness={0.35} />
    </mesh>
    <mesh position={[-(len / 2 + r * 0.9), 0, 0]} castShadow>
      <boxGeometry args={[0.03, r * 1.9, r * 2.05]} />
      <meshStandardMaterial color="#8d9399" roughness={0.35} metalness={0.6} />
    </mesh>
    <mesh position={[0.02, -0.004, r * 0.98]}>
      <sphereGeometry args={[0.009, 16, 12]} />
      <meshStandardMaterial color={C.led} emissive={C.led} emissiveIntensity={2.2} />
    </mesh>
  </group>
);
