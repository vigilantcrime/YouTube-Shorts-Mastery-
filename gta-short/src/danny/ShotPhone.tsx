/* Re-render of Danny on the bench reading his phone (8:41.32, 10:59.60, 11:05.12):
   a real hand holding the phone, face lit normally (no blow-out). */
import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {C, Caption, Finish, Hud, Rig, Stage, cl, lerp, useChecker, useFonts, V3} from './kit';
import {Toy, Look} from './char';
import {ChapterTitle, ReviewsPhone, Stamp} from './reviewsUi';

export const DANNY: Look = {skin: '#efc3a2', hair: '#3b2c25', top: '#232b3d', legs: '#1d2433', hairStyle: 'bowl', brow: 0.9, mouth: 'flat'};

const useWallTex = () => useMemo(() => {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d')!;
  g.fillStyle = '#cdc4b7'; g.fillRect(0, 0, 1024, 512);
  const r = g.createRadialGradient(470, 250, 20, 470, 250, 420);
  r.addColorStop(0, '#e9e3da'); r.addColorStop(0.55, '#e2dbd1'); r.addColorStop(0.62, '#d3cabd'); r.addColorStop(1, '#c4baab');
  g.fillStyle = r; g.fillRect(0, 0, 1024, 512);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}, []);

const Bottles: React.FC = () => (
  <group>
    {[['#eeeae2', 0.11], ['#e6e1d8', 0.1], ['#1b1d22', 0.12], ['#5f6870', 0.1], ['#2e4a6e', 0.11], ['#d8d4cc', 0.1]].map(([c, h], i) => (
      <mesh key={i} position={[i * 0.085, (h as number) / 2 + 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, h as number, 32]} />
        <meshStandardMaterial color={c as string} roughness={0.25} metalness={0.2} />
      </mesh>
    ))}
  </group>
);

const Room: React.FC = () => {
  const wall = useWallTex();
  const chk = useChecker();
  const floor = useMemo(() => { const t = chk.clone(); t.needsUpdate = true; t.repeat.set(10, 10); return t; }, [chk]);
  return (
    <group>
      <mesh position={[0, 1.6, -0.62]} receiveShadow><planeGeometry args={[6, 3.6]} /><meshStandardMaterial map={wall} roughness={0.95} /></mesh>
      <mesh position={[2.05, 1.6, 0.6]} rotation={[0, -Math.PI / 2, 0]} receiveShadow><planeGeometry args={[2.6, 3.6]} /><meshStandardMaterial color="#cbc1b2" roughness={0.95} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0.6]} receiveShadow><planeGeometry args={[6.4, 6.4]} /><meshStandardMaterial map={floor} roughness={0.35} /></mesh>
      {/* bench */}
      <mesh position={[0.1, 0.24, -0.3]} castShadow receiveShadow><boxGeometry args={[3.2, 0.48, 0.62]} /><meshStandardMaterial color="#1a1f2b" roughness={0.55} /></mesh>
      {/* shelf + bottles */}
      <mesh position={[1.45, 1.72, -0.5]} castShadow receiveShadow><boxGeometry args={[0.9, 0.035, 0.22]} /><meshStandardMaterial color="#6b4a32" roughness={0.6} /></mesh>
      <group position={[1.1, 1.74, -0.5]}><Bottles /></group>
    </group>
  );
};

type Variant = 'P0' | 'P1' | 'P2' | 'P3';
const LEN: Record<Variant, number> = {P0: 182, P1: 138, P2: 139, P3: 86};

