/* Toy character (Danny, Jordan, Kyle, ...) built from primitives in the same style as the original video,
   but with real hands: a phone grip and a resting hand, arms solved with two-bone IK. */
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {Rod, V3} from './kit';
import {RealHand, RELAX} from './realHand';

const v = (a: V3) => new THREE.Vector3(...a);

export type Look = {
  skin: string; hair: string; top: string; legs: string; shoes?: string;
  hairStyle?: 'bowl' | 'beanie' | 'none';
  brow?: number;          // + = angry/inward, - = worried
  mouth?: 'flat' | 'smile' | 'o';
};

/* two-bone IK: elbow position for shoulder S, wrist W, segment lengths, bend hint */
export const solveElbow = (S: V3, W: V3, L1: number, L2: number, hint: V3): V3 => {
  const s = v(S), w = v(W); const d0 = w.clone().sub(s); let d = d0.length();
  const u = d0.clone().normalize(); d = Math.min(d, L1 + L2 - 1e-3);
  const a = (L1 * L1 - L2 * L2 + d * d) / (2 * d); const h = Math.sqrt(Math.max(L1 * L1 - a * a, 0));
  const hv = v(hint); const perp = hv.sub(u.clone().multiplyScalar(hv.dot(u))).normalize();
  return s.add(u.multiplyScalar(a)).add(perp.multiplyScalar(h)).toArray() as V3;
};

const Mat: React.FC<{c: string; r?: number; m?: number; e?: number}> = ({c, r = 0.5, m = 0, e = 0}) =>
  <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ? c : '#000'} emissiveIntensity={e} />;

/* ---------- head ---------- */
export const Head: React.FC<{look: Look; R?: number}> = ({look, R = 0.24}) => {
  const onS = (x: number, y: number, k = 1): V3 => [x, y, Math.sqrt(Math.max(R * R - x * x - y * y, 0)) * k];
  const b = look.brow ?? 0;
  return (
    <group>
      <mesh castShadow receiveShadow><sphereGeometry args={[R, 64, 48]} /><Mat c={look.skin} r={0.45} /></mesh>
      {/* ears */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * R * 0.97, -0.01, -0.02]} scale={[0.42, 1, 0.78]} castShadow><sphereGeometry args={[R * 0.3, 32, 24]} /><Mat c={look.skin} r={0.45} /></mesh>
      ))}
      {/* eyes */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={onS(s * R * 0.34, R * 0.02, 0.97)} scale={[0.82, 1.12, 0.55]}><sphereGeometry args={[R * 0.125, 32, 24]} /><Mat c="#0c0c0e" r={0.12} /></mesh>
      ))}
      {/* brows */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={onS(s * R * 0.36, R * 0.33, 0.985)} rotation={[0, 0, Math.PI / 2 - s * b * 0.35]} castShadow>
          <capsuleGeometry args={[R * 0.055, R * 0.2, 8, 16]} /><Mat c="#2a1d17" r={0.6} />
        </mesh>
      ))}
      {/* nose */}
      <mesh position={onS(0, -R * 0.16, 1.02)} castShadow><sphereGeometry args={[R * 0.16, 32, 24]} /><Mat c={look.skin} r={0.4} /></mesh>
      {/* mouth */}
      {(look.mouth ?? 'flat') === 'flat' && (
        <mesh position={onS(0, -R * 0.5, 0.99)} rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[R * 0.035, R * 0.16, 6, 12]} /><Mat c="#5a2420" r={0.5} /></mesh>
      )}
      {look.mouth === 'smile' && (
        <mesh position={onS(0, -R * 0.42, 0.97)} rotation={[0, 0, Math.PI * 1.15]}><torusGeometry args={[R * 0.16, R * 0.035, 10, 32, Math.PI * 0.7]} /><Mat c="#5a2420" r={0.5} /></mesh>
      )}
      {look.mouth === 'o' && (
        <mesh position={onS(0, -R * 0.48, 0.98)} scale={[1, 1.25, 0.5]}><sphereGeometry args={[R * 0.07, 20, 16]} /><Mat c="#3a1512" r={0.5} /></mesh>
      )}
      {/* hair */}
      {(look.hairStyle ?? 'bowl') === 'bowl' && (
        <mesh position={[0, R * 0.08, -R * 0.03]} rotation={[0.12, 0, 0]} castShadow>
          <sphereGeometry args={[R * 1.075, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.47]} /><Mat c={look.hair} r={0.22} m={0.05} />
        </mesh>
      )}
      {look.hairStyle === 'beanie' && (
        <mesh position={[0, R * 0.05, -R * 0.02]} rotation={[0.1, 0, 0]} castShadow>
          <sphereGeometry args={[R * 1.06, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} /><Mat c={look.hair} r={0.7} />
        </mesh>
      )}
    </group>
  );
};

/* ---------- hands ---------- */
/* right hand holding a phone (phone-local frame: screen faces +Z, long side along Y, width along X).
   Palm cups the right edge and the back, four fingers lie across the back with their tips round the
   left edge, thumb rests on the screen. */