const Scene: React.FC<{v: Variant}> = ({v}) => {
  const f = useCurrentFrame();
  const n = LEN[v];
  // phone rises a touch and the thumb scrolls (small phone motion), head follows the phone
  const bob = Math.sin(f / 14) * 0.006;
  const look = {...DANNY, brow: v === 'P3' ? 0.8 : 1.0};
  // cameras
  let pos: V3, at: V3, fov = 38;
  if (v === 'P2') {
    const k = lerp(f, 0, n, 0, 1);
    pos = [-0.2 + k * 0.12, 1.42, 2.3 - k * 0.75]; at = [0.12 + k * 0.05, 1.22 - k * 0.04, -0.1]; fov = 34;
  } else if (v === 'P0') {
    pos = [lerp(f, 0, n, -0.95, -0.7), 1.4, lerp(f, 0, n, 2.75, 2.5)]; at = [lerp(f, 0, n, -0.38, -0.3), 0.98, -0.1];
  } else if (v === 'P1') {
    pos = [lerp(f, 0, n, -0.55, -0.4), 1.42, 3.4]; at = [0.32, 0.95, -0.1];
  } else {
    pos = [lerp(f, 0, n, -0.38, -0.5), 1.4, 3.45]; at = [0.32, 0.95, -0.1];
  }
  return (
    <Stage bg="#cfc6b9" exposure={1.0}>
      <Rig pos={pos} look={at} fov={fov} />
      <hemisphereLight args={['#fff6ea', '#3c3a38', 1.0]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[-1.8, 3.2, 3.4]} intensity={1.9} color="#fff2e2" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004}
        shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-3} shadow-radius={8} />
      <directionalLight position={[2.5, 1.5, 2]} intensity={0.45} color="#dfe8ff" />
      <Room />
      <group position={[0.0, 0.52, -0.25]} rotation={[0, 0.62, 0]}>
        <Toy look={look} pose={{
          seated: true, headYaw: 0.12, headPitch: 0.26 + bob * 2, headRoll: -0.04,
          phone: {p: [0.02, 0.4 + bob, 0.62], r: [-0.55, Math.PI + 0.15, 0.04], s: 1.35},
          restL: {p: [-0.16, 0.108, 0.36], r: [0, 0.15, 0]},
        }} />
      </group>
    </Stage>
  );
};

const KyleCard: React.FC<{from: number}> = ({from}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [from, from + 6], [0, 1], cl); const y = interpolate(f, [from, from + 8], [14, 0], cl);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 1320, top: 360 + y, width: 360, height: 150, borderRadius: 20, background: 'rgba(30,32,38,0.94)', opacity: o,
      boxShadow: '0 12px 40px rgba(0,0,0,0.35)', fontFamily: 'Inter, Arial, sans-serif'}}>
      <div style={{position: 'absolute', left: 24, top: 20, fontSize: 17, color: 'rgba(220,222,228,0.6)', fontWeight: 500}}>Contacts</div>
      <div style={{position: 'absolute', left: 24, top: 44, fontSize: 40, color: '#fff', fontWeight: 700}}>Kyle</div>
      <div style={{position: 'absolute', left: 24, top: 100, fontSize: 17, color: 'rgba(220,222,228,0.6)', fontWeight: 500}}>Call · Message</div>
    </div>
  );
};

export const ShotPhone: React.FC<{v: Variant}> = ({v}) => {
  useFonts();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Scene v={v} />
      <Finish />
      <Hud pulls={v === 'P0' ? (useCurrentFrame() >= 39 ? 1 : 0) : v === 'P3' ? 3 : 4} />
      {v === 'P0' && <>
        <ChapterTitle num="CHAPTER 03" title="THE REVIEWS" from={0} to={63} />
        <ReviewsPhone inAt={3} cards={[{name: 'J.', text: 'Rude. Overpriced. Wouldn\u2019t go back.', at: 37}, {name: 'M.', text: 'Butchered my son\u2019s hair. AVOID.', at: 115}]} />
        <Stamp n="PULL N°1" text="FAKE REVIEWS" from={38} to={108} />
      </>}
      {v === 'P3' && <Caption text="STRANGERS SAY ANYTHING." from={46} to={86} />}
      {v === 'P1' && <><Caption text="HE NEVER FOUND OUT WHO MADE THE CALL." from={2} to={62} /><KyleCard from={86} /></>}
      {v === 'P2' && <><Caption text="HE NEVER ASKED." from={-10} to={46} />
        <Caption text="FRIGHTENED OF WHAT HIS FACE WOULD DO IF THE ANSWER WAS YES." from={48} to={132} color="#f2b336" /></>}
    </AbsoluteFill>
  );
};