export const PHONE = {w: 0.085, h: 0.17, t: 0.012};
export const Phone: React.FC<{screen?: string; glow?: number}> = ({screen = '#9cc8ff', glow = 0.55}) => {
  const geo = useMemo(() => new RoundedBoxGeometry(PHONE.w, PHONE.h, PHONE.t, 4, 0.01), []);
  return (
    <group>
      <mesh geometry={geo} castShadow><Mat c="#1b1d22" r={0.25} m={0.4} /></mesh>
      <mesh position={[0, 0, PHONE.t / 2 + 0.0006]}><planeGeometry args={[PHONE.w * 0.88, PHONE.h * 0.9]} /><Mat c={screen} r={0.2} e={glow} /></mesh>
    </group>
  );
};

export const PhoneHand: React.FC<{skin: string; side?: 1 | -1}> = ({skin, side = 1}) => {
  const {w, h, t} = PHONE; const fr = 0.0135;
  const m = <Mat c={skin} r={0.45} />;
  const rows = [-0.015, -0.042, -0.068, -0.092];
  const lens = [0.92, 1, 0.96, 0.8];
  return (
    <group scale={[side, 1, 1]}>
      {/* palm: behind the right edge */}
      <mesh position={[w * 0.42, -h * 0.3, -t * 0.5 - 0.016]} scale={[0.05, 0.068, 0.026]} castShadow><sphereGeometry args={[1, 32, 24]} />{m}</mesh>
      {/* fingers across the back, tips curling round the left edge */}
      {rows.map((y, i) => {
        const x0 = w * 0.42, x1 = -w * 0.5 + (1 - lens[i]) * w * 0.6;
        return (
          <group key={i}>
            <Rod a={[x0, y, -t / 2 - fr * 0.95]} b={[x1, y + 0.004, -t / 2 - fr * 0.95]} r0={fr * 1.05} r1={fr} color={skin} rough={0.45} />
            <Rod a={[x1, y + 0.004, -t / 2 - fr * 0.95]} b={[x1 - fr * 0.9, y + 0.006, t * 0.2]} r0={fr} r1={fr * 0.92} color={skin} rough={0.45} />
          </group>
        );
      })}
      {/* thumb on the screen */}
      <Rod a={[w * 0.5 + 0.004, -h * 0.28, t * 0.1]} b={[w * 0.12, -h * 0.08, t / 2 + fr * 0.9]} r0={fr * 1.3} r1={fr * 1.15} color={skin} rough={0.45} />
    </group>
  );
};
/* wrist point of PhoneHand in phone-local space */
export const PHONE_WRIST: V3 = [PHONE.w * 0.55, -PHONE.h * 0.48, -PHONE.t / 2 - 0.02];

/* relaxed hand resting palm-down (local: fingers point +Z, palm faces -Y) */
export const RestHand: React.FC<{skin: string}> = ({skin}) => {
  const fr = 0.0145; const m = <Mat c={skin} r={0.45} />;
  return (
    <group>
      <mesh position={[0, 0.012, 0]} scale={[0.058, 0.03, 0.06]} castShadow><sphereGeometry args={[1, 32, 24]} />{m}</mesh>
      {[-1.5, -0.5, 0.5, 1.5].map((k, i) => (
        <group key={i}>
          <Rod a={[k * fr * 2.05, 0.012, 0.045]} b={[k * fr * 2.15, 0.006, 0.085 - Math.abs(k) * 0.006]} r0={fr} color={skin} rough={0.45} />
          <Rod a={[k * fr * 2.15, 0.006, 0.085 - Math.abs(k) * 0.006]} b={[k * fr * 2.2, -0.02, 0.1 - Math.abs(k) * 0.008]} r0={fr} r1={fr * 0.94} color={skin} rough={0.45} />
        </group>
      ))}
      <Rod a={[-0.045, 0.008, 0.0]} b={[-0.07, 0.0, 0.05]} r0={fr * 1.2} color={skin} rough={0.45} />
    </group>
  );
};

/* ---------- body ---------- */
export type Pose = {
  seated?: boolean;
  headYaw?: number; headPitch?: number; headRoll?: number;
  phone?: {p: V3; r: V3; s?: number};             // phone in the right hand (character-local)
  restL?: {p: V3; r?: V3};                        // left hand resting (character-local wrist target)
  restR?: {p: V3; r?: V3};
};

const SH_L: V3 = [-0.29, 0.54, 0.0], SH_R: V3 = [0.29, 0.54, 0.0];
const L1 = 0.27, L2 = 0.25;

const ArmChain: React.FC<{S: V3; Wr: V3; hint: V3; look: Look}> = ({S, Wr, hint, look}) => {
  const E = solveElbow(S, Wr, L1, L2, hint);
  const w = v(Wr), e = v(E); const cuff = w.clone().add(e.clone().sub(w).normalize().multiplyScalar(0.05)).toArray() as V3;
  return (
    <group>
      <Rod a={S} b={E} r0={0.078} r1={0.07} color={look.top} rough={0.6} />
      <Rod a={E} b={cuff} r0={0.07} r1={0.06} color={look.top} rough={0.6} caps={false} />
      <mesh position={E}><sphereGeometry args={[0.07, 32, 24]} /><Mat c={look.top} r={0.6} /></mesh>
      <Rod a={cuff} b={Wr} r0={0.034} r1={0.031} color={look.skin} rough={0.45} caps={false} />
      <mesh position={cuff}><cylinderGeometry args={[0.035, 0.035, 0.001, 24]} /><Mat c={look.skin} r={0.45} /></mesh>
    </group>
  );
};

export const Toy: React.FC<{look: Look; pose: Pose}> = ({look, pose}) => {
  const torso = useMemo(() => new RoundedBoxGeometry(0.62, 0.66, 0.4, 6, 0.15), []);
  const hips = useMemo(() => new RoundedBoxGeometry(0.56, 0.2, 0.38, 6, 0.09), []);
  const toWorld = (p: V3, r: V3, local: V3, sc = 1): V3 => {
    const o = new THREE.Object3D(); o.position.set(...p); o.rotation.set(...r); o.scale.setScalar(sc); o.updateMatrix();
    return v(local).applyMatrix4(o.matrix).toArray() as V3;
  };
  return (
    <group>
      {/* torso and hips */}
      <mesh geometry={torso} position={[0, 0.3, 0]} castShadow receiveShadow><Mat c={look.top} r={0.62} /></mesh>
      <mesh geometry={hips} position={[0, -0.02, 0]} castShadow receiveShadow><Mat c={look.legs} r={0.7} /></mesh>
      {/* legs */}
      {[-1, 1].map((s) => pose.seated ? (
        <group key={s}>
          <Rod a={[s * 0.14, 0.0, 0.02]} b={[s * 0.15, 0.0, 0.42]} r0={0.1} color={look.legs} rough={0.7} />
          <Rod a={[s * 0.15, 0.0, 0.42]} b={[s * 0.15, -0.42, 0.44]} r0={0.09} color={look.legs} rough={0.7} />
          <mesh position={[s * 0.15, -0.49, 0.5]} scale={[0.09, 0.06, 0.15]} castShadow><sphereGeometry args={[1, 24, 16]} /><Mat c={look.shoes ?? '#f2f2f2'} r={0.4} /></mesh>
        </group>
      ) : (
        <group key={s}>
          <Rod a={[s * 0.14, 0.0, 0]} b={[s * 0.14, -0.62, 0.01]} r0={0.1} r1={0.09} color={look.legs} rough={0.7} />
          <mesh position={[s * 0.14, -0.69, 0.06]} scale={[0.09, 0.06, 0.15]} castShadow><sphereGeometry args={[1, 24, 16]} /><Mat c={look.shoes ?? '#f2f2f2'} r={0.4} /></mesh>
        </group>
      ))}
      {/* head */}
      <group position={[0, 0.87, 0.02]} rotation={[pose.headPitch ?? 0, pose.headYaw ?? 0, pose.headRoll ?? 0]}><Head look={look} /></group>
      {/* shoulders */}
      {[SH_L, SH_R].map((s, i) => <mesh key={i} position={s} castShadow><sphereGeometry args={[0.085, 32, 24]} /><Mat c={look.top} r={0.6} /></mesh>)}
      {/* right arm + phone, held in a real hand: fingers flat on the back, tips round the edge */}
      {pose.phone && (() => {
        const ph = pose.phone; const sc = ph.s ?? 1; const e = new THREE.Euler(...ph.r);
        const dir = (x: V3) => v(x).applyEuler(e).toArray() as V3;
        const ctr = toWorld(ph.p, ph.r, [0, -0.025 * sc, -0.019 * sc], 1);
        return (
          <group>
            <group position={ph.p} rotation={ph.r} scale={sc}><Phone />
              <pointLight position={[0, 0, 0.08]} intensity={0.25} distance={0.9} color="#a8ccff" /></group>
            <RealHand skin={look.skin} scale={1.1} curl={{thumb: 0.1, index: 0.2, middle: 0.22, ring: 0.25, pinky: 0.28}}
              place={{mode: 'grip', center: ctr, axis: dir([0, -1, 0]), up: dir([0, 0, -1]), flat: true}}
              arm={{elbow: [SH_R[0] + 0.12, SH_R[1] - 0.3, SH_R[2] + 0.12], shoulder: SH_R, sleeve: look.top, r: 0.066}} />
          </group>
        );
      })()}
      {pose.restL && (
        <RealHand side="left" skin={look.skin} scale={1.1} curl={RELAX}
          place={{mode: 'grip', center: pose.restL.p, axis: [-1, 0, 0], up: [0, 1, 0.15], flat: true}}
          arm={{elbow: [SH_L[0] - 0.04, SH_L[1] - 0.3, SH_L[2] + 0.05], shoulder: SH_L, sleeve: look.top, r: 0.066}} />
      )}
    </group>
  );
};
